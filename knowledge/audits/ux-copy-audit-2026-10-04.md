---
type: audit
owner: the-equal-lens
title: "UX copy audit of the whole app (2026-10-04)"
description: Every string a player sees or hears, audited against the SwipeEd UX copy standard. Verdict, the ten problems with the biggest player impact, recurring patterns, quick wins, strengths, and all 170 findings that survived a skeptic pass.
tags: [swipeed, audit, ux-copy, accessibility, safeguarding, voice]
timestamp: 2026-10-04T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/3b8d2f41-f968-476f-b8a4-867231ecbe8f  # SWED-127
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/952350b7-ccd0-46b5-a0f5-65ae398e7141  # SWED-128
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8d5396bc-97e8-416b-9b55-ae83e1c18a98  # SWED-129
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/63710030-1e74-43d9-8095-ad3cb6fd115e  # SWED-130
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9e2b22e5-9563-4cb8-9292-9c575db20cbe  # SWED-131
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02734a93-b406-46ed-8d87-34554f54568b  # SWED-132
---

# UX copy audit of the whole app (2026-10-04)

**Scope.** A read-only audit of every string a player sees or hears, on the code as of 2026-10-04 (branch `content/multi-step-ch5`, which matched `main` for everything outside the Chapter 5 game files). It covers onboarding and settings, the path world, the game engine, toolkit and help, and game content, including alt text, accessible names and live regions. Six auditors each took one area and checked it against the [UX copy standard](../playbooks/ux-copy-standard.md); a skeptic re-read every finding against the code and dropped the ones that did not hold. Spoken output was predicted from the markup. Nobody ran TalkBack or VoiceOver on a device, so the screen-reader findings are predictions to confirm on a phone. Line numbers are as of that date and will drift.

**Fix tracking.** Umbrella [SWED-127](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/3b8d2f41-f968-476f-b8a4-867231ecbe8f). The findings are grouped into five fix tickets:

| Ticket | What it covers | Findings here |
|---|---|---|
| [SWED-128](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/952350b7-ccd0-46b5-a0f5-65ae398e7141) | Safety copy blockers: capstone laps that judge a pressured child, unlimited privacy promises, wrong help facts, "bad feeling", Chapter 1 blurbs | Problems 4, 6, 7, 8 and 9 (copy half); quick wins 1-12 |
| [SWED-129](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8d5396bc-97e8-416b-9b55-ae83e1c18a98) | Help is findable and works: the launcher, the help pill, the spoken reassure line | Problems 1, 3 and 5 |
| [SWED-130](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/63710030-1e74-43d9-8095-ad3cb6fd115e) | Path myths never shown without their truth | Problem 2; the path world appendix |
| [SWED-131](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9e2b22e5-9563-4cb8-9292-9c575db20cbe) | Settings say only what the app does | Problem 10 |
| [SWED-132](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02734a93-b406-46ed-8d87-34554f54568b) | One glossary, no jargon, no symbols read aloud | The patterns table; the low-severity appendix rows |

## Verdict

SwipeEd's game copy is warm, never makes a player fail, and is mostly ready to be spoken aloud. But the help it keeps promising is broken: six screens send children to a "Get Help" button that no longer exists, the in-game help pill only speaks, and "It's never your fault" is never read out to the pre-readers who need it most. A small set of content lines also breaks the house child-safety rules, and these should be fixed before the next release: a card that asks the player to cheer something that is not consent, a sort that blames a pressured child, privacy promised to minors with no limit, a wrong legal claim, and "bad feeling" in Chapter 1.

## Top 10 problems (highest player impact first)

### 1. Six screens point to a Get Help button that no longer exists
- **Screen:** first-run setup; the mood check-in after "Not great" or "Rough"; Settings, About; the path swipe reveal ("You matter"); the reflect support card.
- **Current:** "If anything feels too real, tap Get Help any time. It's always in the corner." / "You can always talk to someone. The Get Help button is in the corner."
- **Proposed:** Give the launcher a LifeBuoy icon and the visible word "Help" at every screen width, and let that visible word be its accessible name. Every pointer then reads "Tap Help at the top of the screen." The mood check-in reply gets its own [Get help] button that opens the help sheet. The onboarding pass suggested showing "Toolkit" instead, but "Help" is the stronger fix because help is what the child is looking for.
- **Why:** The corner pill was retired (src/components/app-shell.tsx:22-25), and get-help.tsx is imported nowhere. On a phone the corner shows only a briefcase, and TalkBack says "Open your toolkit". A child who has just said they feel rough is sent to look for a button that is not there.
- **Where:**
  - src/components/onboarding.tsx:141-142
  - src/components/toolkit/mood-check-in.tsx:90
  - src/app/settings/page.tsx:94-96
  - src/components/game-card.tsx:67
  - src/components/swipe-deck.tsx:285 (also gives the wrong corner)
  - src/components/games/reflect-play.tsx:147
  - The launcher: src/components/toolkit/toolkit-drawer.tsx:65-69

### 2. The path shows unsafe myths to the youngest players with no correction in view
- **Screen:** the 3D path canvas. This covers the Chapter 1 and 2 sticky notes and scribbles, and every chapter above the player's own.
- **Current:**
  - A bold sticky note reads "Grown-ups can touch you however they like." Its only marker is a tiny "myth" chip and the hint "pick UN to rub me out →".
  - The scribbles "Some feelings are bad." and "Boys don't get scared." are marked only by colour and a strike-through.
  - Chapter 6 myths such as "What they wore or coming over means they wanted it." render for players of any age.
- **Proposed:**
  - Chapter 1 safety notes show only the truth: "Your body is yours. You can say no."
  - From Chapter 2, show "Not true:" and the struck-through myth, with the truth visible underneath from the start. Rubbing then celebrates the truth instead of hiding it.
  - Add a focusable "Show what's true" button to every note.
  - Mount myths only for chapters the player has reached.
