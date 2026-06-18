# SwipeEd

**The first game on the [Praxis](https://github.com/priyanshuj0410-code/praxis-engine) engine.**

SwipeEd turns the swipe — the gesture most associated with passive "brainrot" scrolling — into
**active micro-learning**: bite-sized cards you engage with, reveal, and self-assess. Swipe right if
you know it, left to review.

This is a standalone, deployable app used to validate the platform end-to-end and as the reference
title for the per-game repo model. It lives in **its own repo** (separate from `praxis-engine`) per
the platform's architecture.

## Stack

- **Next.js (App Router)** + **TypeScript** + **React**
- **Tailwind CSS v4** + **vanilla shadcn/ui** (components are unmodified; all theming is token-driven)
- **Separate design token system** — primitive → semantic CSS variables in `src/app/globals.css`;
  re-theme by swapping token values, never by editing components
- **PWA** — installable on mobile via `app/manifest.ts` + a service worker (`public/sw.js`)

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Regenerate placeholder PWA icons (solid brand colour):

```bash
node scripts/gen-icons.mjs
```

## Deploy

Connected to **Vercel** with Git integration: every push to `main` ships a production deploy and
every PR gets a preview URL.

## Relationship to the Praxis engine

Today SwipeEd self-contains its stack (its own tokens + shadcn). As the engine matures, the shared
design system and Engine SDK will be published from `praxis-engine`, and SwipeEd will consume them and
register with the engine's game registry — without forking the design system. See the engine's OKF
docs: `architecture/repo-topology.md`, `architecture/design-system.md`, `architecture/frontend-stack.md`.
