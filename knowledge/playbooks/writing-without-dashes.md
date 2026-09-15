---
type: playbook
owner: the-equal-lens
title: Writing without dashes
description: How SwipeEd copy, content, code comments and docs are written with no em or en dashes, the moves that replace them, the mistakes to avoid, and the gate that enforces it.
tags: [swipeed, voice, copy, content, gates]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22  # SWED-92
---

# Writing without dashes

The Equal Lens never uses em dashes or en dashes, the long and medium dashes. Not in the app, not in scenario content, not in code
comments, scripts or docs, and not in chat. This is a brand rule ([design system, Voice and copy](../design.md#voice-and-copy)),
and since 2026-09-15 a gate enforces it ([SWED-92](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22)).

Swapping a dash for a spaced hyphen ( - ), a double hyphen, an ellipsis or a slash does not follow the rule. It keeps
the dash and changes only the character. Rebuild the sentence instead.

## Pick the move by what the dash was doing

| The dash was doing this | Write this | Before (a dash where [dash] is) | After |
|---|---|---|---|
| Joining two complete thoughts | Two sentences | Caring is for everyone [dash] kindness has no gender. | Caring is for everyone. Kindness has no gender. |
| Adding a short tail, a contrast or a "not X" | A comma | An open door [dash] not paranoia. | An open door, not paranoia. |
| Following an opener ("Yes", "Hey", "Okay") | A comma | Hey [dash] it's Lensy. | Hey, it's Lensy. |
| Introducing a list or an explanation | A colon | Your tools [dash] a breath, a person, a saved line. | Your tools: a breath, a person, a saved line. |
| Setting off an aside in the middle | "like", "such as", "with", commas or brackets | Offer other ways to tell [dash] drawing, showing [dash] so telling stays possible. | Offer other ways to tell, like drawing or showing, so telling stays possible. |
| Quoting a line inside a sentence | "by saying", or a colon at the end | Joining joy [dash] "I'm happy for you!" [dash] makes it bigger. | Joining joy by saying "I'm happy for you!" makes it bigger. |
| A numeric range | A hyphen, no spaces | Ages 3 [en dash] 6 | Ages 3-6 |
| An empty table cell | A word | [dash] | none |

Then read the line aloud. If it sounds stiff, reword the clause rather than forcing punctuation into it.

## The mistake to watch for: the comma splice

The most common failure is replacing a dash with a comma between two complete sentences. The dash hid the join; the
comma exposes it. About 540 of the 3,056 first-draft rewrites in SWED-92 made this mistake and were redone by hand.

| Splice (wrong) | Fixed |
|---|---|
| "I'm really angry right now, I'll go cool off, then talk." | "I'm really angry right now. I'll go cool off, then talk." |
| "It's not luck, it follows clear biology you can learn." | "It's not luck. It follows clear biology you can learn." |
| Rest is not lazy, your mind needs breaks to stay well. | Rest is not lazy. Your mind needs breaks to stay well. |

The test: if the words after the comma could stand alone as a sentence ("I'll go cool off", "it follows clear
biology"), use a full stop, or join with a real word ("and", "so", "because", "but"). Paired asides that held a list
fail the same way: "What you'd offer a friend, talk, call a line, you're not alone, is yours" reads as a jumble;
"What you'd offer a friend is yours to use as well: talk, call a line, you're not alone" does not.

## Special cases

- **Spoken lines** (quotes, `yourLine`, what a character says) must still sound spoken. A full stop usually does it:
  "It's okay, take your time. I'm here."
- **Myths spoken by a character** keep their voice but not their punctuation: "Boys don't cry. That's just the rule."
- **Short labels and fragments** drop the dash or take a colon: "Myth: can't".
- **Safeguarding lines** keep every fact, number and "never your fault" when shortened. If a line has to lose words
  to fit the band ceiling, it loses an example, never the protective message.
- **A dash that code must match** (a spreadsheet cell holding one, a regex that accepts one) is written as an escape,
  `"\u2014"` or `[\u2013\u2014]`, so the source file has no dash and the behaviour is unchanged.
- **Hash-pinned attestations** in `.read-first/` quote source documents word for word and are not rewritten.

## The gate

`scripts/no_dashes.py` scans every text file git tracks (except `.read-first/`) and fails on any em or en dash.

| Where it runs | Scope |
|---|---|
| `npm run gates`, which runs before every build | Every tracked text file, so a Vercel preview or production deploy fails on a dash |
| `scripts/githooks/pre-commit` | The staged files |
| `scripts/forge/test_gates.py` | Fixtures: an em dash in copy and an en dash in a range fail; a hyphenated range, a clean line and a non-text file pass |

The content lint in `scripts/forge/lints.py` also flags dashes in generated batches, and the generator brief in
`scripts/forge/gen_workflow.js` tells writers not to use them.

## Known debt

About 2,000 spaced hyphens ( - ) remain in older knowledge base prose, mostly from an earlier dash-to-hyphen swap
(log bullets, table separators, game docs). They are not em or en dashes, so the gate passes them, but they break the
spirit of the rule. New docs use colons, commas and full stops; the old ones are rewritten when touched. App copy and
scenario content have none.
