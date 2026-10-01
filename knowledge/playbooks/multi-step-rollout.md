---
type: playbook
title: Multi-step rollout
description: How branch and role-play scenarios are converted to multi-step stories chapter by chapter, the owner's standing decisions, the per-wave procedure, and how an unattended session resumes the rollout after a usage limit resets.
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9  # SWED-96
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4  # SWED-100
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a211b3dc-b375-4701-ab93-7c8f4d948d6b  # SWED-108
---

# Multi-step rollout

Every `branch` and `role-play` becomes a 3 to 5 step story with 4 or 5 options per step and the best moves revealed at
the end ([SWED-96](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9),
piloted on Choosing & Building). This playbook runs the conversion for every other game, one chapter per wave. Any
session, including an unattended one started by the resume task, follows it as written. The tooling and the reviewer
roles are described in the [question bank](../schemas/question-bank.md) ("Multi-step rollout").

## Owner decisions (2026-09-29)

| Question | Decision |
|---|---|
| Games with abuse, coercion or child-safety content (Respect at Home first) | Ship once the independent safety review and the shipping session's own read of every safety change find nothing open. The owner then gets a review page of that game's safety scenarios to read after it is live; anything they flag is fixed the same day. |
| What happens after Chapter 7 | Keep going: Chapter 8, then 6, 5, 4 and 3, each shipping as soon as it is certified, under the usage guard's 80% limits. |
| Ages 3 to 9 (Chapters 1 and 2) | Same rules as older players (3 or more questions, 4 or more options, short words). Convert one Chapter 1 game first (Feelings Friends) and show the owner before doing the rest. The rollout stops there until the owner signs off. |
| After the usage guard pauses the rollout | Resume automatically after the limit resets, through the scheduled tasks below. |

