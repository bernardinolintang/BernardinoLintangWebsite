/* Vercel serverless function that records funnel events (visit, section
   reached, button clicked). Requires the Upstash Redis env vars. */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleTrack } from "../src/lib/funnelCore.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const result = await handleTrack(req.body, req.headers, ip);
  res.setHeader("Cache-Control", "no-store");
  if (result.body === null) res.status(result.status).end();
  else res.status(result.status).json(result.body);
}
