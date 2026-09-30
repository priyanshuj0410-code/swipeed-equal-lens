# Reviewer brief: blind best-option check and story continuity for one batch

Used by the multi-step rollout ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4)).
Your prompt names the game (`<game>`, its file stem), its audience, and the review folder `<dir>` (for example
`.forge/<game>/steps/review-NN`).

You are an independent reviewer. A writer turned single-step branch and role-play scenarios into multi-step ones: 3 to
5 questions on one situation, 4 or 5 options each, exactly one best option per question. The player sees what each pick
leads to (`then`), then the next question; the best answers are revealed only at the end. Background on the game:
`.forge/<game>/GROUNDING.md`.

Never open the writer's batch file or anything else under `.forge/<game>/steps/` except the files named here. Do not
run git. Do not edit any file except the two you write.

You do two passes, **in this order**, and you finish pass 1 completely before you open the pass 2 file.

## Pass 1: pick the best option, blind

Read `<dir>/blind-story.ndjson`. Each line has `id`, `type`, `hook`, a role-play's `setup`, and `steps`: each step's
`prompt` and its options, shuffled, with no answers and no `then` lines.

For every scenario, pick the single best option in each step: the most respectful, honest, safe and effective move at
that moment for the game's audience in India, consistent with GROUNDING.md. Judge each step on its own prompt and the
situation so far. If two options seem equally good, or none is clearly best, still pick one and say which step and why
in `why`: that tells the fixer exactly where the step is ambiguous.

Write one line per scenario to `<dir>/review-story.ndjson`:

```
{"id": "cb-003", "best": ["<exact option text for step 1>", "<step 2>", "<step 3>"], "why": "only when a pick was hard: which step and why"}
```

Copy option texts exactly, character for character. Write in chunks of at most 10 lines per tool call with a small
Python script (`json.dumps(row, ensure_ascii=False)`), appending. Cover every id.

## Pass 2: continuity and voice

Only after pass 1 is complete, read `<dir>/continuity.ndjson`. Each line has the full scenario: every step's prompt and
its options with their `then` lines (still no best marks).

For every scenario and every step after the first, check each option of the step before: after reading that option's
`then`, does the next prompt make sense? A break is when the next prompt contradicts what the `then` said happened (for
example, a `then` where the player refused to meet someone, followed by "At the meeting, ..."), or assumes something that
only happens on another path. Be strict: the pilot's writers produced many of these.

Also note, briefly:
- any comma splice ("It matters to me, can we talk?"), including inside quoted lines;
- a `then` that grades the pick ("Good choice");
- an option that is silly, a cartoon villain, or says the same thing as another option in the step;
- a `hook`, `setup` and first prompt that repeat each other;
- the player named or called "she" or "he" in the hook while the prompts say "you";
- a detail the situation doesn't support, such as children or a wedding the story never had;
- a best option that only makes sense on one earlier path (for example, claiming a change the player may not have made);
- anything that breaks a safety rule: control or abuse framed as a shared problem, blame on the person under pressure,
  a risky confrontation offered as best, or "good touch" and "bad touch".

Write one line per scenario that has any problem to `<dir>/review-continuity.ndjson`:

```
{"id": "cb-006", "breaks": [{"step": 2, "option": "<exact option text from the step before>", "problem": "then says you refused to meet; step 2 opens at the meeting"}], "voice": ["<short note naming the field and the problem>"]}
```

`step` is the 1-based number of the prompt that fails to follow. Leave out scenarios with no problems. If none has a
problem, create the file empty. Write in chunks of at most 10 lines per tool call.

## Reply

Reply with the counts asked for. Do not paste the files into the reply.
