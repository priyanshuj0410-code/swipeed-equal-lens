#!/usr/bin/env python3
"""SwipeEd build status — the SINGLE SOURCE OF TRUTH for the path, each node's v2 build status, and the NEXT
node to build. Derived from scripts/master-node-table.xlsx (the master node table — step 0 of the read-first
hard rule) + the gen-path GAME map + the actual src/content/games/*.ts files.

DO NOT state build progress or "the next node" from memory — run this. It exists because that exact mistake
was made (claiming Chapter 2 was done / the next node was g13, when the table said g09 → g41).

Usage:
  python3 scripts/swipeed_status.py                 # full status table + the NEXT lesson to build
  python3 scripts/swipeed_status.py --next          # just print: gXX <gameId>
  python3 scripts/swipeed_status.py --check         # exit nonzero on a real inconsistency (the pre-commit hook calls this)
  python3 scripts/swipeed_status.py --assert-next gXX   # exit nonzero unless the computed next node == gXX
Set SWIPEED_STATUS_OVERRIDE=1 to force --check to pass (escape hatch for a deliberate, unusual state).
"""
import os, sys, re, ast, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
XLSX = ROOT / "scripts" / "master-node-table.xlsx"
GENPATH = ROOT / "scripts" / "gen-path.py"
CONTENT = ROOT / "src" / "content" / "games"
ENGINE_HOST = ROOT / "src" / "components" / "games" / "engine-host.tsx"


def load_game_map():
    """node_id -> runtime registry gameId, parsed from gen-path.py's GAME dict literal."""
    txt = GENPATH.read_text()
    i = txt.index("{", re.search(r"\bGAME\s*=\s*", txt).end())
    depth = 0
    for j in range(i, len(txt)):
        depth += 1 if txt[j] == "{" else (-1 if txt[j] == "}" else 0)
        if depth == 0:
            return ast.literal_eval(txt[i:j + 1])
    raise ValueError("could not parse GAME map from gen-path.py")


def load_nodes():
    """The master node table rows, in path order, from the xlsx (the source of truth)."""
    import openpyxl
    rows = list(openpyxl.load_workbook(XLSX, data_only=True)["Master Node Table"].iter_rows(values_only=True))
    hi = next(i for i, r in enumerate(rows) if str(r[0]).strip() == "order")
    nodes = []
    for r in rows[hi + 1:]:
        if r[0] is None or not str(r[0]).strip():
            continue
        try:
            order = int(r[0])
        except (TypeError, ValueError):
            continue
        prereq = str(r[10]).strip() if r[10] not in (None, "—", "") else None
        nodes.append(dict(order=order, id=str(r[1]).strip(), label=str(r[2]).strip(),
                          type=str(r[3]).strip().lower(), chapter=str(r[4]).strip(), prereq=prereq))
    nodes.sort(key=lambda n: n["order"])
    return nodes


def v2_gids():
    """The set of runtime gameIds that are BUILT to v2 — found by reading each content file's own
    `gameId: "..."` (robust to filename ≠ gameId, e.g. feelings-friends.ts → gameId 'feelings')."""
    out = set()
    if not CONTENT.exists():
        return out
    for f in CONTENT.glob("*.ts"):
        t = f.read_text()
        if "v2-schema" in t and "V2GameConfig" in t:
            m = re.search(r'gameId:\s*"([^"]+)"', t)
            if m:
                out.add(m.group(1))
    return out


def is_registered(gid, eh):
    """engine-host keys may be quoted ("clean-crew":) or unquoted (feelings:) — match either."""
    return bool(gid) and (f'"{gid}"' in eh or re.search(rf'(?<![\w-]){re.escape(gid)}\s*:\s*dynamic', eh) is not None)


def compute():
    game = load_game_map()
    nodes = load_nodes()
    v2 = v2_gids()
    eh = ENGINE_HOST.read_text() if ENGINE_HOST.exists() else ""
    for n in nodes:
        gid = game.get(n["id"])
        n["game"] = gid
        n["registered"] = is_registered(gid, eh)
        if n["type"] == "capstone":
            n["status"] = "capstone"
        elif gid in v2:
            n["status"] = "v2"
        elif gid and (n["registered"] or any((CONTENT / f"{gid}.ts").exists() for _ in [0])):
            n["status"] = "v1"
        else:
            n["status"] = "unbuilt"
    nxt = next((n for n in nodes if n["type"] != "capstone" and n["status"] != "v2"), None)
    return nodes, nxt


def main():
    args = sys.argv[1:]
    try:
        nodes, nxt = compute()
    except Exception as e:  # noqa: BLE001 — a broken table/map must hard-fail the gate
        print(f"⛔ swipeed_status could not read the master node table / GAME map: {e}", file=sys.stderr)
        return 1

    if "--next" in args:
        print(f'{nxt["id"]} {nxt["game"]}' if nxt else "none — all lessons are v2")
        return 0

    if "--assert-next" in args:
        want = args[args.index("--assert-next") + 1]
        got = nxt["id"] if nxt else "none"
        if got != want:
            print(f"⛔ ASSERT FAILED: you claimed next={want}, but the master node table computes next={got}", file=sys.stderr)
            return 2
        print(f"✓ next is {got}")
        return 0

    SYM = {"v2": "✅ v2     ", "v1": "⚠️  v1    ", "unbuilt": "⬚ unbuilt", "capstone": "🏆 capstone"}
    problems = []
    print("SwipeEd build status — from scripts/master-node-table.xlsx (the source of truth)\n")
    cur = None
    for n in nodes:
        if n["chapter"] != cur:
            cur = n["chapter"]
            print(f"  — {cur} —")
        flag = "  ⛔ v2 but NOT registered in engine-host" if (n["status"] == "v2" and not n["registered"]) else ""
        print(f"   {n['order']:>2}  {n['id']:<4} {SYM.get(n['status'], n['status']):<10} {(n['game'] or '—'):<16} {n['label']}{flag}")
        if n["status"] == "v2" and not n["registered"]:
            problems.append(f"{n['id']} ({n['game']}) is built v2 but is NOT registered in engine-host (won't launch)")
    print()
    if nxt:
        print(f"  ➡️  NEXT LESSON TO BUILD: {nxt['id']}  {nxt['label']}  (gameId {nxt['game']}, prereq {nxt['prereq']})")
    else:
        print("  ➡️  All lessons are v2.")

    if "--check" in args:
        if problems and os.environ.get("SWIPEED_STATUS_OVERRIDE") != "1":
            print("\n⛔ CONSISTENCY PROBLEMS (blocking — set SWIPEED_STATUS_OVERRIDE=1 to bypass):", file=sys.stderr)
            for p in problems:
                print("   -", p, file=sys.stderr)
            return 1
        print("\n  ✓ consistency OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
