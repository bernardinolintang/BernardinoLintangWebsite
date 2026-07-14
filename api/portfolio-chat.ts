/* Vercel serverless function for the "Ask about Bernard" assistant.
   Requires GROQ_API_KEY (and optionally GROQ_MODEL) in the Vercel
   project environment variables. */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleChatRequest } from "../src/lib/chatCore.js";

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

  const result = await handleChatRequest(req.body ?? {}, ip);
  res.status(result.status).json(result.body);
}
