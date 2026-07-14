# How to edit your site

Everything you'll normally touch lives in **two files**. You do not need to
understand React to change your content.

---

## 1. Change wording, add/remove a job, competition, or project

Open **`src/data/portfolioContent.ts`**.

It contains plain lists (arrays) of your content:

- `experiences` — your internships
- `competitions` — hackathons and competitions
- `projects` — side projects and coursework
- `events` — community / club roles
- `testimonials` — recommendation quotes
- `skills` — the skill tags in the About section
- `profile` — your name, tagline, availability, and contact links

Editing this file updates the site **and** the "Ask about Bernard" chat
assistant at the same time — the assistant reads its knowledge from here.

Each entry is a block like this:

```js
{
  title: "Data Engineer Intern",
  company: "Home Team Science and Technology Agency (HTX)",
  period: "May 2026 – Aug 2026 · Singapore",
  bullets: [
    "First bullet point.",
    "Second bullet point.",
  ],
  tags: ["Python", "SQL", "Docker"],
},
```

- **Edit text**: change what's inside the quotes.
- **Add an entry**: copy a whole `{ ... }` block, paste it above or below,
  keep the comma after the closing `}`.
- **Remove an entry**: delete the whole `{ ... }` block including its comma.
- **Reorder**: cut and paste blocks. Top of the list = top of the section.

Rule of thumb: keep the quotes and commas exactly where they are. If the site
breaks, you probably deleted a comma or a quote.

The hero headline, About paragraphs, and Contact text shown on the page live
in `src/components/Portfolio.tsx` inside the `return (...)` — search for the
words you see on the page and edit them in place. If you change them, also
update the matching text in the `profile` object of
`src/data/portfolioContent.ts` so the chat assistant stays accurate.

---

## 2. Change colours

Open **`src/apple.css`**. The top block is all you need:

```css
:root {
  --al-bg: #fbfbfd;       /* page background */
  --al-bg-alt: #f5f5f7;   /* alternate section background */
  --al-ink: #1d1d1f;      /* main text */
  --al-ink-2: #6e6e73;    /* secondary text */
  --al-accent: #0071e3;   /* links + buttons (change this to rebrand fast) */
  --al-grad: linear-gradient(90deg,#0071e3 0%,#7d3cf0 55%,#e64980 100%);
}
```

Change a hex value, save, done. The single highest-impact change is
`--al-accent` — swap it and every link, button, and badge updates.

To change the gradient on the headline word and the stat numbers, edit
`--al-grad`.

---

## 3. Change images

All images live in the **`public/`** folder. In the code they're referenced by
name with a leading slash, e.g. `image: "/nus-datathon-2026.jpg"` points to
`public/nus-datathon-2026.jpg`.

To swap an image: put your new file in `public/`, then update the `image:`
line to match its filename. Your profile photo is `formal-picture.JPG`.

**Important — compress before you add.** Big images make the site slow. Keep
each image under ~300 KB and no wider than ~1400px. Any online tool
("compress jpg") works. (The images already in the project were compressed for
you.)

---

## 4. Preview locally before deploying

In the VS Code terminal, from the project folder:

```bash
npm install      # first time only
npm run dev      # starts a local preview, opens http://localhost:5173
```

Edit files, save, and the browser updates instantly. Stop it with `Ctrl+C`.

---

## 5. Deploy to Vercel

Your project is already on Vercel and connected to GitHub, so:

```bash
git add .
git commit -m "Update site: Apple redesign, new content"
git push
```

Vercel rebuilds and deploys automatically within ~1 minute. Check your Vercel
dashboard for the live URL.

If you ever need to set it up fresh: import the GitHub repo at vercel.com,
framework preset **Vite**, build command `npm run build`, output directory
`dist`.

**Environment variables (needed for the chat assistant):** in the Vercel
dashboard go to Project → Settings → Environment Variables and add
`GROQ_API_KEY` (your key from console.groq.com). Optionally add `GROQ_MODEL`
to override the default `llama-3.3-70b-versatile`. Locally, the same values
live in `.env.local`, which is never committed to git.

---

## 6. The "Ask about Bernard" chat assistant

- Its knowledge comes from `src/data/portfolioContent.ts` — edit your content
  there and the assistant automatically knows about it.
- The floating button, suggested questions, and recruiter modes are in
  `src/components/PortfolioChat.tsx`.
- Answer rules (tone, grounding, word limits) are in `src/lib/chatCore.ts`
  (`systemPrompt`). The server endpoint is `api/portfolio-chat.ts`.
- It has built-in rate limiting (10 questions / 10 min per visitor, 500/day
  total). Adjust the constants at the top of `src/lib/chatCore.ts`.
- Questions asked are tracked as Vercel Analytics custom events
  (`chat_opened`, `chat_question_asked`, `chat_source_clicked`, …) so you can
  see what recruiters actually ask.

---

## Notes on this redesign

- The old dark-theme component was **not deleted** — it's backed up at
  `src/components/Portfolio.dark-backup.tsx.txt`. If you ever want to revert,
  rename it back to `Portfolio.tsx` (and remove the new one).
- The theme is now forced to **light**. The old light/dark toggle was removed
  on purpose — one design done precisely beats two maintained loosely.
- `public/` still contains several **unused** images from the old site
  (e.g. `mount-prau.jpg` at 3.7 MB, various `-logo` and case-study files).
  They don't slow down the live page (the browser only downloads what's shown),
  but you can safely delete any image not referenced in `Portfolio.tsx` to
  shrink your repo.
