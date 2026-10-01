---
type: index
owner: the-equal-lens
title: SwipeEd knowledge base
description: Start here for what SwipeEd is, where every doc lives, and the rules for keeping this knowledge base in step with the code.
tags: [swipeed, index, knowledge-base]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2e3bdb51-00e7-45ff-8181-a301db687b5b  # SWED-65
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/368de34e-fae5-48bc-b229-6844dee0ca7e  # SWED-66
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/533b7f5e-e740-46cf-bb6d-bd250addcbf5  # SWED-89
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/1e640d0d-e504-4326-a2a8-a60d4a1886e2  # SWED-106
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/66768e21-f648-4c92-bbda-d30a084d9569  # SWED-107
---

# SwipeEd knowledge base

SwipeEd is The Equal Lens's learning path app for ages 3 to parenthood: 77 nodes (69 lesson games and 8 capstones) across 8 age-band chapters, live at https://swipeed.vercel.app. This folder is its single source of truth. It follows the Open Knowledge Format: plain Markdown files with YAML frontmatter, reviewed as git diffs next to the code they describe.

## Start here

1. **[SwipeEd: what we built and why](games/swipeed-build-overview.md)**: the product, the engine, the content pipeline and how the fleet was grown.
2. **[SwipeEd, the app](games/swipeed.md)**: the path, the chapters, the audience.
3. **[v2 engine](architecture/v2-engine.md)**: how a game runs, from path node to completion card.
4. **[Question bank](schemas/question-bank.md)**: the scenario format, where content comes from, and the gates it must pass.
5. **[Design system](design.md)**: tokens, type, components, motion and accessibility.

## Structure

```
knowledge/
  README.md          this index
  design.md          design system
  plane.config.md    Plane workspace, project and state ids; ticket rules
  architecture/      v2-engine.md (how games run), deployment.md (stack, build, hosting)
  schemas/           question-bank.md (bank format, sources, gates, fleet numbers)
  games/             the catalog: one doc per game and capstone, plus the SwipeEd overview docs
  audits/            dated audits: design, question bank, forge pipeline
  playbooks/         approved plans and how-tos (playtest-feedback-plan-2026-09-15.md, writing-without-dashes.md, multi-step-rollout.md)
  research/          dated research: tools, evidence and options before a decision (visual answer options)
  log/               log.md, the dated project log, newest first
```

## Docs by topic

| Topic | Docs |
|---|---|
| The app and its world | [SwipeEd](games/swipeed.md) · [path world](games/swipeed-world.md) · [world and art tokens](games/world-art-tokens.md) · [capstones](games/capstones.md) · [life-skills toolkit](games/life-skills-toolkit.md) |
| Learning design | [core principle: Unlearn, Relearn, Grow](games/swipeed-core-principle.md) · [reusable game patterns](games/swipeed-game-patterns.md) · [interaction model](games/swipeed-interaction-model.md) |
| Engine and code | [v2 engine](architecture/v2-engine.md) · [stack, build and deployment](architecture/deployment.md) · [extending SwipeEd](games/extending-swipeed.md) |
| Content | [question bank](schemas/question-bank.md) · [content pipeline (forge)](games/swipeed-content-pipeline.md) · [game doc template](games/_game-template.md) |
| Games | [games catalog](games/index.md): every game and capstone by chapter |
| Design | [design system](design.md) · [design audit, 2026-09-14](audits/design-audit-2026-09-14.md) |
| Audits | [design, 2026-09-14](audits/design-audit-2026-09-14.md) · [question bank, 2026-09-14](audits/question-bank-audit-2026-09-14.md) · [forge pipeline, 2026-09-14](audits/forge-pipeline-review-2026-09-14.md) |
| Plans | [playtest feedback plan, 2026-09-15](playbooks/playtest-feedback-plan-2026-09-15.md): question focus, match and sort, reflect, myth cards · [multi-step rollout](playbooks/multi-step-rollout.md): turning every branch and role-play into a multi-step story, chapter by chapter |
| On GitHub | The repo is public. Its [README](../README.md) summarises the app for visitors; `docs/` holds dated design records from June 2026, each marked historical and pointing back here. Personal and internal documents stay out of the repo and its history ([SWED-107](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/66768e21-f648-4c92-bbda-d30a084d9569)): `.gitignore` and the `scripts/private_files.py` gate keep them out |
| Voice | [writing without dashes](playbooks/writing-without-dashes.md): the moves that replace em and en dashes, the comma splice trap, the gate ([SWED-92](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22)) |
| Research | [visual answer options, 2026-09-15](research/visual-answer-options-2026-09-15.md): pictures for pre-readers, reading evidence, Runway, Recraft and other tools ([SWED-89](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/533b7f5e-e740-46cf-bb6d-bd250addcbf5)) |
| Tracking and history | [Plane configuration](plane.config.md) · [project log](log/log.md) |

