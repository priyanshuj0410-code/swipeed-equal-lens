---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/mutual.md
title: Mutual
description: A consent & communication game for ages 15-18 - consent is a freely given, enthusiastic, ongoing "yes" from both people. Learn the standard, read & respect cues, refuse coercion (UN & RE), practise the Mutual Zone, and know your rights/the law. Never explicit; even-handed; POCSO-aware; strongest safeguarding routing. No-fail.
resource: https://swipeed.vercel.app/game/mutual
tags: [games, swipeed, consent, relationships, ages-15-18, safeguarding]
timestamp: 2026-06-20T21:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Mutual

> **Reworked to GDD 31 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The sexual-consent / legal-age / relationships node (Thread B · Safety, Consent & Boundaries) **at its adult
> peak** is now a **510-scenario typed library** (`content/games/mutual.ts`: what-consent-is 86 ·
> reading-respecting 79 · pressure-coercion 80 · the-mutual-zone 89 · rights-and-law 88 · mutual-respect-equal
> 88) on the **shared v2 engine** - seven play actions (reflect ×100 · strike-rewrite ×92 · branch ×92 ·
> role-play ×68 · sort ×61 · spot ×48 · match ×49), **0% binary**, led by branch (your move) + strike-rewrite
> (bust the myth) + role-play (say the line). **Consent = FRIES** (freely given · reversible · informed ·
> enthusiastic · specific), a **YES from both**, the *presence of a yes, not the absence of a no*, withdrawable
> anytime; **pressure, manipulation or incapacitation cancels it**. **Even-handed** (any gender can be pressured
> or apply pressure); **never victim-blaming; never explicit**; delaying respected. India: **age of consent 18**,
> any sexual activity with a minor is a **POCSO** matter; framed as a life principle for safe adulthood, not
> encouragement. Routes any disclosure of assault/abuse/coercion to help - **Women Helpline 181, women-in-distress
> 1091, emergency 112, Childline 1098**, a trusted adult/counsellor (`reassureCats` [pressure-coercion ·
> rights-and-law] + `reassure` + helpLine). `gameId "mutual"` (matches registry). Engine: no new mechanic;
> `binStyle` added `coercion`→red (the "Coercion" bin; regression-clean - no other game has a good "coercion"
> bin). Spot ids injected (6). Builds on [Boundary Bot](boundary-bot.md) (g15) & [Green Light / Red Light](green-light-red-light.md)
> (g24); pairs [Status: Know It](status-know-it.md) (g30); underwrites [Spectrum](spectrum.md) (g32). The sections
> below describe the original v1 build, superseded by v2.

**Node #31 - the consent & communication step of Chapter 5** (ages 15-18). *Consent isn't the absence of
"no" - it's a freely given, enthusiastic, ongoing "yes" from both people. Anything less isn't consent.* It
is the **culmination of the whole consent and relationships journey** - the bodily autonomy of
[My Body, My Rules](my-body-my-rules.md) (#2), the boundaries of [Boundary Bot](boundary-bot.md) (#15) and
the behaviour-reading of [Green Light / Red Light](green-light-red-light.md) (#24) - brought to intimate
relationships. It pairs with [Status: Know It](status-know-it.md) (#30), whose partner conversations assume
the consent and respect taught here. **Never explicit; even-handed; POCSO-aware; the strongest safeguarding
routing in the path.**

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `mutual`, route `/game/mutual`.
- **Type:** reading-rich **scenario game** · no fail · never explicit; consent never rushed; Q&A private.
- **Age band:** 15-18 · **Curriculum:** UNESCO Key Concept 4 (consent & violence prevention) & 5 (healthy relationships). Builds on #2, #15, #24; pairs with #30.
- **Status:** live · https://swipeed.vercel.app/game/mutual

## How it works - five modes + the Badge Book
1. **What Consent Really Is** - the standard, clearly: **freely given · reversible · informed · enthusiastic
   · specific · ongoing** - *a "yes", not the absence of "no"*, by both people, every time.
2. **Reading & Respecting** - read verbal and non-verbal cues and **respect a boundary instantly** (quiet
   or "I'm not sure" is never a yes - check in, or stop immediately).
3. **Pressure & Coercion** - the **UN & RE** beat on the consent myths ("no means convince me", "they
   didn't say no so it's yes", "a relationship means automatic consent", boss: "drunk/dressed a certain way
   means willing" → *incapacitation is never consent; nothing about a person implies it*).
4. **The Mutual Zone** - the signature: practise **mutual, enthusiastic consent** - ask, listen, check in;
   both people's comfort matters equally; a yes to one thing isn't a yes to all.
5. **Your Right, Their Right + Ask Anything** - either person can stop anytime; consent & incapacitation;
   **the law (POCSO, age of consent 18)**; a fully open private Q&A routing harm to **Women Helpline 181,
   1091, Childline 1098, Emergency 112**, or a trusted adult.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses the shared
**`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), **myth-bust-by-choosing-the-truth (#19)**, **empower-never-frighten (#16)** (never
explicit; pressured "consent" named as coercion; the strongest safeguarding routing), the **Ask-It /
safe-helper box (#18)** fully open, and **Made-for-India (#14)** (POCSO age-18; 181/1091/1098/112). The
consent vocabulary first met as the "Big No" matures here into the full enthusiastic-consent standard.

## Status & roadmap
- **Built:** What Consent Really Is, Reading & Respecting (cue scenes), Pressure & Coercion (UN & RE incl. a
  boss), The Mutual Zone (mutual-consent scenes), Your Right Their Right + Ask Anything (with the
  181/1091/1098/112 routing); the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a richer branching communication sim, a fuller scenario bank, crown levels,
  Classroom-Mode polish (facilitator-led), calm mode, and **Hindi**.
