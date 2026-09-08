"use client";

import {
  Activity,
  Aperture,
  ArrowDown,
  ArrowUpRight,
  Check,
  CircleStop,
  ExternalLink,
  Film,
  Gauge,
  Layers3,
  Music2,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  demoDossier,
  type CineopsDossier,
  type PipelineResponse,
  type ProductionConstraints,
} from "../lib/contracts";

type StageState = "complete" | "active" | "queued";

type Stage = {
  name: string;
  detail: string;
  state: StageState;
  latency: string;
};

const baseStages: Stage[] = [
  { name: "Brief Director", detail: "Intent, audience and dramatic constraint", state: "queued", latency: "—" },
  { name: "Live Intelligence", detail: "Parallel Search API · current web evidence", state: "queued", latency: "—" },
  { name: "Narrative Architect", detail: "Word DNA, tension curve and symbolic spine", state: "queued", latency: "—" },
  { name: "Production Planner", detail: "Shoot logic, assets, risk and feasibility", state: "queued", latency: "—" },
  { name: "Sonic + Visual Director", detail: "BPM, palette, lens language and sound arc", state: "queued", latency: "—" },
  { name: "Greenlight Synthesis", detail: "Grounded dossier with source traceability", state: "queued", latency: "—" },
];

function StageIndicator({ state }: { state: StageState }) {
  if (state === "complete") {
    return <span className="stage-indicator complete" aria-label="Complete"><Check size={14} strokeWidth={2.4} /></span>;
  }
  if (state === "active") return <span className="stage-indicator active" aria-label="Running" />;
  return <span className="stage-indicator queued" aria-label="Queued" />;
}

