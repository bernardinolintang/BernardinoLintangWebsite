/* Funnel analytics core, shared by the Vercel functions (api/track.ts,
   api/stats.ts) and the Vite dev middleware.

   The browser reports three kinds of event, each at most once per session:
     visit   - opened the site (with referrer)
     section - scrolled a section into view
     action  - clicked Email / GitHub / LinkedIn, opened the resume dialog
   Counts live in Redis hashes, so the stats page can show where people
   drop off and at what hour they visit. No personal data is stored: no IPs,
   no user ids, only counters. */

import { createHash, timingSafeEqual } from "node:crypto";
import { redisConfig, redisPipeline } from "./redis.js";

export const SECTIONS = [
  "about", "experience", "competitions", "projects", "community", "testimonials", "contact",
] as const;
export const ACTIONS = [
  "resume_open", "resume_email", "resume_linkedin", "email_click", "linkedin_click", "github_click",
] as const;

type Headers = Record<string, string | string[] | undefined>;
type Counts = Record<string, number>;
type Result = { status: number; body: unknown };

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|telegram|vercel|curl|wget/i;
const MAX_EVENTS_PER_HOUR = 300;
const DAYS_KEPT_IN_STATS = 30;

const timeZone = () => process.env.STATS_TZ || "Asia/Singapore";
// Production and preview/local data are kept apart so testing never pollutes real numbers.
const prefix = () => (process.env.VERCEL_ENV === "production" ? "funnel" : "funnel-dev");

const header = (headers: Headers, name: string) => {
  const value = headers[name];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};

/* Calendar date, hour (00-23) and weekday as they are on the clock in `timeZone()`. */
function clock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone(),
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", hourCycle: "h23", weekday: "short",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: `${get("year")}-${get("month")}-${get("day")}`, hour: get("hour"), weekday: get("weekday") };
}

const clean = (value: unknown, max = 60) =>
  typeof value === "string" ? value.toLowerCase().replace(/^www\./, "").replace(/[^a-z0-9._-]/g, "").slice(0, max) : "";

export async function handleTrack(body: unknown, headers: Headers, ip: string): Promise<Result> {
  const ok: Result = { status: 204, body: null };
  if (!redisConfig() || BOT.test(header(headers, "user-agent"))) return ok;

  const event = (body ?? {}) as { type?: unknown; id?: unknown; ref?: unknown };
  const p = prefix();
  const { day, hour, weekday } = clock(new Date());

  let field: string;
  if (event.type === "visit") field = "visit";
  else if (event.type === "section" && (SECTIONS as readonly unknown[]).includes(event.id)) field = `s:${event.id}`;
  else if (event.type === "action" && (ACTIONS as readonly unknown[]).includes(event.id)) field = `a:${event.id}`;
  else return { status: 400, body: { error: "Unknown event." } };

  try {
    // Cap events per visitor per hour so a script can't flood the counters.
    const rlKey = `${p}:rl:${createHash("sha256").update(ip).digest("hex").slice(0, 16)}`;
    const [hits] = await redisPipeline([["INCR", rlKey], ["EXPIRE", rlKey, 3600, "NX"]]);
    if (typeof hits === "number" && hits > MAX_EVENTS_PER_HOUR) return { status: 429, body: { error: "Too many events." } };

    const commands: (string | number)[][] = [
      ["HINCRBY", `${p}:total`, field, 1],
      ["HINCRBY", `${p}:day:${day}`, field, 1],
    ];
    if (field === "visit") {
      const country = /^[A-Za-z]{2}$/.test(header(headers, "x-vercel-ip-country"))
        ? header(headers, "x-vercel-ip-country").toUpperCase()
        : "??";
      const device = /mobile|android|iphone|ipad/i.test(header(headers, "user-agent")) ? "mobile" : "desktop";
      commands.push(
        ["HINCRBY", `${p}:hour`, hour, 1],
        ["HINCRBY", `${p}:dow`, weekday, 1],
        ["HINCRBY", `${p}:country`, country, 1],
        ["HINCRBY", `${p}:device`, device, 1],
        ["HINCRBY", `${p}:ref`, clean(event.ref) || "direct", 1],
      );
    }
    await redisPipeline(commands);
    return ok;
  } catch (error) {
    console.error("funnel track error:", error);
    return { status: 502, body: { error: "Tracking unavailable." } };
  }
}

/* STATS_KEY protects the stats. Without it set, only local dev (key "local") can read them. */
function authorized(key: string): boolean {
  const expected = process.env.STATS_KEY;
  if (!expected) return !process.env.VERCEL && key === "local";
  if (!key) return false;
  const a = createHash("sha256").update(key).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

const toCounts = (flat: unknown): Counts => {
  const out: Counts = {};
  if (Array.isArray(flat)) for (let i = 0; i + 1 < flat.length; i += 2) out[String(flat[i])] = Number(flat[i + 1]);
  return out;
};

export async function handleStats(headers: Headers): Promise<Result> {
  if (!authorized(header(headers, "x-stats-key"))) return { status: 401, body: { error: "Wrong key." } };
  if (!redisConfig()) return { status: 503, body: { error: "Redis is not configured." } };

  const p = prefix();
  const dates: string[] = [];
  for (let i = DAYS_KEPT_IN_STATS - 1; i >= 0; i--) dates.push(clock(new Date(Date.now() - i * 86_400_000)).day);

  try {
    const rows = await redisPipeline([
      ["HGETALL", `${p}:total`], ["HGETALL", `${p}:hour`], ["HGETALL", `${p}:dow`],
      ["HGETALL", `${p}:country`], ["HGETALL", `${p}:ref`], ["HGETALL", `${p}:device`],
      ...dates.map((d) => ["HGETALL", `${p}:day:${d}`]),
    ]);
    const [total, hours, dow, country, ref, device, ...days] = rows.map(toCounts);
    return {
      status: 200,
      body: {
        timeZone: timeZone(),
        total, hours, dow, country, ref, device,
        days: dates.map((date, i) => ({ date, counts: days[i] })),
      },
    };
  } catch (error) {
    console.error("funnel stats error:", error);
    return { status: 502, body: { error: "Stats unavailable." } };
  }
}
