import { useEffect, useRef, useState } from "react";

/* Height of the sticky nav. Pinned sections stick just underneath it. */
export const NAV_H = 48;

/* Pinned, scroll-driven layouts only run where they read well: wide enough,
   tall enough, and for visitors who haven't asked for reduced motion.
   Everywhere else the same components render a plain, static layout. */
export const PIN_QUERY =
  "(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/* Calls onFrame once per animation frame while the page scrolls (and on
   resize), so scroll-linked visuals can write straight to the DOM without
   re-rendering React on every pixel. */
export function useScrollFrame(onFrame: () => void, enabled = true) {
  const cb = useRef(onFrame);
  cb.current = onFrame;
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      cb.current();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);
}

/* Progress (0..1) through a tall container whose sticky child fills the
   viewport under the nav. 0 = child just pinned, 1 = about to un-pin. */
export function pinProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const range = el.offsetHeight - (window.innerHeight - NAV_H);
  return range > 0 ? clamp((NAV_H - rect.top) / range) : 0;
}

/* How far an element has travelled through the viewport: 0 when its top
   enters at the bottom edge, 1 when its bottom leaves at the top edge. */
export function viewProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return clamp((vh - rect.top) / (vh + rect.height));
}

/* Runs onMatch when the URL hash names one of `slugs`: a chat "relevant
   evidence" link, a shared deep link, or a click on a same-page anchor.
   Lets interactive sections switch to the item being pointed at. */
export function useHashTarget(slugs: string[], onMatch: (index: number) => void) {
  const cb = useRef(onMatch);
  cb.current = onMatch;
  const key = slugs.join("|");
  useEffect(() => {
    const list = key.split("|");
    const check = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const i = list.indexOf(hash);
      if (i >= 0) cb.current(i);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [key]);
}

/* Smoothly scrolls to an in-page anchor and updates the hash, so the same
   hash listeners fire whether the jump came from a click here or the chat. */
export function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: calm ? "instant" : "smooth", block: "start" });
  if (window.location.hash.slice(1) !== id) history.replaceState(null, "", "#" + id);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

/* Open the command palette (instant search), optionally pre-filled. */
export function openPalette(query?: string) {
  window.dispatchEvent(new CustomEvent("bl-palette", { detail: { query } }));
}

/* Ask the portfolio assistant something from anywhere on the page. */
export function askBernard(question?: string) {
  window.dispatchEvent(new CustomEvent("bl-ask", { detail: { question } }));
}
