import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import "../stats.css";
import { markOwner } from "../lib/funnel";

/* Private analytics dashboard at /stats. Asks for the key, then shows the
   section funnel, when people visit (overall and per section), a day-by-day
   table, the latest individual visits, and where people come from.
   Data comes from /api/stats (see src/lib/funnelCore.ts).

   Interaction: hover anything for details; click a funnel step, day, hour,
   weekday, country, source or device to filter. Active filters show as chips
   at the top. Date, weekday and section filters reshape the whole page; hour,
   country, source and device narrow the "Recent visits" list. */

type Counts = Record<string, number>;
type Visit = {
  t: string;
  country: string;
  device: string;
  source: string;
  visitor: string;
  sections: string[];
  actions: string[];
};
type Stats = {
  timeZone: string;
  total: Counts;
  hours: Counts;
  dow: Counts;
  country: Counts;
  ref: Counts;
  device: Counts;
  recent: Visit[];
  days: { date: string; counts: Counts }[];
};
type Range = "today" | "yesterday" | "7" | "30" | "all";
type Facet = { kind: "country" | "source" | "device"; value: string };

const KEY_STORAGE = "al-stats-key";

const SECTIONS: [string, string][] = [
  ["about", "About"],
  ["experience", "Experience"],
  ["competitions", "Competitions"],
  ["projects", "Projects"],
  ["community", "Community"],
  ["testimonials", "Testimonials"],
  ["contact", "Contact"],
];

const ACTIONS: [string, string][] = [
  ["resume_open", "Opened the resume dialog"],
  ["resume_email", "Requested resume by email"],
  ["resume_linkedin", "Requested resume on LinkedIn"],
  ["email_click", "Clicked Email me"],
  ["linkedin_click", "Clicked LinkedIn"],
  ["github_click", "Clicked GitHub"],
];

const RANGES: [Range, string][] = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["7", "7 days"],
  ["30", "30 days"],
  ["all", "All time"],
];

const PERIODS: [string, number][] = [["Night", 0], ["Morning", 6], ["Afternoon", 12], ["Evening", 18]];
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DOW_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const n = (value: number | undefined) => value ?? 0;
const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);
const pad = (h: number) => String(h).padStart(2, "0");
const hourLabel = (h: number) => `${pad(h % 24)}:00`;
const sectionLabel = (id: string) => SECTIONS.find(([k]) => k === id)?.[1] ?? id;
const actionLabel = (id: string) => ACTIONS.find(([k]) => k === id)?.[1] ?? id;
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

function toggle<T>(current: T | null, next: T): T | null {
  return current === next ? null : next;
}

function sum(days: Stats["days"]): Counts {
  const out: Counts = {};
  for (const d of days) for (const [k, v] of Object.entries(d.counts)) out[k] = (out[k] ?? 0) + v;
  return out;
}

/* { "c:SG": 3, "d:mobile": 1 } with prefix "c:" gives { SG: 3 } */
function sub(counts: Counts, prefix: string): Counts {
  const out: Counts = {};
  for (const [k, v] of Object.entries(counts)) if (k.startsWith(prefix)) out[k.slice(prefix.length)] = v;
  return out;
}

const top = (counts: Counts, limit = 6): [string, number][] =>
  Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);

const total = (counts: Counts) => Object.values(counts).reduce((a, b) => a + b, 0);

function countryName(code: string) {
  if (code === "??") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

const dayLabel = (date: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(
    new Date(date + "T00:00:00Z"),
  );

const weekdayOf = (date: string) => DOW[(new Date(date + "T00:00:00Z").getUTCDay() + 6) % 7];

const dateKey = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));

const hourOf = (iso: string, tz: string) =>
  Number(new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", hourCycle: "h23" }).format(new Date(iso)));

const whenLabel = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(iso));

/* Makes any element behave like a button: click, Enter and Space. */
const press = (fn: () => void) => ({
  role: "button" as const,
  tabIndex: 0,
  onClick: fn,
  onKeyDown: (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  },
});

