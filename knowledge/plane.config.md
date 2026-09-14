---
type: reference
owner: the-equal-lens
title: Plane ticketing configuration
description: Workspace, project, state ids and working rules for tracking SwipeEd in Plane, and how tickets and this knowledge base link to each other.
workspace_slug: the-equal-lens
project_id: 59d0b01f-352e-4aee-bd3f-252cdf283a74
timestamp: 2026-09-14T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Plane ticketing configuration

All SwipeEd work is tracked in Plane. This page holds the ids an agent needs to file a ticket, move it and reference it in a commit.

## Project

| Field | Value |
|---|---|
| Workspace slug | `the-equal-lens` |
| Project id | `59d0b01f-352e-4aee-bd3f-252cdf283a74` |
| Project identifier | `SWED` |
| Project name | SwipeEd |
| API base | `https://api.plane.so/api/v1/workspaces/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/` |
| Issue URL | `https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/<issue-uuid>` |
| Auth | `X-API-Key: $PLANE_API_TOKEN` |

The project uses states only: no labels, modules or cycles (as of 2026-09-14).

## State ids

| State | Group | Id |
|---|---|---|
| Backlog | backlog | `16651054-0308-4544-951e-6bfb9db23896` |
| Todo | unstarted | `205e5bf6-47d0-4119-b5ac-f90e39fd638b` |
| In Progress | started | `6941446e-af77-4068-8b9a-b30620592793` |
| Done | completed | `1c80218c-e441-4443-98f6-b7e0a5d95908` |
| Cancelled | cancelled | `d4b6fbb1-7e28-4da8-9f9e-bb4b85c70de6` |

## Working rules

1. **Ticket first.** Before any non-trivial change, create an issue with the why, the scope (files and modules) and acceptance criteria, linking the relevant docs in this knowledge base. Move it to In Progress.
2. **Point the marker at it.** Write `SWED-N|<issue-uuid>` to `.plane_current_issue` at the repo (or worktree) root. The file is gitignored. The Plane guard hook refuses edits when the marker is missing, older than 4 hours, or points at a closed issue.
3. **Branch per change.** Work on a `feat/`, `fix/`, `chore/` or `docs/` branch and merge into `main` with `--no-ff` (see [AGENTS.md](../AGENTS.md)). Pushing `main` deploys to production (see [deployment](architecture/deployment.md)).
4. **Commit messages** start with the ticket: `[SWED-N] <description>`.
5. **Link both ways.** Docs touched by the work list the issue URL under `plane_issues:` in their frontmatter; the issue description links back to those docs.
6. **Close it.** After the merge, move the issue to Done and add a one-line comment saying what changed.

## Venture boundary

SwipeEd is The Equal Lens's app and stays in this project. Owhile (the engine venture, formerly Praxis) files its own work to workspace `claude-pri`, project `PRX`; that split was recorded on 2026-09-01. SWED-1 to SWED-51 predate it and include some engine design work, and are left as they are. Engine changes that belong to Owhile are filed as PRX tickets rather than done here.
