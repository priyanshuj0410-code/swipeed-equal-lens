# SwipeEd

**A learning path for relationships, sexuality and life skills (RSE), from age 3 to parenthood, built by
The Equal Lens.** Live at **https://swipeed.vercel.app**.

Every lesson is a short game, and every game follows one idea: **Unlearn, Relearn, Grow.** A player meets a
belief they were handed, sees why it falls short, and practises a fairer, kinder one in its place.

## What it is

SwipeEd is one winding 3D path of **77 nodes: 69 lesson games and 8 capstones**, across **8 age-band
chapters**. A player picks their age band when they start, enters at their own chapter and moves forward
along the path; earlier chapters stay open for revision. Each node is a self-contained game hosted by
**Lensy**, a curious alien who asks why rather than lecturing, with **UN** (the eraser, for unlearning) and
**RE** (the pencil, for relearning).

| Chapter | Ages | Lesson games | Capstone |
|---|---|---|---|
| 1 | 3 to 6 | Feelings Friends · My Body, My Rules · Clean Crew · My Family Garden · Same Same, Different · Can-Do Kids | My First Friends |
| 2 | 6 to 9 | Body Lab Juniors · What Makes Me, Me · Safety Squad · Friend or Frenemy? · Heart Smart · Fair Play World · Not Fair, Not Funny · Smart Screen Heroes | Fair & Safe Explorer |
| 3 | 9 to 12 | Puberty Quest · Mind Matters · The Amazing Journey · Boundary Bot · Crossroads · Flip the Script · Norm Storm · Speak Up · Defenders of the Body | Growing Up Smart |
| 4 | 12 to 15 | Body Confident · Bounce · Plan It · Outbreak: Stop the Spread · Green Light / Red Light · MythBuster: Gender · Equalize · Stand Up · Firewall · The Rabbit Hole · Reality Check | Reading Relationships |
| 5 | 15 to 18 | My Choices, My Future · Status: Know It · Mutual · Spectrum · Lead the Way · Change Makers · Justice League: Rights Edition · Life Ready · Decoded | Ready for the World |
| 6 | 18 to 22 | Consent, For Real · Swipe Right? Dating & Apps · Real Relationships · Own Your Health · Money & Independence · Mind & Belonging · Find Your Feet · Equal & Confident · Know Your Rights (Adult) | Standing on My Own |
| 7 | 22 to a first child | Choosing & Building · Your Path, Your Call · Equal Partners · Respect at Home · The Family Map · Money, Together · If, When & Whether · Many Ways to Family | Building Together |
| 8 | Parenthood | Us, After Kids · Equal Parents · Looking After You · The Talks (Age by Age) · Break the Cycle · Raising Gender-Diverse Kids · Raising Neurodiverse Kids · Navigating Addictions · Be the Safe Adult | Raising the Next Generation |

Beside the path, a **Life-Skills Toolkit** holds calming and check-in tools, and **Get Help** is always one
tap away.

## How a game works

- **One engine, many games.** Every lesson renders through `V2Game` (`src/components/games/v2-engine.tsx`)
  and every capstone through `RichCapstone` (`src/components/games/capstone-rich.tsx`). A game is a typed
  scenario library in `src/content/games/<id>.ts`; each game's own component is a few lines.
- **The interaction is the lesson.** Scenarios play through 11 mechanics (`reflect`, `choose`, `role-play`,
  `branch`, `strike-rewrite`, `sort`, `match`, `build`, `explore-label`, `spot` and `swipe`, defined in
  `src/content/games/v2-schema.ts`): drag a chip to sort it, scrub a myth to erase it, swipe a flag to read
  it.
- **Stories with several turns.** Branches and role-plays are being rebuilt as stories of 3 to 5 questions on
  one situation, each with 4 or 5 options and the best moves shown at the end. Chapters 7 and 8 are done;
  Chapters 6, 5, 4 and 3 follow.
- **Content is data.** The question bank holds 33,542 scenarios across the 69 games, and every one passes the
  content gate before a build.
