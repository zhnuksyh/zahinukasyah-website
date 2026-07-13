# zahinukasyah.com

Personal portfolio website for Zahin Ukasyah — a single-screen, animation-heavy
home experience built around a fan of interactive cards.

## Features

- **Card fan** — five tilted cards (Design, Animation, Application, Research,
  Games) that glide to center, flip, and expand fullscreen when opened.
- **Design & Animation galleries** — drag-scrollable bento walls with a
  fullscreen detail view per piece.
- **Application grid** — flip cards for selected work.
- **Research** — a reading list with per-paper notes.
- **Arcade** — a walkable mini-world (WASD/arrows + Enter) where each orb is a
  game with its own detail page.
- **About / Journal / Collab** pages with staged entrance animations, plus a
  social overlay and an email popup.

## Stack

- [React 19](https://react.dev) + TypeScript
- [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

## Structure

```
src/
  App.tsx          # page shell: background, header, pages, overlays
  components/      # one component per file
  data/content.ts  # all site content (currently placeholder copy)
  lib/             # color helpers, theme constants, drag-scroll hook
```
