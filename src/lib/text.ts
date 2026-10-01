/* Splits prose into sentences on ". " / "! " / "? " and line breaks.
   Written without regex lookbehind, which older Safari can't parse. */
export function splitSentences(text: string): string[] {
  return text
    .replace(/([.!?])\s+/g, "$1\u0000")
    .split(/\u0000|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
