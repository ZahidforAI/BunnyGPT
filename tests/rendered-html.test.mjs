import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("defines development preview metadata", async () => {
  const layout = await readFile(
    new URL("../frontend/app/layout.tsx", import.meta.url),
    "utf8",
  );
  assert.match(layout, /"codex-preview":\s*"development"/);
  assert.match(layout, /icon:\s*"\/bunny-hood-logo\.png"/);
});
