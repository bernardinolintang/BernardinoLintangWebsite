import { useEffect, useState } from "react";
import "../apple.css";
import { CardImageCarousel } from "./CardImageCarousel";
import { PortfolioChat } from "./PortfolioChat";
import {
  competitions,
  events,
  experiences,
  projects,
  skills,
  testimonials,
  type CompetitionCard,
} from "../data/portfolioContent";
import { slugify } from "../lib/slugify";

function cardImages(item: { image?: string; images?: string[] }) {
  return item.images ?? (item.image ? [item.image] : []);
}

/* Small reveal-on-scroll hook (no dependencies) */
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
    document.querySelectorAll(".al-rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Every experience/competition/project/community/testimonial card carries a
   DOM id matching its chatbot evidence slug (see portfolioKnowledge.ts), so a
   "relevant evidence" link can land on the exact card instead of the section.
   Cards sit two-up in a grid, so simply scrolling there isn't always enough
   to tell WHICH card is the evidence — this briefly pulses it too. Runs on
   the initial hash (a shared deep link) and on every in-page hash change
   (clicking a source card while the chat panel is open). */
function useEvidenceHighlight() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    function highlightFromHash() {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;
      const el = document.getElementById(hash);
      if (!el) return;
      if (timer) clearTimeout(timer);
      el.classList.add("al-card-highlight");
      timer = setTimeout(() => el.classList.remove("al-card-highlight"), 1600);
    }
    highlightFromHash();
    window.addEventListener("hashchange", highlightFromHash);
    return () => {
      window.removeEventListener("hashchange", highlightFromHash);
      if (timer) clearTimeout(timer);
    };
  }, []);
}

