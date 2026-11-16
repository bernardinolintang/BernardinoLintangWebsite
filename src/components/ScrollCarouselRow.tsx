import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ScrollCarouselRowProps = {
  /** Class name(s) applied to the scrollable track (keeps existing layout/snap CSS). */
  trackClassName: string;
  /** Accessible label for the scrollable region, e.g. "Volunteering projects". */
  ariaLabel: string;
  children: React.ReactNode;
};

/**
 * Wraps a horizontally-scrolling row of cards with prev/next arrow buttons.
 * Native scroll (swipe/trackpad/drag) still works underneath; the buttons
 * just nudge scrollLeft and let CSS scroll-snap settle on the nearest card.
 * The track itself is focusable (tabIndex 0) so keyboard users can also
 * scroll it directly with the arrow keys, not just via the prev/next buttons.
 */
export function ScrollCarouselRow({ trackClassName, ariaLabel, children }: ScrollCarouselRowProps) {
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

  /* Mouse drag-to-scroll. Touch and trackpads already scroll natively; a mouse can't.
     Photo carousels, links and buttons keep their own handling. */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.style.scrollSnapType = "none";
        el.style.cursor = "grabbing";
        el.style.userSelect = "none";
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (!dragging) return;
      dragging = false;
      if (moved) {
        /* Swallow the click that follows a drag so it doesn't open a card */
        const swallow = (ev: MouseEvent) => ev.stopPropagation();
        el.addEventListener("click", swallow, { capture: true, once: true });
        setTimeout(() => el.removeEventListener("click", swallow, true), 0);
      }
      el.style.scrollSnapType = "";
      el.style.cursor = "";
      el.style.userSelect = "";
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if ((e.target as HTMLElement).closest("a, button, input, textarea, select, .al-card-carousel")) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };
    el.addEventListener("pointerdown", onDown);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      onUp();
    };
  }, []);

  return (
    <div className="al-scroll-row">
      <div
        className={trackClassName}
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label={ariaLabel}
      >
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
