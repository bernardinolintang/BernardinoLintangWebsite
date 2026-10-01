import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { competitions, profile, projects } from "../../data/portfolioContent";
import { slugify } from "../../lib/slugify";
import { askBernard, clamp, jumpTo, openPalette, useMediaQuery, useScrollFrame } from "../../lib/scrollFx";
import { CountUp } from "./shared";

/* The headline's last words roll through what a product has to survive,
   then settle on the promise. Hovering the phrase replays it. */
const OUTCOMES = ["edge cases.", "messy data.", "production.", "real users."];

/* Doubles as a mini table of contents: each node jumps to its chapter. */
const SYSTEM = [
  { label: "Data", id: "experience" },
  { label: "AI", id: "competitions" },
  { label: "Product", id: "projects" },
  { label: "People", id: "community" },
];

const ASK_CHIPS = [
  "What has Bernard shipped?",
  "Show me his strongest AI project",
  "Has he worked with real users?",
];

/* Floating "windows" around the headline, pulled from real work so the
   first screen already says: this person ships things. */
type Frag = { label: string; sub: string; image: string; slug: string };

function heroFragments(): Frag[] {
  const comp = (prefix: string, pick?: RegExp): Frag | null => {
    const c = competitions.find((x) => x.title.startsWith(prefix));
    if (!c) return null;
    const imgs = c.images ?? (c.image ? [c.image] : []);
    const image = (pick && imgs.find((i) => pick.test(decodeURIComponent(i)))) || imgs[0];
    return image ? { label: c.short, sub: `${c.place} / ${c.field}`, image, slug: slugify(c.title) } : null;
  };
  const proj = (prefix: string): Frag | null => {
    const p = projects.find((x) => x.title.startsWith(prefix));
    const image = p?.image ?? p?.images?.[0];
    return p && image
      ? { label: p.title.split(":")[0], sub: p.liveDemo ? "Live product" : p.date, image, slug: slugify(p.title) }
      : null;
  };
  return [
    comp("BlazeReport", /slides start/i),
    proj("Eksplorasi"),
    comp("NUS Datathon 2026"),
    proj("AF Tracker"),
    comp("PathwaySG", /presentation/i),
    proj("CoverCraft"),
  ].filter((f): f is Frag => !!f);
}

/* Slot positions: three down each gutter. x is from the nearest edge. */
const SLOTS = [
  { side: "left", x: 2.5, y: 4, r: -5, d: 26 },
  { side: "right", x: 3, y: 8, r: 4, d: 18 },
  { side: "left", x: 7, y: 38, r: 3, d: 14 },
  { side: "right", x: 7.5, y: 42, r: -3, d: 30 },
  { side: "left", x: 2, y: 70, r: -2, d: 20 },
  { side: "right", x: 2.5, y: 74, r: 5, d: 24 },
] as const;

