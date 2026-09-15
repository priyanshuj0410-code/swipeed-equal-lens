---
type: reference
owner: the-equal-lens
title: SwipeEd design audit, 2026-09-14
description: Measurements behind the design system doc, covering dash counts, colours outside the token set, WCAG contrast results, Lazyweb comparisons and a file:line index of every divergence.
tags: [swipeed, design-system, accessibility, audit]
timestamp: 2026-09-14T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# SwipeEd design audit, 2026-09-14

Supporting data for the [design system](../design.md). Everything here was measured against revision
`e4953e2` of this repo on 2026-09-14. Repro
commands are given so a future pass can re-run them after a content or token change.

## 1. Em dash / en dash counts

Lines containing an em or en dash:

```
grep -rnP '[\x{2013}\x{2014}]' src | wc -l
```

Result: **3,796 lines** across `src/`. Counting characters instead (`grep -rhoP` piped to `wc -l`) gives **5,113** em or en dashes, 4,260 of them in `src/content/games/` (3,072 lines).

That number includes code comments (the codebase's own internal documentation style leans on em
dashes heavily, for example `src/app/globals.css:4` reads `"The Equal Lens brand design system (...)
[em dash] canonical palette + UI-kit classes"` in the source) as well as actual user-facing copy. Two
narrower cuts, to separate the two:

```
grep -rnP '"[^"]*[\x{2013}\x{2014}][^"]*"' src/content src/components | wc -l   # => 2707
grep -rnP '[\x{2013}\x{2014}]' src/content | wc -l                              # => 3356
```

`src/content` alone (79 game-content files under `src/content/games/`, the actual scenario copy:
hooks, myths, "why," "relearn" lines) accounts for 3,356 of the 3,796 lines, the large majority. This is the
real finding: the voice-rule violation is concentrated in shipped, user-facing game content, not
mostly in comments.

Concrete examples (file:line, all inside quoted string fields that render to the player). The source
uses an em dash at each point marked `[em dash]` below; that marker is a substitution made only in
this findings document so the document itself stays dash-free, the source file at that line and
column is the actual evidence:

- `src/content/games/be-the-safe-adult.ts:36`: `"why":"Panic, anger or blame, and shaming a child
  for the topic, both teach them to hide [em dash] the un-tellable reactions to catch."`
- `src/content/games/be-the-safe-adult.ts:43`: `"why":"Paranoia and assuming respectability equals
  safety go wrong [em dash] observing, respecting discomfort and an open door protect."`
- `src/content/games/be-the-safe-adult.ts:64`: `"why":"Covering it up and paying off the abuser
  leave a child in danger [em dash] the rest protect them."`
- `src/content/games/be-the-safe-adult.ts:117`: `"relearn":"Strong reactions to small confessions
  teach a child that honesty is dangerous [em dash] calm builds real honesty."`
- `src/content/games/be-the-safe-adult.ts:127`: `"affirm":"Reading silence as fear rather than
  betrayal keeps you gentle and open [em dash] exactly what helps a child come back."`

All five are from one file out of 79 with the same shape; the pattern repeats catalog-wide.

## 2. Non-token hex/rgb colours in `src/`

Command: `grep -rnoE '#[0-9a-fA-F]{6}\b' src | awk -F: '{print $3}' | sort | uniq -c | sort -rn`

Every value that traces back to a brand token (light or dark palette, violet ramp) is expected and
not listed again here. The values below do **not** trace to any brand or `--prx-*` token:

| Hex | Count | Source | Verdict |
|---|---|---|---|
| `#7C3AED` | 17 | `src/content/path.ts`, thread E ("Gender & Respect") | Deliberate thread-identity system, documented in [world and art tokens](../games/world-art-tokens.md). Not a brand token; visually close to but distinct from brand violet, worth knowing when eyeballing a screenshot. |
| `#F59E0B` | 12 | `src/content/path.ts`, thread C ("Feelings & Life Skills") | Same system. |
| `#EC4899` | 11 | `src/content/path.ts`, thread D | Same system. |
| `#DC2626` | 10 | `src/content/path.ts`, thread B ("Safety, Consent & Boundaries") | Same system. |
| `#059669` | 10 | `src/content/path.ts`, thread F | Same system. |
| `#EAB308` | 9 | `src/content/path.ts`, capstone rows (`thread: "★"`) | Second "capstone gold," not what actually renders (`--color-sun` does). See design.md Tokens. |
| `#0EA5E9` | 6 | `src/content/path.ts`, thread A | Same system. |
| `#475569` | 6 | `src/content/path.ts`, thread G / shared E-G | Same system. |
| `#62b84b`, `#e05c52`, `#4f6ef7`, `#f5c518` | 1 each | `src/lib/confetti.ts:4` | Raw confetti particle palette, unrelated to any brand accent, predates the token unification. |
| `#7a5a3a`, `#b7b0a4`, `#cfc9bd`, `#f0a6c0` (x4) | 1,1,1,4 | `src/components/scenery.tsx` | 2D SVG roadside props for the "classic" fallback path, hardcoded, not tokenized. |
| `#7C5CFC`, `#62e08f`, `#ff9085`, `#eaf6ff`, `#dbeefb`, `#b3c8ff`, `#fff3da`, `#ff6b4a`, `#dcefff`, `#cfe6f7`, `#8fc06a`, `#79bdf7`, `#59c387`, `#3da679` | 2-6 each | Scattered per-game decorative accents (mode tiles, mood colours) across `src/content/games/*` and matching game components | Not individually traced file-by-file for this pass; flagged in [world and art tokens](../games/world-art-tokens.md) as "~40 files for full on-palette polish," effort rated low-each-many. |

