import { useEffect, useMemo, useState } from "react";
import "../stats.css";
import { markOwner } from "../lib/funnel";

/* Private analytics dashboard at /stats. Asks for the key, then shows the
   section funnel, the hours people visit, where they come from, and which
   buttons they click. Data comes from /api/stats (see src/lib/funnelCore.ts). */

type Counts = Record<string, number>;
type Stats = {
  timeZone: string;
  total: Counts;
  hours: Counts;
  dow: Counts;
  country: Counts;
  ref: Counts;
  device: Counts;
  days: { date: string; counts: Counts }[];
};

const KEY_STORAGE = "al-stats-key";

const STEPS: [string, string][] = [
  ["visit", "Opened the site"],
  ["s:about", "About"],
  ["s:experience", "Experience"],
  ["s:competitions", "Competitions"],
  ["s:projects", "Projects"],
  ["s:community", "Community"],
  ["s:testimonials", "Testimonials"],
  ["s:contact", "Reached Contact"],
];

const ACTIONS: [string, string][] = [
  ["a:resume_open", "Opened the resume dialog"],
  ["a:resume_email", "Requested resume by email"],
  ["a:resume_linkedin", "Requested resume on LinkedIn"],
  ["a:email_click", "Clicked Email me"],
  ["a:linkedin_click", "Clicked LinkedIn"],
  ["a:github_click", "Clicked GitHub"],
];

const PERIODS: [string, number][] = [
  ["Night", 0],
  ["Morning", 6],
  ["Afternoon", 12],
  ["Evening", 18],
];

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const n = (value: number | undefined) => value ?? 0;
const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);
const hourLabel = (h: number) => `${String(h).padStart(2, "0")}:00`;

function sum(days: Stats["days"]): Counts {
  const out: Counts = {};
  for (const d of days) for (const [k, v] of Object.entries(d.counts)) out[k] = (out[k] ?? 0) + v;
  return out;
}

