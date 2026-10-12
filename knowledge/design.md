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
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62  # SWED-68
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543  # SWED-70
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4  # SWED-69
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/7c73c697-ebd9-49fe-862f-210febf8f2df  # SWED-93
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22  # SWED-92
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/15cccb6b-b650-4a05-aca2-0c1dcd8957fb  # SWED-95
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc  # SWED-97
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9  # SWED-96
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d2cb5ce0-217b-49cb-b993-b1f5b592dc0e  # SWED-109
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/198fdeb2-d7c8-4462-bdf3-5636484e3587  # SWED-63
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/baa41435-d56c-487b-ac9b-7557d49c85f5  # SWED-87
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/b8bc423b-e51b-4183-b03d-e9aa5327a56c  # SWED-125
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/3b8d2f41-f968-476f-b8a4-867231ecbe8f  # SWED-127
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/37148de2-f03f-4921-9888-12329463f061  # SWED-137
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5232d551-b27d-42cf-8bba-dffcb08c7a97  # SWED-139
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a879f9e-b1d2-4753-8dcc-ce250b3c6c00  # SWED-140
---

# SwipeEd design system

SwipeEd is The Equal Lens's Duolingo-style learning path: a 3D React Three Fiber path of 77 nodes
(69 games plus 8 gold capstones) across 8 age-band chapters, ages 3 through parenthood. Games open
over the path in a shared shell and finish on a shared completion card. Stack: Next.js 16, React 19,
Tailwind v4, `@equal-lens/brand` 0.1.1 from GitHub Packages (see [deployment](architecture/deployment.md)).

