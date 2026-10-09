---
type: prd
owner: the-equal-lens
title: SwipeEd weekly themes PRD
description: "The next version of SwipeEd, a weekly programme on top of the path: a parent-led setup, a short picture check-in, one theme a week told as a stop on the path world, levels without scores, and a weekly card for the parent, with everything kept on the phone. Covers the current state, requirements, safety rules, milestones and open questions."
status: draft
tags: [swipeed, prd, product, weekly-themes, check-in, parents]
timestamp: 2026-09-29T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2aed3a9a-9b61-44a2-bc3c-472d487be8ac  # SWED-101
---

# SwipeEd weekly themes PRD

**Status:** draft for review by Rashi and The Equal Lens team.
**Ticket:** [SWED-101](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2aed3a9a-9b61-44a2-bc3c-472d487be8ac).
**Written:** 2026-09-29, from this knowledge base and the code on `main` at `f54d591`. Where the two disagree, this describes the code.
**Decisions needed:** [section 15](#15-open-questions).

## 1. Summary

SwipeEd today is a self-paced path: 77 nodes across 8 age-band chapters, narrated by Lensy, stored on the phone, and never used by a child on record. This PRD turns it into a weekly programme a family can follow, without replacing the path.

1. **A parent sets it up** and consents. The child's age band is the only thing setup needs.
2. **A two-minute picture check-in.** Lensy asks "who should do this?" and the child taps a man, a woman, or both. There is no right or wrong answer, and every question has a pass.
3. **One theme a week**, such as work at home or jobs and dreams, told as a stop on the chapter's canvas where UN rubs out a myth and RE redraws it. The check-in changes the order of the themes, never which themes a child gets.
4. **Four levels a week** (story, play, go deeper, make it yours) that open by finishing, not by being right. No stars, coins or streaks. The week ends in a sticker.
5. **A weekly card for the parent**: the theme, one activity to do together and one question to ask. It never shows the child's answers.
6. **A teen mode from 12**, private by default.

Everything stays on the phone, as it does now. The first release covers one band (6-9, Chapter 2, "Fair is fair") and four themes, so that a partner can run a small feasibility pilot with families.

## 2. Where this came from

### 2.1 Rashi's proposal (29 September 2026)

- The child enters an age, a name and some background.
- Young children see short, situational videos instead of typed questions, because they cannot yet read or type well. The situations are concrete ("who does the housework and who goes out to work?"), not slogans like "boys can't cry".
- The programme follows the child's answers. A child who seems not to value household work gets a household week next, with Equal Lens comics and stories that make the topic familiar without calling anything right or wrong.
- The parent gets an update naming the week's lesson.
- There is no scoring, but there are layered levels (T1, T2, T3, final). Weeks can cover other topics, such as careers.
- A 13 year old gets different questions, lessons, videos and handling.

### 2.2 What the review kept and changed

Kept: pictures and taps for young children, situations over slogans, no right or wrong, levels instead of scores, the parent loop, and a different teen mode.

Changed, because the risk sat in the core mechanic of reading a child's attitude from taps and routing on it:

1. **The check-in offers "both".** A choice between only a man and a woman makes every answer gendered. Standard children's measures ask "who should" and offer "both" (Liben and Bigler's COAT).
2. **Several items, counterbalanced, with a pass.** One tap is too noisy to decide a week.
3. **Order and depth adapt; coverage does not.** Every child gets every theme. Otherwise a child who guessed the expected answer never gets the lesson, and older children learn that their answers steer their lessons.
4. **Young children's answers are read with care.** Rigid gender beliefs are normal while children first learn the categories, and "the period of rigidity was short-lived" (Trautner and colleagues, 2005). At 3-6 there is no check-in at all.
5. **Nothing leaves the phone, and parents never see answers.** Section 9 of the DPDP Act bans tracking and behavioural monitoring of children even with a parent's consent.
6. **Nothing adapts on body safety, consent or any topic a disclosure could follow.** An answer there can point at the home, and the parent card goes to the home.

### 2.3 Most of it was already planned

SwipeEd's own strategy and design documents describe most of this, and none of it was built.

- The build bible (`Strategy/`, Draft v0.1, sections 4 and 5) sets the stance: "no guilt streaks, no coins or gems, no FOMO timers, no loot boxes, no purchase prompts, no surveillance. The only reward currency is the brand's sticker." It names who operates the phone at each stage: a parent co-playing at 3-6, a parent or older sibling supervising at 6-9, and at 9-18 the young person privately, with an "optional parent bridge, never surveillance".
- The Micro-Learning App Structure (`design/`, v1.0, sections 11 and 13) specifies a Family Mode where parent and child co-play the early chapters "with prompts that help the parent talk about each topic", a placement Checkpoint, crown levels where "higher crowns are not just harder questions; they are the SAME topic revisited with greater depth", and a parent view that "Sees progress, not individual sensitive answers".

This PRD builds those unbuilt parts, with Rashi's weekly rhythm as the frame and the review's changes as the rules.

### 2.4 Why now

