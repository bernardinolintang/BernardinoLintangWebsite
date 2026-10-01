import { useEffect, useState } from "react";
import "../apple.css";
import "../redesign.css";
import { Search } from "lucide-react";
import { PortfolioChat } from "./PortfolioChat";
import { CommandPalette } from "./CommandPalette";
import { useFocusTrap } from "../hooks/useFocusTrap";
import {
  competitions, events, experiences, leadershipRoles, profile, projects, skills, testimonials, volunteerProjects,
} from "../data/portfolioContent";
import { openPalette, useMediaQuery } from "../lib/scrollFx";
import { splitSentences } from "../lib/text";
import { CountUp, SectionTitle } from "./sections/shared";
import { Hero } from "./sections/Hero";
import { CareerRail } from "./sections/CareerRail";
import { Leaderboard } from "./sections/Leaderboard";
import { ProjectReel } from "./sections/ProjectReel";
import { Community } from "./sections/Community";
import { Testimonials } from "./sections/Testimonials";

/* Reveal-on-scroll for every .al-rv element. Sections swap layouts when the
   window crosses a breakpoint, so newly mounted elements are picked up too. */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("al-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    let raf = 0;
    const scan = () => {
      raf = 0;
      document.querySelectorAll(".al-rv:not(.al-in)").forEach((el) => io.observe(el));
    };
    scan();
    const mo = new MutationObserver(() => {
      if (!raf) raf = requestAnimationFrame(scan);
    });
    mo.observe(document.querySelector(".al") ?? document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* Every experience/competition/project/community/testimonial carries a DOM
   id matching its chatbot evidence slug (see portfolioKnowledge.ts), so a
   "relevant evidence" link lands on the exact item. In the pinned sections
   that id belongs to an invisible scroll anchor; its data-hl names the
   visible element to pulse instead. The pulse waits for the smooth scroll
   to finish so it's seen, not missed mid-flight. */
function useEvidenceHighlight() {
  useEffect(() => {
    let wait: ReturnType<typeof setTimeout> | null = null;
    let clear: ReturnType<typeof setTimeout> | null = null;
    let onEnd: (() => void) | null = null;

    function pulse(el: HTMLElement) {
      const target = (el.dataset.hl && document.getElementById(el.dataset.hl)) || el;
      target.classList.remove("al-card-highlight");
      void target.offsetWidth; // restart the animation if it's already running
      target.classList.add("al-card-highlight");
      if (clear) clearTimeout(clear);
      clear = setTimeout(() => target.classList.remove("al-card-highlight"), 1600);
    }

    function highlightFromHash(initial = false) {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash || hash === "top") return;
      const el = document.getElementById(hash);
      if (!el) return;
      if (initial) el.scrollIntoView();
      if (el.tagName === "SECTION") return; // a whole chapter: scroll there, nothing to pulse
      if (wait) clearTimeout(wait);
      if (onEnd) window.removeEventListener("scrollend", onEnd);
      let done = false;
      const fire = () => {
        if (done) return;
        done = true;
        if (onEnd) window.removeEventListener("scrollend", onEnd);
        pulse(el);
      };
      onEnd = fire;
      window.addEventListener("scrollend", fire, { once: true });
      wait = setTimeout(fire, 1100);
    }

    // Give lazily measured sections (the project reel) a beat to lay out.
    const boot = setTimeout(() => highlightFromHash(true), 450);
    const onHash = () => highlightFromHash();
    window.addEventListener("hashchange", onHash);
    return () => {
      clearTimeout(boot);
      window.removeEventListener("hashchange", onHash);
      if (onEnd) window.removeEventListener("scrollend", onEnd);
      if (wait) clearTimeout(wait);
      if (clear) clearTimeout(clear);
    };
  }, []);
}

const NAV = [
  ["About", "about"],
  ["Experience", "experience"],
  ["Competitions", "competitions"],
  ["Projects", "projects"],
  ["Community", "community"],
  ["Contact", "contact"],
];

/* The About section's index: everything on the page, counted from the data. */
const INDEX = [
  { id: "experience", n: experiences.length, label: "internships" },
  { id: "competitions", n: competitions.length, label: "competitions" },
  { id: "projects", n: projects.length, label: "projects" },
  { id: "community", n: events.length + volunteerProjects.length + leadershipRoles.length, label: "community stories" },
  { id: "testimonials", n: testimonials.length, label: "testimonials" },
];

/* "Graduating mid-2027. Open to …" → just the "Open to …" part, since the
   line above it already says when he graduates. */
const OPEN_TO = splitSentences(profile.availability).slice(1).join(" ") || profile.availability;

/* Sections that tint the page background as you move through them. */
const ZONES = [...NAV.map(([, id]) => id), "testimonials"];

/* Tracks which section is in view: drives the nav highlight, the
   "04 / Projects" counter, and the page's background tint. A section counts
   once it reaches the top 40% of the screen; when two overlap that band the
   later one wins. The full set is tracked (not just what changed), so a
   section leaving the band can never leave a stale highlight behind. */
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = ZONES.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );
    const order = sections
      .slice()
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      .map((el) => el.id);
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        }
        const current = order.filter((id) => inBand.has(id)).pop();
        if (current) setActive(current);
        else if (window.scrollY < 200) setActive("");
      },
      { rootMargin: "-48px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

/* A refresh starts at the very top, like a first visit. Without this the
   browser restores the old scroll position, or jumps to whatever #section was
   left in the address bar. A link opened fresh with a #hash (a shared deep
   link) is still honoured; only a reload clears it. */
function useFreshStart() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const reloaded = nav?.type === "reload";
    const hash = window.location.hash;
    if (hash && (reloaded || hash === "#top")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    if (reloaded || !hash || hash === "#top") window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
}

/* Logo and "Back to top": go to the very top without leaving #top in the address. */
function toTop(e: React.MouseEvent) {
  e.preventDefault();
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: calm ? "instant" : "smooth" });
  if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
}

