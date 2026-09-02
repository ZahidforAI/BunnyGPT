export type SourceMode = "official" | "live" | "hybrid";

const bunnyTerms = [
  "bunnyhood",
  "bunny hood",
  "bunnygpt",
  "bunny gpt",
  "burn window",
  "creator campaign",
  "the hood",
  "3999",
  "3,999",
  "sigma",
  "Σ",
];

export function classifySourceMode(question: string): SourceMode {
  const q = question.toLowerCase();
  const bunny = bunnyTerms.some((term) => q.includes(term.toLowerCase()));
  return bunny ? "hybrid" : "live";
}
