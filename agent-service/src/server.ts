import {
  InMemoryRunner,
  LlmAgent,
  ParallelAgent,
  SequentialAgent,
} from "@google/adk";
import type { Content } from "@google/genai";
import express from "express";
import Parallel from "parallel-web";
import { z } from "zod";

type ProductionConstraints = {
  format: "music-film" | "short-film" | "campaign";
  duration: "3m" | "4m" | "8m";
  scale: "lean" | "studio" | "solo";
};

type EvidenceSource = {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishDate?: string;
};

const requestSchema = z.object({
  brief: z.string().trim().min(40).max(700),
  constraints: z.object({
    format: z.enum(["music-film", "short-film", "campaign"]),
    duration: z.enum(["3m", "4m", "8m"]),
    scale: z.enum(["lean", "studio", "solo"]),
  }),
});

const creativeSectionSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(20).max(520),
  evidenceRefs: z.array(z.string()).min(1).max(5),
});

const dossierSchema = z.object({
  projectTitle: z.string().min(2).max(80),
  thesis: z.string().min(30).max(700),
  tags: z.array(z.string().min(2).max(32)).min(3).max(5),
  visualArc: creativeSectionSchema,
  sonicArc: creativeSectionSchema.extend({
    startBpm: z.number().int().min(40).max(220),
    endBpm: z.number().int().min(40).max(220),
  }),
  productionControl: creativeSectionSchema.extend({
    feasibility: z.number().int().min(0).max(100),
  }),
  deliverables: z
    .array(
      z.object({
        title: z.string().min(2).max(100),
        detail: z.string().min(8).max(220),
      }),
    )
    .min(4)
    .max(7),
});

type GeneratedDossier = z.infer<typeof dossierSchema>;

const pipelineStageNames = [
  "Brief Director",
  "Live Intelligence",
  "Narrative Architect",
  "Production Planner",
  "Sonic + Visual Director",
  "Greenlight Synthesis",
] as const;

const formatLabels: Record<ProductionConstraints["format"], string> = {
  "music-film": "music film",
  "short-film": "short film",
  campaign: "campaign",
};

const durationLabels: Record<ProductionConstraints["duration"], string> = {
  "3m": "3 minutes",
  "4m": "4 minutes",
  "8m": "8 minutes",
};

const scaleLabels: Record<ProductionConstraints["scale"], string> = {
  lean: "lean premium production",
  studio: "studio production",
  solo: "solo creator production",
};

function compactExcerpt(excerpts: string[]) {
  return excerpts
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);
}

function safeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

async function runParallelResearch(
  brief: string,
  constraints: ProductionConstraints,
): Promise<{ sources: EvidenceSource[]; latencyMs: number }> {
  const startedAt = Date.now();
  const client = new Parallel({ apiKey: process.env.PARALLEL_API_KEY });
  const medium = formatLabels[constraints.format];

  const result = await client.search({
    objective:
      `Find recent, credible evidence that can improve the audience strategy, visual language, ` +
      `sound direction and feasible production plan for this ${medium}: ${brief}`,
    search_queries: [
      `${medium} audience transformation storytelling`,
      `${medium} visual symbolism production design`,
      `${medium} music tempo emotional arc`,
    ],
    mode: "advanced",
    max_chars_total: 12000,
    client_model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  });

  const sources = result.results.flatMap((item, index) => {
    const url = safeHttpUrl(item.url);
    if (!url) return [];
    return [{
      id: `S${index + 1}`,
      title: item.title?.trim() || url.hostname,
      url: url.toString(),
      excerpt: compactExcerpt(item.excerpts),
      ...(item.publish_date ? { publishDate: item.publish_date } : {}),
    }];
  }).slice(0, 6);

  if (sources.length === 0) {
    throw new Error("Parallel Search returned no usable evidence.");
  }

  return { sources, latencyMs: Date.now() - startedAt };
}

