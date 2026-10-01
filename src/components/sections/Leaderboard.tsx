import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { competitions, type CompetitionCard } from "../../data/portfolioContent";
import { slugify } from "../../lib/slugify";
import { PIN_QUERY, pinProgress, useHashTarget, useMediaQuery, useScrollFrame } from "../../lib/scrollFx";
import { splitSentences } from "../../lib/text";
import { CardImageCarousel } from "../CardImageCarousel";
import { DetailModal, SectionTitle, TagList, type DetailContent } from "./shared";

/* ==========================================================================
   COMPETITIONS: the results board.
   Every competition is a row on one ranked board, with a detail card beside
   it. On desktop the section pins: the whole board and the full card stay on
   screen while scrolling steps down the rows one at a time, so no card is
   ever half out of view. Clicking a row jumps to it. Where pinning is off
   (reduced motion, very short windows) rows are click-to-select; on phones
   they expand in place and tap again to close. The card stays short on
   purpose; "Read more" opens the full write-up (description, case study,
   every tag) in a window, so nothing is cut.
   ========================================================================== */

const images = (c: CompetitionCard) => c.images ?? (c.image ? [c.image] : []);
const fieldSize = (c: CompetitionCard) => parseInt(c.field, 10) || 0;
const pad = (n: number) => String(n).padStart(2, "0");

/* Scroll distance (in vh) spent on each row while pinned. */
const STEP_VH = 32;

/* A one or two sentence hook: the subtitle, or the opening of the
   "Problem / Approach / Result" description, cut on a sentence. */
function hook(c: CompetitionCard) {
  if (c.subtitle) return c.subtitle;
  const first = c.description.split("\n")[0].replace(/^Problem:\s*/, "");
  const sentences = splitSentences(first);
  let out = sentences[0];
  for (const s of sentences.slice(1)) {
    if ((out + " " + s).length > 200) break;
    out += " " + s;
  }
  return out;
}

function toDetail(c: CompetitionCard): DetailContent {
  const cs = c.caseStudy;
  return {
    eyebrow: c.badge,
    title: c.title,
    subtitle: c.subtitle,
    meta: c.date,
    images: images(c),
    imagePositions: c.imagePositions,
    description: c.description,
    sections: [
      ...(c.angle ? [{ label: "Product angle", text: c.angle }] : []),
      ...(cs
        ? [
            { label: "Problem", text: cs.problem },
            { label: "Users", text: cs.users },
            { label: "My role", text: cs.role },
            { label: "Product decision", text: cs.productDecision },
            { label: "AI workflow", text: cs.aiWorkflow },
            { label: "Impact", text: cs.impact },
            { label: "What I learned", text: cs.learned },
          ]
        : []),
    ],
    tags: c.tags,
    pmTags: c.pmTags,
    links: [
      ...(c.liveDemo ? [{ href: c.liveDemo, label: "Live demo" }] : []),
      ...(c.article ? [{ href: c.article, label: c.articleLabel ?? "Article" }] : []),
    ],
  };
}

function Panel({ c, onOpen }: { c: CompetitionCard; onOpen: () => void }) {
  const cs = c.caseStudy;
  return (
    <>
      {images(c).length > 0 && (
        <div className="al-lb-media">
          <CardImageCarousel images={images(c)} alt={c.title} imgPos={c.imgPos} imagePositions={c.imagePositions} />
        </div>
      )}
      <div className="al-lb-body">
        <div className="al-lb-result">
          <b>{c.place}</b>
          <span>/ {c.field}</span>
        </div>
        <h3>{c.short}</h3>
        <div className="al-lb-event">{c.event} · {c.date}</div>
        <p className="al-lb-hook">{hook(c)}</p>
        {cs ? (
          <dl className="al-rundown">
            <div className="al-rundown-row al-lb-users"><dt>Users</dt><dd>{cs.users}</dd></div>
            <div className="al-rundown-row"><dt>Impact</dt><dd>{cs.impact}</dd></div>
          </dl>
        ) : (
          c.angle && <p className="al-angle"><b>Product angle:</b> {c.angle}</p>
        )}
        <TagList tags={c.tags} max={3} />
        <div className="al-links-row">
          <button type="button" className="al-more-btn" onClick={onOpen}>Read more</button>
          {c.liveDemo && <a className="al-link" href={c.liveDemo} target="_blank" rel="noreferrer">Live demo</a>}
          {c.article && (
            <a className="al-link" href={c.article} target="_blank" rel="noreferrer">{c.articleLabel ?? "Article"}</a>
          )}
        </div>
      </div>
    </>
  );
}

