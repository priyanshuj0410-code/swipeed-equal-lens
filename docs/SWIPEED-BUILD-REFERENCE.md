# SwipeEd (The Equal Lens): Build Reference

> **Historical record, June 2026 (SWED-106).** This snapshot predates the move of the knowledge base into this
> repo and the finished fleet: all 77 nodes are now built and play through one v2 engine. For the current
> picture read [SwipeEd: what we built and why](../knowledge/games/swipeed-build-overview.md), the
> [v2 engine](../knowledge/architecture/v2-engine.md) and the [knowledge base index](../knowledge/README.md).

> **What this is.** A complete map of everything built: the app layer, the progression, the
> games, and the app- and game-level mechanics: written so you can **improve a game without
> breaking anything else**. Every section ends with what's *safe to touch* vs *load-bearing*.
>
> **Repo:** `swipeed-equal-lens` (the brand re-skin app, live at `swipeed.vercel.app`).
> **Canonical design knowledge:** the Praxis repo `knowledge/` (per-game design docs, patterns).
> **Status snapshot:** 8 chapters · 77 nodes · **58 games built/playable** · 19 still "soon".

---

## 0. The 30-second mental model

```
master-node-table.xlsx ──gen-path.py──▶ src/content/path.ts  (NODES + CHAPTERS)
                                              │
                              /path page renders the 3D world (path-scene.tsx)
                                              │  tap a node ──▶ launches its game IN PLACE
                                              ▼
                 ┌────────────────────────────┴────────────────────────────┐
        FAMILY A: Swipe games                            FAMILY B: Engine (DOM) games
        useSwipeGame / useRunGame                        engine-host registry  (id ▶ component)
        content: cards/decks/runs/signs/perks            content: src/content/games/<id>.ts
        (Green Light/Red Light + MythBuster deck)         (everything else: tap/sort/sim/scenario…)
                 └────────────────────────────┬────────────────────────────┘
                                              ▼
                        GameShell (chrome) + GameDone (completion)
                                              │
                        GameDone.finishDeck(gameId, stars, coins, streak)
                                              ▼
                  Profile (localStorage)  →  deckStars[gameId] set  →  node turns "completed"
```

**The single most important contract:** a game is "done" when `profile.deckStars[gameId]` exists.
`GameDone` writes that. The node's `game` id **must equal** the key `GameDone` records. Break that
link and progress stops registering.

---

## 1. App layer / architecture

| Piece | What | Where |
|---|---|---|
| Framework | Next.js (App Router) + React 19, TypeScript | `src/app/` |
| 3D world | React-Three-Fiber / three.js (the scrolling path) | `src/components/path-scene.tsx` |
| Styling | Tailwind v4 + the `@equal-lens/brand` design system (tokens + UI kit) | `src/app/globals.css` |
| State | One `Profile` in `localStorage`, React context | `src/lib/store.tsx`, `src/lib/types.ts` |
| Audio | `SpeechSynthesis` narration (audio-first for young games) | `src/lib/speak.ts` |
| Feel | Web-Audio SFX + haptics + confetti (no asset deps) | `src/lib/juice.ts`, `src/lib/confetti.ts` |
| PWA | Service worker, offline, on-device only | `src/components/service-worker-register.tsx` |
| Deploy | Vercel **prebuilt** (`vercel build --prod` locally → `vercel deploy --prebuilt --prod`) | none |

### Routes (`src/app/`)
- `page.tsx`: landing / entry.
- `path/page.tsx`: **the main surface**: the 3D world + node→game dispatch. *(This file decides how every node launches its game.)*
- `game/[id]/page.tsx`: standalone link to one engine game (`/game/<id>`), grassland backdrop.
- `play/[deck]/page.tsx`: standalone swipe deck (`/play/mythbuster`).
- `decks/`, `flagpedia/`, `classic/`, `settings/`, `brand-test/`: the GL/RL hub, Flag-pedia, the classic 2D path, settings, a brand sandbox.

