---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/safety-squad.md
title: Safety Squad
description: "SwipeEd node #8 (ages 6-9), the Safety & Consent thread on screens. Join Lensy's squad to spot unsafe (touch/online/bullying), make the safe move (Say No · Get Away · Tell), keep private things private, and know which secrets to always tell. Safeguarding-critical."
resource: https://swipeed.vercel.app/game/safety-squad
tags: [games, swipeed, ages-6-9, safety, consent, online-safety, safeguarding, un-re, sam]
timestamp: 2026-06-19T23:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Safety Squad

> **Reworked to GDD 08 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The personal-safety / child-protection game is a **479-scenario typed library**
> (`content/games/safety-squad.ts`: safe-unsafe-touch 84 · secrets-surprises 83 · trusted-adults 75 ·
> tricky-people 79 · lost-or-trouble 80 · online-safety 78), generated **byte-identical** from the
> scorecard-passed GDD JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is
> one of **nine typed play actions** (branch ×103 · reflect ×82 · strike-rewrite ×67 · role-play ×62 · sort ×54
> · spot ×63 · build ×48), **0% binary tap**, led by real safety **dilemmas** (branch), **"No, Go, Tell"**
> (role-play), and the **new signature `spot`-the-trick verb** (g08 added the **ninth** shared mechanic: tap
> the red flag / lure / online trick → a `why` reveal). Safeguarding contracts, all enforced: **empower never
> frighten**; always **"safe/unsafe" never "good/bad"** (good/bad appears only as the *myth being erased*);
> **never the child's fault**; **tricky-people** (watch behaviours) over **stranger-danger** (the stranger
> myth is erased: most harm is from known, trusted people); **no graphic anatomy** (private = swimsuit,
> deferred to [My Body, My Rules](my-body-my-rules.md)); **every unsafe drill ends on reassurance**
> ("never your fault, telling helps") + the **Childline 1098** Get-Help pill (engine's content-driven safety
> beat: `helpLine` + `reassure` + `reassureCats`, plus any branch with `outcome:"safe"`). A content
> safeguarding self-check passed all red-lines. `gameId "safety-squad"` kept. **The last of the nine
> "pre-protocol" retrofits: g01-g08 + g37 are now all v2** (the founder's Step-1 batch). Chapter 2 is *not*
> finished, though: **g09 Friend or Frenemy, g41 Heart Smart, g10 Fair Play World, g11 Not Fair Not Funny,
> g12 Smart Screen Heroes** (each has a v2 GDD + library) + capstone **c2** still need the v2 retrofit; the
> next node after g08 is **g09**. The sections below describe the original v1 build (spot-it / safe-move),
> superseded by the v2 mechanic engine.

**Node #8: the Safety & Consent thread's step into Chapter 2 and onto screens** (ages 6-9). Takes
everything [My Body, My Rules](my-body-my-rules.md) taught (*your body is yours, say no, tell a trusted
adult*) and extends it to a bigger, more online world. The child joins **Lensy's Safety Squad** to spot
unsafe situations, make the safe move, keep private information private, and know which secrets must
always be told. **Empowering, never frightening**; the **safeguarding-critical** care of node #2 applies.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `safety-squad`, route `/game/safety-squad`.
- **Type:** reading-light **spot-it & safe-move** safety game · no fail, no timer (gentle badges).
- **Age band:** 6-9 · **Curriculum:** UNESCO 4.1 (violence), 4.2 (consent/privacy), **4.3 (online safety)**, 3.3 (recognise & report), 5.5 (help); India: extends POCSO/NCERT into online safety, Childline 1098 / POCSO e-Box.
- **Status:** live · https://swipeed.vercel.app/game/safety-squad

## How it works: five missions + the Safety Squad Badge Book
1. **Spot the Unsafe**: calm, non-graphic scenarios across touch, bullying (incl. gender-based) and online; safe or unsafe?
2. **The Safe Move**: the one rule that works everywhere: **Say No · Get Away · Tell a Trusted Adult** (a three-step practice).
3. **Keep It Private**: sort info into the **private vault** (name, home, school, phone, photos, passwords) vs okay-to-share; an online stranger's request is a red flag.
4. **Good / Tell Secret**: sort secrets: a good surprise (keep) vs one that upsets you or "never tell" (always tell). **The UN & RE beat** (shared `UnReBeat`): UN erases *"you must always keep a secret"* (the belief abusers exploit), RE redraws *"a secret that upsets you should always be told. Telling is brave."*
5. **My Safety Squad**: build 3-5 **trusted grown-ups** (the additive builder reused from My Body, My Rules, with two mums/dads supported) + meet **Childline 1098**, and keep telling.

**Online safety** is the headline new content; the safe move + the Safety Net carry straight over.
Reuses **Lensy** (squad leader), the shared **`UnReBeat`**, and the voice model.

## Safeguarding (read first, see GDD §17)
Empowering never frightening; non-graphic cartoons that always resolve into telling; **"it's never your
fault"** repeated; grooming red-flags (secrecy + flattery online) framed gently as *"something to tell
about"*; persistent **Get Help**; **keep telling**. The caregiver guide carries the POCSO disclosure
protocol.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), **empower-never-frighten (#16)**, the inclusive trusted-adults builder (#17),
India + POCSO framing (#14), and the UN & RE move ([core principle](swipeed-core-principle.md)). Builds
on [My Body, My Rules](my-body-my-rules.md); sets up Boundary Bot (#15) → [Green Light / Red Light](green-light-red-light.md) → Mutual.

## Status & roadmap
- **Built:** all five missions, the Badge Book, the UN & RE secrets beat, the Safety Squad; English narration.
- **Deferred (GDD Phase 2/3):** the safe-move three-beat animation polish, a fuller scenario bank, the
  cyber-crime helpline, Classroom-Mode polish, the caregiver disclosure guide UI, daily streak, and **Hindi**.

## Related
- [SwipeEd (app)](swipeed.md) · [My Body, My Rules (#2)](my-body-my-rules.md) · [Core principle (UN & RE)](swipeed-core-principle.md) · [Reusable patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
