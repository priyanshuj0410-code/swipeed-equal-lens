---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/green-light-red-light.md
title: Green Light / Red Light
description: "Node #24's flagship relationships game on the SwipeEd path. Read healthy vs unhealthy behaviour by swipe. Live as an educational roguelike (story Runs, a Clarity meter, Insight perks, forks, boss cards) built over the original v1 swipe-deck core, which is kept as Quick Play."
resource: https://swipeed.vercel.app/path
tags: [games, swipeed, green-light-red-light, relationships, swipe-engine, roguelike, safeguarding]
timestamp: 2026-06-21T01:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/29cd0a06-a442-4572-8955-29fbd4f5c0e2  # SWED-105
---

# Green Light / Red Light

> **Reworked to GDD 24 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible): the **teen flagship** and namesake swipe game (relationships & consent). Now a
> **517-scenario typed library** (`content/games/glrl.json`: what-is-consent 103 · **flags 104** (green + red merged) ·
> read-any 105 · say-and-hear 104 · when-wrong 101), generated **faithfully** from the scorecard-passed GDD 24 JSON,
> on the **shared v2 engine** (`components/games/v2-engine.tsx`). **Note (2026-06-23):** the original separate
> `green-flags` / `red-flags` categories were **merged into one mixed `flags` ("Green or red?") category**: with
> them split, every swipe in a session shared one answer (a green-flags session = swipe-right every time),
> telegraphing it; merged, each swipe is a genuine read. (The earlier line below still lists the original split.)
> on the **shared v2 engine** (`components/games/v2-engine.tsx`). **This game added the 10th v2 mechanic:
> `swipe`** (×120, the signature green-light/red-light flag-reading verb: read a relationship cue and swipe it
> green-flag / red-flag; `SwipeScenario` in the schema + a `SwipePlay` renderer: two directional flag buttons,
> colour + emoji + label, a wrong swipe is a warm nudge, no fail), alongside branch ×84 · strike-rewrite ×79 ·
> role-play ×87 · sort ×55 · reflect ×52 · spot ×40. Arc: what consent is (**FRIES**: Free, Reversible, Informed,
> Enthusiastic, Specific) → green flags → red flags → read any relationship → say it & hear it → **when a line is
> crossed**. Green/red flag reading (One Love) across friendships, family and romantic. **Safeguarding:** a
> crossed line is **never your fault**; serious red flags / coercion route to a trusted adult or **Childline
> 1098 / 112**; leaving what harms you is strength, not failure (`reassure` + `reassureCats` ["when-wrong"]).
> School-comfort, non-explicit. **GATED** at the path layer (age band). **gameId trap:** library/GDD aspirational
> id is `green-light-red-light` but the engine-host registry id is `glrl`: config uses `glrl`. Engine: the new
> swipe mechanic + a small `binStyle` accretion (consent real/not, healthier/unhealthy valenced; the flag-reading
> *sort* bins stay neutral: the swipe verb colours flags itself). Builds on [Boundary Bot](boundary-bot.md)
> (g15); prereq g23. **Completion:** earning all five category stickers ends the game and `GameDone` saves
> `deckStars.glrl`, which completes g24 and opens g25 (`makeGameDone` in `src/lib/node-unlock.ts`, which still also
> counts a v1 finish: a cleared story run or Quick Play deck stars). Until
> [SWED-105](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/29cd0a06-a442-4572-8955-29fbd4f5c0e2)
> the path counted only the v1 finishes, so a v2 finish left g25 onward locked. The sections below describe the
> original v1 swipe-roguelike build, superseded by the v2 mechanic engine.

The **first game** built on the [SwipeEd](swipeed.md) path and its **flagship relationships lesson**
(ages ~12-15). Per **GDD 24** ("standard node edition"), it is the **reference flagship the other 35
nodes adapt down or up from**, *not* a node standardized to match them. That is why it alone is a full
**swipe-roguelike** while the rest share the simpler **5-mode tap/sort/choose** shape: the surface
mechanic is deliberately the most distinct in the app, dialed down for younger ages elsewhere. The
**shared DNA is the constant** across all 69 games: Lensy as companion, no hard fail, the
[Unlearn → Relearn → Grow](swipeed-core-principle.md) beat, safeguarding-never-scored with help routing,
and content-as-data: only the *engagement surface* varies (every other GDD's "How the Toolkit Adapts"
table has a "Teen version" column that **is** this game).