### Theming (light = kids, dark = adult)
- Brand tokens (`--color-paper`, `--color-ink`, `--dot`, …) come from `@equal-lens/brand`.
- The **adult dark theme** flips on for Chapters 6-8. The `ThemeController` in `path-scene.tsx`
  lerps the 3D dotted-paper colours and toggles `[data-audience="adult"]` on `<html>` as the camera
  crosses the Ch.5→Ch.6 boundary. **Gotcha:** Tailwind v4's import layering out-cascades the brand's
  own `[data-audience]` palette flip, so the dark tokens are also applied as **inline custom
  properties on `<html>`** (`applyAudience()` in `path-scene.tsx`). Don't "simplify" that away.

**Safe to touch:** brand token *values* (retheme flows through). Route copy. **Load-bearing:** the
`path/page.tsx` dispatch logic; the inline-token theme flip; the `@equal-lens/brand` import order in
`globals.css`.

---

## 2. The progression system

### Source of truth → generated path
`src/content/path.ts` is **AUTO-GENERATED: do not hand-edit.**

```
scripts/master-node-table.xlsx  ──(python3 scripts/gen-path.py)──▶  src/content/path.ts
```

`gen-path.py` holds three hand-maintained maps you edit to wire a node:
- `GAME`: `node_id → game dispatch id` (set this to make a node *playable*; omit = renders "soon").
- `EMOJI`: `node_id → emoji`.
- `CHAPTER_SUBTITLE`: chapter → tagline.

After editing the xlsx or those maps: `python3 scripts/gen-path.py` → rebuild.

### The shape
- **8 chapters, 77 nodes.** `NODES: GameNode[]` (order, id, label, type, chapter, ageGate, thread,
  threadName, hex, topics, prereq, buildsOn, note, emoji, **game?**, href?). `CHAPTERS: Chapter[]`
  (key, title, subtitle, ageGate, startOrder, endOrder).
- **Threads (the curriculum spine), colour-coded:** A Body & Growing Up · B Safety/Consent ·
  C Feelings & Life-Skills · D Relationships · E Gender & Respect · F SRH · G Values/Rights/Media
  (+ compound `D/E`, `E/G`, `F/D`; `★` capstones).
- **Chapters:** 1 (3-6) · 2 (6-9) · 3 (9-12) · 4 (12-15) · 5 (15-18), *kids, light theme* ·
  6 (18-22 College) · 7 (22→first child, Building a Life) · 8 (Parenthood + Parent Layer): *adult, dark theme*.
- **Gating = "Phase 0": there is no gating yet.** `prereq`/`buildsOn`/`ageGate` are carried in the
  data but **not enforced**. A node is `playable` if it has a built `game`, `completed` once
  `deckStars[game]` exists, else `soon`. (See `path/page.tsx` `nodes` useMemo.)

### Canvas dressing (the world content)
- `src/content/chapter-canvas/chapter-{1..8}.json` → struck-through "myths" + truth scribbles +
  doodles scattered along each chapter's stretch of path (`CanvasContent` / `ChapterDoodles` in
  `path-scene.tsx`). Ch.6-8 are the adult (dark) myth sets. This is *atmosphere*, not gameplay.

**Safe to touch:** node `note`/labels/emoji (via xlsx + regen); chapter-canvas content JSON.
**Load-bearing:** `path.ts` is generated (edits get overwritten); the chapter string must match
between the xlsx and the canvas JSON's `chapter` number; the `GAME` map id must match an engine/deck id.

---

## 3. App-level mechanics

### The Profile (the one piece of state): `src/lib/store.tsx` + `types.ts`
One object in `localStorage`, **default-merged on load** (add new fields freely; no key bump).
Key fields & the API that writes them:

| Field | Meaning | Written by |
|---|---|---|
| `deckStars: Record<id, 0-3>` | **best stars per game, this is what marks a node done** | `finishDeck()` |
| `coins`, `bestStreak` | currency + best streak (cosmetic) | `finishDeck()` |
| `signMastery` | per-sign seen/correct (GL/RL Flag-pedia) | `recordSign()` |
| `runsCompleted`, `runDeckCleared`, `disgSeen/disgCorrect` | GL/RL run meta-progression; **disguised-card accuracy is the headline learning signal** | `finishRun()` |
| `toolkit: {toolId: {level, lastUsedAt}}` | the Life-Skills Toolkit (Thread C) | `unlockTool()`, `useTool()` |
| `calmMode`, `mood`, `dailyStreak{count,freezes}` | wellbeing shell + the **kind streak (with freezes, no shame)** | `setCalmMode`, `markMood`, `bumpStreak` |
| `schoolComfort`, `textScale`, `muted` | settings (School-Comfort hides romantic decks; resizable text; global mute) | settings actions |

