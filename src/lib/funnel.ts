/* Browser side of the funnel analytics: reports "opened the site", "reached
   section X" and "clicked Y" to /api/track, each at most once per session.
   Your own browser is skipped once you've opened /stats (see markOwner). */

const OWNER_KEY = "al-owner";
const SEEN_KEY = "al-funnel-seen";

const SECTIONS = ["about", "experience", "competitions", "projects", "community", "testimonials", "contact"];

export function markOwner() {
  try {
    localStorage.setItem(OWNER_KEY, "1");
  } catch {
    /* storage blocked: nothing to remember */
  }
}

function isOwner() {
  try {
    return localStorage.getItem(OWNER_KEY) === "1";
  } catch {
    return false;
  }
}

const memory = new Set<string>();

/* True the first time a key is seen in this browser session. */
function once(key: string): boolean {
  if (memory.has(key)) return false;
  memory.add(key);
  try {
    const seen: string[] = JSON.parse(sessionStorage.getItem(SEEN_KEY) || "[]");
    if (seen.includes(key)) return false;
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen, key]));
  } catch {
    /* sessionStorage blocked: the in-memory set still dedupes this page load */
  }
  return true;
}

function send(payload: Record<string, string>) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* analytics must never break the page */
  });
}

export function trackAction(id: string) {
  if (!isOwner() && once("a:" + id)) send({ type: "action", id });
}

/* ?ref=linkedin or ?utm_source=... wins, so tagged links show up by name;
   otherwise the referring site's hostname, or "" for direct visits. */
function referrer(): string {
  const params = new URLSearchParams(window.location.search);
  const tagged = params.get("ref") || params.get("utm_source");
  if (tagged) return tagged;
  try {
    const host = new URL(document.referrer).hostname;
    if (host && host !== window.location.hostname) return host;
  } catch {
    /* no referrer */
  }
  return "";
}

const sameUrl = (href: string, base: string) =>
  href.replace(/\/$/, "").toLowerCase().startsWith(base.replace(/\/$/, "").toLowerCase());

/* Starts tracking and returns a cleanup function. */
export function startFunnel(links: { github: string; linkedin: string }): () => void {
  if (isOwner()) return () => {};

  if (once("visit")) send({ type: "visit", ref: referrer() });

  // A section counts as reached once it is visibly on screen.
  let frame = 0;
  const check = () => {
    frame = 0;
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.2 && once("s:" + id)) {
        send({ type: "section", id });
      }
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(check);
  };

  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("mailto:")) trackAction(a.closest(".al-modal") ? "resume_email" : "email_click");
    else if (href.includes("linkedin.com/messaging")) trackAction("resume_linkedin");
    else if (sameUrl(a.href, links.linkedin)) trackAction("linkedin_click");
    else if (a.href.replace(/\/$/, "").toLowerCase() === links.github.replace(/\/$/, "").toLowerCase()) trackAction("github_click");
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  document.addEventListener("click", onClick);
  const boot = window.setTimeout(schedule, 800);

  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    document.removeEventListener("click", onClick);
    window.clearTimeout(boot);
    if (frame) cancelAnimationFrame(frame);
  };
}