- **Home is where these norms are learned.** In a study of 326 children aged 7 to 13, "mothers' explicit beliefs about domestic gender roles predicted the beliefs held by their children". Where fathers shared housework more equally, their daughters were more interested in working outside the home and in less stereotyped jobs (Croft and colleagues, 2014). A weekly card that gives the parent something to do aims at that lever.
- **SwipeEd has no evidence yet.** No child has used it on record ([section 3.5](#35-evidence-of-use)). The check-in, asked before and after each theme, is its first measure of stated attitudes.
- **The Equal Lens needs a product where technology is core.** Its partner offer is facilitated and in person. MIT Solve's 2027 Global Learning Challenge (deadline 2 November 2026, 12:00 noon EST) names "formative assessment, diagnostics" among its priorities and asks for data governance "especially for tools serving children". This PRD is the roadmap such an application would describe, and the application would have to say that no child has used SwipeEd yet.

## 3. The current version

### 3.1 The path and the story

77 nodes, 69 lessons and 8 capstones, in 8 chapters ([`src/content/path.ts`](../../src/content/path.ts), generated from `scripts/master-node-table.xlsx`).

| Chapter | Ages | Subtitle | Lessons and capstone |
|---|---|---|---|
| 1 | 3-6 | Everyone is equal & can-do | 6 + 1 |
| 2 | 6-9 | Fair is fair | 8 + 1 |
| 3 | 9-12 | Question the script | 9 + 1 |
| 4 | 12-15 | Equality in practice | 11 + 1 |
| 5 | 15-18 | Change the system | 9 + 1 |
| 6 | 18-22 | Standing on my own | 9 + 1 |
| 7 | 22 to first child | Building a life | 8 + 1 |
| 8 | Parenthood | Raising the next generation | 9 + 1 |

- **Unlocking is linear.** Every node has a prerequisite. Earlier chapters are open for revision, and later nodes open when the one before is done ([`src/lib/node-unlock.ts`](../../src/lib/node-unlock.ts)).
- **The story is one life, told as a spiral.** Lensy, a curious purple alien, narrates every game. UN (the eraser, teal) and RE (the pencil, coral) appear at the myth-busting beats, and a flying ship is the path companion. Each chapter's canvas carries struck-through myths, each with a truth, that UN erases and RE redraws (`src/content/chapter-canvas/chapter-1.json` to `chapter-8.json`). The capstones carry the arc, and the last one says: "Eight chapters ago you were three, co-played with by a grown-up. Now you ARE the grown-up you always deserved."
- **There is no persistent cast.** Persona names in the bank are authoring metadata and are never shown.
- **Capstones** are no-fail celebrations with a sticker-gallery look-back, victory laps, reflect prompts and a certificate ([capstones](../games/capstones.md)).

### 3.2 Setup, rewards and parents today

- **Onboarding** ([`src/components/onboarding.tsx`](../../src/components/onboarding.tsx)) is child-facing and self-declared. It requires a name and offers 8 emoji avatars, an age chip (3-6, 6-9, 9-12, 12-15, 15-18, 18-22, 22+, Parent) and English, with Hindi shown as "soon". The start chapter is the one matching the chip. There is one profile per browser, and the age changes only by resetting progress.
- **Rewards contradict the build bible.** Every v2 game ends with a fixed 3 stars and 15 coins ([`game-done.tsx`](../../src/components/games/game-done.tsx)), capstones give 25 to 50 coins, and the profile keeps coins, a best streak and a daily "kind streak" with two freezes ([`src/lib/store.tsx`](../../src/lib/store.tsx)).
- **Levels** exist only in the Life-Skills Toolkit (four tools, levels 1 to 5). Crown levels are listed as deferred in 28 game docs.
- **Parents.** The Parent Layer is Chapter 8 content (g61 to g69, such as Equal Parents, The Talks and Be the Safe Adult) that a parent plays as a learner. There is no parent-facing view, report, message or co-play mode, and nothing links a parent's profile to a child's. The only nod is the 3-6 reflect beat that says to tell a grown-up near you.
- **A mood check-in exists** in the Toolkit. It stores only that a check-in happened, never the mood. The new check-in has to store answers, which is a real change ([section 10](#10-data-and-privacy)).
- **Get Help** is always one tap away ([`src/content/help.ts`](../../src/content/help.ts)).

### 3.3 Engine and data

- A node opens `EngineGameHost`, which mounts the game's `V2Game` and ends in `GameDone` ([v2 engine](../architecture/v2-engine.md)). The registry is a closed map of 77 games, and the mechanics are a closed set of 11 verbs behind one switch. A new verb touches two app files and about a dozen forge places ([extending SwipeEd](../games/extending-swipeed.md)).
- A session draws unseen scenarios first. **Nothing adapts** to age, theme or difficulty, and no per-answer, per-topic or correctness data is stored.
- **State lives in `localStorage` only**: `glrl.profile.v1` (name, avatar, locale, entry age, coins, stars, streaks, toolkit, settings) and a seen-list per game. There is no account, backend, API route, analytics, telemetry or error reporting. **No data leaves the device through app code.** Outside the app code there are Vercel request logs, links a user chooses to tap, and possibly the browser's speech engine, which has not been checked.

### 3.4 Content, media, language and offline

- **The bank** holds 33,542 scenarios in one file per game ([question bank](../schemas/question-bank.md)). A scenario has no field for age band, theme, level, media or language. A game's chapter sets its band, and themes live only on nodes (threads A to G and UNESCO topics).
- **Media.** There are no pictures on answer options, no audio files, no video and no comics. Lensy's lines use the browser's speech, in `en-IN` only ([`src/lib/speak.ts`](../../src/lib/speak.ts)). The 14 games in Chapters 1 and 2 have 23,458 option texts and none has a picture, so **no Chapter 1 to 3 game can be played without a grown-up by a child who cannot read**.
- **Pictures for pre-readers** were researched on a zero budget ([visual answer options](../research/visual-answer-options-2026-09-15.md), SWED-89 and SWED-90): a fixed-size picture above a dominant word, tap to hear, faded by chapter, drawn from a reviewed picture bank; Fluent Emoji, local FLUX.1 schnell, CC0 art and CSS motion; no photographs of children and no depicted harm. It ruled out video. None of it is built.
- **Language.** English only. Strings are written inline, with no i18n library.
- **Offline.** None. The service worker is a kill-switch that clears caches ([`public/sw.js`](../../public/sw.js)), although the repo README still claims offline support. The 3D path needs WebGL (126 KB gzip for three.js), and `/classic` is the fallback.

### 3.5 Evidence of use

No child, family or school has used SwipeEd on record. The only outside use is friends who playtested Chapter 7 (ages 22 on) in September, which led to the [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md). By design, the app cannot count its users.

### 3.6 Debts that block a pilot with children

These are open today and must close before any child-facing pilot, whatever else ships.

1. **Get Help promises confidentiality.** `help.ts` line 10 calls Childline "confidential" (audit finding A4). The Equal Lens never promises confidentiality it cannot deliver.
2. **Critical content findings** from the [question bank audit](../audits/question-bank-audit-2026-09-14.md) in any chapter a pilot child can reach, and the clinical-content decision (SWED-84) for any band where the programme runs.
3. **Contrast.** The UN and RE labels fail WCAG AA in light mode (SWED-63).
4. **Anatomical words** in the Chapter 1 to 3 body-safety games (audit finding A5), which is a curriculum decision.
5. **Stars, coins and streaks** in the child's view ([section 3.2](#32-setup-rewards-and-parents-today)).

### 3.7 Keep, change, add

| Area | Keep | Change | Add |
|---|---|---|---|
| Path and story | The path, chapters, Lensy, UN and RE, the chapter canvases, capstones | Theme weeks become stops on the canvas | A "this week" stop and a theme sticker |
| Setup | Age bands mapped to chapters | Parent-led, consent first, name optional | A parent area behind a gate; several children per phone |
| Games | All 77 nodes and the bank | Nothing in the bank changes shape for the pilot | Theme tags on categories, a check-in verb, a picture story player |
| Rewards | Stickers and the sticker book | Stars, coins and streaks leave the child's view | Four levels a week |
| Parents | Chapter 8 as the parent's own learning | None | A weekly parent card that links to Chapter 8 |
| Data | On the phone only | The profile stores check-in answers | A research build with partner-held codes |
| Media and language | Browser speech as the fallback | None | Recorded audio in English and Hindi; pictures on check-in items and stories |

## 4. Goals and non-goals

### Goals

1. A family can follow one theme a week with a clear start, middle and end, in four short sessions of about 5 to 10 minutes.
2. The check-in is good enough to order themes and to show change in stated attitudes during a pilot.
3. The parent gets one useful card a week, and nothing about the child's answers.
4. After setup, a 6 year old who cannot read can do the whole week alone.
5. Nothing about a child leaves the phone in the everyday build.
6. The path, the story, the games and the bank are reused, not rebuilt.

### Non-goals

- Scores, coins, stars, streaks, leaderboards or percentiles.
- Accounts, servers, sync or analytics in the everyday build.
- Adapting on body safety, consent, puberty, abuse, mental health or clinical topics.
- Free text, voice input, camera or location anywhere in the weekly programme.
- Claims about behaviour. A before and after in one group supports claims about stated attitudes only.
- Replacing The Equal Lens's facilitated programmes, or settling the clinical-content question (SWED-84).
- Weekly programmes for Chapters 5 to 8.

## 5. Who it is for

| Band (chapter) | Who operates the phone (build bible) | Check-in | Theme weeks | Parent card | Release |
|---|---|---|---|---|---|
| 3-6 (Ch. 1) | A parent, co-playing | None: themes run in a fixed order | Played together | A co-play guide, before the week | Second |
| 6-9 (Ch. 2) | A parent or older sibling, supervising | Pictures and audio | Yes | Yes | **First (pilot)** |
| 9-12 (Ch. 3) | The child, with an optional parent bridge | Pictures and words | Yes | Only if the child turns it on, and the child sees it first | Second |
| 12-15 (Ch. 4) | The young person, privately | Teen items | Teen themes | Off by default, theme only, and the teen sees what is sent | Third |
| 15 and over | The path, unchanged | None | None | None | Out of scope |

- **The Equal Lens's programmes line up with the chapters.** The Discovery Program (5-12) spans Chapters 1 to 3, and the Teen Compass (13-15) sits in Chapter 4. Chapter 2's subtitle, "Fair is fair", is also the name of Discovery session 3. The 16-18 band stays out: a group that age can hold children and adults at once, which changes the legal duties, and the Relay Program already serves it face to face.
- **The parent or guardian** sets up, consents, reads the card and does the activity. Phones are often shared, so setup supports more than one child.
- **A delivery partner** can run the programme with families and, in the research build only, holds the codes ([section 11](#11-evaluation)).

## 6. Rules that do not bend

Each rule is testable, and breaking one blocks a release.

| Id | Rule | Why |
|---|---|---|
| S1 | In the everyday build nothing about a child leaves the phone: no account, server, analytics or telemetry. | Current architecture; DPDP Act section 9 |
| S2 | A parent or guardian consents before a child uses the check-in. The consent step passes legal review before the pilot. | DPDP Act section 9 |
| S3 | No tracking or behavioural monitoring. Theme order uses only check-in answers; time, taps, misses and engagement feed nothing. | DPDP Act section 9 |
| S4 | Every scenario is about fictional people. Nothing asks about the child's own home or family. | The Equal Lens child-safety rules |
| S5 | Every check-in item and activity has a visible pass. A pass costs nothing and never moves a theme. | Child-safety rules; the Include value |
| S6 | Nothing adapts on body safety, consent, puberty, abuse, mental health or clinical topics. These stay in the path's fixed order. | The review; build bible: no "show a parent" on sensitive nodes |
| S7 | Parents see the theme and the activity, never the child's answers or any result per child. | Structure doc: "Sees progress, not individual sensitive answers" |
| S8 | Tap only in the weekly programme: no free text, no voice, no camera. | The review; safety beats are tap-only today |
| S9 | Get Help is one tap away on every screen and promises nothing it cannot deliver. | Child-safety rules; audit finding A4 |
| S10 | No photographs of children and no depicted harm in any picture. | Visual answer options research; the brand |
| S11 | No scores, coins, stars, streaks or rankings. Stickers only. | Build bible, section 4 |
| S12 | Lensy asks and never teaches in the check-in. Theme content puts a truer idea in place of a myth rather than just saying no. | Brand canon; [core principle](../games/swipeed-core-principle.md) |

## 7. The experience

### 7.1 Setup, once, by a parent

1. **"Hand the phone to a grown-up."** A full-screen card, like the handover screens family apps use.
2. **A parent gate** a young child cannot pass by tapping around, such as typing a number written out in words. It is a speed bump, not age verification.
3. **What this is and what stays on the phone**, in plain words, with a "Why we ask" line under each question.
4. **Consent**, readable in 30 seconds. Declining keeps the free path and turns the weekly programme off.
5. **The child's age band**, as picture buttons. This is the only required field.
6. **A nickname, if the parent wants one.** It is used only in Lensy's greeting, stays on the phone and never appears on the parent card.
7. **Language** (English, and Hindi when ready) and **the day the week starts**.
8. **"Give the phone back."** Setup can add another child.

Today's onboarding requires a name and lets a child pick any band. In the weekly programme the band comes from the parent. The free path's onboarding can stay as it is for adults and older teens.

### 7.2 The check-in, by the child, about two minutes

- Lensy asks out loud over a picture of the situation: "Someone needs to cook dinner. Who should cook?" There are three picture answers, a man, a woman, and a man and a woman together, with a pass beside them.
- The answer positions shuffle on every item. The items mix tasks the stereotype gives to women with tasks it gives to men, such as cooking and fixing a fan, so a child who always taps the same place or the same person does not read as holding a view.
- Lensy reacts the same way to every answer ("Thanks! Here's the next one."). No sound, colour or motion tells the child which answer adults prefer.
- **First check-in:** 2 items for each of the band's 4 themes, 8 in all. **Each theme week:** 2 more items at the start and 4 matched items at the end, so every theme has 4 items before and 4 after. These counts are pilot defaults.
- A child can stop at any point. Unanswered items count as passes.

### 7.3 Choosing the theme, on the phone

A small, fixed rule set, not a model:

1. An answered item scores 1 if the child picked the person the stereotype expects, and 0 for the other person or for "both". Passes are not scored.
2. A theme with at least 2 answered items gets a score. A theme with fewer has none.
3. The next theme is the unplayed theme with the highest score. Ties, and themes with no score, follow the curriculum order.
4. Every theme plays once per cycle. A theme whose score after the week is still high comes back one cycle later at greater depth, never straight away.
5. After the last theme, a new cycle starts with the same themes at the next depth, or the next chapter's versions when the child moves up a band.

The parent area explains the order in general words ("Themes come in an order that suits your child. Every child gets every theme.") and never shows the scores.

### 7.4 The theme week, four levels

The week is a stop on the chapter's canvas, built on a myth the canvas already holds. For work at home in Chapter 2 that is `c2-g10-m2`: "Cooking and cleaning are girls' / mum's job", with the truth "Everyone shares the chores." Lensy's ship lands at the myth, and the four levels work through it.

| Level | Name | What happens | Built from |
|---|---|---|---|
| 1 | Story | A narrated picture story: a family meets the situation. It ends on a question, not an answer, and UN rubs out the myth. | New: the picture story player and stories |
| 2 | Play | A game from the bank, drawing only from the theme's categories | Existing games |
| 3 | Go deeper | A different mechanic on the same theme, often a story where each choice builds on the last | Existing games, multi-step where converted |
| Final | Make it yours | RE redraws the truth. The child picks one thing to try this week, from pictures, and the theme sticker lands in the sticker book. | New: a short capstone-style closer |

- A level opens when the one before is finished, never by being right. The week can be played in one sitting or across days. There is no daily streak and no timer.
- The full path stays open, so a child can still play any unlocked node. A theme game finished during a theme week also counts on the path.
- Across years a theme comes back in the next chapter at greater depth. This is the crown-level spiral the structure doc planned.

### 7.5 The parent card

Shown behind the parent gate at the start of the week, and again when the week ends.

- **This week:** the theme, and one line on why it matters that The Equal Lens can defend.
- **What your child will explore:** the story and the games, by name.
- **Try this together (10 minutes):** one activity at home.
- **Ask:** one question about the story, never about the family.
- **Try not to:** one line, such as "quiz them for the right answer. There is no test."
- **For you:** the matching Chapter 8 node, such as Equal Parents for work at home, so the parent's own learning meets the child's week. The story already promises this: the child who began by co-playing grows into "the grown-up you always deserved".
- **A footer:** "Nothing about your child's answers is on this card or leaves this phone."

The parent can share the card through the phone's share sheet as an image or text. A shared card carries no nickname and no answers. [Appendix B](#appendix-b-a-parent-card-for-work-at-home-6-9) has an example.

### 7.6 Teen mode, 12-15

- A parent consents at setup, because section 9 of the DPDP Act covers everyone under 18. After that, the teen runs it.
- The check-in uses words and pictures, with teen situations drawn from Chapter 4 and the Teen Compass sessions The Box, Who Pays? and Out There.
- The parent card is off by default. The teen can turn it on, sees exactly what will be sent, and it carries only the theme.
- The check-in never touches the teen's own relationships or body (S6).

### 7.7 Ages 3-6, co-play

There is no check-in. Themes run in a fixed order, the parent card arrives before the week as a co-play guide, and each level is played together. This matches the build bible's 3-6 operator ("Parent, co-playing") and the structure doc's Family Mode.

## 8. Functional requirements

SWED is work in this project. PRX means an Owhile ticket is needed too ([section 12](#12-swipeed-work-and-owhile-work)).

### FR-1 Parent setup and consent (SWED)

- AC1: A child cannot reach the check-in before a parent has finished setup and consent on that phone.
- AC2: Setup needs only an age band. The nickname is optional and never appears on the parent card or in any export.
- AC3: Declining consent leaves the free path usable and the weekly programme off.
- AC4: Setup can add, rename and remove children. Each child has their own band, check-in answers and theme order.
- AC5: Every setup question has a "Why we ask" line.

### FR-2 Parent area and gate (SWED)

- AC1: The parent area sits behind a gate that 6 year olds cannot pass in usability testing.
- AC2: It shows each child's current theme, the level reached and the parent card. It never shows check-in answers or scores.
- AC3: It holds resets (per child and for all), language, the week's start day, the parent card switch for 9-15, and the settings that today are linked only from `/classic` (Calm Mode, text size).

### FR-3 Check-in item type (SWED, PRX)

- AC1: A new verb shows a situation picture, reads the question aloud, and offers three picture answers and a pass.
- AC2: Answer positions shuffle per item. The answer key never changes colour, sound or motion.
- AC3: Each response records only the item id, its category (the stereotyped person, the other person, both, or pass) and the date, on the phone.
- AC4: A child who cannot read can play it: every prompt is spoken, every answer is a picture, and a tap is enough.
- AC5: Lensy's reaction is identical for every answer.

### FR-4 Themes and tagging (SWED, and PRX if the tag becomes a shared schema field)

- AC1: Each band has a theme catalogue in curriculum order. Each theme lists its check-in items, story, games (by game id and category), closer, sticker, canvas myth and parent card.
- AC2: Themes live in data, not code. A lint fails any theme missing a part.
- AC3: The lint also fails any theme that includes body-safety, consent or clinical categories (S6).

### FR-5 Theme sequencer (SWED)

- AC1: A pure function takes the band, catalogue, check-in results and history, and returns the next theme by the rules in [section 7.3](#73-choosing-the-theme-on-the-phone).
- AC2: Unit tests cover ties, passes, all passes, one theme left, the end of a cycle and a change of band.
- AC3: It reads no other signal (S3).

### FR-6 Theme week and levels (SWED)

- AC1: Four levels per theme, each opening when the one before is finished.
- AC2: Level 2 and 3 games draw only from the theme's categories, without copying content.
- AC3: A theme game opens from the week only if it belongs to the child's band or an earlier one.
- AC4: Finishing the closer puts the theme sticker in the sticker book and marks the stop on the canvas.
- AC5: No stars, coins, timers or streaks appear anywhere in the week.

### FR-7 Picture story player (SWED, PRX)

- AC1: Plays 6 to 10 narrated panels, advanced by tap or automatically, and respects Calm Mode and reduced motion.
- AC2: Works on a budget Android phone on a slow connection, within the budgets in FR-12.
- AC3: Panels follow S10 and the [design system](../design.md#the-path-world).

### FR-8 Parent card (SWED)

- AC1: One card per theme per band, in English and Hindi, following [section 7.5](#75-the-parent-card).
- AC2: Shareable through the phone's share sheet as an image or text, with no nickname and no answers.
- AC3: At 9-12 the child switches it on and sees it first. At 12-15 it is off by default and carries the theme only.

### FR-9 Stickers instead of scores (SWED)

- AC1: The completion card shows the node's sticker, not stars or coins, on every child profile.
- AC2: Coins, stars and streaks leave the child's view. The stored values can stay for one release, for migration, and then go.

### FR-10 Recorded audio (SWED)

- AC1: Every check-in prompt, story panel and closer has a recorded clip in English and in Hindi.
- AC2: Browser speech stays as the fallback when a clip is missing.

### FR-11 Hindi (SWED)

- AC1: The weekly programme's strings, items, stories and parent cards exist in Hindi, reviewed by a native speaker from the pilot families' region.
- AC2: The language can be switched in the parent area.

### FR-12 A budget phone, and a week that works offline (SWED)

- AC1: Once a week starts, its story, games and audio are cached and play without a connection.
- AC2: The cache is versioned so that a new build replaces it. Stale caches are why today's service worker is a kill-switch.
- AC3: Starting budgets, to be tested: a story under 1.5 MB with its audio, and a week under 5 MB.

### FR-13 Research build (SWED, PRX)

- AC1: A separate build or partner switch. The everyday build contains no export code.
- AC2: The phone holds only a code that the partner enters. The list linking codes to children is held by the partner's safeguarding lead, never by The Equal Lens.
- AC3: Export is manual and local, a file or QR code the partner collects. It holds the code, band, item ids and categories, theme order, levels finished and week numbers, and no nickname or free text.
- AC4: The export is not a route for disclosures, and says so.

### FR-14 Safety surfaces (SWED)

- AC1: Get Help sits on every weekly screen (S9), with the confidentiality line from audit finding A4 fixed.
- AC2: No weekly screen has a text or voice field (S8).

## 9. Content requirements

### 9.1 Pilot themes for 6-9 (Chapter 2)

A draft map to existing games and canvas myths. The content team confirms each by playing the categories. Chapter 1 games are open to 6-9 children as revision.

| Theme | Canvas myth and truth | Levels 2 and 3 | For the parent |
|---|---|---|---|
| Work at home | `c2-g10-m2` "Cooking and cleaning are girls' / mum's job." Truth: "Everyone shares the chores." | Fair Play World (g10: chores by turns, not by gender), Can-Do Kids chores category (g05) | Equal Parents (g62) |
| Jobs and dreams | `c1-g05-m1` "Girls can't be pilots or engineers." and `c1-g05-m2` "Boys can't be nurses, dancers or cooks." Truth: "Anyone can do any job." | Can-Do Kids (g05), What Makes Me, Me (g07) | Equal Parents (g62) |
| Likes and feelings | `c2-g07-m2` "Boys must act one way and girls another." and `c1-g04-m5` "Girls are weak; boys are tough." | Same Same, Different (g04), What Makes Me, Me (g07) | The Talks (g64) |
| Fair words | `c2-g11-m1` "Teasing a 'girly boy' or 'tomboy' is just a joke." Truth: "Teasing about gender isn't funny. It hurts." | Not Fair, Not Funny (g11) | The Talks (g64) |

### 9.2 Check-in items

- Four themes, with 2 items for the first check-in, 2 for the week's start and 4 for its end, make 32 items for the pilot. They are written as two matched sets, so the before and after pictures differ.
- Each item has a situation picture, a spoken question in the "who should" form, three answers (a man or boy, a woman or girl, and both together) and a pass.
- Within each theme, half the tasks are ones the stereotype gives to women and half to men.
- Settings are Indian and carry no caste, religion or class markers. The Equal Lens reviews every item against its child-safety rules, and each one is read aloud to check it before recording.
- The third answer's picture and label ("both" or "anyone") are tested with children in the pilot ([open question 6](#15-open-questions)).
- [Appendix A](#appendix-a-check-in-items-for-work-at-home-6-9) has examples.

### 9.3 Picture stories

- One story per theme for the pilot: 6 to 10 panels, narrated, in the path world's style.
- Rashi's proposal mentions Equal Lens comics. None were found in this workspace, so the pilot assumes new stories drawn under the zero-budget rules in the visual answer options research, unless existing comics turn up ([open question 1](#15-open-questions)).
- Video stays out of the pilot, as the research concluded. A narrated picture story does the same job at a fraction of the weight.

### 9.4 Parent cards

One per theme, in English and Hindi, in The Equal Lens's voice, and reviewed against its child-safety rules. The "why it matters" line makes only claims The Equal Lens can defend.

### 9.5 Voice

The brand rules apply to every line: no em or en dashes ([writing without dashes](../playbooks/writing-without-dashes.md)), Lensy asks rather than teaches, and "You're not wrong, you're growing" ([core principle](../games/swipeed-core-principle.md)).

## 10. Data and privacy

| Data | Where | Who sees it | Kept until | Why |
|---|---|---|---|---|
| Age band, per child | Phone | The parent area | Reset | Chapter and themes |
| Nickname, optional | Phone | Lensy's greeting | Reset | Warmth |
| Check-in answers (item id, category, date) | Phone | Nobody, in the everyday build | The end of the cycle, then only the latest per theme | Theme order |
| Theme order, levels finished, stickers | Phone | The parent area, without answers | Reset | The week |
| Consent (date, wording version) | Phone | The parent area | Reset | A record of consent |
| Research code and export | Phone, then the partner | The partner's safeguarding lead | The partner's retention rule | The pilot only |

- **What changes from today.** The Toolkit's mood check-in stores only that a check-in happened. The new check-in stores answers on the phone, because the theme order depends on them. That is why S1 to S3 exist, and why the legal review does.
- **The legal review before the pilot** answers three questions: whether theme ordering from answers kept on the phone counts as behavioural monitoring under section 9; what verifiable consent requires when no data reaches The Equal Lens; and the research build's consent, retention and export terms. Section numbers and rules are re-verified at the time of review.

## 11. Evaluation

- **This PRD does not design an efficacy study.** Any study of whether the programme changes attitudes goes through the Sex Ed research pipeline (`okf-pipeline`: generate, validate, then plan), where `samplesize.py` computes the sample and every design carries a ledger.
- **The feasibility pilot** (M4) asks whether the loop works. It runs with one partner and a small number of families, on the research build:
  - Do families finish a week, and at which level do they stop?
  - Do parents use the card? The partner asks, because the app cannot tell.
  - How do the items behave: how often do children pick "both", pass, or tap the same position every time?
  - What do children and parents say? Any safeguarding event is handled under the partner's protocol and recorded.
- **Claims.** A before and after within one group supports a claim that stated attitudes moved, not a claim about behaviour. The build bible's learning measures (myth belief, attitude and transfer to new scenarios) stay the target, and trivia recall is not a stand-in for belief change.

## 12. SwipeEd work and Owhile work

The runtime and the forge live in this repo, and SWED-66 to SWED-100 changed them under SWED. Owhile owns the verbs as primitives, item schemas and invariants, audience profiles, the forge mechanism, the helpline registry, and any learner event or record ([where this came from](../README.md#where-this-came-from)). No document draws a bright line between the two, so the PRX tickets below are for alignment and are filed before building.

| Capability | SWED | PRX ticket |
|---|---|---|
| Parent setup, gate, parent area, several children | Yes | No |
| Check-in verb | Yes | Yes: a new verb and its item schema |
| Theme tags on categories | Yes | Yes, if the tag becomes a shared schema field |
| Sequencer | Yes | No |
| Picture story player | Yes | Yes: a reusable verb |
| Parent card; stickers instead of scores | Yes | No |
| Research build and export | Yes | Yes: a learner record |
| Offline cache | Yes | No |
| Get Help fix (A4) | Yes | Yes, if the helpline registry changes |

## 13. Milestones

Each milestone ships with its knowledge base docs and a log entry ([AGENTS.md](../../AGENTS.md)).

| Milestone | What | Done when |
|---|---|---|
| M0 Decide | Review this PRD with Rashi and the team, answer the open questions, book the legal review, name a pilot partner, file the PRX tickets | Decisions recorded in this doc |
| M1 Clear the blockers | The debts in [section 3.6](#36-debts-that-block-a-pilot-with-children) for Chapters 1 to 3, and stars, coins and streaks out of the child's view (FR-9) | Audit items closed and gates green |
| M2 Pilot content | Four 6-9 themes: 32 check-in items, 4 stories, 4 closers, 4 parent cards, and audio in English and Hindi | Reviewed by The Equal Lens against its child-safety rules |
| M3 Build | FR-1 to FR-8, FR-10 and FR-12 to FR-14, behind a flag | Headless playthroughs at 360, 390 and 412 px, and a 6 year old finishes a week alone in a usability test |
| M4 Feasibility pilot | One partner, a small group of 6-9 families, on the research build | Pilot notes and an item report in this knowledge base |
| M5 Widen | 3-6 co-play and 9-12, more themes, Hindi across the programme | Each band passes M3's checks |
| M6 Teen mode | 12-15, with the Teen Compass themes | M3's checks, plus a teen privacy review |

- **Alongside SWED-100.** The multi-step conversion runs chapter by chapter and has not reached Chapters 1 to 6. Level 3 uses single-step content until a game converts, so the two do not block each other.
- **MIT Solve.** An application by 2 November 2026 can present SwipeEd as the working prototype and this PRD as the roadmap. It must say that no child has used SwipeEd yet.

## 14. Risks

| Risk | Why it matters | What we do |
|---|---|---|
| The check-in measures something next to the intended thing, such as what the child sees at home or what adults want to hear | A wrong order, and a false before and after | "Who should" wording, balanced tasks, shuffled positions, no feedback, and the pilot's item report |
| Young children's normal rigidity reads as a view to correct | Nearly every young child flagged | No check-in at 3-6, and every child gets every theme anyway |
| A parent card lands badly at home | A defensive parent can undo the week | Invitations, not judgements; never the child's answers; "try not to quiz" |
| Theme ordering counts as behavioural monitoring | Legal exposure | On the phone only, answers used for order alone, and legal review before the pilot |
| A child discloses something | The app cannot respond | Tap only, fictional situations, Get Help everywhere, and the partner's protocol in the pilot |
| The cost of stories, audio and Hindi | Slow, or never | One band and four themes first, the zero-budget picture pipeline, and stories reused across bands where they fit |
| Shared phones | One child's week shows up for another | Several children per phone, switched in the parent area |
| Two products on one path | Children lost between the path and the week | "This week" is a stop on the path, not a separate app |
| No offline today | Families on patchy data drop out | FR-12 before the pilot, or a partner who can play online |
| Evaluation debt keeps growing | Claims run ahead of evidence | The research build, a pipeline study, and plain statements of limits |

## 15. Open questions

1. **Equal Lens comics.** Do any exist? None were found in this workspace. If they do, where are they, and can their style carry the stories? (Rashi)
2. **Rashi's view of the changes** in [section 2.2](#22-what-the-review-kept-and-changed): "both", counterbalancing, fixed coverage, on the phone only, and what the parent card holds. (Rashi)
3. **The clinical-content decision** (SWED-84) and **anatomical words** (audit finding A5), which both decide which games can sit in a theme. (The Equal Lens)
4. **The pilot partner and families:** who, where, and which language besides English. (The Equal Lens)
5. **The legal review:** who reviews compliance with section 9 of the DPDP Act, and by when. (The Equal Lens)
6. **The third answer:** "both" or "anyone", and what its picture shows, including for a child whose family matches neither picture. (Content team, tested in the pilot)
7. **The name** of the weekly programme in the app. (Rashi)
8. **Default or beside?** Does the weekly programme become the default for 6-9, with the free path behind it, or sit beside the path? This PRD assumes beside. (Rashi)
9. **Video later?** The research ruled video out on a zero budget. Is that still right once there is a budget? (After the pilot)

## 16. References

### Research

- Croft, A., Schmader, T., Block, K. and Baron, A. S. (2014). The second shift reflected in the second generation: do parents' gender roles at home predict children's aspirations? *Psychological Science*, 25(7), 1418-1428. doi:10.1177/0956797614533968
- Trautner, H. M., Ruble, D. N., Cyphers, L., Kirsten, B., Behrendt, R. and Hartmann, P. (2005). Rigidity and flexibility of gender stereotypes in childhood: developmental or differential? *Infant and Child Development*, 14(4), 365-381. doi:10.1002/icd.399
- Liben, L. S. and Bigler, R. S. (2002). The developmental course of gender differentiation. *Monographs of the Society for Research in Child Development*, 67(2). Their measure, the Children's Occupations, Activities, and Traits questionnaire (COAT): doi:10.1037/t78445-000
- Digital Personal Data Protection Act, 2023, section 9 (children's data), as summarised in The Equal Lens's child-safety guidance. Re-verify before the pilot.
- MIT Solve, 2027 Global Learning Challenge page, read on 2026-09-29.

### Design references (Lazyweb, 2026-09-29)

- **Handover and parent gates:** Life360's under-13 screen ("Continue as parent/guardian", "I'm not with my parents/guardian"), birth-year gates in Bubbles & Friends and Epic, and Paramount+'s kids profile with a PIN to leave Kids Mode.
- **Child setup:** Smartdreams and Huckleberry ask for a name, gender and age or birthday, while SwipeEd deliberately asks only for a band. BBC asks for an age group with "What's this for?".
- **Weekly recaps:** Kahoot's "Weekly progress" and Airbuds' "your first weekly recap is ready", which carries a privacy line. The learning apps in the set report progress as scores, proficiency bars or percentiles, and the parent card deliberately does not.

### In this repo

- The app and its world: [SwipeEd](../games/swipeed.md), [path world](../games/swipeed-world.md), [capstones](../games/capstones.md), [core principle](../games/swipeed-core-principle.md), [interaction model](../games/swipeed-interaction-model.md), [life-skills toolkit](../games/life-skills-toolkit.md).
- Engine and content: [v2 engine](../architecture/v2-engine.md), [extending SwipeEd](../games/extending-swipeed.md), [question bank](../schemas/question-bank.md), [content pipeline](../games/swipeed-content-pipeline.md).
- Design: the [design system](../design.md) sections Voice and copy, Components, Interaction and motion, The path world and Accessibility. The new patterns in this PRD (the check-in card, the story player, the theme stop, the parent gate and the parent card) are added to it when they are built.
- Research, plans and audits: [visual answer options](../research/visual-answer-options-2026-09-15.md), [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md), [question bank audit](../audits/question-bank-audit-2026-09-14.md), [design audit](../audits/design-audit-2026-09-14.md).
- Strategy and design sources: the build bible in `Strategy/` (Draft v0.1, sections 4, 5 and 11) and `design/SwipeEd - Micro-Learning App Structure.docx` (v1.0, sections 11 and 13).

## Appendix A. Check-in items for work at home (6-9)

Every item offers a man, a woman, a man and a woman together, and a pass, in shuffled positions.

| Set | Item | Picture | Lensy asks | The stereotype expects |
|---|---|---|---|---|
| 1 | H1 | A kitchen at dinner time | "Someone needs to cook dinner. Who should cook?" | A woman |
| 1 | H2 | A ceiling fan that has stopped | "The fan is broken. Who should fix it?" | A man |
| 1 | H3 | A pile of washing | "The clothes need washing. Who should wash them?" | A woman |
| 1 | H4 | A bicycle with its chain off | "The bicycle chain came off. Who should fix it?" | A man |
| 2 | H5 | Spilled rice on the floor | "The floor needs sweeping. Who should sweep it?" | A woman |
| 2 | H6 | A dripping tap | "The tap is leaking. Who should fix it?" | A man |
| 2 | H7 | A baby who needs a bath | "The baby needs a bath. Who should give it?" | A woman |
| 2 | H8 | Heavy shopping bags | "The shopping bags are heavy. Who should carry them?" | A man |

Set 1 splits across the first check-in and the week's start. Set 2 is the week's end.

## Appendix B. A parent card for work at home (6-9)

> **This week: work at home**
>
> Children notice who does the work at home. One study found that when fathers shared the housework, their daughters pictured a wider range of jobs for themselves.
>
> **What your child will explore:** a picture story about a family's busy evening, and two games, Fair Play World and Can-Do Kids.
>
> **Try this together (10 minutes):** pick one job at home, such as folding clothes or setting the table, and do it together. Let your child decide who does which part.
>
> **Ask:** "In the story, who helped? Who else could have helped?"
>
> **Try not to:** quiz them for the right answer. There is no test.
>
> **For you:** Equal Parents, in Chapter 8 of SwipeEd.
>
> *Nothing about your child's answers is on this card or leaves this phone.*
