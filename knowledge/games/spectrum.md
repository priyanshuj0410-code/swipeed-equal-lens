---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/spectrum.md
title: Spectrum
description: An understanding-and-respect game for ages 15-18. Orientation and gender identity vary, and everyone deserves dignity, respect and safety. Understand the spectrum, bust the harmful myths (UN & RE), practise dignity-for-all, support anyone questioning, and find help. Never shames, never outs; non-explicit; constitutional-values framing; careful triage. No-fail.
resource: https://swipeed.vercel.app/game/spectrum
tags: [games, swipeed, identity, diversity, dignity, ages-15-18, safeguarding]
timestamp: 2026-06-20T22:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/0c1b8795-8d5d-4208-92d0-e1365dd590bc  # SWED-122
---

# Spectrum

> **Reworked to GDD 32 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The identity / orientation / respect node (Thread D · Relationships) is now a **508-scenario typed library**
> (`content/games/spectrum.ts`: the-spectrum 91 · myths-and-respect 98 · dignity-for-all 87 · being-you 68 ·
> stand-against-bullying 79 · support-and-rights 85) on the **shared v2 engine**, with seven play actions (reflect
> ×126 · branch ×91 · strike-rewrite ×83 · sort ×58 · role-play ×55 · match ×50 · spot ×45), **0% binary**, led by
> strike-rewrite (bust the myth kindly) + branch (your move) + reflect. Built on **one non-negotiable: respect
> is a value, not a debate.** Teaches understanding and busts harmful myths **without disparaging anyone's family
> or beliefs**, and separates honest belief-differences (respected) from the **dignity floor** (always upheld).
> Supports anyone questioning, **no pressure to label**, complete confidentiality; **never outs or infers
> anyone**; sharing is always the person's own choice. Non-explicit. India: consensual same-sex relations
> **decriminalised (2018)**, **NALSA** recognised transgender persons, dignity & equality are constitutional
> values; framed around settled values, not contested policy. Routes distress / family-conflict to a trusted
> adult / counsellor, **Tele-MANAS 14416, Childline 1098** (`reassureCats` [being-you ·
> stand-against-bullying · support-and-rights] + `reassure` + helpLine). `gameId "spectrum"` (matches registry).
> Engine: no new mechanic; `binStyle` unchanged (all 10 sort bins emulated clean, good side green/neutral, bad
> side red/neutral, no collisions). Spot ids injected (4). Builds on [What Makes Me, Me](what-makes-me-me.md)
> (g7) & [MythBuster: Gender](mythbuster-gender.md) (g25); links [Stand Up](stand-up.md) (g27) & [Mutual](mutual.md)
> (g31). The sections below describe the original v1 build, superseded by v2.

**Node #32: the diversity & respect step of Chapter 5** (ages 15-18). *People differ in who they are and
who they love, and every single one deserves dignity, respect and safety. That part isn't up for debate.*
It extends the self-understanding of [What Makes Me, Me](what-makes-me-me.md) (#7) and the evidence-based
myth-busting of MythBuster: Gender (#25) to **orientation and gender identity**, and shares the
respect-and-dignity foundation of [Mutual](mutual.md) (#31) and the anti-bullying skills of Stand Up (#27).
**It never shames anyone or any family, never outs anyone, is non-explicit, and uses a
constitutional-values framing** (NALSA; the Transgender Persons Act). Its Ask-It is fully open but among the
most carefully triaged in the app.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `spectrum`, route `/game/spectrum`.
- **Type:** reading-rich **understanding & respect** game · no fail · never explicit; no one is ever outed; Q&A carefully triaged.
- **Age band:** 15-18 · **Curriculum:** UNESCO 3.1 (gender identity) & diversity/respect; tackling homophobic/transphobic bullying. Builds on #7, #25; links to #27, #31.
- **Status:** live · https://swipeed.vercel.app/game/spectrum

## How it works: five modes + the Badge Book
1. **The Spectrum**: orientation (who you're attracted to) and gender identity (your own internal sense of
   gender) vary; **natural human diversity** across cultures and throughout **India's own history** (not a
   foreign import).
2. **Myths & Respect**: the **UN & RE** beat: "it's a choice you can change", "it's an illness", "it's
   contagious/can be taught", boss: "it's a foreign/Western import" → *people simply vary; dignity is
   non-negotiable.*
3. **Dignity for All**: the signature: respect, inclusion and anti-bullying scenarios, step in safely,
   **never out someone**, and *"you don't have to agree with everyone to treat everyone with dignity,
   respect and safety"* (a constitutional value).
4. **Being You**, for anyone questioning: it's okay to be unsure, **no pressure to label**, no rush, you're
   not alone, and **sharing anything is always your own choice.**
5. **Support & Ask Anything**: a carefully triaged private Q&A; bullying or distress routes to a trusted
   adult/counsellor, **Tele-MANAS 14416**, or **Childline 1098**.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Lensy returns as a calm,
accepting young-adult guide. Reuses the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), **myth-bust-by-choosing-the-truth (#19)**, **empower-never-frighten (#16)** (never
outs; supportive for questioning youth; careful triage), **don't-villainise (#15)** (dignity for everyone,
including across disagreement), the **Ask-It / safe-helper box (#18)** (most carefully triaged), and
**Made-for-India (#14)** (India's own history; NALSA / Transgender Act; Tele-MANAS / Childline).

## Status & roadmap
- **Built:** The Spectrum, Myths & Respect (UN & RE incl. a boss), Dignity for All (respect/anti-bullying
  scenes), Being You (support for questioning), Support & Ask Anything (with the Tele-MANAS/Childline route);
  the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a fuller scenario/term glossary, crown levels, facilitator-led Classroom
  Mode, the most careful live Ask-It triage, calm mode, and **Hindi**.

## Safety fixes (2026-10-02)

[SWED-122](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/0c1b8795-8d5d-4208-92d0-e1365dd590bc): the game still teaches never outing a friend. Its model lines no longer promise secrecy "always": "It stays with me, and you decide who knows. If you're ever unsafe, I'll help you get support." The safe-support line in `sp-1325` is "It stays with me unless you're in danger." `sp-1282` describes a helpline as a caring listener who explains what stays private. See the [confidentiality sweep](../audits/confidentiality-sweep-2026-10-02.md).
