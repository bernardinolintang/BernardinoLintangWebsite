/* Shared slug helper. Used by portfolioKnowledge.ts (to build stable evidence
   IDs/anchors) and Portfolio.tsx (to stamp matching DOM ids on the actual
   cards), so a chat "relevant evidence" link and its target card never drift
   out of sync. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
