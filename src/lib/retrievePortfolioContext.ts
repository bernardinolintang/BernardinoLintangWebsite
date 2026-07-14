/* Weighted keyword retrieval over the portfolio knowledge base.
   Synonym expansion covers recruiter phrasing; the active recruiter mode
   boosts entries relevant to that track. Swappable for embeddings later
   without touching the API or UI. */

import {
  portfolioKnowledge,
  type PortfolioEntry,
  type RecruiterMode,
} from "./portfolioKnowledge.js";

const SYNONYMS: Record<string, string[]> = {
  sql: ["snowflake", "postgresql", "database", "query", "queries", "analytics"],
  database: ["sql", "postgresql", "mongodb", "supabase", "snowflake"],
  analytics: ["tableau", "power bi", "dashboard", "insight", "statistics", "eda", "a/b"],
  dashboard: ["tableau", "power bi", "react", "visualisation"],
  product: ["pm", "product management", "user research", "trade-off", "stakeholder", "workflow", "roadmap", "product thinking", "product decision"],
  pm: ["product", "product management", "product thinking"],
  ml: ["machine learning", "scikit-learn", "tensorflow", "xgboost", "model"],
  ai: ["llm", "genai", "rag", "agentic", "machine learning", "prompt"],
  llm: ["rag", "genai", "prompt engineering", "groq", "llama", "openai"],
  rag: ["retrieval", "embeddings", "vector", "llm"],
  users: ["user research", "user testing", "real users", "feedback", "tested"],
  research: ["user testing", "feedback", "interviews", "tested"],
  data: ["sql", "pipeline", "etl", "snowflake", "analytics"],
  pipeline: ["etl", "ingestion", "data engineering", "airflow", "ci/cd"],
  engineer: ["engineering", "pipeline", "fastapi", "docker", "deployed"],
  deploy: ["deployed", "production", "live", "shipped", "vercel", "openshift"],
  ship: ["shipped", "deployed", "live", "production"],
  win: ["won", "1st", "first place", "runner-up", "award", "place", "winner"],
  won: ["1st", "first place", "runner-up", "award", "hackathon", "competition"],
  competition: ["hackathon", "datathon", "challenge", "award", "won"],
  hackathon: ["competition", "datathon", "challenge"],
  intern: ["internship", "experience", "work"],
  internship: ["intern", "experience", "work"],
  degree: ["education", "nus", "university", "graduating"],
  education: ["nus", "university", "degree", "graduating", "student"],
  available: ["availability", "graduating", "internship", "roles", "open to"],
  hire: ["availability", "internship", "roles", "recruiter", "summary"],
  interview: ["summary", "recruiter", "availability", "strongest"],
  python: ["pandas", "numpy", "fastapi", "scikit-learn"],
  fraud: ["anomaly", "risk", "detection", "banking"],
  vision: ["computer vision", "cnn", "image", "classification"],
  voice: ["speech", "transcription", "meralion", "audio"],
  statistics: ["statistical", "a/b testing", "regression", "eda"],
  fairness: ["equalised odds", "interpretability", "shap"],
  impact: ["result", "won", "reduced", "improved", "measurable"],
  achievement: ["won", "1st", "award", "impact", "result"],
  strongest: ["1st", "won", "best", "award", "impact"],
  leadership: ["team lead", "led", "club", "executive"],
  team: ["team lead", "collaborated", "built with"],
};

const QUESTION_STOPWORDS = new Set([
  "for", "and", "the", "with", "his", "her", "him", "has", "have", "had", "was", "are",
  "does", "did", "can", "could", "any", "all", "how", "what", "which", "when", "where",
  "who", "why", "show", "tell", "give", "list", "about", "much", "many", "most", "more",
  "bernard", "bernardino", "lintang",
]);

function normalise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s/.+-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !QUESTION_STOPWORDS.has(word));
}

function expandTerms(question: string): { primary: string[]; expanded: string[] } {
  const primary = normalise(question);
  const expanded = new Set<string>();
  for (const term of primary) {
    for (const syn of SYNONYMS[term] ?? []) expanded.add(syn);
  }
  return { primary, expanded: [...expanded] };
}

/* Whole-word match for single words so short terms don't match inside longer
   ones ("work" must not match "framework"/"workflow"). Phrases fall back to a
   plain substring test. */
