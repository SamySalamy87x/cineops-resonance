import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  demoDossier,
  pipelineStageNames,
  type PipelineResponse,
} from "../../../lib/contracts";

const requestSchema = z.object({
  brief: z.string().trim().min(40).max(700),
  constraints: z.object({
    format: z.enum(["music-film", "short-film", "campaign"]),
    duration: z.enum(["3m", "4m", "8m"]),
    scale: z.enum(["lean", "studio", "solo"]),
  }),
});

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const body = requestSchema.parse(await request.json());
    const agentUrl = process.env.CINEOPS_AGENT_URL;

    if (!agentUrl) {
      const response: PipelineResponse = {
        ok: true,
        mode: "demo",
        dossier: demoDossier,
        generatedAt: new Date().toISOString(),
        totalLatencyMs: Date.now() - startedAt,
        stages: pipelineStageNames.map((name) => ({ name, state: "complete" })),
        missingConfiguration: ["CINEOPS_AGENT_URL"],
      };
      return NextResponse.json(response);
    }

    const upstream = await fetch(new URL("/pipeline", agentUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CINEOPS_AGENT_TOKEN
          ? { Authorization: `Bearer ${process.env.CINEOPS_AGENT_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000),
    });
    const response = (await upstream.json()) as PipelineResponse;

    if (!upstream.ok || !response.ok) {
      throw new Error(response.error || `Agent service returned ${upstream.status}.`);
    }

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown pipeline error";
    return NextResponse.json(
      {
        ok: false,
        error: message,
        generatedAt: new Date().toISOString(),
        totalLatencyMs: Date.now() - startedAt,
      },
      { status: 500 },
    );
  }
}
