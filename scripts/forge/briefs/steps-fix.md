# Fixer brief: resolve the review of one multi-step batch

Used by the multi-step rollout ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4)).
Your prompt names the game (`<game>`, its file stem), its audience, the batch `.forge/<game>/steps/batch-NN.ndjson`
and its review folder `<dir>`. Read `scripts/forge/briefs/steps-write.md` first: every rule there still holds after
your edits. Background on the game: `.forge/<game>/GROUNDING.md`.

## Start

1. Keep a copy of the batch before you touch it, unless the copy already exists:
   `cp -n .forge/<game>/steps/batch-NN.ndjson .forge/<game>/steps/batch-NN.before-fixes.ndjson`
2. List the blind disagreements:
   `python3 scripts/forge/blind_review.py diff <game> <dir> .forge/<game>/steps/batch-NN.ndjson --batch-only`
   Each line gives the id, then `(step, key, reviewer)` for every step where the reviewer picked a different option
   (step numbers there are 0-based), and the reviewer's note.
3. Read `<dir>/review-continuity.ndjson` (breaks use 1-based step numbers) and the voice notes in it.

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

## Continuity breaks

Rewrite the next prompt so it follows from every option's `then` in the step before, usually by moving time forward or
bringing in the other person's next point. If one `then` closes the situation (you left, refused, blocked), you may
instead rewrite that `then` so the story can continue. Re-read the whole scenario afterwards: a fix can break a later
step.

## Voice notes

Fix every comma splice, graded `then`, silly or duplicate option, repeated hook or setup, and safety problem the
reviewer noted. While you are in a scenario, fix any other splice you see.

## Edit safely

Edit the batch with a short Python script that loads every line, changes the named fields and writes all lines back,
keeping order and ids. Never retype the whole file by hand.

## Finish

1. `python3 scripts/forge/forge_check.py --batch .forge/<game>/steps/batch-NN.ndjson --game <game>` prints
   `batch: 0 rejected`.
2. `python3 scripts/forge/steps_batch.py .forge/<game>/steps/source-NN.ndjson .forge/<game>/steps/batch-NN.ndjson` prints `✓`.
3. Write the ids of every scenario where you changed any option text, which option is best, or a prompt, one per line,
   to `<dir>/changed.txt` (create it empty if there are none).
4. If `changed.txt` is not empty, write the re-check files:
   `python3 scripts/forge/blind_review.py make <game> <dir>/recheck .forge/<game>/steps/batch-NN.ndjson --batch-only --ids <comma-separated ids from changed.txt>`
5. Reply with the counts asked for. Do not paste scenarios into the reply.
