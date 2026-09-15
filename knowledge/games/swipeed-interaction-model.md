---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/swipeed-interaction-model.md
title: SwipeEd - The Interaction Model (direct manipulation)
description: How the shared v2 mini-game engine handles input - the move from "tap a thing, tap another thing" to real direct-manipulation gestures (swipe a card, drag a chip into a bin, draw a cord) built on shared primitives, with the tap path kept as the accessibility / young-child fallback. The living spec every game inherits.
tags: [games, swipeed, engine, interaction, accessibility, gestures, v2]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/368de34e-fae5-48bc-b229-6844dee0ca7e  # SWED-66
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956  # SWED-67
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62  # SWED-68
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543  # SWED-70
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4  # SWED-69
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc  # SWED-97
---

# SwipeEd - The Interaction Model (direct manipulation)

This is the **living spec for how the shared [v2 engine](swipeed-game-patterns.md) takes input.** It
governs every game on the path, so a change here changes the whole catalog. It was written when the audit
found that almost every "mechanic" was secretly the **same** interaction - *tap a thing, then tap another
thing* - with `swipe` the worst case (two `onClick` buttons whose `aria-label` literally said "Swipe": the
affordance lied). The fix was **not** ten one-off rewrites but **a handful of shared primitives** every
mechanic composes, turning each interaction into the verb it teaches.

## Principles

1. **The interaction IS the verb.** Reading a relationship flag is a *swipe*; sorting is *dragging into a
   bin*; matching is *drawing a cord*; erasing a myth is *scrubbing it out*. Direct manipulation, not a tap
   proxy.
2. **The tap path is the accessibility floor, never removed.** `swipe` was the one exception (drag + arrow keys
   and **no buttons**) until 2026-09-15, when the shared `SwipeCard` added one button per side under the card
   (SWED-70). For sort / match / build, the original
   tap-to-arm-then-tap-target on **native `<button>`s** is kept - that single decision *is* the keyboard,
   screen-reader, and **ages-3-6** path. The gesture is an **additive layer on top**, not a replacement.
3. **No-fail, always.** A wrong drop / swipe / connection springs back with a warm nudge; never a buzzer.
4. **Colour is never the only signal.** Bins keep emoji+word; match stamps a shared **number-token** on both
   ends of a cord (readable without colour *and* without the cord); swipe shows a word+flag-emoji edge badge as
   you drag (plus a slim direction hint at rest).
5. **Reduced motion degrades to instant**, never to broken - fly-off, lift, pulse, scrub-blur all collapse
   to instant state changes under `prefers-reduced-motion`; the function is identical.

## Shared primitives - `components/games/interactions.tsx` (build once)

- **`usePointerDrag`** - ONE Pointer-Events hook (mouse + touch + pen, single code path). `setPointerCapture`
  so a drag survives the finger leaving the element; tracks `dx/dy`, total path `distance` (for scrub), and
  `velocity` (flick assist for small fingers). An **~8 px movement threshold** routes a barely-moved release
  to `onTap` - *this is what preserves the tap fallback* in every mechanic.
- **`hitTestZone(x, y, zones, radius)`** - the drop-zone under the pointer, with a forgiving
  nearest-within-`radius` snap for small fingers. Zones pass **live element refs**, so rects are read fresh
  (survives scroll / reflow / wrap).
- **`ConnectorOverlay`** - an absolutely-positioned SVG layer (`pointer-events:none`) that draws match's live
  drag-cord and the locked cords.
