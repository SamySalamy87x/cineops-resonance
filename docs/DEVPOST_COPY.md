# Devpost submission copy

Replace the remaining video URL and confirm a genuine live-mode run before publishing.

## Project name

CINEOPS // RESONANCE

## Tagline

Autonomous creative and production intelligence for film, grounded by live web evidence.

## One-line pitch

CINEOPS turns a director's brief into a traceable, production-ready creative dossier through Gemini specialist agents, Google ADK orchestration and live Parallel Search.

## Inspiration

The most expensive creative mistakes often happen before a camera rolls. A strong idea gets diluted across scattered research, moodboards, treatments, budget conversations and disconnected AI chats. Independent filmmakers need the rigor of a studio development team without losing authorship or adding weeks of overhead.

We built CINEOPS // RESONANCE to preserve the filmmaker's intent while making every downstream decision—narrative, visual, sonic and operational—clearer, more feasible and grounded in evidence.

## What it does

A filmmaker enters a brief and three constraints: format, duration and production scale. CINEOPS then executes a six-stage production-intelligence workflow:

1. The Brief Director converts intent into an audience promise, dramatic question and creative non-negotiables.
2. Live Intelligence calls the Parallel Search API at runtime and creates a ledger of current excerpts and URLs.
3. The Narrative Architect develops the thesis, escalation and symbolic spine.
4. The Production Planner converts the concept into a feasible shoot system and risk map.
5. The Sonic + Visual Director designs one coherent camera, color, motif and BPM progression.
6. Greenlight Synthesis reconciles every specialist output into a single production dossier.

The result is not a chat transcript. It is an actionable interface with a core thesis, visual arc, sonic arc, feasibility score, deliverables and a traceable evidence ledger.

## How we built it

The public experience is a responsive TypeScript and React application. Its same-origin API validates the brief and proxies requests without exposing secrets.

The AI runtime is a separate Node.js service designed for Google Cloud Run. It calls Parallel through the official `parallel-web` SDK, turns search results into shared evidence state, and runs Gemini agents through Google's Agent Development Kit. ADK's `ParallelAgent` executes Narrative, Production and Sonic + Visual specialists concurrently. A `SequentialAgent` enforces the contract that brief interpretation happens first and Greenlight Synthesis happens only after all specialist work is complete.

The final Gemini response is validated against a Zod schema before the server attaches the original Parallel URLs and returns the dossier. If the Cloud Run endpoint is absent, the product explicitly switches to labeled demo mode; sample output is never represented as live evidence.

## Challenges we ran into

Google ADK is designed for a full Node server runtime, while the experience layer runs in an edge-compatible worker. Loading ADK directly into that worker triggered a runtime security restriction. We solved this by separating responsibilities: the web worker remains a fast validation and presentation layer, while the ADK runtime moves to Google Cloud Run where its Node dependencies execute natively.

The second challenge was provenance. Generative output can sound authoritative even when its evidence is weak. We made the Parallel result ledger the shared state for all specialists, required source IDs in each recommendation and attached the original URLs after schema validation.

## Accomplishments that we're proud of

- A true runtime Parallel Search integration rather than a documentation-only mention.
- Deterministic sequential and parallel orchestration with Google ADK.
- A cinematic command interface that makes agent state legible instead of hiding it in a chat window.
- A transparent demo fallback that clearly distinguishes sample output from live API work.
- One codebase containing the public experience, Cloud Run service, Docker build and reproducible setup instructions.

## What we learned

Multi-agent systems become useful when their contracts are visible. The important design work was not adding more personas; it was deciding what state each specialist receives, what it must return and when synthesis is allowed to begin.

We also learned that research provenance should be an interface primitive. Source traceability changes how filmmakers evaluate recommendations and makes the system easier to challenge, refine and trust.

## What's next

- Add persistent projects and versioned dossiers.
- Export treatments, shot architecture and production packets.
- Add source-level approval so filmmakers can include or reject individual evidence signals.
- Extend the production planner with location, schedule and budget connectors that do not introduce another AI provider.
- Deploy the ADK workflow to a managed agent runtime for longer-running productions.

## Built with

Google Agent Development Kit, Gemini, Google Gen AI SDK, Google Cloud Run, Parallel Search API, `parallel-web`, TypeScript, React, Vinext, Zod, Lucide React.

## Links

- Try it: <https://cineops-resonance.samysalamy.chatgpt.site>
- Source: <https://github.com/SamySalamy87x/cineops-resonance>
- Video: `PENDING_PUBLIC_VIDEO_URL`

## Suggested tags

`gemini` `google-adk` `parallel-search` `multi-agent` `filmmaking` `creative-tools` `media-entertainment`
