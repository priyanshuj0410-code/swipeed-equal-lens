---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/norm-storm.md
title: Norm Storm
description: A sort-and-reason game for ages 9-12. Sort the "that's just how it's done" rules onto Help / Harm / Depends (the reason matters most), celebrate the traditions worth keeping, play Rights Cards on harmful norms (UN & RE), see norms that changed, and reflect in My Voice. No-fail; the most sensitive norms are School-Comfort-gated.
resource: https://swipeed.vercel.app/game/norm-storm
tags: [games, swipeed, gender-equality, social-norms, ages-9-12, sort-reason]
timestamp: 2026-06-20T16:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Norm Storm

> **Reworked to GDD 18 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The social-norms node is a **512-scenario typed library**
> (`content/games/norm-storm.ts`: what-is-a-norm 85 · helpful-norms 82 · harmful-norms 95 · where-from 82 ·
> good-norm-test 79 · question-change 89), generated **faithfully** from the scorecard-passed GDD JSON, on the
> **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is one of **seven typed play actions**
> (sort ×115 · strike-rewrite ×81 · branch ×72 · reflect ×71 · role-play ×67 · spot ×52 · match ×54; no build),
> **0% binary tap**, led by the **help/harm sorting board** (sort: the signature) + the strike-and-rewrite flip
> carried from Flip the Script. Norm-literacy across the understand → sort → test → change arc: a norm is an
> unwritten rule made by people (not nature) and changeable; sort norms that help everyone (kindness, consent,
> hygiene) from those that harm by limiting/ranking a group (gendered limits, period stigma, son-preference,
> dowry, untouchability); where norms come from; **the good-norm test** (respects everyone? hurts no one? fair
> both ways? It's **the reusable lens [Speak Up](speak-up.md) g19 inherits**); and questioning & changing harmful
> ones respectfully. Ethics: **question with respect** (love culture & elders AND ask "is this fair, na?");
> **keep the good** (not "all rules are bad", sort them); heavy topics handled lightly (never graphic);
> **change feels possible** ("start small, one voice can begin it"; India's own changed norms ground it;
> `reassure` + `reassureCats` ["question-change"]). Engine: **no new mechanic** (reuses 7 of 9); a `binStyle`
> valence accretion (harms/disrespect/fails/ranks-a-group-higher → red, caring-reason/real-change/passes/
> treats-all-equally → green), while norm/fact, written/unwritten, law/norm and limits-girls/boys stay **neutral
> distinctions**. Generator injects spot scene-item ids (g18's library omitted them). `gameId "norm-storm"`
> (matches the registry id). Builds on [Flip the Script](flip-the-script.md) (g17); prereq g17. The sections
> below describe the original v1 build, superseded by the v2 mechanic engine.

**Node #18: the Gender & Respect step that meets culture head-on** (ages 9-12), and **the most
culturally-sensitive game so far**. A storm of *"that's just how it's done"* rules swirls around the
child; with Lensy (and UN & RE) they **sort them out, keeping the traditions that help, questioning the
ones that harm.** It grows the thread's logic one careful step:
[What Makes Me, Me](what-makes-me-me.md) (#7) taught that gender rules are *learned*;
[Flip the Script](flip-the-script.md) (#17) flipped them in *media*; Norm Storm asks the child to weigh
the **real social rules** around them, with respect, reason and rights. The message is **never "your
culture is bad"**; it is *"keep the good, question the harmful, and questioning is itself part of a
living, growing culture."*

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `norm-storm`, route `/game/norm-storm`.
- **Type:** reading-light **sort-and-reason** game (Help / Harm / Depends) · no fail · the *reason* matters as much as the bin.
- **Age band:** 9-12 · **Curriculum:** UNESCO 3.2 (gender stereotypes), 2.3 (values, rights, culture). Builds on #7 and #17.
- **Status:** live · https://swipeed.vercel.app/game/norm-storm

## How it works: five modes + the Badge Book
1. **Sort the Norm**: a norm swirls in; the child drops it onto **Help / Depends / Harm** and hears the
   reason. *Help:* respect/care for elders. *Harm:* son-preference, "girls can't study far", "boys don't
   do housework". *Depends:* festival dress-up (context). **Dowry** is included **only when School-Comfort
   is off** (with facilitator support). The three-way board teaches nuance; there's no single right answer
   for *Depends*.
2. **Keep the Good**: wholeheartedly **celebrates** the traditions worth keeping (elders, festivals,
   hospitality, community, kindness). *This mode is what makes the whole game safe and honest*: keeping
   the good in clear view lets a child examine the harmful without feeling their family is under attack.
3. **Rights Trump Harm**: the **UN & RE** beat: play a **Rights Card** (every child's right to school, to
   be safe, to be treated equally, to play, to have a say) on *"it's always been done this way, so it must
   be right"*; UN erases the "it's tradition so it's fair" part, RE redraws *"norms are made by people;
   some help, some harm, and the harmful ones can change."*
4. **Norms Change**: bright proof harmful norms already changed (girls go to school now; women vote,
   work and lead).
5. **My Voice**: the child names **one tradition to keep** and **one to respectfully question**, the
   reflection that turns the sorting into their own reasoned stance.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** + the
shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)), **India framing +
School-Comfort (#14)** (Beti Bachao framing; dowry/seclusion gated + facilitator notes; **Keep the Good**
celebrates culture so the critique never reads as an attack), and **don't-villainise (#15)** applied to
*culture itself*: keep the good, question the harmful.

## Status & roadmap
- **Built:** Sort the Norm (Help/Depends/Harm with reasons + School-Comfort-gated dowry card), Keep the
  Good, Rights Trump Harm (Rights Cards + UN & RE), Norms Change, My Voice; the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a draggable storm-to-bin interaction, a fuller norm deck, crown levels
  (subtler norms), facilitator/Classroom-Mode guides, calm mode, and **Hindi**.
