# Phase 6 — The 2.5D Sticker Canvas (replace the 3D world)

> Design-of-record for re-imagining the game world as a **2.5D parallax sticker canvas** in The Equal Lens
> style. This **replaces** the R3F 3D seasonal path. Companion to `docs/brand-alignment.md`. No app code
> until sign-off — this is the build map.

## Why
The brand's signature is *"the whole site is a canvas"* on a **sticker + doodle + dotted-paper** kit. Our
UI is now all sticker — but a realistic 3D world behind sticker cards is the one remaining mismatch. Making
the world itself a doodle/sticker canvas makes the game **one visual language** and makes it *be* the brand.
Bonus: it's far lighter (no WebGL / 34 GLTF models / colormaps / per-frame season drivers), which serves
the brand's **audio-first, offline-friendly, low-end-device** reach (India); Lensy (a 2D sticker) finally
belongs in her own world; and themed sticker packs are cheap to author and re-vibe.

## Decisions (locked)
- **Depth model:** **2.5D parallax** — layered sticker planes with CSS-perspective parallax + a gentle
  tilt. Pure DOM/SVG/CSS; **no WebGL**.
- **Replace** the 3D world — but **only after the 2.5D build is verified and signed off.** Phase 6 ships
  the canvas **coexisting behind a flag** (`?world=canvas`; 3D stays the default and fully intact); the R3F
  deletion is a **separate, signed-off step** once the 2.5D build is approved. **Do not delete the 3D part
  without a sign-off.**
- **Interactive canvas → Phase 7** (drawable trail + UN/RE-erasable "myth" stickers). Phase 6 is decorative.
- **Keep the 5 chapter themes** — each chapter gets its own sticker + doodle pack and palette.

## Proposed defaults (confirm)
- **Navigation:** a **vertical, winding scroll-trail** (Duolingo-style) — most natural on mobile and reads
  cleanly with parallax. *(Was the 3D "travel into the distance"; this becomes "scroll a winding trail.")*
- **Parallax driver:** scroll position (primary) + **optional device-tilt (gyro)** for extra pop; pointer
  on desktop. **Reduced-motion → static** layered scene (no parallax/tilt).
- **Stickers, stub-first:** Phase 6 ships with **stub stickers** (the doodle-set marks + simple SVG shapes
  — a pine, a hill blob, a cloud puff, a snow mound) themed by palette, so the canvas is fully working and
  themed-but-rough. The **official 5 themed packs** drop into `public/brand/canvas/<theme>/` later and swap
  in — the same placeholder→official flow we used for the logo.

## Architecture
A scrolling stack of parallax layers (back → front), each translating at its own depth-rate as you travel,
under a shared CSS `perspective` (+ small tilt). Game overlays (already sticker) mount **above** the canvas,
unchanged.

| Layer | Content | Parallax |
|---|---|---|
| Sky / backdrop | themed gradient + dotted paper + far doodles (sun, clouds) | slowest |
| Far scenery | distant treeline / hills stickers | slow |
| Mid scenery | themed trees / rocks stickers | medium |
| **Trail** | the doodled winding path + **node sticker-bubbles** (from `path.ts`) + **Lensy** walking | base |
| Foreground | edge foliage / grass stickers (frames the depth) | fastest |

### Proposed components (`src/components/canvas/`)
- `world-canvas.tsx` — root; mounts the parallax stage + trail; replaces the R3F mount in `src/app/path/page.tsx`.
- `parallax-stage.tsx` — layered container; reads scroll (+ optional gyro/pointer); applies `perspective` +
  per-layer `translate3d` at depth-scaled rates; reduced-motion aware.
- `scenery-layer.tsx` — renders a themed set of sticker props at depths (data-driven from the chapter theme).
- `path-trail.tsx` — the doodled winding trail (an SVG path) threading the chapter regions; places nodes along it.
- `node-sticker.tsx` — one lesson/capstone node: sticker bubble (emoji + thread-colour ring), states
  (playable / soon = greyed / done = gold), launches the engine game in place.
