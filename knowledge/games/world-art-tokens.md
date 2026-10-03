---
type: Reference
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/world-art-tokens.md
title: World/Art Artefact Inventory (re-vibe scope)
description: A holistic, living list of every artefact that defines SwipeEd's look-and-feel, covering 2D design tokens, the thread colour system, the canvas scene renderer, the Lensy mascot, brand assets and feedback juice, with a per-layer effort note for changing the game's vibe.
tags: [swipeed, art, design-tokens, 3d, world, theming, re-vibe, reference]
timestamp: 2026-09-01T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/b8bc423b-e51b-4183-b03d-e9aa5327a56c  # SWED-125
---

# World/Art Artefact Inventory (re-vibe scope)

A single place to see **everything that defines the game world's look-and-feel**, so the effort of a
"change the vibe" pass can be scoped at a glance. Grouped by layer; each row names the artefact (with
path) and what it controls. Companion to [Path world (3D)](swipeed-world.md). *Keep this current when art
artefacts are added or moved.*

> **⚠️ Re-skin note.** The Equal Lens re-skin replaced the Kenney-kit grassland world with a hand-drawn
> **canvas** world. The season palettes (`src/lib/seasons.ts`), day/night modifier
> (`src/lib/time-of-day.ts`) and weather emitters (`src/components/weather.tsx`) **no longer exist**, and
> `path-scene.tsx` loads **no GLB models**. The model kits and colormap atlases are still on disk but are
> **orphaned**: repainting them changes nothing. Sections below reflect what is actually wired.

## 1. 2D design tokens (the app chrome)
| Artefact | Path | Controls |
|---|---|---|
| **CSS token sheet** | `src/app/globals.css` (408 lines) | All UI colour. `--brand-500/600`, `--flame` and `--accent-amber` are now **aliases onto `@equal-lens/brand` tokens** (`--color-brand`, `--violet-700`, `--color-brandsoft`, `--color-sun`), alongside `--flag-green`/`--flag-red`, `--path-fill/edge/line`, the `--app-bg` gradient, the full shadcn token set, `--radius: 1rem`, and the `.glass-card` / `.glass-pill` look. Colours are **OKLCH**. The kids→adult dark flip is owned by the brand library's `[data-audience="adult"]` block, not a `.dark` theme here. |
| **Fonts** | `src/app/layout.tsx` | `Nunito Sans` → `--font-nunito` (body), `Baloo 2` → `--font-baloo` (`--font-display`/`--font-heading`/`--font-hand`, headlines & Lensy speech), `Poppins` → `--font-poppins` (`--font-ui`, wordmark + UI labels). Google Fonts. (Fredoka is gone.) |
| **Tailwind theme** | `@theme inline { … }` in `globals.css` | Maps tokens → Tailwind utilities (no separate `tailwind.config`). |

**Effort: 🟢 low**: one file re-palette + a font swap changes the entire 2D vibe.

## 2. Thread colour system (the path's identity colours)
| Artefact | Path | Controls |
|---|---|---|
| **Per-thread hex** (source of truth) | `scripts/master-node-table.xlsx` `hex` column → `src/content/path.ts` | Node-bubble tint per thread: A `#0EA5E9`, B `#DC2626`, C `#F59E0B`, D `#EC4899`, E `#7C3AED`, F `#059669`, G `#475569`, E/G `#475569`, capstone ★ `#EAB308`. |
| **Per-node emoji** | `scripts/gen-path.py` `EMOJI` dict (77) | The icon on every node bubble. |

**Effort: 🟢 low**: edit the xlsx (or gen-path) and regenerate `path.ts`.

## 3. 3D models: GLTF (`public/models/`, ~1.3 MB, **34 `.glb`**)
- **Core nature set (16):** `tree`, `tree-pine`, `tree-pine-small`, `grass`, `flowers`, `flowers-tall`, `plant`, `mushrooms`, `rocks`, `stones`, `cloud`, `flag`, `sign`, `platform`, `block-grass-large`, `block-grass-large-tall`.
- **Companion (1):** `characters/character-female-c.glb`: **orphaned** (was the 3D path guide; the path
  companion is now the brand ship SVG).
- **Winter/"holiday" set (17):** `holiday/`: `tree-snow-a/b/c`, `tree-decorated-snow`, `snowman`, `snow-flat`/`-large`/`snow-pile`, `candy-cane-green/red`, `reindeer`, `sled`, `lantern`, `bench`, `rocks-small/medium/large`. **All orphaned** (the winter band is gone).
- **Provenance:** CC0 low-poly (Quaternius nature kit / Kenney·Kay-style holiday kit), swappable, no licence issue.
- **Loaded by:** `src/components/grassland-backdrop.tsx` (the backdrop behind `/game/[id]`) and
  `src/components/swipe-deck-3d.tsx` (behind the swipe deck), via drei `useGLTF`. **The path scene no
  longer loads any model.** `world-loader.tsx` only gates the branded splash on drei's `useProgress`.

**Effort: 🟡 medium**: the kit now dresses only two backdrops, not the path, so swapping it is a much
smaller lift than it was.

## 4. 3D textures: shared colormap atlases (`public/models/Textures/`)
`colormap.png` (base) + **6 seasonal** (`_summer`, `_rainy`, `_autumn`, `_winter`, `_spring`, `_spring_blossom`)
+ `characters/Textures/colormap.png` + `holiday/Textures/colormap.png`.

