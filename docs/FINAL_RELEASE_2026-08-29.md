# CINEOPS // RESONANCE — final release runbook

Rebuilt on September 8, 2026.

This document is the single operational source of truth for finishing the Agentic Cinema submission. It intentionally contains no credentials, coupon codes, API keys or private runtime tokens.

## Verified project state

Already present in the repository:

- public web experience,
- public GitHub repository,
- MIT license,
- Gemini + Google ADK agent service,
- runtime Parallel Search integration through `parallel-web`,
- six-stage multi-agent workflow,
- Zod validation for the generated dossier,
- Cloud Run deployment helper,
- Secret Manager integration,
- transparent fallback demo mode,
- final Devpost copy,
- final demo script,
- final submission checklist.

## Current blockers

An existing Google AI Studio project and masked Gemini key have been identified without exposing the key. Billing is not yet active/linked for the project, the Parallel key is still pending, and the Cloud Run service has not been deployed. Billing and payment actions remain manual because they change the entrant's financial account state.

The expired optional promotional-credit request is not an eligibility blocker. Once billing and the two credentials are available, the deploy sequence is encoded in `scripts/deploy-cloud-run.sh`.

## Operator sequence

### 1. Billing gate

Attach an active billing method/account to the intended existing Google project. Complete any payment or prepayment step directly in Google; do not share financial details in chat, issues, commits, screenshots or videos.

### 2. Cloud project

Select the existing Google project that will host CINEOPS. Confirm billing is attached and the project ID is correct before deploying.

### 3. Runtime credentials

Confirm the existing Gemini API key is valid for the selected project and create a Parallel API key.

Keep both private.

### 4. Deploy from Google Cloud Shell

```bash
git clone https://github.com/SamySalamy87x/cineops-resonance.git
cd cineops-resonance
bash scripts/deploy-cloud-run.sh YOUR_GOOGLE_CLOUD_PROJECT_ID us-central1
```

The helper will ask for the two API keys without echoing them, generate a private shared secret, store secrets in Secret Manager and deploy the service.

### 5. Verify Cloud Run

The deployment helper prints the service URL and automatically calls `/health`.

Required result:

```json
{
  "ok": true,
  "service": "cineops-agent-service",
  "configured": true
}
```

If `configured` is false, do not proceed to the video.

### 6. Connect the public web experience

The helper writes two private values to:

```text
/tmp/cineops-sites-env.txt
```

Use those values only as private web-runtime configuration:

```text
CINEOPS_AGENT_URL
CINEOPS_AGENT_TOKEN
```

Redeploy the web experience after setting them. Never commit either value.

### 7. End-to-end QA

Run the default TRANSFORMADORES brief.

Pass criteria:

- UI reports `mode: live`,
- all six stages complete,
- `Live Intelligence` has a real runtime latency,
- dossier is generated successfully,
- thesis, visual arc, sonic arc, feasibility and deliverables are populated,
- Parallel source ledger contains usable HTTP/HTTPS sources,
- no credential appears in browser output.

Run a second different brief. The output must materially change. If the dossier is effectively identical, investigate caching or state reuse before recording.

### 8. Evidence validation

Open at least three source URLs and confirm each retrieved excerpt supports the recommendation that cites it. In the official demo, briefly show one evidence reference and its matching public source row so the runtime provenance is observable. Do not show credentials, private browsing data or account information.

### 9. Record the official demo

Use `docs/DEMO_SCRIPT.md`.

Required:

- <= 3:00 total,
- genuine live run,
- English narration or accurate English subtitles,
- hosted product visible,
- button press visible,
- six-stage progress visible,
- generated dossier visible,
- no secrets,
- one concise, readable proof of a dossier reference mapped to its public Parallel source row,

### 10. Upload video

Upload publicly to YouTube or Vimeo. Confirm the link works while signed out.

### 11. Complete Devpost

Paste `docs/DEVPOST_COPY.md` and insert:

- hosted project URL,
- public GitHub URL,
- public video URL.

Select **Parallel** as the partner track.

### 12. Final submit

Official submission deadline: **September 9, 2026 at 2:00 PM PDT / 3:00 PM Mexico City**.

Submit early enough to reopen the entry and verify every URL from a signed-out browser.

## Definition of done

CINEOPS is complete only when all of these are true:

1. The entrant's confirmation that this submission reuses or extends no pre-contest code, assets or implementation is recorded.
2. An eligible Google Cloud account or no-cost trial is active.
3. Cloud Run is deployed.
4. `/health` returns `configured: true`.
5. The public app reports `mode: live`.
6. Two different briefs have passed end-to-end QA.
7. Source grounding has been manually checked.
8. A <=3 minute public demo exists.
9. Devpost has hosted app, repo, video and Parallel track.
10. Submission confirmation has been verified.

Anything before that is release-candidate state, not final submission state.