function buildAgentTree(model: string) {
  const briefDirector = new LlmAgent({
    name: "brief_director",
    model,
    description: "Translates the director's intent into a precise creative strategy.",
    instruction:
      "You are the Brief Director for CINEOPS. Read the user's production brief and the supplied constraints. " +
      "Define the audience promise, dramatic question, emotional change, non-negotiables and the single most important production constraint. " +
      "Be concrete, cinematic and concise. Never invent research; the evidence ledger is handled separately.",
    outputKey: "creative_strategy",
  });

  const narrativeArchitect = new LlmAgent({
    name: "narrative_architect",
    model,
    description: "Builds the narrative spine and symbolic system.",
    instruction:
      "You are the Narrative Architect. Use the creative strategy below and only evidence present in the evidence ledger. " +
      "Create a clear thesis, dramatic escalation, recurring symbols and an ending image. Cite supporting evidence by source IDs such as S1.\n\n" +
      "CREATIVE STRATEGY:\n{creative_strategy}\n\nEVIDENCE LEDGER:\n{evidence_ledger}",
    outputKey: "narrative_blueprint",
  });

  const productionPlanner = new LlmAgent({
    name: "production_planner",
    model,
    description: "Turns the concept into a feasible shoot plan and risk map.",
    instruction:
      "You are the Production Planner. Use the strategy, constraints and evidence below. " +
      "Propose the smallest viable production system that still feels cinematic. Include location logic, schedule, assets, principal risks, mitigations and a 0-100 feasibility score. " +
      "Cite supporting evidence by source ID.\n\nCREATIVE STRATEGY:\n{creative_strategy}\n\nCONSTRAINTS:\n{production_constraints}\n\nEVIDENCE LEDGER:\n{evidence_ledger}",
    outputKey: "production_plan",
  });

  const sonicVisualDirector = new LlmAgent({
    name: "sonic_visual_director",
    model,
    description: "Designs one coherent sonic and visual language.",
    instruction:
      "You are the Sonic and Visual Director. Use the strategy and evidence below to define a camera arc, light and color progression, recurring visual motif, start and end BPM, sound palette and final release. " +
      "Make every choice shootable and cite supporting evidence by source ID.\n\nCREATIVE STRATEGY:\n{creative_strategy}\n\nEVIDENCE LEDGER:\n{evidence_ledger}",
    outputKey: "sonic_visual_system",
  });

  const specialistRoom = new ParallelAgent({
    name: "specialist_room",
    description: "Runs narrative, production and audiovisual specialists concurrently.",
    subAgents: [narrativeArchitect, productionPlanner, sonicVisualDirector],
  });

  const greenlightSynthesis = new LlmAgent({
    name: "greenlight_synthesis",
    model,
    description: "Reconciles all specialist outputs into a production-ready dossier.",
    instruction:
      "You are the Greenlight Synthesis agent. Reconcile the specialist outputs into one decisive English-language dossier. " +
      "Every evidenceRefs value must be a real source ID present in the evidence ledger. Do not claim a fact that is absent from the ledger. " +
      "Keep the thesis memorable, the creative sections specific and the deliverables directly usable by a filmmaker.\n\n" +
      "CREATIVE STRATEGY:\n{creative_strategy}\n\nNARRATIVE:\n{narrative_blueprint}\n\nPRODUCTION:\n{production_plan}\n\nSONIC + VISUAL:\n{sonic_visual_system}\n\nEVIDENCE LEDGER:\n{evidence_ledger}",
    outputSchema: dossierSchema,
    outputKey: "greenlight_dossier",
  });

  return new SequentialAgent({
    name: "cineops_resonance",
    description: "CINEOPS deterministic creative-production orchestration.",
    subAgents: [briefDirector, specialistRoom, greenlightSynthesis],
  });
}

function parseGeneratedDossier(raw: string): GeneratedDossier {
  const normalized = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return dossierSchema.parse(JSON.parse(normalized));
}

function evidenceLedger(sources: EvidenceSource[]) {
  return sources
    .map(
      (source) =>
        `${source.id} | ${source.title}\nURL: ${source.url}\nPublished: ${source.publishDate ?? "unknown"}\nExcerpt: ${source.excerpt}`,
    )
    .join("\n\n");
}

async function runCineopsPipeline(input: z.infer<typeof requestSchema>) {
  const startedAt = Date.now();
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const research = await runParallelResearch(input.brief, input.constraints);
  const runner = new InMemoryRunner({
    agent: buildAgentTree(model),
    appName: "cineops_resonance",
  });

  const message: Content = {
    role: "user",
    parts: [{
      text:
        `PROJECT BRIEF: ${input.brief}\n` +
        `FORMAT: ${formatLabels[input.constraints.format]}\n` +
        `DURATION: ${durationLabels[input.constraints.duration]}\n` +
        `SCALE: ${scaleLabels[input.constraints.scale]}\n` +
        "Produce an English-language, production-ready creative dossier.",
    }],
  };

  let finalText = "";
  for await (const event of runner.runEphemeral({
    userId: "cineops-web",
    newMessage: message,
    stateDelta: {
      evidence_ledger: evidenceLedger(research.sources),
      production_constraints: JSON.stringify(input.constraints),
    },
  })) {
    for (const part of event.content?.parts ?? []) {
      if (typeof part.text === "string" && part.text.trim()) finalText = part.text;
    }
  }

  if (!finalText) throw new Error("Gemini completed without a dossier payload.");
  const generated = parseGeneratedDossier(finalText);

  return {
    ok: true,
    mode: "live" as const,
    dossier: { ...generated, sources: research.sources },
    model,
    generatedAt: new Date().toISOString(),
    totalLatencyMs: Date.now() - startedAt,
    stages: pipelineStageNames.map((name) => ({
      name,
      state: "complete" as const,
      ...(name === "Live Intelligence" ? { latencyMs: research.latencyMs } : {}),
    })),
  };
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "cineops-agent-service",
    configured: Boolean(process.env.GEMINI_API_KEY && process.env.PARALLEL_API_KEY),
  });
});

app.post("/pipeline", async (request, response) => {
  const expectedToken = process.env.CINEOPS_SHARED_SECRET;
  if (expectedToken && request.header("authorization") !== `Bearer ${expectedToken}`) {
    response.status(401).json({ ok: false, error: "Unauthorized agent request." });
    return;
  }

  if (!process.env.GEMINI_API_KEY || !process.env.PARALLEL_API_KEY) {
    response.status(503).json({
      ok: false,
      error: "Agent service requires GEMINI_API_KEY and PARALLEL_API_KEY.",
    });
    return;
  }

  try {
    const input = requestSchema.parse(request.body);
    response.json(await runCineopsPipeline(input));
  } catch (error) {
    const status = error instanceof z.ZodError ? 400 : 500;
    response.status(status).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown pipeline error.",
    });
  }
});

const port = Number(process.env.PORT ?? 8080);
app.listen(port, "0.0.0.0", () => {
  console.log(`CINEOPS agent service listening on port ${port}`);
});
