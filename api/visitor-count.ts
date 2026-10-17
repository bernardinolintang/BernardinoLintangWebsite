/* Vercel serverless function for the footer visitor counter.
   Requires KV_REST_API_URL and KV_REST_API_TOKEN (set by the
   Upstash for Redis integration) in the project environment. */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { incrementVisitorCount } from "../src/lib/visitorCore.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const result = await incrementVisitorCount();
  res.setHeader("Cache-Control", "no-store");
  res.status(result.status).json(result.body);
}
