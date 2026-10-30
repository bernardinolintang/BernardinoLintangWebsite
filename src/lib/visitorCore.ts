/* Shared visitor-counter logic used by the Vercel function
   (api/visitor-count.ts) and the Vite dev middleware. */

import { redisConfig } from "./redis.js";

const COUNTER_KEY = "visitors";

type CounterResult = { status: number; body: { count?: number; error?: string } };

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
