import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { profile, projects, type Project } from "../../data/portfolioContent";
import { slugify } from "../../lib/slugify";
import { PIN_QUERY, clamp, pinProgress, useMediaQuery, useScrollFrame } from "../../lib/scrollFx";
import { ScrollCarouselRow } from "../ScrollCarouselRow";
import { DetailModal, SectionTitle, TagList, hostOf, type DetailContent } from "./shared";

/* ==========================================================================
   PROJECTS: the product reel.
   Every project is a "product window" (browser chrome + live URL). On
   desktop the section pins and vertical scrolling slides the reel sideways,
   one window at a time. Elsewhere it's a swipeable row. The full write-up
   for any project opens in a modal.
   ========================================================================== */

const pad = (n: number) => String(n).padStart(2, "0");

/* Pixels of vertical scroll per pixel the reel travels sideways.
   Below 1 the reel moves faster than the page scrolls. */
const PACE = 0.75;

function chromeLabel(p: Project) {
  return hostOf(p.liveDemo) ?? (p.date.includes("·") ? p.date.split("·")[0].trim() : p.tags[0]);
}

function toDetail(p: Project): DetailContent {
  return {
    title: p.title,
    meta: p.date,
    images: p.images ?? (p.image ? [p.image] : []),
    imagePositions: p.imagePositions,
    imageFit: p.imageFit,
    description: p.description,
    sections: [
      ...(p.problem ? [{ label: "Problem", text: p.problem }] : []),
      ...(p.productDecision ? [{ label: "Product decision", text: p.productDecision }] : []),
    ],
    tags: p.tags,
    pmTags: p.pmTags,
    links: [
      ...(p.liveDemo ? [{ href: p.liveDemo, label: "Live demo" }] : []),
      ...(p.github ? [{ href: p.github, label: "GitHub" }] : []),
    ],
  };
}

function Window({
  p, i, on, id, onOpen,
}: { p: Project; i: number; on: boolean; id: string; onOpen: () => void }) {
  const img = p.images?.[0] ?? p.image;
  const live = !!p.liveDemo;
  return (
    <article className={"al-win" + (on ? " is-on" : "")} id={id}>
      <div className="al-win-chrome" aria-hidden="true">
        <i /><i /><i />
        <span className={live ? "is-live" : undefined}>{chromeLabel(p)}</span>
      </div>
      <div
        className={"al-win-shot" + (p.imageFit === "contain" ? " is-contain" : "")}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--sx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
          e.currentTarget.style.setProperty("--sy", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
        }}
      >
        {img && (
          <img
            src={img}
            alt={p.title}
            loading="lazy"
            style={p.imagePositions?.[0] ? { objectPosition: p.imagePositions[0] } : undefined}
          />
        )}
      </div>
      <div className="al-win-body">
        <div className="al-win-top">
          <span className="al-win-idx">{pad(i + 1)}</span>
          <span className="al-win-date">{p.date}</span>
        </div>
        <h3>{p.title}</h3>
        <p className="al-win-line">{p.productDecision ?? p.problem ?? p.description}</p>
        <TagList tags={p.tags} max={3} />
        <div className="al-links-row">
          <button type="button" className="al-more-btn" onClick={onOpen}>Read more</button>
          {p.liveDemo && <a className="al-link" href={p.liveDemo} target="_blank" rel="noreferrer">Live demo</a>}
          {p.github && <a className="al-link" href={p.github} target="_blank" rel="noreferrer">GitHub</a>}
        </div>
      </div>
    </article>
  );
}

function EndCard() {
  return (
    <a className="al-win al-win-end" href={profile.github} target="_blank" rel="noreferrer">
      <span className="al-win-end-mark" aria-hidden="true">↗</span>
      <b>More on GitHub</b>
      <span>Experiments, coursework, and things still in progress.</span>
    </a>
  );
}

export function ProjectReel() {
  const pinned = useMediaQuery(PIN_QUERY);
  const slugs = useMemo(() => projects.map((p) => slugify(p.title)), []);
  const [shift, setShift] = useState(0);
  const [anchors, setAnchors] = useState<number[]>([]);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  const detail = useMemo(() => (open ? toDetail(open) : null), [open]);
  const close = useCallback(() => setOpen(null), []);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  /* Measure how far the reel must travel, and where each window sits
     centred, so deep links can land on the right one. */
  useLayoutEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const view = viewRef.current;
      const track = trackRef.current;
      if (!view || !track) return;
      const cards = Array.from(track.children) as HTMLElement[];
      if (cards.length === 0) return;
      const vw = view.clientWidth;
      const lead = cards[0].offsetLeft;
      const lastCard = cards[cards.length - 1];
      const max = Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth + lead - vw);
      setShift(max);
      setAnchors(
        cards.slice(0, projects.length).map((c) => clamp(c.offsetLeft + c.offsetWidth / 2 - vw / 2, 0, max)),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewRef.current) ro.observe(viewRef.current);
    return () => ro.disconnect();
  }, [pinned]);

  useScrollFrame(() => {
    const el = pinRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const p = pinProgress(el);
    const x = p * shift;
    track.style.transform = `translate3d(${-x}px,0,0)`;
    barRef.current?.style.setProperty("transform", `scaleX(${p})`);
    let idx = 0;
    let best = Infinity;
    anchors.forEach((a, i) => {
      const d = Math.abs(a - x);
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    setActive((prev) => (prev === idx ? prev : idx));
  }, pinned && shift > 0);

  const title = (
    <SectionTitle title="Projects." kicker="Shipped and live." chapter="04" note={`${projects.length} projects`} />
  );

  if (!pinned) {
    return (
      <section className="al-section" id="projects">
        <div className="al-wrap">
          {title}
          <ScrollCarouselRow trackClassName="al-reel-row al-rv" ariaLabel="Projects">
            {projects.map((p, i) => (
              <Window key={slugs[i]} p={p} i={i} on id={slugs[i]} onOpen={() => setOpen(p)} />
            ))}
            <EndCard />
          </ScrollCarouselRow>
        </div>
        <DetailModal content={detail} onClose={close} />
      </section>
    );
  }

  return (
    <section id="projects">
      <div className="al-pin" ref={pinRef} style={{ height: `calc(100vh - 48px + ${shift * PACE}px)` }}>
        {anchors.map((a, i) => (
          <span
            key={slugs[i]}
            id={slugs[i]}
            className="al-anchor"
            data-hl={"win-" + slugs[i]}
            style={{ top: `${a * PACE}px` }}
          />
        ))}
        <div className="al-pin-view al-reel-view">
          <div className="al-wrap al-pin-head al-reel-head">
            {title}
            <div className="al-reel-meta">
              <span className="al-counter">{pad(active + 1)} / {pad(projects.length)}</span>
              <span className="al-reel-bar"><span ref={barRef} /></span>
            </div>
          </div>
          <div className="al-reel-viewport" ref={viewRef}>
            <div className="al-reel-track" ref={trackRef}>
              {projects.map((p, i) => (
                <Window
                  key={slugs[i]}
                  p={p}
                  i={i}
                  on={i === active}
                  id={"win-" + slugs[i]}
                  onOpen={() => setOpen(p)}
                />
              ))}
              <EndCard />
            </div>
          </div>
        </div>
      </div>
      <DetailModal content={detail} onClose={close} />
    </section>
  );
}
