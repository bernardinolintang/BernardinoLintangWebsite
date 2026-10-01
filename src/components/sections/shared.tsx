import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { CardImageCarousel } from "../CardImageCarousel";
import { useFocusTrap } from "../../hooks/useFocusTrap";

/* Section heading that reveals word by word ("About." then the grey kicker).
   Uses the page-wide .al-rv observer, so it animates when scrolled into view. */
export function SectionTitle({
  title, kicker, chapter, note,
}: {
  title: string;
  kicker?: string;
  /* Chapter number ("02") and a short note ("5 internships") shown above the heading. */
  chapter?: string;
  note?: string;
}) {
  const words = [
    ...title.split(" ").map((w) => ({ w, k: false })),
    ...(kicker ? kicker.split(" ").map((w) => ({ w, k: true })) : []),
  ];
  return (
    <div className="al-title">
      {chapter && (
        <p className="al-chapter al-rv">
          <b>{chapter}</b>
          {note && <span>{note}</span>}
        </p>
      )}
      <h2 className="al-split al-rv">
        {words.map((x, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className={"al-w" + (x.k ? " al-w-k" : "")} style={{ "--i": i } as CSSProperties}>
              {x.w}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}

/* Counts the last number in a stat up from zero ("1st / 76" → 76). */
export function CountUp({ value, reduce }: { value: string; reduce: boolean }) {
  const m = value.match(/^(.*\D)?(\d+)(\D*)$/);
  const target = m ? parseInt(m[2], 10) : 0;
  const [n, setN] = useState(reduce || !m ? target : 0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce || !m || !ref.current) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const dur = 1200;
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, target]);

  if (!m) return <b>{value}</b>;
  return <b ref={ref}>{(m[1] ?? "") + n + m[3]}</b>;
}

/* Shows the first few tags and folds the rest behind "+N". */
export function TagList({ tags, max = 3, variant }: { tags: string[]; max?: number; variant?: "pm" }) {
  const [open, setOpen] = useState(false);
  if (tags.length === 0) return null;
  const shown = open ? tags : tags.slice(0, max);
  const hidden = tags.length - shown.length;
  const cls = variant === "pm" ? "al-pm-tag" : "al-tag";
  return (
    <div className={variant === "pm" ? "al-pm-tags" : "al-tags"}>
      {shown.map((t) => (
        <span className={cls} key={t}>{t}</span>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          className={cls + " al-tag-more"}
          onClick={() => setOpen(true)}
          aria-label={`Show ${hidden} more: ${tags.slice(max).join(", ")}`}
        >
          +{hidden}
        </button>
      )}
    </div>
  );
}

export type DetailContent = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  images?: string[];
  imagePositions?: string[];
  imageFit?: "contain";
  description?: string;
  sections?: { label: string; text: string }[];
  bullets?: string[];
  tags?: string[];
  pmTags?: string[];
  links?: { href: string; label: string }[];
};

/* One modal for every "read the full story" view: competition case studies,
   project write-ups, and community stories. Nothing is cut from the page,
   it just waits here until someone asks for it. */
export function DetailModal({ content, onClose }: { content: DetailContent | null; onClose: () => void }) {
  const ref = useFocusTrap<HTMLDivElement>(!!content);

  useEffect(() => {
    if (!content) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [content, onClose]);

  if (!content) return null;
  const c = content;
  return createPortal(
    <>
      <div className="al-modal-overlay" onClick={onClose} />
      <div className="al-modal al-modal-lg al-detail" role="dialog" aria-modal="true" aria-labelledby="al-detail-title" ref={ref}>
        <button className="al-modal-close" aria-label="Close" onClick={onClose}>×</button>
        {c.images && c.images.length > 0 && (
          <div className="al-detail-media">
            <CardImageCarousel
              images={c.images}
              alt={c.title}
              imgPos={c.imagePositions?.[0]}
              imagePositions={c.imagePositions}
              fit={c.imageFit}
            />
          </div>
        )}
        {c.eyebrow && <span className="al-badge">{c.eyebrow}</span>}
        <h3 id="al-detail-title">{c.title}</h3>
        {c.subtitle && <div className="al-subtitle">{c.subtitle}</div>}
        {c.meta && <div className="al-date">{c.meta}</div>}
        {c.description && <p className="al-detail-desc">{c.description}</p>}
        {c.bullets && c.bullets.length > 0 && (
          <ul className="al-bullets al-detail-bullets">
            {c.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}
        {c.sections?.map((s) => (
          <div className="al-case-sec" key={s.label}>
            <h4>{s.label}</h4>
            <p>{s.text}</p>
          </div>
        ))}
        {c.tags && c.tags.length > 0 && (
          <div className="al-tags">
            {c.tags.map((t) => <span className="al-tag" key={t}>{t}</span>)}
          </div>
        )}
        {c.pmTags && c.pmTags.length > 0 && (
          <div className="al-pm-tags">
            {c.pmTags.map((t) => <span className="al-pm-tag" key={t}>{t}</span>)}
          </div>
        )}
        {c.links && c.links.length > 0 && (
          <div className="al-links-row">
            {c.links.map((l) => (
              <a className="al-link" key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}

/* Hostname for the "browser window" chrome on project cards. */
export function hostOf(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
