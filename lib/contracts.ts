export type ProductionConstraints = {
  format: "music-film" | "short-film" | "campaign";
  duration: "3m" | "4m" | "8m";
  scale: "lean" | "studio" | "solo";
};

export type EvidenceSource = {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishDate?: string;
};

export type CreativeSection = {
  title: string;
  description: string;
  evidenceRefs: string[];
};

export type CineopsDossier = {
  projectTitle: string;
  thesis: string;
  tags: string[];
  visualArc: CreativeSection;
  sonicArc: CreativeSection & {
    startBpm: number;
    endBpm: number;
  };
  productionControl: CreativeSection & {
    feasibility: number;
  };
  deliverables: Array<{
    title: string;
    detail: string;
  }>;
  sources: EvidenceSource[];
};

export type PipelineStageResult = {
  name: string;
  state: "complete";
  latencyMs?: number;
};

export type PipelineResponse = {
  ok: boolean;
  mode: "live" | "demo";
  dossier: CineopsDossier;
  model?: string;
  generatedAt: string;
  totalLatencyMs: number;
  stages: PipelineStageResult[];
  missingConfiguration?: string[];
  error?: string;
};

export const demoDossier: CineopsDossier = {
  projectTitle: "TRANSFORMADORES",
  thesis:
    "Transformation becomes cinematic when the audience can see the exact moment a person stops adapting to a broken system and begins redesigning it.",
  tags: ["AGENCY", "INHERITED FEAR", "COLLECTIVE SIGNAL"],
  visualArc: {
    title: "Compression → release",
    description:
      "Locked frames and narrow practical light evolve into fluid movement, wider lenses and a shared horizon.",
    evidenceRefs: ["S1"],
  },
  sonicArc: {
    title: "A pulse that becomes communal",
    description:
      "A restrained pulse gathers human texture before opening into a collective, high-energy final movement.",
    startBpm: 76,
    endBpm: 122,
    evidenceRefs: ["S2"],
  },
  productionControl: {
    title: "One location. Four states.",
    description:
      "Change time, color temperature, blocking and camera freedom instead of multiplying locations.",
    feasibility: 92,
    evidenceRefs: ["S3"],
  },
  deliverables: [
    {
      title: "Creative intelligence dossier",
      detail: "Narrative thesis, audience evidence and risk map",
    },
    {
      title: "Sequence architecture",
      detail: "Eight-beat structure with production checkpoints",
    },
    {
      title: "Visual language system",
      detail: "Palette, lenses, movement and recurring motifs",
    },
    {
      title: "Sonic direction",
      detail: "BPM curve, tonal center and dynamic transitions",
    },
    {
      title: "Source ledger",
      detail: "Traceable web evidence returned by Parallel Search",
    },
  ],
  sources: [
    {
      id: "S1",
      title: "Parallel Search API quickstart",
      url: "https://docs.parallel.ai/search/search-quickstart",
      excerpt:
        "Technical reference for the runtime search request and evidence payload used by the Live Intelligence stage.",
    },
    {
      id: "S2",
      title: "Google ADK TypeScript quickstart",
      url: "https://google.github.io/adk-docs/get-started/typescript/",
      excerpt:
        "Technical reference for the Gemini agents, session runner and deterministic orchestration used by the pipeline.",
    },
    {
      id: "S3",
      title: "Agentic Cinema — Parallel resources",
      url: "https://agentic-cinema.devpost.com/details/parallel-resources",
      excerpt:
        "Track requirements used to keep the demo grounded in a real Parallel Search API call at runtime.",
    },
  ],
};

export const pipelineStageNames = [
  "Brief Director",
  "Live Intelligence",
  "Narrative Architect",
  "Production Planner",
  "Sonic + Visual Director",
  "Greenlight Synthesis",
] as const;