function OutcomeSlot({ reduce }: { reduce: boolean }) {
  const last = OUTCOMES.length - 1;
  const [i, setI] = useState(reduce ? last : 0);
  const [run, setRun] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const measure = () => setWidths(wordRefs.current.map((el) => el?.offsetWidth ?? 0));
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (reduce) {
      setI(last);
      return;
    }
    setI(0);
    const lead = run === 0 ? 1150 : 150;
    const timers = OUTCOMES.map((_, k) => setTimeout(() => setI(k), lead + k * 560));
    return () => timers.forEach(clearTimeout);
  }, [run, reduce, last]);

  return (
    <span
      className="al-slot"
      aria-hidden="true"
      style={widths[i] ? { width: widths[i] } : undefined}
      onMouseEnter={() => {
        if (!reduce && i === last) setRun((r) => r + 1);
      }}
    >
      <span className="al-slot-col" style={{ transform: `translateY(${(-i * 100) / OUTCOMES.length}%)` }}>
        {OUTCOMES.map((w, k) => (
          <span
            key={w}
            className={"al-slot-word" + (k === i ? " is-on" : "")}
            ref={(el) => {
              wordRefs.current[k] = el;
            }}
          >
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Hero({ onResume }: { onResume: () => void }) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 1200px)");
  const heroRef = useRef<HTMLElement>(null);
  const fragRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const raf = useRef(0);
  const frags = wide ? heroFragments() : [];
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  /* Pointer drives a soft glow, a parallax drift on the windows, and pulls
     the nearest window forward. All written to CSS vars, no re-render. */
  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    const { clientX, clientY } = e;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (((clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--my", (((clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      el.style.setProperty("--px", `${clientX - r.left}px`);
      el.style.setProperty("--py", `${clientY - r.top}px`);
      let best: HTMLElement | null = null;
      let bestD = 280;
      for (const f of fragRefs.current) {
        if (!f) continue;
        const fr = f.getBoundingClientRect();
        const d = Math.hypot(clientX - (fr.left + fr.width / 2), clientY - (fr.top + fr.height / 2));
        if (d < bestD) {
          bestD = d;
          best = f;
        }
      }
      for (const f of fragRefs.current) f?.classList.toggle("is-near", f === best);
    });
  }

  /* Leaving the hero: the headline block eases back and fades, so the next
     chapter arrives over it instead of just following it. */
  useScrollFrame(() => {
    const el = heroRef.current;
    if (!el) return;
    const out = clamp(window.scrollY / (el.offsetHeight * 0.75));
    el.style.setProperty("--out", out.toFixed(3));
  }, !reduce);

  function onPointerLeave() {
    for (const f of fragRefs.current) f?.classList.remove("is-near");
  }

  return (
    <header className="al-hero" ref={heroRef} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="al-hero-glow" aria-hidden="true" />
      <div className="al-hero-top">
        {frags.map((f, k) => {
          const s = SLOTS[k];
          const style = {
            [s.side]: `${s.x}%`,
            top: `${s.y}%`,
            "--r": `${s.r}deg`,
            "--d": s.d,
            "--k": k,
          } as CSSProperties;
          return (
            <a
              key={f.slug}
              href={"#" + f.slug}
              className="al-frag"
              style={style}
              tabIndex={-1}
              aria-hidden="true"
              ref={(el) => {
                fragRefs.current[k] = el;
              }}
              onClick={(e) => {
                e.preventDefault();
                jumpTo(f.slug);
              }}
            >
              <span className="al-frag-chrome"><i /><i /><i /></span>
              <img src={f.image} alt="" loading="eager" />
              <span className="al-frag-cap">
                <b>{f.label}</b>
                <span>{f.sub}</span>
              </span>
            </a>
          );
        })}

        <div className="al-hero-copy">
          <img className="al-avatar al-rv" src="/formal-picture.JPG" alt="Bernardino Lintang" />
          <div className="al-eyebrow al-rv">BERNARDINO LINTANG · AI PRODUCT BUILDER</div>
          <h1 className="al-rv">
            I build AI products that{" "}
            <span className="al-hero-line2">
              <span className="al-grad-a">survive</span>{" "}
              <OutcomeSlot reduce={reduce} />
              <span className="al-sr">real users.</span>
            </span>
          </h1>
          <p className="al-rv">{profile.intro}</p>
          <div className="al-cta-row al-rv">
            <a className="al-btn" href="#experience">View my work</a>
            <button type="button" className="al-link" onClick={onResume}>Resume</button>
            <a className="al-link" href="#contact">Contact</a>
          </div>
        </div>
      </div>

      <div className="al-wrap">
        <nav className="al-system al-rv" aria-label="Chapters">
          {SYSTEM.map((s, i) => (
            <Fragment key={s.id}>
              {i > 0 && <span className="al-system-link" style={{ "--i": i } as CSSProperties} aria-hidden="true" />}
              <a
                href={"#" + s.id}
                className={"al-system-node" + (i === SYSTEM.length - 1 ? " is-end" : "")}
                style={{ "--i": i } as CSSProperties}
              >
                <span className="al-system-dot" aria-hidden="true" />
                {s.label}
              </a>
            </Fragment>
          ))}
        </nav>

        <div className="al-stats">
          {profile.stats.map((s) => (
            <div className="al-stat al-rv" key={s.label}>
              <CountUp value={s.value} reduce={reduce} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="al-ask al-rv">
          <button type="button" className="al-ask-bar" onClick={() => openPalette()}>
            <span className="al-ask-spark" aria-hidden="true">✦</span>
            <span className="al-ask-text">
              <b>Don't want to scroll?</b> Search or ask my portfolio
            </span>
            <kbd>{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <div className="al-ask-chips">
            {ASK_CHIPS.map((q) => (
              <button type="button" key={q} onClick={() => askBernard(q)}>
                {q} <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
