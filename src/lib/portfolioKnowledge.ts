/* ==========================================================================
   Knowledge base for the "Ask about Bernard" assistant.
   Entries are DERIVED from src/data/portfolioContent.ts, so editing the
   site content automatically updates what the chatbot knows.
   ========================================================================== */

import {
  competitions,
  events,
  experiences,
  profile,
  projects,
  skills,
  testimonials,
} from "../data/portfolioContent.js";
import { slugify } from "./slugify.js";

export type RecruiterMode =
  | "ai-product"
  | "data-science"
  | "analytics"
  | "engineering"
  | "everything";

export type PortfolioEntry = {
  id: string;
  type:
    | "profile"
    | "experience"
    | "competition"
    | "project"
    | "skill"
    | "education"
    | "community"
    | "testimonial";
  title: string;
  badge?: string;
  date?: string;
  summary: string;
  details: string[];
  skills: string[];
  keywords: string[];
  modes: RecruiterMode[];
  url: string;
  demoUrl?: string;
  demoLabel?: string;
};

/* Extra hand-curated keywords for entries whose slug matches a key.
   These cover recruiter phrasing that the raw content doesn't use. */
const EXTRA_KEYWORDS: Record<string, string[]> = {
  "blazereport": ["fire investigation", "scdf", "govtech", "product thinking", "real users", "user testing", "team lead", "human in the loop", "voice", "multimodal", "strongest ai project", "hackathon win"],
  "nus-datathon-2026": ["clustering", "guardrails", "grounded ai", "hallucination", "benchmarking", "first place", "won", "groq", "llama", "dashboard", "strongest achievement"],
  "micron-aisg": ["logs", "semiconductor", "etl", "data pipeline", "parsing", "drift detection", "deployed", "production"],
  "bto-lens": ["housing", "3d", "simulation", "decision support", "real users", "consumer"],
  "sds-hackathon": ["fairness", "interpretability", "regression", "prediction", "shap", "healthcare", "insurance"],
  "careerlingo": ["career coach", "edtech", "habit", "duolingo", "linkedin", "behaviour design", "product thinking"],
  "nus-datathon-2025": ["recommendation system", "matching", "insurance", "personalisation"],
  "htx": ["rag", "vector database", "milvus", "embeddings", "data engineering", "pipelines", "government"],
  "cpf-board": ["genai", "product development", "contact centre", "rag", "evaluation", "prompt engineering", "policy", "stakeholders", "product management experience"],
  "crayon-data": ["llm pipeline", "ingestion", "automation", "70%", "production", "ownership", "schema", "business users"],
  "superbank": ["fraud detection", "sql", "snowflake", "banking", "fintech", "risk", "anomaly detection", "feature engineering", "50 million records", "stakeholders", "analytics"],
  "covercraft": ["cover letter", "generator", "deployed", "live", "side project"],
  "af-tracker-sg": ["gym", "maps", "full stack", "deployed", "supabase", "consumer app"],
  "eksplorasi": ["outdoor", "exploration", "maps", "deployed", "consumer app", "local-first"],
  "hybrid-cnn-rag": ["medical", "dermatology", "computer vision", "rag", "coursework", "deep learning"],
  "dna-binding": ["bioinformatics", "classification", "coursework", "benchmarking", "deep learning"],
  "question-bank": ["education", "flask", "coursework", "search", "full-text"],
  "taylor-swift": ["r", "eda", "music", "statistics", "visualisation", "coursework"],
  "product-club": ["a/b testing", "product management", "public speaking", "statistics", "experiment"],
};

const MODE_SIGNALS: Record<Exclude<RecruiterMode, "everything">, string[]> = {
  "ai-product": ["llm", "rag", "product", "genai", "agentic", "user", "workflow", "ai pm", "prompt", "evaluation", "human in the loop", "decision support", "edtech"],
  "data-science": ["scikit-learn", "tensorflow", "xgboost", "shap", "clustering", "classification", "regression", "recommendation", "feature engineering", "fraud", "anomaly", "statistical", "pca", "cnn", "machine learning"],
  "analytics": ["tableau", "power bi", "a/b testing", "sql", "snowflake", "dashboard", "eda", "statistics", "insight", "benchmarking", "analytics"],
  "engineering": ["fastapi", "docker", "ci/cd", "iac", "pipeline", "postgresql", "mongodb", "supabase", "react", "typescript", "next.js", "etl", "deployed", "aws", "infrastructure", "milvus"],
};

function inferModes(text: string): RecruiterMode[] {
  const lower = text.toLowerCase();
  const modes: RecruiterMode[] = [];
  for (const [mode, signals] of Object.entries(MODE_SIGNALS)) {
    const hits = signals.filter((s) => lower.includes(s)).length;
    if (hits >= 2) modes.push(mode as RecruiterMode);
  }
  return modes;
}

function extras(id: string): string[] {
  const key = Object.keys(EXTRA_KEYWORDS).find((k) => id.includes(k) || k.includes(id.slice(0, 12)));
  return key ? EXTRA_KEYWORDS[key] : [];
}

function makeEntry(e: Omit<PortfolioEntry, "modes" | "keywords"> & { keywords?: string[] }): PortfolioEntry {
  const all = [e.title, e.summary, ...e.details, ...e.skills, ...(e.keywords ?? [])].join(" ");
  return {
    ...e,
    keywords: [...(e.keywords ?? []), ...extras(e.id)],
    modes: inferModes(all + " " + extras(e.id).join(" ")),
  };
}

