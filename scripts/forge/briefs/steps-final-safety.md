# Safety and fidelity reviewer brief: the last check before a multi-step batch ships

Used by the multi-step rollout's final certification pass ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4)).
Your prompt names the game (`<game>`, its file stem), its audience, and the review folder `<dir>`. Read
`.forge/<game>/GROUNDING.md` (truth anchors, helplines, banned framings) and the Safety scenarios and Voice sections of
`scripts/forge/briefs/steps-write.md` first.

A writer turned each single-step scenario into a 3 to 5 step story, and several rounds of reviewers and fixers have
worked on it since. Two other reviewers check the same scenarios for you: one picks the best options blind, one checks
that every next question follows from every earlier pick. **You check what they do not: whether the story is safe,
true to its source's lesson, and factually right.** These scenarios go to real players, some of them living through
what the scenario describes.

Read only `<dir>/fidelity.ndjson` and the files named above. Do not open batch files, do not run git, and do not edit any
file except `<dir>/review-safety.ndjson`.

## Each row

`id`, `type`, `cat`, `persona`, `source` (the original single-step scenario: its hook, its two options or lines with the
best one marked, the consequence of each, its debrief and relearn) and `final` (the multi-step story: hook, setup,
each step's prompt, options with their `then` and the best one marked, `why`, then debrief and relearn).

## What to check, by lens

**safety**, whenever the story involves pressure, control, coercion, violence, abuse, an unsafe situation or a helpline:
- Where the player is the one being pressured or harmed, freezing, staying silent, going along, giving in, pretending
  to be asleep or avoiding the person are survival responses: they must never be options marked short of best, and no
  `then` may show sex or harm happening because of the player's pick.
- A `why` or the `debrief` says it is never their fault. At least one step's best move reaches support (a trusted
  person, or the helpline the source or GROUNDING.md names).
- Where the player supports someone else, the best move believes them, says it is not their fault, respects their pace
  and choices (never pushes them to leave or to report), and offers a way to get help.
- Control, surveillance, violence or forced marriage are never framed as a shared problem to fix together, as fine, or
  as a choice. A risky confrontation is never the best move. Nothing graphic. No blame on the person under pressure in
  any `then`.
- Helplines appear exactly as the source or GROUNDING.md writes them, and nowhere else.

**fidelity**: the story teaches the source's lesson. The source's best move (or its intent) is the best move where the
story makes that decision, the best moves across the steps agree with each other, and `relearn` says what the source's
relearn says. Flag a story that drifts to a different lesson, reverses one, or loses the part of it that mattered most.

**facts**: every claim the story presents as true (in best options, `why`, `debrief`, `relearn`, and `then` lines that
state how things work) is correct and consistent with GROUNDING.md: health, fertility, contraception, money, adoption,
rights and process. No statistics, percentages, law names or section numbers, and no organisation names beyond the
source's and GROUNDING.md's.

**choice**: no life choice is judged. Marrying, waiting, never marrying, love or arranged marriage, living with family
or not, children or not, when and how, and every way of forming a family are never wrong options. Wrong options are
pressures, myths, shortcuts and behaviours.

**voice**: only what the other reviewers would miss: an assumption about the player's gender or community that the
story does not support, a stereotype played straight, preachy or shaming wording in a best option or `why`, or a
comma splice.

## Severity

- `block`: must be fixed before this ships. Every safety finding, every fidelity finding that loses or reverses the
  lesson, every wrong fact, and every judged life choice.
- `note`: worth fixing but not a reason to hold the batch (a weaker `why`, a slight drift in wording, voice).

Do not report matters of taste. When unsure whether something is a problem, report it as a `note` and say why.

## Writing the file

One line per row of `fidelity.ndjson`, in the same order, including rows with nothing to report:

```
{"id": "rh-010", "findings": [{"lens": "safety", "severity": "block", "field": "step 1 option 2", "problem": "'Stay silent' is a survival response marked short of best"}]}
{"id": "rh-011", "findings": []}
```

`field` names where the problem is (`hook`, `setup`, `step 2 prompt`, `step 3 option 1 then`, `step 2 why`, `debrief`,
`relearn`). Append at most 5 rows per tool call with a short Python script (`json.dumps(row, ensure_ascii=False)`).
Cover every row.

## Reply

Reply with the counts asked for. Do not paste the file into the reply.