function EvidenceRefs({ ids }: { ids: string[] }) {
  return (
    <div className="evidence-refs" aria-label="Supporting evidence references">
      <span>Grounded by</span>
      {ids.map((id) => <strong key={id}>{id}</strong>)}
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<"dossier" | "sources" | "deliverables">("dossier");
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [mode, setMode] = useState<PipelineResponse["mode"] | null>(null);
  const [dossier, setDossier] = useState<CineopsDossier>(demoDossier);
  const [pipelineResult, setPipelineResult] = useState<PipelineResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [constraints, setConstraints] = useState<ProductionConstraints>({ format: "music-film", duration: "4m", scale: "lean" });
  const [brief, setBrief] = useState(
    "A four-minute audiovisual piece about people who stop inheriting fear and begin transforming the systems around them. Intimate first, expansive at the end.",
  );

  const stages = useMemo(() => {
    if (complete && pipelineResult) {
      return baseStages.map((stage, index) => {
        const runtimeStage = pipelineResult.stages[index];
        return {
          ...stage,
          state: "complete" as const,
          latency: pipelineResult.mode === "demo" ? "PREVIEW" : runtimeStage?.latencyMs ? `${(runtimeStage.latencyMs / 1000).toFixed(1)}s` : "DONE",
        };
      });
    }
    if (running) {
      return baseStages.map((stage, index) => ({
        ...stage,
        state: index < activeStage ? "complete" as const : index === activeStage ? "active" as const : "queued" as const,
        latency: index < activeStage ? "DONE" : index === activeStage ? "LIVE" : "WAIT",
      }));
    }
    return baseStages;
  }, [activeStage, complete, pipelineResult, running]);

  async function runPipeline() {
    if (running) return;
    setComplete(false);
    setRunning(true);
    setMode(null);
    setError(null);
    setActiveStage(0);

    const progressTimer = window.setInterval(() => setActiveStage((current) => Math.min(current + 1, 5)), 1500);
    try {
      const [response] = await Promise.all([
        fetch("/api/pipeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brief, constraints }),
        }),
        new Promise((resolve) => window.setTimeout(resolve, 1200)),
      ]);
      const payload = (await response.json()) as PipelineResponse;
      if (!response.ok || !payload.ok) throw new Error(payload.error || "The agent pipeline could not complete.");

      setDossier(payload.dossier);
      setPipelineResult(payload);
      setMode(payload.mode);
      setActiveStage(5);
      setComplete(true);
      setTab("dossier");
    } catch (pipelineError) {
      setError(pipelineError instanceof Error ? pipelineError.message : "The agent pipeline could not complete.");
    } finally {
      window.clearInterval(progressTimer);
      setRunning(false);
    }
  }

  function resetPipeline() {
    setRunning(false);
    setComplete(false);
    setActiveStage(0);
    setMode(null);
    setError(null);
    setPipelineResult(null);
    setDossier(demoDossier);
    setTab("dossier");
  }

  const runtimeStatus = error ? "ATTENTION" : running ? "PROCESSING" : mode === "live" ? "LIVE VERIFIED" : mode === "demo" ? "DEMO PREVIEW" : "READY";

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="CINEOPS home">
          <span className="brand-mark"><Aperture size={20} /></span>
          <span className="brand-lockup"><strong>CINEOPS</strong><span>RESONANCE</span></span>
        </a>
        <nav className="topbar-nav" aria-label="Primary navigation">
          <a href="#workspace">Director&apos;s room</a>
          <a href="#evidence-engine">Evidence engine</a>
          <a href="#dossier">Dossier</a>
        </nav>
        <div className="topbar-actions">
          <div className="runtime-chip" aria-label={`Runtime status: ${runtimeStatus}`}>
            <span className={`signal-dot ${mode === "demo" ? "demo" : error ? "error" : ""}`} />
            <span>{runtimeStatus}</span>
          </div>
          <button className="icon-button" type="button" onClick={resetPipeline} aria-label="Reset session"><RotateCcw size={17} /></button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true">
          <div className="stage-art">
            <div className="stage-grid" />
            <div className="stage-frame frame-one"><i /><i /><i /></div>
            <div className="stage-frame frame-two"><i /><i /></div>
            <div className="stage-frame frame-three"><i /><i /><i /></div>
            <div className="stage-orbit orbit-one" />
            <div className="stage-orbit orbit-two" />
            <div className="stage-core"><span /><span /><span /></div>
            <div className="stage-horizon" />
          </div>
          <div className="hero-scan" />
          <div className="hero-vignette" />
        </div>
        <div className="hero-copy">
          <div className="eyebrow"><span>01</span> AUTONOMOUS CREATIVE INTELLIGENCE</div>
          <h1>Turn creative chaos into a production-ready signal.</h1>
          <p className="hero-lede">
            A Gemini-powered agent studio that turns a director&apos;s intent into one grounded,
            shootable dossier — with live web intelligence from Parallel behind every decision.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#workspace">Enter the director&apos;s room <ArrowDown size={18} /></a>
            <a className="text-link" href="#evidence-engine">See how it thinks <ArrowUpRight size={17} /></a>
          </div>
          <div className="hero-metrics" aria-label="System metrics">
            <div><strong>06</strong><span>specialist stages</span></div>
            <div><strong>01</strong><span>coherent greenlight</span></div>
            <div><strong>100%</strong><span>traceable sources</span></div>
          </div>
        </div>

        <aside className="system-card">
          <div className="system-card-header">
            <div><span className="micro-label">LIVE ARCHITECTURE</span><h2>One creative nervous system</h2></div>
            <Activity size={22} />
          </div>
          <div className="topology">
            <div className="topology-node primary"><Sparkles size={17} /><span>GEMINI</span></div>
            <div className="topology-line" />
            <div className="topology-node"><Search size={16} /><span>PARALLEL</span></div>
            <div className="topology-line" />
            <div className="topology-node"><Layers3 size={16} /><span>ADK</span></div>
          </div>
          <div className="system-foot"><span><ShieldCheck size={15} /> Server-side credentials</span><span>BUILD 0908</span></div>
        </aside>
      </section>

      <div className="process-rail" aria-label="Six-stage workflow">
        <div>
          {baseStages.map((stage, index) => (
            <span key={stage.name}><i>{String(index + 1).padStart(2, "0")}</i>{stage.name}</span>
          ))}
        </div>
      </div>

      <section className="workspace-section" id="workspace">
        <div className="section-intro">
          <div><span className="section-index">02 / DIRECTOR&apos;S ROOM</span><h2>Give the system an intention.<br />Get back a production decision.</h2></div>
          <p>Shape the brief, set the real-world constraints, then watch research and creative specialists converge into one decision-ready plan.</p>
        </div>

        <div className="workspace-grid">
          <article className="brief-panel panel">
            <div className="panel-heading">
              <div><span className="section-index">CREATIVE INPUT</span><h3>Director&apos;s brief</h3></div>
              <span className="mode-pill">PROJECT // TRANSFORMADORES</span>
            </div>
            <label className="brief-label" htmlFor="creative-brief">Production intent</label>
            <textarea id="creative-brief" value={brief} onChange={(event) => setBrief(event.target.value)} maxLength={700} />
            <div className="brief-meta"><span>{brief.length} / 700 CHARACTERS</span><span>ENGLISH OUTPUT</span></div>

            <div className="constraint-grid">
              <label>
                <span>FORMAT</span>
                <select value={constraints.format} onChange={(event) => setConstraints((current) => ({ ...current, format: event.target.value as ProductionConstraints["format"] }))}>
                  <option value="music-film">Music film</option><option value="short-film">Short film</option><option value="campaign">Campaign</option>
                </select>
              </label>
              <label>
                <span>DURATION</span>
                <select value={constraints.duration} onChange={(event) => setConstraints((current) => ({ ...current, duration: event.target.value as ProductionConstraints["duration"] }))}>
                  <option value="4m">04:00</option><option value="3m">03:00</option><option value="8m">08:00</option>
                </select>
              </label>
              <label>
                <span>PRODUCTION SCALE</span>
                <select value={constraints.scale} onChange={(event) => setConstraints((current) => ({ ...current, scale: event.target.value as ProductionConstraints["scale"] }))}>
                  <option value="lean">Lean / premium</option><option value="studio">Studio</option><option value="solo">Solo creator</option>
                </select>
              </label>
            </div>

            <button className="run-button" type="button" onClick={runPipeline} disabled={running || brief.trim().length < 40}>
              <span className="run-icon">{running ? <CircleStop size={19} /> : <Sparkles size={19} />}</span>
              <span>{running ? "ORCHESTRATING AGENTS" : complete ? "RUN AGAIN" : "LAUNCH INTELLIGENCE RUN"}</span>
              <ArrowUpRight size={19} />
            </button>
            <p className={`runtime-note ${error ? "error" : ""}`} aria-live="polite">
              <span className={running ? "runtime-light live" : "runtime-light"} />
              {error ? error : running ? "Parallel research and Gemini agents are working now." : mode === "live" ? `Live dossier grounded by Parallel${pipelineResult?.model ? ` · ${pipelineResult.model}` : ""}.` : mode === "demo" ? "Transparent demo preview · the live Google Cloud runtime is not connected yet." : "Ready to run. Credentials are checked only on the server."}
            </p>
          </article>

          <article className="pipeline-panel panel">
            <div className="panel-heading compact">
              <div><span className="section-index">AGENT RUNTIME</span><h3>Production pipeline</h3></div>
              <Gauge size={23} />
            </div>
            <div className="stage-list">
              {stages.map((stage, index) => (
                <div className={`stage-row ${stage.state}`} key={stage.name}>
                  <div className="stage-order">{String(index + 1).padStart(2, "0")}</div>
                  <StageIndicator state={stage.state} />
                  <div className="stage-copy"><strong>{stage.name}</strong><span>{stage.detail}</span></div>
                  <span className="stage-latency">{stage.latency}</span>
                </div>
              ))}
            </div>
            <div className="pipeline-footer">
              <span><span className="mini-bar"><i style={{ width: complete ? "100%" : running ? `${Math.max(8, ((activeStage + 1) / 6) * 100)}%` : "0%" }} /></span>{complete ? "6/6" : running ? `${activeStage + 1}/6` : "0/6"} {mode === "demo" ? "preview stages" : "agents"}</span>
              <span>{complete && pipelineResult ? pipelineResult.mode === "demo" ? "SAMPLE DOSSIER" : `${(pipelineResult.totalLatencyMs / 1000).toFixed(1)}s TOTAL` : running ? "LIVE TRACE" : "STANDBY"}</span>
            </div>
          </article>
        </div>
      </section>

      <section className="signal-story" id="evidence-engine">
        <figure className="signal-visual" role="img" aria-label="Abstract visualization of research signals becoming three cinematic decisions.">
          <div className="signal-composition" aria-hidden="true">
            <div className="source-cloud">{Array.from({ length: 9 }).map((_, index) => <i key={index} />)}</div>
            <div className="signal-path"><i /><i /><i /></div>
            <div className="transform-core"><span /><span /><span /></div>
            <div className="story-frames"><i /><i /><i /></div>
          </div>
          <figcaption><span>RAW SIGNAL</span><i /><span>GREENLIGHT</span></figcaption>
        </figure>
        <div className="signal-copy">
          <span className="section-index">03 / EVIDENCE ENGINE</span>
          <h2>Research becomes story.<br />Story becomes a shoot.</h2>
          <p>CINEOPS does not bolt search onto a chatbot. Parallel creates the live evidence layer; Google ADK gives each specialist a role; Gemini reconciles the room into a single cinematic system.</p>
          <div className="proof-stack">
            <article><span>01</span><div><strong>Find the signal</strong><p>Parallel Search gathers timely sources and usable excerpts.</p></div><Search size={21} /></article>
            <article><span>02</span><div><strong>Stress-test the idea</strong><p>Specialist agents work concurrently across story, production and craft.</p></div><Layers3 size={21} /></article>
            <article><span>03</span><div><strong>Make the call</strong><p>The final agent validates cited source IDs before returning the dossier.</p></div><ShieldCheck size={21} /></article>
          </div>
        </div>
      </section>

      <section className="output-panel panel" id="dossier">
        <div className="output-header">
          <div className="output-title">
            <span className="section-index">04 / GREENLIGHT DOSSIER</span>
            <h2>{dossier.projectTitle}</h2>
            <span className={`evidence-badge ${mode ?? "preview"}`}>{mode === "live" ? "LIVE EVIDENCE" : mode === "demo" ? "DEMO DATA" : "SAMPLE DOSSIER"}</span>
          </div>
          <nav className="tabs" aria-label="Dossier views">
            {(["dossier", "sources", "deliverables"] as const).map((item) => <button key={item} type="button" className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}
          </nav>
        </div>

        {tab === "dossier" && (
          <div className="dossier-grid">
            <article className="thesis-card dossier-card">
              <span className="card-kicker">CORE THESIS</span><blockquote>{dossier.thesis}</blockquote>
              <div className="thesis-tags">{dossier.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
            <article className="dossier-card visual-card">
              <Film size={21} /><span className="card-kicker">VISUAL ARC</span><h3>{dossier.visualArc.title}</h3><p>{dossier.visualArc.description}</p>
              <EvidenceRefs ids={dossier.visualArc.evidenceRefs} /><div className="palette"><i /><i /><i /><i /></div>
            </article>
            <article className="dossier-card sonic-card">
              <Music2 size={21} /><span className="card-kicker">SONIC ARC</span><h3>{dossier.sonicArc.startBpm} → {dossier.sonicArc.endBpm} BPM</h3><p>{dossier.sonicArc.description}</p>
              <EvidenceRefs ids={dossier.sonicArc.evidenceRefs} />
              <div className="waveform" aria-label="Sound intensity waveform">{Array.from({ length: 26 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 13) % 38)}%` }} />)}</div>
            </article>
            <article className="dossier-card risk-card">
              <ShieldCheck size={21} /><span className="card-kicker">PRODUCTION CONTROL</span><h3>{dossier.productionControl.title}</h3><p>{dossier.productionControl.description}</p>
              <EvidenceRefs ids={dossier.productionControl.evidenceRefs} /><div className="risk-score"><span>FEASIBILITY</span><strong>{dossier.productionControl.feasibility}</strong><small>/100</small></div>
            </article>
          </div>
        )}

        {tab === "sources" && (
          <div className="sources-view">
            <div className="source-summary">
              <Search size={24} />
              <div><strong>{mode === "live" ? "Parallel evidence ledger" : "Integration evidence preview"}</strong><span>{mode === "live" ? "Fresh web intelligence with excerpts and traceable URLs." : "Technical sources shown until runtime credentials are connected."}</span></div>
              <span className="source-count">{String(dossier.sources.length).padStart(2, "0")} SOURCES</span>
            </div>
            {dossier.sources.map((source) => (
              <article className="source-row" key={`${source.id}-${source.url}`}>
                <span className="source-number">{source.id}</span>
                <div><a href={source.url} target="_blank" rel="noreferrer">{source.title} <ExternalLink size={15} /></a><p>{source.excerpt}</p></div>
                <strong>{source.publishDate ?? "TRACE"}</strong>
              </article>
            ))}
          </div>
        )}

        {tab === "deliverables" && (
          <div className="deliverables-view">
            {dossier.deliverables.map((deliverable, index) => (
              <article key={`${index}-${deliverable.title}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{deliverable.title}</strong><p>{deliverable.detail}</p></div><Check size={18} /></article>
            ))}
          </div>
        )}
      </section>

      <footer className="footer"><span>CINEOPS // RESONANCE</span><span>GOOGLE ADK · GEMINI · PARALLEL SEARCH API</span><span>OMROS LAB / 2026</span></footer>
    </main>
  );
}
