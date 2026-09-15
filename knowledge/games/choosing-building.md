---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/choosing-building.md
title: Choosing & Building
description: Choosing a life partner and building a relationship for ages 22 → first child, covering values over sparks, what it actually takes (communication, trust, repair), eyes-open commitment, love and arranged marriage as two paths to the same skills, and starting a partnership equal from day one. Every path respected, including not marrying; consent always; forced/coerced marriage routed to help.
resource: https://swipeed.vercel.app/game/choosing-building
tags: [games, swipeed, relationships, marriage, consent, ages-22-plus, adult-journey, chapter-7]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543  # SWED-70
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62  # SWED-68
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4  # SWED-69
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007  # SWED-71
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a72838c-0fcd-4100-bf57-7d6885f65d2d  # SWED-75
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc  # SWED-97
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Choosing & Building

> **Built to GDD 53 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The opener of Chapter 7 (Building a Life, 22 → first child) and the first genuinely-new node built after the
> Ch.1-6 retrofit**, authored v2-native (no v1 to supersede), on the shared
> [v2 mechanic engine](swipeed-game-patterns.md), same standard as the rest of the path. A **498-scenario typed
> library** (`content/games/choosing-building.ts`: choosing-well 76 · what-it-takes 86 · love-and-arranged 78 ·
> commitment-clearly 91 · starting-strong 85 · tools-and-help 82), with eight play actions (branch ×90 ·
> strike-rewrite ×79 · sort ×70 · match ×69 · role-play ×62 · spot ×61 · choose ×48 · reflect ×19, since the
> 2026-09-15 pilot below), **0% binary**, led by branch
> (your move) + strike-rewrite (bust the myth) + sort (sort the signal). **Turns the story from "me" to "us":**
> choosing a partner on **values, not sparks**; what a relationship actually takes (communication, trust, repair) to
> build *us* without erasing *me*; **eyes-open commitment** (a choice, not pressure or a fix; busts *"marriage
> will fix me / complete me / settle me down"*); **love and arranged marriage as two paths to the same skills**,
> consent always, family respected but the **couple's own judgement leads**; and **starting a partnership equal
> from day one** (names, money, chores, in-laws, careers, which set the pattern early). **Every path is respected,
> including choosing not to marry or to wait.** Even-handed across genders; **forced or coerced marriage is never
> reframed as choice**, routed to help (`reassureCats` [commitment-clearly · love-and-arranged] + `reassure` +
> `helpLine` → **181, 1091, 112**, and **Childline 1098** for under-18 / forced-marriage situations). India:
> the timeline pressure ("*log kya kahenge*", the marriage clock), in-laws and joint-family reality, arranged
> introductions and family WhatsApp groups, grounded without judging the tradition. **gameId:** library, GDD and
> engine-host registry all agree on **`choosing-building`** (no trap). Engine: **no new mechanic and no `binStyle`
> change**. Its good/bad bins are already covered, and its judgement-pair bins (e.g. *green flag / worth a talk*)
> are correctly left neutral. Spot ids injected (7). New-node wiring: `g53 → choosing-building` added to the
> gen-path `GAME` dict + `EMOJI` 💍, `path.ts` regenerated (59 built/playable), registered in `engine-host`.
> Read-first attested. **Builds on** [Real Relationships](real-relationships.md) (g46: repair, the Four
> Horsemen) and [Mutual](mutual.md) (g31: consent); **sets up** Equal Partners (g55) and The Family Map (g57).

**Node #g53: the Chapter 7 opener (Building a Life, ages 22 → first child).** *Choose with your eyes open, and
build something equal from day one.* The first step of the adult **partnership** arc: after the self-standing
adult of Chapter 6 ([Standing on My Own](capstones.md)) learns to live independently, Chapter 7 asks the harder
question: **how do two whole people choose each other and build a shared life without either disappearing into
it?** Lensy returns as a grown peer who has been through the choosing. **A relationship is something you build, not
something that fixes you; commitment is a clear-eyed choice between equals; and whether the introduction comes
from an app, a friend, or your family, the skills (and the consent) are the same.**

> **Reflect conversation ([SWED-97](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc), 2026-09-15).** 16 of the 19 reflects carry their own `ask` and `deeper` ("What makes that one feel hard to start?", "What is one small way you could open it?"). The other 3 (cb-1037, cb-1118, cb-1123) are in the reassurance categories, so they stay tap-only.

## What it embodies

- **Choosing well (17)**: values, character and how someone treats people over chemistry and checklists; sort
  green flags from "worth a real talk"; the *"opposites/sparks will sort themselves out"* myth.
- **What it takes (15)**: communication, trust, and **repair after conflict** (the [Four Horsemen](real-relationships.md)
  carried forward); building *us* without erasing *me*; interdependence, not dependence.
- **Commitment, clearly (13)**: commitment as a chosen, eyes-open *yes*, never a fix or a rescue; busts
  *"marriage will fix me / complete me / settle me down"* and the sunk-cost *"we've come this far"*.
- **Love & arranged (15)**: both paths treated as legitimate routes to the same skills; **consent always**,
  the right to say no respected, family honoured but the **couple's judgement leads**; forced ≠ arranged.
- **Starting strong (12)**: set the pattern on day one: names, money, chores, in-laws, two careers. Equality
  is built early or fought for later.
- **Tools & help (12)**: the conversations to have *before* committing, and where to turn when a "match"
  becomes pressure (181 / 1091 / 112; Childline 1098).

**Myth cards (2026-09-15, [SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543)).** The first game with `mythCards` on, as the pilot for the
[playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md): about half of its 79 strike-rewrite
beats play as a swipe card (Myth or True) instead of a scrub. Two truths that only made sense after their myth were
reworded to stand alone: cb-032 ("Love and arranged marriages need the same foundations...") and cb-041 ("Early
talks about money, roles and expectations are how you start strong...").

**Playtest pilot content (2026-09-15; [SWED-69](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4), [SWED-71](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007), [SWED-68](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62)).** The first game cleaned under
the playtest feedback plan, through the forge: a classification file, four batches checked by `forge_check.py --batch`,
and one assembly of 138 reshapes.

- **Reflects.** 48 lesson and values reflects became `choose` questions: six options, two to four fit (14 have two, 20
  three, 14 four), and every option has a note. 19 stay reflect, where no answer is wrong: 12 personal picks (cb-084,
  cb-1226 to cb-1233, cb-1314, cb-1319, cb-1321), 5 safety lines (cb-1037, cb-1118, cb-1315, cb-1316, cb-1318) and
  2 identity affirmations (cb-950, cb-1123). The safety and identity reflects got real options in place of "Yes"
  and echoes of the hook.
- **Voice.** Narrator prefixes came off 66 reflects and 9 role-plays, speaker-name prefixes off 6 hooks (cb-919,
  cb-924, cb-933, cb-941, cb-950, cb-958), 51 dashes were replaced, and every reflect and choose asks one question.
- **Giveaways.** 10 matches and 7 sorts were reworded so no pair or item shares a word with its answer. cb-1270
  and cb-1277 were rewritten because several of their pairings were equally defensible, and the blind review found
  11 more whose answers were near-synonyms ("A red flag", "A serious warning", "Worth heeding"): cb-050,
  cb-069, cb-1064, cb-1065, cb-1066, cb-1237, cb-1263, cb-1265, cb-1275, cb-1276 and cb-1279 now pair each left
  with one answer that only it fits. One sort item that read both ways (cb-1366) was reworded.
- **Review ([SWED-75](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a72838c-0fcd-4100-bf57-7d6885f65d2d)).** Three writer agents drafted the choose questions from a brief with an angle per id,
  and every line was edited by hand. An independent reviewer solved the 48 blind with `blind_review.py`: 47 matched
  the key, and the one that did not (cb-1041) was rewritten. Its safety and voice checklist found 6 problems, all
  fixed. A second reviewer solved all 69 matches and 70 sorts blind: every sort agreed with its key, and 11 matches did not because their answers were near-synonyms, so those were rewritten. A second blind round on the 11 rewrites and the 8 choose questions edited after review agreed with every key.
- The game is on `scripts/forge/lint_clean.json`, so the content gate holds it at zero lint findings.

**Safeguarding.** The game celebrates marriage as one good choice among several and **never pressures toward
it**. Staying single, waiting, or leaving a bad match are all framed as strong, valid choices. The bright line:
**any version of "you have no choice" is coercion, not tradition**. Those scenarios reassure the player and route
to help, and forced/under-age marriage is sent to Childline 1098.