Separately confirmed: `text-slate-900` (Tailwind's `#0F172A`, not a CSS custom property at all) is
used as CTA text on `bg-[var(--color-sun)]` seven times in one file:

```
grep -n 'text-slate-900' src/components/games/v2-engine.tsx
```
→ lines 274, 281, 552, 570, 712, 716, 724.

## 3. WCAG contrast measurements

Method: WCAG 2.1 relative-luminance/contrast formula, implemented from scratch (no library) in a
one-off script, values taken verbatim from
`node_modules/@equal-lens/brand/tokens.css` and `src/app/globals.css`. `oklch()` values
(`--prx-pos`/`--prx-neg`/`--prx-tell`/`--prx-uhoh`) are converted to linear sRGB via the standard
OKLab matrices (Björn Ottosson's published conversion) before computing luminance; hex values are
converted with the standard sRGB EOTF.

| Pair | Ratio | AA normal text (4.5) | AA large/UI (3.0) |
|---|---|---|---|
| ink `#221436` on paper `#FBF9FF` (light body text) | 16.45 | AAA | AAA |
| ink-dark `#F1ECFA` on paper-dark `#15101F` | 16.09 | AAA | AAA |
| ink `#221436` on surface `#FFFFFF` (light card text) | 17.19 | AAA | AAA |
| ink-dark `#F1ECFA` on surface-dark `#221A30` | 14.40 | AAA | AAA |
| **insight teal `#2DD4BF` on surface `#FFFFFF`** (UN label, light) | **1.86** | **FAIL** | **FAIL** |
| insight teal `#2DD4BF` on surface-dark `#221A30` (UN label, dark) | 8.96 | AAA | AAA |
| **grow coral `#FF7A5C` on surface `#FFFFFF`** (RE label, light) | **2.56** | **FAIL** | **FAIL** |
| grow coral `#FF7A5C` on surface-dark `#221A30` (RE label, dark) | 6.51 | AA | AAA |
| ink on sun `#FFC94D` (brand-documented CTA pairing) | 11.23 | AAA | AAA |
| slate-900 `#0F172A` on sun `#FFC94D` (actual v2-engine CTA) | 11.66 | AAA | AAA |
| white on brand violet `#553286` (`.btn--primary`) | 9.60 | AAA | AAA |
| brand violet `#553286` on paper `#FBF9FF` (eyebrow/tag text) | 9.19 | AAA | AAA |
| `--prx-on-fill` on `--prx-pos` light (correct fill) | 6.37 | AA | AAA |
| `--prx-on-fill` on `--prx-pos` dark | 8.52 | AAA | AAA |
| **`--prx-on-fill` on `--prx-neg` light** (incorrect fill) | **4.28** | **FAIL** (borderline) | AA |
| `--prx-on-fill` on `--prx-neg` dark | 5.90 | AA | AAA |
| `--prx-on-fill` on `--prx-tell` light | 6.31 | AA | AAA |
| `--prx-on-fill` on `--prx-uhoh` light | 4.81 | AA | AAA |
| ink at 70% opacity ("wrong" nudge text) on paper, light | 6.29 | AA | AAA |
| ink-dark at 70% opacity on paper-dark | 8.23 | AAA | AAA |

**Headline result:** the UN/RE speaker-label colours (`--color-insight`, `--color-grow` used as text)
fail WCAG AA in light mode by a wide margin, 1.86:1 and 2.56:1 against a 3.0:1 floor even for large
text. This affects `src/components/games/un-re.tsx:12` (UN) and `:15` (RE), rendered on every myth-bust
moment across the catalog. Dark/adult mode is unaffected because the surface itself is dark enough
there. This was not previously flagged anywhere in the code comments or the two `docs/*.md` files
read for this pass; it was found by this measurement, not carried over from an existing ticket.

Secondary result: the "incorrect" declared-valence fill's on-fill text (`--prx-on-fill` on
`--prx-neg`, light) sits at 4.28:1, just short of the 4.5:1 normal-text AA bar though it clears the
3.0:1 bar that applies to large or bold UI text (the actual usage, small bold pill/badge text, likely
qualifies as the latter, but it is close enough to be worth a deliberate check against the exact
rendered font size/weight rather than assuming it passes).

## 4. Lazyweb search references

Three searches run via `lazyweb_search` (search only, no `lazyweb_generate_report` call made, per
the task instruction and the Lazyweb server's own guidance not to start a report unless the user
explicitly asks for one). Screenshot links are not reproduced here because Lazyweb returns them as signed, expiring URLs;
re-run the same queries to see the screens.

### "gamified learning path map with nodes" (mobile, coverage: strong, top similarity 0.667)

- **Mimo**, similarity 0.667: path screen with locked/unlocked nodes, a large play button on the
  current node, header stats (lives, coins, streak).
- **Duolingo (quests flow)**, similarity 0.598: segmented progress bar over a list of lesson
  challenges.
- **Sololearn**, similarity 0.357: course dashboard, XP/currency counters, scrollable lesson list
  with completion and lock state, large "Learn" CTA.

Comparison: SwipeEd's node states (locked, playable, completed, capstone) match this category's
standard vocabulary; SwipeEd's departure is rendering the map in a 3D scene with camera travel rather
than the flat vertical/branching map every reference above uses.

### "swipe card quiz answer feedback" (mobile, coverage: moderate, top similarity 0.506)

- **Sololearn**, similarity 0.506: quiz screen with a dedicated incorrect-answer modal that explains
  the mistake, includes thumbs up/down "was this helpful," and a primary Continue button.
- **Lime** (scooter/bike safety quiz), similarity 0.485: photo-based judgment quiz, large Yes/No
  buttons, progress indicator.
- **Duolingo**, similarity 0.469: picture-match vocabulary quiz, submit button disabled until a
  choice is made.

Comparison: the category norm (at least among these three) is a dedicated wrong-answer explanation
surface. SwipeEd deliberately does not have one, an inline spoken nudge on the same card instead, per
the "no-fail, always" principle in [interaction model](../games/swipeed-interaction-model.md). Recorded as a considered
divergence, not a gap, in [design.md](../design.md).

### "lesson complete celebration screen" (mobile, coverage: strong, top similarity 0.728, the
highest similarity of all three searches)

