import { useMemo, useRef, useState, type CSSProperties } from "react";
import { experiences, profile, type Experience } from "../../data/portfolioContent";
import { slugify } from "../../lib/slugify";
import {
  PIN_QUERY, askBernard, clamp, pinProgress, useHashTarget, useMediaQuery, useScrollFrame,
} from "../../lib/scrollFx";
import { SectionTitle, TagList } from "./shared";

/* ==========================================================================
   EXPERIENCE: the career rail.
   A timeline with three swimlanes (Data / AI / Product). Each internship is
   drawn in the lanes it leaned on, so the rail itself tells the story of
   moving from data work toward AI products. On desktop the section pins and
   scrolling moves a playhead through every role; the panel below morphs to
   the active one. Narrow screens get a plain vertical timeline instead.
   ========================================================================== */

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const LANES = [
  { key: "data", label: "Data" },
  { key: "ai", label: "AI" },
  { key: "product", label: "Product" },
] as const;

/* The open end of the rail. Kept in step with profile.availability. */
const NEXT = { month: 2027 * 12 + 5, label: "Next", when: "mid-2027" };

/* Scroll distance (in vh) spent on each stop while pinned. */
const STEP_VH = 62;

type Stop = {
  exp: Experience;
  slug: string;
  start: number; // months since year 0, fractional for drawing
  end: number;
  range: string;
  location?: string;
};

