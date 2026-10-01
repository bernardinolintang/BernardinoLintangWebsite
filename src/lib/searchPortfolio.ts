/* Instant, in-browser search over the same knowledge base the chat assistant
   answers from (portfolioKnowledge.ts). Powers the command palette: results
   appear as you type, with no network call and no model in the loop.
   Matching is by word prefix, so "kuber" already finds Kubernetes. */

import { portfolioKnowledge, type PortfolioEntry } from "./portfolioKnowledge.js";
import { splitSentences } from "./text";

export type SearchHit = {
  entry: PortfolioEntry;
  /* A sentence from the entry that contains one of the matched terms. */
  snippet: string;
  /* The query terms that matched, for highlighting. */
  terms: string[];
};

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "of", "to", "in", "on", "at", "for", "with", "by", "from",
  "is", "are", "was", "were", "be", "been", "has", "have", "had", "does", "did", "do", "can",
  "he", "his", "him", "you", "your", "me", "my", "it", "its", "any", "some", "all",
  "what", "which", "who", "where", "when", "why", "how", "show", "tell", "about", "something",
  "used", "use", "using", "done", "worked", "work", "related", "experience",
  "bernard", "bernardino", "lintang",
]);

const TYPE_ORDER: PortfolioEntry["type"][] = [
  "experience", "competition", "project", "community", "testimonial", "skill", "education", "profile",
];

type Indexed = {
  entry: PortfolioEntry;
  title: string;
  skills: string;
  keywords: string;
  body: string;
  sentences: string[];
};

const INDEX: Indexed[] = portfolioKnowledge.map((entry) => ({
  entry,
  title: entry.title.toLowerCase(),
  skills: entry.skills.join(" · ").toLowerCase(),
  keywords: entry.keywords.join(" · ").toLowerCase(),
  body: [entry.summary, ...entry.details].join(" ").toLowerCase(),
  // Details first: some summaries are a cut-off prefix of the full text.
  sentences: [...entry.details, entry.summary]
    .flatMap(splitSentences)
    .map((s) => s.replace(/^"|"$/g, "").trim())
    .filter(Boolean),
}));

function tokenise(query: string): string[] {
  const seen = new Set<string>();
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s/.+#-]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w) && !seen.has(w) && seen.add(w));
}

/* Word-prefix test. Two-letter terms ("ai", "ml", "pm") must match a whole
   word, otherwise they'd light up half the portfolio. */
function matcher(term: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
  const tail = term.length <= 2 ? "(?![a-z0-9])" : "";
  return new RegExp(`(?:^|[^a-z0-9])${escaped}${tail}`);
}

function snippetFor(item: Indexed, regexes: RegExp[]): string {
  const hit = item.sentences.find((s) => regexes.some((r) => r.test(s.toLowerCase())));
  const text = hit ?? item.entry.summary;
  if (text.length <= 150) return text;
  const cut = text.slice(0, 150);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 100)).replace(/[,;:]$/, "") + "…";
}

export function searchPortfolio(query: string, limit = 6): SearchHit[] {
  const terms = tokenise(query);
  if (terms.length === 0) return [];
  const regexes = terms.map(matcher);

  const scored = INDEX.map((item) => {
    let score = 0;
    const matched: string[] = [];
    terms.forEach((term, i) => {
      const r = regexes[i];
      let s = 0;
      if (r.test(item.title)) s += 8;
      if (r.test(item.skills)) s += 5;
      if (r.test(item.keywords)) s += 4;
      if (r.test(item.body)) s += 1.5;
      if (s > 0) {
        score += s;
        matched.push(term);
      }
    });
    return { item, score, matched };
  }).filter((x) => x.matched.length > 0);

  // With several terms, keep only entries matching the most terms anyone matched,
  // so "fraud sql" doesn't drag in everything that merely mentions SQL.
  const best = Math.max(0, ...scored.map((x) => x.matched.length));
  return scored
    .filter((x) => x.matched.length >= Math.max(1, best - (terms.length > 2 ? 1 : 0)))
    .sort(
      (a, b) =>
        b.matched.length - a.matched.length ||
        b.score - a.score ||
        TYPE_ORDER.indexOf(a.item.entry.type) - TYPE_ORDER.indexOf(b.item.entry.type),
    )
    .slice(0, limit)
    .map(({ item, matched }) => ({
      entry: item.entry,
      snippet: snippetFor(item, matched.map(matcher)),
      terms: matched,
    }));
}
