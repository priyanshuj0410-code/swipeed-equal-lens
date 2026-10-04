---
type: Architecture
owner: the-equal-lens
title: Stack, build and deployment
description: What SwipeEd is built with, how it builds, and how a merge to main reaches swipeed.vercel.app, verified against package.json and the Vercel API on 2026-09-14.
resource: https://swipeed.vercel.app
tags: [swipeed, stack, build, deployment, vercel, pwa]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8a2d7c-843d-4058-964b-83f8181fc21b  # SWED-72
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/1e640d0d-e504-4326-a2a8-a60d4a1886e2  # SWED-106
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/66768e21-f648-4c92-bbda-d30a084d9569  # SWED-107
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a211b3dc-b375-4701-ab93-7c8f4d948d6b  # SWED-108
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d2cb5ce0-217b-49cb-b993-b1f5b592dc0e  # SWED-109
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9b892973-658b-4376-962e-dde7a59e3a60  # SWED-110
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/bebd5a55-4403-44f5-866f-2a30d6e79f17  # SWED-133
---

# Stack, build and deployment

## Stack

| Layer | Choice | Where |
|---|---|---|
| Framework | Next.js 16.2.9 (App Router), React 19.2.4, TypeScript 5 | `package.json`, `src/app/` |
| Styling | Tailwind CSS v4, shadcn config, The Equal Lens brand tokens | `src/app/globals.css`, `components.json`, [design system](../design.md) |
| Brand package | `@equal-lens/brand` 0.1.0 from GitHub Packages, published as `@priyanshuj0410-code/equal-lens-brand` and aliased back | `package.json`, `.npmrc` |
| 3D path | three 0.171, @react-three/fiber 9, @react-three/drei 10 | `src/components/path-scene.tsx` |
| Games | one shared v2 engine and typed scenario banks | [v2 engine](v2-engine.md), [question bank](../schemas/question-bank.md) |
| Installable app | web manifest and service worker (a kill switch that clears old caches; no offline mode yet) | `src/app/manifest.ts`, `public/sw.js` |
| Content tooling | Python 3 scripts (status, path generation, forge gates) | `scripts/` |

`AGENTS.md` warns that this Next.js version has breaking changes from older releases: read the guide in `node_modules/next/dist/docs/` before writing framework code.

## Build and checks

