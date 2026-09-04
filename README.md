# RooWiki Portfolio

Personal portfolio website for RooWiki — Technical Artist, VFX Artist, and Tools Developer.

---

## Purpose

A single-page portfolio presenting featured projects, selected creative work, and professional
profiles. Designed to be clean, fast, and easy to extend.

---

## Stack

| Concern    | Technology               |
| ---------- | ------------------------ |
| Framework  | React 19                 |
| Language   | TypeScript (strict)      |
| Build tool | Vite 8                   |
| Styling    | Tailwind CSS v4 + CSS vars |
| Linting    | Oxlint                   |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 8

### Install

```bash
npm install
```

### Development server

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Production build

```bash
npm run build
```

---

## Available Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the Vite development server        |
| `npm run build`     | Type-check and produce a production build |
| `npm run preview`   | Preview the production build locally     |
| `npm run typecheck` | Run TypeScript type-checking             |
| `npm run lint`      | Run Oxlint                               |

---

## Project Structure

```
src/
  components/   # Shared UI components (Header, ThemeToggle, ProjectCard)
  sections/     # Page sections (Hero, FeaturedProjects, SelectedWork, About, Footer)
  data/         # Content data (projects.ts, links.ts)
  hooks/        # Custom React hooks (useTheme)
  index.css     # Global styles, theme variables, Tailwind import
  App.tsx       # Root component
  main.tsx      # Entry point
```

Project content lives in `src/data/` — separated from presentation components so it can be
updated independently.

---

## Theme

Light and dark mode using the iOS/iPadOS grayscale system palette. Theme is:
- Detected from `prefers-color-scheme` on first visit
- Toggled manually via the header button
- Persisted to `localStorage` under the key `roowiki:theme`
- Applied before React mounts to prevent flash

---

## Current Status

Phase 1 — Foundation complete. The site is functional with two featured projects, a Selected Work
section, an About section, and a Footer with all social/profile links.

The Circle Editor project card uses a real application screenshot (`public/projects/circle-editor.png`).
The Mesh Editor card uses a placeholder — real media will be added in Phase 2.

---

## Future Direction

- **Phase 2** — Add real project screenshots and media
- **Phase 3** — Portfolio content refinement, copy improvements
- **Phase 4** — Optional Three.js integration for interactive hero or project presentation
  (architecture is already compatible — no restructuring needed)
- **Phase 5** — Domain routing integration under `roowiki.com`

Note: domain routing and `roowiki.com` integration are deferred to Phase 5 and are out of scope
for the current foundation.