## Keeping it in sync

- **Docs ship with code.** Any change that affects a game, the path, the engine or the question bank updates the matching doc here on the same branch: the game doc under `games/`, an entry at the top of [the log](log/log.md), and any cross-links (see [AGENTS.md](../AGENTS.md)).
- **New UI patterns update [design.md](design.md)** in the same change.
- **Frontmatter on every doc:** `type`, `title` and `description`, plus `owner`, `tags`, `timestamp`, and `plane_issues` listing the Plane issue URLs that changed it. New game docs start from [the template](games/_game-template.md).
- **Layout:** docs live in subfolders; only `README.md`, `design.md` and `plane.config.md` sit at the root. Link between docs with relative paths.
- **Voice:** hyphens, never em or en dashes, and sentence case, as in the rest of The Equal Lens.

## Where this came from

Until 2026-09-14 SwipeEd's docs lived in the owhile-engine repo (the Owhile venture, formerly Praxis), which a chat working in The Equal Lens's repos is not allowed to edit, so docs could not ship with code. The game docs, the SwipeEd overview docs and SwipeEd's log entries were copied here from owhile-engine commit `c182048` under SWED-61, and each copied doc names its source in `copied_from:`.

The copy was not verbatim: em and en dashes became hyphens, links were re-pointed (links to Owhile-only docs now open owhile-engine on GitHub), invalid frontmatter was repaired, and facts that had gone stale were corrected against the code. The [log entry for 2026-09-14](log/log.md) lists the corrections.

Owhile's own architecture, forge and business docs were deliberately not copied. The ownership split recorded in owhile-engine `knowledge/partners/the-equal-lens/index.md` gives The Equal Lens the curriculum, content and brand, and Owhile the engine mechanism. The v2 engine, deployment, question bank and design docs here were written fresh from SwipeEd's own code. owhile-engine still holds its older copies of the SwipeEd docs; they are no longer maintained from this side.

## Open questions

- **Clinical content.** The Equal Lens canon says the organisation does no clinical content (no contraception, no STIs, no mental-health treatment) and refers instead, because it cannot staff it. SwipeEd includes sexual and reproductive health games: [Plan It](games/plan-it.md) and [Outbreak](games/outbreak.md) (ages 12-15), [Status: Know It](games/status-know-it.md) (15-18), [Own Your Health](games/own-your-health.md) (18-22) and [If, When & Whether](games/if-when-whether.md) (22+). Whether that rule applies to a self-paced app has not been decided. The [question bank audit](audits/question-bank-audit-2026-09-14.md) counts about 1,400 such scenarios, from HIV facts at ages 9-12 to contraception at 15-18.
- **Anatomical words.** The Chapter 1-3 body-safety games say only "private parts"; child-safety guidance recommends the correct words. A curriculum decision (audit finding A5).
- **owhile-engine's copy.** owhile-engine's docs still describe themselves as SwipeEd's canonical knowledge base. [PRX-29](https://app.plane.so/claude-pri/projects/76bc2c6d-d7e2-4b88-8ce4-b9fa7e59f5b2/issues/6b3fe8df-f7df-44d2-a805-8e25aa4f67f2) asks an Owhile chat to point them here.
- **Stale repo docs.** The repo's own `README.md` and several files in `docs/` predate the 77-node path (they describe 43 lessons and the old mascot name). This knowledge base supersedes them until they are updated or removed.