- **Why:** A 4-year-old, a parent reading aloud or a screen reader meets an unsafe instruction about touch and never reaches the correction. Several things combine:
  - The note text is not struck through (src/app/globals.css:448).
  - The reveal works by pointer only.
  - In Chapter 1, the decoration cap drops both truth scribbles.
  - A lock stops play but not reading.
  - The no-WebGL fallback path also shows "Play" on every node, whatever the player's age.
- **Where:**
  - src/content/chapter-canvas/chapter-1.json:28
  - src/components/path-scene.tsx:1007, :824, :607
  - src/components/learning-path.tsx:335

### 3. The in-game help pill looks like a call button but only speaks
- **Screen:** the help pill in the toolbar of every v2 game.
- **Current:** A phone icon with "Get help · Childline 1098". A tap runs `say(helpLine)`.
- **Proposed:** The pill opens the shared help sheet, where "Call 1098" dials. Every game uses one label pattern: "Get help: Childline 1098". Ages 3-6 never get a direct `tel:` link, to avoid accidental calls.
- **Why:** On a result screen nothing visible changes. With sound off or no speech voice, the tap does nothing at all. On a branch result the live region keeps the old text, so a screen-reader user hears nothing new. Across games the label comes in about ten forms ("Reach out ·", "Routes ·", "181 / 1091 / 112 / 1098").
- **Where:** src/components/games/v2-engine.tsx:309-311

### 4. Capstone laps put the child on the wrong side of a safety lesson
- **Screen:** sort and swipe laps in the Chapter 2, 3, 5 and 6 capstones.
- **Current:**
  - A swipe card whose only action is to cheer it on: "An enthusiastic yes from both people. A 'maybe, I'm not sure' treated as a yes. A yes that can be changed at any time."
  - A sort that puts "Give in when pressured" in "Crosses a line".
  - A sort that puts "Keep a scary secret" in "Not a hero move".
- **Proposed:**
  - Card: "An enthusiastic yes from both people. A yes that can change at any time. Stopping when someone says 'maybe'."
  - Item: "Keep messaging after someone says no."
  - Item: "Someone says, 'Don't tell anyone'", with bins "Safety move" and "A trick to tell about".
- **Why:** The player cheers the exact thing the chapter teaches is not consent, and a pressured or frightened child is judged for their own response. Boundary Bot says the opposite: "even if you froze or gave in once, it's never your fault" (src/content/games/boundary-bot.ts:533). This breaks rule S7.
- **Where:**
  - src/content/games/capstone-5.ts:118
  - src/content/games/capstone-6.ts:119 and :163 ("Handing all your money to someone else" filed as "A trap")
  - src/content/games/capstone-3.ts:36
  - src/content/games/capstone-2.ts:32

### 5. "It's never your fault" is on screen but never spoken
- **Screen:** safety beats in every v2 game (61 game configs set a reassure line), the help sheet and the mood check-in.
- **Current:** The reassure pill "It's never your fault. Telling a trusted grown-up helps. 💛" is text only. The help sheet and the check-in are silent.
- **Proposed:**
  - On safety beats, call `say(\`${resolveLine(sc)} ${reassure}\`)`.
  - When the help sheet opens for a player under 9 who has not muted sound, speak: "If someone is hurting you, it's not your fault. Tell a grown-up you trust. Or call Childline, 1 0 9 8."
- **Why:** Chapter 1 players cannot read, so the most important line in My Body, My Rules and Safety Squad never reaches them. Screen-reader focus also jumps to Next, past the pill.
- **Where:**
  - src/components/games/v2-engine.tsx:366 (rendered, never passed to `say`)
  - src/components/toolkit/toolkit-drawer.tsx:101
  - src/components/toolkit/mood-check-in.tsx:63

### 6. Privacy promised to under-18s with no limit
- **Screen:** help lines in the Chapter 4 health games, and the help sheet's e-Box row.
- **Current:** "A doctor's info is private, accurate and there to help." / "Report abuse online, safely and privately." / "it's routine and often confidential" / "All private, no judging."
- **Proposed:** "You can ask the doctor what stays private." / "A government website for reporting abuse of a child. It opens outside the app." / "Ask them what stays private." / "No judging."
- **Why:** A doctor may have to tell a guardian or report under POCSO, the child sexual abuse law. A child who trusted an unlimited promise and is then reported loses trust in every helper. The 2026-10-02 confidentiality sweep fixed two games but missed these. Rule S6 makes this a release blocker for under-18s.
- **Where:**
  - src/content/games/plan-it.ts:548
  - src/content/help.ts:28
  - src/content/games/outbreak.ts:568
  - src/content/games/puberty-quest.ts:478
  - Adult band: own-your-health.ts:510, :524 and :526, capstone-6.ts:251 and reflect-play.tsx:147

### 7. Help facts that are wrong or missing
- **Screen:** the help sheet, the Help Map tool, Chapter 6 help lines and the Chapter 3 graduation.
- **Current:**
  - "anyone of any gender can be a victim. India's DV Act 2005 protects you. Reach a trusted person, 181, 1091 or 112."
  - The help sheet has no emergency number and says "your school counsellor" to every age.
  - "Childline 1098 & Ask-It".
  - The Help Map's helpline step says "Helplines are there for you, day and night." and gives no number.
- **Proposed:**
  - "Abuse is never your fault, whatever your gender. Call Tele-MANAS 14416 for support, or 112 in an emergency. Women can also call 181."
  - Make the first help row "Emergency: 112, if someone is in danger right now." Give players with an entry age of 18 or more an adult prompt and the Women Helpline 181.
  - "Call Childline 1098."
  - Render the help sheet's numbered rows under the Help Map step.
