# Bernardino Lintang — Portfolio Website

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://bernardino-lintang-website.vercel.app/)

Personal portfolio website for **Bernardino Lintang**, a Data Science & Analytics student at the National University of Singapore (NUS) specialising in AI engineering, GenAI systems, and data infrastructure.

**Live:** [bernardino-lintang-website.vercel.app](https://bernardino-lintang-website.vercel.app/)

---

## Sections

| Section | Description |
|---|---|
| **Hero** | Introduction with quick links to resume, GitHub, and LinkedIn |
| **About** | Background, key statistics (internships, projects, competitions), and skills overview |
| **Work Experience** | Timeline of internships across fintech, government, and enterprise |
| **Competitions** | Datathons, hackathons, and case challenges with results and tech stacks |
| **Projects** | Machine learning, data visualisation, and full-stack projects |
| **Events & Community** | Workshops, office tours, club activities, and creative portfolio |
| **Testimonials** | Recommendations and endorsements from colleagues and supervisors |
| **Contact** | Email, LinkedIn, and GitHub links |

---

## Features

- Light / dark mode toggle
- Smooth scroll navigation with active section highlighting
- Responsive layout with hamburger menu on smaller screens
- Scroll-triggered reveal animations (Framer Motion)
- Interactive filter tags for events
- Expandable cards with "Show more / Show less" for long content
- Testimonials carousel with auto-play and keyboard navigation
- Resume access modal with email / LinkedIn CTA

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build** | [Vite](https://vitejs.dev/) (SWC) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + CSS custom properties for theming |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives + CVA) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/bernardinolintang/BernardinoLintangWebsite.git
cd BernardinoLintangWebsite

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The site runs at `http://localhost:5173` by default.

### Other commands

```bash
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally on port 4173
```

---

## Project Structure

```
src/
├── components/
│   ├── Portfolio.tsx              # Main portfolio component (all sections)
│   ├── TestimonialsCarousel.tsx   # Testimonials carousel with auto-play
│   ├── ThemeProvider.tsx          # Light/dark mode context
│   ├── figma/
│   │   └── ImageWithFallback.tsx  # Image component with error fallback
│   ├── motion/
│   │   ├── Reveal.tsx             # Scroll-triggered reveal animation
│   │   └── HeroInteractiveGradient.tsx
│   └── ui/                        # shadcn/ui components
├── lib/
│   └── utils.ts                   # Utility helpers (cn, etc.)
├── index.css                      # Global styles + Tailwind + theme variables
├── App.tsx                        # App root
└── main.tsx                       # Entry point
```

---

## License

This project is personal and not open-sourced for reuse. Feel free to reference the structure for inspiration.
