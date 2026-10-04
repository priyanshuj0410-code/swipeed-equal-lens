#!/usr/bin/env python3
"""forge_assemble.py: merge a validated NDJSON batch into <game>.json, atomically.

New scenarios are appended to the end of the game's scenarios list; a legacy RESHAPE (an id on the plan's reshape
worklist) replaces that scenario in place, keeping its type and category. Pipeline sidecar keys (_evidence, _anchor,
needsFact) are stripped, so the game file carries only schema fields.

Refuses the whole batch (SWED-73) when any line is not a scenario, an id repeats, a batch id would overwrite a
shipped scenario that is not on the worklist, a reshape changes type or category, or a new id falls outside its
category's id block. The merged file is written to a temp file beside the game, re-parsed, its count asserted
(shipped + new), and only then moved over the game file, so a failure leaves the game untouched.

Usage: python3 scripts/forge/forge_assemble.py --game <gid> --batch <file.ndjson> [--apply]
       (dry-run by default; --apply writes the file.)
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C

SIDECAR = ("_evidence", "_anchor", "needsFact", "_source", "_note")


def strip_sidecar(o):
    return {k: v for k, v in o.items() if k not in SIDECAR}


def load_batch(path):
    """(scenarios, problems): every non-empty line must be a parseable scenario."""
    out, problems = [], []
    for n, raw in enumerate(open(path, encoding="utf8"), 1):
        raw = raw.strip().rstrip(",")
        if not raw:
            continue
        if not C.is_scenario_line(raw):
            problems.append(f"line {n}: not a scenario line: {raw[:60]!r}")
            continue
        try:
            out.append(json.loads(raw))
        except ValueError as e:
            problems.append(f"line {n}: unparseable: {e}")
    return out, problems


def assemble(gid, batch_path, apply, path=None, plan=None):
    path = path or C.game_path(gid)
    plan = plan or C.load_plan(gid)
    if not plan:
        raise SystemExit(f"✗ {gid}: no plan; run forge_plan.py {gid} --write first (assembly needs its id blocks)")
    scns, errors = C.parse_file(path)
    if errors:
        raise SystemExit(f"✗ {gid}: the game file does not parse ({errors[:3]}); fix it before assembling")
    cfg = C.load_game(path)
    shipped = {o["id"]: i for i, o in enumerate(cfg["scenarios"])}

    batch, problems = load_batch(batch_path)
    reshapes, seen = C.reshape_ids(plan), set()
    by_id = {o["id"]: o for o in cfg["scenarios"]}
    for o in batch:
        problems += [f"{o.get('id')}: {e}" for e in C.regrowth_id_errors(o, by_id, reshapes, plan, seen)]
    if problems:
        raise SystemExit(f"✗ {gid}: refusing to assemble, {len(problems)} problem(s):\n  " + "\n  ".join(problems[:20]))

    new, reshaped = 0, 0
    for o in batch:
        o = strip_sidecar(o)
        if o["id"] in shipped:
            cfg["scenarios"][shipped[o["id"]]] = o
            reshaped += 1
        else:
            cfg["scenarios"].append(o)
            new += 1
    expected = len(shipped) + new

    tmp = path + ".assemble-tmp"
    C.write_game(tmp, cfg)
    scns, errors = C.parse_file(tmp)
    if errors or len(scns) != expected:
        os.remove(tmp)
        raise SystemExit(f"✗ {gid}: merged file failed its round-trip (parse errors {errors[:3]}, count {len(scns)} "
                         f"vs expected {expected}); the game file is untouched")
    if apply:
        os.replace(tmp, path)
        print(f"✓ {gid}: +{new} new, {reshaped} reshaped → {len(scns)} total (parse clean)")
    else:
        os.remove(tmp)
        print(f"(dry-run) {gid}: would add {new} new, reshape {reshaped} → {len(scns)} total (parse clean)")
        print("  re-run with --apply to write.")


def main():
    gid = sys.argv[sys.argv.index("--game") + 1]
    bf = sys.argv[sys.argv.index("--batch") + 1]
    assemble(gid, bf, "--apply" in sys.argv)


if __name__ == "__main__":
    main()
