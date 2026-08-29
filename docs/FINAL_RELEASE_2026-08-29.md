# CINEOPS // RESONANCE — final release runbook

Rebuilt on August 29, 2026.

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

## Current blocker

The remaining infrastructure work requires an authenticated Google Cloud billing/project session. The approved promotional credit must first be redeemed into the intended billing account. That operation is intentionally manual because it changes account billing state.

After redemption, the remaining deploy sequence is already encoded in `scripts/deploy-cloud-run.sh`.

## Operator sequence

### 1. Billing gate

Redeem the approved promotional Google Cloud credit in the intended billing account before the promotional redemption deadline.

Do not paste the coupon code into issues, commits, screenshots, videos, chat transcripts or public documents.

### 2. Cloud project

Create or select the Google Cloud project that will host CINEOPS. Confirm billing is attached.

### 3. Runtime credentials

Create:

- a current Gemini API key,
- a Parallel API key.

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

Privately open at least three source URLs and confirm the retrieved excerpt supports the recommendation that cites it.

Do not publish real third-party source names, titles or URLs in the official video/screenshots. The live hosted app may show them during judging; the published media should avoid exposing them.

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
- no real third-party Parallel source metadata in published frames.

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

1. Google Cloud credit is redeemed.
2. Cloud Run is deployed.
3. `/health` returns `configured: true`.
4. The public app reports `mode: live`.
5. Two different briefs have passed end-to-end QA.
6. Source grounding has been manually checked.
7. A <=3 minute public demo exists.
8. Devpost has hosted app, repo, video and Parallel track.
9. Submission confirmation has been verified.

Anything before that is release-candidate state, not final submission state.
