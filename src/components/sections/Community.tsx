import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";
import { events, leadershipRoles, volunteerProjects } from "../../data/portfolioContent";
import { slugify } from "../../lib/slugify";
import { clamp, useHashTarget, useMediaQuery, useScrollFrame, viewProgress } from "../../lib/scrollFx";
import { CardImageCarousel } from "../CardImageCarousel";
import { DetailModal, SectionTitle, TagList, type DetailContent } from "./shared";

/* ==========================================================================
   COMMUNITY: where the page loosens up.
   A statement that fills in as you read it, a scrapbook photo wall for
   volunteering and community work (every photo opens its full story), and
   a leadership map with Bernard at the centre of the teams he's led.
   ========================================================================== */

const STATEMENT = "Building useful things matters. Building them for people matters more.";

type Story = {
  slug: string;
  title: string;
  org?: string;
  date: string;
  location?: string;
  description: string;
  tags: string[];
  images: string[];
  imagePositions?: string[];
  link?: string;
};

const STORIES: Story[] = [
  ...events.map((ev) => ({
    slug: slugify(ev.title),
    title: ev.title,
    date: ev.date,
    description: ev.description,
    tags: ev.tags,
    images: ev.image ? [ev.image] : [],
    link: ev.link,
  })),
  ...volunteerProjects.map((v) => ({
    slug: slugify(v.title),
    title: v.title,
    org: v.org,
    date: v.date,
    location: v.location,
    description: v.description,
    tags: v.tags,
    images: v.images,
    imagePositions: v.imagePositions,
  })),
];

/* Deal photos out story by story, so one trip doesn't fill a whole column. */
type Photo = { story: Story; src: string; pos?: string; first: boolean };
function dealPhotos(): Photo[] {
  const out: Photo[] = [];
  const most = Math.max(...STORIES.map((s) => s.images.length));
  for (let k = 0; k < most; k++) {
    for (const s of STORIES) {
      if (s.images[k]) out.push({ story: s, src: s.images[k], pos: s.imagePositions?.[k], first: k === 0 });
    }
  }
  return out;
}

const TILTS = [-2.4, 1.6, -0.8, 2.2, -1.6, 0.9, 1.9, -2, 0.6, -1.2, 2.6, -0.4];
const DRIFT = [-36, 44, -14]; // px of parallax travel per column

function toDetail(s: Story): DetailContent {
  return {
    eyebrow: s.org,
    title: s.title,
    meta: [s.date, s.location].filter(Boolean).join(" · "),
    images: s.images,
    imagePositions: s.imagePositions,
    description: s.description,
    tags: s.tags,
    links: s.link ? [{ href: s.link, label: "View portfolio" }] : [],
  };
}

function Statement({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = STATEMENT.split(" ");
  useScrollFrame(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = clamp((vh * 0.85 - r.top) / (vh * 0.4 + r.height));
    const lit = p * words.length;
    Array.from(el.children).forEach((w, i) => w.classList.toggle("is-lit", i < lit));
  }, !reduce);
  return (
    <p className={"al-statement" + (reduce ? " is-static" : "")} ref={ref}>
      {words.map((w, i) => (
        <span key={i}>{w} </span>
      ))}
    </p>
  );
}

