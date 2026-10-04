---
type: playbook
owner: the-equal-lens
title: SwipeEd UX copy standard
description: The rules for every string a player or parent sees or hears in SwipeEd. Severity levels, word limits by age band, safety rules first, then truth, no-fail tone, clarity, every channel, voice and mechanics, with a glossary seed and the words to flag.
tags: [swipeed, playbook, ux-copy, voice, accessibility, safeguarding]
timestamp: 2026-10-04T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/3b8d2f41-f968-476f-b8a4-867231ecbe8f  # SWED-127
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02734a93-b406-46ed-8d87-34554f54568b  # SWED-132
---

# SwipeEd UX copy standard

Written on 2026-10-04 for the [UX copy audit](../audits/ux-copy-audit-2026-10-04.md), from published UX writing practice (plain language, accessible names, error and empty-state copy), the Equal Lens voice rules and the house child-safety rules. It sits under the Voice and copy section of the [design system](../design.md), and the [writing without dashes](writing-without-dashes.md) playbook covers rule 20 in detail. Check a line against the safety rules first: a line that passes everything else and fails a safety rule still blocks a release.

**Scope.** Every string a player or parent sees or hears. That includes UI, Lensy's lines, help, alt text, aria-labels, live regions and the question bank.

**Severity**
- **Block:** the line could harm or shame a child, says something false, promises what the app or a service cannot do, or keeps a pre-reader or screen-reader user from a safety line. Fix it before release.
- **Fix:** the line breaks a written house rule, or a reader in the age band would probably misread it or get stuck.
- **Polish:** the line is inconsistent or drifts from house style, with cosmetic harm only.

**Word limits by age band**

| Ch | Ages | Max words per sentence | Channel |
|---|---|---|---|
| 1 | 3-6 | 8, one clause | Everything spoken, answers included; pictures carry the answers |
| 2 | 6-9 | 10 | Audio on by default |
| 3 | 9-12 | 14 | Explain new words in the same line |
| 4-5 | 12-18 | 20 | Grade 6 reading level; never "kid" |
| 6-8 | 18 to parents | 25 | Plain English for second-language readers |

**Safety (check first)**
1. Say "safe touch" and "unsafe touch". Feelings are "hard" or "uh-oh", never "bad".
2. Tell a story about a character. Never ask about the player's own life. Ask where a feeling is, not why.
3. Harm belongs to the person who caused it. Freezing, giving in, going along or staying silent is never the wrong pile, the wrong bin or a card to cheer against. Every harm scenario says "it's never your fault".
4. Unsafe secrets get told. The best move reaches a trusted adult, and "if they don't help, tell another one".
5. Never promise privacy without its limit, as in "They keep it private unless someone is being hurt."
6. A helpline line uses the exact allowlisted number and says who it is for and when to call, with one number per sentence. Speak the number digit by digit ("1 0 9 8") and show it as 1098.
7. Copy names a help control only if that control is visible on the screen at every width. Otherwise, put the button in the card.

**Truth**

8. Claim only what the code or the service really does. Use no statistic, law or organisation unless it is grounded and attributed. Refer people to help; never give treatment.

**No fail, no shame**

9. A miss gets a nudge towards the next move, never a verdict. Never use: wrong, incorrect, fail, oops, game over.
10. Praise the action and the reason, never the person. Never judge a life choice. Replace a myth with the truth, never just negate it.
11. No pressure: no streak threats, no sad mascot, no guilt. Stopping is always a neutral choice.

**Clarity**

12. Stay under the band's word limit, with one idea per sentence and the point first. Use everyday, literal Indian English.
13. Buttons are verbs of 1 to 3 words that name the result. One name per thing and one verb per action, from the glossary.
14. Describe the goal, not the gesture, colour or position.

**Every channel**

15. Every safety line and every answer is both shown and spoken.
16. What is heard matches what is seen:
    - No meaning carried by emoji or symbols, and emoji sit in aria-hidden spans.
    - No all caps, and no `&`, `+`, `/`, `·` or `→` in running text.
    - The accessible name starts with the visible words.
    - Live regions announce whole sentences.
17. Alt text gives the cue the task needs, never the answer.

**Voice**

18. Lensy wonders and asks. Lensy is not an authority and does not lecture. Humour only where nothing is at stake, and at most one exclamation mark per screen.
19. The player is "you". Never assume gender, entry chapter, family path or history.

**Mechanics**

20. No em or en dashes, no comma splices, sentence case, straight quotes, and speech attributed with a verb.

**Glossary seed:**

| Term | Meaning or use |
|---|---|
| path, chapter, game | Not "lesson" or "world" |
| capstone | Called "Big finish" in Chapters 1-3 |
| stars | The 0-3 rating |
| coins | Coins, not stars |
| stickers | One name; not also "flags" |
| Help | The launcher |
| Get help | The action inside the sheet |
| trusted grown-up | Chapters 1-3 |
| trusted adult | Chapter 4 up |
| Lensy, UN, RE | Names stay as they are |
| classic path | The no-WebGL path |

**Words flagged automatically:**
- wrong, incorrect, oops, uh-oh as an error
- click here, tap here, learn more, submit, OK
- simply, just, easy!
- kids, kiddo, little one from Chapter 3 up
- good touch, bad touch, bad feeling, down there
- crazy, lame
- all caps, `&` and `+` in running text
- "image of" in alt text
- "please" in instructions
- confidential or private with no limit
- em or en dashes

**How to check:**
1. Read every line aloud in the band's voice.
2. Count the words.
3. Run TalkBack on a low-end Android phone.
4. Search for each glossary term.

**Known gaps in the automated gates:**
- The forge lints check only new batches and games listed in lint_clean.json.
- `.tsx` UI copy passes only the dash gate.
- Nothing checks for confidentiality promises.
- "Ask where, not why" and "Lensy is not an authority" lived only in the house skill until this standard; [design.md](../design.md) now points here.
