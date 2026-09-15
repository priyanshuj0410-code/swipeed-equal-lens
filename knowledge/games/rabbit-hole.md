---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/rabbit-hole.md
title: The Rabbit Hole
description: "SwipeEd node #g43 (ages 12-15), the game about online misogyny and the 'manosphere'. With teen Lensy, a teenager learns how the radicalisation funnel works, who profits from it (the grift), busts its claims (UN & RE), and (above all) what real strength / positive masculinity looks like. Non-shaming, media-literacy-led, never platforms real content; routes the underlying loneliness to help."
resource: https://swipeed.vercel.app/game/rabbit-hole
tags: [games, swipeed, ages-12-15, gender, media-literacy, online-misogyny, manosphere, positive-masculinity, sam, un-re]
timestamp: 2026-06-21T16:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# The Rabbit Hole

> **Reworked to GDD 43 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The online-misogyny / manosphere node (Thread E/G · Gender & Media, ages 12-15) is now
> a **519-scenario typed library** (`content/games/rabbit-hole.ts`: the-funnel 92 · follow-the-money 80 ·
> spot-the-hook 87 · real-strong 82 · have-each-others-backs 94 · the-need-underneath 84), generated
> **faithfully** from the scorecard-passed GDD 43 JSON, on the **shared v2 engine**
> (`components/games/v2-engine.tsx`). **Seven typed play actions** (branch ×88 · reflect ×82 · strike-rewrite
> ×89 · spot ×82 · sort ×69 · role-play ×59 · match ×50), **0% binary tap**, led by strike-rewrite (bust the
> claim), spot (catch the hook) and branch. Arc: the funnel → follow the money → spot the hook → Real Strong →
> have each other's backs → the need underneath. **THE ONE RULE: never shame the boy**. The **funnel** and the
> **grift** are the target, never the kid; boys pulled in are usually lonely, anxious and seeking identity, and
> grifters + algorithms exploit that. Media-literacy-led, **evenhanded** (the manosphere harms boys too), and
> centred on **positive masculinity** (real strength lifts people and never needs anyone small; strong AND kind;
> confidence is built, not bought; you're already enough AND can grow). **Never platforms real influencers.**
> Routes the loneliness underneath to help: a trusted adult, **Tele-MANAS 14416**; harassment →
> cybercrime.gov.in / 1930, Childline 1098 (`reassureCats` ["the-need-underneath"] + `reassure` + helpLine).
> **gameId trap:** library/GDD aspirational id is `the-rabbit-hole` but the engine-host registry id is
> `rabbit-hole`: config uses `rabbit-hole`. Engine: **no new mechanic**; `binStyle` gained `grift`→red +
> `real strength`/`genuine`→green. Spot scene-item ids injected (12). Builds on [MythBuster](mythbuster-gender.md)
> (g25) & [Equalize](equalize.md) (g26). The sections below describe the original v1 build, superseded by the v2
> mechanic engine.

**Node #g43 of the SwipeEd path** (ages 12-15, **dual Threads E + G** · Gender & Respect + Values/Media),
inserted in **Chapter 4 between [Firewall](firewall.md) (#g40) and [Reality Check](reality-check.md)
(#g28)**. It is the game about **online misogyny and the "manosphere"**, the newest core content area in
the field (the UK's 2025 statutory RSHE guidance made it explicit) and where many boys now form their
ideas about masculinity, women and relationships. Guided by **Lensy** (teen, level-headed, never lecturing),
a teenager learns **how the radicalisation funnel works**, **who profits from it**, how to **see through
its claims**, and (above all) **what real strength and healthy masculinity actually look like.** It is
the manosphere beat the developer hand-off had parked; now built.

> **The one rule that makes or breaks it:** it is **never "boys/men are the problem."** The boys drawn in
> are usually lonely, anxious and looking for identity and belonging; grifters and algorithms exploit
> exactly that. So the game is **non-shaming**, compassionate to the need underneath, **media-literacy-led**
> (it teaches the funnel and the grift, not just "misogyny is bad"), and centred on a **better answer:
> positive masculinity.** It is for everyone: boys, so they're not pulled in; girls and friends, to resist
> it and support someone slipping.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path that launches in place (engine id `rabbit-hole`, route `/game/rabbit-hole`).
- **Type:** teen media-literacy + gender scenario game · **funnel-reveal + tap-list + UN & RE** engine (no fail, no timer; **never platforms real influencers or content**, synthetic examples only).
- **Age band:** 12-15 (self-directed; written so boys feel **seen, not blamed**). **Curriculum:** UNESCO 3.2 (gender bias/misogyny) + 3.1 (masculinity norms) + 5.4 (media) + 5.1 (peer/norms) + 1.3 (respect); UK RSHE 2025 (misogyny/manosphere).
- **Prereq:** [Firewall](firewall.md) (#g40). **Builds on:** [MythBuster: Gender](mythbuster-gender.md) (#g25). **Pairs with:** [Equalize](equalize.md) (#g26), [Reality Check](reality-check.md) (#g28), [Decoded](decoded.md) (#g36); uses the call-in of [Lead the Way](lead-the-way.md) (#g33); leans on [Mind Matters](mind-matters.md)/[Bounce](bounce.md) for the needs underneath.
- **Status:** live · https://swipeed.vercel.app/game/rabbit-hole · **gated** node.

## How it works: five no-fail modes
1. **The Funnel**: a step-by-step reveal of how the algorithm escalates **relatable bait** ("get fit", "do better with girls", "be a man") into **misogyny and us-vs-them**, and why it targets lonely/unsure boys. The disarming payoff: **it's a designed funnel, not your failing.**
2. **Follow the Money**: the grift: **you're the product.** Gurus monetise insecurity (courses, subs, rage-bait); the one telling you you're "not enough" is selling the cure. *(The bluntest line is **School-Comfort-gated**.)*
3. **Spot the Hook** *(the UN & RE beat)*: **unlearn** the claims ("you're not a real man unless…", blame women/feminism, "alpha/high-value male" pseudo-science, "us vs them", "this mentor will fix you") and **relearn** the truth, **without ever shaming** a teen for having found them convincing.
4. **Real Strong** *(the heart)*: **positive masculinity**: strong AND kind, ambitious AND respectful, improve yourself without belittling anyone, real friends/purpose: *real strength lifts people; it never needs anyone else to be small. You're already enough.*
5. **Have Each Other's Backs**: support a friend with the **call-in** (not call-out) approach (stay connected, be the belonging the funnel offered); for everyone, resist online misogyny; and **help for the loneliness underneath** (a Help-Map [tool moment](life-skills-toolkit.md) + Tele-MANAS 14416).

A **5-badge book** (💪 per mode) fills as each mode completes; the fifth finishes the node via `GameDone`
(`gameId="rabbit-hole"`, 3★ / 30 coins). **Lensy** (teen) hosts; voice via `speak.ts`; the claim-busting
reuses the shared **[UN & RE](swipeed-core-principle.md)** duo.

## Safeguarding (read first, GDD §18)
- **Never shames boys**: the funnel and the grift are the targets, never the boy; the unmet needs (belonging, identity, purpose) are met with compassion. **No "boys/men are bad," ever.**
- **Never platforms the content**: no real influencers, names or actual misogynist material; synthetic/clearly-fictional examples only. Teaches recognition without spreading or amplifying.
- **Evenhanded; no new us-vs-them**: it dismantles us-vs-them rather than flipping it.
- **Addresses the root, routes to help**: treats the loneliness/insecurity it exploits with care and signposts real support (Tele-MANAS 14416 · a trusted adult; online harassment → cybercrime 1930 · Childline 1098). Protects those targeted (girls/anyone).
- **School-Comfort-gated & expert-reviewed** (gender, online-radicalisation and adolescent specialists). The triaged anonymous **Ask-It** is GDD Phase 2 (deferred).

## Inherited & established patterns
Inherits the [reusable patterns](swipeed-game-patterns.md) (5-mode grid on `GameShell`, Lensy header + badge
row, **UN & RE on the key unlearn**, School-Comfort `BASE`/`OPEN` gating like Firewall, a Help-Map tool
moment). It **establishes pattern #22, the de-radicalisation register: never shame, follow the funnel &
the money, never platform, offer a better answer.** First **dual-thread node (E/G)**, handled by widening
the path `ThreadKey` union and the gender-tag logic in `gen-path.py`.

## Status & roadmap
- **Built:** all five modes (The Funnel · Follow the Money · Spot the Hook UN & RE · Real Strong · Have
  Each Other's Backs), the 5-badge book, Lensy (teen) + voice, School-Comfort gating, a Help-Map tool moment,
  helpline signposting, English narration.
- **Deferred (GDD Phase 2/3):** the triaged anonymous **Ask-It**, crown levels, a richer (kept-current)
  funnel/claim bank, a calm mode, Classroom anti-misogyny tools, and **Hindi** (with the app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [MythBuster: Gender (#g25)](mythbuster-gender.md) · [Equalize (#g26)](equalize.md) · [Firewall (#g40)](firewall.md) · [Reality Check (#g28)](reality-check.md) · [Decoded (#g36)](decoded.md) · [Lead the Way (#g33)](lead-the-way.md) · [Core principle: Unlearn → Relearn → Grow](swipeed-core-principle.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
