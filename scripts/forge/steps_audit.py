#!/usr/bin/env python3
"""steps_audit.py: transition-by-transition continuity audit for multi-step batches (SWED-100).

  steps_audit.py make  <gameId> <dir> <batch.ndjson> [--ids a,b]   write <dir>/audit.ndjson, one row per multi-step
                                                                    scenario (only these ids with --ids)
  steps_audit.py check <gameId> <dir> <batch.ndjson> [--ids a,b]   check <dir>/review-audit.ndjson covers every
                                                                    transition, then print the breaks and notes; exit 1
                                                                    when coverage is incomplete

A player reaches each prompt after reading the `then` of whichever option they picked in the step before, so every
prompt after the first must follow from every one of those thens. The first Chapter 7 reviewers, asked to read whole
scenarios, missed many breaks. An audit row numbers each pair to check (the option and its then, and the prompt that
comes next), and the auditor answers every pair, so a skipped pair is a coverage error rather than a silent pass.

The auditor writes, one JSON object per line:
  {"id", "transitions": ["ok" or "break: <why>", ... one per numbered transition, in order], "notes": ["<field>: <problem>"]}
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C  # noqa: E402


def rows(path):
    return [json.loads(line) for line in open(path, encoding="utf8") if line.strip()]


def transitions(o):
    out = []
    for k in range(1, len(o["steps"])):
        for x in o["steps"][k - 1]["options"]:
            out.append({"t": len(out) + 1, "into_step": k + 1, "picked": x["text"], "then": x["then"], "next": o["steps"][k]["prompt"]})
    return out


def make(d, batch, only=None):
    os.makedirs(d, exist_ok=True)
    n = 0
    with open(os.path.join(d, "audit.ndjson"), "w", encoding="utf8") as f:
        for o in rows(batch):
            if not C.is_story(o) or (only is not None and o["id"] not in only):
                continue
            steps = [{"step": k + 1, "prompt": st["prompt"], "why": st["why"],
                      "options": [{"text": x["text"], "then": x["then"], **({"best": True} if x.get("best") else {})} for x in st["options"]]}
                     for k, st in enumerate(o["steps"])]
            row = {"id": o["id"], "type": o["type"], "hook": o["hook"], **({"setup": o["setup"]} if o.get("setup") else {}),
                   "steps": steps, **({"debrief": o["debrief"]} if o.get("debrief") else {}), "relearn": o.get("relearn"),
                   "transitions": transitions(o)}
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
            n += 1
    return n


def check(d, batch, only=None):
    """(coverage problems, breaks as (id, transition, verdict), notes as (id, note))."""
    by = {o["id"]: o for o in rows(batch) if C.is_story(o) and (only is None or o["id"] in only)}
    path = os.path.join(d, "review-audit.ndjson")
    got = {r["id"]: r for r in rows(path)} if os.path.exists(path) else {}
    problems, breaks, notes = [], [], []
    for i, o in by.items():
        ts = transitions(o)
        r = got.get(i)
        if r is None:
            problems.append(f"{i}: not audited")
            continue
        verdicts = r.get("transitions") or []
        if len(verdicts) != len(ts):
            problems.append(f"{i}: {len(verdicts)} verdicts for {len(ts)} transitions")
        for t, v in zip(ts, verdicts):
            v = str(v).strip()
            if v.lower() == "ok":
                continue
            if not v.lower().startswith("break"):
                problems.append(f"{i}: transition {t['t']} verdict is neither ok nor break: {v[:40]!r}")
                continue
            breaks.append((i, t, v))
        notes += [(i, n) for n in r.get("notes") or []]
    problems += [f"{i}: audited but not in the batch" for i in got if i not in by]
    return problems, breaks, notes


def main():
    args = sys.argv[1:]
    only = None
    if "--ids" in args:
        k = args.index("--ids")
        only = {i.strip() for i in args[k + 1].split(",") if i.strip()}
        args = args[:k] + args[k + 2:]
    if len(args) != 4 or args[0] not in ("make", "check"):
        raise SystemExit(__doc__)
    cmd, _gid, d, batch = args
    if cmd == "make":
        print(f"✓ {make(d, batch, only)} audit rows in {d}/audit.ndjson")
        return
    problems, breaks, notes = check(d, batch, only)
    for i, t, v in breaks:
        print(f"  break {i} step {t['into_step']} after \"{t['picked']}\": {v}")
    for i, n in notes:
        print(f"  note {i}: {n}")
    for p in problems:
        print(f"  coverage {p}")
    print(f"{'✗' if problems else '✓'} {len(breaks)} break(s), {len(notes)} note(s), {len(problems)} coverage problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
