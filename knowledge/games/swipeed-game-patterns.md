---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/swipeed-game-patterns.md
title: SwipeEd - Reusable Game Patterns
description: The cross-game design + engineering decisions proven in SwipeEd's games (especially Green Light / Red Light 2.0) that every new game and the future Engine SDK should inherit - so we don't re-derive them each time.
tags: [swipeed, patterns, game-design, conventions, engine-sdk]
timestamp: 2026-06-19T19:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
---

# SwipeEd - Reusable Game Patterns

These are the **decisions we keep making on purpose** across SwipeEd games - distilled from
[Green Light / Red Light 2.0](green-light-red-light.md), the ten gender games, and the
[core principle](swipeed-core-principle.md). A new game (or unit, or the eventual shared
[Engine SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md)) should **inherit these rather than reinvent them**. This is
a **living doc** - see [keeping it current](#keeping-this-current).

## The patterns

1. **Content is data, never hard-coded.** Cards / decks / perks / scenarios are typed data in
   `src/content/*`, `locale`-keyed, so educators add, edit and translate without engineering. *Why:* the
   content *is* the curriculum; it must be reviewable, versioned and localisable. *Schema example:* the
   GLRL [card schema](green-light-red-light.md#card-schema-the-cms-contract).

2. **One reusable engine per *verb*; games are content on it.** Build the interaction once (the swipe
   atom `useSwipeGame`; the run layer `useRunGame`; the DOM-engine `engine-host` registry) and feed it
   content per topic/age - the way Duolingo runs thousands of exercises on a few types. *Why:* this is
   SwipeEd's keystone economic bet (see [engines table](swipeed.md#the-lesson-engines-the-keystone)).

3. **Play in place; finish into a shared completion.** Every game launches **in place** over the path
   grassland (no navigation away) and finishes into a shared completion card (`GameDone`, or a richer
   debrief that records to the profile). *Why:* one coherent world, one progress surface.

4. **No hard fail; never reward speed.** Use a *stake* (GLRL's **Clarity** meter), not "lives";
   running out resolves into a **reflective ending + review-the-missed**, never "Game Over". Reward a
   thoughtful read, not a fast one; the hardest (disguised) items are worth the most. *Why:* the ethics -
   being wrong is growth, not failure ([Unlearn → Relearn → Grow](swipeed-core-principle.md)).

5. **Safeguarding is never scored.** Genuine-abuse cards (`is_safeguarding`) are never scored, never
   move the stake, and route to a calm **support screen**; **Get Help** (Childline 1098, POCSO e-Box) is
   one tap away on every screen. *Why:* some players are living the scenarios.

6. **White-hat engagement only.** The "one more run" pull comes from mastery + curiosity - **no** FOMO
   timers, heart-gating, pay-to-continue, or public ranking on sensitive content; rewards are
   **cosmetic-only**. *Why:* we will not use dark patterns on minors.

7. **Aids never auto-win.** Perks / hints / power-ups aid *reading, learning or comfort* (e.g. Slow-Mo,
   Truth Serum, Calm Mind) - none marks an answer correct, and all are **earned by play, never bought**.

8. **Name the behaviour - one taxonomy.** Teach a transferable vocabulary (GLRL's One Love **20 signs**);
   the reveal **names** the thing ("That's Guilting"). *Why:* naming is what makes the lesson transfer.

9. **A two-phase misconception beat.** *(Engine-generalisable; grounded in the published continued-influence effect - refuting a misconception fails unless a coherent replacement is supplied. **The Equal Lens's** expression of it - the UN & RE characters, the erase/redraw art, and the words "Unlearn. Relearn. Grow." - is TEL IP and stays in TEL's app. The engine ships the beat's shape and its gate, never TEL's skin of it.)* Formerly written as: At genuine misconception moments (a missed disguised card, a
   busted myth) run the **UN** (gently erase, no shame) + **RE** (redraw with a reason) move - used with
   restraint, never every card. See the [core principle](swipeed-core-principle.md).

10. **Accessibility is non-negotiable.** **Colour is never the only signal** (always icon + label +
    position); every gesture has a large-button equivalent; text is resizable; **offline PWA**;
    anonymous on-device state. **Audio narration** (the youngest, pre-literate games) lives in
    `src/lib/speak.ts` and has a contract: **strip emoji before speaking** (don't read "smiling face"),
    **hold transitions until the line finishes** (`onEnd`, with a length-based fallback when muted), and
    offer a **"hear it again" replay**. The voice is the **device Web Speech API** (`window.speechSynthesis`,
    `en-IN`) - free, on-device, no network or per-play cost. (A 2026-06-23 exploration of an in-browser neural
    voice (Kokoro), a `/voice` tuning lab, per-chapter voices, and a pre-generated-clips pipeline was **reverted**
    at the founder's call - back to plain Web Speech. If revisited, pre-generated clips were the most promising
    path: render the static authored lines to audio at build time, play cached files behind the same `speak()`.)

11. **One shared juice layer, consistent across games.** Game feel lives in **`src/lib/juice.ts`**
    (Web-Audio SFX with no asset deps, haptics, shake/pulse) - every game uses it, so they sound and feel
    alike. The shared **`celebrate()`** carries the positive chime (small → "green", big → "win") so any
    game that celebrates is automatically consistent; the swipe atom + run own their per-card sound
    (green / red / combo / **shatter** on a disguised bust) and pass `celebrate(…, { sound: false })` to
    avoid double-play. A **global mute** (Settings → Sound) is synced to the layer. All of it is gated by
    `prefers-reduced-motion` (motion only - sound still plays) + mute, and pauses on `document.hidden`.
    *Why:* feel is the cheapest big upgrade, and consistency makes the whole app feel like one product -
    never at accessibility's cost.

12. **Progress persists simply + forward-compatibly.** One profile in `localStorage`, **default-merged
    on load** so new fields need no storage-key bump; track per-deck stars, sign mastery, and the
    **headline learning signal** (disguised-card accuracy), not just minutes.

13. **Text-light, age-adaptive, friendly-app tone.** Closer to a messaging app than a clinical poster;
    minimal subtext, stepped flows; co-play + audio for the youngest, self-directed for teens. ("Cringe"
    loses this audience fastest.)

14. **Made for India + School-Comfort.** Behaviour-only content (no sexual content; age of consent is 18
    under POCSO); a **School-Comfort** toggle hides/softens romantic decks; Indian names/settings;
    English + Hindi via content translation, not code.

15. **Don't villainise a whole category.** For a relationship type that includes loving relationships
    (family, friends, partners), balance the red cards with **genuine green** ones - a relative's caring
    'no', a friend who truly apologises, a partner who respects a boundary - so the category isn't
    painted as inherently unsafe. Let the *disguised control-myth* be the boss; keep any safeguarding ▲
    card a calm, separate beat. *Why:* the goal is discernment, not fear or stigma. (Established by the
    Toxic Friend / Family & Boundaries arcs in [GLRL 2.0](green-light-red-light.md).)

16. **Sensitive topics: empower, never frighten.** For safeguarding/body-safety/abuse content, the tone
    is warm and the child is shown as *capable*, never the world as dangerous. **"It's never your fault"**
    is repeated and unconditional; the topic is **co-played** with a grown-up; situations are calm,
    **non-graphic** cartoons + plain words (no alarm imagery/sounds); a persistent **Get Help** route +
    a real **helpline** (Childline 1098 / POCSO e-Box) is always present; and the lesson is **"keep
    telling until someone helps."** Culturally-sensitive specifics (e.g. correct anatomical names) sit
    behind the **School-Comfort** toggle with caregiver framing. (Established by
    [My Body, My Rules](my-body-my-rules.md); the seed of the Safety & Consent thread.) **Teen extension
    ([Firewall](firewall.md), online safety):** for high-stakes harms (grooming, sextortion), add a
    **rehearsable, no-blame action plan** for the worst case (don't panic → save → block → tell → report),
    keep a **persistent "it's not your fault"** message, teach **recognition & safe response only - never
    how-to-harm**, frame a **minor as a protected victim** (POCSO/IT-Act) never the wrongdoer, and route
    real situations urgently to help (cybercrime 1930 · Childline 1098), with the most explicit naming
    behind **School-Comfort**.

17. **Let every child build themselves in.** Identity/family builders must represent *every* child:
    make them **additive (repeats allowed)**, not single-select, so any structure is buildable -
    explicitly including **same-sex parents (two mums / two dads)**, single-parent, joint/extended,
    grandparent-led, adoptive/foster/guardian families, and a diverse cast (skin tones, faiths,
    abilities). Never make a child feel their family/identity is "not an option." (Established by the
    family builder + Safety Net in [My Family Garden](my-family-garden.md) /
    [My Body, My Rules](my-body-my-rules.md) - going beyond the GDDs, which omitted same-sex parents.)
    The avatar builder is a **shared component** (`components/games/make-a-kid.tsx`) reused across games
    (Make-a-Friend / Make-a-Can-Do-Kid), so disability inclusion is baked in everywhere by default.

18. **Ask-It: a safe outlet for the unaskable, that always routes distress to help.** From ages 9-12 up,
    sensitive topics need a private channel for the questions a child can't ask aloud. The **Ask-It box**
    (debut: [Puberty Quest](puberty-quest.md)) presents vetted, never-shaming answers to common anonymous
    questions - **no PII collected** - and **always includes a distress/safeguarding item that routes to a
    trusted adult, a counsellor, or Childline 1098** rather than only answering. It becomes a recurring
    fixture for older-age games; keep answers accurate, kind, and help-routed.

19. **Myth-bust by choosing the truth, not just tapping "bust".** When a topic is rumour-soaked (puberty,
    media, health), make the [UN & RE](swipeed-core-principle.md) beat a **meaningful choice**: present the
    myth + candidate facts and let the child **pick the true one** (no-fail - a wrong pick nudges "that's
    another myth, try the true fact"), *then* play UN (erase, never blame: "lots of kids hear this") → RE
    (redraw with a friendly reason). A **boss myth** can cap an area. (Established by Puberty Quest's Myth
    Monster battles; reusable wherever misconceptions cluster.)

20. **Wellbeing register: healthy coping only, crisis-routing first, never therapy.** For
    mental-health/resilience content, pattern #16's warmth deepens into a stricter contract: the strategy
    library is **healthy-only by design** - breathing, grounding, talking, moving, resting, connecting,
    self-kindness - and the system **cannot author in** anything using pain, shock, restriction or a
    self-destructive habit. It **never reinforces self-criticism** (models self-compassion; no negative
    self-talk amplification; no ranking of feelings), **routes any sign of serious distress straight to
    real help** with warmth + resources (Tele-MANAS 14416 · Childline 1098), **not**
    safety-assessment questions, and is honest that it is **skills & signposting, not therapy**. The
    reusable mechanic is **"pick the kind AND true thought"**: present a real setback + candidate
    self-talk, let the player choose the self-compassionate, true one (no-fail; a harsh pick nudges back).
    Stigma is the **key UN & RE unlearn**. (Established by [Mind Matters](mind-matters.md) (#g38, ages
    9-12) and [Bounce](bounce.md) (#g39, ages 12-15); Bounce raises it to **crisis-routing-first**. The
    anonymous **Ask-It** here needs the strongest distress triage in the thread - see pattern #18.)

21. **The skills spine: a persistent toolkit + in-context "tool moments".** A cross-cutting skill (here
    Thread C's [Life-Skills Toolkit](life-skills-toolkit.md) - Cool-Down · Decision Steps · Talk-It-Out ·
    Help Map) is far stronger as a **persistent, levelling object the child carries across games and years**
    than as one-off lessons. Two reusable moves: (a) **own & level in a home, reference everywhere** - a
    dedicated game *teaches* the skill and unlocks/levels it on completion; an **on-device toolkit object**
    (default-merged into `Profile`) records level, and other games **reference, not duplicate** it; (b)
    **authored "tool moments"** - a short, **optional, never-blocking** prompt (`<ToolMoment>`) injected at
    high-stakes beats in *other* games ("This is a Cool-Down moment - want to use it?") so the skill is
    practised in the exact context it's needed, hundreds of times. Pair with a **wellbeing app-shell**
    (mood check-in, breathing space, calm mode, **kind streaks with a freeze and no shame**, day/night
    wind-down) and a **capstone reflection** that surfaces skill growth, not just topic knowledge. Hard
    rules carry over from #20: healthy-only library, routes to real help, on-device/never-uploaded, never
    therapy. (Design-of-record: [Life-Skills Toolkit (Thread C Spine)](life-skills-toolkit.md).)

22. **The de-radicalisation register: never shame, follow the funnel & the money, offer a better answer.**
    For content where kids are being *recruited* into a harmful worldview (online misogyny / the
    manosphere - [The Rabbit Hole](rabbit-hole.md)), the make-or-break rule is that **the funnel, not the
    kid, is the problem**: never "boys/men are bad", compassion for the unmet need underneath
    (loneliness, identity, belonging), and **evenhanded** (dismantle us-vs-them, never flip it). Teach the
    **mechanism** (the algorithmic funnel) and the **grift** (the business model - "you're the product,
    he's selling the cure for a problem he invented"), not just a verdict - media-literacy-led, building on
    [Reality Check](reality-check.md)/[Decoded](decoded.md). **Never platform the real thing** - synthetic
    examples only; no real names/material can be authored in. Always **offer the positive alternative** as
    the heart (here, positive masculinity), and **route the underlying distress to real help**. UN & RE
    bust the claims without shaming a teen for having found them convincing. (Established by The Rabbit Hole
    (#g43, ages 12-15); the boys'-side front of the gender mission.)

23. **The ModesEngine: a mode-game is a config, not a component.** Most SwipeEd lessons share the same
    shape - a **home grid of modes + Lensy host + a Badge Book + a shared completion** - over a few reusable
    **mode kinds**: a **scenes** chooser (read a situation → pick the move; no-fail, a wrong pick nudges),
    a **myths** beat (pick the true fact → **UN → RE**), a **tap-reveal list** (a standard, tapped one by
    one), and **Ask-It** (private Q&A, the **help item routes distress**). Build that **once** as a generic
    engine (`components/games/modes-engine.tsx`, driven by a typed `GameConfig`) and a new game becomes a
    **content config + one registry line** - pattern #2 made concrete, and the velocity unlock for the adult
    journey (26 games). Keep genuinely *different* verbs (GLRL's roguelike, sims like Plan It / Equalize,
    builders) as their own components; the engine is for the mode-game majority. [Consent, For Real](consent-for-real.md)
    (#g44) is the hand-built reference the engine generalises. (Established building the adult journey,
    ages 18-22.)

24. **The reworked-GDD game: a bespoke verb-set on an 80+ scenario library.** The Chapter-1 rework
    (build bible · transition plan) redefines a game as *the verb, the personas, the belief it moves,
    and a researched 80+ scenario library it runs on* - **not** another MCQ on the shared ModesEngine.
    The build shape proven on the [Feelings Friends](feelings-friends.md) (#g01) pilot: a **bespoke
    component implementing the game's distinct verb-set** + the **scenario library as a typed content
    file** (`content/games/<id>.ts`: per-scenario `id·cat·situation·prompt·options·answer·relearn·myth?·
    persona·mechanic·source`), run as the **micro-loop** (Hook → Play → **UN→RE** on `myth` items → Apply
    → Sticker) and **rotated so no beat repeats twice running**. Reuse GameShell/GameDone/speak/Lensy/UN→RE;
    keep the `gameId` contract (records once, levels its Thread-C tool). Two build gotchas every one of
    the 68 inherits: (a) **the scenario libraries list the correct answer first in every record - the
    engine MUST shuffle option order at render time** (else the right tile is always slot 1); (b) a
    game's in-UI **"Calm Mode" must drive the shared `prefersReducedMotion()` path** (toggle
    `profile.calmMode` via the store, which calls `juice.setCalm()`), not a local flag - otherwise the
    labelled accessibility control still fires confetti/motion. (Established building #g01 to GDD 01.)

25. **Mechanic-driven loop + bespoke verb renderers (one game, several verbs).** g01 ran one interaction
    shape (tap-a-tile) keyed by `cat`; [My Body, My Rules](my-body-my-rules.md) (#g02) proves the richer
    form: **drive the micro-loop by each scenario's own `mechanic` field**, with the component holding **N
    distinct interaction renderers**, so a single game is genuinely several verbs and every scenario routes
    to the verb its lesson needs (the build bible's "the mechanic IS the lesson"). The reusable renderers
    this established: **sort-into-bins** - categorise a card into colour-coded bins (safe/not-safe/uh-oh;
    secret/surprise), colour *never* the only signal (each bin carries emoji + word); the **tactile
    "say-it-loud" Voice verb** - a giant assertion button (+ a small distractor) with haptic, for
    rehearsing a script (the Big No); the **additive roster builder** - pick 3-5, repeats allowed (the
    safety team, two mums/two dads); and a recurring **song/chant anchor** (PANTS, P-A-N-T-S). Plus two
    safeguarding-grade contracts for sensitive games: **disclosure-routes-to-reassurance** (a wrong tap on
    a safeguarding item gets warmth + "it's never your fault", never a buzzer; safeguarding is never
    scored) and **reference-don't-level** a Thread-C tool (a non-Thread-C game drops a non-blocking
    `ToolMoment` that self-hides until the tool is unlocked and never raises its level - so e.g. g02
    *references* Help-Map without leveling it). (Established building #g02 to GDD 02.)

26. **The v2 "mechanic-embodying" standard: ONE shared typed-mechanic engine, bespoke content per game.**
    The GDD-rework **v2 schema** supersedes the v1 flat `options/answer` scenario (patterns #24-#25 were the
    v1-rework shape) with a **typed** scenario - `type` (one of ten play actions) + a per-type payload -
    so the lesson IS the verb and a library is **0% binary "tap the right card"**. The ten mechanics +
    payloads: **reflect** (`options[]`+`affirm`, every option valid → no wrong answer), **role-play**
    (`yourLine[]` with one `best` - the say-it Voice verb), **strike-rewrite** (`myth{un,re,why}` - the
    UN→RE beat), **branch** (`options[]` each with `consequence`/`outcome`/`best` + a `debrief` - real
    choices with results), **sort** (`items[]`→`bins[]` via `key`), **match** (`pairs[]`), **build**
    (`pieces[]`+`key`, `mode:"assemble"|"sequence"`), **explore-label** (`parts[]`+`find`+`answer`+`reveal` -
    tap the part that matches a clue → it reveals a fun fact; added for **#g06** Body Lab Juniors as the
    body-science discovery verb), **spot** (`scene[{id,text,trick}]`+`why` - tap the "trick"/red-flag, the
    `trick:true` item is the answer, `why` explains on resolve; a wrong tap warmly re-asks, no fail; added for
    **#g08** Safety Squad as the spot-the-trick / inoculation verb), **swipe** (`cue`+`left`/`right`+`answer` -
    read a relationship cue and swipe it the right way, e.g. green-flag / red-flag; a wrong swipe warmly re-asks,
    no fail; `relearn` on resolve; added for **#g24** Green Light / Red Light, the teen flagship, as its namesake
    green-light/red-light flag-reading verb - `SwipePlay` renders two directional flag buttons, colour + emoji +
    label so colour is never the only signal). One **shared engine**
    (`components/games/v2-engine.tsx`; schema `content/games/v2-schema.ts`) renders all ten as the micro-loop (Hook → Play → resolve →
    Sticker, rotated so no mechanic repeats); **each game is a thin wrapper** feeding its researched typed
    library + a `V2GameConfig` (categories, greet, badge, helpLine/helpLabel, reassureCats). Depth lives in
    the **content**, not the engine - this is the GDD-sanctioned "shared templates", NOT the rejected MCQ
    ModesEngine. **Hard-won engine contracts** (from adversarially reviewing the pilots - bake these in):
    completion must NOT be gated on a speech `onEnd` (a muted 3-6-y/o tap swallows it → `setView("done")`
    immediately, narrate the badge on the done screen); the **"never your fault" reassurance + Get-Help is
    content-driven** (any branch with an escape-and-tell `outcome:"safe"`), never category-gated, so a
    grooming beat in *any* category surfaces it; every interaction is **audio-first** (speak the branch
    consequence + sort/match nudges, not just the hook) and **no-fail** (warm nudge, never a buzzer);
    **colour is never the only signal** - every sort bin carries a distinct emoji+word (guarantee
    distinctness; never red-🚫 a neutral category like "not private"); shuffle sequence-build pieces;
    honour OS `prefers-reduced-motion`, not just the in-app Calm toggle. (Established retrofitting
    **#g01 + #g02** - Feelings Friends & My Body My Rules - to GDD 01/02 v2 on the shared engine.) The engine
    has since stayed stable as games were added (**#g03 #g04 #g05** needed zero engine change beyond
    accreting per-game knobs - `buildLabels` for the build "done" button, `binStyle` bin vocabulary with
    collision-avoidance for distinctness); **#g06** added the eighth mechanic (explore-label) for the
    Chapter-2 body-science game - the first new *shape* since the pilots. **#g07** (What Makes Me, Me, the
    gender-thread root) reused all seven existing mechanics - its only engine change was a `binStyle`
    valence accretion, governed by a **reusable sort-tinting principle**: a sort that teaches a *good-vs-bad*
    distinction (respectful/not, builds-respect/breaks-it, true/too-tight-box) reads **green/red**, but a
    sort that teaches a *neutral categorisation* (sex vs gender vs expression - "my body" vs "my inside-self",
    "about the body (sex)" vs "about inside-self (gender)") MUST stay **neutral** (blue/purple), because
    tinting one side green would falsely imply it is "better". Verify any new sort vocabulary with a
    truth-table over all the game's bins before shipping. **#g08** (Safety Squad) added the **ninth** mechanic
    (spot) + a `binStyle` accretion (tricky/risky → red) and exercises the **content-driven safety machinery**:
    its config sets `helpLine`/`helpLabel` (Childline 1098) + `reassure` + `reassureCats`, so every touch beat
    and every branch with `outcome:"safe"` resolves on the "never your fault" banner + the Childline Get-Help
    pill. **With g08 all nine "pre-protocol" libraries (g01-g08, g37) are v2** (the founder's Step-1 batch).
    NOTE (as of that step): that was *not* all of Chapters 1-2 - Chapter 2 still had **g09 Friend or Frenemy,
    g41 Heart Smart, g10 Fair Play World, g11 Not Fair Not Funny, g12 Smart Screen Heroes** plus capstone
    **c2** to retrofit. **Since superseded - the retrofit is complete:** all 69 lesson games and all 8
    capstones are v2 and live.

27. **Direct-manipulation interaction model: the interaction IS the verb (gesture + tap fallback).** The v2
    engine's input layer moved from "tap a thing, tap another thing" to real **direct manipulation** - swipe a
    card, drag a chip into a bin, draw a cord plug→socket, scrub a myth out - on **shared primitives built
    once** (`components/games/interactions.tsx`: `usePointerDrag` mouse+touch+pen with an 8px **tap-fallback**
    threshold, `hitTestZone`, `ConnectorOverlay`). **Hard rule: the native-button tap path is kept as the
    keyboard / screen-reader / ages-3-6 floor** (the gesture is additive) - the sole exception is **swipe**,
    which uses drag + ←/→ arrow keys and **no buttons** (its identity is the gesture). Plus the engine-wide a11y
    win: the **Lensy bubble is now `aria-live`**, so every `say()` reaches non-hearing/SR users in one place; and
    **pinch-zoom is restored** (WCAG). No-fail, colour-never-the-only-signal, and reduced-motion-to-instant all
    still hold. This pass also fixed real correctness bugs the tap veneer hid (build always-wins + min(3)
    truncation, branch never-shuffled, role-play double-buzz, spot pre-stamped flag, strike acting on nothing).
    **All 10 mechanics now embody their verb** - `explore-label` landed last (a body figure for anatomy beats,
    honest "which is true?" cards for abstract beats; split content-detected, no schema change). Full
    spec: **[The Interaction Model](swipeed-interaction-model.md)** - consult & update it when changing input.

27. **Message hygiene (2026-06-24, from live design feedback).** Four reusable rules baked into the engine + content:
    - **≤160 characters per visible text block.** Every greet, `helpLine`, `reassure`, `badge.blurb`, and every
      scenario field rendered as a bubble/pill/card is capped at **160 real code points** (emoji & curly quotes
      count as one). Enforce with **`scripts/check_msg_len.py`** (decodes TS strings via `json.loads`, NOT
      `unicode_escape` - the latter mojibakes UTF-8 and over-counts; it also counts strike `re`/`why` separately).
      When tightening safety copy, **keep every helpline number AND its label** and the safeguarding framing - cut
      prose, never a number. (A 12-agent workflow tightened all 60 lesson games this way; verified zero numbers
      dropped vs HEAD.)
    - **Lensy is the narrator, not "Sam".** Greets open "Hey - it's Lensy" / reflect prompts are "Lensy: …". "Sam"
      is retired everywhere user-facing; if a scenario needs a *character* name, use any name other than Sam or Lensy.
    - **The strike-rewrite resolve renders `re` and `why` as two separate blocks** (UnReBeat's optional `why`
      line), so each stays ≤160 - don't concatenate `re + why` into one bubble.
    - **Mechanics never render their own Next.** Every mechanic calls `onSolved` and lets the engine show the
      resolve + the **bottom-pinned** Next. Branch was the lone offender (inline Next floated mid-screen); it now
      passes its picked consequence up via a `branchResolve` so the engine renders it in the standard resolve area.
    - **Per-scenario band ceiling (anti content-drift, 2026-06-24).** Diagnosis of a felt "drift" (per-game text
      rising ~1.9× from Ch.1→Ch.8) showed it was **NOT bloat** - **0 fields exceed 160**, and per-scenario text
      legitimately scales with reader age (a parent's safeguarding node needs more nuance than a toddler's body
      game). The fix was therefore **not** a mass cut (that would gut adult nuance) but: trim only the **densest
      ~5% outlier scenarios** (275, mostly fat `branch` consequence/debrief stacks) and add a **second guard rule**.
      `check_msg_len.py` now enforces, beside the ≤160/field rule, a **per-scenario total-prose ceiling that rises
      by chapter band** (≈360 for ages 3-9 → 500 for adult chapters) - so the curve may rise with age but **can't
      drift past the intended level**. Both rules are wired into the `scripts/githooks/pre-commit` gate (override
      `SWIPEED_MSGLEN_OVERRIDE=1`). **Capstones are exempt from the per-scenario rule** (ceremonial surface; ≤160/field
      only). Trims preserve answer-logic (`best`/`outcome`/`key`/`answer`/`trick` untouched) + every helpline number,
      verified vs HEAD.
    - **Anti-repeat rotation + mechanic depth (2026-06-24).** Games "felt like wrappers" because beats served too
      predictably and too shallow. Engine fixes: (1) **anti-repeat rotation** - a per-game `swipeed:seen:<gid>`
      id-ring in localStorage; both the rotate (one/category) and sub-topic draws pick **unseen beats first** (each
      tier shuffled), capped at ~60% of the bank, so a beat won't recur until you've moved well past it. Plain
      `shuffle()` is memoryless and resurfaced the same beats. (2) **Sub-topic sessions 3 → 6 beats**. (3) **Every
      mechanic must shuffle its options for display** - Sort rendered `items` in AUTHORED order (so with 2 bins the
      up/down answer was memorisable) and Match's left column was fixed; both now `useState(() => shuffle(...))`
      like Branch/Spot already did. (4) **Spot is multi-catch** - `SpotPlay` resolved on the FIRST `trick:true` tap,
      so extra red flags were unreachable (154 scenes already had 2 tricks); it now requires catching **all** tricks
      with an "x/n caught" line, enabling **3 truths + 2 lies** scenes. **Option COUNTS are data-driven** (the engine
      caps nothing: match glyphs/tints cover 6, spot scenes accept any trick count) - so "sort 6 / spot 5 / match 5"
      is a **content** target, met by the bank-growth pipeline, not an engine change. See [the content pipeline](#) note in
      `log.md` (2026-06-24).
    - **Spot answer-keys invert silently - re-derive every one (2026-06-28).** In the spot mechanic `trick:true`
      is **the red flag the child is asked to catch** (engine: "Spot all N red flags", a caught `trick:true` gets
      🚩 "Caught!", tapping a `trick:false` says "That one's okay"). Generators repeatedly **invert** this - marking
      the *good/upstander/safe* item `trick:true` - which is **structurally valid**, so `forge_check` passes it, yet
      it teaches the exact unsafe reflex (e.g. branding "fetch a teacher" a red flag, praising "films the teasing").
      Forge wave 8 caught **8 inverted spot scenes in one category** of `speak-up`; only the adversarial re-derivation
      finds these. **Rule:** any spot/sort/branch/match key is a semantic claim a script cannot verify - the
      different-context reviewer MUST independently re-derive each, and it's the load-bearing safety layer, not a
      formality. Also watch unsafe **heroics** as a hidden red flag (physically "jump in" / "challenge the bully"
      should be `trick:true`, since the taught upstander move is to get help, not intervene bodily).

## Keeping this current
- **Which game is next / what's built?** Don't answer from memory - run **`python3 scripts/swipeed_status.py`**
  (in `swipeed-equal-lens`). It's the single source of truth: reads `master-node-table.xlsx` + the gen-path
  GAME map + the actual content files and prints the path with each node's **v2/v1/unbuilt** status and **the
  next lesson to build** (`--next`, `--assert-next gXX`, `--check`). A **pre-commit hook**
  (`scripts/githooks/pre-commit`, via `core.hooksPath`; `scripts/setup-hooks.sh` to (re)activate) runs it on
  every commit touching `src/{content,components}/games/`, surfacing the status and **blocking on
  inconsistency**. (Added after the next-node was once stated wrong from memory - see [the read-first rule].)
- **Did you actually read the source docs?** The other half of the read-first rule is mechanised too:
  **`scripts/read_first.py`** (npm `read-first`). It resolves a node's five source docs from `Strategy/` - the
  **build bible**, **transition plan**, the node's **reworked-v2 GDD**, the **chapter personas**, and the
  **scenario library** - and verifies they exist (`--require gXX`). After actually reading them you run
  `--attest gXX`, which writes a hash-pinned record `.read-first/<node>.json` naming each doc; you `git add` it
  with the build. The same **pre-commit hook** then runs `read_first.py --gate`: staging a **NEW** v2 game (v2
  now, absent/non-v2 at HEAD) **without** a valid, non-stale attestation for its node **blocks the commit**; if
  a source doc changes after attesting, its hash mismatches → stale → re-read & re-attest. Bypass once with
  `READ_FIRST_OVERRIDE=1`. **Honest limit:** the gate proves the docs exist and that a doc-pinned attestation
  was produced before the build - not comprehension; it removes the excuse and forces a deliberate read-first.
- **Building a game?** Read this doc first and inherit these patterns.
- **Made a new reusable decision (or changed one)?** Add/revise it here **in the same branch** as the
  code - this doc must not lag practice (per [`AGENTS.md`](../../AGENTS.md) / the
  [project log](../log/log.md)). When the shared [Engine SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md) is extracted,
  these patterns are its starting requirements.

## Related
- [SwipeEd (app)](swipeed.md) · [Core principle: Unlearn → Relearn → Grow](swipeed-core-principle.md) · [Green Light / Red Light](green-light-red-light.md) · [Games catalog](index.md) · [Engine SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md)
