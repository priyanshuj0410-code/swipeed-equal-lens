---
type: design-system
owner: the-equal-lens
title: SwipeEd design system
description: How SwipeEd's shipped UI inherits the Equal Lens brand package and website design system, where it defines its own game tokens and patterns, and where the two have drifted apart.
tags: [swipeed, design-system, brand, tokens, accessibility]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/368de34e-fae5-48bc-b229-6844dee0ca7e  # SWED-66
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956  # SWED-67
---

# SwipeEd design system

SwipeEd is The Equal Lens's Duolingo-style learning path: a 3D React Three Fiber path of 77 nodes
(69 games plus 8 gold capstones) across 8 age-band chapters, ages 3 through parenthood. Games open
over the path in a shared shell and finish on a shared completion card. Stack: Next.js 16, React 19,
Tailwind v4, `@equal-lens/brand` vendored at `vendor/equal-lens-brand-0.1.0.tgz`.

This document is descriptive as well as prescriptive: it states the brand rule where SwipeEd should
simply follow it, and it states SwipeEd's own established pattern where the game has grown a
convention the brand package does not cover. See [Divergences and debt](#divergences-and-debt) for
every place the two disagree. Measurements referenced below (contrast ratios, dash counts, colour
audit) are recorded in full in the [design audit of 2026-09-14](audits/design-audit-2026-09-14.md).

## Source of truth and inheritance

Three layers, in order of authority:

1. **`@equal-lens/brand` (npm package, vendored as `vendor/equal-lens-brand-0.1.0.tgz`, installed at
   `node_modules/@equal-lens/brand/`).** The organisation's single source of truth for colour, type
   and the base component classes. SwipeEd imports `tokens.css`, `tailwind.css` and `components.css`
   from it directly in `src/app/globals.css:5-7`. When the package changes, SwipeEd re-themes for
   free through these imports.
2. **The Equal Lens website's design system** (external reference: the `the-equal-lens` website repo,
   `knowledge/design.md`). The website consumes the same package and documents the
   organisation-level usage rules (sticker pattern, voice, button variants). SwipeEd inherits these
   rules where they apply to a game, not a marketing site: the sticker/cut-out card language, the
   hyphens-not-dashes voice rule, and the `[data-audience="adult"]` light/dark mechanism all carry
   over. Website-only concerns (the Gallery carousel, the blog embed sandbox, the canvas myth
   toolbar's desktop free-placement) do not apply to SwipeEd and are not inherited.
3. **SwipeEd's own extensions**, documented here. SwipeEd may add tokens and components the brand
   does not define (the `--prx-*` declared-valence system, the thread/chapter colour taxonomy, the
   3D path world's canvas art tokens, the myth-card UN/RE ink interaction). SwipeEd must not
   redefine a brand-owned token to a different value, and must not fork `.btn`/`.card`/`.note` into
   incompatible local copies. `src/app/globals.css` does both in a few places anyway; those are
   tracked in [Divergences and debt](#divergences-and-debt) rather than silently accepted as
   precedent.

Engine-reserved colour is a fourth, narrower category and outranks both brand and website for its
own domain: `--prx-flag-green`, `--prx-flag-red` and the rest of the `--prx-*` ramp (`src/app/globals.css:85-105`)
are commented in the source as "NOT part of the themeable brand surface, a customer theme must never
be able to repaint what correct looks like." A future brand retheme is allowed to move
`--color-brand`; it is not allowed to change what colour means "correct."

## Tokens

### Brand palette (from `@equal-lens/brand/tokens.css`, exact values)

| Token | Light | Dark (`[data-audience="adult"]`) | Role |
|---|---|---|---|
| `--color-brand` | `#553286` | `#C9B8E6` | Primary violet |
| `--color-brandsoft` | `#7F65A4` | `#B3A4D6` | Muted violet |
| `--color-paper` | `#FBF9FF` | `#15101F` | Page background |
| `--color-surface` | `#FFFFFF` | `#221A30` | Cards, notes |
| `--color-mist` | `#E7E0F1` | `#3A2E4D` | Hairlines, hover fills |
| `--color-ink` | `#221436` | `#F1ECFA` | Text, outlines |
| `--color-band` | `#553286` | `#241B38` | Dark CTA band |
| `--dot` | `#ECE6F6` | `#2A2140` | Dotted-paper texture |
| `--color-insight` | `#2DD4BF` | same | Teal, "unlearn" |
| `--color-grow` | `#FF7A5C` | same | Coral, "relearn" / CTA |
| `--color-sun` | `#FFC94D` | same | Yellow, CTA (brand rule: always paired with ink text) |
| `--color-sky` | `#4FB0E8` | same | Blue, support |

Violet ramp: `50 #F3F0F6 · 100 #E5E0ED · 200 #C5B6DE · 400 #7F65A4 · 600 #553286 (brand) · 700 #44288B
· 800 #331E50 · 900 #221436`. SwipeEd re-exposes this ramp under its own `--violet-*` short names in
`globals.css:73-80`, aliased straight to the brand variables, purely a back-compat rename from before
the tarball existed.

### SwipeEd semantic tokens (not in the brand package)

These are the "declared valence" system: a bin, chip, or branch option carries an explicit
`pos`/`neg`/`tell`/`uhoh` meaning in its content schema (see the [question bank](schemas/question-bank.md) for the data
model) rather than the engine guessing from English wording. Defined in `src/app/globals.css:82-105`
(light) and `:170-171` (dark values shown; `--prx-pos`/`--prx-neg` are aliases and follow their flag
tokens automatically):

| Token | Light | Dark | Usage rule |
|---|---|---|---|
| `--prx-pos` ("correct") | `oklch(0.68 0.16 150)` (~green) | `oklch(0.76 0.16 150)` | A declared-positive bin, a matched pair, a caught trick. Always paired with an emoji (💚/✓) or a token glyph, per the "colour is never the only signal" rule below, never colour alone. |
| `--prx-neg` ("incorrect") | `oklch(0.62 0.20 22)` (~red) | `oklch(0.70 0.19 22)` | A declared-negative bin, a caught red flag. Same pairing rule. |
| `--prx-tell` | `oklch(0.70 0.15 78)` | `oklch(0.80 0.15 80)` | A "tell someone" cue in Be the Safe Adult-style content, amber. |
| `--prx-uhoh` | `oklch(0.64 0.16 45)` | `oklch(0.73 0.16 45)` | A caution cue, orange-red. |
| `--prx-on-fill` | `#221436` fixed, does not flip | same | Text/icon colour placed on any of the four fills above. Deliberately **not** `var(--color-ink)`: the fills are mid-lightness in both themes, so the foreground must not flip with them (comment at `globals.css:104` records the measured range, white-on-fill scored 2.01 to 3.61, this scores 3.9 to 8.6; the fresh measurement in `design-findings.md` narrows that to 4.28 to 8.52, see Accessibility). |
| `--prx-slot-1` … `--prx-slot-6` | six hues, non-semantic | six hues | Position-only wheel for an *undeclared* bin, so a bin with no declared valence still gets a distinct colour and emoji without asserting correctness. |

**UN and RE** are not colour tokens, they are characters that borrow existing brand accents:
UN (the eraser, "unlearn") speaks in `--color-insight`; RE (the pencil, "relearn") speaks in
`--color-grow`. Defined once in `src/components/games/un-re.tsx:6-16` and reused everywhere a myth
gets busted. See Accessibility for a measured contrast problem with this pairing in light mode.

**Capstone gold is two different values, not one.** `--color-sun` (`#FFC94D`) is the brand's yellow
accent and is what the 3D canvas-skin world actually paints on a capstone node
(`src/components/path-scene.tsx:1310`, `cap ? "size-40 bg-[var(--color-sun)]"`) and what
`GameDone`'s star rating uses via its `--accent-amber` alias (`globals.css:110`,
`--accent-amber: var(--color-sun)`). Separately, `src/content/path.ts:34` and every other capstone
row hardcodes `hex: "#EAB308"` (Tailwind's amber-500) as the thread metadata colour for the seven
capstone nodes. Nothing currently reads that field into the rendered capstone fill, so it is inert
today, but it is a second "gold" sitting in the data layer with no token name and no documented
relationship to `--color-sun`. Treat `--color-sun` as *the* capstone gold token; `#EAB308` is tracked
as debt below rather than promoted to a second token.

### Typography

The brand canon gives the three families strict roles: **Poppins** for all headings, display type and UI
labels, **Nunito Sans** for body copy, and **Baloo 2 for Lensy and mascot voice only, never a heading** (the
canon names Baloo 2 in a headline as the most common brand error). The Equal Lens website's
`knowledge/design.md` loosens this to "Baloo 2 - headlines + playful / mascot voice."

SwipeEd currently goes further than either: it points `--font-display`, `--font-heading` and `--font-hand` at
the same Baloo 2 variable (`src/app/globals.css:16-18`) and sets every `h1`/`h2`/`h3` in Baloo 2
(`globals.css:235-237`). Poppins survives only as `--font-ui` (`globals.css:19`) for UI labels.

**Decision needed** (see [Divergences and debt](#divergences-and-debt), item 5): keep Baloo 2 headings as a
documented SwipeEd exception for a child-facing game, or move headings back to Poppins. Until that is decided,
do not spread Baloo 2 further: new heading styles go through the existing `h1`-`h3` rule or `--font-heading`,
never a hardcoded Baloo family.

Fonts load via `next/font/google` in `src/app/layout.tsx:9-22` (self-hosted, not the brand's
`fonts.css` `@import url(...)`), a reasonable Next.js-idiomatic substitution for the same three
families and weights the brand specifies.

| Token | Family | Used for |
|---|---|---|
| `--font-nunito` / `--font-sans` / `--font-mono` | Nunito Sans | Body copy |
| `--font-baloo` / `--font-display` / `--font-heading` / `--font-hand` | Baloo 2 | All headings, Lensy/UN/RE speech, mascot voice |
| `--font-poppins` / `--font-ui` | Poppins | UI labels, wordmark (not headings, in practice) |

### Spacing, radius, shadow, elevation

The brand package defines no spacing scale, so SwipeEd inherits Tailwind v4's default spacing
unmodified; there is nothing to diverge from here. shadcn's `ui/card.tsx:15` adds one local
convention, a `--card-spacing` custom property (`--spacing(4)`, 1rem; `--spacing(3)` at `size="sm"`).

Radius is a single brand token, `--radius: 1rem` (`globals.css:148`), with `--radius-sm` through
`--radius-4xl` derived from it by multiplication (`globals.css:150-156`) for the shadcn layer. The
brand's own `.card` class is `border-radius: 24px` (`@equal-lens/brand/components.css:110`); SwipeEd's
equivalent `.glass-card` sets `border-radius: 20px` (`globals.css:251`), a small unexplained
departure from the brand recipe it otherwise copies verbatim, also tracked below.

Elevation is not blur-based. The brand's signature is a **hard, unblurred offset shadow** plus a
chunky ink border, the "sticker" cut-out look: `border: 2.5px solid var(--color-ink); box-shadow: 4px
4px 0 var(--color-ink);` (`.sticker` / `.card` / `.btn--primary`, `@equal-lens/brand/components.css`
and `tailwind.css:88-90`). SwipeEd's `.glass-card` and `.glass-pill` (`globals.css:246-257`,
`:280-288`) match this recipe at 4px/4px and 3px/3px respectively. Compact variants use a 3px offset;
the brand's `.popover` ("Lensy's chat card") uses 5px/6px for one extra level of lift, and SwipeEd uses it
for exactly one surface, Lensy's question card (see How Lensy speaks), so the question sits one level
above every answer card. There is no fourth elevation level: these three offsets are the entire system.

## Voice and copy

Brand rule, inherited without change: **no em dashes and no en dashes anywhere**, not in UI copy, not
in content, not in code comments or docs, and not in numeric ranges (write `3-6`). Use a hyphen, a comma,
a colon, a period, or reword. Sentence
case throughout, curious and warm rather than instructional, never preachy. The brand's one-line
summary (`@equal-lens/brand/README.md`, final section): "Curious, warm, brave, playful not preachy.
Sentence case, hyphens not em dashes."

**This rule is currently violated at scale in SwipeEd's own game content**, not just in code
comments. On 2026-09-14 `src/` held 5,113 em or en dash characters on 3,796 lines, 4,260 of them on
3,072 lines of `src/content/games/` (examples in the [design audit](audits/design-audit-2026-09-14.md)). `src/content/games/*.ts` (79 files of scenario copy: hooks, myths, "why," "relearn" lines) is the
single largest source of the violation, not an edge case. Any new content file must not add to this
count. See Divergences and debt.

**Age-banded tone.** SwipeEd spans 8 chapters from ages 3 to parenthood; there is no single "kid
voice." Content is written per chapter/persona (see the [question bank](schemas/question-bank.md) for the `persona`
field used by adult-facing content such as Be the Safe Adult) rather than one global register. The
mechanic itself carries some of this: the [interaction model](games/swipeed-interaction-model.md) records that the tap-to-arm path
is deliberately kept as the **3 to 6 year old and keyboard/screen-reader floor** on every mechanic
except `swipe`, so the youngest chapter is never asked to perform a gesture it cannot yet do
precisely.

**How Lensy speaks: the question card.** One shared component, `LensyQuestion`
(`src/components/games/lensy-question.tsx`), used by both the lesson engine and the capstone engine
([SWED-66](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/368de34e-fae5-48bc-b229-6844dee0ca7e)). Three parts, top to bottom:

1. **The question card.** Lensy (48px) beside an `h2` styled with the brand's own `.popover` class
   ("Lensy's chat card": surface fill, 2.5px ink border, 24px radius, 5px/6px hard shadow), text in
   `font-hand` (Baloo 2, Lensy's voice) at 19px semibold, capped at `38vh` and scrollable. It is the
   largest type and the highest elevation in the play area, so it outranks the answer cards
   (`.glass-card`, 15px bold, 4px shadow). The card keeps the beat's question for the whole beat.
2. **The feedback line.** A plain text line under the card (`text-sm`, semibold, `text-foreground/80`,
   `min-h-10`), `role="status" aria-live="polite" aria-atomic="true"`. Nudges ("Not a match. Try
   another.") and confirmations ("Kind words: builds trust. ✓") go here and never replace the question.
   When a card on screen already shows a spoken line (a branch consequence, a capstone swipe cue or
   solved truth), the line stays empty and the text is announced to screen readers through a
   `sr-only` span in the same live region, so it is never shown twice.
3. **The reveal gate.** Answers wait until the question has been read: `revealDelayMs()` is 1.2s plus
   60ms a word, capped at 4s, on a timer rather than speech `onEnd` (muting cancels `onEnd`). In their
   place sits a quiet "Ready to answer? Tap here" button; tapping it or the question card shows the
   answers at once, and a keyboard reveal moves focus to the first answer. The answers fade and slide in
   (`animate-in fade-in slide-in-from-bottom-2`); under reduced motion they appear with no animation after
   the same wait.

Copy rules the component enforces: `cleanLine()` strips "Lensy:" and "Sam:" narrator prefixes (the card is
already Lensy speaking), and `joinQuestion()` joins a hook with its prompt or setup without asking twice,
dropping a prompt the hook already ends with and a clipped tag question ("Agree?") before a real one.

**Why it changed (playtest, 2026-09-15).** Players read the answer cards and skipped the question. The
old surface was a brand `.bubble` (tail-flattened corner, `--color-mist` fill, no border, 15px) beside
bordered sticker answer cards, the answers mounted in the same frame as the question, and the first
nudge replaced the question. The brand's `.bubble` remains right for short tail lines; a question the
player must answer now uses the brand's `.popover` chat card instead. Lazyweb references agree: Elevate
and Couple Joy set the question as the largest type on screen with lighter answers below, while
Sololearn's small-body question above bordered answer cards is the pattern that produced the playtest
problem (see References).

UN and RE speak through `UnReBeat` (`src/components/games/un-re.tsx`), each with a one-line "why," never
more.

## Components

| Component | Brand class / SwipeEd implementation | Lives in code |
|---|---|---|
| Buttons | Brand `.btn .btn--{primary\|sun\|outline\|band\|solid\|ghost}` exists but SwipeEd's actual game CTAs mostly hand-roll Tailwind utility strings on top of `bg-[var(--color-sun)]` or `.glass-pill` instead of consuming `.btn--sun`/`buttonClass()` | Ad hoc across `src/components/games/v2-engine.tsx` (e.g. lines 274, 281, 552, 570, 712, 716, 724); generic shadcn `Button` at `src/components/ui/button.tsx` is a separate, mostly-unused-by-gameplay primitive |
| Cards | Brand `.card` (24px radius) reimplemented locally as `.glass-card` (20px radius, `globals.css:246-252`); shadcn `Card` (`src/components/ui/card.tsx`) is a third, generic sticker-free surface used outside gameplay | `globals.css:246-252`; `src/components/ui/card.tsx` |
| Chips / status pills | Brand `.note__chip` is extended (not replaced) for the myth-card truth/myth stamp (`globals.css:384`) | `globals.css` (myth-card family) |
| Answer cards | `AnswerCard`: a `.glass-card` button with a `data-state` of `idle`, `selected` (armed: brand border, brand hard shadow, brand wash at `--prx-wash-hover`), `target` (a drag is over it: brand border and wash) or `done` (a correct match, a placed chip, a found or picked card: `--cell-tint` border and wash, default `--prx-pos`). A state never changes border width, shadow offset or size, and there is no pulse. `CornerBadge` pins a 24px round marker to the top-right corner: the pair number in its cord colour on matched cells, the zone emoji on placed chips, ✓ on a picked card, ⤵ on zones while a chip is armed. Placed sort chips stay in their slot and zones never collect tokens, marks that appear later ("Caught!", a gallery check) keep their space reserved, and the sort hint line is a fixed two lines. Used by match, sort, spot, explore-label and the capstone gallery, spot, branch, role-play and reflect steps ([SWED-67](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956)) | `src/components/games/answer-cells.tsx`; `.glass-card[data-state]` in `src/app/globals.css` |
| Game shell chrome | `GameShell`: fixed glass-pill top bar (back button, title, progress "n/m"), opaque `--app-bg` overlay so the path is hidden behind an open game, `align="center"` vs `"fill"` for content that must pin its own top/bottom rows | `src/components/game-shell.tsx` |
| Lensy's question card | `LensyQuestion`: Lensy plus an `h2.popover` question card in `font-hand`, the feedback line (the play area's one live region) and `RevealGate`. See How Lensy speaks | `src/components/games/lensy-question.tsx` |
| Feedback banners | No hard-fail red banner anywhere. A wrong move gets a warm nudge from `say(...)`, shown on the question card's feedback line and spoken; mechanics no longer render their own inline nudge lines under the answers (removed in SWED-66, they duplicated the spoken line and shifted the layout when they mounted). A non-best branch pick keeps its 💛 consequence card with a retry button | `src/components/games/lensy-question.tsx`; `say()` in `v2-engine.tsx` and `capstone-rich.tsx` |
| Completion card | `GameDone`: 🎉 emoji, title, optional blurb, 0 to 3 star rating (`--accent-amber` = `--color-sun`), coin count, confetti (`celebrate("big")`) on mount, "Play again" / "Back to the path." Capstones wrap it with a `ToolkitReflection` | `src/components/games/game-done.tsx` |
| Path nodes | Two independent renderers: the realistic/canvas 3D world's sticker-textured billboard nodes (locked = dashed ring + faded, playable = solid ring + sketch-ring animation, completed = sun check badge, capstone = bigger + always sun) and a wholly separate 2D SVG "classic" fallback path with its own hand-drawn cobblestones and scenery | `src/components/path-scene.tsx` (`.node-locked`/`.sticker-soft` at e.g. line 1310); `src/components/learning-path.tsx` (2D fallback, own styling) |
| Capstones | Share the v2 engine's interaction primitives, the `LensyQuestion` card and the three-zone layout (progress + question card, flexible middle, pinned Next), but re-derive their own verdict styling rather than reusing `v2-engine.tsx`'s emoji-plus-text pattern, see Accessibility | `src/components/games/capstone-rich.tsx` |

Full mechanic-by-mechanic behaviour (props, state machine per interaction type) is out of scope for a
design doc; see the [v2 engine](architecture/v2-engine.md) doc for that.

## Interaction and motion

Full gesture and accessibility spec: [interaction model](games/swipeed-interaction-model.md). Summary relevant to
design:

- **Question first.** Every lesson beat and capstone lap opens on Lensy's question alone; the answers
  arrive after a reading pause (1.2s plus 60ms a word, at most 4s) that one tap on the question or the
  gate skips. Focus moves to the question card at the start of each beat and to Next when the beat is
  solved. See How Lensy speaks.
- **The interaction is the verb.** A relationship read is a swipe, sorting is dragging into a bin,
  matching is drawing a cord, erasing a myth is scrubbing it away. `usePointerDrag` is the one
  pointer-events primitive behind all of it (`src/components/games/interactions.tsx`).
- **Tap is the accessibility floor**, never removed, on every mechanic except `swipe` (which uses
  drag plus arrow-key commit, deliberately no buttons). The floor is what makes ages 3 to 6 and
  keyboard/screen-reader use the same code path as everyone else, not a separate mode.
- **No-fail, always.** A wrong drop, swipe or connection springs back with a warm nudge, never a
  buzzer, never a blocking modal. This is a considered departure from the category norm (see
  References): most swipe-card learning apps show a dedicated "here's why that's wrong" screen;
  SwipeEd keeps the same card on screen and lets the child try again.
- **Colour is never the only signal.** Every declared-valence bin pairs its tint with an emoji and a
  word, and a chip placed in it carries that emoji as a corner badge; a matched pair shares a numbered
  corner badge on both cells, readable without colour and without the cord; swipe shows a
  word-plus-flag-emoji edge badge while dragging. See Accessibility for where this rule is not actually
  followed.
- **Options never move under the finger.** Within a beat, answer cards keep their size and position:
  states recolour (see Answer cards), marks are corner badges or reserved space, and nudges live on the
  question card's feedback line rather than in lines that mount under the answers. `ring-*` utilities
  are not used for states because `.glass-card` is unlayered and its `box-shadow` always wins.
- **Juice:** `celebrate()` (`src/lib/confetti.ts`) fires `canvas-confetti` plus a Web Audio chime on a
  correct/complete moment, small for a single correct answer, big for a game or capstone finish.
  `sfx()`/`haptic()`/`shake()` (`src/lib/juice.ts`) add short synthesized tones (no audio asset files)
  and a `navigator.vibrate` pulse. A quiet ambient music bed (`music.*` in `juice.ts:121-160`) rides
  underneath GLRL-style runs, ducking on serious cards.
- **Reduced motion degrades to instant, never to broken.** `prefersReducedMotion()`
  (`src/lib/juice.ts:13-15`) is true under either the OS `prefers-reduced-motion` setting or the
  app's own "Calm Mode." Every fly-off, lift, pulse, and scrub-blur collapses to an instant state
  change under it; confetti is skipped but its chime still plays, because audio is not treated as a
  motion concern (`confetti.ts:11`, `celebrate()`).

## The path world

The 3D world ships two skins on one `PathScene` component, `skin="realistic"` (GLTF models, now
mostly orphaned per `games/world-art-tokens.md`) and `skin="canvas"` (hand-drawn, brand-tinted,
`docs/world-canvas.md` in this repo is the design-of-record). Canvas skin art tokens:

- **Ground and sky:** dotted paper, the exact site recipe, `PAPER = "#FBF9FF"`, `PAPER_DOT =
  "#ECE6F6"` (`src/components/path-scene.tsx:215-216`), matching `--color-paper`/`--dot` by value.
  These are hardcoded rather than read from the CSS custom property because a `CanvasTexture` is
  drawn with the 2D canvas API at runtime and cannot resolve a CSS variable; this is a necessary, not
  careless, duplication, but it does mean a brand repaint of paper/dot requires a matching edit here.
- **Doodle accents:** `DOODLE_ACCENTS` (`path-scene.tsx:1730`), five brand CSS variables (`grow`,
  `sun`, `insight`, `violet-400`, `sky`) cycled for the sky's floating doodle marks, read live so
  these *do* retint automatically with the brand.
- **Trees, clouds, path stroke:** runtime-drawn `CanvasTexture`s (`makeTreeDoodleTex`,
  `makeCloudDoodleTex`, `makePathStrokeTex`, `path-scene.tsx:283-407`), chunky ink outlines, flat
  fills, no new art assets.
- **Node stickers:** billboarded, wobbly ink-outlined discs; chapter identity via three cycled
  accents (grow, insight, brandsoft violet), state via outline and corner badge, never fill alone
  (playable = solid ring, locked = dashed ring plus greyed emoji, completed = sun check badge,
  capstone = larger and always sun). Full spec in `docs/world-canvas.md:82-99` in this repo.
- **Theme crossing:** `ThemeController` (`path-scene.tsx:2079`) lerps the dotted-paper colours and
  toggles `data-audience="adult"` as the camera crosses the Chapter 5 to Chapter 6 boundary, the same
  attribute the brand package itself switches on.
- **Thread and capstone colour** (`src/content/path.ts`, one hex per node) is a separate,
  deliberate seven-way taxonomy (A `#0EA5E9`, B `#DC2626`, C `#F59E0B`, D `#EC4899`, E `#7C3AED`, F
  `#059669`, G `#475569`, capstone `#EAB308`) documented in [world and art tokens](games/world-art-tokens.md). It exists to
  give each of 8 content threads a stable identity colour on the path and is intentionally outside
  the brand's four-accent palette; treat it as its own system, not an error, but do not add a ninth
  ad hoc hex to it without updating that inventory.

## Accessibility

**Measured contrast** (WCAG 2.1 formula, full table with method in the [design audit](audits/design-audit-2026-09-14.md)):

- Ink-on-paper, ink-on-surface, and their dark-mode equivalents all measure 14.4:1 to 17.2:1, well
  past AAA.
- Ink and the app's actual `text-slate-900` both measure above 11:1 on `--color-sun`; the CTA text
  colour inconsistency documented in Divergences is not currently a contrast failure, but it is
  untracked debt that could become one on a future sun-tint change.
- **`--color-insight` (UN's teal) on `--color-surface` white measures 1.86:1, and `--color-grow`
  (RE's coral) on the same white measures 2.56:1. Both fail WCAG AA even at large text (needs 3.0:1),
  in the light theme only** (dark-mode surface is dark enough that both pass, 8.96:1 and 6.51:1).
  This is the bold `UN:` and `RE:` label on every myth-bust in light mode (`src/components/games/un-re.tsx:12,15`; the rest of the line is ink), and was
  not previously measured or flagged in code. Fix by darkening the two accent values for text use, or
  by never setting them as a text colour directly and instead using them only as an icon/fill tint
  next to ink text. Tracked as [SWED-63](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/198fdeb2-d7c8-4462-bdf3-5636484e3587).
- `--prx-on-fill` on `--prx-neg` (the "incorrect" fill) measures 4.28:1 in light mode, just under the
  4.5:1 normal-text AA threshold, though it clears the 3.0:1 large-text/UI-component threshold. Every
  other `--prx-*` fill/on-fill pairing clears normal-text AA.

**Focus** (SWED-66, closing SWED-58). At the start of each beat or lap, focus moves to the question card
(`h2` with `tabIndex={-1}`, so a screen reader reads the question first; the capstone waits until the new
lap's question is on the card). Tab from there reaches the reveal gate, then the answers; a keyboard reveal
moves focus to the first answer. When the beat is solved, focus moves to Next. Focus moves use
`preventScroll` so the layout never jumps.

**Tap targets.** Most interactive controls are comfortably above the 24x24 CSS px WCAG AA minimum,
game-done's primary actions are `h-11` (44px), the toolbar dock enforces `min-width: 2.5rem` (40px)
per button (`globals.css:378-380`). The `GameShell` back button is `size-9` (36px,
`game-shell.tsx`), which passes AA but sits under the 44px platform-guideline target that the rest of
the chrome uses, worth a look given how much of the youngest chapter (ages 3 to 6) relies on tapping
precisely.

**Audio-first for ages 3 to 6.** Every Lensy line is spoken (`speak()`/`replay()`,
`src/lib/speak.ts`, wired through `v2-engine.tsx` and `capstone-rich.tsx`); "Hear it again" replays the
beat's question while the beat is in play. The question card's feedback line is `aria-live="polite"`, so
the same lines reach screen readers and TTS-muted players from one call site rather than per-renderer
plumbing (`swipeed-interaction-model.md`), and the tap path (never removed, see Interaction and motion) is
what makes every mechanic playable before a child can read.

**Colour is never the only signal, in principle** (see Interaction and motion); in practice this is
broken in exactly the two places named as known gaps below plus the UN/RE contrast failure above.

**Known gaps (filed, not yet fixed):**

- **SWED-56, match soft-lock.** `MatchPlay` tracks right-hand cells by their label text, not by pair:
  `rightDone(r)` (`v2-engine.tsx:647`) is true once any pair with that right-hand label is matched, and the
  cell then renders `disabled` (`v2-engine.tsx:665`). If two pairs in one scenario share a right-hand label,
  matching one disables both cells, so the last pair can never be completed by tap, keyboard or drag. The
  capstone `MatchLap` duplicates the same code (`capstone-rich.tsx:94,133`). Details in the
  [v2 engine](architecture/v2-engine.md#known-issues) doc.
- **SWED-57, unannounced branch verdict: fixed in SWED-66.** A lesson branch result is announced through the
  feedback line's live region, prefixed "That's the best choice." when the pick was the best one. Capstone
  branch laps only advance on the best pick, and that pick's consequence, debrief and celebration are
  announced the same way.
- **SWED-58, focus dropped on solve: fixed in SWED-66.** See Focus above.

## Divergences and debt

Every place SwipeEd's shipped code disagrees with the brand package or the website's design.md,
file and line where verifiable:

1. **Two component systems coexist.** shadcn/base-ui primitives in `src/components/ui/*.tsx` use
   generic semantic tokens (`bg-primary`, `text-primary-foreground`, `ring-foreground/10`) and never
   the sticker recipe; the actual gameplay chrome (`game-shell.tsx`, `game-done.tsx`, `v2-engine.tsx`)
   hand-rolls sticker-styled elements directly and rarely calls into either the shadcn layer or the
   brand's own `.btn`/`.card` classes. Both are real, neither is wrong on its own, but a new
   contributor has no single place to look for "the button."
2. **`.glass-card` radius does not match the brand's `.card`.** Brand: `border-radius: 24px`
   (`@equal-lens/brand/components.css:110`). SwipeEd: `border-radius: 20px` (`globals.css:251`), no
   comment explaining the change.
3. **SwipeEd re-implements brand utility classes instead of importing them.** `globals.css` imports
   the brand's `tokens.css`, `tailwind.css` and `components.css` (lines 5 to 7) but not
   `utilities.css`, then hand-writes its own `.sticker`, `.canvas-dots`, and `anim-float` /
   `anim-wobble` / `anim-bob` / `anim-pop` (`globals.css:317-336`) with slightly different values
   than the brand originals, for example `anim-bob` rotates -2deg/2deg here versus the brand's
   -3deg/3deg. Low risk today, but it is a second copy of the same recipe that can silently drift
   further from the source of truth.
4. **CTA text on `--color-sun` is a hardcoded Tailwind grey, not the ink token.** The brand's own
   palette table states the sun accent is "always with ink text." SwipeEd's actual CTAs use
   `text-slate-900` seven times (`v2-engine.tsx:274,281,552,570,712,716,724`) instead of
   `var(--color-ink)`. Visually near-identical today (both measure above 11:1 on sun), but it will
   not track a brand ink change and is not itself the documented token.
5. **Baloo 2 headings (decision needed).** Canon: Baloo 2 for Lensy only, never a heading. Website: headlines
   too. SwipeEd: every `h1`/`h2`/`h3` app-wide (`globals.css:16-18,235-237`), with Poppins left for UI labels.
   Keep it as a documented SwipeEd exception, or move headings to Poppins. See Typography.
6. **A second, inert "capstone gold."** `#EAB308` in `src/content/path.ts` (thread metadata) versus
   `--color-sun` (`#FFC94D`, what actually renders). See Tokens.
7. **Confetti and scenery colours are un-migrated raw hex.** `src/lib/confetti.ts:4`,
   `COLORS = ["#62b84b", "#e05c52", "#4f6ef7", "#f5c518"]`, none of which are brand tokens.
   `src/components/scenery.tsx` hardcodes four more hex values (`#7a5a3a`, `#b7b0a4`, `#cfc9bd`,
   `#f0a6c0`) for the 2D fallback path's roadside props. Both predate the "semantic colour tokens"
   unification (`c5e8dc2`, `8bfa887`, `d22dc1b`) and were not swept up by it.
8. **Two path renderers, two visual languages.** The 3D canvas-skin world and the 2D SVG "classic"
   fallback (`learning-path.tsx`) do not share a node-styling implementation; the 2D fallback draws
   its own organic grass/cobblestone scene independent of both 3D skins. Not necessarily wrong (they
   serve different fallback tiers) but undocumented as a deliberate two-track design before now.
9. **UN/RE label contrast fails in light mode.** See Accessibility. Newly measured on 2026-09-14,
   tracked as [SWED-63](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/198fdeb2-d7c8-4462-bdf3-5636484e3587).
10. **Voice rule violated at scale in shipped content.** See Voice and copy and the
    [design audit](audits/design-audit-2026-09-14.md) for counts. Not a code divergence, a content divergence, but the largest one
    in raw volume.

## References

Lazyweb searches run for this document (search only, no report generated, per the task and per the
Lazyweb server's own instruction not to start a report unless asked): a gamified learning path with
nodes, swipe-card quiz answer feedback, and a lesson-completion celebration screen. The full result list
with similarity scores is in the [design audit](audits/design-audit-2026-09-14.md). Headline comparisons:

- SwipeEd's `GameDone` (mascot-adjacent emoji, confetti, star/coin reward, one primary continue
  action) matches the category default seen across Duolingo, Falou, Boldvoice and Capwords
  completion screens closely.
- SwipeEd's locked/playable/completed node path matches the Mimo/Sololearn/Duolingo pattern of a
  node-based map with lock states and a header progress readout, executed in 3D rather than the
  usual flat vertical map.
- SwipeEd's answer feedback is **deliberately leaner** than the category norm. Sololearn shows a
  dedicated modal explaining why an answer was wrong, with thumbs-up/down helpfulness voting;
  SwipeEd never leaves the card and relies on a warm spoken nudge instead. This tracks the "no-fail,
  always" principle in `games/swipeed-interaction-model.md` and should be treated as a considered
  choice, not a gap, unless product direction changes.

For the question card (SWED-66, 2026-09-15), two Lazyweb searches, search only: "multiple choice lesson
question screen" (strong coverage, top similarity 0.66) and "quiz question card mascot speech" (weak
coverage, 0.42, mostly mascot reward screens, so not used as evidence). From the first:

- **Elevate** ("Which word doesn't fit?"): the question is the largest type on the screen, centred, with the
  answer bubbles and an "I don't know" option below it.
- **Couple Joy** ("Who's most likely to win a ski competition"): a large headline question at the top, the
  answer cards anchored at the bottom, well apart from it.
- **Sololearn** (multi-select vibe-coding quiz): the question is small body text above bordered answer cards,
  the same balance SwipeEd had before the playtest. Its "Not quite" feedback appears in a separate bottom
  panel and leaves the question in place, which matches the feedback line.

## How to change this doc

A new UI pattern is not shipped until this file reflects it, in the same change. If a change touches a brand
token value, a shared component class, the voice rule, or anything in the Divergences list above, update the
relevant section here before merging, and add the Plane issue that made the change to this file's
`plane_issues:` frontmatter. Related docs: [v2 engine](architecture/v2-engine.md) (engine internals),
[question bank](schemas/question-bank.md) (content and valence data model),
[world and art tokens](games/world-art-tokens.md), [interaction model](games/swipeed-interaction-model.md),
the [design audit of 2026-09-14](audits/design-audit-2026-09-14.md) and the [knowledge base index](README.md).
