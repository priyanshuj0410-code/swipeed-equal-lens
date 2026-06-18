# Green Light / Red Light

**The first game on the [Praxis](https://github.com/priyanshuj0410-code/praxis-engine) engine.**
(Repo/deployment keep the historical `swipeed` name; this is the real game it always stood in for.)

> "Swipe right on the green flags, left on the red ones — and learn to read a relationship before
> you're in one."

A fast, single-card **swipe game** that teaches 12–15-year-olds to recognise healthy and unhealthy
behaviours in relationships (with friends, crushes, family and online). Read a short scenario, make
a gut call — **swipe right = green flag, left = red flag** — then the reveal names the behaviour and
explains why. Behaviour-only content; no sexual content; safeguarding-first.

## Stack
- **Next.js (App Router)** + TypeScript + **Tailwind v4** + **vanilla shadcn/ui**
- **Separate design token system** (`src/app/globals.css`) incl. `--flag-green` / `--flag-red`;
  re-theme by token, never by editing components
- **PWA** — installable, offline via service worker (`public/sw.js`)
- Anonymous, **on-device** state (`src/lib/store.tsx`) — no accounts, no public leaderboards

## How it's built (content is data, never hard-coded)
- `src/content/signs.ts` — the One Love **20 signs** taxonomy
- `src/content/cards.ts` — the card bank (seeded from the GDD sample; `locale`-keyed, i18n-ready)
- `src/content/decks.ts` — deck registry + Daily Deck + School-Comfort filtering
- `src/lib/scoring.ts` — points, streaks, stars (no speed reward, no fail-state)
- `src/components/swipe-deck.tsx` — the swipe loop + reveal (+ unscored safeguarding screen)

## Key design rules (from the GDD — requirements, not polish)
- **No fail-state**; never reward speed/guessing; disguised cards score double.
- **Safeguarding** cards are **never scored** → calm supportive screen; **Get Help** is on every screen.
- **Behaviour-only**; **School-Comfort Mode** hides romantic decks.
- **Accessibility**: every swipe has a button equivalent; colour is never the only signal (icon +
  label + position); resizable text; works offline.

## Develop & deploy
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```
Deployed to Vercel (`vercel deploy --prod`) at https://swipeed.vercel.app.

## MVP scope
Daily Deck + Online & DMs + Friendships (School-Comfort-safe), swipe + reveal + Flag-pedia + Get Help
+ School-Comfort toggle. Later (GDD Phase 2/3): The Switch story mode, Classroom Mode, Build-a-Card,
Hindi + regional languages, full 250–400-card bank, audio narration.
