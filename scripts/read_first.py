#!/usr/bin/env python3
"""Read-first gate: no SwipeEd build may START without its source docs:
  build bible · transition plan · the node's GDD (reworked v2) · the chapter personas · the scenario library.
It RESOLVES + verifies those five exist for a node, and records a hash-pinned attestation that they were read.
The pre-commit hook calls --gate: committing a NEW v2 game without a valid attestation is BLOCKED.

Usage:
  python3 scripts/read_first.py --require gXX            # list the 5 docs + existence; nonzero if any missing
  python3 scripts/read_first.py --attest  gXX [--notes "..."]   # after reading them: write .read-first/gXX.json (hash-pinned)
  python3 scripts/read_first.py --verify  gXX            # attestation exists & doc hashes still match (not stale)
  python3 scripts/read_first.py --gate                  # (hook) verify every NEW v2 build staged in this commit

Honest limit: this guarantees the docs EXIST and that a hash-pinned attestation naming each was produced
before the build commit, and blocks a new build without it: it cannot verify I understood them. The point is
to remove the excuse and force a deliberate, doc-pinned read-first step (you literally can't attest a missing doc).

The build bible and the transition plan are internal documents: since the repo went public (SWED-107) they stay in
Strategy/ on the owner's machine, untracked and gitignored, so --require, --attest and --verify need those local
copies. --gate only checks NEW games staged in a commit, so everyday commits do not depend on them.
"""
import sys, os, re, glob, json, hashlib, datetime, pathlib, subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
STRAT = ROOT / "Strategy"
ATTEST = ROOT / ".read-first"
sys.path.insert(0, str(ROOT / "scripts"))
import swipeed_status as st  # reuse the master-node-table loader + GAME map (no side effects on import)

REQUIRED = ["build_bible", "transition_plan", "gdd", "chapter_personas", "scenario_library"]


def node_info(node):
    n = next((x for x in st.load_nodes() if x["id"] == node), None)
    if not n:
        raise SystemExit(f"unknown node '{node}'")
    n["game"] = st.load_game_map().get(node)
    m = re.search(r"Ch\.(\d+)", n["chapter"])
    n["chapter_num"] = int(m.group(1)) if m else None
    n["gdd_num"] = int(re.sub(r"\D", "", node) or 0)
    return n


def _first(*patterns):
    for p in patterns:
        hits = sorted(glob.glob(str(STRAT / p)))
        if hits:
            return hits[0]
    return None


def required_docs(node):
    n = node_info(node)
    g, ch = n["gdd_num"], n["chapter_num"]
    docs = {
        "build_bible": _first("*build bible*.pdf"),
        "transition_plan": _first("*Transition Plan*.pdf"),
        "gdd": _first(f"GDD {g} \u2014*.pdf", f"GDD {g:02d} \u2014*.pdf"),
        "chapter_personas": _first(f"Personas/*Chapter {ch} *Persona*.pdf", f"Personas/*Chapter {ch}*Persona*.pdf") if ch else None,
        "scenario_library": _first(f"*GDD {g} *Scenario Library.json", f"*GDD {g:02d} *Scenario Library.json"),
    }
    return n, docs


def _sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(65536), b""):
            h.update(b)
    return h.hexdigest()


def cmd_require(node):
    n, docs = required_docs(node)
    print(f"Read-first docs for {node} · {n['label']} (Ch.{n['chapter_num']}, GDD {n['gdd_num']}, gameId {n['game']}):")
    for k in REQUIRED:
        v = docs[k]
        print(f"  {'✓' if v else '✗ MISSING'}  {k:<18} {pathlib.Path(v).name if v else 'not found in Strategy/'}")
    missing = [k for k in REQUIRED if not docs[k]]
    if missing:
        print(f"\n⛔ cannot build {node}: missing {', '.join(missing)}", file=sys.stderr)
        return 1
    print("\n  ✓ all read-first docs present")
    return 0


