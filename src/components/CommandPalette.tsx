import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { CornerDownLeft, Search } from "lucide-react";
import {
  competitions, events, experiences, leadershipRoles, projects, testimonials, volunteerProjects,
} from "../data/portfolioContent";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { searchPortfolio } from "../lib/searchPortfolio";
import { askBernard, jumpTo } from "../lib/scrollFx";

/* ==========================================================================
   COMMAND PALETTE (Ctrl/Cmd + K, the hero "Ask my portfolio" bar, nav Search)
   Type a skill, company, or topic and matching evidence appears instantly
   (searched in the browser, see lib/searchPortfolio.ts). Enter jumps the page
   to that item and highlights it. Anything that needs a real answer goes to
   the AI assistant via the last row.
   ========================================================================== */

type Item =
  | { kind: "hit"; label: string; meta: string; snippet: string; terms: string[]; target: string }
  | { kind: "jump"; label: string; meta: string; target: string }
  | { kind: "try"; label: string }
  | { kind: "ask"; label: string; question?: string };

const SECTIONS: { label: string; meta: string; target: string }[] = [
  { label: "About", meta: "Profile and skills", target: "about" },
  { label: "Experience", meta: `${experiences.length} internships`, target: "experience" },
  { label: "Competitions", meta: `${competitions.length} results`, target: "competitions" },
  { label: "Projects", meta: `${projects.length} builds`, target: "projects" },
  {
    label: "Community",
    meta: `${events.length + volunteerProjects.length + leadershipRoles.length} stories`,
    target: "community",
  },
  { label: "Testimonials", meta: `${testimonials.length} voices`, target: "testimonials" },
  { label: "Contact", meta: "Email, GitHub, LinkedIn", target: "contact" },
];

/* Starter searches shown before anything is typed. */
const TRY = ["Kubernetes", "RAG", "fraud detection", "user testing", "leadership"];

const TYPE_LABEL: Record<string, string> = {
  profile: "About",
  education: "About",
  skill: "Skills",
  experience: "Experience",
  competition: "Competition",
  project: "Project",
  community: "Community",
  testimonial: "Testimonial",
};

function safeTrack(event: string, props?: Record<string, string>) {
  try {
    track(event, props);
  } catch {
    /* analytics must never break the palette */
  }
}

/* Wraps the matched terms in <mark>. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "ig"));
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))}
    </>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const panelRef = useFocusTrap<HTMLDivElement>(open);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* Open from the keyboard or from anywhere on the page (see openPalette) */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function onOpen(e: Event) {
      setQuery((e as CustomEvent<{ query?: string }>).detail?.query ?? "");
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("bl-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("bl-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    safeTrack("palette_opened");
    setIndex(0);
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const q = query.trim();
  const items = useMemo<Item[]>(() => {
    if (!q) {
      return [
        ...TRY.map((label): Item => ({ kind: "try", label })),
        ...SECTIONS.map((s): Item => ({ kind: "jump", ...s })),
        { kind: "ask", label: "Ask the AI assistant a question" },
      ];
    }
    const hits = searchPortfolio(q).map(
      ({ entry, snippet, terms }): Item => ({
        kind: "hit",
        label: entry.title,
        meta: entry.badge ?? TYPE_LABEL[entry.type] ?? entry.type,
        snippet,
        terms,
        target: entry.url.replace(/^#/, ""),
      }),
    );
    const sections = SECTIONS.filter((s) => s.label.toLowerCase().startsWith(q.toLowerCase())).map(
      (s): Item => ({ kind: "jump", ...s }),
    );
    return [...hits, ...sections, { kind: "ask", label: `Ask the AI assistant: “${q}”`, question: q }];
  }, [q]);

  useEffect(() => setIndex(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-i="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  if (!open) return null;

  function run(item: Item) {
    if (item.kind === "try") {
      setQuery(item.label);
      inputRef.current?.focus();
      return;
    }
    setOpen(false);
    setQuery("");
    // Let the palette unmount (and release the scroll lock) before moving the page.
    setTimeout(() => {
      if (item.kind === "ask") {
        safeTrack("palette_ask");
        askBernard(item.question);
      } else {
        safeTrack("palette_jump", { target: item.target });
        jumpTo(item.target);
      }
    }, 40);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[index]) run(items[index]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  const hitCount = items.filter((i) => i.kind === "hit").length;
  const HEADINGS: Record<Item["kind"], string> = {
    try: "Try searching",
    jump: "Jump to",
    hit: `Evidence · ${hitCount}`,
    ask: "Assistant",
  };
  // Consecutive items of one kind form a group; i is the keyboard index.
  const groups: { kind: Item["kind"]; rows: { item: Item; i: number }[] }[] = [];
  items.forEach((item, i) => {
    const last = groups[groups.length - 1];
    if (last && last.kind === item.kind) last.rows.push({ item, i });
    else groups.push({ kind: item.kind, rows: [{ item, i }] });
  });

  return (
    <>
      <div className="al-modal-overlay cp-overlay" onClick={() => setOpen(false)} />
      <div className="cp" role="dialog" aria-modal="true" aria-label="Search the portfolio" ref={panelRef} onKeyDown={onKeyDown}>
        <div className="cp-input">
          <Search size={18} strokeWidth={2.25} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, companies, projects… or ask a question"
            maxLength={200}
            role="combobox"
            aria-expanded="true"
            aria-controls="cp-list"
            aria-activedescendant={`cp-${index}`}
            aria-label="Search the portfolio"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>esc</kbd>
        </div>

        <div className="cp-list" id="cp-list" role="listbox" ref={listRef}>
          {q && hitCount === 0 && (
            <p className="cp-empty">Nothing on the page matches that directly. The assistant can still answer it.</p>
          )}
          {groups.map((group) => (
            <div key={group.kind} role="group" aria-label={HEADINGS[group.kind]}>
              <div className="cp-group" aria-hidden="true">{HEADINGS[group.kind]}</div>
              <div className={"cp-rows cp-rows-" + group.kind}>
                {group.rows.map(({ item, i }) => (
                  <button
                    type="button"
                    key={item.label}
                    id={`cp-${i}`}
                    data-i={i}
                    role="option"
                    aria-selected={i === index}
                    tabIndex={-1}
                    className={"cp-item cp-" + item.kind + (i === index ? " is-on" : "")}
                    onMouseMove={() => setIndex(i)}
                    onClick={() => run(item)}
                  >
                    {item.kind === "hit" && (
                      <>
                        <span className="cp-main">
                          <b><Highlight text={item.label} terms={item.terms} /></b>
                          <span className="cp-snippet"><Highlight text={item.snippet} terms={item.terms} /></span>
                        </span>
                        <span className="cp-meta">{item.meta}</span>
                      </>
                    )}
                    {item.kind === "jump" && (
                      <>
                        <span className="cp-main"><b>{item.label}</b></span>
                        <span className="cp-meta">{item.meta}</span>
                      </>
                    )}
                    {item.kind === "try" && item.label}
                    {item.kind === "ask" && (
                      <span className="cp-main">
                        <span className="cp-spark" aria-hidden="true">✦</span> {item.label}
                      </span>
                    )}
                    {item.kind !== "try" && (
                      <CornerDownLeft className="cp-enter" size={14} strokeWidth={2.25} aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="cp-foot" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> open</span>
          <span>Searches this page instantly. Questions go to the assistant.</span>
        </div>
      </div>
    </>
  );
}
