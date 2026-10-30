/* Minimal Upstash Redis REST helper shared by the visitor counter and the
   funnel analytics. Vercel's Upstash integration sets KV_REST_API_URL and
   KV_REST_API_TOKEN. No extra dependency needed. */

export type RedisConfig = { url: string; token: string };

export function redisConfig(): RedisConfig | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

/* Runs several commands in one round trip. Resolves to one result per
   command; throws if Redis is unreachable or any command errors. */
export async function redisPipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const config = redisConfig();
  if (!config) throw new Error("Redis is not configured.");

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!response.ok) throw new Error(`Redis pipeline failed (${response.status}).`);

  const rows = (await response.json()) as { result?: unknown; error?: string }[];
  return rows.map((row) => {
    if (row.error) throw new Error(row.error);
    return row.result;
  });
}