export function Leaderboard() {
  const board = useMemo(
    () =>
      competitions
        .map((c, i) => ({ c, i }))
        .sort((a, b) => a.c.rank - b.c.rank || fieldSize(b.c) - fieldSize(a.c) || a.i - b.i)
        .map((x) => x.c),
    [],
  );
  const slugs = useMemo(() => board.map((c) => slugify(c.title)), [board]);
  const n = board.length;
  const pinned = useMediaQuery(PIN_QUERY);
  const wide = useMediaQuery("(min-width: 900px)");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<CompetitionCard | null>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLOListElement>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const detail = useMemo(() => (open ? toDetail(open) : null), [open]);
  const close = useCallback(() => setOpen(null), []);

  /* Pinned: scroll position picks the row */
  useScrollFrame(() => {
    const el = pinRef.current;
    if (!el) return;
    const idx = Math.min(n - 1, Math.floor(pinProgress(el) * n));
    setActive((prev) => (prev === idx ? prev : idx));
  }, pinned);

  /* Not pinned: deep links (chat evidence, search, shared URLs) pick the row */
  useHashTarget(slugs, (i) => {
    if (!pinned) setActive(i);
  });

  /* Leaving the phone layout with every row closed: select the first again */
  useEffect(() => {
    if (wide) setActive((prev) => (prev < 0 ? 0 : prev));
  }, [wide]);

  /* Pinned: if the board ever holds more rows than fit, keep the active one in view */
  useEffect(() => {
    const b = boardRef.current;
    const r = rowRefs.current[active];
    if (!pinned || !b || !r || b.scrollHeight <= b.clientHeight + 1) return;
    const target = r.offsetTop - (b.clientHeight - r.offsetHeight) / 2;
    b.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [active, pinned]);

  const current = board[Math.max(0, active)];

  const title = (
    <SectionTitle
      title="Competitions."
      kicker="Built to win."
      chapter="03"
      note={`${n} competitions · ${board.filter((c) => c.rank <= 3).length} podium finishes`}
    />
  );

  function onRowClick(i: number, on: boolean) {
    if (pinned) {
      // Cut straight to the chosen row. A smooth scroll would pass through
      // every row in between and flash each card on the way.
      document.getElementById(slugs[i])?.scrollIntoView({ behavior: "instant", block: "start" });
      return;
    }
    if (wide) return setActive(i);
    // Phones: tap to open, tap again to close, and keep the row in view.
    setActive(on ? -1 : i);
    if (!on) {
      requestAnimationFrame(() => rowRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  const rows = (
    <ol className="al-lb-board" ref={boardRef}>
      {board.map((c, i) => {
        const on = i === active;
        return (
          <li key={slugs[i]} className={"al-lb-item" + (on ? " is-on" : "")}>
            <button
              type="button"
              // Pinned: the deep-link id lives on a scroll anchor instead (see below).
              id={pinned ? undefined : slugs[i]}
              className={"al-lb-row" + (c.rank === 1 ? " is-gold" : "")}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              aria-expanded={wide ? undefined : on}
              aria-controls={wide ? "lb-panel" : undefined}
              aria-current={wide && on ? "true" : undefined}
              onClick={() => onRowClick(i, on)}
            >
              <span className="al-lb-pos">{pad(i + 1)}</span>
              <span className="al-lb-name">
                <b>{c.short}</b>
                <small>{c.event}<span className="al-lb-date"> · {c.date}</span></small>
              </span>
              <span className="al-lb-res">
                <b>{c.place}</b>
                <small>/ {c.field}</small>
              </span>
            </button>
            {!wide && on && (
              <div className="al-lb-panel al-lb-inline">
                <Panel c={c} onOpen={() => setOpen(c)} />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );

  const panel = (
    <div className="al-lb-panel" id="lb-panel" key={active} aria-live="polite">
      <Panel c={current} onOpen={() => setOpen(current)} />
    </div>
  );

  /* ---------- pinned: board and card stay on screen, scroll steps the rows ---------- */
  if (pinned) {
    return (
      <section id="competitions">
        <div className="al-pin" ref={pinRef} style={{ height: `calc(100vh - 48px + ${n * STEP_VH}vh)` }}>
          {slugs.map((s, i) => (
            <span
              key={s}
              id={s}
              className="al-anchor"
              data-hl="lb-panel"
              style={{ top: `${(i + 0.5) * STEP_VH}vh` }}
            />
          ))}
          <div className="al-pin-view al-lb-view">
            <div className="al-wrap al-lb-frame">
              <div className="al-pin-head">
                {title}
                <span className="al-counter">{pad(active + 1)} / {pad(n)}</span>
              </div>
              <div className="al-lb is-split is-pinned">
                {rows}
                {panel}
              </div>
            </div>
          </div>
        </div>
        <DetailModal content={detail} onClose={close} />
      </section>
    );
  }

  /* ---------- wide, not pinned: click a row / phones: rows expand in place ---------- */
  return (
    <section className="al-section" id="competitions">
      <div className="al-wrap">
        {title}
        <div className={"al-lb" + (wide ? " is-split" : "")}>
          {rows}
          {wide && <div className="al-lb-sticky">{panel}</div>}
        </div>
      </div>
      <DetailModal content={detail} onClose={close} />
    </section>
  );
}
