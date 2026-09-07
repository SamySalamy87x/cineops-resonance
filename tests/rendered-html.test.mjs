import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

test("renders production metadata without preview markers", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>CINEOPS \/\/ RESONANCE<\/title>/i);
  assert.match(html, /Turn creative chaos into a production-ready signal\./i);
  assert.match(html, /SAMPLE DOSSIER/i);
  assert.doesNotMatch(html, /codex-preview/i);
});

test("returns an explicitly labeled demo response when live runtime is absent", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/api/pipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brief:
          "A four-minute music film about a rigid inherited system becoming collaborative and alive.",
        constraints: { format: "music-film", duration: "4m", scale: "lean" },
      }),
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.ok, true);
  assert.equal(payload.mode, "demo");
  assert.deepEqual(payload.missingConfiguration, ["CINEOPS_AGENT_URL"]);
  assert.equal(payload.stages.length, 6);
  assert.equal(payload.dossier.projectTitle, "TRANSFORMADORES");
});
