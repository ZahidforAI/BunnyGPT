import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("defines isolated Vercel frontend and backend services", async () => {
  const config = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(config.services.frontend.root, "frontend/");
  assert.deepEqual(config.services.frontend.framework, "nextjs");
  assert.deepEqual(config.services.backend.root, "backend/");
  assert.deepEqual(config.services.backend.framework, "fastapi");
  assert.deepEqual(config.services.backend.entrypoint, "app:app");
  assert.deepEqual(config.services.frontend.bindings, [
    {
      type: "service",
      service: "backend",
      format: "url",
      env: "LANGCHAIN_API_URL",
    },
  ]);
  assert.deepEqual(config.rewrites.at(-1), {
    source: "/(.*)",
    destination: { service: "frontend" },
  });
});

test("keeps Python dependencies inside the backend service", async () => {
  const manifest = await readFile(
    new URL("../backend/pyproject.toml", import.meta.url),
    "utf8",
  );
  assert.match(manifest, /fastapi==0\.141\.1/);
  assert.match(manifest, /langchain-openai==1\.6\.0/);
});