def cmd_attest(node, notes=None):
    n, docs = required_docs(node)
    missing = [k for k in REQUIRED if not docs[k]]
    if missing:
        print(f"⛔ cannot attest {node}: missing {', '.join(missing)}", file=sys.stderr)
        return 1
    ATTEST.mkdir(exist_ok=True)
    rec = {
        "node": node, "gameId": n["game"], "label": n["label"], "chapter": n["chapter_num"],
        "attested_at": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
        "notes": notes or "",
        "docs": {k: {"path": str(pathlib.Path(docs[k]).relative_to(ROOT)), "sha256": _sha(docs[k]),
                     "bytes": pathlib.Path(docs[k]).stat().st_size} for k in REQUIRED},
    }
    (ATTEST / f"{node}.json").write_text(json.dumps(rec, indent=2, ensure_ascii=False) + "\n")
    print(f"✓ attested {node}: .read-first/{node}.json ({len(REQUIRED)} docs, hash-pinned). Stage it with the build.")
    return 0


def cmd_verify(node):
    f = ATTEST / f"{node}.json"
    if not f.exists():
        print(f"⛔ no read-first attestation for {node}. After reading the bible, transition plan, GDD {node_info(node)['gdd_num']}, "
              f"the chapter personas and the library, run:  python3 scripts/read_first.py --attest {node}", file=sys.stderr)
        return 1
    rec = json.loads(f.read_text())
    _, docs = required_docs(node)
    problems = []
    for k in REQUIRED:
        rk = rec.get("docs", {}).get(k)
        if not rk:
            problems.append(f"attestation missing {k}")
        elif not docs[k]:
            problems.append(f"{k} no longer found in Strategy/")
        elif _sha(docs[k]) != rk["sha256"]:
            problems.append(f"{k} changed since attestation: re-read & re-attest")
    if problems:
        print(f"⛔ read-first attestation for {node} invalid/stale:", file=sys.stderr)
        for p in problems:
            print("   -", p, file=sys.stderr)
        return 1
    print(f"  ✓ read-first attestation for {node} valid ({rec.get('attested_at')})")
    return 0


def _git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)


def staged_new_v2_nodes():
    """Content files staged in this commit that are NEW v2 builds (v2 now, but absent/non-v2 at HEAD)."""
    files = _git("diff", "--cached", "--name-only").stdout.split("\n")
    node_for = {v: k for k, v in st.load_game_map().items()}
    out = []
    for f in files:
        if not (f.startswith("src/content/games/") and f.endswith(".json")):
            continue
        staged = _git("show", f":{f}").stdout
        if '"scenarios": [' not in staged:
            continue
        m = re.search(r'"gameId":\s*"([^"]+)"', staged)
        node = node_for.get(m.group(1)) if m else None
        if not node:
            continue
        head = _git("show", f"HEAD:{f}")
        head_txt = head.stdout if head.returncode == 0 else ""
        if '"scenarios": [' not in head_txt:  # was not already v2 → a NEW build
            out.append((node, m.group(1), f))
    return out


def cmd_gate():
    new = staged_new_v2_nodes()
    if not new:
        return 0
    rc = 0
    for node, gid, f in new:
        print(f"▸ NEW v2 build staged: {node} ({gid}) in {f}, read-first attestation required:")
        if cmd_verify(node) != 0:
            rc = 1
    if rc and os.environ.get("READ_FIRST_OVERRIDE") == "1":
        print("\n  (READ_FIRST_OVERRIDE=1 set: allowing despite missing/stale attestation)")
        return 0
    return rc


def main():
    a = sys.argv[1:]
    if "--require" in a:
        return cmd_require(a[a.index("--require") + 1])
    if "--attest" in a:
        return cmd_attest(a[a.index("--attest") + 1], a[a.index("--notes") + 1] if "--notes" in a else None)
    if "--verify" in a:
        return cmd_verify(a[a.index("--verify") + 1])
    if "--gate" in a:
        return cmd_gate()
    print(__doc__)
    return 0


if __name__ == "__main__":
    sys.exit(main())
