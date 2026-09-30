# Fixer brief: resolve the reviews of one multi-step batch

Used by the multi-step rollout ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4)).
Your prompt names the game (`<game>`, its file stem), its audience and the batch number `NN`. The batch is
`.forge/<game>/steps/batch-NN.ndjson`. Read `scripts/forge/briefs/steps-write.md` first: every rule there still holds
after your edits. Background on the game: `.forge/<game>/GROUNDING.md`.

## Start

1. Keep a copy of the batch before you touch it, unless the copy already exists:
   `cp -n .forge/<game>/steps/batch-NN.ndjson .forge/<game>/steps/batch-NN.before-fixes.ndjson`
2. Collect the findings. Skip any command whose folder does not exist.
   - Blind disagreements, where a reviewer who had not seen the answers picked a different option (step numbers are
     0-based): `python3 scripts/forge/blind_review.py diff <game> .forge/<game>/steps/review-NN .forge/<game>/steps/batch-NN.ndjson --batch-only`
   - Audit breaks and notes (steps are 1-based):
     `python3 scripts/forge/steps_audit.py check <game> .forge/<game>/steps/audit-NN .forge/<game>/steps/batch-NN.ndjson`
   - Older continuity notes, if `.forge/<game>/steps/review-NN/review-continuity.ndjson` exists.
   - Gate rejects: `python3 scripts/forge/forge_check.py --batch .forge/<game>/steps/batch-NN.ndjson --game <game>`
3. Work through them in this order: safety notes, disagreements, breaks, the other notes, gate rejects.

## Safety notes

Handle every note that starts with `safety:` first, following the Safety scenarios section of steps-write.md. Where the
player is the one being pressured or harmed, replace each survival-response option (freezing, staying silent, going
along, giving in, pretending to be asleep, avoiding them) with a belief, myth, self-blame thought, secrecy or poor
advice from someone else; rewrite any `then` in which sex or harm happens because of the player's pick; make sure a
`why` or the `debrief` says it is never their fault; and make reaching support (a trusted person, the helpline where
the source has one) the best move in at least one step. Then re-read the scenario for continuity.

## Disagreements

A disagreement means a thoughtful reader who had not seen the answer chose differently, so the step is not clear
enough. Decide which it is:

- **The key is right but a near miss is too defensible.** Rewrite the tempting option so it is still realistic but
  clearly skips something (decides alone, delays the real talk, asks the wrong person, promises too much), or sharpen
  the best option. Do not make it silly, and keep the lengths balanced.
- **The reviewer's option is genuinely better.** Move `best` to it, rewrite `why`, and make sure the old best still
  reads as tempting but short of best. Then re-check that step's `then` lines against the next prompt.
- **Both are equally good.** Rewrite one of them so only one is best.

Never resolve a disagreement by just moving `best` without re-reading the whole step.

## Breaks

A break names the option picked in the step before, its `then`, and the prompt that does not follow. Rewrite the next
prompt so it follows from every option's `then` in the step before, usually by moving time forward or bringing in the
other person's next point. If one `then` closes the situation (you left, refused, blocked), you may instead rewrite
that `then` so the story can continue. A best option that fits only one earlier path gets rewritten so it fits them
all. Re-read the whole scenario afterwards: a fix can break a later step.

Role-plays break most, and a first round of fixes left most of their breaks in place. Fixes that hold:

- Write the next prompt as the other person raising their next point in their own words, never answering one
  particular line: `Naina asks: "Can we look at weekends too?"`, not `Naina says: "So a monthly check, then?"`.
- Never let a later prompt treat a proposal as made, agreed or refused. If the player may not have raised it, the
  other person raises it.
- When an option's reply ends the talk (the player changes the subject, says it's fine, walks off), rewrite that
  option's `then` so the other person brings it back: `He pauses. "I still want to sort this out."`
- Read each next prompt once after every `then` of the step before, one by one, before you move on.

## Other notes and gate rejects

Fix every comma splice, graded `then`, point-of-view slip, unsupported detail, silly or duplicate option and repeated
hook or setup noted. While you are in a scenario, fix any other problem of those kinds you see.

## Edit safely

Edit the batch with a short Python script that loads every line, changes the named fields and writes all lines back,
keeping order and ids. Never retype the whole file by hand.

## Finish

1. `python3 scripts/forge/forge_check.py --batch .forge/<game>/steps/batch-NN.ndjson --game <game>` prints
   `batch: 0 rejected`.
2. `python3 scripts/forge/steps_batch.py .forge/<game>/steps/source-NN.ndjson .forge/<game>/steps/batch-NN.ndjson` prints `✓`.
3. Make the folder `.forge/<game>/steps/recheck-NN` and write to `changed.txt` in it the id of every scenario where you
   changed a prompt, an option's text, which option is best, or a `then`, one per line (not scenarios where you only
   fixed punctuation, a comma splice or a `why`). Create it empty if there are none.
4. If `changed.txt` is not empty, write the re-check files, with `<ids>` the comma-separated ids from `changed.txt`:
   `python3 scripts/forge/blind_review.py make <game> .forge/<game>/steps/recheck-NN .forge/<game>/steps/batch-NN.ndjson --batch-only --ids <ids>`
   `python3 scripts/forge/steps_audit.py make <game> .forge/<game>/steps/recheck-NN .forge/<game>/steps/batch-NN.ndjson --ids <ids>`
5. Reply with the counts asked for. Do not paste scenarios into the reply.
