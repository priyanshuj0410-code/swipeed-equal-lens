<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working conventions

- **Branch per change.** Never commit directly to `main`. Do each change on its own feature branch (or `docs/<topic>` for docs), and **merge (`--no-ff`) or archive it before starting the next thing**; don't stack new work on an unfinished, unmerged branch.
- **Keep the knowledge base in sync.** SwipeEd is documented in this repo's OKF knowledge base under `knowledge/` (start at `knowledge/README.md`). Any change that affects a game, the path world, the engine or the question bank must ship with the matching KB update in the same unit of work: the relevant `knowledge/games/…` doc, a `knowledge/log/log.md` entry (newest first), and any cross-links. The KB is the single source of truth tying the games together and must never lag the code. (It was copied here from the Owhile repo on 2026-09-14; that older copy is no longer maintained.)
- **Follow the design system.** UI changes follow `knowledge/design.md`, and a new UI pattern updates it in the same change.
- **Track work in Plane.** Project `SWED` in workspace `the-equal-lens`; ids and ticket rules are in `knowledge/plane.config.md`. Commit messages start with `[SWED-N]`.
