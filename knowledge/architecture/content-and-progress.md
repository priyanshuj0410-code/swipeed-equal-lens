---
type: decision
owner: the-equal-lens
title: "Content stays in git, progress stays on the device"
description: Why SwipeEd keeps its question bank as typed code in the public repo under the build-time gates and keeps all player progress on the device, and does not adopt the Firebase data layer that Nivel's app-data-layers playbook proposes. What SwipeEd borrows from that work instead.
tags: [swipeed, architecture, decision, data, privacy, dpdp, gates]
timestamp: 2026-10-04T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/bebd5a55-4403-44f5-866f-2a30d6e79f17  # SWED-133
  - https://app.plane.so/claude-pri/projects/00987666-dbc9-4caa-8c8d-004db87e6c11/issues/db4c43c6-0bdb-4dec-a387-338867b35576  # PARITY-84, playbook corrections filed for Nivel
---

# Content stays in git, progress stays on the device

**Decision (2026-10-04).** SwipeEd keeps every game's content as typed TypeScript in this repo, checked by the build-time gates, and keeps all player progress on the player's device. It does not adopt a Firestore or other runtime data layer, for content or for progress. Any future feature that syncs progress needs a DPDP review, a parental-consent design and the owner's sign-off first.

**Context.** Nivel (the parity tracker, a separate project) moved its data out of the app under PARITY-79 and wrote an app-data-layers playbook that names SwipeEd as following the same design. A review on 2026-10-04 read the commit, the playbook and the live site, and checked the playbook against SwipeEd's code. Its verdict on Nivel's own implementation was "approve with fixes, no blockers"; those fixes and the playbook corrections are filed in Nivel's Plane project as PARITY-84. Its verdict for SwipeEd was not to adopt the data layer.

## Why not

| Reason | What would happen | Evidence in this repo |
|---|---|---|
| Progress is sensitive data about a child | "Live state" on a server under a persistent id is a record of which body-safety, abuse, HIV and contraception games a child finished, with their age band. That breaks the promise that this data stays on the device and raises duties under section 9 of the DPDP Act (children's data) that counsel has not cleared. Ids would be pseudonymous, not anonymous. | `src/lib/types.ts`, `src/lib/store.tsx` (the profile lives in localStorage); [life skills toolkit](../games/life-skills-toolkit.md) |
| The gates need the content in git | With the games folder emptied, `content_gate.py` printed "0 lesson games ... pass" and exited 0, and `no_dashes.py` checks only tracked files. Since SWED-133 the content gate fails below the catalog minimum. | `scripts/content_gate.py`, `scripts/no_dashes.py` |
| A data release check is much weaker than SwipeEd's gates | The playbook's four release checks do not cover the helpline allowlist, band word limits, lints or dedup, and it calls the preview the child-safety review. | [v2 engine](v2-engine.md), `scripts/forge/` |
| Content is code here | A game ships together with its engine, schema and KB doc in one reviewed branch; the owner's merge is the promote step. | AGENTS.md; commit b228185 (Chapter 6) |
| Free quotas do not fit the bank | 33,542 scenarios, and `choosing-building.ts` alone is about 700 KB. A quota hit would block every build, including a safety fix. | `src/content/games/` |
| A public repo has nothing to hide | Taking content out of the repo would lose a public, diffable record of exactly what children see. | [README](../README.md) |
| It would be a detour | The engine extraction plan (Owhile) is the planned next step for shared infrastructure. | [v2 engine](v2-engine.md), "engine extraction" |

## What SwipeEd borrows instead (no database needed)

- **A release diff with an approval flag.** `release.py` prints a per-scenario diff, and any change to a safety beat, a helpline or the help sheet needs an explicit approval flag. Not built yet.
- **A versioned, cache-first service worker.** Hashed assets, a cache name derived from the build, old caches pruned. Today `public/sw.js` is a kill switch that clears caches and unregisters itself, so SwipeEd is installable but not offline. Not built yet.
- **Designed loading and failure states.** A 300 ms delay before a skeleton, skeletons shaped like the content, no shimmer under reduced motion, `role="status"`, and never a false empty state. Adopt through [design.md](../design.md) when a loading state is next touched.
- **A static, versioned API**, built from SwipeEd's own output, only if another app ever needs SwipeEd content. Borrowed data is snapshotted at build time and pinned to a release id; nothing is fetched from a child's device.

## Not adopted

Firestore or any runtime store for content; removing content from git; server-side progress, mood, toolkit or reflections; a deploy-hook or runtime pointer promote; Nivel's Firestore rules or its data toolkit as it is.