- **Why:**
  - The Domestic Violence Act protects women only, so a male survivor is told something false and then handed women's lines.
  - Adults playing the domestic-abuse and dowry games are pointed to a school counsellor.
  - Ask-It is a feature that was never built, yet cr-1369 teaches adults to use it.
- **Where:**
  - src/content/games/respect-at-home.ts:558 (also money-independence.ts:494)
  - src/content/help.ts:6-10
  - src/content/toolkit.ts:60 and :63
  - src/content/games/consent-real.ts:482
  - src/components/toolkit/tool-player.tsx:96

### 8. Chapter 1 and 2 body-safety content calls a feeling "bad"
- **Screen:** the secret card in My Body, My Rules (ages 3-6) and a build card in Safety Squad.
- **Current:** "A secret that feels bad stays heavy until you tell a trusted grown-up." / "Build the 'uh-oh, what next' plan when a person gives you a bad feeling."
- **Proposed:** "Uh-oh secrets get told to a trusted grown-up." / "...when a person gives you an uh-oh feeling."
- **Why:** Rule S2 says there are no bad feelings, only hard ones, and it is a release blocker in body-safety content for ages 3-12. ss-1322 was flagged as A14 in the 2026-09-14 audit and is still unfixed. The card's reason, "Telling is what helps the feeling go", also promises too much.
- **Where:**
  - src/content/games/my-body.ts:472 (mb-1285)
  - src/content/games/safety-squad.ts:445 (ss-1322)

### 9. Pre-readers hear the question but not the answers, and Chapter 1 lines run far over the limit
- **Screen:** every Chapter 1 game, the badge blurbs spoken on the completion card, and first-run setup.
- **Current:**
  - Answer cards are silent text.
  - "My body is mine, safe or unsafe is the rule, I can say no and tell, and it's never my fault." (21 words)
  - "All feelings are okay, naming one makes it smaller, I can calm the big ones, and saying no and asking for help are brave." (24 words)
- **Proposed:**
  - In games with an age gate under 6, Lensy reads the answer words after the question, and tapping a card speaks it. Wire in the approved Feelings Friends pictures.
  - "My body is mine. I can say no. I can tell a grown-up. It's never my fault."
  - "All feelings are okay. I can calm big ones. Asking for help is brave."
  - In setup, add: "Playing with a young child? Set this up together."
- **Why:** Chapter 1 allows 8 words and one clause per sentence, and every line must be spoken. Right now a player aged 3-6 cannot finish a step without reading.
- **Where:**
  - src/components/games/reflect-play.tsx:111
  - src/components/games/v2-engine.tsx:512, :587, :663, :742
  - src/content/games/my-body.ts:598
  - src/content/games/feelings-friends.ts:577 (also same-same.ts:487, can-do.ts:554, clean-crew.ts:529)
  - src/components/onboarding.tsx:59

### 10. Settings promise what the app does not do
- **Screen:** Settings.
- **Current:**
  - "School-Comfort Mode / Hides the romantic "Crushes & Dating" deck. Keeps Friendship, Family, Online, Peer and Norm-Buster content."
  - "Calm Mode / A quieter, reduced-stimulation feel..."
  - "Reset all progress and start over?"
- **Proposed:**
  - Remove School comfort mode until it filters games on the path. If it stays, say "Only hides the Crushes and Dating deck in Quick Play. Games on the path do not change."
  - "Calm mode: Less movement and no confetti. Sounds are set separately."
  - "Start over? This deletes your name, age group, stars and settings on this device. You can't undo this."
- **Why:**
  - A teacher who turns on School comfort mode believes romantic content is hidden. In fact a player on the path sees no change, and the dating and sexual-health chapters stay open.
  - Calm mode still plays the celebration chime.
  - Reset wipes the whole profile, not just progress.
  - Most players cannot reach Settings at all: the only link to it is in the no-WebGL fallback path.
- **Where:**
  - src/app/settings/page.tsx:30, :59, :104, :22
  - The only `href="/settings"`: src/components/learning-path.tsx:207

## Patterns that recur, and the one rule that fixes each

| Pattern | Examples | The rule |
|---|---|---|
| Copy names or locates a control that has moved or was never built | The six Get Help pointers; "pick UN" on phones, where tool labels are hidden; "Get my graduation sticker" leading to a stars screen; Ask-It | Copy may name a control only if it is visible on that screen at every width. Otherwise, put the button inside the card. |
| A safety line reaches only one channel | Reassure is text only; the help pill is speech only; the help sheet, check-in and answer cards are silent; the breathing screen announces emoji names but never "breathe in" | Every safety line and every answer is both shown and spoken. |
| Promises the app or a service cannot keep | Unlimited confidentiality; "telling always helps"; "never alone"; "Hard days happen, and they pass"; "since age 4"; "The whole journey complete!"; a fake 37% loader; Calm mode "quieter"; School comfort mode | State only what the code or the service really does, and name the limit. |
| The harm is pinned on the wrong person | The capstone sorts and swipe; "Handing all your money to someone else" | In any sort, swipe or bin, the harmful act belongs to the person causing harm. Freezing, giving in or staying silent is never the wrong pile. |
| Sentences over the age band's word limit | Chapter 1 blurbs of 20-25 words; amazing-journey at 30 words for ages 9-12; toolkit steps saying "negotiate" and "support network" to 4-year-olds | Count words against the chapter's limit (8, 10, 14, 20 or 25) before a line ships. The toolkit needs a separate step set for levels 1-2. |
| Symbols, emoji and capitals get read aloud | `·`, `→`, `/`, `&`, `+`, `≠`, "24/7", emoji in headings and blurbs, NEVER and THIS in capitals, "Lv" | No symbol carries meaning in visible text. Emoji go in aria-hidden spans. No all caps. |
| One thing has many names | Get Help, Get help and Toolkit; seven verbs on the help pill; four names for "No, Go, Tell"; path titles that differ from game titles; stickers, stars and flags for the same thing; lesson and game; world and path; three "Upstander!" badges; four names for the DV Act; "Dismiss" and "Close" | Keep one glossary in design.md: one name per thing and one verb per action. |
| Jargon, idioms and US English | capstone, myth (for ages 3-9), avatar, behaviour-only, combo, frenemy, tattling, Meh, "Have a good one", "Close to home?", "took the wheel", GBV, FRIES, POSH IC, CARA, Justice League, Equalize, College | Write for a reader whose first language is not English. Replace any word the age band would not say aloud, or explain it in the same line. |
| Helplines with no audience | Childline offered for curiosity and to adults; "1098/112" reads as one service; "call Manodarpan" with no number given | Each helpline line says who it is for and when to call, with one number per sentence. |
| Assumptions about the player | "Eight chapters ago you were three"; "the grown-up you always deserved"; "especially as a woman"; "22 → first child"; the bedtime nudge shown to adults before setup | Never assume entry chapter, gender, family path or history. Say "your path", not "your whole journey". |

