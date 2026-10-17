import { useEffect, useState } from "react";

/* "You are visitor #N" in the footer.
   A browser is counted once: the first visit asks the server for the next
   number and saves it in localStorage; later visits just show the saved
   number. If anything fails, the counter quietly stays hidden. */

const STORAGE_KEY = "al-visitor-number";

function readSaved(): number | null {
  try {
    const value = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isInteger(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function save(value: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Storage blocked (private mode etc.): still show the number this visit.
  }
}

// Shared across mounts so React StrictMode's double effect only counts once.
let pending: Promise<number | null> | null = null;

function claimVisitorNumber(): Promise<number | null> {
  pending ??= fetch("/api/visitor-count", { method: "POST" })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      const count = typeof data?.count === "number" ? data.count : null;
      if (count) save(count);
      return count;
    })
    .catch(() => null);
  return pending;
}

export function VisitorCounter() {
  const [number, setNumber] = useState<number | null>(readSaved);

  useEffect(() => {
    if (number) return;
    let active = true;
    claimVisitorNumber().then((count) => {
      if (active && count) setNumber(count);
    });
    return () => {
      active = false;
    };
  }, [number]);

  if (!number) return null;

  return (
    <span className="al-visitor" aria-live="polite">
      <span className="al-visitor-dot" aria-hidden="true" />
      You are visitor <strong>#{number.toLocaleString("en-US")}</strong>
    </span>
  );
}