- **Engine-wide a11y fix:** every `say()` line reaches screen-reader, deaf and TTS-muted players as text from
  **one place, no per-renderer plumbing** - closing the prior speech-only gap. Originally the Lensy speech bubble
  was the `aria-live="polite"` region; since 2026-09-15 the question card holds the beat's question and the
  feedback line beneath it is the live region (see [Question first](#question-first-2026-09-15)).
- **Pinch-zoom restored** (`app/layout.tsx`: `maximumScale` 1 → 5, `userScalable: true`) - WCAG 1.4.4/1.4.10.
  Drag elements scope their own `touch-action` (swipe card = `pan-y` so vertical scroll still works; drag
  chips = `none`) so gestures and page scroll/zoom coexist.

## Per-mechanic interaction

| Mechanic | Gesture (primary) | Fallback (keyboard / 3-6) | Notes |
|---|---|---|---|
| **swipe** | drag the full-width hero cue card L/R (tints + edge badge appear *during* the drag; fly-off; spring back) | **←/→ arrow keys** on the focusable card, or one button per side under the card (2026-09-15) | no hook card, no static side columns (breathable); ignores input once answered; Lensy also speaks the cue |
| **sort** | drag a chip into its bin (bin highlights, snaps) | tap-to-arm chip → tap bin; fixed-height "carrying …" hint | a placed chip stays in its slot with the bin's emoji badge; bins never grow (2026-09-15) |
| **match** | draw a cord plug→socket; locks and pins a shared numbered corner badge on both cells | tap a left cell → tap a right cell | cells keep their size in every state; no pair ever sits straight across (2026-09-15) |
| **build** | drag a piece onto the slate | tap a piece | assemble checks the key; needs ALL key pieces |
| **strike-rewrite** | scrub the (now visible) myth away → truth resolves | Enter/Space erases in one go | back-and-forth scrub = toddler-easy; progress adds up across strokes (2026-09-15) |
| **myth card** (a strike-rewrite beat in a game with `mythCards`) | swipe the card showing a myth or its truth: Myth left, True right (2026-09-15) | ←/→ on the card, or the Myth and True buttons under it | the question card says only "Myth or true? Swipe the card."; a wrong side gets "Look again"; ends on the UN/RE card; never three scrubs or three cards in a row |
| **choose** | tap every option that fits, then Check (2026-09-15) | same (checkbox buttons) | a miss gets a count and one more look; then every answer shows with its note; no-fail |
| **role-play** | tap an equal-weight, **shuffled** speech card (read & choose the assertive line) | same (native buttons) | press-and-hold-to-speak deferred (optional) |
| **branch** | tap a (now **shuffled**) option → see its consequence → best advances | same | tap *is* the verb (committing to a course) |
| **spot** | tap the suspicious card → the flag PLANTS on the catch | same | tap *is* the verb (pointing) |
| **reflect** | tap any option, then write a few words about it and answer one deeper question (each skippable) | same, plus a text box; ages 3-6 tell a grown-up instead; safety beats stay tap-only | no wrong answer; the reflection continues past the tap ([SWED-97](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc)) |
| **explore-label** | anatomy → tap the part ON a body figure (it lights up where it lives); abstract → honest "which is true?" cards | same (labelled `<button>`s over an aria-hidden SVG) | split is **content-detected** (no schema change) |

## Bugs fixed in the same pass

The tap veneer hid real correctness bugs, fixed here:

1. **build/assemble always won** - it only de-duped; now it checks the answer key (**15 scenarios** have
   distractor pieces that used to count).
2. **build truncated answers** - `target = min(3, key.length)` accepted **3 of a 4-piece answer** (100+
   scenarios); now requires all key pieces.
3. **branch never shuffled** - "best" is authored at index 0, teaching "tap the top one."
4. **role-play double-buzzed** - `vibrate` fired in both the handler and `solve()`.
5. **spot killed its own reveal** - every card pre-stamped 🚩; now cards are neutral and the flag is the
   reward for catching the right one.
6. **strike-rewrite acted on nothing** - the renderer got no scenario; the myth only appeared *after* the
   tap. Now the myth is shown and erased.
7. **match never relabelled the right column** - the bond was unreadable from one side.

## How this was built

A 14-agent audit (10 per-mechanic analyses grounded in the actual engine code → one synthesis → three
adversarial critiques: accessibility, ages 3-6, mobile touch ergonomics) produced the plan; the critiques'
blockers shaped the decisions above (tap kept as the 3-6/keyboard floor; press-and-hold demoted to optional;
the single aria-live bubble; scroll-vs-drag via scoped `touch-action`; pinch-zoom restored). Implemented on
one cohesive branch over the shared engine; tsc + lint + build green; **no content or scenario-schema changes**.

## Shared chrome (the frame around every mechanic)

From on-device review, the shared game chrome was tightened (one place, every game): **Lensy speaks in a chat
bubble** (soft fill + a tail toward Lensy, content-width, **no shadow** - not a card; replaced on 2026-09-15 by
the question card, see [Question first](#question-first-2026-09-15)); **progress is a compact
dot strip at the very top** (tiny when unearned); **Home is a quiet tertiary text button** (not a card); the
**swipe red/green signal lives in the drag** (colour wash + watermark flag + badge); and the **path/scene is
hidden behind a game** (an opaque app-bg layer in GameShell) so the game is the calm focus.

**One border per element (decluttered).** The `.glass-card` already carries a heavy border (2.5px ink + a 4px
offset shadow), so highlights must not add a *second* border: the **hook card was removed entirely** (the chat
bubble already says the hook - a separate card just repeated it); the **swipe card recolours its existing offset
shadow** (no inset ring); **sort dropzones are a single dashed border + a translucent tint fill** (not a card);
**earned dots are a single fill** (no ring); **earned home tiles get a corner ✅** (no inset gold ring). Also:
only one progress counter on screen (the per-mechanic "X/Y" was dropped; the small beat counter stays).

## Capstones share the model (2026-06-23)

The **rich capstone engine** (`capstone-rich.tsx`, see [Capstones](capstones.md)) originally reimplemented each
victory lap with the *old tap-button UI* and a different shell, so none of the fixes above reached the chapter
graduations. It now **inherits the same interaction model** as the v2 games: Lensy's **chat bubble** (mist fill +
tail + `aria-live`); the **three-zone layout** (top progress + bubble · flexible middle · bottom-pinned Next +
counter + tertiary Home - `Next` lifted out of each lap into the engine so the content stops "dancing"); and the
**direct-manipulation gestures** via the shared `interactions.tsx` primitives - **swipe = drag the card up** (↑
key, a celebratory one-way cheer), **sort = drag a chip into a big top/bottom dropzone** (`binStyles`-tinted -
exported from `v2-engine` so the colours match), **match = draw a cord** (`ConnectorOverlay` + shared ①②③
tokens), **strike-rewrite = scrub the myth away** then reveal the truth inline, **build = drag onto the slate**.
Tap stays the verb for gallery / branch / role-play / spot / reflect (and is the keyboard / screen-reader
fallback for the gesture laps); branch & role-play shuffle + carry 🔀/🗣️ cards; spot uses 🔎→🚩. Honours
`prefers-reduced-motion`. Applies to all eight capstones (c1-c8); **no content/data changes.**

**On-device follow-ups (same day):** the strike-rewrite reveal renders the **shared [`UnReBeat`](../../src/components/games/un-re.tsx) UN/RE card** (UN eraser teal → RE pencil coral, with the brand
character icons) - exactly like the lesson engine - not plain inline text; the **swipe lap** no longer flies
off-screen and leaves an empty box (on commit it's replaced by a compact "💚 cheered!" confirmation); **match
cells are equal height** (a single grid with `grid-auto-rows:1fr`, left/right interleaved) so the cords are tidy -
fixed in **both** engines; the capstone **Next** dropped its duplicate arrow; and long text is bounded - the
**chat bubble caps at 34vh and scrolls** (both engines) and the **graduation certificate shows a short bubble**
(the full cert stays in its card and is still spoken).

## Question first (2026-09-15)

A playtest of Choosing & Building showed players answering without reading Lensy's question: the soft bubble lost
to the bold answer cards, the answers appeared with the question, and the first nudge replaced it. Both engines
now open every beat and lap the same way ([SWED-66](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/368de34e-fae5-48bc-b229-6844dee0ca7e);
visual spec in [design.md](../design.md#voice-and-copy), engine detail in the
[v2 engine](../architecture/v2-engine.md#question-card-reveal-and-focus)):

- **The question is the card.** Lensy's question sits on the brand's `.popover` chat card, the largest type in the
  play area, and stays there for the whole beat. The rule above ("not a card") no longer applies to questions.
- **Answers wait to be asked.** They appear after a short reading pause (1.2s plus 60ms a word, at most 4s). One
  tap on the question or on "Ready to answer? Tap here" shows them at once, so no one waits who does not need to.
  Reduced motion drops the fade, not the pause.
- **Nudges never replace the question.** They go to a feedback line under the card, which is the live region.
  Mechanics no longer print their own nudge lines under the answers.
- **Focus follows the beat.** The question card takes focus when a beat starts, the first answer after a keyboard
  reveal, and Next once the beat is solved.
- **Options never move under the finger** ([SWED-67](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956)).
  Answer cards change colour, not size: armed, drag-target and done states recolour the card and keep its hard
  shadow, match numbers and zone emoji are corner badges, placed sort chips keep their slot, and marks that
  appear later have their space reserved. See Answer cards in [design.md](../design.md#components).

## Status

- **Question first** (question card, reading pause, feedback line, focus) in both engines, 2026-09-15.
- **All 10 mechanics now embody their verb** (explore-label landed last: a body figure for the 7 anatomy
  beats, honest "which is true?" cards for the 5 abstract beats - split content-detected, no schema change).
- **Capstone laps now share the interaction model** (gestures + chat bubble + three-zone shell), 2026-06-23.
- **Real-device gesture QA** - touch swipe/drag ergonomics need a physical device; verify on the deployed site.

## Related
- [Reusable game patterns](swipeed-game-patterns.md) (pattern #26 - the v2 standard) ·
  [Games catalog](index.md) · [SwipeEd (app)](swipeed.md) · [Green Light / Red Light](green-light-red-light.md)
  (the flagship that introduced the swipe verb)
