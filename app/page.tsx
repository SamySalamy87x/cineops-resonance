"use client";

import {
  Activity,
  Aperture,
  ArrowUpRight,
  Check,
  CircleStop,
  ExternalLink,
  Film,
  Gauge,
  Layers3,
  Music2,
  Radio,
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
  {
    name: "Brief Director",
    detail: "Intent, audience and dramatic constraint",
    state: "queued",
    latency: "—",
  },
  {
    name: "Live Intelligence",
    detail: "Parallel Search API · current web evidence",
    state: "queued",
    latency: "—",
  },
  {
    name: "Narrative Architect",
    detail: "Word DNA, tension curve and symbolic spine",
    state: "queued",
    latency: "—",
  },
  {
    name: "Production Planner",
    detail: "Shoot logic, assets, risk and feasibility",
    state: "queued",
    latency: "—",
  },
  {
    name: "Sonic + Visual Director",
    detail: "BPM, palette, lens language and sound arc",
    state: "queued",
    latency: "—",
  },
  {
    name: "Greenlight Synthesis",
    detail: "Grounded dossier with source traceability",
    state: "queued",
    latency: "—",
  },
];

function StageIndicator({ state }: { state: StageState }) {
  if (state === "complete") {
    return (
      <span className="stage-indicator complete" aria-label="Complete">
        <Check size={12} strokeWidth={2.4} />
      </span>
    );
  }
  if (state === "active") {
    return <span className="stage-indicator active" aria-label="Running" />;
  }
  return <span className="stage-indicator queued" aria-label="Queued" />;
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
  const [constraints, setConstraints] = useState<ProductionConstraints>({
    format: "music-film",
    duration: "4m",
    scale: "lean",
  });
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
          latency: runtimeStage?.latencyMs
            ? `${(runtimeStage.latencyMs / 1000).toFixed(1)}s`
            : "DONE",
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

    const progressTimer = window.setInterval(() => {
      setActiveStage((current) => Math.min(current + 1, 5));
    }, 1500);

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

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "The agent pipeline could not complete.");
      }

      setDossier(payload.dossier);
      setPipelineResult(payload);
      setMode(payload.mode);
      setActiveStage(5);
      setComplete(true);
      setTab("dossier");
    } catch (pipelineError) {
      setError(
        pipelineError instanceof Error
          ? pipelineError.message
          : "The agent pipeline could not complete.",
      );
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

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="CINEOPS home">
          <span className="brand-mark"><Aperture size={18} /></span>
          <span className="brand-lockup">
            <strong>CINEOPS</strong>
            <span>RESONANCE</span>
          </span>
        </a>
        <div className="topbar-center" aria-label="Runtime status">
          <span className="signal-dot" />
          <span>AGENT NETWORK</span>
          <strong>{complete ? "SYNTHESIZED" : running ? "PROCESSING" : "READY"}</strong>
        </div>
        <div className="topbar-actions">
          <span className="track-chip"><Radio size={13} /> PARALLEL TRACK</span>
          <button className="icon-button" type="button" onClick={resetPipeline} aria-label="Reset session">
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      <section className="hero-grid" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>01</span> AUTONOMOUS CREATIVE INTELLIGENCE</div>
          <h1>Turn creative chaos into a production-ready signal.</h1>
          <p className="hero-lede">
            A Gemini-powered multi-agent studio that grounds every creative decision in live,
            traceable web intelligence from Parallel.
          </p>
          <div className="hero-metrics">
            <div><strong>06</strong><span>specialist agents</span></div>
            <div><strong>01</strong><span>grounded workflow</span></div>
            <div><strong>100%</strong><span>source traceability</span></div>
          </div>
        </div>

        <aside className="system-card">
          <div className="system-card-header">
            <div>
              <span className="micro-label">SYSTEM TOPOLOGY</span>
              <h2>Deterministic orchestration</h2>
            </div>
            <Activity size={20} />
          </div>
          <div className="topology">
            <div className="topology-node primary"><Sparkles size={16} /><span>GEMINI</span></div>
            <div className="topology-line" />
            <div className="topology-node"><Search size={15} /><span>PARALLEL</span></div>
            <div className="topology-line" />
            <div className="topology-node"><Layers3 size={15} /><span>ADK</span></div>
          </div>
          <div className="system-foot">
            <span><ShieldCheck size={14} /> Google-only AI stack</span>
            <span>v0.1 / BUILD 0826</span>
          </div>
        </aside>
      </section>

      <section className="workspace-grid">
        <article className="brief-panel panel">
          <div className="panel-heading">
            <div>
              <span className="section-index">01 / CREATIVE INPUT</span>
              <h2>Director&apos;s brief</h2>
            </div>
            <span className="mode-pill">PROJECT // TRANSFORMADORES</span>
          </div>

          <label className="brief-label" htmlFor="creative-brief">Production intent</label>
          <textarea
            id="creative-brief"
            value={brief}
            onChange={(event) => setBrief(event.target.value)}
            maxLength={700}
          />
          <div className="brief-meta">
            <span>{brief.length} / 700</span>
            <span>ENGLISH OUTPUT</span>
          </div>

          <div className="constraint-grid">
            <label>
              <span>FORMAT</span>
              <select
                value={constraints.format}
                onChange={(event) => setConstraints((current) => ({
                  ...current,
                  format: event.target.value as ProductionConstraints["format"],
                }))}
              >
                <option value="music-film">Music film</option>
                <option value="short-film">Short film</option>
                <option value="campaign">Campaign</option>
              </select>
            </label>
            <label>
              <span>DURATION</span>
              <select
                value={constraints.duration}
                onChange={(event) => setConstraints((current) => ({
                  ...current,
                  duration: event.target.value as ProductionConstraints["duration"],
                }))}
              >
                <option value="4m">04:00</option>
                <option value="3m">03:00</option>
                <option value="8m">08:00</option>
              </select>
            </label>
            <label>
              <span>PRODUCTION SCALE</span>
              <select
                value={constraints.scale}
                onChange={(event) => setConstraints((current) => ({
                  ...current,
                  scale: event.target.value as ProductionConstraints["scale"],
                }))}
              >
                <option value="lean">Lean / premium</option>
                <option value="studio">Studio</option>
                <option value="solo">Solo creator</option>
              </select>
            </label>
          </div>

          <button className="run-button" type="button" onClick={runPipeline} disabled={running || brief.trim().length < 40}>
            <span className="run-icon">{running ? <CircleStop size={17} /> : <Sparkles size={17} />}</span>
            <span>{running ? "ORCHESTRATING AGENTS" : complete ? "RUN AGAIN" : "RUN PRODUCTION INTELLIGENCE"}</span>
            <ArrowUpRight size={17} />
          </button>
          <p className={`runtime-note ${error ? "error" : ""}`} aria-live="polite">
            <span className={running ? "runtime-light live" : "runtime-light"} />
            {error
              ? error
              : running
                ? "Parallel research and Gemini agents are working now."
                : mode === "live"
                  ? `Live dossier grounded by Parallel${pipelineResult?.model ? ` · ${pipelineResult.model}` : ""}.`
                  : mode === "demo"
                    ? `Transparent demo mode · connect ${pipelineResult?.missingConfiguration?.join(" + ")}.`
                    : "Ready to run. Credentials are checked only on the server."}
          </p>
        </article>

        <article className="pipeline-panel panel">
          <div className="panel-heading compact">
            <div>
              <span className="section-index">02 / AGENT RUNTIME</span>
              <h2>Production pipeline</h2>
            </div>
            <Gauge size={20} />
          </div>
          <div className="stage-list">
            {stages.map((stage, index) => (
              <div className={`stage-row ${stage.state}`} key={stage.name}>
                <div className="stage-order">{String(index + 1).padStart(2, "0")}</div>
                <StageIndicator state={stage.state} />
                <div className="stage-copy">
                  <strong>{stage.name}</strong>
                  <span>{stage.detail}</span>
                </div>
                <span className="stage-latency">{stage.latency}</span>
              </div>
            ))}
          </div>
          <div className="pipeline-footer">
            <span>
              <span className="mini-bar"><i style={{ width: complete ? "100%" : running ? `${Math.max(8, ((activeStage + 1) / 6) * 100)}%` : "0%" }} /></span>
              {complete ? "6/6" : running ? `${activeStage + 1}/6` : "0/6"} agents
            </span>
            <span>{complete && pipelineResult ? `${(pipelineResult.totalLatencyMs / 1000).toFixed(1)}s TOTAL` : running ? "LIVE TRACE" : "STANDBY"}</span>
          </div>
        </article>
      </section>

      <section className="output-panel panel">
        <div className="output-header">
          <div>
            <span className="section-index">03 / GREENLIGHT DOSSIER</span>
            <h2>{dossier.projectTitle}</h2>
          </div>
          <nav className="tabs" aria-label="Dossier views">
            {(["dossier", "sources", "deliverables"] as const).map((item) => (
              <button key={item} type="button" className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
                {item}
              </button>
            ))}
          </nav>
        </div>

        {tab === "dossier" && (
          <div className="dossier-grid">
            <article className="thesis-card dossier-card">
              <span className="card-kicker">CORE THESIS</span>
              <blockquote>{dossier.thesis}</blockquote>
              <div className="thesis-tags">
                {dossier.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
            <article className="dossier-card">
              <Film size={18} />
              <span className="card-kicker">VISUAL ARC</span>
              <h3>{dossier.visualArc.title}</h3>
              <p>{dossier.visualArc.description}</p>
              <div className="palette"><i /><i /><i /><i /></div>
            </article>
            <article className="dossier-card">
              <Music2 size={18} />
              <span className="card-kicker">SONIC ARC</span>
              <h3>{dossier.sonicArc.startBpm} → {dossier.sonicArc.endBpm} BPM</h3>
              <p>{dossier.sonicArc.description}</p>
              <div className="waveform" aria-label="Sound intensity waveform">{Array.from({ length: 26 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 13) % 38)}%` }} />)}</div>
            </article>
            <article className="dossier-card risk-card">
              <ShieldCheck size={18} />
              <span className="card-kicker">PRODUCTION CONTROL</span>
              <h3>{dossier.productionControl.title}</h3>
              <p>{dossier.productionControl.description}</p>
              <div className="risk-score"><span>FEASIBILITY</span><strong>{dossier.productionControl.feasibility}</strong><small>/100</small></div>
            </article>
          </div>
        )}

        {tab === "sources" && (
          <div className="sources-view">
            <div className="source-summary">
              <Search size={22} />
              <div>
                <strong>{mode === "live" ? "Parallel evidence ledger" : "Integration evidence preview"}</strong>
                <span>{mode === "live" ? "Fresh web intelligence with excerpts and traceable URLs." : "Technical sources shown until runtime credentials are connected."}</span>
              </div>
              <span className="source-count">{String(dossier.sources.length).padStart(2, "0")} SOURCES</span>
            </div>
            {dossier.sources.map((source) => (
              <article className="source-row" key={`${source.id}-${source.url}`}>
                <span className="source-number">{source.id}</span>
                <div>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title} <ExternalLink size={13} />
                  </a>
                  <p>{source.excerpt}</p>
                </div>
                <strong>{source.publishDate ?? "TRACE"}</strong>
              </article>
            ))}
          </div>
        )}

        {tab === "deliverables" && (
          <div className="deliverables-view">
            {dossier.deliverables.map((deliverable, index) => (
              <article key={`${index}-${deliverable.title}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{deliverable.title}</strong><p>{deliverable.detail}</p></div>
                <Check size={16} />
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <span>CINEOPS // RESONANCE</span>
        <span>GOOGLE ADK · GEMINI · PARALLEL SEARCH API</span>
        <span>OMROS LAB / 2026</span>
      </footer>
    </main>
  );
}
