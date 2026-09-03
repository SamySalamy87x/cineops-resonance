#!/usr/bin/env bash
set -euo pipefail

cineops_project_id="${1:-$(gcloud config get-value project 2>/dev/null || true)}"
cineops_region="${2:-us-central1}"
cineops_service="cineops-agent-service"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "Run this script from Google Cloud Shell, where gcloud is already installed." >&2
  exit 69
fi

if ! gcloud auth list --filter=status:ACTIVE --format='value(account)' | grep -q .; then
  echo "Sign in to Google Cloud before running this script." >&2
  exit 77
fi

if [[ -z "${cineops_project_id}" || "${cineops_project_id}" == "(unset)" ]]; then
  echo "No Google Cloud project is selected. Projects available to this account:"
  gcloud projects list --format='table(projectId,name,lifecycleState)'
  echo
  read -r -p "Google Cloud project ID to use for CINEOPS: " cineops_project_id
fi

if [[ -z "${cineops_project_id}" ]]; then
  echo "A Google Cloud project ID is required." >&2
  exit 64
fi

if ! gcloud projects describe "${cineops_project_id}" >/dev/null 2>&1; then
  echo "Project '${cineops_project_id}' is not accessible to the active Google account." >&2
  exit 66
fi

read -r -s -p "Google Gemini API key: " cineops_gemini_key
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
  --set-secrets GOOGLE_API_KEY=GEMINI_API_KEY:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,PARALLEL_API_KEY=PARALLEL_API_KEY:latest,CINEOPS_SHARED_SECRET=CINEOPS_SHARED_SECRET:latest \
  --quiet

cineops_service_url="$(gcloud run services describe "${cineops_service}" \
  --project "${cineops_project_id}" \
  --region "${cineops_region}" \
  --format='value(status.url)')"

cineops_handoff_file="/tmp/cineops-sites-env.txt"
cineops_smoke_file="/tmp/cineops-live-smoke.json"
umask 077
printf 'CINEOPS_AGENT_URL=%s\nCINEOPS_AGENT_TOKEN=%s\n' \
  "${cineops_service_url}" \
  "${cineops_shared_secret}" > "${cineops_handoff_file}"

echo
echo "Cloud Run deployment completed."
echo "Service: ${cineops_service_url}"
echo "Health check:"
curl --fail-with-body --silent --show-error "${cineops_service_url}/health"
echo

echo "Running a real Gemini + Parallel end-to-end smoke test..."
curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer ${cineops_shared_secret}" \
  -H 'Content-Type: application/json' \
  --data '{"brief":"Create a four-minute transformation music film in which a rigid inherited system gradually becomes collaborative, human and alive. Ground the creative and production decisions in current evidence and keep the production feasible for a lean crew.","constraints":{"format":"music-film","duration":"4m","scale":"lean"}}' \
  "${cineops_service_url}/pipeline" > "${cineops_smoke_file}"

python3 - "${cineops_smoke_file}" <<'PY'
import json
import sys

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as handle:
    data = json.load(handle)

if data.get("ok") is not True or data.get("mode") != "live":
    raise SystemExit("Smoke test failed: response was not ok/live")

sources = ((data.get("dossier") or {}).get("sources") or [])
stages = data.get("stages") or []
if len(sources) < 1:
    raise SystemExit("Smoke test failed: no Parallel evidence sources returned")
if len(stages) != 6 or any(stage.get("state") != "complete" for stage in stages):
    raise SystemExit("Smoke test failed: six pipeline stages did not complete")

print(f"LIVE VERIFIED: {len(stages)} stages complete, {len(sources)} Parallel sources, model={data.get('model')}")
PY

unset cineops_shared_secret

echo
echo "Private Sites values: ${cineops_handoff_file}"
echo "Private live-run evidence: ${cineops_smoke_file}"
echo "Do not commit, email, or paste the token file into a public chat."
