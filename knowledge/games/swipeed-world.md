---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/swipeed-world.md
title: SwipeEd - The Path World (3D)
description: The React-Three-Fiber canvas world behind SwipeEd's learning path - one table-driven 77-node path on dotted paper, the interactive Unlearn/Relearn myth canvas, per-chapter dressing, the kids→adult theme flip, and the loading/perf model that keeps it alive on phones.
resource: https://swipeed.vercel.app/path
tags: [swipeed, 3d, react-three-fiber, canvas-world, performance, world]
timestamp: 2026-09-01T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# SwipeEd - The Path World (3D)

The landing screen of [SwipeEd](swipeed.md) (`/path`) is a stylised **3D winding path drawn on brand
dotted paper** - a hand-drawn *canvas* world built with **React-Three-Fiber** (`three` 0.171 + drei +
postprocessing). Every lesson is a node on this **one continuous path**; tapping a playable node
launches the game in place (see [SwipeEd → lesson engines](swipeed.md#the-lesson-engines-the-keystone)).
A 2D fallback lives at `/classic` for devices without WebGL.

> **Hard design rule - one path, always.** All per-chapter dressing below is **styling layered on the
> single path**, never a new scene, branch, or level select. The path's shape and node order never
> change; only its *look* changes as you travel.

> **⚠️ The realistic grassland world is gone.** This doc originally described a Kenney-kit 3D grassland
> with per-chapter **seasons**, **weather emitters**, and a **day/night lighting** layer. The Equal Lens
> re-skin deleted all of it (`refactor(path): canvas is the only/default world`, then
> `refactor(path): delete the realistic 3D world completely`). `src/lib/seasons.ts`,
> `src/lib/time-of-day.ts` and `src/components/weather.tsx` **no longer exist**; `path-scene.tsx` loads
> **no GLB models at all** and explicitly sets `scene.fog = null` with "season-free lighting". The
> seasonal colormap PNGs under `public/models/Textures/` and the Kenney/Holiday GLBs are **orphaned
> assets** - nothing in `src/` references them. The sections below describe what actually ships; see
> [log.md](../log/log.md) for the history of the world that was replaced.

## The path is table-driven
The entire path is generated from one spreadsheet - checked into the app repo as
**`scripts/master-node-table.xlsx`** (**77 nodes**: 69 lesson games `g01`-`g69` + 8 capstones `c1`-`c8`) -
by `scripts/gen-path.py` (openpyxl), which emits `src/content/path.ts` (`NODES`, `CHAPTERS`, and
derived legacy structures). The table is the single source of truth for:

- **Node order** along the path and each node's **lesson** (game) + **lesson emoji**.
- **Eight chapter regions** (age bands, ages 3 → parenthood), each with a banner that pops in/out as you
  scroll near it.
- **Thread tint** (a hex per learning thread) used to colour node bubbles; **gold capstones** for
  milestone nodes.
- **Built vs. not-built:** built games are enabled; unbuilt nodes render visible-but-disabled ("soon").
- **Node dependencies & gating** (the table's `prereq` chain): a node is **`locked`** until its prerequisite
  is completed (greyed, disabled, "finish earlier lessons first"). Completion is read from
  `profile.deckStars` (v2 engine games record there via `GameDone`). Gating is driven by the **age band the
  learner picks at onboarding** (`profile.entryAgeGate`): they enter at *their* chapter with its first node
  open - **without** clearing earlier chapters - earlier chapters stay open for **revision**, and the path
  gates forward from there along the linear chain. Legacy users with no age band stay **ungated**. The pure
  model is `src/lib/node-unlock.ts` (`isNodeUnlocked` / `entryStartOrder` / `entryFocusIndex`); the camera +
  "play me next" glow focus the entry chapter. Regenerate the path by re-running the script after editing the xlsx.

The world is scaled up (`PATH_SCALE = 3`), which now drives scenery/doodle density and path-point
resolution. Distance simply fades into flat paper - there are **no mountains and no horizon band** (a
`CanvasHorizon` component is defined in `path-scene.tsx` but is never mounted). Nodes **window** to
`NODE_WINDOW = 5` at a time and stream in as you move.

## The Unlearn → Relearn canvas (interactive myths)
Each chapter's stretch scatters struck-through myths along the path - **both** the brand **sticky-note
cards** (`CanvasContent`) **and** the **loose myths scribbled straight on the paper** (`ChapterDoodles`); both
are interactive (a fix after the loose ones - the prominent in-view ones - were initially left as decoration).
The brand UN/RE toolbar (`unlearn-toolbar.tsx` → `unlearn-tool.ts`) puts the metaphor in the player's hand as
**real drawing** (`MythInk`, an HTML canvas over each myth in `path-scene.tsx`):
- **Unlearn (UN = eraser):** rub the eraser across a struck myth and it **wipes away under your finger** (the
  note's own paper, or the page paper for a loose myth, paints over the words) and the **truth reveals**
  directly (reveal-on-erase - UN both rubs out *and* relearns). No-fail; the myth text stays in the DOM under
  the aria-hidden canvas for screen readers. **UN also rubs out free scribbles** on the open paper (deletes a
  whole stroke within a world-radius hit).
- **Relearn (RE = free pen):** RE is a free-scribble pen - doodle coral "Grow" ink anywhere on the open paper.
  The ink lives **in the 3D world** (`FreeInk` in `path-scene.tsx`), NOT a screen overlay: an invisible
  raycastable ground plane hands R3F the world hit point (`e.point`), and each stroke renders as a drei
  `<Line>` just above the dotted paper - so strokes **stick to the paper and scroll/perspective-shift with it**
  (like the nodes/notes). *(Earlier attempts were screen-space overlays - a drei `<Html fullscreen>` that
  drifted off-screen, then a `fixed` canvas that was glued to the camera and didn't stay on the paper; moving
  the ink into 3D fixed both.)*
- **Clean tool separation (no forward hack):** the myth notes (DOM, above the WebGL canvas) capture **only**
  when erasable (UN + myth phase) and are click-through otherwise; the `FreeInk` ground plane is below them in
  the DOM. So UN over a myth erases the myth (DOM) while UN/RE on the open paper hit the ground plane - and RE
  can scribble over a note too. Strokes clear with the toolbar Reset.
- **One finger draws, two fingers scroll - on touch AND trackpad.** Touch: an app-wide pointer map
  (capture-phase window listeners) lets one finger draw while **two fingers scroll** (a stroke aborts the
  moment a second finger lands). Trackpad: a two-finger swipe is a **wheel** event, and `onWheel` now travels
  in *every* mode (not only Browse), so trackpad scroll works while a tool is active too.

## Per-chapter styling (what replaced seasons)
Two systems dress the single path, and both cover **all eight chapters**:

- **The kids → adult theme flip.** `adultStartU` (in `path-scene.tsx`) finds the first node whose
  chapter matches `/Ch\.[678]/` and takes the midpoint between the last kids node and that node.
  `ThemeController` lerps the shared paper/dot colours toward `tokens.dark` as the camera crosses that
  point (with hysteresis so it doesn't flutter) and sets **`data-audience="adult"`** on `<html>`, so
  **Chapters 6-8 render as the brand's dark "adult" canvas** while Chapters 1-5 stay on light paper.
- **Per-chapter canvas dressing.** `CHAPTER_CANVAS` (`src/content/chapter-canvas/chapter-1.json` …
  `chapter-8.json`) scatters that chapter's struck-through **myths** and **doodle marks** along its
  stretch of the path - `CanvasContent` and `ChapterDoodles` both iterate all eight, computing each
  chapter's z-range from its nodes. Ch.1-5 are authored `audience: "kids" / theme: "light"`; Ch.6-8 are
  `audience: "adult" / theme: "dark"` (36 / 32 / 36 myths and 6 doodles each).

## Wind-down nudge
The only surviving time-of-day behaviour. A once-per-session **wind-down nudge**
(`src/components/wind-down-nudge.tsx`) appears in the quiet window (~8pm-6am by the device clock;
`?tod=night` forces it for preview) - honest "let's pick this up tomorrow" framing, *not* a blue-light
health claim. There is no day/evening/night **lighting** layer any more.

## The companion
The path companion is the **brand flying ship**, not a walking 3D character: `/brand/ship/ship-flying.svg`
plus `/brand/ship/ship-flame.svg`, rendered as a **DOM/SVG overlay** (drei `<Html>`) that rides the curve
at the player's position and banks into it. The old Kenney Mini-Characters buddy - with walk/idle
crossfades, catch-up running and a grounding shadow - went with the grassland world;
`public/models/characters/character-female-c.glb` is now an orphaned asset.

## Loading & performance (mobile-safe)
The 3× scaled world originally OOM'd WebGL on phones. The canvas world is far lighter - it loads no
models - but the staged mount survives in simplified form:

1. **Immediately** - the dotted-paper ground and background, the progress trail, the follow-cam, the
   `ThemeController` and lights.
2. **`phase >= 1`** (~220 ms) - free ink, chapter doodles, myth canvases, the nodes, chapter banners and
   the ship companion.

A timer also advances to `phase 2` (~750 ms), but nothing is currently gated on it - `phase >= 1` is the
only gate left in the file. Foliage streaming and windowed `InstancedMesh` buckets are gone with the
model kits; the `dpr` cap (1.5) and the branded loading states (`brand-splash.tsx`, `world-loader.tsx`,
which just gates the splash on drei's `useProgress`) remain.

## Where it lives (code map)
| Concern | File |
|---|---|
| The canvas scene - dotted-paper ground & background, inked path + progress trail, sticker nodes, chapter banners, myth ink (UN/RE), free ink, ship companion, follow-cam, `ThemeController` | `src/components/path-scene.tsx` (~2,300 lines) |
| Per-chapter myths & doodles | `src/content/chapter-canvas/chapter-1…8.json` ← `index.ts` |
| Wind-down nudge | `src/components/wind-down-nudge.tsx` |
| Path data (generated) | `src/content/path.ts` ← `scripts/gen-path.py` ← `scripts/master-node-table.xlsx` |
| Node gating (pure model) | `src/lib/node-unlock.ts` |

> **Orphaned pre-re-skin assets** (present on disk, referenced by nothing in `src/`):
> `public/models/Textures/colormap_*.png` (+ `scripts/gen-colormaps.mjs`), the Kenney nature/holiday
> GLBs, and `public/models/characters/character-female-c.glb`. The remaining GLB consumers are
> `grassland-backdrop.tsx` (behind `/game/[id]`) and `swipe-deck-3d.tsx` (behind the swipe deck) - not
> the path.

## Related
- [SwipeEd (app)](swipeed.md) · [World/Art artefact inventory (re-vibe scope)](world-art-tokens.md) · [Games catalog](index.md) · [Frontend stack](../architecture/deployment.md) · [Platform targets](../architecture/deployment.md)
