# Agentic Cinema final submission checklist

Last rebuilt: September 2, 2026.

## Current official gates

- [x] Project was created during the contest period.
- [x] Mexico is an eligible jurisdiction.
- [x] Devpost registration is confirmed.
- [x] Public hosted project URL exists.
- [x] Public GitHub repository exists.
- [x] MIT license exists at repository root.
- [x] Runtime code uses Gemini through Google ADK.
- [x] Runtime code imports and calls Parallel Search through the official `parallel-web` SDK.
- [x] Project targets the Parallel partner track.
- [x] Google Cloud access does **not** depend on the expired promotional-credit request: official rules allow either a no-cost Google Cloud trial or an existing Google Cloud account. The optional $100 promo-credit request deadline was August 31.
- [ ] Cloud Run agent service is deployed with Gemini, Parallel and shared-secret configuration stored server-side.
- [ ] `GET /health` returns `configured: true`.
- [ ] Web runtime points to the Cloud Run service and returns `mode: live`.
- [ ] At least one end-to-end live run is captured as evidence.
- [ ] Public demo video is no longer than three minutes.
- [ ] Demo is in English or has accurate English subtitles.
- [ ] Published demo/screenshots do not expose sensitive credentials or private data.
- [ ] Devpost written submission is complete in English.
- [ ] Hosted project, repository and video URLs are inserted in Devpost.
- [ ] Parallel track is selected in Devpost.
- [ ] Final submission is completed before **September 9, 2026 at 2:00 PM PDT / 3:00 PM Mexico City**.

## Cloud access clarification

The August 31 deadline applied to the optional request for $100 in Google Cloud promotional credits. It was **not** a requirement to remain eligible. Official rules allow Google Cloud access through either:

1. a no-cost Google Cloud trial, or
2. an existing Google Cloud account.

Therefore the active blocker is not the promotional credit. The active blocker is obtaining working Google Cloud credentials/billing access and deploying the Cloud Run service so the submitted project can demonstrate a real runtime call.

## Final release sequence

1. Sign into the intended Google Cloud account (no-cost trial or existing account).
2. Create or select the Google Cloud project to host CINEOPS.
3. Create a current Gemini API key and a Parallel API key.
4. Open Google Cloud Shell and clone this repository.
5. Run:

   ```bash
   bash scripts/deploy-cloud-run.sh YOUR_GOOGLE_CLOUD_PROJECT_ID us-central1
   ```

6. The helper must:
   - enable Cloud Run, Cloud Build, Artifact Registry and Secret Manager,
   - store the Gemini key, Parallel key and generated shared secret in Secret Manager,
   - deploy `agent-service/`,
   - cap the service at one instance,
   - verify `/health`,
   - write the private web-runtime handoff values to `/tmp/cineops-sites-env.txt`.
7. Confirm `/health` reports `configured: true`.
8. Configure the web runtime with the two private values from `/tmp/cineops-sites-env.txt`:
   - `CINEOPS_AGENT_URL`
   - `CINEOPS_AGENT_TOKEN`
9. Redeploy the web experience.
10. Run the TRANSFORMADORES brief and confirm the interface reports `mode: live`.
11. Run a second materially different brief and confirm narrative, production and sonic/visual outputs change.
12. Verify at least three Parallel source URLs resolve and support the returned recommendations privately during QA.
13. Confirm no API key, bearer token, shared secret or billing detail appears in browser output, repository history, screenshots or video.
14. Record the <=3 minute demo using `docs/DEMO_SCRIPT.md`.
15. Upload the demo publicly to YouTube or Vimeo.
16. Insert the hosted-project URL, public repository URL and video URL into Devpost.
17. Paste the final English copy from `docs/DEVPOST_COPY.md`.
18. Select the Parallel track.
19. Submit before the official deadline and verify the Devpost confirmation page.

## Required final links

- Hosted project: <https://cineops-resonance.samysalamy.chatgpt.site>
- Source repository: <https://github.com/SamySalamy87x/cineops-resonance>
- Demo video: `PENDING_PUBLIC_VIDEO_URL`
- Contest page: <https://agentic-cinema.devpost.com/>
- Official rules: <https://agentic-cinema.devpost.com/rules>
- Parallel resources: <https://agentic-cinema.devpost.com/details/parallel-resources>

## Evidence to capture before submission

- `mode: live` visible in the UI.
- Request timestamp and total runtime.
- `Live Intelligence` completing from a real Parallel API call.
- Six completed pipeline stages.
- A production dossier containing thesis, visual arc, sonic arc, production control and deliverables.
- A second run proving outputs respond to a changed brief.
- At least three source URLs validated privately during QA.
- No secrets visible anywhere in the published evidence.

## Stage-one rejection guard

Do not submit while any of these remain true:

- The hosted experience is only in demo mode.
- The repository names Google/Parallel but does not actually call them at runtime.
- The demo is over three minutes.
- The demo does not show the agent functioning end-to-end.
- The repository is private or lacks a visible open-source license.
- The Devpost entry is missing any required URL or the Parallel track selection.
