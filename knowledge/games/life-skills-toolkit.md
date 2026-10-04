---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/life-skills-toolkit.md
title: The Life-Skills Toolkit (Thread C Spine)
description: SwipeEd's cross-cutting wellbeing system, a persistent toolkit of four life skills (Cool-Down · Decision Steps · Talk-It-Out · Help Map) that a child builds and levels across all 15 years, taught in the five Thread-C games, invoked in context inside other games, surfaced in a wellbeing app-shell, reflected in the capstones, and carried by Lensy. Design-of-record (phased build).
resource: https://swipeed.vercel.app
tags: [swipeed, thread-c, life-skills, sel, wellbeing, toolkit, safeguarding, system-design, sam]
timestamp: 2026-06-21T15:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/952350b7-ccd0-46b5-a0f5-65ae398e7141  # SWED-128
---

# The Life-Skills Toolkit: Thread C Spine

**Thread C (Feelings & Life Skills) is SwipeEd's skills layer, not a content domain.** The other threads
are domains (bodies, relationships, gender, sexual health, rights); Thread C is what powers all of them:
you need to manage feelings to hold a boundary, decide under pressure, voice a "no", and ask for help in a
crisis. The Life-Skills Toolkit turns Thread C from the **thinnest thread into the spine that runs through
the whole app**: a persistent set of **four tools** a child builds, carries and levels across the
**fifteen-year journey**, taught in the five **[Thread-C games](#the-thread-c-games-as-the-homes)**,
**invoked in context inside other threads' games**, surfaced in a **wellbeing app-shell**, reflected in the
**capstones**, and carried by **[Lensy](swipeed.md)**. The point is repetition-in-context: turning four skills
from things *mentioned* a handful of times into habits *practised* hundreds of times.

> Four tools, carried for fifteen years: **Cool-Down · Decision Steps · Talk-It-Out · Help Map.**

This is the **design-of-record**; the spine is being **built in phases** (see [Build order](#build-order--status)).

## Why it matters
- **Audit gap:** Thread C was the thinnest thread and its skills were woven loosely across other games. The
  Toolkit fixes this at the **system level**, not by game count.
- **Research:** the DD499 brief wanted RSE to be **less clinical, more feelings & life skills**; SEL is a
  national priority in India (Ayushman Bharat SHWP, Manodarpan / Tele-MANAS 14416). A life-skills spine
  answers both.
- **Pedagogy:** skills transfer when **practised, spaced, and applied in varied real contexts**, exactly
  what a toolkit that recurs across years and is invoked inside many games provides.

## The four tools
| Tool | What it is | Steps / contents | UNESCO |
|---|---|---|---|
| **Cool-Down** | Notice & handle feelings with healthy strategies | notice the feeling · breathe slowly · ground (5 things you can see) · move / take space · talk to someone · rest or create | 5.6 Emotions & wellbeing |
| **Decision Steps** | A repeatable way to make a good choice | stop & think · list options · weigh values & consequences · choose · own it | 5.2 Decision-making |
| **Talk-It-Out** | Say it and sort it | listen · use "I" statements · stay calm · repair / negotiate / set a boundary | 5.3 Communication & conflict |
| **Help Map** | Who to turn to and how | a trusted adult · a counsellor / doctor · helplines (Childline 1098, Tele-MANAS 14416, cybercrime 1930) · your support network | 5.5 Finding help & support |

**Only healthy, safe strategies are ever included**. The Cool-Down library is a curated healthy-only set;
no strategy using pain, physical discomfort, shock or restriction can be authored in. This is a hard rule
across the whole spine (it inherits the [wellbeing register](swipeed-game-patterns.md), pattern #20).

## How the toolkit grows across the journey
Each tool is introduced simply, then deepened chapter by chapter, **owned primarily by the five Thread-C
games**, which now span all five age bands. Other threads' games also teach these skills in context
(Crossroads sharpens decisions, Speak Up sharpens assertiveness, the safety games build the Help Map), but
the Thread-C games are the **dedicated home** where each tool is named, taught and levelled.

| Chapter · C game | Cool-Down | Decision Steps | Talk-It-Out | Help Map |
|---|---|---|---|---|
| Ch.1 · [Feelings Friends](feelings-friends.md) (3-6) | name a feeling; basic calm | a simple choice | say how I feel; say "no" | find a trusted adult |
| Ch.2 · [Heart Smart](heart-smart.md) (6-9) | big feelings, small steps | stop, think, choose | sort out a squabble | ask a grown-up |
| Ch.3 · [Mind Matters](mind-matters.md) (9-12) | full Cool-Down kit | health/relationship decisions | assertive communication | Childline 1098 |
| Ch.4 · [Bounce](bounce.md) (12-15) | resilience-grade coping | decisions under pressure | boundaries & repair | Tele-MANAS; support a friend |
| Ch.5 · [Life Ready](life-ready.md) (15-18) | adult stress management | the adult decision method | people skills at adult stakes | build a support network |

## In-context invocation: the key mechanic
**This is what makes the spine real.** At authored "tool moments" inside *other* threads' games, the app
surfaces the relevant tool, a short, **optional** prompt ("This is a Cool-Down moment. Want to use it?")
that pulls the tool from the child's toolkit. The skill is practised in the exact context where it's needed,
dozens of times across the journey, and the host game is strengthened at the same time. Highest-stakes hosts
first:

| In this game / moment | Invokes… | So the player practises |
|---|---|---|
| [GLRL](green-light-red-light.md) / [Mutual](mutual.md): a tense relationship choice | Cool-Down → Talk-It-Out | calming first; setting a boundary in words |
| [Plan It](plan-it.md) / [My Choices](my-choices-my-future.md): a reproductive choice | Decision Steps | weighing options by their own values |
| [Firewall](firewall.md): a sextortion threat | Help Map | knowing exactly who to tell and how |
| [Stand Up](stand-up.md): witnessing harassment | Talk-It-Out + Help Map | a safe response and the right help |
| [Body Confident](body-confident.md) / [Reality Check](reality-check.md): a comparison spiral | Cool-Down | settling the feeling before it takes over |

## The wellbeing app-shell
Beyond the games, the app's everyday chrome embodies Thread C, so the whole experience *supports* wellbeing
rather than just teaching it:
- **Mood check-in**: an optional, gentle "how are you?" on entry (never required, never judged) that can
  suggest a Cool-Down or the Help Map.
- **Breathing space**: a calm screen one tap from anywhere (the Cool-Down breathing screen, standalone).
- **Day/night wind-down**: *already built* (`wind-down-nudge.tsx`): nudges a healthy wind-down in the
  quiet window (~8pm-6am). The `time-of-day.ts` world-lighting layer it once paired with was removed in
  the Equal Lens canvas re-skin; the nudge itself survives.
- **Kind streak design**: streaks motivate but **never shame**: a missed day is gentle, a **streak-freeze**
  is available, no guilt-tripping (the white-hat, anti-pressure stance the app teaches).
- **Calm mode**: a reduced-stimulation setting across the whole app (extends the existing
  `prefers-reduced-motion` handling in `juice.ts`/`confetti.ts`).

## The capstone reflection
Each chapter capstone (c1-c5) gains a short **Thread-C reflection**, a "look at the skills you've grown"
beat that surfaces the toolkit's progress, so a child sees their **emotional & life-skills growth**, not
just topic knowledge. The final capstone ([Ready for the World](capstones.md)) looks back across the whole
toolkit a young person carries into adulthood, the emotional bookend to the journey.

## Lensy as the carrier
**[Lensy](swipeed.md)**, who grows from a small shape-shifting friend ([Feelings Friends](feelings-friends.md))
to a grown peer ([Life Ready](life-ready.md)), is the toolkit's keeper: introduces each tool at the right
age, models using it, hands it back in context, and visibly grows alongside the child. Because Lensy is in
every game, Lensy is the natural thread that carries the toolkit from year to year, making the spine feel like
a relationship rather than a feature. ([UN & RE](swipeed-core-principle.md), from Heart Smart onward, bust
the myths that block these skills: "big kids don't cry", "asking for help is failure".)

## The Thread-C games as the homes
| Game | Age | Owns / deepens |
|---|---|---|
| [Feelings Friends](feelings-friends.md) (g01) | 3-6 | naming feelings; first Cool-Down; saying "no"; trusted adults |
| [Heart Smart](heart-smart.md) (g41) | 6-9 | empathy; Big-Feelings calm-down; first Talk-It-Out (squabbles); simple choices |
| [Mind Matters](mind-matters.md) (g38) | 9-12 | full Cool-Down kit; resilience; stigma-busting; help-seeking (a trusted adult, Childline 1098) |
| [Bounce](bounce.md) (g39) | 12-15 | resilience-grade coping; stress; supporting friends; Tele-MANAS |
| [Life Ready](life-ready.md) (g42) | 15-18 | self-knowledge & values; adult decisions; people skills; a support network |

## Implementation model
- **A persistent Toolkit object.** Each child has an **on-device** Toolkit recording which tools are
  unlocked and at what **level**; tools unlock/level as Thread-C games are played, and are **referenced (not
  duplicated)** by in-context prompts elsewhere. Lives in the default-merged `Profile` (`src/lib/store.tsx`),
  no storage-key bump.
- **Two surfaces.** An always-available **Toolkit drawer** (open any unlocked tool any time, mounted in
  `app-shell.tsx` beside Get Help), and **contextual prompts** injected by other games at authored tool
  moments (a `<ToolMoment>` component).
- **Data model (lightweight).** `Tool { id, name, unlockedAt(age), level, lastUsed }`; `Toolkit` =
  per-child collection; `Tool-moment` = an authored hook in any game referencing a tool id.
- **Content & libs.** `src/content/toolkit.ts` (the four tools × age-banded levels × Lensy intros),
  `src/lib/toolkit.ts` (`ToolId`, registry, age→level mapping). The **Help Map reuses
  `help.ts`** through the shared `HelpLines` rows (`src/components/toolkit/help-lines.tsx`), the same rows as
  the help sheet, so the two can never list different numbers. Rows carry an audience: players who entered at
  18 or over see an adult Childline row (call if a child needs help) and Women Helpline 181; younger players see
  Childline as their own line. Emergency 112 is the first row for everyone ([SWED-128](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/952350b7-ccd0-46b5-a0f5-65ae398e7141)).

## Safeguarding & privacy (read first)
- **Healthy-coping guardrail (hard rule).** The Cool-Down library is curated healthy-only (breathing,
  grounding, talking, movement, rest, creativity). No pain/shock/discomfort/restriction strategy can be
  authored in, enforced by the typed content set.
- **Routes to real help.** The Help Map and mood check-in route any sign of crisis to real services (a
  trusted adult, emergency 112, Childline 1098, Tele-MANAS 14416, cybercrime 1930, and Women Helpline 181 for adults). The spine
  **signposts and supports. It never claims to be therapy.**
- **Privacy is paramount (DPDP-aligned).** The toolkit, mood check-ins and any notes are **on-device, never
  tied to an identity or uploaded**. Wellbeing data is the most sensitive in the app. (No mood *values* are
  stored, only a check-in cadence.)

## Build order & status
Ship the **Toolkit object + Cool-Down + Help Map first** (most safeguarding value), then **Decision Steps +
Talk-It-Out**, then add **in-context prompts to the highest-stakes games first** (Firewall, Mutual, GLRL,
Stand Up), then the **wellbeing-shell** extras (mood check-in, calm mode, kind streak), then the **capstone
reflection**. Phased branches (this doc is updated as each lands):
- **Phase 0: design-of-record** *(this doc)*: ✅ written.
- **Phase 1: data model + content + store**: ✅ shipped. `Profile.toolkit` (optional, default-merged;
  `ToolId`/`ToolState` in `types.ts`), `src/lib/toolkit.ts` (registry + `THREAD_C_LEVEL` engine-id→chapter
  map + helpers), `src/content/toolkit.ts` (per-tool steps/Lensy intros/level labels; healthy-only),
  store `unlockTool`/`levelTools`/`useTool` (level-up only). No surfaces yet.
- **Phase 2: Cool-Down + Help Map + drawer + breathing space**: ✅ shipped. Always-available **Toolkit
  drawer** (`src/components/toolkit/toolkit-drawer.tsx`, launcher mounted in `app-shell.tsx`, self-hides
  until the first tool unlocks), a generic **tool player** (`tool-player.tsx`), the **breathing space**
  (`breathing-space.tsx`, reduced-motion aware). Thread-C completions grow the toolkit via
  `toolsUnlockedBy` → `unlockTool` in `game-done.tsx` (Cool-Down + Help Map first). Enriched `help.ts`
  (Tele-MANAS 14416 · cybercrime 1930) so both Get Help and the Help Map carry the
  national set.
- **Phase 3: Decision Steps + Talk-It-Out**: ✅ shipped. Thread-C completions now grow the **whole**
  toolkit to the chapter level (all four tools present from Ch.1 per the grow-table), so Decision Steps +
  Talk-It-Out join the drawer; the generic player already renders their content. (Non-Thread-C games stay
  *referencers*. They get tool moments in Phase 4, not leveling.)
- **Phase 4: in-context tool moments**: ✅ shipped. `src/components/toolkit/tool-moment.tsx`: an
  optional, never-blocking `<ToolMoment>` nudge that self-hides until the tool is unlocked / once
  dismissed. Authored hooks in 8 high-stakes games (per Table 2): Firewall (Help Map · sextortion),
  Stand Up (Help Map + Talk-It-Out), Mutual (Cool-Down + Talk-It-Out), GLRL (Cool-Down), Plan It /
  My Choices (Decision Steps), Body Confident / Reality Check (Cool-Down).
- **Phase 5: wellbeing shell (mood check-in · calm mode · kind streak)**: ✅ shipped. **Calm Mode**
  (`Profile.calmMode` + settings toggle; juice/confetti share a calm-aware `prefersReducedMotion()` + a
  `calm` root class). **Mood check-in** (`mood-check-in.tsx`, once-a-day, never judged; a low day offers
  the breathing space + Get Help; **no mood value stored**, only `mood.lastCheckDayKey`). **Kind streak**
  (`dailyStreak` with freezes; `recordVisit` from the app-shell Gate: a missed day spends a freeze, else
  resets gently to 1; shown as a chip in the drawer). *(Wind-down already built.)*
- **Phase 6: capstone Thread-C reflection**: ✅ shipped. A shared `ToolkitReflection`
  (`src/components/toolkit/toolkit-reflection.tsx`) rendered from `game-done.tsx` for `capstone-*` ids:
  each graduation closes with a "Skills you've grown" beat (the four tools at that chapter's level); c5 is
  the whole-toolkit look-back into adulthood. **The spine is fully built.**

## India & SEL alignment
The spine aligns with India's priorities: SEL & life skills sit at the heart of the **Ayushman Bharat
School Health & Wellness Programme** and the **NEP**, and student mental-health support is national policy
via **Manodarpan / Tele-MANAS (14416)**. The Help Map uses India's real services; the framing tackles the
high stigma around feelings and help-seeking (especially for boys); and the whole spine is **audio-first and
offline-friendly** to reach low-literacy and low-connectivity contexts, the reach DD499 called for.

## Related
- [SwipeEd (app)](swipeed.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Core principle: Unlearn → Relearn → Grow](swipeed-core-principle.md) · [Capstones](capstones.md) · Thread-C homes: [Feelings Friends](feelings-friends.md) · [Heart Smart](heart-smart.md) · [Mind Matters](mind-matters.md) · [Bounce](bounce.md) · [Life Ready](life-ready.md) · [Games catalog](index.md)
