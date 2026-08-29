# Devpost submission copy — CINEOPS // RESONANCE

Use this only after a genuine end-to-end `mode: live` run has been verified and the public demo video URL has been added.

## Project name

CINEOPS // RESONANCE

## Tagline

Autonomous creative and production intelligence for film, grounded by live web evidence.

## One-line pitch

CINEOPS turns a director's brief into a traceable, production-ready creative dossier through Gemini specialist agents, Google ADK orchestration and live Parallel Search.

## Inspiration

The most expensive creative mistakes often happen before a camera rolls. A strong idea gets diluted across disconnected research tabs, moodboards, treatments, feasibility notes and AI chats. Independent filmmakers need the rigor of a studio development room without adding weeks of overhead or surrendering authorship.

CINEOPS // RESONANCE was built to preserve the filmmaker's intent while making narrative, visual, sonic and operational decisions clearer, more feasible and grounded in current evidence.

## What it does

A filmmaker enters a production brief and three constraints: format, duration and production scale. CINEOPS then executes a six-stage production-intelligence workflow:

1. **Brief Director** — converts intent into an audience promise, dramatic question and creative non-negotiables.
2. **Live Intelligence** — calls the Parallel Search API at runtime and builds an evidence ledger from current web results.
3. **Narrative Architect** — develops the thesis, escalation and symbolic spine.
4. **Production Planner** — turns the concept into a feasible production system and risk map.
5. **Sonic + Visual Director** — defines camera language, visual motifs, color progression and BPM arc.
6. **Greenlight Synthesis** — reconciles every specialist output into one production-ready dossier.

The result is not a chat transcript. The interface returns a core thesis, visual arc, sonic arc, production feasibility score, concrete deliverables and traceable evidence references from the same live run.

## How we built it

The public experience is a responsive TypeScript and React application. Its same-origin API validates the brief and proxies requests without exposing runtime secrets.

The AI runtime is isolated in a Node.js service for Google Cloud Run. It calls Parallel through the official `parallel-web` SDK and converts the returned evidence into shared state. Gemini specialist agents are orchestrated through Google's Agent Development Kit: `ParallelAgent` runs Narrative, Production and Sonic + Visual specialists concurrently, while `SequentialAgent` guarantees that brief interpretation happens first and Greenlight Synthesis happens only after specialist work is complete.

The final Gemini payload is validated against a Zod schema before the server attaches the original Parallel evidence and returns the dossier. The public UI explicitly distinguishes live mode from its transparent fallback demo state; sample output is never represented as live API work.

## Challenges we ran into

Google ADK expects a full Node server runtime, while the public experience layer is edge-compatible. Loading the ADK runtime directly into that layer would have mixed incompatible execution environments. We separated responsibilities instead: the public worker handles validation and presentation, while Google Cloud Run hosts the ADK, Gemini and Parallel runtime.

The second challenge was provenance. Generative recommendations can sound authoritative even when their evidence is weak. CINEOPS makes the Parallel evidence ledger shared state for the specialist agents, requires evidence references in generated sections and preserves the original runtime sources for verification.

The third challenge was designing a multi-agent workflow that behaves like a production system rather than a collection of personas. We solved that with explicit state contracts, parallel specialist execution and deterministic final synthesis.

## Accomplishments that we're proud of

- A real runtime call to Parallel Search through the official SDK.
- Gemini-only AI execution for the submitted project.
- Deterministic orchestration with Google ADK's sequential and parallel agent patterns.
- A source-grounded dossier rather than an unstructured chat transcript.
- A public product interface that exposes agent progress and production state clearly.
- Server-side secret isolation and a Cloud Run deployment path using Secret Manager.
- A transparent demo fallback that never pretends sample content is live evidence.
- A public, licensed repository containing the web experience, agent service, deployment helper and judging documentation.

## What we learned

Multi-agent systems become useful when their contracts are visible. The important design decision was not adding more personas; it was defining what state each specialist receives, what it must return and when synthesis is allowed to begin.

We also learned that research provenance should be a product primitive. Traceability changes how filmmakers evaluate creative recommendations and makes the output easier to challenge, refine and trust.

## What's next

- Persistent productions and versioned dossiers.
- Treatment, shot architecture and production-packet exports.
- Source-level approval and rejection controls.
- Budget, scheduling and location-planning connectors that preserve the Google-only AI runtime constraint.
- Longer-running managed agent workflows for production development.

## Built with

Google Agent Development Kit, Gemini, Google Gen AI SDK, Google Cloud Run, Google Secret Manager, Parallel Search API, `parallel-web`, TypeScript, React, Vinext, Zod and Lucide React.

## Partner track

**Parallel**

## Links

- Hosted project: <https://cineops-resonance.samysalamy.chatgpt.site>
- Source repository: <https://github.com/SamySalamy87x/cineops-resonance>
- Demo video: `PENDING_PUBLIC_VIDEO_URL`

## Suggested tags

`gemini` `google-adk` `google-cloud` `parallel-search` `multi-agent` `filmmaking` `media-entertainment`

## Final publish guard

Before pasting this into Devpost, verify all of the following:

- the hosted interface reports `mode: live`,
- Parallel is called at runtime,
- the video is under three minutes and public,
- the video is English or accurately subtitled in English,
- no secrets or real third-party source metadata appear in published video/screenshots,
- repository and hosted-project URLs resolve while signed out,
- the Parallel track is selected,
- the submission is completed before September 9, 2026 at 2:00 PM PDT / 3:00 PM Mexico City.
