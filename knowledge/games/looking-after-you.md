---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/looking-after-you.md
title: Looking After You
description: Parental wellbeing and mental health for new parents, covering burnout, your own needs, and the life-skills toolkit under load. You can't pour from an empty cup. Self-care is part of childcare, not selfish; struggling is not failing. Tells the passing baby blues from postpartum depression/anxiety (in mothers and fathers); frightening intrusive thoughts are a symptom and a cue to get help, never a verdict. High-care, non-shaming; healthy coping only, explicitly not therapy; routes to professional help.
resource: https://swipeed.vercel.app/game/looking-after-you
tags: [games, swipeed, parenthood, mental-health, postpartum-depression, burnout, self-care, chapter-8, safeguarding]
timestamp: 2026-06-24T03:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/495e4449-492b-44bc-9f8f-ef896a79e330  # SWED-102
---

# Looking After You

> **Built to GDD 63 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The third Chapter-8 node: the parent's-own-wellbeing node and a high-care one** (the node
> [Us, After Kids](us-after-kids.md) g61 and [Equal Parents](equal-parents.md) g62 route parental burnout to):
> *you can't pour from an empty cup.* A **397-scenario typed library** (`content/games/looking-after-you.ts`:
> empty-cup 41 · your-needs-count 72 · baby-blues-and-beyond 77 · reach-out 72 · healthy-coping 67 · tools-and-help
> 68), with seven play actions (strike-rewrite ×81 · branch ×61 · reflect ×55 · sort ×52 · role-play ×54 · match ×49 ·
> spot ×45), **0% binary**, led by strike-rewrite (bust the myth) + branch (your move) + reflect. Six modes: **the
> empty cup** (spot burnout; busts *"good parents sacrifice everything"*: self-care is part of childcare, not
> selfish; **struggling is not failing**); **your needs count** (protect your needs, identity and a little time of
> your own without guilt; you're still a whole person); **baby blues and beyond** (normalise the common, passing
> baby blues *and* recognise **postpartum depression & anxiety: in yourself, a partner, and in fathers too**;
> frightening intrusive thoughts treated as a **symptom and a cue to get help, never a verdict**); **reach out**
> (help-seeking is strength, not weakness; build a support net; you needn't be in crisis to deserve help);
> **healthy coping** (safe strategies under load: rest, breathe, move, connect, accept help; unhealthy coping
> gently swapped out; **never any pain/discomfort technique**); **tools & help** (a breathing space, a help-finder
> and crisis routing). **High-care and non-shaming: any sign of postnatal depression/anxiety, or any crisis, is met
> with warmth and an immediate route to help (concern + resources); healthy coping only and explicitly *not*
> therapy: always signposting professional care; includes fathers and addresses joint-family pressure & stigma**
> (`reassureCats` [empty-cup · baby-blues-and-beyond · reach-out] + `reassure` + `helpLine` → **Tele-MANAS 14416,
> a doctor, and emergency 112**). **gameId:** library, GDD and engine-host registry all agree
> on **`looking-after-you`** (no trap). Engine: **no new mechanic and no `binStyle` change**. Verbatim-engine
> emulation over all 12 sort pairs found no mis-colours (*Healthy* / *Healthy coping*, *Quietly harmful* /
> *Harmful*, *Helps long-term* coloured by existing tokens; the rest neutral). Spot ids injected (8); one spot
> (ly-031) carries multiple valid `trick:true` items. New-node wiring: `g63 → looking-after-you` in the gen-path
> `GAME` dict (+ 🌿 emoji), `path.ts` regenerated (70 built/playable), registered in `engine-host`. Read-first
> attested. **Builds on** [Mind & Belonging](mind-belonging.md) (g49) and [Bounce](bounce.md) (g39): the
> mental-health spine, now for the parent; **protects the parent so they can do everything else in Chapter 8.**

**Node #g63: Chapter 8, Parenthood (first child on).** *You can't pour from an empty cup: looking after yourself
is part of looking after your child.* The **adult, postnatal step of the mental-health spine**:
[Bounce](bounce.md) (#g39) taught resilience, [Mind & Belonging](mind-belonging.md) (#g49) taught college mental
health and help-seeking: now the new parent, pouring everything into a baby, has to be reminded that their own
cup matters. Lensy returns as a warm, steady peer. **The spine: self-care is part of childcare, not selfishness;
the passing baby blues are not postpartum depression, but PPD/anxiety is common, real and treatable; frightening
thoughts are a symptom, not a verdict; and reaching out is a strength, for mothers and fathers alike.**

> **Multi-step branches and role-plays ([SWED-102](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/495e4449-492b-44bc-9f8f-ef896a79e330), 2026-09-30).** All 61 branches and 54 role-plays are now 3 to 5 questions on one situation (69 with 3, 40 with 4, 6 with 5; 397 questions), each with 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of three independent reviews (a blind best-option pick, a transition-by-transition audit, and a safety and fidelity review against the single-step source): round 1 found 118 blocking problems across all 115 stories, round 4 found 3 in the 22 it re-checked, and the 10 stories the last fix touched were read in full before shipping. Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).

## What it embodies

- **The empty cup (14)**: spot burnout; busts *"good parents sacrifice everything"*; self-care is part of
  childcare, not selfish; **struggling is not failing**.
- **Your needs count (14)**: protect your needs, identity and a little time of your own without guilt; you're
  still a whole person.
- **Baby blues and beyond (14)**: normalise the common, passing baby blues; recognise **postpartum depression &
  anxiety** (in mothers *and* fathers); intrusive thoughts are a **symptom and a cue to get help, never a verdict**.
- **Reach out (14)**: help-seeking is strength, not weakness; build a support net; you needn't be in crisis to
  deserve help.
- **Healthy coping (14)**: rest, breathe, move, connect, accept help; unhealthy coping gently swapped out;
  **never a pain/discomfort technique**.
- **Tools & help (14)**: a breathing space, a help-finder, and crisis routing.

**Safeguarding (high-care).** Non-shaming throughout; any sign of postnatal depression/anxiety or crisis is met
with warmth and an **immediate route to help**: Tele-MANAS 14416, a doctor, emergency 112.
It offers **healthy coping only and is explicitly not therapy**, always signposting professional care; it includes
fathers and names joint-family pressure and stigma. India: **postpartum depression affects ~1 in 5 (≈22%) Indian
mothers**, nearly double the global average and badly under-recognised, and fathers can be affected too (~1 in 10).