This document is descriptive as well as prescriptive: it states the brand rule where SwipeEd should
simply follow it, and it states SwipeEd's own established pattern where the game has grown a
convention the brand package does not cover. See [Divergences and debt](#divergences-and-debt) for
every place the two disagree. Measurements referenced below (contrast ratios, dash counts, colour
audit) are recorded in full in the [design audit of 2026-09-14](audits/design-audit-2026-09-14.md).

## Source of truth and inheritance

Three layers, in order of authority:

1. **`@equal-lens/brand` (npm package from GitHub Packages, pinned at 0.1.1, installed at
   `node_modules/@equal-lens/brand/`).** The organisation's single source of truth for colour, type
   and the base component classes. SwipeEd imports `tokens.css`, `tailwind.css` and `components.css`
   from it directly in `src/app/globals.css:5-7`. When the package changes, SwipeEd re-themes for
   free through these imports.
2. **The Equal Lens website's design system** (external reference: the `the-equal-lens` website repo,
   `knowledge/design.md`). The website consumes the same package and documents the
   organisation-level usage rules (sticker pattern, voice, button variants). SwipeEd inherits these
   rules where they apply to a game, not a marketing site: the sticker/cut-out card language, the
   hyphens-not-dashes voice rule, and the `[data-audience="adult"]` light/dark mechanism all carry
   over, as does the Equal Lens family rule (fixed core and per-product choices, in the website's `knowledge/design.md`).
   Website-only concerns (the Gallery carousel, the blog embed sandbox, the canvas myth
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
| `--color-brandsoft` | `#735997` | `#B3A4D6` | Muted violet (the package's 0.1.1 light value, `#735997`, 4.53:1 on mist, THEEQ-61; before the pin moved to 0.1.1 it was `#7F65A4`. SwipeEd only uses it in dark, `--brand-600`, so nothing changed here) |
| `--color-paper` | `#FBF9FF` | `#15101F` | Page background |
| `--color-surface` | `#FFFFFF` | `#221A30` | Cards, notes |
| `--color-mist` | `#E7E0F1` | `#3A2E4D` | Hairlines, hover fills |
| `--color-ink` | `#221436` | `#F1ECFA` | Text, outlines |
| `--color-band` | `#553286` | `#241B38` | Dark CTA band |
| `--dot` | `#ECE6F6` | `#2A2140` | Dotted-paper texture |
| `--color-insight` | `#2DD4BF` | same | Teal, "unlearn" |
| `--color-grow` | `#FF7A5C` | same | Coral, "relearn" / CTA |
| `--un-ink` | `#058274` | `var(--color-insight)` | UN's label text: the teal darkened in OKLCH to 4.7:1 on white ([SWED-63](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/198fdeb2-d7c8-4462-bdf3-5636484e3587)). Text only; fills and icons keep `--color-insight`. |
| `--re-ink` | `#BB543D` | `var(--color-grow)` | RE's label text: the coral darkened the same way, 4.7:1 on white. Text only. |
| `--color-sun` | `#FFC94D` | same | Yellow, CTA (brand rule: always paired with ink text) |
| `--color-sky` | `#4FB0E8` | same | Blue, support |

Violet ramp: `50 #F3F0F6 · 100 #E5E0ED · 200 #C5B6DE · 400 #7F65A4 · 600 #553286 (brand) · 700 #44288B
· 800 #331E50 · 900 #221436`. SwipeEd re-exposes this ramp under its own `--violet-*` short names in
`globals.css:73-80`, aliased straight to the brand variables, purely a back-compat rename from before
the tarball existed.

### SwipeEd semantic tokens (not in the brand package)

**Danger is the family red** ([THEEQ-64](https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/a2255819-9c27-4992-9440-1fd577afa1f0), [SWED-140](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a879f9e-b1d2-4753-8dcc-ce250b3c6c00)):
`--destructive` is `#A9442F` for kids and `#FF8A6E` for adults, the one danger red every Equal Lens product shares.
It is chrome only (errors, destructive actions, invalid fields). The gameplay reds below (`--prx-neg`,
`--prx-flag-red`) are the answer key's colours, not danger, and stay where the engine needs them.

These are the "declared valence" system: a bin, chip, or branch option carries an explicit
`pos`/`neg`/`tell`/`uhoh` meaning in its content schema (see the [question bank](schemas/question-bank.md) for the data
model) rather than the engine guessing from English wording. Defined in `src/app/globals.css:82-105`
(light) and `:170-171` (dark values shown; `--prx-pos` is an alias and follows its flag token, and `--prx-neg`
is an alias in dark only):

| Token | Light | Dark | Usage rule |
|---|---|---|---|
| `--prx-pos` ("correct") | `oklch(0.68 0.16 150)` (~green) | `oklch(0.76 0.16 150)` | A declared-positive bin, a matched pair, a caught trick. Always paired with its word (the bin label, the side word, the chip text), with an `aria-hidden` emoji beside it, per "Colour is never the only signal" in Interaction and motion; never colour alone. |
| `--prx-neg` ("incorrect") | `oklch(0.64 0.20 22)` (~red, `#ED4952`) | `oklch(0.70 0.19 22)` (alias of `--prx-flag-red`) | A declared-negative bin, a caught red flag. Same pairing rule. Light is its own fill value, not the flag-red alias: it was `0.62` (on-fill 4.30:1) and moved to `0.64` (4.65:1) at the same hue and chroma ([SWED-137](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/37148de2-f03f-4921-9888-12329463f061)). `--prx-flag-red` (`0.62`) stays for red used as text or border on white. |
| `--prx-tell` | `oklch(0.70 0.15 78)` | `oklch(0.80 0.15 80)` | A "tell someone" cue in Be the Safe Adult-style content, amber. |
| `--prx-uhoh` | `oklch(0.64 0.16 45)` | `oklch(0.73 0.16 45)` | A caution cue, orange-red. |
| `--prx-on-fill` | `#221436` fixed, does not flip | same | Text/icon colour placed on any of the four fills above. Deliberately **not** `var(--color-ink)`: the fills are mid-lightness in both themes, so the foreground must not flip with them (comment at `globals.css:104` records the measured range, white-on-fill scored 2.01 to 3.61, this scores 4.65 to 9.04 on the four fills in both themes, see Accessibility). |
| `--prx-slot-1` … `--prx-slot-6` | six hues at `oklch` L 0.64, non-semantic | six hues at L 0.71 | Position-only wheel for an *undeclared* bin, so a bin with no declared valence still gets a distinct colour without asserting correctness. The match board also puts its pair number on them (`CornerBadge`, 12px extrabold `--prx-on-fill` text), so all six clear 4.5:1 with that ink in both themes (light 4.70 to 5.38, dark 6.18 to 7.00). They moved from L 0.62 to 0.64 at the same hue and chroma ([SWED-140](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a879f9e-b1d2-4753-8dcc-ce250b3c6c00)); L 0.64 is also the most they can rise, because a slot used as a bin border must stay 3:1 on paper and surface (lowest 3.06). |

**UN and RE** are not colour tokens, they are characters that borrow existing brand accents:
UN (the eraser, "unlearn") is teal and RE (the pencil, "relearn") is coral. Their bold `UN:` and
`RE:` labels use the text tokens `--un-ink` and `--re-ink`, which are darker in light mode and are the
accents themselves in dark mode. Defined once in `src/components/games/un-re.tsx` and reused
everywhere a myth gets busted. Never set `--color-insight` or `--color-grow` as text on a light surface.

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
`knowledge/design.md` loosens this to "Baloo 2: headlines + playful / mascot voice."

SwipeEd currently goes further than either: it points `--font-display`, `--font-heading` and `--font-hand` at
the same Baloo 2 variable (`src/app/globals.css:16-18`) and sets every `h1`/`h2`/`h3` in Baloo 2
(`globals.css:235-237`). Poppins survives only as `--font-ui` (`globals.css:19`) for UI labels.

**Decided 12 October 2026 ([SWED-140](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a879f9e-b1d2-4753-8dcc-ce250b3c6c00)): SwipeEd keeps Baloo 2 for every heading.** Two reasons.
First, the register: SwipeEd starts at age 3, the first chapters are read aloud to children who cannot yet read
(see Accessibility, audio-first), and its headings are in the same rounded, friendly face as Lensy's question card, so a
young child meets one voice. Second, the pairing is allowed: Baloo 2 is on the Equal Lens family's approved type
pairings (the canon pairs it with Mukta for Hindi), set out in the website's `knowledge/design.md`, section "Equal
Lens family rule". This is a recorded SwipeEd choice under that rule, not a divergence to fix. New heading styles go
through the existing `h1`-`h3` rule or `--font-heading`, never a hardcoded Baloo family.

Fonts load via `next/font/google` in `src/app/layout.tsx:9-22` (self-hosted, not the brand's
`fonts.css` `@import url(...)`), a reasonable Next.js-idiomatic substitution for the same three
families and weights the brand specifies.

| Token | Family | Used for |
|---|---|---|
| `--font-nunito` / `--font-sans` / `--font-mono` | Nunito Sans | Body copy |
| `--font-baloo` / `--font-display` / `--font-heading` / `--font-hand` | Baloo 2 | All headings, Lensy/UN/RE speech, mascot voice |
| `--font-poppins` / `--font-ui` | Poppins | UI labels, wordmark (not headings, in practice) |

### Type scale and floors ([SWED-139](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5232d551-b27d-42cf-8bba-dffcb08c7a97), CLAUD-21)

One scale for the whole app, set in Tailwind's rem steps, so the Text size setting (it sets the root font size) and browser zoom scale every size. The shared shell does not know the chapter, so all eight chapters use the same sizes and the floors below are set by the youngest players who read for themselves. The age bands differ in how many words a line may hold (the [UX copy standard](playbooks/ux-copy-standard.md)), not in type size. Ages 3 to 6 are pre-readers: every line is also spoken and a picture carries each answer, so their floor protects the adult reading along.

| Role | Size | Class | Face and weight |
|---|---|---|---|
| Deck or scenario card | 26 to 29px | `text-[1.65rem]` to `text-[1.8rem]` | Baloo 2 (`font-display`), semibold or bold |
| Swipe card text | 20px | `text-[1.25rem]` | Nunito Sans, bold |
| Question (Lensy's card, capstone cards) | 19px | `text-[1.1875rem]` | Baloo 2, semibold or bold. The largest type in the play area |
| Screen title (`h1` to `h3`) | 16 to 30px | `text-base` to `text-3xl` | Baloo 2, semibold to extrabold |
| Answer (card, pill, option, consequence) | 16px | `text-base` | Nunito Sans, bold or semibold (was 15px) |
| Feedback line, hint, instruction, explanation, definition, help detail, setting description | 14px | `text-sm` | Nunito Sans, semibold or regular (hints and explanations were 12px) |
| Counter, progress, badge, chip, label | 12px | `text-xs` | Nunito Sans, semibold or bold |

**Floors by age band.** The floor is the smallest size at which a player in that band may be asked to read a line.

| Band | Ages | Reads | Questions and answers | Hints, feedback, explanations, safety lines | Counters, badges, labels |
|---|---|---|---|---|---|
| 1 | 3-6 | The adult beside the child; every line also spoken | 16px, with a picture | 14px | 12px |
| 2 | 6-9 | The child; audio on by default | 16px | 14px | 12px |
| 3 | 9-12 | The child | 16px | 14px | 12px |
| 4-5 | 12-18 | The player | 16px | 14px | 12px |
| 6-8 | 18 to parents | The player | 16px | 14px | 12px |

- **Nothing is set below 12px.** Every 9, 10 and 11px label (path chapter subtitles, "Soon" and "Start" tags, card kickers, stars) is now 12px, and the myth cards' chip, hint and explanation (9.3, 10.2 and 10.6px) are 12px. Lines that read as hints moved to 14px: the swipe-deck instructions, the toolkit level labels and the mood check-in labels.
- **Meta text (12px) never carries the only copy of an instruction or a safety line.** If a player must act on it, set it at the hint size (14px) or larger.
- A band-specific size would need the chapter in the shell, which it does not have today (`band` exists only inside `ReflectPlay`). If a playtest shows ages 3 to 6 or 6 to 9 need 18px answers, add a `data-band` on the game root and size from a custom property; do not hard-code a size in a component.
- **Path-world notes** (`.myth-card` in `globals.css`) keep the 12px meta floor, not the 14px hint floor: the card is a fixed 10.5rem sticky note over the 3D world, so a 14px explanation would reflow every note. Body text on it is 12.5px (0.78rem). This is an exception, owner call.
- Still fixed px, so they do not follow the Text size setting: the path world's HTML labels (13px and 16.5px in `path-scene.tsx`) and `.canvas-scribble` (13px).

### Spacing, radius, shadow, elevation

The brand package defines no spacing scale, so SwipeEd inherits Tailwind v4's default spacing
unmodified; there is nothing to diverge from here. shadcn's `ui/card.tsx:15` adds one local
convention, a `--card-spacing` custom property (`--spacing(4)`, 1rem; `--spacing(3)` at `size="sm"`).

Radius is a single brand token, `--radius: 1rem` (`globals.css:148`), with `--radius-sm` through
`--radius-4xl` derived from it by multiplication (`globals.css:150-156`) for the shadcn layer. The
brand's own `.card` class is `border-radius: 24px` (`@equal-lens/brand/components.css:110`); SwipeEd's
equivalent `.glass-card` sets `border-radius: 20px` (`globals.css:251`), a small unexplained
departure from the brand recipe it otherwise copies verbatim, also tracked below.

Elevation is not blur-based, and since 2026-09-15 it is not on everything ([SWED-93](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/7c73c697-ebd9-49fe-862f-210febf8f2df)). The brand's sticker look is a
chunky ink border plus a hard offset shadow, and its own spec reads the shadow as "lifted, therefore tappable". SwipeEd
had put a 3 to 6px diagonal ink shadow on every pill, card and panel, so nothing stood out and dark mode glared with
light lavender offsets. The owner: "everything doesn't need it... Rethink!" The rule now is **press, don't float**:

| Level | What gets it | Recipe (`src/app/globals.css`) |
|---|---|---|
| Flat | What you read or what holds things: Lensy's question card, top-bar and info pills, resolve and reassurance pills, the UN/RE card, slates, zones, drawers and panels, the onboarding card | Surface fill and ink border, no shadow. The question card adds a 9% brand wash (`.popover.question-card`) |
| Lip | What you press: answer cards and topic tiles (a `button`, `a`, or `role` button, checkbox or radio with `.glass-card`), answer pills such as Myth and True (`.press`), path nodes (`.sticker-soft`); cards you drag get `.lift` (a 4px lip, no press) | `box-shadow: 0 3px 0 0 var(--lip)`, a shelf straight under the bottom edge. Pressing moves the element down 2px with `translate` and shrinks the lip to 1px. A selected card uses `--lip-brand` |
| Main action | The one sun button on a screen: Play with Lensy, Check, Next, Finish, graduate, Start playing | `.cta`: `0 4px 0 0 var(--lip-sun)`, presses down 3px, no lip when disabled |

`--lip` is ink mixed 45% into the surface in the light theme and a quiet purple-grey (ink 22% into the paper) in the dark
theme, so a lip never becomes a light offset. No state changes a lip's offset, so cards keep their size and position
(SWED-67). This is a deliberate departure from `@equal-lens/brand`, whose `.btn`, `.card`, `.sticker` and `.popover`
recipes all carry a diagonal ink shadow; SwipeEd overrides them locally. Real-app reference: Duolingo's answer tiles and
buttons, flat cards with a thicker bottom edge and no floating shadow
(https://www.lazyweb.com/agentic-search/1e9412a0-49ff-4259-95a4-45bd5fdbeac3).

## Voice and copy

Brand rule, inherited without change: **no em dashes and no en dashes anywhere**, not in UI copy, not
in content, not in code comments or docs, and not in numeric ranges (write `3-6`). Use a hyphen, a comma,
a colon, a period, or reword. Sentence
case throughout, curious and warm rather than instructional, never preachy. The brand's one-line
summary (`@equal-lens/brand/README.md`, final section): "Curious, warm, brave, playful not preachy.
Sentence case, hyphens not em dashes."

**Enforced since 2026-09-15.** On 2026-09-14 `src/` held 5,113 em or en dash characters on 3,796 lines, most of them
in scenario content. [SWED-92](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22) rewrote every one by what the dash was doing (two sentences, a comma, a colon, "like",
a hyphen for ranges), redid the rewrites that had become comma splices, and added `scripts/no_dashes.py`, which fails
the build and the commit on any em or en dash in a tracked text file. How to write around them, with before and after
examples: [writing without dashes](playbooks/writing-without-dashes.md). A spaced hyphen is not a substitute.

**Spelling is British** in copy, content and docs (colour, behaviour, organise, programme). The shipped content already
follows it: `src/content` has no `color`, `behavior`, `organiz` or `favorite`. Code identifiers and CSS properties keep
their standard names.

**The UX copy standard.** Every string a player or parent sees or hears follows the [UX copy standard](playbooks/ux-copy-standard.md) ([SWED-127](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/3b8d2f41-f968-476f-b8a4-867231ecbe8f)): word limits per chapter (8, 10, 14, 20 or 25 words a sentence), safety rules checked first, every safety line and every answer both shown and spoken, no symbol or emoji carrying meaning, and one name per thing. Two house rules that used to live only in the Equal Lens skill are part of it: ask where a feeling is, never why, and Lensy wonders and asks but is never the authority. The first audit against it is [UX copy audit, 2026-10-04](audits/ux-copy-audit-2026-10-04.md).

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
   plus `.question-card` (a 9% brand wash over the surface, 2.5px ink border, 24px radius, no shadow since
   [SWED-93](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/7c73c697-ebd9-49fe-862f-210febf8f2df)), text in `font-hand` (Baloo 2, Lensy's voice) at 19px semibold, capped at `38vh` and scrollable. It
   is the largest type and the only washed surface in the play area, so it reads first without floating
   above the answer cards (`.glass-card`, 16px bold, 3px lip). The card keeps the beat's question for the whole beat.
2. **The feedback line.** A plain text line under the card (`text-sm`, semibold, `text-foreground/80`,
   `min-h-10`), `role="status" aria-live="polite" aria-atomic="true"`. Nudges ("Not a match. Try
   another.") and confirmations ("Kind words: builds trust ✔") go here and never replace the question.
   A confirmation is `pairLine(item, answer)`: the zone or right card's trailing emoji is dropped (the zone
   already shows it) and the line ends on a heavy tick, which speech skips as an emoji
   ([SWED-95](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/15cccb6b-b650-4a05-aca2-0c1dcd8957fb)). Zone labels render through `plainLabel()` for the same reason.
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
| Answer cards | `AnswerCard`: a `.glass-card` button with a `data-state` of `idle`, `selected` (armed: brand border, brand lip, brand wash at `--prx-wash-hover`), `target` (a drag is over it: brand border and wash) or `done` (a correct match, a placed chip, a found or picked card: `--cell-tint` border and wash, default `--prx-pos`). A state never changes border width, lip offset or size, and there is no pulse. `CornerBadge` pins a 24px round marker to the top-right corner: the pair number in its cord colour on matched cells, the zone emoji on placed chips, ✓ on a picked card, ⤵ on zones while a chip is armed. Placed sort chips stay in their slot and zones never collect tokens, marks that appear later ("Caught!", a gallery check) keep their space reserved, and the sort hint line is a fixed two lines. Used by match, sort, spot, explore-label and the capstone gallery, spot, branch, role-play and reflect steps ([SWED-67](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956)) | `src/components/games/answer-cells.tsx`; `.glass-card[data-state]` in `src/app/globals.css` |
| Choose card set | `ChoosePlay` ([SWED-69](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4)): a fixed hint line ("Tap every one that fits, then Check"), six `AnswerCard`s in one column that toggle as checkboxes (`role="checkbox"`, `selected` state while picked), and a sun **Check** CTA ("Check again" after a miss, disabled until something is picked). On the reveal every fitting option is `done` in `--prx-pos` with a ✓ badge (a missed one keeps a plain ✓ badge and adds "This one fits too." and its note), and a wrong pick is `done` in `--prx-neg` with a ✕ badge and "This one doesn't fit." and its note. The set stays on screen above the relearn pill until Next. Notes appear only after the interaction ends, so no card changes size while the player is choosing | `src/components/games/v2-engine.tsx` (`ChoosePlay`) |
| Story steps and recap | `StoryPlay` ([SWED-96](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9)): a multi-step branch or role-play. A centred `text-xs` "Question 2 of 3" line over 4 or 5 `AnswerCard`s in one column (🔀 before a move, 🗣️ before a line to say), all `idle`: nothing is marked right or wrong while playing. A pick collapses the set to the picked card (`selected`, disabled) above a flat `glass-pill` with a small label ("What happens", or "They reply" for a role-play) and the option's `then`, and a sun **Continue** CTA ("See how it went" on the last question) that takes focus. The next question replaces the one on Lensy's card and its answers wait behind `RevealGate`. The recap replaces the card's text with "Let's look back at each choice." and lists one flat `glass-card` row per question: the question in `text-xs` muted, "Your pick" ("Your line") and its text, then either "✓ Your pick was the best one" with the row tinted `--prx-pos` through `data-state="done"`, or "Best move" ("Best line") and its text, and the question's `why`. The take-away pill and Next follow. The words carry the result, so colour is never the only signal. Real-app references (a step count over options, a two-person dialogue): https://www.lazyweb.com/agentic-search/2b2bf842-3afb-4ceb-accb-b2e21ade3ad4 | `src/components/games/story-play.tsx` |
| Reflect conversation | `ReflectPlay` ([SWED-97](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc)): after the tap, the options give way to a flat "Your pick" card (`data-state="selected"`) and Lensy's card asks the scenario's `ask` (or the band's: "What made you pick that one?", "What makes that one fit for you?"). Under it, a text box in the onboarding input style (2.5px ink border, paper fill, brand border on focus, 3 rows, 280 characters) with a starter placeholder, a `text-xs` line "Only you see this. It isn't saved or sent anywhere." with a tabular counter, a sun **That's my answer** CTA (disabled while empty) and a tertiary **Skip**. The second turn shows "You wrote" (a flat `glass-pill` with the player's words) and the 💛 affirm pill above the same box for the `deeper` question; the result card reads "Thanks for thinking it through." and the take-away is the relearn. Ages 3-6 get a 🗣️ pill ("Say it out loud to a grown-up near you") with **I told them** and **Maybe later** instead of a box. Safety beats keep the single tap. Words that suggest harm replace the box with a flat support card, the game's help pill and **Continue**. Real-app references (a step count over options plus write-your-own, a compose screen with a skip): https://www.lazyweb.com/agentic-search/2b2bf842-3afb-4ceb-accb-b2e21ade3ad4 | `src/components/games/reflect-play.tsx` |
| Swipe card | `SwipeCard`: the full-width cue card (`.lift`) that tints toward the side being dragged and shows a word-plus-emoji badge, with one `.glass-pill press` button per side under it (side word and valence emoji), so a player who cannot drag or cannot see the card can still answer. Arrow keys work on the focused card, and it ignores input once answered ([SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543)) | `src/components/games/swipe-card.tsx` |
| Myth card | `MythCardPlay` ([SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543)): a strike-rewrite beat played on the Swipe card. Lensy's question card reads "Myth or true? Swipe the card." in place of the hook, and the card shows the myth (`myth.un`) or its truth (`myth.re`). The side buttons read 🛑 Myth (left, `--prx-neg`) and True 💚 (right, `--prx-pos`). A wrong side keeps the card where it is and puts "Look again. Is that really true?" or "Look again. That one is true." on the feedback line; the right side resolves to the shared UN/RE card. A game turns it on with `mythCards`; each strike beat is then a card or a scrub at random, never three of one kind in a row, and cards mix myths and truths on the same rule | `src/components/games/v2-engine.tsx` (`MythCardPlay`) |
| Game shell chrome | `GameShell`: fixed glass-pill top bar (back button, title, progress "n/m"); its max width leaves room for the toolkit button in the top-right corner (`calc(100% - 5.5rem)`, `10rem` from `sm`), so a long title truncates instead of running under it ([SWED-87](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/baa41435-d56c-487b-ac9b-7557d49c85f5)), opaque `--app-bg` overlay so the path is hidden behind an open game, `align="center"` vs `"fill"` for content that must pin its own top/bottom rows | `src/components/game-shell.tsx` |
| Lensy's question card | `LensyQuestion`: Lensy plus an `h2.popover` question card in `font-hand`, the feedback line (the play area's one live region) and `RevealGate`. See How Lensy speaks | `src/components/games/lensy-question.tsx` |
| Feedback banners | No hard-fail red banner anywhere. A wrong move gets a warm nudge from `say(...)`, shown on the question card's feedback line and spoken; mechanics no longer render their own inline nudge lines under the answers (removed in SWED-66, they duplicated the spoken line and shifted the layout when they mounted). A non-best pick on a single-step branch keeps its 💛 consequence card with a retry button (a multi-step branch never marks a pick before its recap) | `src/components/games/lensy-question.tsx`; `say()` in `v2-engine.tsx` and `capstone-rich.tsx` |
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
- **Tap is the accessibility floor**, never removed, on every mechanic. `swipe` was the exception (drag
  and arrow keys, deliberately no buttons) until the 2026-09-15 plan: `SwipeCard` now puts one button per
  side under the card, labelled with the side's word and emoji, and the capstone's swipe-up lap has a
  "tap to cheer it on" button ([SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543)).
  The swipe stays the invitation; the buttons are for players who cannot drag or cannot see the card. The
  floor is what makes ages 3 to 6 and keyboard/screen-reader use the same code path as everyone else, not a
  separate mode.
- **No-fail, always.** A wrong drop, swipe or connection springs back with a warm nudge, never a
  buzzer, never a blocking modal. This is a considered departure from the category norm (see
  References): most swipe-card learning apps show a dedicated "here's why that's wrong" screen;
  SwipeEd keeps the same card on screen and lets the child try again.
- **Colour is never the only signal.** The meaning is in a word: a bin shows its label, a swipe side shows its word on
  the card and on its button, and a placed chip names its zone in its `aria-label`. A matched pair also shares a
  numbered corner badge on both cells, readable without colour and without the cord. Emoji and numbers are `aria-hidden`
  beside the word and carry no meaning of their own, as the [UX copy standard](playbooks/ux-copy-standard.md) requires.
  That is what `renderBin`, `SwipeCard` and `CornerBadge` do today (see Accessibility).
- **The layout never gives the answer away.** A match board never puts a pair straight across, and from four
  pairs up at most one pair sits in a neighbouring row; sort shuffles both its items and its zones, so neither a
  row nor a zone's place (the good zone on top) is a tell.
- **Options never move under the finger.** Within a beat, answer cards keep their size and position:
  states recolour (see Answer cards), marks are corner badges or reserved space, and nudges live on the
  question card's feedback line rather than in lines that mount under the answers. `ring-*` utilities
  are not used for states because `.glass-card` is unlayered and its `box-shadow` (the lip) always wins.
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

**Measured contrast** (WCAG 2.1 formula, full table with method in the [design audit](audits/design-audit-2026-09-14.md)). `python3 knowledge/contrast.py` re-checks the token pairs below on paper, surface and mist in both themes (including the OKLCH `--prx-*` fills) and exits 1 on a failure. It also lists one known gap: `text-foreground/60` is 4.19 on mist and `/55`, `/50` and `/40` fail on light surfaces (3.90, 3.35, 2.52); 15 uses sit at 55% or below ([SWED-139](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5232d551-b27d-42cf-8bba-dffcb08c7a97)).

- Ink-on-paper, ink-on-surface, and their dark-mode equivalents all measure 14.4:1 to 17.2:1, well
  past AAA.
- Ink and the app's actual `text-slate-900` both measure above 11:1 on `--color-sun`; the CTA text
  colour inconsistency documented in Divergences is not currently a contrast failure, but it is
  untracked debt that could become one on a future sun-tint change.
- **`--color-insight` (UN's teal) on `--color-surface` white measures 1.86:1, and `--color-grow`
  (RE's coral) on the same white measures 2.56:1. Both fail WCAG AA even at large text (needs 3.0:1),
  in the light theme only** (dark-mode surface is dark enough that both pass, 8.96:1 and 6.51:1).
  This was the bold `UN:` and `RE:` label on every myth-bust in light mode. **Fixed 2026-10-03:** the
  labels now use `--un-ink` (`#058274`, 4.72:1 on white, 4.51:1 on paper) and `--re-ink` (`#BB543D`,
  4.72:1 and 4.52:1), the same hues darkened in OKLCH; dark mode keeps the accents. Tracked as [SWED-63](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/198fdeb2-d7c8-4462-bdf3-5636484e3587).
- `--prx-on-fill` on `--prx-neg` (the "incorrect" fill) measured 4.30:1 in light mode (this doc recorded
  4.28 from a different gamut mapping), just under the 4.5:1 normal-text AA threshold. **Fixed
  ([SWED-137](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/37148de2-f03f-4921-9888-12329463f061)):**
  the light fill moved from `oklch(0.62 0.20 22)` (`#E6424C`) to `oklch(0.64 0.20 22)` (`#ED4952`), same hue and chroma, and now
  measures 4.65:1. The four declared fills now measure, light: neg 4.65, uhoh 4.79, tell 6.30, pos 6.39;
  dark: neg 5.92, uhoh 6.83, pos 8.53, tell 9.04 (`oklch` converted to sRGB with CSS gamut mapping, ratios by the
  WCAG formula).
- **The six position-wheel slots carry text, so they are held to 4.5:1 ([SWED-140](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a879f9e-b1d2-4753-8dcc-ce250b3c6c00)).** The match board's pair number
  badge (`CornerBadge` in `answer-cells.tsx`, pair 1 to 6 on `--prx-slot-1` to `-6`) sets 12px extrabold `--prx-on-fill`
  text on them, and the swipe card's edge badge does the same on slots 1 and 2 when a side falls back to the neutral bins. In light, `slot-3` measured 4.38 and `slot-6` 4.34, and `slot-5` sat on the line at 4.49 to 4.51 depending
  on the gamut mapping. All six light slots moved from `oklch` L 0.62 to 0.64 (same hue and chroma, so the wheel keeps one
  lightness and its hue spread) and now measure 5.38, 5.07, 4.75, 5.27, 4.87 and 4.70 with `--prx-on-fill`. The dark slots
  (L 0.71) already measured 6.18 to 7.00 and are unchanged. `knowledge/contrast.py` checks the text pairs and the bin-border
  pairs (3:1 on paper and surface, lowest 3.06) in both themes.

**Focus ring** ([SWED-137](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/37148de2-f03f-4921-9888-12329463f061)).
Before this the only default was shadcn's `outline-ring/50`, a translucent colour with no width or style, so most
controls had no reliable indicator. Now `globals.css` has one unlayered rule, `:focus-visible { outline: 2px solid
var(--ring); outline-offset: 2px }`, with `--ring` = `--color-brand`. It outranks `outline-none` and the shadcn
translucent `ring-ring/50` halo, which stays as a soft extra. `tabindex="-1"` targets (the question card, dialog panels)
keep no ring. Ratios against the ground behind the ring:

| Ground | Light ring `#553286` | Dark ring `#C9B8E6` |
|---|---|---|
| paper | 9.19 (`#FBF9FF`) | 10.20 (`#15101F`) |
| surface | 9.60 (`#FFFFFF`) | 9.12 (`#221A30`) |
| mist / secondary | 7.47 (`#E7E0F1`) | 6.84 (`#3A2E4D`), 7.96 on `#2E2440` |
| page gradient end | 8.51 (`#F3F0F6`) | 10.46 (`#120D1A`) |

The path world is an illustrated ground (grass, path) where no single colour clears 3:1 in dark (the ring is 1.35 on the
dark path and 2.90 on the dark grass). Path nodes therefore draw a paper halo around the ring (`ring-[6px]` in `--color-paper`,
with the outline in the middle): violet sits between two paper bands, 9.19 (light) and 10.20 (dark) on either side, whatever is
behind. The swipe and rub-out cards keep their own `ring-4` in ink (14:1 or better).

**Focus order and moves** (SWED-66, closing SWED-58). At the start of each beat or lap, focus moves to the question card
(`h2` with `tabIndex={-1}`, so a screen reader reads the question first; the capstone waits until the new
lap's question is on the card). Tab from there reaches the reveal gate, then the answers; a keyboard reveal
moves focus to the first answer. When the beat is solved, focus moves to Next. Focus moves use
`preventScroll` so the layout never jumps.

**Tap targets.** Most interactive controls are comfortably above the 24x24 CSS px WCAG AA minimum,
game-done's primary actions are `h-11` (44px), the toolbar dock enforces `min-width: 2.5rem` (40px)
per button (`.tb-pill .toolbar__btn` in `globals.css`). The round top-bar buttons are `size-9` (36px) and stay that size visually; as of
[SWED-137](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/37148de2-f03f-4921-9888-12329463f061)
they carry an invisible `::after` hit area from two utilities in `globals.css`: `.hit-48` (48px) on the back or leave
button in `game-shell.tsx`, `path/page.tsx` and `glrl/run-host.tsx`, and `.hit-44` (44px) on the sound and "Hear it again"
buttons in `v2-engine.tsx` and `capstone-rich.tsx`. The back button gets 48px in every chapter, not only ages 3 to 6, because
the shared shell does not know the chapter (the 3 to 6 guideline is 48px). The two tool buttons sit 8px apart, so their 44px
areas touch without overlapping. New small round controls use `.hit-44` rather than growing the visual size.

**Audio-first for ages 3 to 6.** Every Lensy line is spoken (`speak()`/`replay()`,
`src/lib/speak.ts`, wired through `v2-engine.tsx` and `capstone-rich.tsx`); "Hear it again" replays the
beat's question while the beat is in play. The question card's feedback line is `aria-live="polite"`, so
the same lines reach screen readers and TTS-muted players from one call site rather than per-renderer
plumbing (`swipeed-interaction-model.md`), and the tap path (never removed, see Interaction and motion) is
what makes every mechanic playable before a child can read.

**Colour is never the only signal** (see Interaction and motion). The code does it: bins, swipe sides and placed chips are
named by a word, and the emoji and pair numbers beside them are `aria-hidden` badges (`renderBin` in `v2-engine.tsx`,
`SwipeCard`, `CornerBadge` in `answer-cells.tsx`). No gap against it is open: the three accessibility gaps filed on
2026-09-14 are fixed (below), and so is the UN/RE contrast failure (above).

**Known gaps filed on 2026-09-14, and their status:**

- **SWED-56, match soft-lock: fixed in SWED-68.** Match cells were tracked by label text, so two pairs sharing a
  right-hand label disabled each other's cell and the board could never be finished. The shared `MatchBoard`
  keys cells by position and accepts any unused pair with matching labels. Details in the
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
5. **Baloo 2 headings (decided 12 October 2026, [SWED-140](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a879f9e-b1d2-4753-8dcc-ce250b3c6c00)).** Canon: Baloo 2 for Lensy only, never a heading.
   Website: headlines too. SwipeEd: every `h1`/`h2`/`h3` app-wide (`globals.css:16-18,235-237`), with Poppins left for
   UI labels. Kept, for the young children's register and because Baloo 2 is on the family's approved list. See Typography.
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
9. **UN/RE label contrast failed in light mode. Fixed 2026-10-03, no longer a divergence.** See Accessibility. Measured on 2026-09-14,
   fixed under [SWED-63](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/198fdeb2-d7c8-4462-bdf3-5636484e3587).
10. **Voice rule violated at scale in shipped content.** Resolved on 2026-09-15 under SWED-92: no em or en dashes
    remain and a gate keeps it that way (see Voice and copy). The spaced hyphens left in older knowledge base prose were
    rewritten the same day under [SWED-98](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850);
    app copy and content have none.

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

## SwipeEd logo and app icons ([SWED-125](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/b8bc423b-e51b-4183-b03d-e9aa5327a56c), 2026-10-03)

The official SwipeEd logo is a stack of answer cards with a coral arrow. It comes from The Equal Lens's `Solutions/` folder and is kept in `public/brand/swipeed/`:

| File | Use |
|---|---|
| `logo.svg` | The default mark on light surfaces, and the SVG favicon |
| `logo-on-dark.svg` | Dark mode and the adult chapters: the black-background version without its square, so the dark outline doesn't vanish |
| `logo-white-bg.svg`, `logo-black-bg.svg` | Square versions for places that need a solid background |
| `social-preview.png` | GitHub's social preview, 1280 x 640, uploaded by hand in the repo's Settings |

- **In the app:** `Logo` (`src/components/logo.tsx`) shows `logo.svg`, and `logo-on-dark.svg` under the `dark:` variant (`.dark` or `[data-audience="adult"]`). It is used on the splash and the learning path. The Equal Lens's eQ mark stays in `public/brand/logo/` for the organisation's own branding.
- **App icons:** `scripts/gen-icons.sh` builds them all from the logo. It rasterises with headless Chrome, because ImageMagick's own SVG reader ignores the `rotate()` transforms the logo uses (the 2026-10-04 logo update scattered the cards that way), then sizes the results with ImageMagick. That covers `icon-192.png` and `icon-512.png` (transparent), `icon-maskable-512.png` (the logo at 72% on white, so Android's mask never clips it), `apple-icon.png` (opaque, 180 px) and `src/app/favicon.ico` (16, 32 and 48 px). Rerun it whenever the logo changes.

