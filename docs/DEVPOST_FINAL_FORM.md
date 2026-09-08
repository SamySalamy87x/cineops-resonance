# CINEOPS // RESONANCE — Final Devpost Form

Prepared for **Agentic Cinema: The Blockbuster Hackathon** — Parallel track.

Use only after the public application has been verified in `mode: live` and the public <=3 minute demo video exists.

## Required answers

| Field ID | Field | Answer |
|---:|---|---|
| 27952 | Submitter Type | `Individual` |
| 27953 | Organization name | `N/A` |
| 27954 | Government employee? | `No` |
| 27955 | Country | `Mexico` |
| 27956 | Canada province | `N/A` |
| 27958 | New or existing before July 27, 2026? | `New` — entrant confirmed no pre–July 27 code, assets or implementation were reused or extended. |
| 28213 | Partner track | `Parallel` |
| 28048 | Total team size | `1` |
| 27959 | Open-source repository | `https://github.com/SamySalamy87x/cineops-resonance` |
| 27960 | Hosted project | `https://cineops-resonance.samysalamy.chatgpt.site` |
| 27961 | Google Cloud products used | See text below |
| 27962 | Other tools/products used | See text below |
| 27963 | First time using IBM tools? | `N/A, I am not submitting for the IBM track.` |
| 28099 | First time using Grafana tools? | `N/A, I'm not submitting for the Grafana track.` |
| 28100 | First time using Parallel tools? | `Yes, this is my first time using Parallel tools.` |
| 28102 | First time using ClickHouse tools? | `N/A, I am not submitting to the ClickHouse track.` |
| 28103 | First time using Replit tools? | `N/A, I am not submitting to the Replit track.` |

Required demo video: <https://youtu.be/Mg7WXN9qi54?si=qq4cUgGPljp2aHjN> (entrant-reported duration: 2:52).

## 27961 — What Google Cloud products did you use?

Google Cloud Run hosts the CINEOPS agent runtime. Google Cloud Build and Artifact Registry support source-to-container deployment, while Google Secret Manager stores the Gemini, Parallel and service-authentication credentials server-side. The runtime uses Google Agent Development Kit (ADK) to orchestrate Gemini specialist agents with SequentialAgent and ParallelAgent patterns. The submitted live path is verified by a real end-to-end Cloud Run request that must return mode: live with all six stages complete.

## 27962 — Other tools/products used

Parallel Search API through the official `parallel-web` SDK for live web intelligence and evidence provenance; TypeScript, React, Next.js/Vinext, Zod, Express and Lucide React for the product and runtime layers; GitHub for the public MIT-licensed source repository; and ChatGPT Codex as a development assistant for implementation review, interface work, testing and submission documentation. Codex is not imported, called or used by the submitted application runtime.

## Final release guard

Do not submit until all are true:

- Cloud Run `/health` reports `configured: true`.
- Authenticated smoke test prints `LIVE VERIFIED`.
- Public web experience returns `mode: live` for a real run.
- Parallel evidence is returned at runtime.
- Six pipeline stages complete.
- Video is public, <=3 minutes, English or accurately English-subtitled, and shows the actual functioning agent.
- No credentials or private tokens are visible.
- Entrant originality confirmation is recorded: no pre–July 27 code, assets or implementation were reused or extended.
