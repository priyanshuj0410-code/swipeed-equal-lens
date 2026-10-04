---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/real-relationships.md
title: Real Relationships
description: Building healthy adult relationships for ages 18-22, covering the daily markers of health, fighting fair & repair, spotting coercive control behind "they're just protective" (UN & RE), leaving safely, and surviving breakups. Even-handed; abuse-aware with strong routing.
resource: https://swipeed.vercel.app/game/real-relationships
tags: [games, swipeed, relationships, safeguarding, ages-18-22, adult-journey]
timestamp: 2026-06-22T12:10:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02455c6c-fb84-4cc8-a691-58156ea1a13d  # SWED-104
---

# Real Relationships

> **Reworked to GDD 46 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The relationship heart of College (Thread D · Relationships) **moved off the [ModesEngine](swipeed-game-patterns.md)
> onto the shared v2 mechanic engine**: a **503-scenario typed library** (`content/games/real-relationships.ts`:
> what-healthy-looks-like 84 · fight-right 84 · red-flags-grown-up 87 · leaving-safely 82 · breakups 13 ·
> tools-and-help 90) with seven play actions (branch ×101 · sort ×74 · strike-rewrite ×76 · reflect ×78 ·
> role-play ×61 · spot ×57 · match ×56), **0% binary**, led by branch + sort + strike-rewrite. **Good relationships
> are built, not found:** what healthy looks like (daily markers), fight right (the **Four Horsemen** and
> repair), **red flags grown up** (coercive control, jealousy-as-love, isolation, gaslighting; UN&RE), leaving
> safely & breakups. **Abuse-aware:** coercive control named clearly, leaving framed as valid, brave and **never
> the target's fault**, exit-safety handled with care (**abuse can escalate at leaving**). Breakup content is
> wellbeing-safe (healthy coping, no-contact, rebuilding; links [Bounce](bounce.md) (g39) & Mind & Belonging
> (g49)); non-graphic. Even-handed across genders; routes disclosures to help. India: relationships under family
> scrutiny, **'caring vs controlling' romanticised** in culture; helplines **181, 1091, 112** (`reassureCats`
> [red-flags-grown-up · leaving-safely · breakups] + `reassure` + helpLine). `gameId "real-relationships"`
> (matches registry). Engine: no new mechanic; `binStyle` **fixed two POS-`keep` bad-green mis-colors**, added
> `keeps stuck` (rr-073) and `keeps it lopsided` (a pre-existing bug surfaced in [Equalize](equalize.md))→red,
> plus `smothering`/`wrecker`→red. Spot ids injected (6). Builds on [Green Light / Red Light](green-light-red-light.md)
> (g24), [Mutual](mutual.md) (g31) & [Friend or Frenemy?](friend-or-frenemy.md) (g09); between g45 and g47;
> on-ramp to Chapter 7. The sections below describe the original ModesEngine v1 build, superseded by v2.

**Node #g46: Chapter 6 (College, ages 18-22).** A healthy relationship runs on respect, trust, equality
and honest communication, and you can spot the opposite. Builds on [Green Light / Red Light](green-light-red-light.md)'s
flag-reading and [Consent, For Real](consent-for-real.md) (#g44). **Even-handed** (the green markers balance
the red flags, per pattern #15); **abuse-aware** with the adult thread's strong routing.

## Overview
- **App:** [SwipeEd](swipeed.md) path · engine id `real-relationships`, route `/game/real-relationships` · on the [ModesEngine](swipeed-game-patterns.md).
- **Type:** mode-based scenario game · no-fail · UNESCO 1.2, 5.3, 4.1, 5.6 · 18-22.
- **Status:** live · https://swipeed.vercel.app/game/real-relationships

## How it works: five modes
1. **What Healthy Looks Like**: the daily markers: respect · trust · equality · independence · communication (tap-reveal list).
2. **Fight Right**: conflict & repair: 'I' statements, apologising, and the four things that wreck relationships.
3. **Red Flags, Grown Up**: the **UN → RE** beat on coercive control, jealousy-as-love and isolation, busting "they're just protective".
4. **Leaving & Breakups**: recognising abuse, leaving **with a plan and support** (the most dangerous time), and healing from heartbreak.
5. **Tools & Ask-It**: health/exit references + private Q&A with **abuse routing** (Women Helpline 181 / 1091, DV helpline, Emergency 112).

## Related
- [Reusable Game Patterns](swipeed-game-patterns.md) · [Consent, For Real](consent-for-real.md) · [Mutual](mutual.md) · [Games catalog](index.md)

## Multi-step stories ([SWED-104](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02455c6c-fb84-4cc8-a691-58156ea1a13d), 2026-10-04)

All 101 branches and 61 role-plays are now 3 to 5 questions on one situation: 98 with 3, 57 with 4 and 7 with 5, 557 questions in all. Each question has 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of independent reviews: a blind best-option pick, a transition audit, and a safety and fidelity review. Round 1 found 122 blocking problems in this game. The stories the last fix changed were read in full before shipping. Every story with a safety or fidelity finding in any round, or naming a helpline, was read in full before shipping, and the owner reads the shipped stories on a review page. Six lines were fixed by hand. A promise of secrecy now has its limit ("not unless you're unsafe") and names Women Helpline 181. Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).