function wordHit(haystack: string, term: string): boolean {
  if (term.includes(" ")) return haystack.includes(term);
  const escaped = term.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`).test(haystack);
}

function scoreEntry(
  primary: string[],
  expanded: string[],
  entry: PortfolioEntry,
  mode: RecruiterMode,
): number {
  const title = entry.title.toLowerCase();
  const keywords = entry.keywords.map((k) => k.toLowerCase());
  const skills = entry.skills.map((s) => s.toLowerCase());
  const body = [entry.summary, ...entry.details].join(" ").toLowerCase();

  let score = 0;

  for (const term of primary) {
    // Long terms in the title are almost certainly a named project/company.
    if (title.includes(term)) score += term.length >= 5 ? 9 : 5;
    if (keywords.some((k) => k.includes(term))) score += 4;
    if (skills.some((s) => s.includes(term))) score += 3;
    if (wordHit(body, term)) score += 1;
  }

  // Expanded synonyms count at half weight.
  for (const term of expanded) {
    if (title.includes(term)) score += 2;
    if (keywords.some((k) => k.includes(term))) score += 2;
    if (skills.some((s) => s.includes(term))) score += 1.5;
    if (wordHit(body, term)) score += 0.5;
  }

  if (score > 0 && mode !== "everything" && entry.modes.includes(mode)) {
    score += 3;
  }

  return score;
}

/* Fallback ranking for broad questions ("summarise Bernard") where keyword
   matching is weak: profile first, then mode-relevant highlights. */
function fallbackEntries(mode: RecruiterMode, limit: number): PortfolioEntry[] {
  const highlight = (e: PortfolioEntry) =>
    (e.type === "profile" ? 100 : 0) +
    (mode !== "everything" && e.modes.includes(mode) ? 10 : 0) +
    (e.type === "competition" ? 5 : 0) +
    (e.type === "experience" ? 4 : 0) +
    (e.badge?.includes("1st") ? 3 : 0);
  return [...portfolioKnowledge].sort((a, b) => highlight(b) - highlight(a)).slice(0, limit);
}

/* Named-entity focus: if a long word in the question matches at most two
   entry titles (e.g. "blazereport", "careerlingo", "superbank"), the visitor
   is asking about that specific item — evidence should show only it, not
   everything loosely related. Generic words ("intern", "datathon") hit many
   titles and never trigger this. */
const FOCUS_STOPWORDS = new Set([
  "experience", "project", "projects", "product", "products", "challenge", "hackathon",
  "datathon", "intern", "internship", "competition", "analytics", "engineer", "science",
]);

function focusedEntries(primary: string[]): PortfolioEntry[] {
  const focused = new Map<string, PortfolioEntry>();
  for (const term of primary) {
    if (term.length < 5 || FOCUS_STOPWORDS.has(term)) continue;
    const hits = portfolioKnowledge.filter(
      (e) => e.type !== "profile" && e.title.toLowerCase().includes(term),
    );
    if (hits.length >= 1 && hits.length <= 2) {
      for (const hit of hits) focused.set(hit.id, hit);
    }
  }
  return [...focused.values()];
}

/* Category-intent: some questions ask for a whole class of items ("what are
   his projects", "is he nice to work with", "what people say") rather than a
   topic. Keyword scoring alone mis-ranks these — e.g. "work" matches project
   descriptions before testimonials. When a question clearly asks for one
   category, return entries of that type, ranked by keyword relevance within
   the category and falling back to listing order.
   Signals are matched as whole phrases/words against the raw question. */
const TYPE_INTENT: { type: PortfolioEntry["type"]; signals: string[] }[] = [
  {
    type: "testimonial",
    signals: [
      "testimonial", "reference", "recommend", "people say", "say about him",
      "nice to work", "good to work", "like to work", "work with him", "to work with",
      "work ethic", "team player", "personality", "character", "colleague", "reputation",
    ],
  },
  {
    type: "project",
    signals: [
      "his projects", "your projects", "my projects", "side project", "personal project",
      "what has he built", "what have you built", "what did he build", "apps he", "things he built",
    ],
  },
  {
    type: "competition",
    signals: [
      "competition", "competitions", "hackathon", "hackathons", "datathon",
      "award", "prize", "what has he won", "what did he win", "runner-up", "first place",
    ],
  },
  {
    type: "experience",
    signals: [
      "work experience", "worked at", "where has he worked", "his internship", "internships",
      "professional experience", "employment", "companies he", "past roles", "his jobs",
    ],
  },
];

function typeIntent(question: string): PortfolioEntry["type"] | null {
  const q = question.toLowerCase();
  for (const { type, signals } of TYPE_INTENT) {
    if (signals.some((s) => q.includes(s))) return type;
  }
  return null;
}

function entriesOfType(
  type: PortfolioEntry["type"],
  primary: string[],
  expanded: string[],
  mode: RecruiterMode,
  limit: number,
): PortfolioEntry[] {
  return portfolioKnowledge
    .map((entry, index) => ({ entry, index, score: scoreEntry(primary, expanded, entry, mode) }))
    .filter(({ entry }) => entry.type === type)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function retrievePortfolioContext(
  question: string,
  mode: RecruiterMode = "everything",
  limit = 5,
): PortfolioEntry[] {
  const { primary, expanded } = expandTerms(question);

  const focused = focusedEntries(primary);
  if (focused.length > 0) return focused.slice(0, limit);

  const intent = typeIntent(question);
  if (intent) {
    const byType = entriesOfType(intent, primary, expanded, mode, limit);
    if (byType.length > 0) return byType;
  }

  const scored = portfolioKnowledge
    .map((entry) => ({ entry, score: scoreEntry(primary, expanded, entry, mode) }))
    .filter(({ score }) => score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);

  if (scored.length < 2) {
    const fill = fallbackEntries(mode, limit).filter(
      (e) => !scored.some((s) => s.id === e.id),
    );
    return [...scored, ...fill].slice(0, limit);
  }

  return scored;
}