function PhotoWall({ reduce, onOpen }: { reduce: boolean; onOpen: (s: Story) => void }) {
  const photos = useMemo(dealPhotos, []);
  const three = useMediaQuery("(min-width: 760px)");
  const n = three ? 3 : 2;
  const cols: { p: Photo; k: number }[][] = Array.from({ length: n }, () => []);
  photos.forEach((p, k) => cols[k % n].push({ p, k }));
  const wallRef = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const el = wallRef.current;
    if (el) el.style.setProperty("--par", (viewProgress(el) * 2 - 1).toFixed(3));
  }, !reduce);

  return (
    <div className="al-wall" ref={wallRef}>
      {cols.map((col, c) => (
        <div className="al-wall-col" key={c} style={{ "--drift": `${DRIFT[c % DRIFT.length]}px` } as CSSProperties}>
          {col.map(({ p, k }) => (
            <button
              type="button"
              key={p.src}
              id={p.first ? p.story.slug : undefined}
              className={"al-photo al-rv" + (k % 3 === 0 ? " has-tape" : "")}
              style={{ "--r": `${TILTS[k % TILTS.length]}deg` } as CSSProperties}
              onClick={() => onOpen(p.story)}
              aria-label={`${p.story.title}: open story`}
            >
              <img
                src={p.src}
                alt=""
                loading="lazy"
                style={p.pos ? { objectPosition: p.pos } : undefined}
                onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = "none")}
              />
              <span className="al-photo-cap">
                <b>{p.story.title}</b>
                <small>{p.story.org ?? p.story.date}</small>
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

/* Node spots around the centre, as % of the map box. */
const SPOTS = [
  { x: 19, y: 22 },
  { x: 81, y: 20 },
  { x: 84, y: 76 },
  { x: 17, y: 78 },
  { x: 50, y: 7 },
  { x: 50, y: 93 },
];
const ROLES = leadershipRoles.slice(0, SPOTS.length);
const ROLE_SLUGS = ROLES.map((l) => slugify(l.title));

function LeadershipMap() {
  const roles = ROLES;
  const slugs = ROLE_SLUGS;
  const [active, setActive] = useState(0);
  useHashTarget(slugs, (i) => setActive(i));
  const l = roles[active];

  return (
    <div className="al-lead">
      <div className="al-map al-rv" role="group" aria-label="Leadership roles">
        <svg className="al-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {roles.map((r, i) => (
            <line
              key={r.title}
              x1="50" y1="50" x2={SPOTS[i].x} y2={SPOTS[i].y}
              className={i === active ? "is-on" : undefined}
              style={{ "--i": i } as CSSProperties}
            />
          ))}
        </svg>
        <div className="al-node al-node-me" style={{ left: "50%", top: "50%" }}>
          <span className="al-node-img"><img src="/formal-picture.JPG" alt="" /></span>
          <span className="al-node-label">Bernard</span>
        </div>
        {roles.map((r, i) => (
          <button
            type="button"
            key={r.title}
            id={slugs[i]}
            className={"al-node" + (i === active ? " is-on" : "")}
            style={{ left: `${SPOTS[i].x}%`, top: `${SPOTS[i].y}%`, "--i": i } as CSSProperties}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            aria-label={`${r.title}, ${r.org}`}
          >
            <span className="al-node-img">
              <img src={r.images[0]} alt="" loading="lazy" style={r.imagePositions?.[0] ? { objectPosition: r.imagePositions[0] } : undefined} />
            </span>
            <span className="al-node-label">{r.short}</span>
            <span className="al-node-date">{r.date.split("·")[0].trim()}</span>
          </button>
        ))}
      </div>

      <div className="al-lead-panel" key={active} aria-live="polite">
        <div className="al-lead-media">
          <CardImageCarousel images={l.images} alt={l.title} imagePositions={l.imagePositions} />
        </div>
        <div className="al-lead-body">
          <h3>{l.title}</h3>
          <div className="al-org">{l.org}</div>
          <div className="al-date">{l.date} · {l.location}</div>
          <ul className="al-bullets">
            {l.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <TagList tags={l.tags} max={4} />
        </div>
      </div>
    </div>
  );
}

export function Community() {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [open, setOpen] = useState<Story | null>(null);
  const detail = useMemo(() => (open ? toDetail(open) : null), [open]);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section className="al-section al-community" id="community">
      <div className="al-wrap">
        <SectionTitle
          title="Community."
          kicker="Beyond the code."
          chapter="05"
          note={`${STORIES.length} stories · ${ROLES.length} teams led`}
        />
        <Statement reduce={reduce} />

        <div className="al-sub-head al-rv">
          <h3 className="al-subhead">Out in the field.</h3>
          <p>Volunteering, clubs, and the people behind the work. Open any photo for the story.</p>
        </div>
        <PhotoWall reduce={reduce} onOpen={setOpen} />

        <div className="al-sub-head al-rv">
          <h3 className="al-subhead">Leadership.</h3>
          <p>The teams I've led. Pick a node to see what I did there.</p>
        </div>
        <LeadershipMap />
      </div>
      <DetailModal content={detail} onClose={close} />
    </section>
  );
}
