# Title

CINEOPS // RESONANCE

## One-line Summary

CINEOPS turns a director's brief into a traceable, production-ready creative dossier through Gemini specialist agents, Google ADK orchestration and live Parallel Search.

## Problem

The most expensive creative mistakes often happen before a camera rolls. Independent filmmakers begin with one strong intention, then lose clarity across research tabs, moodboards, treatments, feasibility notes and disconnected AI chats. The result is creative drift: narrative, production, visual and sonic decisions stop serving the same film.

## Solution

CINEOPS // RESONANCE is a six-stage production-intelligence room. A filmmaker enters a brief plus format, duration and scale. Parallel Search gathers live web evidence. Gemini agents, orchestrated with Google ADK, interpret the brief, develop story, production and audiovisual systems concurrently, and reconcile them into one greenlight dossier.

The output is not a transcript. It is a decision surface containing a thesis, visual arc, BPM progression, feasibility score, deliverables and a source ledger. Each creative section names its supporting source IDs, and the server rejects any generated citation that does not exist in the same runtime evidence ledger.

## Why This Matters

Small film teams rarely have a full studio development department, but they still pay the cost of weak pre-production decisions. CINEOPS gives one filmmaker a rigorous, challengeable development workflow without replacing authorship. It makes research provenance visible, forces creative choices to respect real constraints and turns an abstract idea into a plan the filmmaker can test before production spending begins.

## How We Used AI

The running product uses only permitted Google and partner AI tooling:

- Gemini powers the Brief Director, Narrative Architect, Production Planner, Sonic + Visual Director and Greenlight Synthesis roles.
- Google Agent Development Kit provides the agent contracts and orchestration. `ParallelAgent` runs the three specialist disciplines concurrently; `SequentialAgent` ensures brief interpretation happens first and greenlight synthesis happens last.
- Parallel Search API is called at runtime through the official `parallel-web` SDK. Its results become a shared, explicitly untrusted evidence ledger for the specialist agents.
- Zod validates the final Gemini structure, and a deterministic server check validates every evidence reference against the IDs returned by Parallel.

No OpenAI, Anthropic, AWS or Microsoft model/API is imported or called by the submitted application runtime.

## How We Used Codex

ChatGPT Codex served as a development assistant outside the running product. It helped audit the official requirements, review the existing architecture, harden the evidence boundary, rebuild the visual experience, run local verification and prepare the release documentation. It is not an application dependency and never receives or processes a filmmaker's production brief at runtime.

During the compliance review, Codex surfaced the rule prohibiting non-Google AI tooling in the project. Two temporary non-Google image-generation drafts were discarded before source synchronization and are absent from the repository and deployed product; the final interface uses original procedural visual layers instead.

## Key Features

- Six visible production-intelligence stages with live status and latency.
- Runtime Parallel Search with excerpts, URLs, dates and stable source IDs.
- Concurrent narrative, production and sonic/visual specialists through Google ADK.
- One structured greenlight dossier instead of an unstructured chat response.
- Post-generation evidence integrity validation that rejects invented source IDs.
- Explicit prompt-injection boundary for untrusted web excerpts.
- Server-side secret isolation, authenticated web-to-agent requests and no-store responses.
- Transparent demo fallback that never labels sample content as live.
- Responsive cinematic interface with reduced-motion support and readable production controls.

## Architecture

1. The public React/Vinext experience validates the brief and sends it to a same-origin route.
2. The route authenticates to a Node/Express service on Google Cloud Run without exposing secrets to the browser.
3. Cloud Run calls Parallel Search and normalizes usable HTTP/HTTPS evidence.
4. The evidence ledger enters Google ADK shared state as JSON marked `UNTRUSTED_WEB_EVIDENCE_DATA_ONLY`.
5. Gemini specialists run through a sequential/parallel agent tree.
6. The final structured dossier passes schema and evidence-ID validation.
7. The web experience renders the dossier and original Parallel source ledger, labeling the response `LIVE VERIFIED` only on the real service path.

## Testing Instructions

### Public experience

1. Open the public demo URL below.
2. Scroll to **Director's room** and edit the sample production intent if desired.
3. Select format, duration and production scale.
4. Press **LAUNCH INTELLIGENCE RUN**.
5. For the current pre-deployment build, verify that the result is explicitly labeled **DEMO PREVIEW** / **DEMO DATA** and never presented as a live API call.

### Local source verification

```bash
npm ci
npm run lint
npm run build
node --test tests/rendered-html.test.mjs
npm --prefix agent-service ci
npm --prefix agent-service run typecheck
npm --prefix agent-service run build
bash -n scripts/deploy-cloud-run.sh
```

