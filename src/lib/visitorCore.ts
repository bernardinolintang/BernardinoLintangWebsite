/* Shared visitor-counter logic used by the Vercel function
   (api/visitor-count.ts) and the Vite dev middleware.
   Talks to Upstash Redis over its REST API, so no extra dependency.
   Vercel's Upstash integration sets KV_REST_API_URL / KV_REST_API_TOKEN. */

const COUNTER_KEY = "visitors";

type CounterResult = { status: number; body: { count?: number; error?: string } };

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export function isCounterConfigured() {
  return redisConfig() !== null;
}

// INCR is atomic, so two visitors arriving at once never share a number.
// The key starts at 0, so the first visitor ever is #1.
export async function incrementVisitorCount(): Promise<CounterResult> {
  const config = redisConfig();
  if (!config) return { status: 503, body: { error: "Visitor counter is not configured." } };

  try {
    const response = await fetch(`${config.url}/incr/${COUNTER_KEY}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.token}` },
    });
    const data = (await response.json()) as { result?: unknown };
    if (!response.ok || typeof data.result !== "number") {
      return { status: 502, body: { error: "Visitor counter is unavailable." } };
    }
    return { status: 200, body: { count: data.result } };
  } catch (error) {
    console.error("visitor counter error:", error);
    return { status: 502, body: { error: "Visitor counter is unavailable." } };
  }
}
