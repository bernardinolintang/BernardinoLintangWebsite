/* Vercel serverless function behind the private /stats page.
   Requires STATS_KEY in the project environment; the page sends it in the
   x-stats-key header. */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleStats } from "../src/lib/funnelCore.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const result = await handleStats(req.headers);
  res.setHeader("Cache-Control", "no-store");
  res.status(result.status).json(result.body);
}