/* Hover tooltip that follows the pointer. Position is set straight on the
   element so moving the mouse never re-renders the page. */
function useTip() {
  const box = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<ReactNode>(null);

  const place = (e: { clientX: number; clientY: number }) => {
    const el = box.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const x = Math.max(8, Math.min(e.clientX + 14, window.innerWidth - w - 8));
    const y = e.clientY + 20 + h > window.innerHeight ? e.clientY - h - 12 : e.clientY + 20;
    el.style.transform = `translate(${x}px, ${Math.max(8, y)}px)`;
  };

  const bind = (c: ReactNode) => ({
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setContent(c);
      requestAnimationFrame(() => place(e));
    },
    onPointerMove: place,
    onPointerLeave: () => setContent(null),
  });

  const node = (
    <div ref={box} className="st-tip" role="tooltip" style={{ visibility: content ? "visible" : "hidden" }}>
      {content}
    </div>
  );
  return { bind, node };
}

type Bind = ReturnType<typeof useTip>["bind"];

function List({
  title, rows, whole, label, bind, pick, picked, hint,
}: {
  title: string;
  rows: [string, number][];
  whole: number;
  label?: (k: string) => string;
  bind: Bind;
  pick?: (k: string) => void;
  picked?: string | null;
  hint?: string;
}) {
  return (
    <section className="st-card">
      <h3>{title}</h3>
      {rows.length === 0 && <p className="st-empty">No data yet</p>}
      {rows.map(([k, v]) => {
        const name = label ? label(k) : k;
        const tip = (
          <>
            <b className="st-tip-title">{name}</b>
            <span className="st-tip-line">{plural(v, "session")} · {pct(v, whole)}% of the total</span>
            {pick && hint && <span className="st-tip-hint">{picked === k ? "Click to clear" : hint}</span>}
          </>
        );
        return (
          <div
            className={"st-row" + (pick ? " st-click" : "") + (picked === k ? " st-sel" : "")}
            key={k}
            {...bind(tip)}
            {...(pick ? press(() => pick(k)) : {})}
          >
            <span className="st-row-name">{name}</span>
            <span className="st-row-bar"><i style={{ width: `${pct(v, whole)}%` }} /></span>
            <span className="st-row-num">{v} <small>{pct(v, whole)}%</small></span>
          </div>
        );
      })}
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
  const [range, setRange] = useState<Range>("7");
  // Click filters
  const [focus, setFocus] = useState<string | null>(null); // a section id
  const [pickedDay, setPickedDay] = useState<string | null>(null);
  const [pickedDow, setPickedDow] = useState<string | null>(null);
  const [pickedHour, setPickedHour] = useState<number | null>(null);
  const [facet, setFacet] = useState<Facet | null>(null);
  const { bind, node: tipNode } = useTip();

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

  const tz = stats.timeZone;

  // ---- Which calendar days are in view ----
  const all30 = stats.days;
  const baseDays =
    range === "today" ? all30.slice(-1)
    : range === "yesterday" ? all30.slice(-2, -1)
    : range === "7" ? all30.slice(-7)
    : all30; // 30 days, and the day list behind "All time"
  const rangeDays = pickedDow ? baseDays.filter((d) => weekdayOf(d.date) === pickedDow) : baseDays;
  const selected = pickedDay ? all30.filter((d) => d.date === pickedDay) : rangeDays;
  const isAll = range === "all" && !pickedDay && !pickedDow; // true = use the all-time totals
  const counts: Counts = isAll ? stats.total : sum(selected);
  const visits = n(counts.visit);

  // ---- Funnel ----
  const steps = [["visit", "Opened the site"] as [string, string], ...SECTIONS.map(([k, l]) => [`s:${k}`, l] as [string, string])].map(
    ([k, label], i, list) => {
      const value = n(counts[k]);
      const prev = i === 0 ? value : n(counts[list[i - 1][0]]);
      const hourly = k.startsWith("s:") ? Array.from({ length: 24 }, (_, h) => n(counts[`sh:${k.slice(2)}:${pad(h)}`])) : [];
      const peakHour = hourly.length && Math.max(...hourly) > 0 ? hourly.indexOf(Math.max(...hourly)) : -1;
      return { k, id: k.slice(2), label, value, prev, peakHour, drop: i === 0 || !prev ? 0 : Math.max(0, pct(prev - value, prev)) };
    },
  );
  const worst = steps.slice(1).reduce((a, b) => (b.drop > a.drop ? b : a), steps[1]);

  // ---- Headline numbers ----
  const reached = SECTIONS.reduce((acc, [k]) => acc + n(counts[`s:${k}`]), 0);
  const newVisitors = n(counts["n:new"]);
  const returningVisitors = n(counts["n:ret"]);
  const knownVisitors = newVisitors + returningVisitors;

  // ---- When people visit (all visits, or one section) ----
  const metric = focus ?? "visit";
  const hours = Array.from({ length: 24 }, (_, h) => {
    if (metric === "visit") return isAll ? n(stats.hours[pad(h)]) : selected.reduce((a, d) => a + n(d.counts[`h:${pad(h)}`]), 0);
    return n(counts[`sh:${metric}:${pad(h)}`]);
  });
  const hourTotal = hours.reduce((a, b) => a + b, 0);
  const peak = hours.indexOf(Math.max(...hours));
  const maxHour = Math.max(1, ...hours);
  const periods = PERIODS.map(([label, from], i) => {
    const to = PERIODS[i + 1]?.[1] ?? 24;
    return { label, from, to, value: hours.slice(from, to).reduce((a, b) => a + b, 0) };
  });
  const hoursSeen = isAll ? total(stats.hours) : selected.reduce((a, d) => a + total(sub(d.counts, "h:")), 0);
  const missingDetail = !isAll && visits > hoursSeen;
  const hourClickable = metric === "visit"; // arrival hours can be matched to the visit log

  // ---- Where people come from ----
  const sources = isAll ? stats.ref : sub(counts, "r:");
  const countries = isAll ? stats.country : sub(counts, "c:");
  const devices = isAll ? stats.device : sub(counts, "d:");

  // ---- Weekdays (shown across the range, so you can compare and pick one) ----
  const dowCounts: Counts = {};
  if (range === "all") Object.assign(dowCounts, stats.dow);
  else for (const d of baseDays) dowCounts[weekdayOf(d.date)] = n(dowCounts[weekdayOf(d.date)]) + n(d.counts.visit);
  const dowTotal = total(dowCounts);

  // ---- Day-by-day table and the visit log ----
  const tableDays = (isAll ? all30 : rangeDays).slice().reverse();
  const inRange = isAll ? null : new Set(selected.map((d) => d.date));
  const inRangeVisits = stats.recent.filter((v) => !inRange || inRange.has(dateKey(v.t, tz)));
  const visitsShown = inRangeVisits.filter(
    (v) =>
      (!focus || v.sections.includes(focus)) &&
      (pickedHour === null || hourOf(v.t, tz) === pickedHour) &&
      (!facet ||
        (facet.kind === "country" && v.country === facet.value) ||
        (facet.kind === "source" && v.source === facet.value) ||
        (facet.kind === "device" && v.device === facet.value)),
  );
  const maxDay = Math.max(1, ...all30.map((d) => n(d.counts.visit)));

  // ---- Filter chips ----
  const chips: { label: string; clear: () => void }[] = [];
  if (pickedDay) chips.push({ label: dayLabel(pickedDay), clear: () => setPickedDay(null) });
  if (pickedDow) chips.push({ label: `Only ${DOW_FULL[DOW.indexOf(pickedDow)]}s`, clear: () => setPickedDow(null) });
  if (focus) chips.push({ label: `Reached ${sectionLabel(focus)}`, clear: () => setFocus(null) });
  if (pickedHour !== null) chips.push({ label: `Arrived ${hourLabel(pickedHour)}–${hourLabel(pickedHour + 1)}`, clear: () => setPickedHour(null) });
  if (facet) {
    const kind = { country: "Country", source: "From", device: "Device" }[facet.kind];
    chips.push({ label: `${kind}: ${facet.kind === "country" ? countryName(facet.value) : facet.value}`, clear: () => setFacet(null) });
  }
  const clearAll = () => {
    setFocus(null); setPickedDay(null); setPickedDow(null); setPickedHour(null); setFacet(null);
  };

  const chooseRange = (r: Range) => {
    setRange(r);
    setPickedDay(null);
  };
  const chooseDay = (date: string) => {
    setPickedDay((cur) => toggle(cur, date));
    setPickedDow(null);
  };
  const chooseDow = (d: string) => {
    setPickedDow((cur) => toggle(cur, d));
    setPickedDay(null);
  };
  const pickFacet = (kind: Facet["kind"]) => (value: string) =>
    setFacet((cur) => (cur && cur.kind === kind && cur.value === value ? null : { kind, value }));

  const kpi = (value: ReactNode, label: string, tip: string) => (
    <div className="st-kpi" {...bind(<span className="st-tip-line">{tip}</span>)}>
      <b>{value}</b><span>{label}</span>
    </div>
  );

  return (
    <main className="st">
      {tipNode}
      <header className="st-head">
        <div>
          <h1>Stats</h1>
          <p>Times shown in {tz}. Your own browser isn't counted.</p>
        </div>
        <div className="st-range" role="group" aria-label="Time range">
          {RANGES.map(([v, label]) => (
            <button key={v} className={range === v && !pickedDay ? "on" : ""} onClick={() => chooseRange(v)}>{label}</button>
          ))}
        </div>
      </header>

      <div className="st-filters" aria-live="polite">
        {chips.length === 0 ? (
          <span className="st-hint">Hover for details. Click a funnel step, day, hour, weekday, country or source to filter.</span>
        ) : (
          <>
            <span className="st-hint">Filtering:</span>
            {chips.map((c) => (
              <button key={c.label} className="st-chip" onClick={c.clear} title="Remove this filter">{c.label} <span aria-hidden="true">✕</span></button>
            ))}
            {chips.length > 1 && <button className="st-chip st-chip-clear" onClick={clearAll}>Clear all</button>}
          </>
        )}
      </div>

      <div className="st-kpis">
        {kpi(visits, "Sessions", "One visit to your site. Refreshing or coming back in the same tab doesn't count twice.")}
        {kpi(`${visits ? pct(visits - n(counts["s:about"]), visits) : 0}%`, "Left before About", "Sessions that never scrolled the About section into view, so they left almost straight away.")}
        {kpi(visits ? (reached / visits).toFixed(1) : "0.0", "Sections seen per visit (of 7)", "The average number of the 7 sections (About to Contact) that a visitor scrolled into view.")}
        {kpi(`${pct(n(counts["s:contact"]), visits)}%`, "Reached Contact", "Sessions that scrolled all the way down to the Contact section at the bottom.")}
        {kpi(knownVisitors ? `${pct(newVisitors, knownVisitors)}%` : "–", `New visitors (${returningVisitors} returning)`, "A new visitor is a browser that hasn't opened your site before. Returning means it has. Only counted from the day this was added.")}
        {kpi(n(counts["a:resume_open"]), "Resume dialogs opened", "People who clicked the resume button and saw the 'Let's connect first' box.")}
        {kpi(n(counts["a:email_click"]) + n(counts["a:resume_email"]), "Email clicks", "Clicks on 'Email me' plus the email button inside the resume box.")}
        {kpi(n(counts["a:linkedin_click"]) + n(counts["a:github_click"]), "LinkedIn + GitHub clicks", "Clicks on your LinkedIn or GitHub profile links.")}
      </div>

      <section className="st-card">
        <h2>Section funnel</h2>
        <p className="st-sub">
          Share of sessions that scrolled each section into view, and the hour people most often reach it. Click a step to follow just that section.
          {visits >= 10 && worst && worst.drop > 0 && <> Biggest drop: <b>{worst.label}</b> (−{worst.drop}% vs the step before).</>}
        </p>
        {visits === 0 && <p className="st-empty">No visits recorded in this range yet.</p>}
        <div className="st-fn st-fn-head" aria-hidden="true">
          <span /><span /><span>Sessions</span><span>Drop</span><span>Peak hour</span>
        </div>
        {steps.map((s, i) => {
          const isSection = i > 0;
          const tip = (
            <>
              <b className="st-tip-title">{s.label}</b>
              <span className="st-tip-line">{plural(s.value, "session")} · {pct(s.value, visits)}% of all visits</span>
              {isSection && s.prev > s.value && <span className="st-tip-line">{s.prev - s.value === 1 ? "1 person" : `${s.prev - s.value} people`} didn't continue from the step before (−{s.drop}%)</span>}
              {isSection && s.peakHour >= 0 && <span className="st-tip-line">Most often reached around {hourLabel(s.peakHour)}</span>}
              {isSection && <span className="st-tip-hint">{focus === s.id ? "Click to clear" : "Click to follow this section"}</span>}
            </>
          );
          return (
            <div
              className={"st-fn" + (isSection ? " st-click" : "") + (focus === s.id ? " st-sel" : "")}
              key={s.k}
              {...bind(tip)}
              {...(isSection ? press(() => setFocus((cur) => toggle(cur, s.id))) : {})}
            >
              <span className="st-fn-name">{s.label}</span>
              <span className="st-fn-bar"><i style={{ width: `${pct(s.value, visits)}%` }} /></span>
              <span className="st-fn-num">{s.value} <small>{pct(s.value, visits)}%</small></span>
              <span className={"st-fn-drop" + (worst && s.k === worst.k && s.drop > 0 ? " hot" : "")}>{s.drop > 0 ? `−${s.drop}%` : ""}</span>
              <span className="st-fn-peak">{s.peakHour >= 0 ? hourLabel(s.peakHour) : ""}</span>
            </div>
          );
        })}
      </section>

      <section className="st-card">
        <h2>When people visit</h2>
        <div className="st-chips" role="group" aria-label="What to chart">
          {[["visit", "All visits"] as [string, string], ...SECTIONS].map(([k, label]) => (
            <button key={k} className={metric === k ? "on" : ""} onClick={() => setFocus(k === "visit" ? null : k)}>
              {k === "visit" ? label : `Saw ${label}`}
            </button>
          ))}
        </div>
        <p className="st-sub">
          {metric === "visit" ? "Visits" : `Sessions that reached ${sectionLabel(metric)}`} by hour of day.
          {hourTotal > 0 && <> Busiest around <b>{hourLabel(peak)}–{hourLabel(peak + 1)}</b>.</>}
          {hourClickable && " Click a bar to list the visits that arrived in that hour."}
        </p>
        <div className="st-hours" role="img" aria-label="By hour of day">
          {hours.map((v, h) => {
            const tip = (
              <>
                <b className="st-tip-title">{hourLabel(h)}–{hourLabel(h + 1)}</b>
                <span className="st-tip-line">{plural(v, metric === "visit" ? "visit" : "session")} · {pct(v, hourTotal)}% of the total</span>
                {hourClickable && v > 0 && <span className="st-tip-hint">{pickedHour === h ? "Click to clear" : "Click to list these visits"}</span>}
              </>
            );
            return (
              <div
                className={"st-hour" + (hourClickable ? " st-click" : "") + (pickedHour === h ? " st-sel" : "")}
                key={h}
                {...bind(tip)}
                {...(hourClickable ? press(() => setPickedHour((cur) => toggle(cur, h))) : {})}
              >
                <i className={h === peak && v > 0 ? "peak" : ""} style={{ height: `${Math.max(v ? 4 : 0, (v / maxHour) * 100)}%` }} />
                <span>{h % 3 === 0 ? h : ""}</span>
              </div>
            );
          })}
        </div>
        <div className="st-periods">
          {periods.map((p) => (
            <div key={p.label} {...bind(<><b className="st-tip-title">{p.label}</b><span className="st-tip-line">{hourLabel(p.from)}–{hourLabel(p.to)} · {plural(p.value, metric === "visit" ? "visit" : "session")}</span></>)}>
              <b>{pct(p.value, hourTotal)}%</b>
              <span>{p.label} <small>{hourLabel(p.from)}–{hourLabel(p.to)}</small></span>
            </div>
          ))}
        </div>
        {range !== "today" && range !== "yesterday" && !pickedDay && (
          <>
            <p className="st-sub st-sub-tight">Share of visits by weekday. Click one to see only that weekday.</p>
            <div className="st-dow">
              {DOW.map((d, i) => (
                <div
                  key={d}
                  className={"st-click" + (pickedDow === d ? " st-sel" : "")}
                  {...bind(<><b className="st-tip-title">{DOW_FULL[i]}</b><span className="st-tip-line">{plural(n(dowCounts[d]), "visit")} · {pct(n(dowCounts[d]), dowTotal)}% of the week</span><span className="st-tip-hint">{pickedDow === d ? "Click to clear" : `Click to see only ${DOW_FULL[i]}s`}</span></>)}
                  {...press(() => chooseDow(d))}
                >
                  <b>{pct(n(dowCounts[d]), dowTotal)}%</b><span>{d}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {range === "all" && pickedDow && <p className="st-note">Weekday filtering uses the last 30 days of daily data.</p>}
        {missingDetail && (
          <p className="st-note">{plural(visits - hoursSeen, "visit")} in this range came before hourly detail was added, so {visits - hoursSeen === 1 ? "it's" : "they're"} missing from the hour, country and source breakdowns.</p>
        )}
      </section>

      {range !== "today" && range !== "yesterday" && (
        <section className="st-card">
          <h2>Day by day</h2>
          <p className="st-sub">
            How many sessions reached each section on each date. Darker means a larger share of that day's visitors.
            {" "}Click a date to view just that day, a number to see that section on that day, or a column title to follow a section.
            {range === "all" && " Showing the last 30 days."}
          </p>
          <div className="st-scroll st-scroll-days">
            <table className="st-table">
              <thead>
                <tr>
                  <th>Date</th><th>Sessions</th>
                  {SECTIONS.map(([k, l]) => (
                    <th key={k} className={"st-click" + (focus === k ? " st-sel" : "")} {...press(() => setFocus((cur) => toggle(cur, k)))}>{l}</th>
                  ))}
                  <th>Resume</th><th>Email</th>
                </tr>
              </thead>
              <tbody>
                {tableDays.map((d) => {
                  const v = n(d.counts.visit);
                  const dayPicked = pickedDay === d.date;
                  return (
                    <tr key={d.date} className={(v ? "" : "st-zero") + (dayPicked ? " st-sel" : "")}>
                      <td className="st-click" {...bind(<><b className="st-tip-title">{dayLabel(d.date)}</b><span className="st-tip-line">{plural(v, "session")}</span><span className="st-tip-hint">{dayPicked ? "Click to clear" : "Click to view just this day"}</span></>)} {...press(() => chooseDay(d.date))}>{dayLabel(d.date)}</td>
                      <td className="st-strong">{v}</td>
                      {SECTIONS.map(([k, l]) => {
                        const c = n(d.counts[`s:${k}`]);
                        return (
                          <td
                            key={k}
                            className={"st-click" + (focus === k ? " st-colsel" : "")}
                            style={c ? { background: `rgba(167,139,250,${0.12 + 0.5 * (v ? c / v : 0)})` } : undefined}
                            {...bind(<><b className="st-tip-title">{dayLabel(d.date)} · {l}</b><span className="st-tip-line">{c} of {plural(v, "session")} reached it ({pct(c, v)}%)</span><span className="st-tip-hint">Click to filter to this day and section</span></>)}
                            {...press(() => { setPickedDay(d.date); setPickedDow(null); setFocus(k); })}
                          >
                            {c || ""}
                          </td>
                        );
                      })}
                      <td>{n(d.counts["a:resume_open"]) || ""}</td>
                      <td>{n(d.counts["a:email_click"]) + n(d.counts["a:resume_email"]) || ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="st-card">
        <h2>Recent visits</h2>
        <p className="st-sub">
          The latest individual visits, newest first. Each row is one session; nobody is identified. Hover the dots to see which sections they reached.
          {" "}{visitsShown.length === inRangeVisits.length
            ? `Showing ${inRangeVisits.length}.`
            : `Showing ${visitsShown.length} of ${inRangeVisits.length} that match your filters.`}
        </p>
        {visitsShown.length === 0 && <p className="st-empty">No visits match this range and filters yet.</p>}
        {visitsShown.length > 0 && (
          <div className="st-scroll st-scroll-visits">
            <table className="st-table st-visits">
              <thead>
                <tr><th>When</th><th>From</th><th>Country</th><th>Device</th><th>Visitor</th><th>Journey</th><th>Got as far as</th><th>Did</th></tr>
              </thead>
              <tbody>
                {visitsShown.map((v, i) => {
                  const furthest = SECTIONS.map(([k]) => k).filter((k) => v.sections.includes(k)).pop();
                  return (
                    <tr key={v.t + i}>
                      <td>{whenLabel(v.t, tz)}</td>
                      <td>{v.source}</td>
                      <td>{countryName(v.country)}</td>
                      <td>{v.device}</td>
                      <td>{v.visitor === "ret" ? "Returning" : "New"}</td>
                      <td>
                        <span className="st-dots">
                          {SECTIONS.map(([k, l]) => (
                            <i key={k} className={v.sections.includes(k) ? "on" : ""} {...bind(<span className="st-tip-line">{l}: {v.sections.includes(k) ? "reached" : "not reached"}</span>)} />
                          ))}
                        </span>
                      </td>
                      <td>{furthest ? sectionLabel(furthest) : <span className="st-dim">Left early</span>}</td>
                      <td>{v.actions.length ? v.actions.map(actionLabel).join(", ") : <span className="st-dim">–</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="st-card">
        <h2>Last 30 days</h2>
        <p className="st-sub st-sub-tight">Click a bar to view just that day.</p>
        <div className="st-days" role="img" aria-label="Sessions per day">
          {all30.map((d) => {
            const v = n(d.counts.visit);
            const tip = (
              <>
                <b className="st-tip-title">{dayLabel(d.date)}</b>
                <span className="st-tip-line">{plural(v, "session")}</span>
                <span className="st-tip-line">{n(d.counts["s:contact"])} reached Contact · {n(d.counts["a:resume_open"])} opened the resume box</span>
                <span className="st-tip-hint">{pickedDay === d.date ? "Click to clear" : "Click to view just this day"}</span>
              </>
            );
            return (
              <div className={"st-day st-click" + (pickedDay === d.date ? " st-sel" : "")} key={d.date} {...bind(tip)} {...press(() => chooseDay(d.date))}>
                <i style={{ height: `${Math.max(v ? 4 : 1, (v / maxDay) * 100)}%` }} />
              </div>
            );
          })}
        </div>
        <div className="st-days-axis"><span>{dayLabel(all30[0].date)}</span><span>Today</span></div>
      </section>

      <div className="st-grid">
        <List title="What people do" rows={ACTIONS.map(([k, l]) => [l, n(counts[`a:${k}`])] as [string, number])} whole={visits} bind={bind} />
        <List title="Where from" rows={top(sources)} whole={total(sources)} bind={bind} pick={pickFacet("source")} picked={facet?.kind === "source" ? facet.value : null} hint="Click to list visits from here" />
        <List title="Countries" rows={top(countries)} whole={total(countries)} label={countryName} bind={bind} pick={pickFacet("country")} picked={facet?.kind === "country" ? facet.value : null} hint="Click to list visits from here" />
        <List title="Devices" rows={top(devices)} whole={total(devices)} bind={bind} pick={pickFacet("device")} picked={facet?.kind === "device" ? facet.value : null} hint="Click to list these visits" />
      </div>
      <p className="st-foot">Tip: share links like <code>?ref=linkedin</code> to see which posts bring people.</p>
    </main>
  );
}