### Live judging path — required before final entry

1. Deploy with `bash scripts/deploy-cloud-run.sh YOUR_GOOGLE_CLOUD_PROJECT_ID us-central1`.
2. Confirm `/health` returns `configured: true` and names Google ADK, Gemini and Parallel Search.
3. Configure the public web runtime with the private Cloud Run URL/token and redeploy.
4. Run the default brief and confirm **LIVE VERIFIED**, six complete stages and live Parallel sources.
5. Run a materially different brief and confirm that the creative and production outputs change.
6. Open at least three source URLs and verify that their excerpts support the cited recommendation.

## Public Demo Link

<https://cineops-resonance.samysalamy.chatgpt.site>

Status on September 8, 2026: public, but the hosted agent runtime is still in clearly labeled demo mode. Live Cloud Run configuration remains a release gate.

## Public Repository Link

<https://github.com/SamySalamy87x/cineops-resonance>

The repository is public and includes the MIT license, application source, agent-service source, deployment helper, tests and judging documentation.

## Demo Video

`PENDING_PUBLIC_YOUTUBE_OR_VIMEO_URL`

Required format: a functioning-product demo no longer than three minutes, publicly visible, in English or accurately subtitled in English.

## Screenshot Shot List

1. Cinematic hero with the Gemini → Parallel → ADK architecture card and runtime status.
2. Director's room showing the editable brief and real production constraints.
3. Live pipeline with all six stages completed and **LIVE VERIFIED** visible.
4. Greenlight dossier showing thesis, visual arc, BPM arc and feasibility.
5. One dossier evidence ID beside its matching source row in the Parallel evidence ledger.

Final screenshots are pending the live Cloud Run deployment; do not capture the current demo state as proof of runtime integration.

## Submission Readiness Notes

- Ready: entrant registered for Agentic Cinema.
- Ready: official rules acknowledged.
- Ready: originality confirmed — no pre–July 27 code, assets or implementation were reused or extended.
- Ready: individual entrant, one-person team, Mexico, not a government employee.
- Ready: Parallel track and first-time Parallel-user answer confirmed.
- Ready: public hosted experience, public repository and MIT license.
- Ready: runtime source imports and calls Google ADK, Gemini and Parallel.
- Pending: activate/link Google billing for the existing project.
- Pending: create and securely store the Parallel API key.
- Pending: deploy and verify Cloud Run, then connect the public Site.
- Pending: record and publish the <=3 minute live demo.
- Pending: capture the final live screenshots and add the public video URL.
- Deadline: September 9, 2026 at 2:00 PM PDT / 3:00 PM Mexico City (`2026-09-09T21:00:00Z`).

## Known Limitations

- The currently hosted build uses a transparent sample dossier until Cloud Run configuration is complete.
- Dossiers are not yet persisted between browser sessions.
- Exportable treatments, schedules and shot lists are planned but not in this build.
- Evidence quality still depends on available public sources; the product exposes provenance so the filmmaker can challenge weak inputs.

## TODO Official Form Fields

| Field ID | Official field | Draft answer |
|---:|---|---|
| 27952 | Submitter Type | `Individual` |
| 27953 | Organization name | `N/A` |
| 27954 | Government employee? | `No` |
| 27955 | Country of Residence | `Mexico` |
| 27956 | Canadian province | `N/A` |
| 27958 | New or existing before July 27, 2026? | `New` |
| 28213 | Partner track | `Parallel` |
| 28048 | Total team size | `1` |
| 27959 | Open-source repository | `https://github.com/SamySalamy87x/cineops-resonance` |
| 27960 | Hosted project | `https://cineops-resonance.samysalamy.chatgpt.site` |
| 27961 | Google Cloud products | Cloud Run, Cloud Build, Artifact Registry, Secret Manager, Google ADK, Gemini / Google Gen AI SDK. Paste only after the live deployment verifies these claims. |
| 27962 | Other products | Parallel Search API / `parallel-web`, TypeScript, React, Vinext, Zod, Express, Lucide React, GitHub, Devpost and ChatGPT Codex as a non-runtime development assistant. |
| 27963 | First time using IBM? | `N/A, I am not submitting for the IBM track.` |
| 28099 | First time using Grafana? | `N/A, I'm not submitting for the Grafana track.` |
| 28100 | First time using Parallel? | `Yes, this is my first time using Parallel tools.` |
| 28102 | First time using ClickHouse? | `N/A, I am not submitting to the ClickHouse track.` |
| 28103 | First time using Replit? | `N/A, I am not submitting to the Replit track.` |

Global required video field: `PENDING_PUBLIC_YOUTUBE_OR_VIMEO_URL`.
