# Agentic Cinema submission checklist

Last verified: August 10, 2026.

## Official constraints

- [x] New project created during the July 27–September 7, 2026 contest period.
- [x] Mexico is an eligible jurisdiction under the [official rules](https://agentic-cinema.devpost.com/rules).
- [x] Web application is an accepted submission format.
- [x] Google-only AI stack: Gemini and Google ADK.
- [x] Parallel Search uses the official `parallel-web` SDK and is called at runtime.
- [x] No OpenAI, Anthropic, AWS or Microsoft AI is imported by the project.
- [x] Hosted experience URL exists.
- [x] Hosted experience access is public for judging.
- [x] Open-source license exists at the repository root.
- [ ] Cloud Run agent service is deployed with Gemini and Parallel secrets.
- [ ] Web runtime points to the deployed agent service and returns `mode: live`.
- [x] Public GitHub repository contains all source code and setup instructions.
- [ ] Public YouTube or Vimeo demo is no longer than three minutes.
- [ ] Demo narration is in English, or accurate English subtitles are present.
- [ ] Devpost written submission is in English.
- [ ] Final submission is completed before September 7, 2026 at 2:00 PM PDT (3:00 PM Mexico City).

## Release sequence

1. Create or select the Google Cloud project for the hackathon.
2. Enable Cloud Run, Cloud Build, Artifact Registry and Secret Manager.
3. Add `GEMINI_API_KEY`, `PARALLEL_API_KEY` and a random `CINEOPS_SHARED_SECRET` to Secret Manager.
4. Deploy `agent-service/` to Cloud Run.
5. Verify `GET /health` reports `configured: true`.
6. Add the Cloud Run URL and matching token to the web runtime as `CINEOPS_AGENT_URL` and `CINEOPS_AGENT_TOKEN`.
7. Run the TRANSFORMADORES brief and verify the UI reports a live dossier.
8. Inspect every returned source link and confirm the excerpt supports its recommendation.
9. Publish the repository to GitHub and verify it is public in a signed-out window.
10. Record the demo using [DEMO_SCRIPT.md](DEMO_SCRIPT.md); upload it publicly.
11. Add the hosted experience, GitHub and video links to Devpost.
12. Submit and verify the confirmation page before the deadline.

## Links required in the final Devpost entry

- Hosted project: <https://cineops-resonance.samysalamy.chatgpt.site>
- Source repository: <https://github.com/SamySalamy87x/cineops-resonance>
- Demo video: `PENDING_PUBLIC_VIDEO_URL`
- Contest page: <https://agentic-cinema.devpost.com/>
- Parallel track requirements: <https://agentic-cinema.devpost.com/details/parallel-resources>
- Official rules: <https://agentic-cinema.devpost.com/rules>
- General resources: <https://agentic-cinema.devpost.com/resources>

## Final live-run evidence to capture

- The request timestamp and total runtime.
- The `Live Intelligence` stage completing from a real Parallel API response.
- At least three source URLs opening successfully.
- The narrative, production and sonic/visual outputs changing when the brief changes.
- No API keys, bearer tokens or secret values visible in the browser, repository, video or console.