- `lensy-walker.tsx` — Lensy sticker parked at the current node; bob/wave; animates to the next on progress.
- `weather-doodles.tsx` — CSS/sticker particles per theme (rain · snow · leaves · petals as doodle marks).

### Themes (`src/lib/canvas-themes.ts`)
The 5 chapter regions as data: `{ key, name, palette {sky, ground, accent}, stickerPack (refs to
`/brand/canvas/<theme>/*` or stub shapes), weather }`. Adjacent themes **cross-fade** as you scroll past a
region boundary. Re-imagined in the violet + 4-accent family with seasonal accents:
Ch.1 Summer · Ch.2 Rainy · Ch.3 Autumn · Ch.4 Winter · Ch.5 Spring.

### Day / night
Keep `src/lib/time-of-day.ts`'s **phase logic** (day/evening/night by clock; `?tod=` preview), drop its
THREE parts; drive a **CSS gradient/filter overlay** that tints the whole canvas warm-evening / cool-night.

## Maps onto today's artefacts (what changes)
| Today (3D) | Becomes |
|---|---|
| `path-scene.tsx` (R3F, ~1425 lines) | the canvas + parallax stage (DOM/SVG/CSS) |
| `scenery.tsx`, `weather.tsx` (3D), `world-loader.tsx` | sticker scenery + CSS/sticker weather; loader removed |
| `seasons.ts` (THREE drivers) | `canvas-themes.ts` (CSS palettes + sticker packs) |
| `public/models/*.glb` (34) + `Textures/colormap*.png` | retired; replaced by themed sticker SVGs |
| `@react-three/fiber` + `three` + `@react-three/drei` | **removed** from `package.json` (lighter bundle) |
| `learning-path.tsx` (2D classic path) | the seed / can be retired once the canvas is primary |
| `path.ts` (NODES, CHAPTERS, thread hex, emoji) | **unchanged** — still the source of truth for the trail |
| engine-host game overlays, HUD, sticker chrome | **unchanged** — mount above the canvas |

## Reuse (don't rebuild)
`path.ts` data · the sticker classes (`.glass-card`/`.glass-pill`) · the motion tokens (`anim-float` for
clouds, `anim-wobble` for badges, `hover-pop`) · `time-of-day.ts` phase logic · Lensy poses (`/brand/lensy/`)
· the doodle-set (for stub scenery + the canvas texture) · the engine-host launch flow.

## Accessibility & performance
- **Reduced-motion:** parallax + tilt off → a clean static layered scene; node `anim-*` off (already gated).
- **Keyboard / switch:** the trail is a list of nodes — arrow/enter to move + launch (better than the 3D
  raycast); colour-never-only carries over.
- **Low-end / offline:** DOM/SVG/CSS only; SVG stickers cache; no WebGL context, no GLTF download — a large
  bundle + memory win, and removing R3F/three/drei is a real dependency cut.

## Phasing
- **Phase 6 — the 2.5D sticker canvas (this doc):** parallax layer system; vertical doodle trail; node
  stickers (states + launch); Lensy walking; 5 chapter themes (stub stickers); CSS day/night; sticker
  weather; **rip out R3F + models**. Decorative.
- **Phase 7 — the interactive canvas:** a **drawable** trail and **UN/RE-erasable "myth" stickers** placed
  in the world (the brand's "whole site is a canvas" move) — the world starts teaching, not just decorating.

## Verification (per phase, in this isolated repo)
- `tsc` + `next build` clean; `npm run dev` on a mobile viewport: scroll the winding trail through all 5
  chapter themes (cross-fades), tap a node → game launches in place, Lensy walks to the current node,
  optional tilt feels right, **reduced-motion** gives a static scene, day/night tint shifts (`?tod=night`).
- Confirm the bundle shrank (R3F/three/drei gone) and there are no WebGL/GLTF requests.

## Open confirmations
1. Vertical winding scroll-trail (vs the old "into the distance")?
2. Stub-first stickers, official 5 packs dropped later — or will you supply the packs up front?
3. Full R3F removal (vs keep behind a flag)?
