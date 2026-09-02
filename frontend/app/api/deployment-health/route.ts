export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const backendUrl = process.env.LANGCHAIN_API_URL?.trim().replace(/\/$/, "");
  if (!backendUrl) {
    return Response.json(
      {
        frontend: true,
        backendBinding: false,
        backendReachable: false,
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${backendUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const health = await response.json().catch(() => null);
    return Response.json(
      {
        frontend: true,
        backendBinding: true,
        backendReachable: response.ok,
        backendConfigured:
          health && typeof health === "object" && "configured" in health
            ? Boolean(health.configured)
            : false,
      },
      { status: response.ok ? 200 : 502 },
    );
  } catch {
    return Response.json(
      {
        frontend: true,
        backendBinding: true,
        backendReachable: false,
      },
      { status: 502 },
    );
  }
}