`useProfile()` exposes: `finishDeck`, `recordSign`, `finishRun`, `unlockTool`, `useTool`,
`setSchoolComfort`, `setTextScale`, `setMuted`, `setCalmMode`, `markMood`, `bumpStreak`, `reset`, …

### Shared game chrome & completion
- **`GameShell`** (`components/game-shell.tsx`): the glass top bar (close · title · progress ·
  tools) + centred body. Every game renders inside it. Collapses the global **Get Help** to an icon
  while playing (`data-playing` on `<html>`).
- **`GameDone`** (`components/games/game-done.tsx`): the shared "you did it" card. **Records
  completion exactly once on mount**: `finishDeck(gameId, stars, coins, bestStreak)` +
  `toolsUnlockedBy(gameId)` (Thread-C levelling) + `celebrate("big")`. Capstones (`gameId` starting
  `capstone-`) also render a `ToolkitReflection`.

### The Life-Skills Toolkit (Thread C spine): `src/lib/toolkit.ts`
Four persistent tools the child carries across years: **Cool-Down · Decision-Steps · Talk-It-Out ·
Help-Map**. A dedicated Thread-C game *teaches & levels* each (`THREAD_C_LEVEL`: feelings→1,
heart-smart→2, mind-matters→3, bounce→4, life-ready→5). Other games **reference** them via
`<ToolMoment>`: an optional, never-blocking "this is a Cool-Down moment" nudge (self-hides if the
tool isn't unlocked). The drawer/player live in `components/toolkit/`.

### The feel layer (consistency across all games)
- `juice.ts`: Web-Audio SFX (green/red/combo/shatter), haptics, shake/pulse; global mute; pauses on
  `document.hidden`; gated by `prefers-reduced-motion` (motion only). `confetti.ts` `celebrate(size)`.
- `speak.ts`: narration. **Contract:** strips emoji before speaking; fires `onEnd` when narration
  completes **with a length-based fallback** (≈ words×320 ms) so a muted/headless run still paces
  transitions; `replay()` re-speaks the last line. *(Many games advance scenes on `say(text, onEnd)`
  they wait for the audio/fallback.)*

### Get Help (safeguarding): `components/get-help.tsx`
A persistent route to real helplines, on every screen (collapses to an icon during a game). **Never
remove this**, and **never score safeguarding content** (see §7 contracts).

### The path's Unlearn/Relearn layer
On `/path`: the brand **UN/RE toolbar** (`unlearn-toolbar.tsx`) + a shared tool store
(`lib/unlearn-tool.ts`) let you Browse (travel) / Unlearn (smudge a myth) / Relearn (reveal the
truth) directly on the canvas myth-notes. Camera travel is frozen while a UN/RE tool is selected.

**Safe to touch:** coins/stars *values* a game awards; copy; adding new optional profile fields.
**Load-bearing:** the `gameId → deckStars` key; `GameDone` recording once; `speak`'s `onEnd`
contract; the toolkit `THREAD_C_LEVEL` map; never breaking Get Help / the safeguarding rules.

---

## 4. The games: two families & one catalog

A game = **a component** (`components/games/<name>.tsx`, exported `<Name>Game({onExit})`) + usually
**a content file** (`content/games/<name>.ts`) + a **registry/dispatch entry**.

### Family A: Swipe games (the Green Light / Red Light engine)
- **Engine:** `useSwipeGame` (the per-card swipe atom) + `useRunGame` (the roguelike *run* layer:
  a **Clarity** stake meter, combos, perks, two forks, a boss, a no-hard-fail resolution
  `lib/use-run-game.ts`, `lib/run-scoring.ts`). UI in `components/glrl/` (loadout · run-host ·
  clarity-meter · fork · resolution · debrief).
- **Content as data:** `content/cards.ts`, `cards-runs.ts`, `decks.ts`, `runs.ts`, `signs.ts` (the 20
  flag "signs"), `perks.ts`, `characters.ts`. Card schema in `types.ts` (`Card`, `Sign`, `Deck`,
  `RunDeck`, `Perk`, …). **Flag-pedia** (`flagpedia-view.tsx`) is the taxonomy of 20 signs with mastery.
- **Games on it:** **Green Light / Red Light** (`glrl`, the flagship roguelike) and **MythBuster:
  Gender** (a swipe deck at `/play/mythbuster`, *plus* a 5-mode engine version `mythbuster-lab`).

### Family B: Engine (DOM) games
- **Dispatch:** `components/games/engine-host.tsx`, a registry `Record<id, dynamic(Component)>`.
  `hasEngineGame(id)` + `<EngineGameHost id onExit/>`. The `/path` page launches these in place;
  `/game/[id]` plays one standalone.
- **Content:** `content/games/<id>.ts` (typed data per game).
- **Games on it:** everything else, and these are *bespoke per game*: tap/sort, build, branching
  life-sims (Crossroads, Plan It), tower-defence (Defenders), balancing sims (Equalize), media
  editors (Flip the Script), an animated breathing **Calm Corner** (Feelings Friends), etc.

### Two shared *sub-engines* inside Family B (⚠ shared blast radius)
- **`ModesEngine`** (`components/games/modes-engine.tsx`): a generic "modes game": home grid + Sam
  host + badge book + **4 mode kinds** (scenes chooser · UN→RE myth-bust · tap-reveal list · Ask-It).
  A game on it = a `GameConfig` (`content/games/<id>.ts`) + a one-line wrapper. **Powers 8 games:**
  `swipe-right, real-relationships, own-your-health, money-independence, mind-belonging,
  find-your-feet, equal-confident, know-your-rights`. (`consent-real` is the same shape but a
  hand-built component.) **Editing `ModesEngine` touches all 8 at once.**
- **`CapstoneEngine`** (`components/games/capstone-engine.tsx`): the chapter-graduation "light the
  stars" pattern, driven by a `CapstoneConfig`. **Powers `capstone-6`.** (`capstone-1..5` are
  bespoke near-identical components.)