/* Expandable long description */
function Desc({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 260;
  return (
    <>
      <p className={"al-desc" + (long && !open ? " clamped" : "")}>{text}</p>
      {long && (
        <button className="al-link al-more" onClick={() => setOpen(!open)}>
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
}

export default function Portfolio() {
  useReveal();
  useEvidenceHighlight();
  const [menu, setMenu] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [caseStudy, setCaseStudy] = useState<CompetitionCard | null>(null);

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

  /* Close any open modal on Escape, and lock body scroll while open */
  useEffect(() => {
    if (!showResume && !caseStudy) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setShowResume(false);
      setCaseStudy(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showResume, caseStudy]);

  const NAV = [
    ["About", "about"],
    ["Experience", "experience"],
    ["Competitions", "competitions"],
    ["Projects", "projects"],
    ["Community", "community"],
    ["Contact", "contact"],
  ];

  /* ======================= RENDER ======================= */
  return (
    <div className="al">
      {/* SCROLL PROGRESS */}
      <div className="al-progress" aria-hidden="true" />

      {/* NAV */}
      <nav className="al-nav">
        <a className="al-brand" href="#top">
          <img src="/Logo.png" alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
          Bernardino Lintang
        </a>
        <div className={"al-nav-links" + (menu ? " open" : "")}>
          {NAV.map(([label, id]) => (
            <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </div>
        <button className="al-nav-toggle" aria-label="Menu" onClick={() => setMenu(!menu)}>
          ☰
        </button>
      </nav>

      {/* HERO */}
      <header className="al-hero al-wrap" id="top">
        <img className="al-avatar al-rv" src="/formal-picture.JPG" alt="Bernardino Lintang" />
        <div className="al-eyebrow al-rv">BERNARDINO LINTANG · AI PRODUCT BUILDER</div>
        <h1 className="al-rv">
          I build AI products that <span className="al-grad-text">survive real users.</span>
        </h1>
        <p className="al-rv">
          I turn messy workflows into tested, deployable AI products, from product strategy and UX
          through to data and engineering.
        </p>
        <div className="al-cta-row al-rv">
          <a className="al-btn" href="#competitions">View my work</a>
          <button type="button" className="al-link" onClick={() => setShowResume(true)}>Resume</button>
          <a className="al-link" href="#contact">Contact</a>
        </div>

        <div className="al-stats">
          <div className="al-stat al-rv"><b>1st / 76</b><span>NUS Datathon 2026</span></div>
          <div className="al-stat al-rv"><b>2nd / 87</b><span>SCDF × Dell Challenge</span></div>
          <div className="al-stat al-rv"><b>4+</b><span>AI products shipped</span></div>
          <div className="al-stat al-rv"><b>70%+</b><span>Manual workflow reduced</span></div>
        </div>
      </header>

      {/* ABOUT */}
      <section className="al-section al-alt" id="about">
        <div className="al-wrap">
          <h2 className="al-rv">About. <small>Constrained AI, built to deploy.</small></h2>
          <div className="al-about-grid">
            <div className="al-about-text al-rv">
              <p>
                I build production AI systems, from LLM-powered ingestion pipelines that replace manual
                workflows to RAG architectures serving policy-aligned responses at scale.
              </p>
              <p>
                My work sits at the intersection of applied ML, data engineering, and GenAI product
                development. I treat every model as a constrained tool that needs schema enforcement,
                evaluation, and failure modes designed before the first line of inference code.
              </p>
            </div>
            <div className="al-rv">
              {Object.entries(skills).map(([group, items]) => (
                <div className="al-skill-group" key={group}>
                  <h4>{group}</h4>
                  <div className="al-tags">
                    {items.map((s) => (
                      <span className="al-tag" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="al-section" id="experience">
        <div className="al-wrap">
          <h2 className="al-rv">Experience. <small>Production, not prototypes.</small></h2>
          <div className="al-stack">
            {experiences.map((x) => (
              <div className="al-card al-rv" id={slugify(x.company)} key={x.title + x.company}>
                <div className="al-meta">
                  <div className="al-meta-main">
                    {x.logo && (
                      <img
                        className="al-exp-logo"
                        src={x.logo}
                        alt={x.company + " logo"}
                        loading="lazy"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                      />
                    )}
                    <div>
                      <h3>{x.title}</h3>
                      <div className="al-org">{x.company}</div>
                    </div>
                  </div>
                  <div className="al-period">{x.period}</div>
                </div>
                <ul className="al-bullets">
                  {x.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                {x.angle && (
                  <p className="al-angle"><b>Product angle:</b> {x.angle}</p>
                )}
                <div className="al-tags">
                  {x.tags.map((t) => <span className="al-tag" key={t}>{t}</span>)}
                </div>
                {x.links && x.links.length > 0 && (
                  <div className="al-links-row">
                    {x.links.map((l) => (
                      <a className="al-link" key={l.href} href={l.href} target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITIONS */}
      <section className="al-section al-alt" id="competitions">
        <div className="al-wrap">
          <h2 className="al-rv">Competitions. <small>Built to win.</small></h2>
          <div className="al-grid-2">
            {competitions.map((c) => (
              <div className="al-card al-media-card al-rv" id={slugify(c.title)} key={c.title}>
                {cardImages(c).length > 0 && (
                  <CardImageCarousel
                    images={cardImages(c)}
                    alt={c.title}
                    imgPos={c.imgPos}
                    imagePositions={c.imagePositions}
                  />
                )}
                <div className="al-media-body">
                  <span className="al-badge">{c.badge}</span>
                  <h3>{c.title}</h3>
                  {c.subtitle && <div className="al-subtitle">{c.subtitle}</div>}
                  <div className="al-date">{c.date}</div>
                  <Desc text={c.description} />
                  {c.caseStudy && (
                    <dl className="al-rundown">
                      <div className="al-rundown-row"><dt>Problem</dt><dd>{c.caseStudy.problem}</dd></div>
                      <div className="al-rundown-row"><dt>Users</dt><dd>{c.caseStudy.users}</dd></div>
                      <div className="al-rundown-row"><dt>Impact</dt><dd>{c.caseStudy.impact}</dd></div>
                    </dl>
                  )}
                  {c.angle && (
                    <p className="al-angle"><b>Product angle:</b> {c.angle}</p>
                  )}
                  <div className="al-tags">
                    {c.tags.map((t) => <span className="al-tag" key={t}>{t}</span>)}
                  </div>
                  {c.pmTags && (
                    <div className="al-pm-tags">
                      {c.pmTags.map((t) => <span className="al-pm-tag" key={t}>{t}</span>)}
                    </div>
                  )}
                  {(c.caseStudy || c.liveDemo || c.article) && (
                    <div className="al-links-row">
                      {c.caseStudy && (
                        <button type="button" className="al-link" onClick={() => setCaseStudy(c)}>
                          Case study
                        </button>
                      )}
                      {c.liveDemo && <a className="al-link" href={c.liveDemo} target="_blank" rel="noreferrer">Live demo</a>}
                      {c.article && (
                        <a className="al-link" href={c.article} target="_blank" rel="noreferrer">
                          {c.articleLabel ?? "Article"}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="al-section" id="projects">
        <div className="al-wrap">
          <h2 className="al-rv">Projects. <small>Shipped and live.</small></h2>
          <div className="al-grid-2">
            {projects.map((p) => (
              <div className="al-card al-media-card al-rv" id={slugify(p.title)} key={p.title}>
                {cardImages(p).length > 0 && (
                  <CardImageCarousel
                    images={cardImages(p)}
                    alt={p.title}
                    imagePositions={p.imagePositions}
                  />
                )}
                <div className="al-media-body">
                  <h3>{p.title}</h3>
                  <div className="al-date">{p.date}</div>
                  <Desc text={p.description} />
                  {(p.problem || p.productDecision) && (
                    <p className="al-angle">
                      {p.productDecision
                        ? <><b>Product decision:</b> {p.productDecision}</>
                        : <><b>Problem:</b> {p.problem}</>}
                    </p>
                  )}
                  <div className="al-tags">
                    {p.tags.map((t) => <span className="al-tag" key={t}>{t}</span>)}
                  </div>
                  {p.pmTags && (
                    <div className="al-pm-tags">
                      {p.pmTags.map((t) => <span className="al-pm-tag" key={t}>{t}</span>)}
                    </div>
                  )}
                  {(p.liveDemo || p.github) && (
                    <div className="al-links-row">
                      {p.liveDemo && <a className="al-link" href={p.liveDemo} target="_blank" rel="noreferrer">Live demo</a>}
                      {p.github && <a className="al-link" href={p.github} target="_blank" rel="noreferrer">GitHub</a>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="al-section al-alt" id="community">
        <div className="al-wrap">
          <h2 className="al-rv">Community. <small>Beyond the code.</small></h2>
          <div className="al-grid-2">
            {events.map((ev) => (
              <div className="al-card al-media-card al-rv" id={slugify(ev.title)} key={ev.title}>
                {cardImages(ev).length > 0 && (
                  <CardImageCarousel images={cardImages(ev)} alt={ev.title} />
                )}
                <div className="al-media-body">
                  <h3>{ev.title}</h3>
                  <div className="al-date">{ev.date}</div>
                  <Desc text={ev.description} />
                  <div className="al-tags">
                    {ev.tags.map((t) => <span className="al-tag" key={t}>{t}</span>)}
                  </div>
                  {ev.link && (
                    <div className="al-links-row">
                      <a className="al-link" href={ev.link} target="_blank" rel="noreferrer">View portfolio</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="al-section" id="testimonials">
        <div className="al-wrap">
          <h2 className="al-rv">What people say.</h2>
          <div className="al-testis al-rv">
            {testimonials.map((t) => (
              <div className="al-card al-testi" id={slugify("testimonial-" + t.name)} key={t.name}>
                <div className="al-testi-head">
                  <img src={t.image} alt={t.name} loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                  <div>
                    <b>{t.name}</b>
                    <span>{t.title}</span>
                  </div>
                </div>
                <p className="al-desc">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="al-section al-contact" id="contact">
        <div className="al-wrap">
          <h2 className="al-rv">Let's talk.</h2>
          <p className="al-rv">
            Graduating mid-2027. Open to AI, ML, and Data Engineering internships now and graduate roles
            for 2027. If you're building production AI systems and need someone who ships, reach out.
          </p>
          <div className="al-cta-row al-rv">
            <a className="al-btn" href="mailto:lintangbernardino@gmail.com">Email me</a>
            <a className="al-link" href="https://github.com/bernardinolintang" target="_blank" rel="noreferrer">GitHub</a>
            <a className="al-link" href="https://www.linkedin.com/in/bernardino-lintang" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>

      {/* CASE STUDY MODAL */}
      {caseStudy && caseStudy.caseStudy && (
        <>
          <div className="al-modal-overlay" onClick={() => setCaseStudy(null)} />
          <div className="al-modal al-modal-lg" role="dialog" aria-modal="true" aria-labelledby="al-case-title">
            <button className="al-modal-close" aria-label="Close" onClick={() => setCaseStudy(null)}>×</button>
            <span className="al-badge">{caseStudy.badge}</span>
            <h3 id="al-case-title">{caseStudy.title}</h3>
            {caseStudy.subtitle && <div className="al-subtitle">{caseStudy.subtitle}</div>}
            <div className="al-date">{caseStudy.date}</div>
            <div className="al-case-sec"><h4>Problem</h4><p>{caseStudy.caseStudy.problem}</p></div>
            <div className="al-case-sec"><h4>Users</h4><p>{caseStudy.caseStudy.users}</p></div>
            <div className="al-case-sec"><h4>My role</h4><p>{caseStudy.caseStudy.role}</p></div>
            <div className="al-case-sec"><h4>Product decision</h4><p>{caseStudy.caseStudy.productDecision}</p></div>
            <div className="al-case-sec"><h4>AI workflow</h4><p>{caseStudy.caseStudy.aiWorkflow}</p></div>
            <div className="al-case-sec"><h4>Impact</h4><p>{caseStudy.caseStudy.impact}</p></div>
            <div className="al-case-sec"><h4>What I learned</h4><p>{caseStudy.caseStudy.learned}</p></div>
            {caseStudy.pmTags && (
              <div className="al-pm-tags">
                {caseStudy.pmTags.map((t) => <span className="al-pm-tag" key={t}>{t}</span>)}
              </div>
            )}
            {caseStudy.liveDemo && (
              <div className="al-links-row">
                <a className="al-link" href={caseStudy.liveDemo} target="_blank" rel="noreferrer">Live demo</a>
              </div>
            )}
          </div>
        </>
      )}

      {/* RESUME ACCESS MODAL */}
      {showResume && (
        <>
          <div className="al-modal-overlay" onClick={() => setShowResume(false)} />
          <div className="al-modal" role="dialog" aria-modal="true" aria-labelledby="al-resume-title">
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

      <footer className="al-footer">© {new Date().getFullYear()} Bernardino Lintang</footer>

      {/* PORTFOLIO ASSISTANT */}
      <PortfolioChat />
    </div>
  );
}
