# AGENTS.md — Roowiki Portfolio

This file defines zone ownership for Claude Code and Codex working in parallel on this repo.
Read it before editing anything. If your task touches a "shared" file, coordinate with the other agent first.

---

## Zone ownership

### Claude Code owns
| Path | Responsibility |
|------|---------------|
| `src/sections/Hero/` | R3F canvas, 3D scene composition, hero layout |
| `src/vfx/` | All VFX scenes and particle effects |
| `src/lib/three/` | Three.js helpers, performance config |
| `src/hooks/usePerformanceTier.ts` | GPU/quality detection logic |
| `src/hooks/useReducedMotion.ts` | Accessibility motion hook |

### Codex owns
| Path | Responsibility |
|------|---------------|
| `src/sections/About.tsx` | About section content and layout |
| `src/sections/FeaturedProjects.tsx` | Featured projects grid |
| `src/sections/SelectedWork.tsx` | Selected work list |
| `src/sections/Footer.tsx` | Footer links and layout |
| `src/components/Header.tsx` | Navigation header |
| `src/components/ProjectCard.tsx` | Project card component |
| `src/components/ThemeToggle.tsx` | Theme toggle button |
| `src/data/` | Static data: projects, links |
| `src/hooks/useTheme.ts` | Theme logic |
| `src/index.css` | Global styles and design tokens |

### Shared — coordinate before editing
| Path | Who to notify |
|------|--------------|
| `src/App.tsx` | Both agents — layout and section order |
| `src/main.tsx` | Both agents — entry point and providers |
| `package.json` | Both agents — dependency changes |

---

## Protocol

1. Run `git status --short` before starting any task.
2. Treat uncommitted changes as valid work from the other agent — never revert or reformat them.
3. If you need to edit a **shared** file, leave a comment in the PR description explaining the change.
4. Open a PR when done — do not commit directly to `main`.
5. Branch naming: `claude/<task-slug>` or `codex/<task-slug>`.
6. Andrés reviews and merges all PRs.

---

## Active branches
<!-- Both agents update this section when opening or closing a branch -->
| Branch | Agent | Status | PR |
|--------|-------|--------|----|
| _(none yet)_ | — | — | — |