| Command | What it runs |
|---|---|
| `npm run dev` | `next dev` |
| `npm run build` | `npm run gates` first (the `prebuild` script), then `next build`, which compiles and type-checks. Vercel runs the same build, so a content gate failure or a type error fails the deploy. |
| `npm run gates` | `python3 scripts/no_dashes.py` (no em or en dashes in any tracked text file, [SWED-92](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22)), `python3 scripts/private_files.py` (no CV, case study, job document, internal strategy document, brand guidelines PDF or Lazyweb screenshot tracked in this public repo, [SWED-107](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/66768e21-f648-4c92-bbda-d30a084d9569)), `python3 scripts/content_gate.py` (the whole-bank content gate), `python3 scripts/forge/test_gates.py` (gate fixtures) and `node --test 'scripts/tests/*.test.mjs'` (engine unit tests) |
| `npm run lint` | `eslint` (flat config with `eslint-config-next`). It passes with zero problems since [SWED-110](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9b892973-658b-4376-962e-dde7a59e3a60). Where the React Hooks rules object to React Three Fiber idioms (mutating three.js objects inside `useFrame`, writing the camera rig's shared progress ref), the line carries an `eslint-disable-next-line` comment that gives the reason. |
| `npm run status` | `python3 scripts/swipeed_status.py`, build and registration status from `scripts/master-node-table.xlsx` |
| `npm run read-first` | `python3 scripts/read_first.py`, the read-before-build attestation for new v2 games |

The package manager is npm (`package-lock.json`). Git hooks live in `scripts/githooks/` and are enabled by `scripts/setup-hooks.sh` (`core.hooksPath`), which `npm install` now runs through the `prepare` script (it does nothing outside a git work tree, such as a build container). The pre-commit hook runs the status check, the read-first gate and the content gate. The pre-push hook runs `scripts/private_files.py --push` over every commit the remote does not have yet and refuses the push if one adds a private or purged file, so a branch still built on the history from before the 2026-10-01 purges cannot put them back ([SWED-110](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9b892973-658b-4376-962e-dde7a59e3a60)). Since [SWED-72](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8a2d7c-843d-4058-964b-83f8181fc21b) the content gate and the tests also run before every build, so no deploy skips them; the Vercel build image has Python 3. Duplicate detection (`forge_dedup.py`) and the forge's count and persona checks still run only inside the forge workflow (see [question bank](../schemas/question-bank.md)).

`@equal-lens/brand` comes from GitHub Packages ([SWED-109](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d2cb5ce0-217b-49cb-b993-b1f5b592dc0e)). The Equal Lens repo publishes it, with semantic versions and a changelog, on a `brand-v<version>` tag ([THEEQ-55](https://app.plane.so/the-equal-lens/projects/131d7f73-411c-4a57-a1d3-3147617b2de9/issues/85b1e374-6638-408e-a0fe-edd5dbba1f8d)). GitHub Packages only accepts npm packages scoped to the owning account, so it is published as `@priyanshuj0410-code/equal-lens-brand`, and `package.json` installs it under its own name with an npm alias (`"@equal-lens/brand": "npm:@priyanshuj0410-code/equal-lens-brand@0.1.0"`), so no import changes. GitHub Packages needs a token even to install: `.npmrc` reads it from `NPM_TOKEN`, which must hold a classic token with `read:packages`, set locally and as a Vercel project environment variable. Upgrading the brand is a deliberate change: bump the pinned version, read the changelog, and check the UI against the [design system](../design.md). From 2026-09-01 (SWED-44) to the switch, the package was vendored as `vendor/equal-lens-brand-0.1.0.tgz` because cloud builds could not resolve it from outside the repo; the published 0.1.0 has the same files.

## Hosting

| Field | Value |
|---|---|
| Host | Vercel, project `swipeed` (`prj_BYLrgKs8JH2BLHe4xNwtThViNJMj`) |
| Git connection | `priyanshuj0410-code/swipeed-equal-lens`, production branch `main` |
| Production domains | `swipeed.vercel.app` (plus two generated `*.vercel.app` aliases) |
| Node on Vercel | 24.x |
| Local link | `.vercel/project.json` in this repo (gitignored) |

**A push or merge to `main` on GitHub deploys to production.** Every production deploy since 2026-09-01 has come from a git push to `main` (seven that day, the last for commit `e4953e2`). Run `npm run build` locally before pushing.

### Releases

Deploys are continuous; releases mark the milestones ([SWED-108](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a211b3dc-b375-4701-ab93-7c8f4d948d6b)). Versions are calendar versions,
`YYYY.M.N`, where `N` counts the releases already made that month (`2026.10.0`, then `2026.10.1`). The version is in
`package.json` and `package-lock.json`, each release is an annotated tag `vYYYY.M.N` on `main`, and each has a
GitHub release whose notes list the [project log](../log/log.md) entries added since the previous tag.
`scripts/release.py` does both halves:

1. On the branch that ships the milestone, before merging: `python3 scripts/release.py --bump`, then commit the
   version change with the rest.
2. After that merge is pushed and Vercel reports success, on `main`: `python3 scripts/release.py --publish` (add
   `--dry-run` to preview the tag and the notes). It refuses to run unless `main` matches `origin/main`.

Cut a release when something a partner or a player would notice ships: a chapter of multi-step stories, an engine
change, a picture set. Small fixes ride along in the next release.

### History

- **June 2026:** production deploys were made from the CLI (`vercel build --prod`, then `vercel deploy --prebuilt --prod`) because the Vercel git connection pointed at the older `priyanshuj0410-code/SwipeEd` repo. Older docs and log entries describe this flow and say `main` is never pushed; that is no longer true.
- **2026-09-01:** the app repo was backed up to GitHub (SWED-42), the Vercel git connection was found pointing at the wrong repo (SWED-43), and the brand package was vendored so git builds could succeed (SWED-44). From then on deploys come from git.
- **2026-09-14:** verified through the Vercel API that the project links to `swipeed-equal-lens` and that the latest production deploys have `source: git`. An archived local clone of the old repo, which was also linked to this Vercel project, was unlinked and renamed. No preview deployments appeared in the last 40 deploys.

### Vercel CLI caution

When a folder is not linked, `vercel --yes` links it to any existing project whose name matches the folder name, then deploys. Only this repo should be linked to `swipeed`; never run the CLI in another folder named `swipeed`.

## Related

- [v2 engine](v2-engine.md) · [question bank](../schemas/question-bank.md) · [design system](../design.md) · [SwipeEd (app)](../games/swipeed.md) · [Plane configuration](../plane.config.md)
