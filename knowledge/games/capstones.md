---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/capstones.md
title: Capstones (chapter graduations)
description: The eight gold capstone nodes on the SwipeEd path are warm, no-fail "graduation" milestones that close each age-band chapter by celebrating its big ideas. All eight (ages 3 → parenthood) are built. The path is complete.
tags: [swipeed, capstone, milestone, path, graduation]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62  # SWED-68
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Capstones (chapter graduations)

The SwipeEd [path](swipeed-world.md) has **gold capstone nodes** (`c1`…), one closing each
age-band chapter. A capstone is **not a new lesson**. It's a warm, **no-fail graduation**: the child
(with Lensy) looks back and celebrates the chapter's big ideas, and is awarded the chapter. They reuse
the shared voice model and juice, and finish into the shared [`GameDone`](swipeed.md) card (recording
completion, so the capstone node turns "completed").

## Rich capstone format v1

> **One format now: ALL EIGHT capstones are rich** (c1-c6 + **c7** & **c8**, 2026-06-24: the whole catalog is
> complete). The earlier simple star-recap (v0: tap a star per chapter big idea → graduate) and its old
> `capstone-engine.tsx` are **retired/orphaned**; every capstone runs on the **Rich "Capstone format v1"** (GDD
> c1-c8 + a `Landing.json` design source): a five-beat
> celebration: **arrive & bloom → look back** (the sticker gallery) **→ play back** (one *victory lap* per
> chapter truth, each **re-cued through a different mechanic**: gallery · match · sort · build · spot · swipe ·
> **branch** · **strike-rewrite** · **role-play**, the variable-cue boost) **→ reflect** (non-judged) **→
> celebrate** (certificate + graduation glyph) → preview & share. Built on a **shared rich engine**
> (`components/games/capstone-rich.tsx`) + typed schema (`content/games/capstone-schema.ts`); each capstone is a
> thin `Landing` config (`content/games/capstone-N.ts`, faithful from its Landing JSON). **c1 is the reference;
> c2-c6 follow it.** The **branch lap** (`CapBranchLap`) was added with **c3**; the **strike-rewrite lap**
> (`CapStrikeLap`: "rub out a myth you can now bust, see the truth", no buzzer) with **c4**; the **role-play
> lap** (`CapRolePlayLap`: "say the line you've grown into", a values-led best line cheers you on, no buzzer)
> with **c6**. Registry ids `capstone-1`…`-8` are
> kept (the Landing's `capstone-chN` is design-doc only); never a test; a wrong tap is a gentle nudge. **Both c7
> and c8 Landings were looser than the schema in places**. Faithful builds added `myth.why` (and, for c8's two
> strike laps, the `celebrate` line too) to strike laps, per-option `consequence` + a `debrief` to branch laps,
> reframed v2-style left/right swipes into the capstone's swipe-up-to-affirm, and folded an authored "reflect" lap
> (not a `CapLap` type) into the reflect section as a fifth prompt.
>
> **The laps share the v2 [interaction model](swipeed-interaction-model.md#capstones-share-the-model-2026-06-23)
> (2026-06-23):** chat bubble · three-zone shell with a bottom-pinned Next · and **direct-manipulation gestures**
> (swipe = drag up, sort = drag into a big dropzone, match = draw a cord, strike = scrub the myth, build = drag to
> the slate), tap kept as the fallback. Before this, the capstones still used the old tap-button UI. The post-GLRL
> fixes had only reached the lesson engine.

| Node | Capstone | Chapter | Status |
|---|---|---|---|
| `c1` | **My First Friends** | Ch.1 · Ages 3-6 | ✅ **rich (format v1)**, the reference |
| `c2` | **Fair & Safe Explorer** | Ch.2 · Ages 6-9 | ✅ **rich (format v1)** |
| `c3` | **Growing Up Smart** | Ch.3 · Ages 9-12 | ✅ **rich (format v1)**: adds the branch lap; closes Ch.3 |
| `c4` | **Reading Relationships** | Ch.4 · Ages 12-15 | ✅ **rich (format v1)**: adds the strike-rewrite lap; closes Ch.4 |
| `c5` | **Ready for the World** | Ch.5 · Ages 15-18 | ✅ **rich (format v1)**: 9 laps incl. swipe/spot/branch/sort/match/strike-rewrite; closes the whole 4-18 journey |
| `c6` | **Standing on My Own** | Ch.6 · Ages 18-22 | ✅ **rich (format v1)**: adds the role-play lap; closes the College adult journey |
| `c7` | **A Life, Built** | Ch.7 · 22 → first child | ✅ **rich (format v1)**: 7 laps (gallery·sort·strike-rewrite·branch·match·swipe·role-play) + 5 reflect; closes the whole 3→first-child journey |
| `c8` | **Full Circle** | Ch.8 · Parenthood | ✅ **rich (format v1)**: 8 laps (gallery·strike-rewrite·branch·role-play·match·swipe·strike-rewrite·sort) + 5 reflect; **the FINAL capstone, which closes the entire 3→parenthood catalog** |

## Capstone 1: My First Friends (built)
The Chapter 1 (ages 3-6) graduation. Lensy invites the child to **tap a star for each of the chapter's
six big ideas**: name your feelings ([Feelings Friends](feelings-friends.md)), *my body, my rules*
([My Body, My Rules](my-body-my-rules.md)), wash, brush & care for my body every day
([Clean Crew](clean-crew.md)), every family is special + kindness grows
([My Family Garden](my-family-garden.md)), same inside / different outside
([Same Same, Different](same-same-different.md)), anyone can do anything
([Can-Do Kids](can-do-kids.md)). When all six shine, Lensy **graduates** the child ("Chapter One
complete! 🎓"). Engine id `capstone-1`, node `c1`, route `/game/capstone-1`. Audio-first, no-fail,
co-played; no gates (playable any time, per the path's no-gates rule).
**Now built to the rich Capstone format v1** (the reference implementation; see the callout above): the six
truths are replayed as **eight victory laps** through varied mechanics (gallery · match · sort · build · spot ·
swipe), then four reflections and the **Friendship-Garden bloom** certificate. On the shared
`capstone-rich.tsx` engine, faithful from the c1 Landing JSON.

## Capstone 2: Fair & Safe Explorer (built)
The Chapter 2 (ages 6-9) graduation. Same recipe as Capstone 1, scaled to the chapter's **eight big
ideas**, one star per Chapter-2 game: every body is amazing & every skin is good
([Body Lab Juniors](body-lab-juniors.md)), gender "rules" are made up
([What Makes Me, Me](what-makes-me-me.md)), safe vs unsafe + tell a trusted adult
([Safety Squad](safety-squad.md)), a true friend is kind ([Friend or Frenemy?](friend-or-frenemy.md)),
notice feelings / calm the big ones / get along ([Heart Smart](heart-smart.md)),
everyone shares & every child gets the same chances ([Fair Play World](fair-play-world.md)), if it hurts
it's not a joke: stand up kindly ([Not Fair, Not Funny](not-fair-not-funny.md)), and think for yourself /
stay healthy / be kind ([Smart Screen Heroes](smart-screen-heroes.md)). When all eight shine, Lensy
graduates the child a **Fair & Safe Explorer** ("Chapter Two complete! 🎓"). Engine id `capstone-2`, node
`c2`, route `/game/capstone-2`. Audio-first, no-fail, co-played. **This completes Chapter 2**. All of
Chapters 1 and 2 (ages 3-9) are now built.
**Now built to the rich Capstone format v1** (following the c1 template): the eight truths replay as **eight
victory laps** through varied mechanics (gallery · match · sort · spot · build · swipe) on the **explorer's
map**, then four reflections and the **golden explorer-compass** certificate. On the shared `capstone-rich.tsx`
engine, faithful from the c2 Landing JSON.

## Capstone 3: Growing Up Smart (built)
The Chapter 3 (ages 9-12) graduation. Same recipe, scaled to the chapter's **nine big ideas**, one star
per Chapter-3 game: every body changes & I've got the facts ([Puberty Quest](puberty-quest.md)), all
feelings are OK / name them / cool down / bounce back / ask for help ([Mind Matters](mind-matters.md)), the
science of how a new life begins ([The Amazing Journey](the-amazing-journey.md)), ask first / respect a no
/ stay safe online ([Boundary Bot](boundary-bot.md)), choose who I'm becoming at every crossroads
([Crossroads](crossroads.md)), spot the stereotype & flip the script ([Flip the Script](flip-the-script.md)),
keep the good & question the harmful ([Norm Storm](norm-storm.md)), spot harm / respond safely / it's never
my fault ([Speak Up](speak-up.md)), and stay healthy / bust the myths / care-not-fear
([Defenders of the Body](defenders-of-the-body.md)). When all nine shine, Lensy graduates the child
**Growing Up Smart** ("Chapter Three complete! 🎓"). Engine id `capstone-3`, node `c3`, route
`/game/capstone-3`. Audio-first, no-fail, co-played. **This completes Chapter 3**. Chapters 1-3 (ages
3-12) are now fully built.

**Now reworked to the rich Capstone format v1** (2026-06-23, following the c1 template): the nine truths replay
as **ten victory laps** through varied mechanics (gallery · match · swipe · sort ×3 · **branch** · spot · build),
then four reflections and the **Growing-Up constellation** (`growing-up-star`) certificate. On the shared
`capstone-rich.tsx` engine, faithful from the c3 Landing JSON. c3 introduced the **branch lap** (`CapBranchLap`:
the decision-game victory lap from [Crossroads](crossroads.md)) and the ten Chapter-3 glyph emojis. The old
simple eight-star build is retired. **Chapters 1-3 capstones are all rich now.**

**2026-09-15 ([SWED-68](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62)):**
the Norm Storm match lap (`c3-p8`) could not be finished, because two of its three pairs had the same answer
("Helps everyone") and matching one disabled both cells (SWED-56). The engine now handles repeated labels, and the
lap was rewritten so each norm has its own answer: "Be kind to guests" → "Makes people feel welcome", "Girls eat
last" → "Says some people matter less", "Wait your turn" → "Keeps things fair for all".

## Capstone 4: Reading Relationships (rich, format v1)
**Now reworked to the rich Capstone format v1** (2026-06-23, following the c1 template): the **eleven** chapter
truths replay as eleven **victory laps**, each re-cued through a different mechanic (gallery · branch · swipe ·
sort · **strike-rewrite** · build · spot · match) → four reflects → celebrate (the Reading-Relationships
constellation lights up + a graduation star + certificate). Driven by the c4 Landing JSON on the shared
`capstone-rich.tsx` engine. **c4 introduced the strike-rewrite lap** (`CapStrikeLap`: rub out a gender myth
you can now bust, then see the truth; no buzzer), the variable-cue match to its chapter's myth-busting
flagships. `gameId "capstone-4"` (the Landing's `capstone-ch4` is design-doc only). The simple-star description
below is superseded.

The Chapter 4 (ages 12-15) graduation. Same recipe, **eleven big ideas**, one star per Chapter-4 game:
my body is mine & I spot the filters ([Body Confident](body-confident.md)), stress & setbacks pass / build
resilience / bounce back / reach for help ([Bounce](bounce.md)), how pregnancy happens & how
planning protects my future ([Plan It](plan-it.md)), knowledge stops the spread & stigma is the real enemy
([Outbreak](outbreak.md)), reading the green/red flags ([Green Light / Red Light](green-light-red-light.md)),
gender stereotypes are myths ([MythBuster: Gender](mythbuster-gender.md)), equality lifts everyone
([Equalize](equalize.md)), step in safely when I see harm ([Stand Up](stand-up.md)), spot online traps /
protect what I share / if it goes wrong it's not my fault ([Firewall](firewall.md)), see the manosphere
funnel & grift / real strength lifts ([The Rabbit Hole](rabbit-hole.md)), and spot what's real/
staged/fake online ([Reality Check](reality-check.md)). When all eleven shine, Lensy graduates the teen
**Reading Relationships** ("Chapter Four complete! 🎓"). Engine id `capstone-4`, node `c4`, route
`/game/capstone-4`. **This completes Chapter 4**. Chapters 1-4 (ages 3-15) are now built.

## Capstone 5: Ready for the World (rich, format v1), the final graduation
The Chapter 5 (ages 15-18) graduation **and the final graduation of the whole 4-18 journey**. **Reworked to
the rich [Capstone format v1](#rich-capstone-format-v1)** (replacing the old nine-star tap build), it runs on
the shared rich engine (`capstone-rich.tsx`) from its Landing config (`content/games/capstone-5.ts`): **arrive
→ look back** (the "Ready for the World" constellation gallery, nine Chapter-5 stickers crowned by the
whole-journey star) **→ play back** nine victory laps, each a chapter truth re-cued through a *different*
mechanic: gallery, **swipe** (Mutual: mutual consent; My Choices: what's yours to decide), **spot** (Decoded:
catch the dark pattern), **branch** (Change Makers; Life Ready: managing your own money), **sort** (Spectrum:
respect), **match** (Justice League: need → real help route), **strike-rewrite** (Status: Know It: knowing is
strength) **→ reflect** (four gentle prompts on how far you've come) **→ celebrate** (constellation + sunrise +
a whole-journey graduation certificate, ages 4-18). Recaps the nine Chapter-5 lessons (My Choices, My Future ·
Status: Know It · Mutual · Spectrum · Lead the Way · Change Makers · Justice League · Life Ready · Decoded).
Added the Chapter-5 glyph→emoji set (choice-compass 🧭 · status-strength 🩺 · mutual-hearts 💞 · spectrum-prism
🌈 · lead-torch 🔦 · change-spark ⚡ · rights-shield 🛡️ · life-toolkit 🧰 · decoder-lens 🔍 · the crowning
ready-for-the-world-star 🌅). **gameId trap:** the Landing's `capstone-ch5` is aspirational; the engine-host
registry id is **`capstone-5`**: config uses `capstone-5`. Node `c5`, route `/game/capstone-5`. No score, no
fail. **This closes the 3-18 child path**: all 43 child-journey lesson nodes and all 5 child-journey capstones
are **built to their v2/rich standard**.

## Capstone 6: Standing on My Own (rich, format v1), the College graduation
The Chapter 6 (ages 18-22, College) graduation. **Reworked to the rich [Capstone format v1](#rich-capstone-format-v1)**
(replacing the old nine-star tap build on the simple `capstone-engine.tsx`), it runs on the shared rich engine
(`capstone-rich.tsx`) from its Landing config (`content/games/capstone-6.ts`): **arrive → look back** (the
"Standing on My Own" constellation gallery, nine Chapter-6 stickers) **→ play back** nine victory laps, each a
chapter truth re-cued through a *different* mechanic: gallery, **swipe** (My Choices-style affirmations),
**branch**, **sort**, **strike-rewrite**, **match** (need → help route), **role-play** (Equal & Confident: amplify
a colleague), strike-rewrite, swipe **→ reflect** (four gentle prompts on standing on your own) **→ celebrate**
(constellation + a genuinely-independent-young-adult certificate). Recaps the nine Chapter-6 lessons (Consent,
For Real · Swipe Right? · Real Relationships · Own Your Health · Money & Independence · Mind & Belonging · Find
Your Feet · Equal & Confident · Know Your Rights). **The first capstone to use the role-play victory lap**, added
to the rich engine here (`CapRolePlayLap` type + `RolePlayLap` renderer: pick the values-led `best` line and it
cheers you on, no buzzer). Added the Chapter-6 glyph→emoji set (consent-real 🫶 · swipe-smart 💘 · real-relationships
💞 · own-health 🩺 · independence-key 🔑 · mind-belonging 🫂 · find-feet 🧭 · equal-confident 🗣️ · the crowning
standing-on-my-own-star 🌟). **gameId trap:** the Landing's `capstone-ch6` is aspirational; the engine-host
registry id is **`capstone-6`**: config uses `capstone-6`. Node `c6`, route `/game/capstone-6`. No score, no
fail. **This closes the College adult journey**: all nine Chapter-6 lessons (g44-g52) and the c6 capstone are
now built to their v2/rich standard.

## Capstone 7: A Life, Built (rich, format v1), the Building-a-Life graduation
The Chapter 7 (ages 22 → first child, "Building a Life") graduation. Built to the rich
[Capstone format v1](#rich-capstone-format-v1), matching c1-c6 on the shared rich engine (`capstone-rich.tsx`)
from its Landing config (`content/games/capstone-7.ts`): **arrive → look back** (the "A Life, Built" constellation
gallery, eight Chapter-7 stickers) **→ play back** seven victory laps, each a chapter truth re-cued through a
*different* mechanic: gallery, **sort** (deep green flag vs surface shine, from g53), **strike-rewrite** (helping
vs owning, g55), **branch** (believe-and-help a friend, g56), **match** (money setup → purpose, g58), **swipe**
(calm fertility facts vs panic, g59), **role-play** (affirm every family is real, g60) **→ reflect** (five gentle
prompts) **→ celebrate** (constellation + an "A Life, Built" certificate + the graduation star). Recaps the eight
Chapter-7 lessons (Choosing & Building · Your Path, Your Call · Equal Partners · Respect at Home · The Family Map ·
Money, Together · If, When & Whether · Many Ways to Family). **The c7 Landing was looser than the schema in places**.
A faithful build added `myth.why` to the strike lap, per-option `consequence` + a `debrief` to the branch lap,
reframed a v2-style left/right swipe into the capstone's swipe-up-to-affirm, and folded an authored 8th "reflect"
lap (not a `CapLap` type) into the reflect section as a fifth prompt (same content, same place in flow). Added the
Chapter-7 glyph→emoji set, each mirroring its game's node emoji (choosing-building 💍 · your-path 🛤️ ·
equal-partners 🧺 · respect-home 🏠 · family-map 🗺️ · money-together 💵 · if-when-whether 🤰 · many-ways-family 👪 ·
the crowning a-life-built-star 🏡). **gameId trap:** the Landing's `capstone-ch7` is aspirational; the engine-host
registry id is **`capstone-7`**: config uses `capstone-7`. Node `c7`, route `/game/capstone-7`. No score, no fail.
**This closes the whole 3 → first-child journey**: all of Chapters 1-7 (67 nodes: g01-g60 lessons + c1-c7
capstones) are now built to their v2/rich standard; only Chapter 8 (parenthood, g61-g69 + c8) remains.

## Capstone 8: Full Circle (rich, format v1), the FINAL graduation, the loop comes full circle
The Chapter 8 (Parenthood) graduation **and the final capstone of the whole catalog**. Built to the rich
[Capstone format v1](#rich-capstone-format-v1), matching c1-c7 on the shared rich engine (`capstone-rich.tsx`)
from its Landing config (`content/games/capstone-8.ts`): **arrive → look back** (the "Full Circle" constellation
gallery, nine Chapter-8 stickers) **→ play back** eight victory laps, each a chapter truth re-cued through a
*different* mechanic: gallery, **strike-rewrite** (a father isn't "babysitting", from g62), **branch** (pause →
choose firm warmth → repair, g65), **role-play** (g64), **match** (g63/g66), **swipe** (shame drives it
underground, g68), **strike-rewrite** (believe your child, g69), **sort** **→ reflect** (five gentle prompts)
**→ celebrate** (constellation + a "Full Circle" certificate + the graduation star). Recaps the nine Chapter-8
lessons (Us, After Kids · Equal Parents · Looking After You · The Talks · Break the Cycle · Raising Gender-Diverse
Kids · Raising Neurodiverse Kids · Navigating Addictions · Be the Safe Adult). **The c8 Landing was the loosest of
all**. A faithful build added **`myth.why` AND `celebrate`** to its two strike laps (c8-p2, c8-p8), per-option
`consequence` + a `debrief` to its branch lap (c8-p4), reframed a v2-style left/right swipe into the capstone's
swipe-up-to-affirm (c8-p7), and folded the authored "reflect" lap (c8-p3) into the reflect section as a fifth
prompt. Added the Chapter-8 glyph→emoji set, each mirroring its game's node emoji (us-after-kids 💑 · equal-parents
🍼 · looking-after-you 🌿 · the-talks 💬 · break-the-cycle 🔄 · gender-diverse 🏳️‍🌈 · neurodiverse 🧩 ·
navigating-addictions 🎮 · safe-adult 🛟 · the crowning full-circle-star 🌳). **gameId trap:** the Landing's
`capstone-ch8` is aspirational; the engine-host registry id is **`capstone-8`**: config uses `capstone-8`. Node
`c8`, route `/game/capstone-8`. No score, no fail. **This closes EVERYTHING**. With c8, all of Chapters 1-8 (77
nodes: g01-g69 lessons + c1-c8 capstones) are built to their v2/rich standard. The **3 → parenthood catalog is
complete**, and the generational loop comes full circle: the child the journey began with (My Body, My Rules, g02)
is now the parent who teaches it (The Talks, g64; Be the Safe Adult, g69).

## Pattern (recap)
Same recipe across all eight: one victory lap per big idea of the chapter's games (re-cued through a varied
mechanic), Lensy's warm recap, a graduation certificate. Always celebratory, never a test (a milestone, not
an assessment). Each follows the same rich-engine shape and inherits the [reusable patterns](swipeed-game-patterns.md).

## Thread-C reflection
Every graduation also closes with a **"Skills you've grown"** beat, the
[Life-Skills Toolkit](life-skills-toolkit.md) reflection (a shared `ToolkitReflection` rendered from
`GameDone` for `capstone-*` ids), showing the four tools (Cool-Down · Decision Steps · Talk-It-Out ·
Help Map) at that chapter's level, so a child sees their **emotional & life-skills growth**, not just topic
knowledge. The final capstone is the **whole-toolkit look-back** into adulthood, the emotional bookend.

## Related
- [SwipeEd (app)](swipeed.md) · [Path world](swipeed-world.md) · [Life-Skills Toolkit (Thread C spine)](life-skills-toolkit.md) · [Games catalog](index.md)