function topList(counts: Counts, limit = 6) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function countryName(code: string) {
  if (code === "??") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function List({ title, rows, total, label }: { title: string; rows: [string, number][]; total: number; label?: (k: string) => string }) {
  return (
    <section className="st-card">
      <h3>{title}</h3>
      {rows.length === 0 && <p className="st-empty">No data yet</p>}
      {rows.map(([k, v]) => (
        <div className="st-row" key={k}>
          <span className="st-row-name">{label ? label(k) : k}</span>
          <span className="st-row-bar"><i style={{ width: `${pct(v, total)}%` }} /></span>
          <span className="st-row-num">{v} <small>{pct(v, total)}%</small></span>
        </div>
      ))}
    </section>
  );
}

export default function StatsPage() {
  const [key, setKey] = useState(() => {
    try { return sessionStorage.getItem(KEY_STORAGE) ?? ""; } catch { return ""; }
  });
  const [input, setInput] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [range, setRange] = useState<"7" | "30" | "all">("30");

  useEffect(() => {
    document.title = "Stats";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!key) return;
    let active = true;
    setError("");
    fetch("/api/stats", { headers: { "x-stats-key": key } })
      .then(async (response) => {
        if (response.status === 401) throw new Error("Wrong key.");
        if (!response.ok) throw new Error("Stats are unavailable right now.");
        return response.json() as Promise<Stats>;
      })
      .then((data) => {
        if (!active) return;
        setStats(data);
        markOwner(); // stop counting your own visits in this browser
        try { sessionStorage.setItem(KEY_STORAGE, key); } catch { /* ignore */ }
      })
      .catch((e: Error) => {
        if (!active) return;
        setStats(null);
        setError(e.message);
        if (e.message === "Wrong key.") {
          setKey("");
          setInput("");
          try { sessionStorage.removeItem(KEY_STORAGE); } catch { /* ignore */ }
        }
      });
    return () => { active = false; };
  }, [key]);

  const counts = useMemo<Counts>(() => {
    if (!stats) return {};
    if (range === "all") return stats.total;
    return sum(stats.days.slice(-Number(range)));
  }, [stats, range]);

  if (!stats) {
    return (
      <main className="st st-login">
        <form onSubmit={(e) => { e.preventDefault(); setKey(input.trim()); }}>
          <h1>Stats</h1>
          <p>Private. Enter your stats key.</p>
          <input type="password" autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Stats key" aria-label="Stats key" />
          <button type="submit">{key ? "Loading…" : "Open"}</button>
          {error && <p className="st-error" role="alert">{error}</p>}
        </form>
      </main>
    );
  }

  const visits = n(counts.visit);
  const steps = STEPS.map(([k, label], i) => {
    const value = n(counts[k]);
    const prev = i === 0 ? value : n(counts[STEPS[i - 1][0]]);
    return { k, label, value, drop: i === 0 || !prev ? 0 : Math.max(0, pct(prev - value, prev)) };
  });
  const worst = steps.slice(1).reduce((a, b) => (b.drop > a.drop ? b : a), steps[1]);

  const hours = Array.from({ length: 24 }, (_, h) => n(stats.hours[String(h).padStart(2, "0")]));
  const hourTotal = hours.reduce((a, b) => a + b, 0);
  const peak = hours.indexOf(Math.max(...hours));
  const maxHour = Math.max(1, ...hours);
  const periods = PERIODS.map(([label, from], i) => {
    const to = PERIODS[i + 1]?.[1] ?? 24;
    return { label, from, to, value: hours.slice(from, to).reduce((a, b) => a + b, 0) };
  });

  const dowTotal = DOW.reduce((a, d) => a + n(stats.dow[d]), 0);
  const days = stats.days.slice(-30);
  const maxDay = Math.max(1, ...days.map((d) => n(d.counts.visit)));

  return (
    <main className="st">
      <header className="st-head">
        <div>
          <h1>Stats</h1>
          <p>Times shown in {stats.timeZone}. Your own browser isn't counted.</p>
        </div>
        <div className="st-range" role="group" aria-label="Time range">
          {([["7", "7 days"], ["30", "30 days"], ["all", "All time"]] as const).map(([v, label]) => (
            <button key={v} className={range === v ? "on" : ""} onClick={() => setRange(v)}>{label}</button>
          ))}
        </div>
      </header>

      <div className="st-kpis">
        <div className="st-kpi"><b>{visits}</b><span>Sessions</span></div>
        <div className="st-kpi"><b>{pct(n(counts["s:contact"]), visits)}%</b><span>Reached Contact</span></div>
        <div className="st-kpi"><b>{n(counts["a:resume_open"])}</b><span>Resume dialogs opened</span></div>
        <div className="st-kpi"><b>{n(counts["a:email_click"]) + n(counts["a:resume_email"])}</b><span>Email clicks</span></div>
      </div>

      <section className="st-card">
        <h2>Section funnel</h2>
        <p className="st-sub">
          Share of sessions that scrolled each section into view.
          {visits >= 10 && worst && worst.drop > 0 && <> Biggest drop: <b>{worst.label}</b> (−{worst.drop}% vs the step before).</>}
        </p>
        {visits === 0 && <p className="st-empty">No visits recorded in this range yet.</p>}
        {steps.map((s) => (
          <div className="st-fn" key={s.k}>
            <span className="st-fn-name">{s.label}</span>
            <span className="st-fn-bar"><i style={{ width: `${pct(s.value, visits)}%` }} /></span>
            <span className="st-fn-num">{s.value} <small>{pct(s.value, visits)}%</small></span>
            <span className={"st-fn-drop" + (worst && s.k === worst.k && s.drop > 0 ? " hot" : "")}>{s.drop > 0 ? `−${s.drop}%` : ""}</span>
          </div>
        ))}
      </section>

      <section className="st-card">
        <h2>When people visit</h2>
        <p className="st-sub">
          All-time, by hour of day.
          {hourTotal > 0 && <> Busiest around <b>{hourLabel(peak)}–{hourLabel((peak + 1) % 24)}</b>.</>}
        </p>
        <div className="st-hours" role="img" aria-label="Visits by hour of day">
          {hours.map((v, h) => (
            <div className="st-hour" key={h} title={`${hourLabel(h)}: ${v} visits`}>
              <i className={h === peak && v > 0 ? "peak" : ""} style={{ height: `${Math.max(v ? 4 : 0, (v / maxHour) * 100)}%` }} />
              <span>{h % 3 === 0 ? h : ""}</span>
            </div>
          ))}
        </div>
        <div className="st-periods">
          {periods.map((p) => (
            <div key={p.label}>
              <b>{pct(p.value, hourTotal)}%</b>
              <span>{p.label} <small>{hourLabel(p.from)}–{hourLabel(p.to % 24)}</small></span>
            </div>
          ))}
        </div>
        <div className="st-dow">
          {DOW.map((d) => (
            <div key={d}><b>{pct(n(stats.dow[d]), dowTotal)}%</b><span>{d}</span></div>
          ))}
        </div>
      </section>

      <section className="st-card">
        <h2>Last 30 days</h2>
        <div className="st-days" role="img" aria-label="Sessions per day">
          {days.map((d) => (
            <i key={d.date} title={`${d.date}: ${n(d.counts.visit)} sessions`} style={{ height: `${Math.max(n(d.counts.visit) ? 4 : 1, (n(d.counts.visit) / maxDay) * 100)}%` }} />
          ))}
        </div>
      </section>

      <div className="st-grid">
        <List title="What people do" rows={ACTIONS.map(([k, l]) => [l, n(counts[k])] as [string, number])} total={visits} />
        <List title="Where from" rows={topList(stats.ref)} total={n(stats.total.visit)} />
        <List title="Countries" rows={topList(stats.country)} total={n(stats.total.visit)} label={countryName} />
        <List title="Devices" rows={topList(stats.device)} total={n(stats.total.visit)} />
      </div>
      <p className="st-foot">Where-from, countries, devices and hours are all-time. Tip: share links like <code>?ref=linkedin</code> to see which posts bring people.</p>
    </main>
  );
}
