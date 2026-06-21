# Phase 6 — The Canvas-Skinned 3D World

> Design-of-record for re-imagining the game world in The Equal Lens style **without leaving the
> 3D world**. Companion to `docs/brand-alignment.md`.
>
> **Direction change (superseding the earlier draft):** the first attempt was a flat DOM/SVG **2.5D
> parallax** canvas that *replaced* the 3D world. That was **scrapped.** We keep the real R3F 3D world
> — the camera travel, the winding path, the seasons/day-night, the nodes and Sam — and instead
> **re-skin every surface to look hand-drawn on paper.** The world stays 3D; it just looks like a
> drawing.

## The idea
Make every surface a **canvas**:
- **Canvas ground** — the terrain is a sheet of warm dotted paper (tinted by season), not realistic grass.
- **Tree doodles** — trees are flat hand-drawn doodles (chunky Ink outline + flat fill) standing in the world.
- **Canvas sky** — the sky dome is a soft paper wash, not a realistic gradient.
- **Cloud doodles** — clouds are hand-drawn puffs, not 3D cloud models.
- **The path is drawn on the ground** — an inked trail (Ink edges + dashed centre line) laid onto the
  canvas ground, replacing the wooden planks.

This turns the whole game into **one visual language** (the sticker/doodle UI now extends into the world
itself) and is far lighter than the GLTF world — no 34 models / colormaps to download, which serves the
brand's low-end-device / offline reach.

## How it's built (the surfaces are literally `<canvas>`)
Every doodle is a **runtime `CanvasTexture`** drawn with the 2D canvas API in `path-scene.tsx` (so the
world is, literally, drawn on canvases). No new art assets needed for v1.

| Surface | Realistic (default) | Canvas skin |
|---|---|---|
| Sky | `SkyDome` (gradient shader) | `CanvasSky` — paper-wash dome (`makeSkyTex`) |
| Clouds | `Clouds` (`cloud.glb` instances) | `DoodleClouds` — billboard cloud puffs (`makeCloudDoodleTex`) |
| Ground | `meshStandardMaterial` + season vertex-colours | paper `meshBasicMaterial` (`makePaperTex`), colour lerped to the season ground tint |
| Trees / foliage | `StreamedFoliage` (GLTF, instanced, chunk-streamed) | `DoodleTrees` — billboard tree doodles (`makeTreeDoodleTex`: round canopy + pine) |
| Path | `PlankPath` (`platform.glb` boards) | `DrawnPath` — an inked ribbon mesh along `CURVE` (`makePathStrokeTex`) |
| Mountains / weather | `Mountains`, `Weather` | hidden in v1 (flat paper + fog horizon) |
| Post FX | AO + bloom + grade | lighter: vignette + SMAA only (AO/bloom blow out flat paper) |

**Kept unchanged in both skins:** `CURVE` + node placement, `FollowCam` travel, the `SeasonDriver`
(seasons + day/night + fog still drive the canvas world — fog gives the drawn world a soft paper horizon),
`Nodes` / `ChapterBanners` / `Companion` (Lensy/Sam), the engine-host game launch flow, the HUD chrome.

## Coexistence (nothing deleted)
The skin is a prop on the one `PathScene`: `skin="realistic"` (default) vs `skin="canvas"`.
`src/app/path/page.tsx` selects it from **`?world=canvas`** (persisted to `localStorage["swipeed.world"]`);
plain `/path` and `?world=3d` stay realistic. **The realistic GLTF world is fully intact** — this is a
re-skin behind a flag, not a removal. Any future removal of the GLTF assets is a separate, signed-off step.

## Brand fidelity (matches the live site)
The dotted paper is the **exact** site recipe: paper `#FBF9FF` + a 28px grid of `#ECE6F6` dots, no grain
(from `globals.css` `body` / `.canvas-dots`) — used on **both** the land and the sky (one continuous
canvas, sky washed pale blue). The sky also carries the site's **8 doodle marks** (squiggle · sparkle ·
spiral · arrow · heart · star · zigzag · swirl, from `Doodles.tsx`) in the 4 accents (insight teal · grow
coral · sun yellow · brandsoft violet), floating as confetti. Trees/clouds/path keep the doodle hand —
chunky Ink `#221436` outlines, flat fills, round joins.

## v1 scope (this build — for direction-check)
- Dotted-paper ground (faint season tint) · doodle trees (round + pine, ~170 scattered, path-cleared) ·
  dotted-paper sky · doodle clouds (drifting) · the 8 brand doodle marks scattered in the sky · inked path
  along the curve · nodes + Sam + travel intact · lighter post FX.
- **Doodles drawn in code** (the 8 site marks reproduced exactly; two tree shapes + one cloud + path stroke
  are stand-ins for richer per-season packs later). Good enough to judge feel.

## Follow-ups (after direction is confirmed)
- **Per-season doodles** — tree/cloud/ground variants per chapter theme (summer/rainy/autumn/winter/spring),
  swapped by `seasonRT` like the realistic world (snow trees in winter, etc.).
- **Richer scenery** — doodle bushes/rocks/flowers, a few foreground framing doodles, paper hills on the horizon.
- **Sky/ground season tint** for the sky wash; **doodle weather** (rain/snow/leaf/petal marks).
- **Official themed packs** could replace the code-drawn stubs (same placeholder→official flow as the logo).
- Hand-drawn wobble on outlines; subtle paper grain in post.

## Verification (isolated repo)
`npm run dev`, visit `/path?world=canvas` on a mobile viewport: the world reads as a paper drawing —
canvas ground with tree doodles, paper sky with cloud doodles, the path inked along the ground; travel,
seasons/day-night, nodes and Sam all still work; `?world=3d` returns the realistic world unchanged.

## Phasing
- **Phase 6 (this doc):** the canvas-skinned 3D world (v1 above), behind `?world=canvas`. Decorative.
- **Phase 7 — interactive canvas:** a drawable trail + UN/RE-erasable "myth" doodles placed in the world —
  the brand's "whole site is a canvas" move (the world starts teaching, not just decorating).

## Node stickers (canvas skin)
The path nodes are re-drawn for the canvas world as **hand-drawn stickers** instead of the realistic
world's toon pedestal + emissive ring + floating emoji. One sticker form, four signals:
- **Form** — a billboarded sprite whose texture is drawn in 2D (`useStickerTexture`): a *wobbly* Ink
  (`#221436`) outlined disc (deterministic `_wobbleCircle`, no rng so it's stable), flat fill, the lesson
  **emoji kept** in the center, and a drawn ground-shadow ellipse on the paper. 3D depth-test means walls
  occlude it for free.
- **Chapter = accent fill.** `CANVAS_ACCENTS` (grow coral · insight teal · brandsoft violet) cycled per
  chapter for wayfinding; **sun `#FFC94D` is reserved** for capstone fills + state badges.
- **State = outline + corner badge + size**, never the fill: playable = solid ring + play badge; **locked**
  = dashed ring, greyed emoji, faded, lock badge; **completed** = sun check badge; **capstone** = bigger,
  always sun, Ink star sparkles baked around it.
- **Label = paper tag.** Ink-bordered `#FBF9FF` pill with a marker underline in the chapter accent (the
  realistic glass-pill is dropped in canvas), shown on in-view / hover / focus. The DOM `<button>` stays as
  the transparent tap/keyboard target over the sticker.
Decision (with the user): **keep the emoji** in the center — fastest, no new art — and brand everything
around it. A bespoke Ink-doodle icon set per lesson is the later brand-pure upgrade. Realistic skin is
untouched (the whole node visual branches on `canvas`).
