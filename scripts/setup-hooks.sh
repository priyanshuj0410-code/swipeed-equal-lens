#!/usr/bin/env bash
# Activate the tracked git hooks (SwipeEd read-first guard). Run once per clone.
git config core.hooksPath scripts/githooks && echo "✓ git hooks active (scripts/githooks)"
