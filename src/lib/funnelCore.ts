/* Funnel analytics core, shared by the Vercel functions (api/track.ts,
   api/stats.ts) and the Vite dev middleware.

   The browser reports three kinds of event, each at most once per session:
     visit   - opened the site (with referrer, new/returning)
     section - scrolled a section into view
     action  - clicked Email / GitHub / LinkedIn, opened the resume dialog
   Counts live in Redis hashes (one overall, one per calendar day), so the
   stats page can filter by day and show where people drop off and when they
   visit. Each session also gets a small record (random id, time, country,
   device, source, sections reached) for the "recent visits" log, kept 90
   days. No IPs, names or accounts are stored. */

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
type Command = (string | number)[];
type Result = { status: number; body: unknown };

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|telegram|vercel|curl|wget/i;
const SESSION_ID = /^[a-zA-Z0-9-]{8,40}$/;
const MAX_EVENTS_PER_HOUR = 300;
const DAYS_KEPT_IN_STATS = 30;
const SESSION_TTL_SECONDS = 90 * 86_400;
const RECENT_SESSIONS_KEPT = 500;
const RECENT_SESSIONS_SHOWN = 100;

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

  const event = (body ?? {}) as { type?: unknown; id?: unknown; ref?: unknown; sid?: unknown; ret?: unknown };
  const p = prefix();
  const { day, hour, weekday } = clock(new Date());
  const sid = typeof event.sid === "string" && SESSION_ID.test(event.sid) ? event.sid : "";

  let field: string;
  if (event.type === "visit") field = "visit";
  else if (event.type === "section" && (SECTIONS as readonly unknown[]).includes(event.id)) field = `s:${event.id}`;
  else if (event.type === "action" && (ACTIONS as readonly unknown[]).includes(event.id)) field = `a:${event.id}`;
  else return { status: 400, body: { error: "Unknown event." } };

  try {
    // Cap events per visitor per hour so a script can't flood the counters.
    const rlKey = `${p}:rl:${createHash("sha256").update(ip).digest("hex").slice(0, 16)}`;
    const sessKey = `${p}:sess:${sid}`;
    const startsSession = field === "visit" && sid !== "";
    const gate: Command[] = [["INCR", rlKey], ["EXPIRE", rlKey, 3600, "NX"]];
    if (startsSession) gate.push(["HSETNX", sessKey, "t", new Date().toISOString()]);
    const gated = await redisPipeline(gate);
    if (typeof gated[0] === "number" && gated[0] > MAX_EVENTS_PER_HOUR) return { status: 429, body: { error: "Too many events." } };
    if (startsSession && gated[2] === 0) return ok; // this session's visit was already counted

    // Fields bumped in both the overall hash and today's hash.
    const fields = [field];
    let country = "??";
    let device = "desktop";
    let source = "direct";
    let returning = false;
    if (field === "visit") {
      const code = header(headers, "x-vercel-ip-country");
      if (/^[A-Za-z]{2}$/.test(code)) country = code.toUpperCase();
      if (/mobile|android|iphone|ipad/i.test(header(headers, "user-agent"))) device = "mobile";
      source = clean(event.ref) || "direct";
      returning = event.ret === true;
      fields.push(`h:${hour}`, `c:${country}`, `d:${device}`, `r:${source}`, returning ? "n:ret" : "n:new");
    } else if (field.startsWith("s:")) {
      fields.push(`sh:${event.id}:${hour}`);
    }

    const commands: Command[] = fields.flatMap((f): Command[] => [
      ["HINCRBY", `${p}:total`, f, 1],
      ["HINCRBY", `${p}:day:${day}`, f, 1],
    ]);
    if (field === "visit") {
      // All-time breakdowns that predate the per-day fields.
      commands.push(
        ["HINCRBY", `${p}:hour`, hour, 1],
        ["HINCRBY", `${p}:dow`, weekday, 1],
        ["HINCRBY", `${p}:country`, country, 1],
        ["HINCRBY", `${p}:device`, device, 1],
        ["HINCRBY", `${p}:ref`, source, 1],
      );
    }
    if (sid) {
      if (field === "visit") {
        commands.push(
          ["HSET", sessKey, "c", country, "d", device, "r", source, "n", returning ? "ret" : "new"],
          ["LPUSH", `${p}:recent`, sid],
          ["LTRIM", `${p}:recent`, 0, RECENT_SESSIONS_KEPT - 1],
        );
      } else {
        commands.push(["HSET", sessKey, field, 1]);
      }
      commands.push(["EXPIRE", sessKey, SESSION_TTL_SECONDS]);
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

const toMap = (flat: unknown): Record<string, string> => {
  const out: Record<string, string> = {};
  if (Array.isArray(flat)) for (let i = 0; i + 1 < flat.length; i += 2) out[String(flat[i])] = String(flat[i + 1]);
  return out;
};

const toCounts = (flat: unknown): Counts => {
  const out: Counts = {};
  for (const [k, v] of Object.entries(toMap(flat))) out[k] = Number(v);
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
      ...dates.map((d): Command => ["HGETALL", `${p}:day:${d}`]),
      ["LRANGE", `${p}:recent`, 0, RECENT_SESSIONS_SHOWN - 1],
    ]);
    const [total, hours, dow, country, ref, device] = rows.slice(0, 6).map(toCounts);
    const days = rows.slice(6, 6 + dates.length).map(toCounts);
    const recentIds = (rows[6 + dates.length] as string[]) ?? [];

    const records = recentIds.length
      ? await redisPipeline(recentIds.map((id): Command => ["HGETALL", `${p}:sess:${id}`]))
      : [];
    const recent = records
      .map((flat) => toMap(flat))
      .filter((r) => r.t)
      .map((r) => ({
        t: r.t,
        country: r.c ?? "??",
        device: r.d ?? "desktop",
        source: r.r ?? "direct",
        visitor: r.n ?? "new",
        sections: Object.keys(r).filter((k) => k.startsWith("s:")).map((k) => k.slice(2)),
        actions: Object.keys(r).filter((k) => k.startsWith("a:")).map((k) => k.slice(2)),
      }));

    return {
      status: 200,
      body: {
        timeZone: timeZone(),
        total, hours, dow, country, ref, device, recent,
        days: dates.map((date, i) => ({ date, counts: days[i] })),
      },
    };
  } catch (error) {
    console.error("funnel stats error:", error);
    return { status: 502, body: { error: "Stats unavailable." } };
  }
}