function buildKnowledge(): PortfolioEntry[] {
  const entries: PortfolioEntry[] = [];

  entries.push(makeEntry({
    id: "profile",
    type: "profile",
    title: `${profile.name} — ${profile.headline}`,
    summary: `${profile.tagline} ${profile.intro}`,
    details: [
      ...profile.about,
      ...profile.stats.map((s) => `${s.value} — ${s.label}`),
      profile.education,
      profile.availability,
      `Contact: ${profile.email} · GitHub: ${profile.github} · LinkedIn: ${profile.linkedin}`,
      "Resume is shared on request via email or LinkedIn message.",
    ],
    skills: Object.values(skills).flat(),
    keywords: ["who is bernard", "summary", "summarise", "overview", "introduction", "recruiter", "about", "elevator pitch", "30 seconds", "availability", "graduating", "internship", "roles", "degree", "education", "nus", "resume", "cv", "contact", "email"],
    url: "#about",
  }));

  for (const x of experiences) {
    entries.push(makeEntry({
      id: slugify(x.company),
      type: "experience",
      title: `${x.title} at ${x.company}`,
      date: x.period,
      summary: x.angle ?? x.bullets[0],
      details: [...x.bullets, ...(x.angle ? [`Product angle: ${x.angle}`] : [])],
      skills: x.tags,
      // Anchors straight to THIS experience's card, not just the section —
      // so "relevant evidence" links land on the exact evidence, not a scroll
      // guess. Kept in sync with the matching DOM id in Portfolio.tsx.
      url: "#" + slugify(x.company),
      demoUrl: x.links?.[0]?.href,
      demoLabel: x.links?.[0]?.label ? `Read the ${x.links[0].label}` : undefined,
    }));
  }

  for (const c of competitions) {
    const cs = c.caseStudy;
    entries.push(makeEntry({
      id: slugify(c.title),
      type: "competition",
      title: c.title,
      badge: c.badge,
      date: c.date,
      summary: c.subtitle ?? c.description.slice(0, 200),
      details: [
        `Result: ${c.badge}.`,
        c.description,
        ...(c.angle ? [`Product angle: ${c.angle}`] : []),
        ...(cs
          ? [
              `Problem: ${cs.problem}`,
              `Users: ${cs.users}`,
              `Bernard's role: ${cs.role}`,
              `Product decision: ${cs.productDecision}`,
              `AI workflow: ${cs.aiWorkflow}`,
              `Impact: ${cs.impact}`,
              `What he learned: ${cs.learned}`,
            ]
          : []),
      ],
      skills: [...c.tags, ...(c.pmTags ?? [])],
      url: "#" + slugify(c.title),
      demoUrl: c.liveDemo ?? c.article,
      demoLabel: c.liveDemo ? "Open the live demo" : c.article ? `Read the ${c.articleLabel ?? "article"}` : undefined,
    }));
  }

  for (const p of projects) {
    entries.push(makeEntry({
      id: slugify(p.title),
      type: "project",
      title: p.title,
      date: p.date,
      summary: p.description.slice(0, 220),
      details: [
        p.description,
        ...(p.problem ? [`Problem: ${p.problem}`] : []),
        ...(p.productDecision ? [`Product decision: ${p.productDecision}`] : []),
        ...(p.liveDemo ? ["Deployed and publicly accessible (live demo available)."] : []),
        ...(p.github ? ["Source code available on GitHub."] : []),
      ],
      skills: [...p.tags, ...(p.pmTags ?? [])],
      url: "#" + slugify(p.title),
      demoUrl: p.liveDemo ?? p.github,
      demoLabel: p.liveDemo ? "Try the live project" : p.github ? "View the code on GitHub" : undefined,
    }));
  }

  for (const [group, items] of Object.entries(skills)) {
    entries.push(makeEntry({
      id: slugify("skills-" + group),
      type: "skill",
      title: `Skills — ${group}`,
      summary: `${group}: ${items.join(", ")}.`,
      details: [
        `Bernard's ${group} toolkit: ${items.join(", ")}.`,
        "These are applied across his internships, competitions, and shipped projects listed on the site.",
      ],
      skills: items,
      keywords: ["skills", "tech stack", "tools", "programming languages", "knows", "experience with"],
      url: "#about",
    }));
  }

  for (const ev of events) {
    entries.push(makeEntry({
      id: slugify(ev.title),
      type: "community",
      title: ev.title,
      date: ev.date,
      summary: ev.description,
      details: [ev.description],
      skills: ev.tags,
      keywords: ["community", "leadership", "club", "extracurricular"],
      url: "#" + slugify(ev.title),
      demoUrl: ev.link,
      demoLabel: ev.link ? "View the portfolio" : undefined,
    }));
  }

  for (const t of testimonials) {
    entries.push(makeEntry({
      id: slugify("testimonial-" + t.name),
      type: "testimonial",
      title: `Testimonial from ${t.name} (${t.title})`,
      summary: t.text.slice(0, 180),
      details: [`"${t.text}"`],
      skills: [],
      keywords: ["testimonial", "reference", "what people say", "feedback from managers", "recommendation", "character", "teamwork", "work ethic", "army", "national service"],
      url: "#" + slugify("testimonial-" + t.name),
    }));
  }

  return entries;
}

export const portfolioKnowledge: PortfolioEntry[] = buildKnowledge();
