import assert from "node:assert/strict";
import test from "node:test";

import { BUNNYHOOD_KNOWLEDGE } from "../backend/bunnyhood-knowledge.ts";
import { AGENTS } from "../frontend/lib/personalities.ts";
import { classifySourceMode } from "../frontend/lib/search-intent.ts";

test("routes every non-identity question through live research", () => {
  assert.equal(classifySourceMode("What is BunnyHood?"), "hybrid");
  assert.equal(classifySourceMode("What is ETH doing today?"), "live");
  assert.equal(classifySourceMode("Why is the sky blue?"), "live");
  assert.equal(
    classifySourceMode("How could current tokenization trends help BunnyHood?"),
    "hybrid",
  );
});

test("defines all three persistent Bunny archetypes", () => {
  assert.deepEqual(Object.keys(AGENTS), ["quant", "trader", "contrarian"]);
  assert.equal(AGENTS.quant.image, "/bunny_quant.jpg");
  assert.equal(AGENTS.trader.image, "/bunny_trader.jpg");
  assert.equal(AGENTS.contrarian.image, "/bunny_contrarian.jpg");
  assert.match(AGENTS.quant.systemPrompt, /probabilistic/i);
  assert.match(AGENTS.trader.systemPrompt, /What I am watching/i);
  assert.match(AGENTS.contrarian.systemPrompt, /What everyone may be missing/i);
});

test("official knowledge protects unrevealed and future information", () => {
  assert.match(BUNNYHOOD_KNOWLEDGE, /public BunnyHood collection has not minted/i);
  assert.match(BUNNYHOOD_KNOWLEDGE, /Never invent an explanation/i);
  assert.match(BUNNYHOOD_KNOWLEDGE, /planned, not currently live/i);
  assert.match(BUNNYHOOD_KNOWLEDGE, /Never request seed phrases/i);
});