function parsePeriod(period: string) {
  const [range, location] = period.split("·").map((s) => s.trim());
  const hits = [...range.matchAll(/([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/g)].map(
    (m) => Number(m[2]) * 12 + MONTHS.indexOf(m[1].toLowerCase()),
  );
  const start = hits[0] ?? 0;
  const end = (hits[hits.length - 1] ?? start) + 1;
  return { start, end, range, location };
}

function buildStops(): Stop[] {
  const stops = experiences
    .map((exp) => ({ exp, slug: slugify(exp.company), ...parsePeriod(exp.period) }))
    .sort((a, b) => a.start - b.start);
  // Back-to-back roles that share a month meet in the middle of it, so
  // neighbouring bars touch instead of overlapping.
  for (let i = 1; i < stops.length; i++) {
    if (stops[i].start < stops[i - 1].end) {
      const mid = (stops[i].start + stops[i - 1].end) / 2;
      stops[i - 1].end = mid;
      stops[i].start = mid;
    }
  }
  return stops;
}

const pad = (n: number) => String(n).padStart(2, "0");

function Lanes({ on }: { on: Experience["lanes"] }) {
  return (
    <div className="al-lanes" aria-label={"Leaned on: " + on.join(", ")}>
      {LANES.map((l) => (
        <span key={l.key} className={"al-lane al-lane-" + l.key + (on.includes(l.key) ? " is-on" : "")}>
          {l.label}
        </span>
      ))}
    </div>
  );
}

function StopDetail({ stop }: { stop: Stop }) {
  const x = stop.exp;
  return (
    <>
      <div className="al-stage-id">
        {x.logo && (
          <img
            className="al-exp-logo"
            src={x.logo}
            alt={x.company + " logo"}
            loading="lazy"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        )}
        <div className="al-stage-name">{x.short}</div>
        <div className="al-stage-role">{x.title}</div>
        <div className="al-stage-org">{x.company}</div>
        <div className="al-stage-meta">
          {stop.range}
          {stop.location ? " · " + stop.location : ""}
        </div>
        <div className="al-stage-focus">{x.focus}</div>
        <Lanes on={x.lanes} />
      </div>
      <div className="al-stage-body">
        <ul className="al-bullets">
          {x.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
        {x.angle && <p className="al-angle"><b>Product angle:</b> {x.angle}</p>}
        <TagList tags={x.tags} max={4} />
        {x.links && x.links.length > 0 && (
          <div className="al-links-row">
            {x.links.map((l) => (
              <a className="al-link" key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function NextDetail() {
  return (
    <>
      <div className="al-stage-id">
        <div className="al-stage-name">Next<span className="al-stage-q">?</span></div>
        <div className="al-stage-role">Graduate role · {NEXT.when}</div>
        <div className="al-stage-focus">AI · ML · Data Engineering</div>
        <Lanes on={["data", "ai", "product"]} />
      </div>
      <div className="al-stage-body al-stage-next">
        <p>{profile.availability} If you're building production AI systems and need someone who ships, this is where you come in.</p>
        <div className="al-cta-row al-cta-left">
          <a className="al-btn" href="#contact">Let's talk</a>
          <button type="button" className="al-link" onClick={() => askBernard("Why would Bernard be a strong hire for an AI team?")}>
            Ask why
          </button>
        </div>
      </div>
    </>
  );
}

export function CareerRail() {
  const stops = useMemo(buildStops, []);
  const slugs = useMemo(() => stops.map((s) => s.slug), [stops]);
  const pinned = useMediaQuery(PIN_QUERY);
  const wide = useMediaQuery("(min-width: 900px)");
  const [active, setActive] = useState(0);
  const pinRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const steps = stops.length + 1; // every role, then "what's next"

  /* Map months to % along the rail */
  const t0 = Math.floor(stops[0].start) - 1;
  const t1 = NEXT.month + 2;
  const pos = (m: number) => ((m - t0) / (t1 - t0)) * 100;
  const centers = [...stops.map((s) => pos((s.start + s.end) / 2)), pos(NEXT.month + 0.5)];
  const now = new Date();
  const nowMonth = now.getFullYear() * 12 + now.getMonth() + 0.5;
  const years: { y: number; at: number }[] = [];
  for (let y = Math.floor(t0 / 12); y <= Math.floor(t1 / 12); y++) {
    years.push({ y, at: Math.max(0, pos(y * 12)) });
  }

  /* Pinned: scroll position → playhead + active stop */
  useScrollFrame(() => {
    const el = pinRef.current;
    const rail = railRef.current;
    if (!el || !rail) return;
    const s = clamp(pinProgress(el) * steps - 0.5, 0, steps - 1);
    const a = Math.floor(s);
    const b = Math.min(steps - 1, a + 1);
    const t = s - a;
    const eased = t * t * (3 - 2 * t);
    rail.style.setProperty("--ph", `${centers[a] + (centers[b] - centers[a]) * eased}%`);
    const idx = Math.round(s);
    setActive((prev) => (prev === idx ? prev : idx));
  }, pinned);

  /* Not pinned: deep links (chat evidence, shared URLs) pick the stop */
  useHashTarget(slugs, (i) => {
    if (!pinned) setActive(i);
  });

  const go = (i: number) => {
    if (!pinned) return setActive(i);
    // Cut straight to the chosen stop. A smooth scroll would pass through
    // every role in between and flash each card on the way.
    const id = i < stops.length ? stops[i].slug : "whats-next";
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
  };

  const rail = (
    <div
      className={"al-rail" + (pinned ? "" : " is-static")}
      ref={railRef}
      style={{ "--ph": `${centers[pinned ? 0 : active]}%` } as CSSProperties}
    >
      <div className="al-rail-track">
        <div className="al-rail-years" aria-hidden="true">
          {years.map((y) => (
            <span key={y.y} style={{ left: `${y.at}%` }}>{y.y}</span>
          ))}
        </div>
        <div className="al-rail-names">
          {stops.map((s, i) => (
            <button
              type="button"
              key={s.slug}
              className={"al-rail-name" + (i === active ? " is-on" : "")}
              style={{ left: `${centers[i]}%` }}
              onClick={() => go(i)}
              aria-label={`${s.exp.title} at ${s.exp.company}`}
              aria-current={i === active ? "step" : undefined}
            >
              {s.exp.short}
            </button>
          ))}
          <button
            type="button"
            className={"al-rail-name al-rail-name-next" + (active === stops.length ? " is-on" : "")}
            style={{ left: `${centers[stops.length]}%` }}
            onClick={() => go(stops.length)}
            aria-label="What's next"
          >
            ?
          </button>
        </div>
        <div className="al-rail-grid" aria-hidden="true">
          {LANES.map((l) => (
            <div className="al-rail-lane" key={l.key}>
              <span className="al-rail-lane-label">{l.label}</span>
              {stops.map((s, i) =>
                s.exp.lanes.includes(l.key) ? (
                  <span
                    key={s.slug}
                    className={
                      "al-rail-bar al-bar-" + l.key +
                      (i === active ? " is-on" : i < active ? " is-past" : "")
                    }
                    style={{ left: `${pos(s.start)}%`, width: `${pos(s.end) - pos(s.start)}%` }}
                  />
                ) : null,
              )}
              <span
                className={"al-rail-bar al-rail-bar-next" + (active === stops.length ? " is-on" : "")}
                style={{ left: `${pos(NEXT.month)}%`, width: `${pos(NEXT.month + 1) - pos(NEXT.month)}%` }}
              />
            </div>
          ))}
          <span className="al-rail-now" style={{ left: `${pos(nowMonth)}%` }}><i>Now</i></span>
          <span className="al-rail-head" />
        </div>
      </div>
    </div>
  );

  /* Every card is laid out in the same grid cell and only the active one is
     shown, so the card is always as tall as the longest role and nothing
     around it moves as you step through the timeline. */
  const stage = (
    <div className="al-stage-stack" id="exp-stage">
      {stops.map((s, i) => (
        <div className={"al-stage" + (i === active ? " is-on" : "")} aria-hidden={i !== active} key={s.slug}>
          <StopDetail stop={s} />
        </div>
      ))}
      <div className={"al-stage" + (active === stops.length ? " is-on" : "")} aria-hidden={active !== stops.length}>
        <NextDetail />
      </div>
    </div>
  );

  /* ---------- narrow screens: vertical timeline, newest first ---------- */
  if (!wide) {
    return (
      <section className="al-section" id="experience">
        <div className="al-wrap">
          <SectionTitle title="Experience." kicker="Production, not prototypes." chapter="02" note={`${stops.length} internships`} />
          <ol className="al-tl">
            {[...stops].reverse().map((s) => (
              <li className="al-tl-item al-rv" id={s.slug} key={s.slug}>
                <StopDetail stop={s} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  /* ---------- wide, not pinned (reduced motion / short window): click-through ---------- */
  if (!pinned) {
    return (
      <section className="al-section" id="experience">
        <div className="al-wrap">
          <div className="al-pin-head">
            <SectionTitle title="Experience." kicker="Production, not prototypes." chapter="02" note={`${stops.length} internships`} />
            <span className="al-counter">{pad(active + 1)} / {pad(steps)}</span>
          </div>
          {slugs.map((s) => <span key={s} id={s} className="al-anchor" data-hl="exp-stage" />)}
          {rail}
          {stage}
        </div>
      </section>
    );
  }

  /* ---------- pinned ---------- */
  return (
    <section id="experience">
      <div
        className="al-pin"
        ref={pinRef}
        style={{ height: `calc(100vh - 48px + ${steps * STEP_VH}vh)` }}
      >
        {stops.map((s, i) => (
          <span
            key={s.slug}
            id={s.slug}
            className="al-anchor"
            data-hl="exp-stage"
            style={{ top: `${(i + 0.5) * STEP_VH}vh` }}
          />
        ))}
        <span id="whats-next" className="al-anchor" style={{ top: `${(steps - 0.5) * STEP_VH}vh` }} />
        <div className="al-pin-view">
          <div className="al-wrap al-pin-inner">
            <div className="al-pin-head">
              <SectionTitle title="Experience." kicker="Production, not prototypes." chapter="02" note={`${stops.length} internships`} />
              <span className="al-counter">{pad(active + 1)} / {pad(steps)}</span>
            </div>
            {rail}
            {stage}
          </div>
        </div>
      </div>
    </section>
  );
}