- **The path world.** The path is a React Three Fiber scene (`src/app/path/`) with chapter seasons, weather
  and day and night, generated from the master node table into `src/content/path.ts`. Games open in place
  over the path or at `/game/<id>`, and `/classic` is a 2D fallback for devices without WebGL.

## Design rules

These are requirements, not polish.

- **No fail state.** Gentle nudges and retries; nothing rewards speed or guessing.
- **Unlearn, Relearn, Grow** at every real misconception.
- **Safeguarding first.** Safety moments are never scored. A story never asks players about their own lives,
  and when someone is harmed the right move reaches a trusted adult or real help. The help sheet lists
  Childline 1098, Tele-MANAS 14416, the cybercrime helpline 1930 and the POCSO e-Box.
- **Private by default.** No accounts and no leaderboards; the profile stays in the browser on the device.
- **Accessible and adjustable.** Colour is never the only signal, every action has a button, and early
  readers can listen. Settings offer text size, sound, a calm mode and School-Comfort Mode (which today
  filters the Quick Play MythBuster deck).
- **One voice.** Warm and plain, with no em or en dashes anywhere; a gate enforces it.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 with The Equal Lens brand tokens ·
three and React Three Fiber · an installable web app (its service worker currently only clears old caches,
so there is no offline mode) · Python 3 scripts for content tooling and gates. Details:
[stack, build and deployment](knowledge/architecture/deployment.md).

## Develop

The Equal Lens brand package (`@equal-lens/brand`) installs from GitHub Packages, which needs a GitHub token with
`read:packages` even for reading: run `gh auth refresh -s read:packages` once, then `export NPM_TOKEN=$(gh auth token)`.

```bash
npm install          # also turns on the git hooks
npm run dev          # http://localhost:3000
npm run build        # runs the gates first, then next build
```

| Command | What it does |
|---|---|
| `npm run gates` | The dash check, the private-documents check, the whole-bank content gate, the gate fixtures and the engine unit tests (needs Python 3) |
| `npm run lint` | ESLint |
| `npm run status` | Build status of every node, from `scripts/master-node-table.xlsx` |
| `python3 scripts/gen-path.py` | Regenerates `src/content/path.ts` from the master node table |

This is Next.js 16, which differs from older versions: read the guide in `node_modules/next/dist/docs/` before
changing framework code.

## Deploy

A push or merge to `main` deploys to production on Vercel. The build runs the same gates, so a content
problem or a type error fails the deploy. Run `npm run build` locally before pushing.

Milestones are tagged as [releases](https://github.com/priyanshuj0410-code/swipeed-equal-lens/releases) with calendar
versions (`v2026.10.0`, then `v2026.10.1`), each with notes drawn from the project log; `scripts/release.py` bumps
the version and publishes the release. See [releases](knowledge/architecture/deployment.md#releases).

## Content pipeline

Scenarios are grown and reshaped by the **forge** (`scripts/forge/`): writers and independent reviewers work
from briefs in `scripts/forge/briefs/`, and every batch is checked by the same gates as the build. See the
[content pipeline](knowledge/games/swipeed-content-pipeline.md) and the
[question bank](knowledge/schemas/question-bank.md).

## Docs

The knowledge base in **[`knowledge/`](knowledge/README.md)** is the single source of truth; start at its
[index](knowledge/README.md). Good first reads:

- [SwipeEd: what we built and why](knowledge/games/swipeed-build-overview.md)
- [The v2 engine](knowledge/architecture/v2-engine.md)
- [The question bank](knowledge/schemas/question-bank.md)
- [The design system](knowledge/design.md)
- [The games catalog](knowledge/games/index.md), with a doc for every game and capstone
- [The project log](knowledge/log/log.md), newest first

`docs/` keeps earlier design records and `design/` the source documents (game design documents, the master
node table, brand guidelines); where they differ, the knowledge base is current.

## Working on SwipeEd

[`AGENTS.md`](AGENTS.md) holds the working conventions: a branch per change, merged with `--no-ff`; every
change ships with its knowledge base update; work is tracked in Plane (project `SWED`) and commit messages
start with `[SWED-N]`.

## Licence

Copyright 2026 The Equal Lens. All rights reserved. See [LICENSE](LICENSE).
