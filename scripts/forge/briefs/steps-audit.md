# Auditor brief: transition-by-transition continuity and quality for one batch

Used by the multi-step rollout ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4)).
Your prompt names the game (`<game>`, its file stem), its audience, and the audit folder `<dir>`. Background on the game:
`.forge/<game>/GROUNDING.md`. How the scenarios play and the rules they follow: `scripts/forge/briefs/steps-write.md`.

A writer turned single-step branch and role-play scenarios into multi-step ones. In the game, the player picks an
option, reads its `then` (what happens, or what the other person says back), and only then sees the next prompt. So
every prompt after the first must make sense after **every** option of the step before. Whole-scenario reviews missed
many breaks, so you check each pair on its own.

Read only `<dir>/audit.ndjson` and the two briefs named above. Do not open batch files, do not run git, and do not edit
any file except `<dir>/review-audit.ndjson`.

## Each row

`id`, `type`, `hook`, a role-play's `setup`, the `steps` (each prompt, its options with `then`, the best option marked
`"best": true`, and `why`), `debrief` or `relearn`, and `transitions`: numbered pairs, each with `into_step`, the
`picked` option text of the step before, its `then`, and the `next` prompt.

## Verdict for every transition

Imagine the player picked `picked`, read `then`, and now reads `next`. Answer:

- `"ok"` when `next` follows naturally.
- `"break: <why>"` when a careful player would notice it doesn't fit: `next` contradicts the `then` (the `then` says
  they left, and `next` has them still talking); it refers to something that never happened on this path (a meeting
  the player refused, a promise the player didn't make, words the player didn't say); or, in a role-play, the other
  person answers a line the player never said. Name the clash in a few words.

Real examples of breaks from earlier batches:
- The `then` says the aunt drops the subject after the player refuses to meet the family; the next prompt opens "At the
  meeting, his family talks proudly...".
- The `then` says the player has already quietly decided alone; the next prompt has the couple sit down to decide
  together.
- The player asked their partner to keep sending reminders; the next prompt says she has stopped checking on them.
- In a role-play, the player changed the subject; the other person's next line argues with a suggestion the player
  never made.

## Notes for the scenario

After the verdicts, add a note for anything else wrong, as `"<field>: <problem>"`, for example
`"step 2 option 3 text: comma splice"`. Look for:

- a best option that is not clearly best: another option is at least as good, or the best fits only some earlier paths
  (it claims a change the player may not have made);
- a `then` that doesn't follow from its own option, or grades the pick ("Good choice");
- the player named or called "she" or "he" in the hook while the prompts say "you";
- details the situation doesn't support (children, a wedding or a job the story never had);
- a `hook`, `setup` and first prompt that repeat each other; two options in a step that say the same thing; a silly or
  cartoon-villain option;
- a comma splice, including inside quoted lines;
- anything against the safety rules in steps-write.md or GROUNDING.md: control or abuse framed as a shared problem,
  blame on the person being harmed, pushing a survivor to leave, a risky confrontation as the best move, "good touch"
  and "bad touch", or a helpline changed or added;
- **where the player is the one being pressured or harmed**: any option that is a survival response (freezing, staying
  silent, going along, giving in, pretending to be asleep, avoiding them) and so gets marked short of best; any `then`
  in which sex or harm happens because of the player's pick; no "never your fault" in a `why` or the `debrief`; or no
  step whose best move reaches support. Start these notes with `safety:` so the fixer handles them first.

Leave `notes` empty when there is nothing to add. Do not note matters of taste.

## Writing the file

One line per row in `<dir>/review-audit.ndjson`, in the same order as `audit.ndjson`:

```
{"id": "cb-015", "transitions": ["break: partner answers an idea the player never raised", "ok", "ok", "ok", "ok", "ok", "ok", "ok"], "notes": ["step 1 option 4 then: comma splice"]}
```

`transitions` has exactly one verdict per numbered transition, in order. Append at most 5 rows per tool call with a
short Python script (`json.dumps(row, ensure_ascii=False)`). When every row is written, run
`python3 scripts/forge/steps_audit.py check <game> <dir> <the batch path your prompt gives>` and fix any coverage
problem it prints (a missing row or a wrong number of verdicts). Do not change a verdict after seeing that output.

## Reply

Reply with the counts asked for. Do not paste the file into the reply.