export default function Portfolio() {
  useFreshStart();
  useReveal();
  useEvidenceHighlight();
  const activeSection = useActiveSection();
  const [menu, setMenu] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const resumeModalRef = useFocusTrap<HTMLDivElement>(showResume);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const navIndex = NAV.findIndex(([, id]) => id === (activeSection === "testimonials" ? "community" : activeSection));

  /* Scroll-progress bar: write scroll fraction into a CSS var */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      doc.style.setProperty("--al-scroll", max > 0 ? String(doc.scrollTop / max) : "0");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Close the resume modal on Escape, and lock body scroll while open */
  useEffect(() => {
    if (!showResume) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowResume(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showResume]);

  /* ======================= RENDER ======================= */
  return (
    <div className="al" id="top" data-zone={activeSection || "top"}>
      {/* SCROLL PROGRESS */}
      <div className="al-progress" aria-hidden="true" />

      {/* NAV */}
      <nav className="al-nav">
        <a className="al-brand" href="#top" onClick={toTop}>
          <img src="/Logo.png" alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
          Bernardino Lintang
        </a>
        <div className={"al-nav-links" + (menu ? " open" : "")}>
          {NAV.map(([label, id], i) => (
            <a
              key={id}
              href={"#" + id}
              data-label={label}
              className={i === navIndex ? "active" : undefined}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="al-nav-end">
          <span className={"al-nav-count" + (navIndex >= 0 ? " is-on" : "")} aria-hidden="true">
            {navIndex >= 0 && (
              <>
                <b>{String(navIndex + 1).padStart(2, "0")}</b> / {NAV[navIndex][0]}
              </>
            )}
          </span>
          <button type="button" className="al-nav-ask" onClick={() => openPalette()} aria-label="Search the portfolio">
            <Search size={13} strokeWidth={2.5} aria-hidden="true" />
            <span>Search</span>
            <kbd>{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <button className="al-nav-toggle" aria-label="Menu" onClick={() => setMenu(!menu)}>
            ☰
          </button>
        </div>
      </nav>

      <main>
        <Hero onResume={() => setShowResume(true)} />

        {/* ABOUT */}
        <section className="al-section" id="about">
          <div className="al-wrap">
            <SectionTitle title="About." kicker="Constrained AI, built to deploy." chapter="01" note="Profile" />
            <div className="al-about-grid">
              <div className="al-about-text al-rv">
                {profile.about.map((p, i) => (
                  <p key={p.slice(0, 24)} className={i === 0 ? "al-about-lead" : undefined}>{p}</p>
                ))}
                <dl className="al-facts">
                  <div><dt>Studying</dt><dd>{profile.education}</dd></div>
                  <div><dt>Open to</dt><dd>{OPEN_TO}</dd></div>
                </dl>
              </div>
              <div className="al-rv">
                {Object.entries(skills).map(([group, items]) => (
                  <div className="al-skill-group" key={group}>
                    <h3>{group}</h3>
                    <div className="al-tags">
                      {items.map((s) => (
                        <span className="al-tag" key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Everything on this page, counted. Each one jumps to its chapter. */}
            <nav className="al-index al-rv" aria-label="What's on this page">
              {INDEX.map((x) => (
                <a className="al-index-item" href={"#" + x.id} key={x.id}>
                  <CountUp value={String(x.n)} reduce={reduce} />
                  <span>{x.label}</span>
                  <i aria-hidden="true">→</i>
                </a>
              ))}
            </nav>
          </div>
        </section>

        <CareerRail />
        <Leaderboard />
        <ProjectReel />
        <Community />
        <Testimonials />

        {/* CONTACT: the page goes quiet and loops back to the headline */}
        <section className="al-finale" id="contact">
          <div className="al-wrap">
            <p className="al-finale-kicker al-rv">You've reached the end. I haven't.</p>
            <h2 className="al-rv">
              Let's build something that <span className="al-grad-text">survives real users.</span>
            </h2>
            <p className="al-finale-text al-rv">
              {profile.availability} If you're building production AI systems and need someone who ships, reach out.
            </p>
            <div className="al-cta-row al-rv">
              <a className="al-btn al-btn-light" href={"mailto:" + profile.email}>Email me →</a>
              <a className="al-link" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <a className="al-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </section>

        {/* RESUME ACCESS MODAL */}
        {showResume && (
          <>
            <div className="al-modal-overlay" onClick={() => setShowResume(false)} />
            <div className="al-modal" role="dialog" aria-modal="true" aria-labelledby="al-resume-title" ref={resumeModalRef}>
              <button className="al-modal-close" aria-label="Close" onClick={() => setShowResume(false)}>×</button>
              <div className="al-modal-eyebrow">🔒 Resume access</div>
              <h3 id="al-resume-title">Let's connect first</h3>
              <p>
                I share my resume by request. Drop me an email or a LinkedIn message and I'll
                send it right over. Both buttons below open with a message already drafted for you.
              </p>
              <div className="al-modal-actions">
                <a
                  className="al-btn"
                  href="mailto:lintangbernardino@gmail.com?subject=Resume%20Request&body=Hi%20Bernardino%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20request%20a%20copy%20of%20your%20resume.%0A%0AThank%20you!"
                >
                  ✉️ Email me
                </a>
                <a
                  className="al-btn-outline"
                  href="https://www.linkedin.com/messaging/compose/?recipient=bernardino-lintang&subject=Resume%20Request&body=Hi%20Bernardino%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20request%20a%20copy%20of%20your%20resume.%0A%0AThank%20you!"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message on LinkedIn
                </a>
              </div>
            </div>
          </>
        )}

        {/* PORTFOLIO ASSISTANT + SEARCH */}
        <PortfolioChat />
        <CommandPalette />
      </main>

      <footer className="al-footer">
        <span>© {new Date().getFullYear()} Bernardino Lintang</span>
        <a href="#top" onClick={toTop}>Back to top ↑</a>
      </footer>
    </div>
  );
}