## Quick wins (one-line edits)

1. src/content/games/capstone-5.ts:118 and capstone-6.ts:119: replace the non-consent example with "Stopping when someone says 'maybe'." in capstone 5 and "Stopping when the answer is unclear." in capstone 6.
2. src/content/games/capstone-3.ts:36: item d becomes "Keep messaging after someone says no".
3. src/content/games/plan-it.ts:548: end the line with "You can ask the doctor what stays private."
4. src/content/help.ts:28: "A government website for reporting abuse of a child. It opens outside the app."
5. src/content/games/respect-at-home.ts:558: "Abuse is never your fault, whatever your gender. Call Tele-MANAS 14416 for support, or 112 in an emergency. Women can also call 181."
6. src/content/games/safety-squad.ts:527: "It's never your fault. If the first grown-up doesn't help, tell another one."
7. src/content/games/my-body.ts:598: "My body is mine. I can say no. I can tell a grown-up. It's never my fault."
8. src/content/games/bounce.ts:562: "Call Tele-MANAS 14416 or Childline 1098. In an emergency, call 112."
9. src/content/games/safety-squad.ts:445 and my-body.ts:472: change "bad feeling" to "uh-oh feeling".
10. src/content/chapter-canvas/chapter-6.json:18: "A drunk yes still counts as consent."
11. src/content/games/capstone-5.ts:320: change the done title to "Chapter 5 complete!"
12. src/app/settings/page.tsx:59: "Less movement and no confetti. Sounds are set separately."
13. src/app/layout.tsx:59: set `lang="en-IN"` to match Lensy's voice.
14. src/components/path-scene.tsx:422: drop "capstone, " from the spoken name when the label already starts with "Capstone".

## What the copy already does well

- **Nudges point to the next move without judging.** "Not a match. Try another." (src/components/games/v2-engine.tsx:696), "Look again. Is that really true?" (:559), and "You found 2 of the 3 that fit, and picked one that doesn't. Look again." (:461).
- **The privacy lines are true.** "Only you see this. It isn't saved or sent anywhere." (src/components/games/reflect-play.tsx:173) matches the code. The mood value is never stored (src/lib/store.tsx:205-206). There is no account, and the profile lives only in localStorage.
- **The help sheet starts in the right place.** It opens with "If someone is hurting you, it's not your fault." (src/content/help.ts:4). Childline's row names the limit of confidentiality (:10). Every number matches the allowlist (scripts/forge/common.py:51-60).
- **Reflect avoids inviting a disclosure.** Safety beats are a single tap with no text box, and ages 3-6 get a talk card instead (reflect-play.tsx:60-65).
- **Speech hygiene is built in.** cleanLine, plainLabel and pairLine tidy what is spoken, speak.ts strips emoji, and swipe cards have labelled tap buttons (src/components/games/swipe-card.tsx:58-68).
- **There is no pressure copy.** No streak-loss warnings and no sad mascot. The bedtime nudge and the mood check-in are optional, and "I'm okay for now" is as plain as the other options (src/components/toolkit/mood-check-in.tsx:91).
- **Path nodes are labelled well.** Each spoken name starts with the visible game name and states the node's state in words (path-scene.tsx:422). Decorative art is hidden from screen readers.
- **Myths are replaced, not just negated.** Chapter 1 truths are model short lines, such as "Your body is yours. You can say no."
- **Serious topics are never scored.** Both engines always award 3 stars (v2-engine.tsx:317, capstone-rich.tsx:540).
- **House style holds.** Spelling is Indian English, and none of the audited files has an em or en dash.

## Appendix: every kept finding, by area

Duplicates across areas are merged into the area that owns the file.

### Onboarding and settings

