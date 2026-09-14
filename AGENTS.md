<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working conventions

- **Branch per change.** Never commit directly to `main`. Do each change on its own feature branch (or `docs/<topic>` for docs), and **merge (`--no-ff`) or archive it before starting the next thing** — don't stack new work on an unfinished, unmerged branch.
- **Keep the knowledge base in sync.** SwipeEd is documented in the **sibling Praxis repo** (`praxis-engine`) OKF knowledge base under `knowledge/…`. Any change that affects a game or a path-world feature must ship with the matching KB update in the same unit of work: the relevant `knowledge/games/…` doc, a `knowledge/log.md` entry (newest first), and any cross-links. The KB is the single source of truth tying the games together and must never lag the code.

> **This is a `the-equal-lens` domain.** A chat here may edit only The Equal Lens files (this repo,
> the site, SwipeEd). It may read anything and file tickets into any domain, but an Edit or Write into the
> **Praxis** engine repo is blocked by `~/.claude/hooks/domain-guard.sh` — Praxis is a separate venture.
> Need an engine change? File a ticket in Plane `claude-pri / PRX` for a Praxis chat.
