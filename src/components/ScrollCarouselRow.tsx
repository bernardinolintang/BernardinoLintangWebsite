import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ScrollCarouselRowProps = {
  /** Class name(s) applied to the scrollable track (keeps existing layout/snap CSS). */
  trackClassName: string;
  children: React.ReactNode;
};

/**
 * Wraps a horizontally-scrolling row of cards with prev/next arrow buttons.
 * Native scroll (swipe/trackpad/drag) still works underneath; the buttons
 * just nudge scrollLeft and let CSS scroll-snap settle on the nearest card.
 */
export function ScrollCarouselRow({ trackClassName, children }: ScrollCarouselRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="al-scroll-row">
      <div className={trackClassName} ref={trackRef}>
        {children}
      </div>
      <button
        type="button"
        className="al-scroll-row__btn al-scroll-row__btn--prev"
        onClick={() => scrollByPage(-1)}
        aria-label="Scroll left"
        disabled={!canPrev}
      >
        <ChevronLeft size={20} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        className="al-scroll-row__btn al-scroll-row__btn--next"
        onClick={() => scrollByPage(1)}
        aria-label="Scroll right"
        disabled={!canNext}
      >
        <ChevronRight size={20} strokeWidth={2.25} />
      </button>
    </div>
  );
}
