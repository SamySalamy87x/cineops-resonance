#!/usr/bin/env bash
set -euo pipefail

cineops_project_id="${1:-$(gcloud config get-value project 2>/dev/null || true)}"
cineops_region="${2:-us-central1}"
cineops_service="cineops-agent-service"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "Run this script from Google Cloud Shell, where gcloud is already installed." >&2
  exit 69
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required for the post-deploy live verification." >&2
  exit 69
fi

if [[ -z "${cineops_project_id}" || "${cineops_project_id}" == "(unset)" ]]; then
  echo "Usage: bash scripts/deploy-cloud-run.sh YOUR_GOOGLE_CLOUD_PROJECT_ID [REGION]" >&2
  exit 64
fi

if ! gcloud auth list --filter=status:ACTIVE --format='value(account)' | grep -q .; then
  echo "Sign in to Google Cloud before running this script." >&2
  exit 77
fi

read -r -s -p "Gemini auth API key: " cineops_gemini_key
echo
read -r -s -p "Parallel API key: " cineops_parallel_key
echo

if [[ -z "${cineops_gemini_key}" || -z "${cineops_parallel_key}" ]]; then
  echo "Both API keys are required." >&2
  exit 65
fi

cineops_shared_secret="$(openssl rand -hex 32)"

cineops_upsert_secret() {
  local cineops_secret_name="$1"
  local cineops_secret_value="$2"

  if gcloud secrets describe "${cineops_secret_name}" --project "${cineops_project_id}" >/dev/null 2>&1; then
    printf '%s' "${cineops_secret_value}" | gcloud secrets versions add "${cineops_secret_name}" \
      --project "${cineops_project_id}" \
      --data-file=- \
      --quiet
  else
    printf '%s' "${cineops_secret_value}" | gcloud secrets create "${cineops_secret_name}" \
      --project "${cineops_project_id}" \
      --replication-policy=automatic \
      --data-file=- \
      --quiet
  fi
}

gcloud config set project "${cineops_project_id}" >/dev/null
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  --project "${cineops_project_id}" \
  --quiet

cineops_project_number="$(gcloud projects describe "${cineops_project_id}" --format='value(projectNumber)')"
cineops_runtime_account="${cineops_project_number}-compute@developer.gserviceaccount.com"

gcloud projects add-iam-policy-binding "${cineops_project_id}" \
  --member="serviceAccount:${cineops_runtime_account}" \
  --role="roles/run.builder" \
  --condition=None \
  --quiet >/dev/null

gcloud projects add-iam-policy-binding "${cineops_project_id}" \
  --member="serviceAccount:${cineops_runtime_account}" \
  --role="roles/secretmanager.secretAccessor" \
  --condition=None \
  --quiet >/dev/null

cineops_upsert_secret "GEMINI_API_KEY" "${cineops_gemini_key}"
cineops_upsert_secret "PARALLEL_API_KEY" "${cineops_parallel_key}"
cineops_upsert_secret "CINEOPS_SHARED_SECRET" "${cineops_shared_secret}"

unset cineops_gemini_key cineops_parallel_key

gcloud run deploy "${cineops_service}" \
  --source agent-service \
  --project "${cineops_project_id}" \
  --region "${cineops_region}" \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --concurrency 4 \
  --min-instances 0 \
  --max-instances 1 \
  --timeout 300 \
  --set-env-vars GEMINI_MODEL=gemini-2.5-flash \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest,PARALLEL_API_KEY=PARALLEL_API_KEY:latest,CINEOPS_SHARED_SECRET=CINEOPS_SHARED_SECRET:latest \
  --quiet

cineops_service_url="$(gcloud run services describe "${cineops_service}" \
  --project "${cineops_project_id}" \
  --region "${cineops_region}" \
  --format='value(status.url)')"

cineops_health_file="/tmp/cineops-health.json"
cineops_smoke_file="/tmp/cineops-live-smoke.json"
cineops_handoff_file="/tmp/cineops-sites-env.txt"
umask 077

echo
echo "Cloud Run deployment completed."
echo "Service: ${cineops_service_url}"
echo "Checking service configuration..."
curl --fail-with-body --silent --show-error \
  --max-time 30 \
  "${cineops_service_url}/health" > "${cineops_health_file}"

python3 - "${cineops_health_file}" <<'PY'
import json
import pathlib
import sys

payload = json.loads(pathlib.Path(sys.argv[1]).read_text())
if payload.get("ok") is not True or payload.get("configured") is not True:
    raise SystemExit(f"Health check did not report configured=true: {payload}")
print("Health verified: configured=true")
PY

echo "Running real Gemini + Parallel end-to-end smoke test..."
curl --fail-with-body --silent --show-error \
  --max-time 240 \
  -X POST "${cineops_service_url}/pipeline" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer ${cineops_shared_secret}" \
  --data-binary '{"brief":"A four-minute cinematic piece about people transforming inherited systems into humane, collaborative futures through visible collective action.","constraints":{"format":"music-film","duration":"4m","scale":"lean"}}' \
  > "${cineops_smoke_file}"

python3 - "${cineops_smoke_file}" <<'PY'
import json
import pathlib
import sys

payload = json.loads(pathlib.Path(sys.argv[1]).read_text())
errors = []
if payload.get("ok") is not True:
    errors.append("ok is not true")
if payload.get("mode") != "live":
    errors.append("mode is not live")
stages = payload.get("stages") or []
if len(stages) != 6 or any(stage.get("state") != "complete" for stage in stages):
    errors.append("all six stages are not complete")
sources = ((payload.get("dossier") or {}).get("sources") or [])
if len(sources) < 1:
    errors.append("no Parallel evidence sources were returned")
if errors:
    raise SystemExit("Live smoke test failed: " + "; ".join(errors))
print(
    "Live pipeline verified: mode=live, "
    f"stages={len(stages)}, sources={len(sources)}, "
    f"latencyMs={payload.get('totalLatencyMs')}"
)
PY

printf 'CINEOPS_AGENT_URL=%s\nCINEOPS_AGENT_TOKEN=%s\n' \
  "${cineops_service_url}" \
  "${cineops_shared_secret}" > "${cineops_handoff_file}"
unset cineops_shared_secret

echo
echo "CINEOPS Cloud Run release gate PASSED."
echo "Health evidence: ${cineops_health_file}"
echo "Private live smoke evidence: ${cineops_smoke_file}"
echo "The two private Sites values were written to ${cineops_handoff_file}."
echo "Do not commit, email, screenshot, or paste the handoff file into a public chat."