| File:line | Current | Proposed | Sev |
|---|---|---|---|
| src/components/onboarding.tsx:141 | "tap Get Help any time. It's always in the corner." | "Some games are about bodies, staying safe and feelings. If anything worries you, tap Help at the top." | high |
| src/app/settings/page.tsx:30 | "School-Comfort Mode / Hides the romantic "Crushes & Dating" deck..." | Remove the switch, or "Only hides the Crushes and Dating deck in Quick Play. Games on the path do not change." | high |
| src/app/settings/page.tsx:94 | "A game about reading relationships... behaviour-only. The Get Help button..." | "SwipeEd is a path of short games about feelings, bodies, safety and fairness, from age 3 to parenthood. Nothing to fail. Everything stays on this device." | medium |
| src/components/onboarding.tsx:99 | "How old are you?" with "22+" and "Parent" in the age grid | Hint "Setting up for a child? Pick their age.", "22 and up", a full-width "I'm a parent" button, and a note that later chapters open as you play | medium |
| src/components/onboarding.tsx:65 | "Pick a name (any name)" / "e.g. Sky" | "What should Lensy call you?" with the hint "A nickname is fine. It stays on this device." Add "Hi, I'm Lensy!" | medium |
| src/components/onboarding.tsx:59 | "Travel the path one lesson at a time." | Add "Playing with a young child? Set this up together." Change "lesson" to "game". | medium |
| src/components/wind-down-nudge.tsx:42 | "It's getting late. Let's pick this up tomorrow. 🌙" / "Dismiss" | "Getting late? Your path will be here tomorrow." Use "Close" and show the nudge only after setup. | medium |
| src/app/settings/page.tsx:22 | Back link labelled "Back"; Settings reachable only from the fallback path | "Back to the path". Add a Settings row to the Toolkit sheet. | medium |
| src/app/settings/page.tsx:104 | "Reset all progress and start over?" | "Start over? This deletes your name, age group, stars and settings on this device. You can't undo this." | medium |
| src/app/settings/page.tsx:59 | "Calm Mode / A quieter, reduced-stimulation feel..." | "Calm mode / Less movement and no confetti. Sounds are set separately." | medium |
| src/app/settings/page.tsx:46 | "Swipe, combo and celebration sounds across every game." | "Sounds for swipes and wins. Lensy's voice has its own speaker button in each game." | low |
| src/app/layout.tsx:29 | "...for ages 3-18 ... built on Unlearn → Relearn → Grow." | "Short, warm games about feelings, bodies, safety and fairness, from age 3 to parenthood. Nothing to fail." Use the same text in manifest.ts:8. | low |
| src/components/onboarding.tsx:77 | "Pick an avatar" (the pick is never shown again) | Drop the step, or "Pick your animal" and show the animal on the path | low |
| src/components/onboarding.tsx:122 | Language pills "English" and "हिन्दी (soon)" that cannot be tapped | "Games are in English for now. A Hindi version (हिन्दी) is coming." Mark the Hindi word lang="hi". | low |
| src/app/path/page.tsx:106 | "The 3D path isn't supported on this device, but you can use the classic view." | "This phone can't show the 3D path. Every game is on the classic path too." | low |
| src/app/layout.tsx:59 | `<html lang="en">` | `lang="en-IN"` | low |
| src/components/onboarding.tsx:148 | "Start playing →" disabled with no reason given | Hint linked to the button: "Add a name and pick an age to start." | low |

### Path world

| File:line | Current | Proposed | Sev |
|---|---|---|---|
| src/content/chapter-canvas/chapter-1.json:28 | "Grown-ups can touch you however they like." shown in bold | Chapter 1: show the truth only. Chapters 2-3: "Not true:" plus the struck-through myth, with the truth visible | high |
| src/components/path-scene.tsx:1007 | Scribble "Some feelings are bad.", marked by colour and strike-through only | Chapters 1-2: scribble the truth. Chapter 3 up: a visible "Myth:" and screen-reader text "Myth: " | high |
| src/components/path-scene.tsx:824 | The truth is revealed by rubbing only | A focusable "Show what's true" button | high |
| src/components/path-scene.tsx:607 | Myths for all 8 chapters render for players of any age | Mount notes only for chapters the player has reached | high |
| src/components/learning-path.tsx:335 | "Play" on every node; spoken as "{title}, start" | Base status on the unlock rules. "{title}, locked. Finish {prereq} first." | high |
| src/content/chapter-canvas/chapter-6.json:18 | "They were drunk, but it still counts." | "A drunk yes still counts as consent." | medium |
| src/content/chapter-canvas/chapter-4.json:28 | "They're health conditions, and often treatable." (and 7 more truths that open with a pronoun) | "STIs are health conditions, and many are treatable." Name the subject in each. | medium |
| src/components/path-scene.tsx:422 | "{label}, locked, finish earlier lessons first" on a disabled button | Use aria-disabled. "Norm Storm, locked. Finish Flip the Script first." | medium |
| src/content/path.ts:34 | "Capstone: My First Friends", spoken with "capstone" twice | Speak it once. Chapters 1-3: "Big finish: My First Friends" | medium |
| src/content/path.ts:115 | "Ch.7 · 22 → first child"; "Everyone is equal & can-do" | "Chapter 7, ages 22 and up"; "Everyone is equal. Anyone can try." Use a title map in gen-path.py. | medium |
| src/components/path-scene.tsx:821 | Chips "myth" and "truth ✓"; "pick UN to rub me out →" | "Not true" and "True"; "Pick UN, the eraser, then rub this out" | medium |
| src/components/unlearn-toolbar.tsx:19 | No hint when a tool is on, and one finger stops moving the path | "Rub a myth to clear it. Use two fingers to move." | medium |
| src/app/path/page.tsx:128 | Bare numbers next to hidden flame and star icons | Screen-reader text "Best streak: 4" and "120 coins"; a coin icon | medium |
| src/components/unlearn-toolbar.tsx:24 | Tooltip "Relearn the truth" | "Draw on the path" | low |
| src/components/world-loader.tsx:48 | "Building your world… 37%" (a made-up number) | "Building your path…" with no number | low |
| src/components/learning-path.tsx:323 | "SRH · Relationships", "Parent Layer · RSE guidance" | "Health and relationships", "For parents", "Big finish" | low |
| src/components/unlearn-toolbar.tsx:44 | "reset" / "Reset the myths" | "Reset" / "Bring the myths back and clear your drawing" | low |
| src/components/path-scene.tsx:471 | The node label and "Play, Riya?" bubble are read separately | Hide both from screen readers; name the node "Feelings Friends. Play, Riya?" | low |
| src/content/path.ts:72 | "Justice League: Rights Edition"; "Equalize" | "Rights League"; "Equalise" | low |
| src/content/chapter-canvas/chapter-1.json:13 | "Crying lets big feelings out; it's healthy, not babyish." | "Crying lets big feelings out. It helps." | low |
| src/content/chapter-canvas/chapter-2.json:18 | "You can tell everything about someone from boy or girl." | "Being a boy or a girl tells you everything about someone." | low |
| src/content/chapter-canvas/chapter-7.json:28 | "A woman's clock means she must hurry." | "A woman must marry before she gets too old." / "Whether and when to marry is your choice." | low |
| src/content/chapter-canvas/chapter-5.json:49 | "Virality isn't credibility." | "Going viral doesn't make it true." | low |

