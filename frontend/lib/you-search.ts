export type WebSource = {
  title: string;
  url: string;
  snippet: string;
};

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function collectResults(payload: unknown): AnyRecord[] {
  if (!isRecord(payload)) return [];
  const pools: unknown[] = [];

  for (const key of ["results", "hits"]) pools.push(payload[key]);
  for (const section of ["web", "news"]) {
    const value = payload[section];
    if (isRecord(value)) pools.push(value.results, value.hits);
  }

  const results = payload.results;
  if (isRecord(results)) {
    pools.push(results.web, results.news);
  }

  return pools.flatMap((pool) =>
    Array.isArray(pool) ? pool.filter(isRecord) : [],
  );
}

export async function searchYou(query: string): Promise<WebSource[]> {
  const apiKey = process.env.YOU_API_KEY;
  if (!apiKey) throw new Error("YOU_API_KEY is not configured.");

  const endpoint = new URL("https://ydc-index.io/v1/search");
  endpoint.searchParams.set("query", query);
  endpoint.searchParams.set("count", "6");
  endpoint.searchParams.set("freshness", "week");

  const response = await fetch(endpoint, {
    headers: { "X-API-Key": apiKey },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`You.com search failed with status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  const seen = new Set<string>();

  return collectResults(payload)
    .map((item) => {
      const title = clean(item.title ?? item.name);
      const url = clean(item.url ?? item.link);
      const snippets = Array.isArray(item.snippets)
        ? item.snippets.map(clean).filter(Boolean).join(" ")
        : "";
      const snippet = clean(
        item.description ?? item.snippet ?? item.text ?? item.content ?? snippets,
      ).slice(0, 900);
      return { title: title || url, url, snippet };
    })
    .filter((item) => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .slice(0, 6);
}

export function formatWebContext(sources: WebSource[]): string {
  if (!sources.length) return "No usable live sources were returned.";
  return sources
    .map(
      (source, index) =>
        `[${index + 1}] ${source.title}\nURL: ${source.url}\nExcerpt: ${source.snippet || "No excerpt supplied."}`,
    )
    .join("\n\n");
}