- **Duolingo**, similarity 0.728 (highest match across all three queries): "Lesson complete!" with a
  large mascot illustration and confetti.
- **Falou**, similarity 0.668: completion screen with accuracy/streak performance metrics and a
  Continue button.
- **Boldvoice**, similarity 0.666: completion with a speech score and Continue.
- **Capwords**, similarity 0.659: streak plus mastery stats, calendar view, "Review Again" CTA.

Comparison: SwipeEd's `GameDone` (celebratory emoji, confetti, 0 to 3 star rating, coin reward, one
primary "Back to the path" action) is a close, uncontroversial match to this category's shared
pattern, the strongest alignment found across all three searches.

## 5. Divergence list (file:line index)

Cross-reference only, full explanation of each is in [design.md](../design.md), "Divergences and debt":

1. Two component systems: `src/components/ui/*.tsx` (generic shadcn) vs. hand-rolled sticker chrome
   in `game-shell.tsx` / `game-done.tsx` / `v2-engine.tsx`.
2. `.glass-card` radius 20px (`src/app/globals.css:251`) vs. brand `.card` 24px
   (`@equal-lens/brand/components.css:110`).
3. Re-implemented (not imported) brand utility classes, `src/app/globals.css:317-336` vs.
   `@equal-lens/brand/utilities.css`.
4. CTA text `text-slate-900` (`v2-engine.tsx:274,281,552,570,712,716,724`) instead of
   `var(--color-ink)` on `--color-sun`.
5. Typography: Baloo 2 on all headings app-wide (`globals.css:16-18,235-237`), against the canon's
   "Lensy only, never a heading" (decision needed).
6. Second, inert "capstone gold" `#EAB308` (`src/content/path.ts:34` and siblings) vs. the token
   that actually renders, `--color-sun`.
7. Un-migrated raw hex: `src/lib/confetti.ts:4`, `src/components/scenery.tsx`.
8. Two independent path visual languages: 3D canvas-skin (`path-scene.tsx`) vs. 2D SVG classic
   fallback (`learning-path.tsx`).
9. UN/RE label contrast failure in light mode, `un-re.tsx:12,15` (see section 3 above; [SWED-63](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/198fdeb2-d7c8-4462-bdf3-5636484e3587)).
10. Voice rule (no em/en dash) violated at scale in `src/content/games/*.ts` (see section 1 above).

## Not independently verified

- The exact rendered font size/weight of `--prx-neg` fill text at every call site (needed to confirm
  whether the 4.28:1 result actually clears the large-text AA bar everywhere it is used, or only at
  most call sites).
- The ~40-file "per-game accent hex" list in the third table row of section 2 was not traced
  file-by-file; the count and general location come from [world and art tokens](../games/world-art-tokens.md)'s own effort
  inventory plus this pass's own `grep -rnoE` frequency count, not a fresh line-by-line audit of all
  ~40 files.
- SWED-56 (match soft-lock) was confirmed by reading the code (see the
  [v2 engine](../architecture/v2-engine.md#known-issues) doc), not by reproducing it in a running build.
- Whether `docs/world-canvas.md`'s node-sticker spec (section quoted in [design.md](../design.md), "The path
  world") is fully implemented as written in the currently-shipped `path-scene.tsx`, versus still
  partial per that doc's own "v1 built (behind flag)" status note in `docs/brand-alignment.md`'s
  phase table, was not re-verified beyond the grep evidence already cited.
