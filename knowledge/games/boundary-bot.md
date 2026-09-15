---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/boundary-bot.md
title: Boundary Bot
description: A consent simulator + online-safety puzzles + a safe, vetted chatbot for ages 9-12. Ask first, respect a no (UN & RE), set your own boundaries, shield yourself online, and ask Boundary Bot "what should I do if…". No-fail; serious matters route to real help.
resource: https://swipeed.vercel.app/game/boundary-bot
tags: [games, swipeed, consent, online-safety, ages-9-12, safeguarding, chatbot]
timestamp: 2026-06-20T15:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Boundary Bot

> **Reworked to GDD 15 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The consent-and-boundaries node is a **486-scenario typed library**
> (`content/games/boundary-bot.ts`: my-boundaries 78 · consent-mutual 84 · respect-others 80 · peer-pressure 80
> · online-boundaries 83 · crossed-support 81), generated **faithfully** from the scorecard-passed GDD JSON, on
> the **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is one of **seven typed play
> actions** (branch ×108 · reflect ×91 · strike-rewrite ×80 · role-play ×62 · sort ×50 · spot ×47 · build ×48),
> **0% binary tap**, led by boundary/pressure **dilemmas** (branch), the **say-the-line** rehearsal (role-play),
> the **pressure-escape kit** (build), and **spot-the-red-flag** scenes (spot). The pre-teen consent curriculum:
> setting & holding your own boundaries, consent (a free yes, ongoing, revocable), reading & respecting others',
> resisting peer pressure (refusal scripts + exit lines), online boundaries & sharing (oversharing, the
> photo-request red flag, passwords), and what to do when a boundary's crossed (name-leave-tell & support).
> Ethics: **empower never frighten**; **both ways** (set your own AND respect others' because consent is mutual);
> **safe to be wrong** ("if you gave in once"/"if you froze" met with self-compassion, because a crossed boundary is
> **never the child's fault**; `reassure` + `reassureCats` ["crossed-support"] + every `outcome:"safe"` branch →
> "not your fault, telling is brave" banner); online red flags taught **calmly, not lurid**; **gender-inclusive
> consent** (everyone asks & respects, boys too); **private/solo**; crossed boundaries route to a trusted adult &
> **Childline 1098**. Engine: **no new mechanic** (reuses 7 of 9); a `binStyle` valence accretion
> (not-a-boundary/not-consent/crosses/not-helpful → red, good-move → green), while share/private and
> my-boundary/not-mine stay neutral distinctions. `gameId "boundary-bot"` (matches the registry id). Builds on
> [Safety Squad](safety-squad.md) (g08) & [My Body, My Rules](my-body-my-rules.md) (g02); prereq g14; feeds
> Chapter 4 consent/relationship nodes. The sections below describe the original v1 build, superseded by the v2
> mechanic engine.

**Node #15: the ages 9-12 step of the Safety & Consent thread**. It advances
[Safety Squad](safety-squad.md) (#8) in two directions: it **deepens consent** (*ask first* and
*respect a no*, in everyday life) and **deepens online safety**, from "don't share" to privacy settings,
cyberbullying and **grooming red-flags**. Its signature is **Boundary Bot** itself: a friendly, **safe,
vetted, non-generative chatbot** a child can ask *"what should I do if…"*, which gives curated,
age-appropriate guidance and **routes anything serious to real help**. Consent is taught **entirely in
everyday, non-sexual terms** (borrowing, photos, hugs, space, online), developmentally right, and the
right foundation for the sexual-consent lessons years later (Green Light / Red Light #24, Mutual #31).

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `boundary-bot`, route `/game/boundary-bot`.
- **Type:** reading-light **consent simulator + online-safety puzzles + a safe Q&A bot** · no fail.
- **Age band:** 9-12 · **Curriculum:** UNESCO 4.2 (consent/privacy/boundaries), 4.3 (online safety), 4.1 (violence), 3.3, 5.5 (finding help). Builds on Safety Squad (#8).
- **Status:** live · https://swipeed.vercel.app/game/boundary-bot

## How it works: five modes + the Boundary Badge Book
1. **Ask First**: a consent simulator of everyday situations (post a friend's photo, borrow a pen, hug a
   cousin): the child practises **asking permission**. Consent starts with asking.
2. **No Means No**: the **UN & RE** beat: UN erases *"no just means try harder"* / *"a yes can't become a
   no"*, RE redraws *"no means no; pestering isn't okay; anyone can change their mind, even after a yes."*
3. **My Boundaries**: collect simple, assertive words over body, space, things and time ("please ask
   first", "this is my space", "I'll tell a trusted adult").
4. **Online Shields**: practical puzzles: manage **privacy**, handle **cyberbullying** (don't pile on,
   block, report, support the target), and spot **grooming red-flags** (over-friendly stranger, secrets,
   photo/meet-up requests → *stop, don't share, tell a trusted adult*). Calm, never frightening.
5. **Ask Boundary Bot**: the **safe helper**: tap a *"what should I do if…"* question for vetted,
   curated guidance; the serious item (pressure, touch, secrets) **routes to a trusted adult / Childline
   1098 / POCSO e-Box** and is never the child's fault.

A 5-badge **Boundary Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** +
the shared **`UnReBeat`** + the voice model.

## Safeguarding: the chatbot is safe by construction
Per GDD §12/§14, Boundary Bot is **not an open generative chatbot**. In the app it is a **curated, vetted
Q&A** (static, reviewed answers only, no free generation that could go anywhere), collects **no personal
data**, and **always routes any sign of harm/abuse/grooming to real help** rather than only answering. This
is the safe realisation of the [Ask-It box (pattern #18)](swipeed-game-patterns.md) as an interactive helper.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)),
**empower-never-frighten (#16)** (grooming/cyberbullying calm, non-graphic, always resolving into telling),
**Ask-It / safe-helper (#18)** (curated answers, distress routed to Childline 1098 / POCSO e-Box), and
**Made-for-India (#14)** (carries forward the body-safety carve-out: a child can always say no to unsafe
touch, even with elders).

## Status & roadmap
- **Built:** all five modes (Ask First, No Means No UN & RE, My Boundaries, Online Shields incl. grooming
  red-flags, Ask Boundary Bot curated Q&A with the Childline/POCSO help route), the Boundary Badge Book;
  English narration.
- **Deferred (GDD Phase 2/3):** live guardrailed Bot intake + safeguarding classifier, crown levels
  (subtler grooming scenarios), a fuller scenario/answer bank, Classroom-Mode polish, calm mode, **Hindi**.