### Full catalog (genre · age)
*Kids (Ch.1-5, light theme): distinct, bespoke mechanics:*
Feelings Friends (3-6, tap/SEL + breathing) · My Body My Rules (3-6, tap/sort body-safety) · Clean
Crew · My Family Garden (build) · Same Same Different · Can-Do Kids (dress-up) · Body Lab Juniors
(6-9, explore/label) · What Makes Me Me (sort) · Safety Squad · Friend or Frenemy? (branching story)
· Heart Smart · Fair Play World (run-a-world meter) · Not Fair Not Funny · Smart Screen Heroes ·
Puberty Quest (9-12, myth-quest + Ask-It) · Mind Matters · The Amazing Journey · Boundary Bot
(consent sim) · Crossroads (branching life-sim) · Flip the Script (media editor) · Norm Storm
(sort-and-reason) · Speak Up · Defenders of the Body (tower-defence) · Body Confident (12-15) ·
Bounce (resilience) · Plan It (SRH life-sim) · Outbreak (containment sim) · **Green Light / Red Light
(swipe roguelike)** · MythBuster: Gender (lab + swipe deck) · Equalize (balancing sim) · Stand Up
(bystander) · Firewall (online-safety scenarios) · The Rabbit Hole (manosphere/positive masculinity)
· Reality Check (media literacy) · My Choices My Future (15-18, decision-sim) · Status: Know It ·
Mutual (consent scenarios) · Spectrum · Lead the Way · Change Makers (project + campaign sim) ·
Justice League: Rights · Life Ready · Decoded (digital-citizenship finale) · **Capstones 1-5** (bespoke).

*Adult (Ch.6, dark theme): ALL on the ModesEngine MCQ shape (the prime improvement target, see §8):*
Consent For Real · Swipe Right? · Real Relationships · Own Your Health · Money & Independence ·
Mind & Belonging · Find Your Feet · Equal & Confident · Know Your Rights · **Capstone 6**.

