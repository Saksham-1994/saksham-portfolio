# Saksham Srivastava — Portfolio

A cinematic, editorial portfolio built with React, TypeScript, Vite, Tailwind CSS v4 and
Framer Motion. Scroll-driven throughout: a pinned hero that recedes as you leave it,
velocity-reactive type, pinned project panels that stack, parallax plates and a live
canvas network graph.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 — theme defined in CSS via `@theme`, no config file
- Framer Motion — scroll progress, reveals, layout transitions, springs
- Lenis — physics-based smooth scroll, with in-page anchors routed through it
- Canvas 2D — the hero's network field (no 3D engine dependency)

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build -> dist/
npm run preview   # preview the production build
npm run lint      # oxlint
```

## Project structure

```
src/
  lib/
    motion.ts          Shared easing curves, springs and reveal variants
    lenisContext.ts    Context + hook for the live Lenis instance
    useScrollLock.ts   Pauses Lenis while an overlay owns the viewport
    useMediaQuery.ts   Gates scroll transforms that only suit the desktop layout
  components/
    ui/                Reveal, Text, Parallax, Magnetic, Marquee, Counter,
                       Tilt3D, Section (Container / SectionIntro / Bezel / Chip)
    Cursor.tsx         Two-part cursor with element snapping and contextual labels
    Loader.tsx         Intro curtain driven by real asset preload progress
    Nav.tsx            Floating glass island, section tracking, overlay menu
    NetworkField.tsx   Canvas graph: drifting nodes, packets, pointer probe
    ScrollProgress.tsx Top hairline + mono percentage readout
    SmoothScroll.tsx   Lenis provider and anchor navigation
    Footer.tsx, Noise.tsx
  sections/            Hero, Ticker, About, Projects, Experience, Skills,
                       Certifications, Contact
  data/
    content.ts         Single source of truth for all resume-derived copy
public/
  saksham-portrait.jpg Portrait used in the About plate
  projects/            Product screenshots used in the Projects section
  robots.txt, sitemap.xml, favicon.svg
```

## Design system

Tokens live at the top of `src/index.css`:

- **Surfaces** — layered espresso tones (`--color-void` through `--color-card-hi`)
  so elevation reads without relying on borders.
- **Accent** — copper → gold → amber → ember.
- **Motion** — four easing curves (`--ease-expo`, `--ease-drama`, `--ease-swift`,
  `--ease-snap`). Every transition resolves to one of them; the same curves are
  mirrored in `src/lib/motion.ts` for Framer Motion.
- **Utilities** — `.bezel` / `.bezel-inner` for the nested double-bezel enclosure,
  `.duotone` for the portrait treatment, `.marquee-track`, `.grain`, `.wipe`.

Reuse the primitives in `components/ui` rather than hand-rolling per-section
animation, so timing stays consistent as the page grows.

## Performance notes

- Canvas and cursor updates are written straight to the DOM inside `requestAnimationFrame`;
  React state is reserved for discrete modes that change rarely.
- The network field suspends its loop when scrolled out of view or when the tab is hidden,
  and scales node density to viewport area.
- `backdrop-blur` is used only on fixed elements. No filter animates across a
  full-viewport surface.
- Marquees run as pure CSS transforms — no scroll listener.
- Everything degrades under `prefers-reduced-motion`: parallax, pinning, the canvas
  loop, marquees and the text decode all stand down.

## Editing content

All copy (roles, experience, projects, skills, certifications) lives in
`src/data/content.ts`. Update it there and every section reflects the change —
nothing is hardcoded in the components.

## Before deploying

- Swap `https://sakshamsrivastava.dev/` in `index.html` and `public/sitemap.xml`
  for the real domain.
- Social previews currently point at `public/saksham-portrait.jpg`. For best results,
  add a purpose-built 1200×630 `og-cover.png` and reference it in `index.html`.
- Fonts load from Fontshare (Clash Display, Satoshi, Gambetta) and Google Fonts
  (JetBrains Mono) via CDN — no local font files needed.
