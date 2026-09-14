#!/usr/bin/env bash
# Activate the tracked git hooks (SwipeEd read-first guard). Run once per clone.
# Also runs from `npm install` (the prepare script); a build container may have no git work tree, so skip there.
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
git config core.hooksPath scripts/githooks && echo "✓ git hooks active (scripts/githooks)"