*Not yet built ("soon"):* Ch.7 lessons g53, g60 + c7; Ch.8 lessons g61, g69 + c8 (19 nodes).

**Safe to touch:** any single bespoke game's component + its content file (blast radius = that one
game). **Load-bearing:** `ModesEngine`/`CapstoneEngine` (shared, see blast radius above);
`engine-host` registry; `useSwipeGame`/`useRunGame` + the GL/RL `Card`/`Deck` schemas (drive GL/RL +
MythBuster + the run decks).

---

## 5. Game-level mechanics: the patterns every game inherits

From the Praxis patterns doc (`knowledge/games/swipeed-game-patterns.md`): the contracts a new or
changed game must keep:

1. **Content is data, never hard-coded** (`src/content/*`, locale-keyed).
2. **One reusable engine per *verb*; games are content on it** (the swipe atom, the run layer, the
   ModesEngine, the engine-host).
3. **Play in place; finish into a shared completion** (`GameDone`).
4. **No hard fail; never reward speed**: a *stake* (GL/RL Clarity), not lives; running out →
   reflective ending + review-the-missed, never "Game Over".
5. **Safeguarding is never scored**: genuine-abuse content routes to a calm support screen; **Get
   Help** is one tap away on every screen.
6. **White-hat only**: no FOMO timers, heart-gating, pay-to-continue, public ranking; rewards cosmetic.
7. **Aids never auto-win** (perks/hints aid reading/comfort, earned by play).
8. **Name the behaviour** (the 20-sign taxonomy; the reveal *names* the thing).
9. **The Unlearn → Relearn → Grow beat**: UN (erase, no shame) + RE (redraw, with a reason), used
   with restraint at genuine-misconception moments.
10. **Accessibility non-negotiable**: colour is never the only signal; large-button equivalent for
    every gesture; resizable text; offline; audio narration with the `speak` contract.
11. **One shared juice layer** (`juice.ts`): consistent feel; `celebrate()` for the positive chime.
12. **Progress persists simply + forward-compatibly** (default-merged profile).
13-16. Age-adaptive friendly tone · Made-for-India + School-Comfort · don't villainise a category
   (balance red flags with genuine green) · **sensitive topics empower, never frighten** ("it's never
   your fault", co-play, non-graphic, persistent helpline).
17-22. Identity builders represent every child (`make-a-kid.tsx`) · **Ask-It** (anonymous Q&A that
   always routes distress to help) · myth-bust by *choosing the truth* then UN→RE · **wellbeing
   register** (healthy-coping-only, crisis-routing-first, never therapy; Tele-MANAS 14416 / KIRAN) ·
   the skills spine (toolkit + tool-moments) · the de-radicalisation register (funnel-not-the-kid).

**Safe to touch:** deepening content within these rules. **Load-bearing:** patterns 4, 5, 9, 10, 16,
18, 20 are *ethical contracts*: never trade them for engagement.

---

## 6. The "don't break this" checklist

1. **`node.game` id === the id `GameDone` records === the engine-host/deck id.** All three must match
   or completion silently fails.
2. **`path.ts` is generated**: edit `scripts/master-node-table.xlsx` + `gen-path.py` maps, then
   `python3 scripts/gen-path.py`. Hand-edits get overwritten.
3. **A new engine game needs all three:** `content/games/<id>.ts` + `components/games/<id>.tsx`
   (exports `<Name>Game`) + an `engine-host.tsx` registry line + a `gen-path` `GAME[node]=<id>`.
4. **`GameDone` records once** (effect on mount): don't call `finishDeck` elsewhere for the same game.
5. **Shared engines have blast radius:** `ModesEngine` → 8 games · `CapstoneEngine` → c6 ·
   `useSwipeGame`/`useRunGame` → GL/RL + MythBuster · `GameShell`/`GameDone`/`Sam`/`UnReBeat` → all.
   Change a shared file deliberately; change a single game's own files freely.
6. **Profile is forward-compatible**: only *add* optional fields (default-merged). Don't rename/remove.
7. **Theme:** the adult dark flip uses inline `<html>` tokens (Tailwind layering quirk), keep it.
8. **Deploy = prebuilt** (`vercel build --prod` then `deploy --prebuilt`) because the `@equal-lens/brand`
   tarball is a local `file:` dep; Vercel can't resolve it on a normal build.
9. **Ethics contracts (§5)**: Get Help everywhere, safeguarding never scored, no-hard-fail, UN→RE
   with restraint, wellbeing crisis-routing.

---

## 7. How to improve a game safely (playbook)

- **Tweak wording / scenarios / myths:** edit the game's content file only. Zero blast radius.
- **Change one game's mechanic/feel:** edit its `components/games/<id>.tsx` (+ its content). Blast
  radius = that game: *unless* it's a `ModesEngine`/`CapstoneEngine` wrapper (then you're changing
  content config, still safe) or you edit the engine itself (then all its games).