### Game engine

| File:line | Current | Proposed | Sev |
|---|---|---|---|
| src/components/games/reflect-play.tsx:147 | "Get help at the top of the screen has free, confidential lines you can call." | A real Get help button in the card. "You can also call Childline 1098. Tap Get help." | high |
| src/components/games/v2-engine.tsx:309 | The help pill only speaks | Open the help sheet. Label: "Get help: Childline 1098" | high |
| src/components/games/v2-engine.tsx:366 | The reassure line is text only | Speak it after the result line on safety beats | high |
| src/components/games/reflect-play.tsx:111 | Answer cards are silent text | Under age 6, speak the answers; a tap speaks the card; add pictures | high |
| src/components/games/v2-engine.tsx:296 | aria-label "{n} of {m} earned" on a plain div | role="img" with "2 of 6 stickers"; add ", done" for finished tiles | low |

### Toolkit and help

| File:line | Current | Proposed | Sev |
|---|---|---|---|
| src/components/toolkit/mood-check-in.tsx:90 | "The Get Help button is in the corner." | "You can always talk to someone you trust." plus a [Get help] button | high |
| src/components/toolkit/mood-check-in.tsx:85 | "Hard days happen, and they pass. Want a moment to just breathe?" | "Thanks for telling me. Hard days happen. Want to take some slow breaths?" with [Take slow breaths], [Get help] and [I'm okay for now] | high |
| src/components/toolkit/toolkit-drawer.tsx:65 | "Open your toolkit"; only a briefcase on phones | A LifeBuoy and the word "Help" at every width; sheet title "Help and tools" | high |
| src/content/toolkit.ts:63 | "Childline 1098 & Ask-It" | "Call Childline 1098". Also fix consent-real.ts:482. | high |
| src/content/toolkit.ts:60 | "Helplines are there for you, day and night." with no number | Show the help sheet's rows; speak "Call 1 0 9 8." | high |
| src/content/help.ts:28 | "Report abuse online, safely and privately." | "A government website for reporting abuse of a child. It opens outside the app." | high |
| src/components/toolkit/toolkit-drawer.tsx:107 | Each row starts a phone call, but nothing says "Call" | "Call 1098: Childline. Free help for children, day and night." | medium |
| src/content/help.ts:10 | "Free, 24/7 help for children."; no 112; adults told "school counsellor" | First row "Emergency: 112"; "day and night"; adult prompt; Women Helpline 181 for 18 and over | medium |
| src/content/help.ts:6 | "a parent, a teacher, or your school counsellor." | "Talk to an adult you trust, like a parent, a teacher or a relative. If they don't help, tell another one." | medium |
| src/content/help.ts:22 | "Report grooming, sextortion or image abuse." | "Call if someone online asks for private photos or threatens to share them. It is not your fault." Check before release that 1930 takes these reports. | medium |
| src/components/toolkit/mood-check-in.tsx:63 | Nothing is spoken; the reply closes after 1.5 s | Speak "How are you today? Tap a face."; announce the reply; keep it up for at least 5 s | medium |
| src/components/toolkit/breathing-space.tsx:47 | Announces "Smell the flowers 🌸" / "Blow the candle 🕯️" | "Breathe in, like smelling a flower" / "Breathe out slowly, like blowing a candle" | medium |
| src/content/toolkit.ts:24 | "Weigh them against your values...", "negotiate", "support network" at every level | A separate step set for levels 1-2, 8 words at most per line | medium |
| src/content/toolkit.ts:29 | "Name a feeling & take a basic calm", "Resilience-grade coping" | "Name a feeling and breathe slowly", "Bounce back from hard days" | medium |
| src/components/toolkit/toolkit-drawer.tsx:96 | "More skills unlock as you play the feelings & life-skills games. 🌱" | "Your skills will show here. Finish Feelings Friends to get them." | medium |
| src/components/toolkit/tool-player.tsx:26 | Step cards give no cue that a tap reads them aloud | End each tool intro with "Tap a card to hear it." | medium |
| src/components/toolkit/toolkit-drawer.tsx:101 | The help sheet is silent | Speak the not-your-fault line to players under 9 | medium |
| src/components/games/game-done.tsx:48 | Skills unlock with no message | "New skills in your toolkit. Find them under Help at the top." | medium |
| src/content/games/raising-gender-diverse-kids.ts:483 | A US suicide statistic on the confetti screen | "Your acceptance protects your child more than anything. Lead with love. Let them choose who to tell. Say no to 'cures'." | medium |
| src/components/toolkit/toolkit-drawer.tsx:49 | "🔥 {n}-day streak" shown on the help sheet | Hide it on the help sheet; elsewhere "3 days in a row" | low |
| src/components/toolkit/mood-check-in.tsx:15 | Mood options "Meh" and "Rough" | "So-so" and "Hard day" | low |
| src/components/toolkit/mood-check-in.tsx:63 | "There's no wrong answer." | "Any answer is okay. It isn't saved." | low |
| src/components/toolkit/mood-check-in.tsx:98 | "Love that. Have a good one! 💛" (also shown after "Meh") | "Thanks for checking in. Enjoy your games." | low |
| src/components/toolkit/breathing-space.tsx:40 | Only an X icon, and the screen loops forever | A visible "Done" button | low |
| src/components/toolkit/tool-player.tsx:92 | "Open the breathing space" here, "Breathing space" elsewhere | "Take slow breaths" on all three buttons | low |
| src/components/toolkit/toolkit-drawer.tsx:91 | "Lv {n}" | "Level {n}" | low |
| src/components/toolkit/toolkit-drawer.tsx:72 | "Your Toolkit"; the items are called both skills and tools | "Help and tools"; one word for the items | low |
| src/lib/toolkit.ts:18 | "Notice & handle big feelings, the healthy way." | "Notice big feelings and calm them." | low |
| src/components/games/game-done.tsx:62 | Emoji in the heading and blurb; "OWNING"; comma splices | Hide emoji from screen readers; lower case; split the sentences | low |
| src/content/games/capstone-5.ts:316 | "Every sticker since age 4 glows with them." | "Every sticker on your path glows with them." | low |
| src/components/games/capstone-rich.tsx:455 | "Get my graduation sticker! 🎓" | "See what you've grown" | low |
| src/components/toolkit/toolkit-reflection.tsx:16 | "🧰 Skills you've grown"; "...across the whole journey" | A real heading; "Four skills you've grown, yours for life." | low |
| src/content/games/amazing-journey.ts:546 | A 30-word blurb using "egg + sperm" | "You know how a baby starts, from an egg and a sperm. You know how it grows and is born." | low |

### Game content

| File:line | Current | Proposed | Sev |
|---|---|---|---|
| src/content/games/capstone-5.ts:118 | Cheer card includes "'maybe' treated as a yes" (also capstone-6.ts:119) | "Stopping when someone says 'maybe'." | high |
| src/content/games/capstone-3.ts:36 | "Give in when pressured" filed under "Crosses a line" | "Keep messaging after someone says no" | high |
| src/content/games/capstone-2.ts:32 | "Keep a scary secret" filed under "Not a hero move" | "Someone says, 'Don't tell anyone'"; bins "Safety move" and "A trick to tell about" | high |
| src/content/games/plan-it.ts:548 | "A doctor's info is private, accurate and there to help." | "You can ask the doctor what stays private." | high |
| src/content/games/outbreak.ts:568 | "it's routine and often confidential" (also puberty-quest.ts:478, own-your-health.ts:524) | "Ask them what stays private." / "No judging." | medium |
| src/content/games/amazing-journey.ts:548 | Childline offered for curiosity (also defenders.ts:559) | "Ask a trusted adult, a teacher or a doctor. If someone is hurting you, call Childline." | medium |
| src/content/games/bounce.ts:562 | "mean reach out NOW: ... Childline 1098/112" | "Reach out today. Call Tele-MANAS 14416 or Childline 1098. In an emergency, call 112." | medium |
| src/content/games/my-body.ts:600 | 1098 spoken as digits here, spelled out and shown in other games | Speak the spelled-out form and show the digits, everywhere | medium |
| src/content/games/my-body.ts:598 | Blurbs of 20-25 words (also can-do, clean-crew, same-same, feelings-friends, body-lab) | Sentences of 8 words or fewer | medium |
| src/content/games/can-do.ts:542 | "Ooh, who could wear THIS?" (also same-same.ts:475, body-lab.ts:569) | "Hi, I'm Lensy. Any job can be your job. Let's try some on!" | medium |
| src/content/games/safety-squad.ts:511 | "never alone. Let's train: spot it, say no, and tell." | "Let's practise No, Go, Tell: say no, get away, tell a grown-up." | medium |
| src/content/games/safety-squad.ts:527 | "telling always helps" | "If the first grown-up doesn't help, tell another one." | medium |
| src/content/games/capstone-1.ts:33 | "every answer here is a happy one", then a wrong pick is refused | "Find the 2 that show everyone is welcome."; miss line "That one's nice too. Look for another." | medium |
| src/content/games/capstone-1.ts:36 | Pairs where any match makes sense ("A caring hug" to "Family love") | "A hug from Nani"; make capstone-2's pairs a build lap | medium |
| src/content/games/capstone-1.ts:31 | "which of these is your choice to make? Pop them..." | "Sort each card. 'My body, my rules', or 'My helpers'?" | medium |
| src/content/games/capstone-4.ts:39 | "Ability isn't gendered; that's a myth, not a fact..." | "Girls and boys can both be great at maths and science. Skill grows with practice." | medium |
| src/content/games/capstone-6.ts:192 | "You can bust this one in your sleep now." (also :242) | Give the reason: "Results change. Your worth does not." | medium |
| src/content/games/capstone-4.ts:44 | "a trusted adult is always the move", with no not-your-fault line | "If someone online tricks you, it's never your fault. A trusted adult can help." | medium |
| src/content/games/capstone-6.ts:163 | "Handing all your money to someone else" filed as "A trap" | "Someone else controlling all your money" | medium |
| src/content/games/capstone-8.ts:24 | "Eight chapters ago you were three... the grown-up you always deserved." | "Look at you. This chapter was about being the safe grown-up a child needs." | medium |
| src/content/games/capstone-5.ts:320 | "The whole journey complete!", then a preview of Chapter 6; "ages 4 to 18"; "College" | "Chapter 5 complete!"; "Standing on My Own (ages 18-22)" | medium |
| src/content/games/capstone-1.ts:18 | The closing text describes scenes that are not on screen (also capstone-8.ts:25) | "Your Friendship Garden is in bloom." | medium |
| src/content/games/capstone-8.ts:264 | "...that you wished you'd had?" | "What do you most want to give your child?" | medium |
| src/content/games/stand-up.ts:571 | "GBV & your rights", "The 5 Ds", "(FRIES)" | "Gender violence and your rights", "5 safe ways to step in" | medium |
| src/content/games/raising-gender-diverse-kids.ts:485 | "India: NALSA dignity."; the statistic appears four times | "If your child is struggling, call Tele-MANAS 14416. If they are in danger, call 112." | medium |
| src/content/games/break-the-cycle.ts:461 | "Fear harming your child? Get help; crisis: Childline 1098 or 112." | "Afraid you might hurt your child? Call Tele-MANAS 14416 today. If a child is in danger now, call 112." | medium |
| src/content/games/mind-matters.ts:566 | "dark thoughts" (also looking-after-you.ts:441 "scary thoughts") | "...or you think about hurting yourself, tell a trusted grown-up." | medium |
| src/content/games/choosing-building.ts:536 | Childline listed to adults with no audience | "If you are under 18, call Childline 1098." | low |
| src/content/games/capstone-3.ts:32 | "Tap any star"; the same items called stickers, stars and flags | "Tap each one to hear what you learned." | low |
| src/content/games/capstone-6.ts:63 | "...especially as a woman." | Drop the clause | low |
| src/content/games/choosing-building.ts:537 | "Get help · 181 / 1091 / 112 / 1098"; "Routes · CARA" | One number on the pill: "Get help: Women Helpline 181" | low |
| src/content/games/be-the-safe-adult.ts:454 | The help line repeats the reassure line word for word | The help line gives the action and the number | low |
| src/content/games/friend-frenemy.ts:553 | "brave, not tattling" | "Telling a grown-up to keep someone safe is helping, not complaining." | low |
| src/content/games/fair-play.ts:530 | "Fair ≠ same" | "Fair isn't always the same" | low |
| src/content/games/what-makes-me.ts:539 | "Not what you like", "Screen care", "Tools & respond" | "Likes don't decide who you are", "Eyes and sleep", "Tools and how to respond" | low |
| src/content/games/firewall.ts:583 | "NEVER", "NOT", "Does NOT spread it" | Lower case; "Doesn't spread it" | low |
| src/content/path.ts:94 | Path title "Capstone: Building Together" vs game title "A Life, Built" | One name per game everywhere | low |
| src/content/games/not-funny.ts:504 | Three different badges all called "Upstander! 🦸" | "Kind Ally!", "Speak-Up Star!", "Upstander!" | low |
| src/content/games/capstone-4.ts:53 | "This certifies you a ... graduate."; "Chapter One"; ages 3 and 4 both given as the start | "This certifies that you are..."; "Chapter 1 complete!"; one starting age | low |
| src/content/games/capstone-6.ts:20 | "look at you... took the wheel of an adult life" | "Look at you... took charge of your adult life" | low |
| src/lib/personalize.ts:14 | "Aanya! Hey, Smart Screen Hero!" | "Hey, it's Lensy. Let's learn to spot what's real online, and be kind there." | low |
| src/content/games/respect-at-home.ts:544 | "Close to home? It's never your fault." | "If this is happening to you, it's never your fault." | low |
| src/content/games/equal-parents.ts:489 | "reach Looking After You"; "call ... Manodarpan" (no number) | "Play Looking After You on your path"; "ask your school about Manodarpan" | low |
| src/content/games/us-after-kids.ts:468 | "Two in three couples feel the dip." (no source) | "Many couples feel the dip." | low |
| src/content/games/money-together.ts:494 | "PWDVA 2005" and three other names for the same law | "the Domestic Violence Act (2005)" everywhere | low |
| src/content/games/friend-frenemy.ts:539 | "how do you spot a frenemy?" (never explained) | "And what's a frenemy, a friend who is often unkind?" | low |
| src/content/games/boundary-bot.ts:533 | "even if you froze or gave in once... the brave, right thing" (30 words) | "It's never your fault, even if you froze or went along. You can tell a trusted grown-up any time." | low |
| src/content/games/capstone-8.ts:286 | Every answer option is a yes | Add "Not yet, and that's okay" | low |

### Found during verification (not in the auditors' lists)

| File:line | Issue | Sev |
|---|---|---|
| src/content/games/respect-at-home.ts:558 | The DV Act is said to protect any gender, but it protects women only. Same claim in money-independence.ts:494. | high |
| src/content/games/my-body.ts:472 | "A secret that feels bad", in Chapter 1 body safety. Same problem in safety-squad.ts:445. | high |
| src/content/games/own-your-health.ts:510 | Confidentiality with no limit, also at :526 and capstone-6.ts:251 (a card the player is asked to cheer) | medium |
| src/content/games/feelings-friends.ts:579 | "They want to help." promises that every grown-up will help, and leaves out "keep telling" | medium |
| src/components/toolkit/toolkit-drawer.tsx:37-56 | The sheets are not dialogs and do not move focus. The Back button sits inside the heading. | medium |
| src/components/unlearn-toolbar.tsx:32 | "Hide notes" leaves the struck-through myths on screen, and the toggle is hidden on phones | medium |
| src/components/games/game-done.tsx:64 | The star rating's label sits on a plain div, so screen readers usually skip it | low |
| src/components/wind-down-nudge.tsx:36 | The bedtime nudge and the mood check-in overlap on a first evening | low |
| src/app/settings/page.tsx:36-40 | Switch descriptions are not linked to their switches, so they are never spoken | low |
| [swipeed-world.md](../games/swipeed-world.md):68 | The KB no longer matches the code; also life-skills-toolkit.md:153-155, :165-169, :177 | low |
