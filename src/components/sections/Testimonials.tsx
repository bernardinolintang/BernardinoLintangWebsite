import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "../../data/portfolioContent";
import { slugify } from "../../lib/slugify";
import { useHashTarget } from "../../lib/scrollFx";
import { SectionTitle } from "./shared";

/* ==========================================================================
   TESTIMONIALS: one voice at a time.
   A single large quote holds the stage; the organisations underneath are
   the selector. Every testimonial is still here, each just gets its moment.
   ========================================================================== */

/* Quotes longer than this many characters are set in the smaller size. */
const LONG = 420;

export function Testimonials() {
  const slugs = useMemo(() => testimonials.map((t) => slugify("testimonial-" + t.name)), []);
  const [active, setActive] = useState(0);
  useHashTarget(slugs, (i) => setActive(i));
  const n = testimonials.length;
  const touchX = useRef<number | null>(null);
  const step = (dir: 1 | -1) => setActive((a) => (a + dir + n) % n);

  return (
    <section className="al-section al-quotes" id="testimonials">
      <div className="al-wrap">
        <SectionTitle title="What people say." kicker="In their words." chapter="06" note={`${n} testimonials`} />

        <figure
          className="al-quote al-rv"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Testimonials. Use the left and right arrow keys, or swipe, to switch."
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          {/* All quotes are laid out on top of each other in one grid cell, so
              the stage is always as tall as the longest and nothing below it
              moves when you switch. Only the active one is visible; shorter
              ones sit centred in the space. */}
          <div className="al-quote-stack" aria-live="polite">
            {testimonials.map((q, i) => (
              <div
                key={q.name}
                className={"al-quote-slide" + (i === active ? " is-on" : "")}
                aria-hidden={i !== active}
              >
                <span className="al-quote-mark" aria-hidden="true">“</span>
                <blockquote className={"al-quote-text" + (q.text.length > LONG ? " is-long" : "")}>
                  {q.text}
                </blockquote>
                <div className="al-quote-by">
                  <img src={q.image} alt="" loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                  <span>
                    <b>{q.name}</b>
                    <small>{q.title}</small>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </figure>

        <div className="al-quote-nav al-rv">
          <button
            type="button"
            className="al-quote-arrow"
            aria-label="Previous testimonial"
            onClick={() => step(-1)}
          >
            <ChevronLeft size={18} strokeWidth={2.25} />
          </button>
          <div className="al-quote-picks" role="tablist" aria-label="Choose a testimonial">
            {testimonials.map((q, i) => (
              <button
                type="button"
                role="tab"
                key={q.name}
                id={slugs[i]}
                aria-selected={i === active}
                className={"al-quote-pick" + (i === active ? " is-on" : "")}
                onClick={() => setActive(i)}
              >
                <img src={q.image} alt="" loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                <span>{q.name}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="al-quote-arrow"
            aria-label="Next testimonial"
            onClick={() => step(1)}
          >
            <ChevronRight size={18} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </section>
  );
}