Earlier standing decisions still apply: pushing `main` after the gates and build pass is approved ("push and move on
the next phases"); commits carry the `priyanshuj0410-code` identity; no em or en dashes anywhere.

## Wave order and state

Queue: Chapter 7, 8, 6, 5, 4, 3, then the Chapter 1 pilot game. The rollout's state lives in
`.forge/rollout/state.json` (gitignored), read with `python3 scripts/forge/steps_wave.py state` and written with
`python3 scripts/forge/steps_wave.py mark <running|paused|shipping|waiting-for-owner|done> --chapter N --note "..."`.
A batch's progress is never kept in a session's memory: `steps_wave.py status N` works it out from the files under
`.forge/<game>/steps/`.

## Running a wave

1. **Guard first.** Run `python3 ~/.claude/usage-guard/usage_guard.py status`. If the guard is tripped, or either
   window is at 65% or more, do not launch: pause (below).
2. **Ticket and branch.** The first time a chapter starts, create a Plane issue ("Multi-step branch and role-play:
   Chapter N rollout", In Progress, linking this playbook), write `SWED-<n>|<uuid>` to `.plane_current_issue`, and
   branch `content/multi-step-chN` from the current `main`. Chapter 7 is SWED-100 on `content/multi-step-ch7`. When
   resuming, refresh `.plane_current_issue` (the edit guard refuses a marker older than 4 hours) and check out the
   chapter's branch.
3. **Plan.** `python3 scripts/forge/steps_wave.py split N` (once), then `python3 scripts/forge/steps_wave.py plan N`.
   It prints each batch's next stage and writes the workflow's args to `.forge/rollout/wave-args.json`.
4. **Launch.** `python3 scripts/forge/steps_wave.py mark running --chapter N --note "<workflow run id>"`, then run the
   Workflow tool with `scriptPath` `/Users/priyanshu/swipeed-equal-lens/.claude/workflows/multi-step-wave.js` and the
   contents of `wave-args.json` as its `args` (a JSON object, not a string; the name `multi-step-wave` is not always
   registered). Every batch resumes from its files, so relaunching after any stop is always safe. Do not use
   `resumeFromRunId`: agents the guard stopped are cached as finished.
5. **When the workflow ends,** run `steps_wave.py plan N` again. If any batch is still at write, review or fix,
   relaunch (step 1 first). When every batch is `certified` or `read`, ship.

## Shipping a wave

`steps_wave.py mark shipping --chapter N`, then:

1. **Read what no reviewer saw.** For every batch at `read`, read each scenario listed in
   `final-NN/r4/changed.txt` in full, as a player would, against `steps-write.md` (and `steps-minors.md` for Chapters 3
   to 5). Fix by hand with a short Python edit; re-run `forge_check.py --batch`.
2. **Read every safety change.** For each game in `SAFETY_HEAVY` (`scripts/forge/steps_wave.py`), read every scenario
   that had a safety or fidelity finding in any round (the `fix-log.ndjson` files) and every scenario whose source
   names a helpline. Check the survivor rules and helplines yourself. Anything still wrong is fixed before shipping.
3. **Certified but with blocking findings left.** A batch whose last fixer kept findings (`fix-log.ndjson`,
   decision `kept`) is read for those findings; agree or fix.
4. **Assemble.** For every batch: `python3 scripts/forge/forge_assemble.py --game <g> --batch <batch> --apply`.
5. **Gates.** `forge_check.py --game <g>` for every game, `forge_dedup.py --verify`, `content_gate.py`,
   `test_gates.py`, `no_dashes.py`, then `npm run build`. All must pass.
6. **Docs.** In each game's doc under `knowledge/games/`: a short "Multi-step stories" note (how many converted, the
   step split, review rounds and what they found) and the chapter's ticket in `plane_issues`. A `knowledge/log/log.md`
   entry (newest first) and the counts in the question bank.
7. **Merge, push and release.** Run `python3 scripts/release.py --bump` on the chapter branch and commit
   `[SWED-n] ...`; check `git worktree list` for where `main` lives and merge `--no-ff` there (rebase first if `main`
   moved; `plane_issues` lists and the log's top entries conflict almost every time: keep both, newest first);
   `npm run build`; `git push origin main`; wait for the Vercel status to succeed; then
   `python3 scripts/release.py --publish` on `main` tags the release and creates its GitHub release
   ([releases](../architecture/deployment.md#releases)).
8. **Close.** Plane issue to Done with a one-line comment. For safety-heavy games, build the owner's review page with
   `python3 scripts/forge/story_review_page.py <game>` and publish it as an artifact with the `db` and `user`
   capabilities (verdicts land in its `reviews` collection), then send the link. Read the flags with the artifact's
   database tools and fix any the same day. Then
   `steps_wave.py mark paused --chapter <next>` and start the next chapter at step 1 of "Running a wave".

After Chapter 3 ships, convert Feelings Friends alone as the Chapter 1 pilot (same process), ship nothing, publish a
review page of its stories, `mark waiting-for-owner`, notify the owner, and stop.

## Pausing and auto-resume

When a "Usage guard:" message appears or the guard is tripped:

1. Stop running workflows and background agents with TaskStop.
2. `python3 scripts/forge/steps_wave.py mark paused --note "guard: <weekly or session> until <reset time>"`.
3. Re-arm the scheduled task `swipeed-rollout-resume` with `update_scheduled_task` and a `fireAt` 10 minutes after the
   reset time the guard reports (ISO 8601 with the +05:30 offset).
4. Tell the owner (a push notification when unattended) what finished, what is left and when it resumes.

Two local scheduled tasks resume the work (they run while the Claude app is open, or on its next launch):

| Task | When | Does |
|---|---|---|
| `swipeed-rollout-resume` | once, re-armed at each pause | Resumes the rollout from this playbook |
| `swipeed-rollout-watchdog` | daily at 10:30 | The same, as a backstop for a pause that was never re-armed or a session that died |

Both skip when the state is `waiting-for-owner` or `done`; when it is `running` or `shipping` and
`steps_wave.py alive` shows a rollout file changed within the last 60 minutes (another session owns the work); or when
the guard is tripped or a window is at 65% or more.