> **Shell consistency (a deliberate deviation from GDD 24).** For path coherence, GLRL is now wired as a
> **first-class engine game**: it launches at **`/game/glrl`** and in place on the path through the same
> `EngineGameHost` + shared **`GameShell`** chrome as every other node, with a **native home screen in the
> same shape as every other game**: Lensy header + a progress row + a 2-column **mode grid** (Story · Daily
> · Quick Play · Boss Rush · Flag-pedia) on the shell body, with Story/Powers as native sub-screens. Only
> the *run mechanic* stays bespoke: the **roguelike feel is intact**, but the home/chrome no longer differ
> from the rest. (`src/content/games/glrl.json` on the shared engine. The `/decks` hub and `/play/mythbuster` swipe remain reachable.)

A fast **swipe**: read a short relationship scenario (friends, crushes, family, online),
**swipe right = green flag, left = red flag**, then the reveal names the behaviour and explains why.
Behaviour-only (no sexual content), safeguarding-first, built for the Indian school context. Content is
the One Love Foundation's **20 signs** (10 healthy / 10 unhealthy); the signature challenge is the
**disguised card**: behaviour that looks sweet but is controlling, or looks harsh but is healthy.

> **Canonical GDD: the node-edition `GDD 24`** ("standard node edition"), with the original **v1** GDD and
> the **2.0** roguelike-redesign GDD as its companion deep-dive docs (they hold the deeper card schema,
> perk catalogue and run spec). **v1** is the flashcard-style deck (judge → reveal, streaks, stars,
> Flag-pedia), now **kept as Quick Play**. **2.0** (now live) keeps that swipe as the atom and rebuilds
> everything around it as an **educational roguelike**: short story **Runs**, a **Clarity** meter,
> **Insight-perk** loadouts, **branching forks** and **boss cards**. The [build status](#status--build-plan-20)
> is below; the live game is faithful to GDD 24 (only **Build-a-Flag** UGC is deferred).

## What it teaches
Tell healthy from unhealthy behaviour; **name the specific sign** (possessiveness, guilting, isolation…)
rather than a vague bad feeling; **read disguised behaviour** (the headline learning signal: rising
accuracy on disguised cards across runs); understand that conflict and independence are healthy; and know
what to do / whom to contact when something is unsafe. Maps to UNESCO ITGSE topics 1.2, 4.2, 5.3, 7.1, 7.2.

## v1: how it works (live today)
- **Loop:** read → judge → swipe (or buttons) → reveal (verdict + sign name + one-line why) → next; finishes into the shared [`GameDone`](swipeed.md) card. Drives via `useSwipeGame`.
- **No fail-state; never rewards speed.** Disguised cards score double; a small thoughtful-read bonus.
- **Safeguarding cards** (grooming, sextortion, boundary violations) are **never scored** and route to a calm supportive screen; **Get Help** (Childline 1098, POCSO e-Box) is on every screen.
- **Flag-pedia** tracks per-sign mastery; streaks & stars; School-Comfort Mode hides the romantic deck.
- Accessibility: button equivalents, colour never the only signal (icon + label + position), resizable text, offline PWA, anonymous on-device state. **Content is data** (`src/content/*`), `locale`-keyed.

## 2.0: the roguelike rebuild
The core verb (reading behaviour) is unchanged; the structure around it is new, so that *getting better
at the game is getting better at reading relationships*. Headline model:

- **The Run**: one character's relationship told over ~12 **escalating** cards (sweet → telling). 3-6
  min; "one more run" pacing. The run is the unit of play, replacing the endless deck.
- **Clarity meter**: the *character's* meter (not player "lives"): correct reads hold/raise it, misses
  lower it, disguised & boss cards swing it more; safeguarding cards never move it. **No hard fail**:
  low Clarity resolves into a gentle reflective "the signs were there; let's look again" ending, with
  missed cards queued for review.
- **Insight perks (loadout)**: equip 2-3 before a run; reading/learning aids, **never auto-win**, never
  purchased (earned by play). e.g. Slow-Mo, Gut Check, Truth Serum, Calm Mind (accessibility). Synergies
  emerge (a gentle "beginner reading" build vs a "high-score" build).
- **Branching forks (×2/run)**: talk it out / set a boundary / walk away. The choice changes later cards and the
  ending, teaching communication, boundary-setting, exiting safely. The agency v1 lacked.
- **Boss card**: the hardest, most disguised escalation caps a deck.
- **Story decks + recurring cast**: themed escalation arcs (New Crush, The Toxic Friend, In the DMs, The
  Controlling Partner, Family & Boundaries, The Group Chat, Boss Rush) around a small diverse cast
  (Meera, Kabir, Aisha, Rohan…); the character you help carries the Clarity meter.
- **Meta-progression**: XP + unlocks (decks, characters, perks, cosmetic-only currency) open a deck/
  character **Map**; white-hat pull (mastery & curiosity), never FOMO / heart-gating / pay-to-continue.
- **Mastery curve**: subtler tells, more disguised cards, an optional speed bonus once accuracy is high,
  boss relationships; adaptive *down* for strugglers (more obvious tells, no timer, Calm Mind).
- **Juice**: card physics, stamps, screenshake (toxic) / light-pulse (green), particles, distinct SFX +
  combo chime + escalating music, haptics, character portrait reactions, one-tap restart.
- **Modes**: Solo Runs, Daily Run (seeded), Boss Rush now; Classroom, async Spot Check, Build-a-Flag
  UGC later. **Quick Play / Essentials** keeps the v1 straight-swipe for younger/overwhelmed players.

**The unlearn-relearn beat.** Disguised cards are exactly where SwipeEd's core principle
(**[Unlearn → Relearn → Grow](swipeed-core-principle.md)**) comes alive: a missed "looks-sweet-but-toxic"
read triggers the **UN** (gently erase the old read, no shame) + **RE** (redraw the truer one, with a
reason) move, then re-reading correctly is the celebrated "Grow" beat. Used with restraint, never on
every card. The run/perk shell is intended as a **reusable template** for other SwipeEd swipe units (see
the [engines table](swipeed.md#the-lesson-engines-the-keystone)): the cross-game decisions it
established are written up in the **[reusable game patterns](swipeed-game-patterns.md)**.

### Card schema (the CMS contract)
Cards are authored as data, never hard-coded. Fields: `id`, `deck`, `context_tag`, `scenario_text`
(≤240), `correct_flag` (green/red), `sign` + `signId` (one of the 20), `difficulty` (1-3),
`is_disguised`, `is_safeguarding`, **`escalation_step`** (place in a run's arc), **`branch_id`** (the
fork-branch it belongs to, if any), `feedback_short`, `learn_more_ref`, `locale`, `illustration_ref`.
(`escalation_step` / `branch_id` / `character` / `illustration_ref` are the 2.0 additions.)

## Status & build plan (2.0)
**Built (v1, live):** the swipe atom, 20-sign taxonomy, ~60 cards across 8 decks, disguised + unscored
safeguarding cards, Flag-pedia mastery, streaks/stars, School-Comfort, Daily Deck, accessibility.

**Built & live (2.0 MVP / GDD Phase 1)**: runs primary, Quick Play kept; each was staged as its own
branch + KB update:
1. ✅ **Content model** *(done)*: `Card` extended (`escalation_step` / `branch_id` / `character`); new
   `RunDeck` / `Character` / `Perk` types; **6 complete story arcs (85 cards)** with two 3-way forks + a
   boss each: New Crush (Meera, romantic), The Toxic Friend (Aisha), In the DMs (Rohan), The Controlling
   Partner (Kabir, romantic), Family & Boundaries (Anaya), The Group Chat (Veer), with romantic arcs
   School-Comfort-hidden and unscored ▲ safeguarding cards in the online/family/group arcs; plus 6 cast +
   Coach, and **8 powers**: 4 starter (Slow-Mo, Gut Check, Truth Serum, Calm Mind) + 4 **unlocked by
   play** (X-Ray, Streak Shield, Combo Master, Boss Bane; gated on lifetime disguised-reads / runs /
   best-combo / a 3-star run, with effects wired in the run engine and locked tiles shown in the
   loadout). Cards live in `src/content/cards-runs.ts`; decks/forks in `src/content/runs.ts`. (85 hits
   the GDD's ~80 MVP target; expandable toward 250-400 with more clear-card variety.)
2. ✅ **Run engine** *(done)*: `src/lib/use-run-game.ts` (+ `run-scoring.ts`): wraps the per-card swipe
   atom with a **Clarity meter** (correct holds/raises, miss lowers, disguised/boss swing more,
   safeguarding never moves it), combos, perk surfaces (Calm-Mind timer-off, Gut-Check hint, Truth-Serum
   extra explanation, Slow-Mo), **mid-run forks** (assembles the chosen branch lane on the fly), a boss
   card, **no hard fail** (Clarity floors at 0 → a gentle reflective resolution), and **review-missed**.
3. ✅ **Run UI + juice** *(done)*: `src/components/glrl/` (loadout · run-host · clarity-meter · fork ·
   resolution · debrief) + `src/lib/juice.ts`: pick deck+character, equip 2-3 perks, play the run with a
   live Clarity meter / combo / character chip, the fork screen, and a resolution + debrief
   (accuracy, the disguised-card signal, review-missed). Web-Audio SFX + screenshake/pulse + haptics,
   reduced-motion/mute aware. The **UN & RE beat** fires on a missed disguised card. GLRL launches as a
   **first-class engine game** (`/game/glrl` + in place on the path) with a **native home screen** (Lensy +
   progress row + mode grid) in the shared **`GameShell`**, like every other node; **Quick Play** (the v1
   straight swipe), Story, Daily, Boss Rush and Flag-pedia are the modes. Live.
   *Matured:* character-portrait reactions (😊/😟/🫂), a subtle Clarity-driven **music bed** (ducks on
   serious cards, mute-aware), a distinct "shatter" on a busted disguised card, and a **gentle,
   non-punitive reading timer + speed bonus** (counts only once accuracy is high; Calm Mind removes it,
   Slow-Mo widens disguised cards), completing the GDD juice + mastery-dial spec.
4. ✅ **Meta-progression + modes** *(done)*: persisted run meta in `store.tsx` (XP/coins, runs
   completed, **lifetime disguised-card accuracy** = the headline signal, per-arc clears). The entry is a
   deliberately **text-light 3-step flow**: **Step 1 Mode**: Story · Daily (date-seeded) · **Easy**
   (= Quick Play swipe) · **Hard** (= Boss Rush, the disguised/boss gauntlet framed by "Coach"); **Step 2**
   pick a story; **Step 3** pick **powers** (= the Insight perks). Daily/Easy/Hard start in one tap with a
   default power pair. A cleared story run still turns the path GLRL node "completed", as does the v2 finish
   (see the completion note at the top).
   *(Flag-pedia character-arc entries surfaced lightly as deck progress in the hub; deeper Flag-pedia
   integration deferred.)*
5. ⏳ **l10n + a11y**: Hindi content, School-Comfort for runs, audio narration, reduced-motion juice.

**Deferred (GDD Phase 2/3):** full perk catalogue, more decks/branches, Classroom Mode, async Spot
Check, teacher dashboard, **Build-a-Flag UGC** + moderation, co-op, deeper cosmetics/analytics, the
250-400-card bank, the advanced "It depends" swipe. Migrating onto a shared Owhile
[Engine SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md) remains future work: see
[SwipeEd → current state](swipeed.md#current-state-vs-the-plan).

## Related
- [SwipeEd (app)](swipeed.md) · [Core principle: Unlearn → Relearn → Grow](swipeed-core-principle.md) · [MythBuster: Gender](mythbuster-gender.md) (shares the swipe engine) · [Games catalog](index.md)