- **Add a brand-new game type:** build a new bespoke component + content + register it (§6.3). Don't
  bolt it onto the ModesEngine if it's a genuinely different verb: give it its own component
  (that's exactly what the kids games do).
- **Re-skin / retheme:** change brand token values; it flows through (light + dark).
- **Verify before deploy:** `npm run build`; open `/game/<id>` (DOM games), play each mode/flow;
  for GL/RL play a run to the resolution. Then prebuilt-deploy.

---

## 8. Current quality state (honest improvement surface)

- **Kids games (Ch.1-5): strong.** Each is a *distinct, bespoke* experience, e.g. Feelings Friends
  has six interactions incl. an animated breathe-with-Sam Calm Corner and a tactile haptic "Big No";
  GL/RL is a full roguelike; there are sims, tower-defence, media editors. ~180-340 lines of real
  mechanics each. **Keep these as the bar.**
- **Adult games (Ch.6): shallow, the prime target.** All nine were built fast on one `ModesEngine`
  (scene-MCQ + myth-bust + tap-list + Ask-It). Same shape every time, 2-4 thin items per mode. They
  are *correct and safe* (ethics contracts intact) but they are **not distinct games and the content
  is thin.** The improvement work: give each its own verb/mechanic + deeper content, to the Ch.1 bar.
- **Capstones: light** celebration screens (light the stars). Fine as chapter punctuation.
- **Not built:** Ch.7 (g53, g60 + c7) and Ch.8 (g61, g69 + c8), design exists in the GDDs
  (`design/gdd/` here / `knowledge/games/` in Praxis); no code yet.

---

## 9. File map (where to look)

```
src/app/path/page.tsx ........ THE dispatcher: node → game launch (read this first)
src/components/path-scene.tsx  the 3D world, theme flip, canvas myth-dressing
src/lib/store.tsx · types.ts   the Profile contract (completion, toolkit, wellbeing)
src/lib/use-swipe-game.ts ·
   use-run-game.ts · run-scoring  the GL/RL swipe + roguelike-run engines
src/lib/toolkit.ts ........... Life-Skills Toolkit (which game levels which tool)
src/lib/{juice,confetti,speak}.ts  the shared feel + narration layer
src/components/games/
   engine-host.tsx ........... the DOM-game registry (id → component)
   game-shell.tsx · game-done.tsx  shared chrome + completion contract
   modes-engine.tsx · capstone-engine.tsx  the shared sub-engines (blast radius!)
   sam.tsx · un-re.tsx · make-a-kid.tsx     shared characters/components
   <one .tsx per game>
src/components/glrl/ ......... the Green Light/Red Light run UI
src/components/toolkit/ ...... toolkit drawer · tool-moment · breathing space · mood
src/content/
   path.ts (GENERATED) · chapter-canvas/  the progression + world dressing
   games/<id>.ts ............ per-game content (data)
   cards.ts · decks.ts · runs.ts · signs.ts · perks.ts · characters.ts  GL/RL content
scripts/gen-path.py + master-node-table.xlsx  the progression generator (source of truth)
design/ ...................... the GDDs + design docs (reference; not imported)
```

**Praxis (`knowledge/`):** `games/index.md` (catalog), `games/<name>.md` (per-game design),
`games/swipeed-game-patterns.md` (the contracts), `architecture/`, `log.md`.

---

*Generated as a build snapshot. The two safest rules of thumb: (1) keep the `gameId` link intact
end-to-end, and (2) know whether the file you're editing is **one game's** or a **shared engine's**.*