**Status: orphaned.** No source file binds, samples or swaps a colormap any more (`grep -rn colormap src`
returns nothing): the seasonal swap went with the canvas re-skin. `scripts/gen-colormaps.mjs` likewise
generates assets nothing reads. **Repainting these would not change the path world.**

## 5. ~~Season palettes~~ (removed)
`src/lib/seasons.ts` no longer exists. There is no season layer. The world's colour now comes from
`@equal-lens/brand` tokens (paper / mist / ink) read by `path-scene.tsx`, with `ThemeController` lerping
to the dark "adult" palette across the Ch.5 → Ch.6 boundary.

## 6. ~~Day/night modifier~~ (removed)
`src/lib/time-of-day.ts` no longer exists; there is no day/evening/night lighting. The only surviving
time-of-day behaviour is the wind-down nudge (`src/components/wind-down-nudge.tsx`).

## 7. Scene composition (the renderer)
| Path | ~Lines | Controls |
|---|---|---|
| `src/components/path-scene.tsx` | **2297** | The R3F **canvas** scene: dotted-paper ground + flat paper background (`scene.fog = null`), the inked path & progress trail, sticker node states (playable/soon/done), chapter banners, the myth ink (UN/RE) and free ink, the ship companion, follow-cam and `ThemeController`. The big tuning surface. |
| `src/components/scenery.tsx` | 78 | 2D SVG scenery props (hardcoded hexes, e.g. `#7a5a3a`, `#f0a6c0`). |
| `src/components/world-loader.tsx` | 40 | Gates the branded splash on drei's `useProgress`. |
| `src/components/learning-path.tsx` | 346 | The fallback **2D "classic" path** view (its own styling). |

**Effort: 🔴 high** for `path-scene.tsx` layout/feel; 🟢 low for scenery.

## 8. Companion (Lensy) + brand
- **Lensy avatar (2D):** `src/components/games/sam.tsx`: a 20-line `<img>` wrapper (old component name,
  no hexes) rendering `/brand/lensy/lensy-{wave,stand,think,idea}.svg`, in every game. Re-skinning the
  mascot means swapping SVG assets, not editing the component.
- **Path companion:** `/brand/ship/ship-flying.svg` + `/brand/ship/ship-flame.svg` (DOM/SVG overlay via
  drei `<Html>`). `public/companion.png` is used only by the wind-down nudge.
- **Brand/PWA:** `public/brand/` (`logo`, `lensy`, `mascots`, `ship`, `doodles`, `un.svg`, `re.svg`), plus
  `public/brand/swipeed/` (the SwipeEd logo, [SWED-125](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/b8bc423b-e51b-4183-b03d-e9aa5327a56c)), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-icon.png` from `scripts/gen-icons.sh`;
  `src/app/favicon.ico`; `src/components/brand-splash.tsx`; `src/app/manifest.ts`.

**Effort: 🟡 medium** (Lensy is the recurring face; brand is a handful of files).

## 9. Feedback "juice" (minor)
- `src/lib/confetti.ts`: `COLORS = ["#62b84b","#e05c52","#4f6ef7","#f5c518"]`.
- `src/lib/juice.ts`: SFX are **synthesized Web-Audio** (no asset files to swap).
- Per-game accent hexes are scattered across `src/content/games/*` and each game component's mode-tile ring colours (e.g. `feelings-friends.ts` mood colours), many small touch-points, each trivial (~40 files for full on-palette polish).

**Effort: 🟢 low each, many.**

## Effort summary (to change the vibe)
| Lever | Files/assets | Impact | Effort |
|---|---|---|---|
| Re-palette 2D UI | `globals.css` + `@equal-lens/brand` tokens (+ fonts) | App chrome **and** the path world | 🟢 low, **high leverage** |
| Thread colours + emoji | xlsx → `path.ts`, `gen-path.py` | Node identity | 🟢 low |
| Mascot + brand | `/brand/lensy/*.svg`, `/brand/ship/*.svg`, logos/icons | Identity | 🟢 low (asset swap) |
| Chapter dressing | `content/chapter-canvas/chapter-1…8.json` | Myths & doodles per chapter | 🟢 low |
| **Re-tune the canvas scene** | `path-scene.tsx` (2297 lines) | Whole world feel | 🔴 **high** |
| Per-game accents | ~40 `content/games/*` + components | Polish/consistency | 🟢 low each, many |

**The 20% that gets ~80% of a new vibe:** the `@equal-lens/brand` colour tokens + `globals.css` (palette
and fonts) + the thread hexes + the Lensy/ship SVGs. Because the path world now reads its colour from the
same brand tokens as the chrome, a re-palette moves the whole product at once. The expensive part is
**re-tuning `path-scene.tsx`** itself.

> Design sources (the raw `.glb` kits, source `.png` atlases, `.blend`/asset originals) live **with the
> game / the asset kit, not in this engine repo** (gitignored here, per `AGENTS.md`). This doc inventories
> *where they're wired in the app*, not the source art.

## Related
- [Path world (3D)](swipeed-world.md) · [SwipeEd (app)](swipeed.md) · [Frontend stack](../architecture/deployment.md) · [Games catalog](index.md)
