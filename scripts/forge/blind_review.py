#!/usr/bin/env python3
"""blind_review.py: blind answer-key review for choose, match and sort scenarios (playtest feedback plan, Phase 2;
first used on the Choosing & Building pilot under SWED-75).

A reviewer who has not seen the keys answers every question with its answers removed and its options, rights or
items shuffled. This script writes those blind files and diffs the reviewer's answers against the keys. A
disagreement means the intended answer is not the only defensible one, so the scenario is rewritten before it ships.

  make <gameId> <dir> [batch.ndjson ...]   write blind-choose/match/sort.ndjson for the game, with batches applied
  diff <gameId> <dir> [batch.ndjson ...]   compare the reviewer's files in <dir> with the keys; exit 1 on disagreement

The reviewer writes, one JSON object per line:
  review-choose.ndjson  {"id", "fits": [option texts], "unsure": [option texts], "why"}
  review-match.ndjson   {"id", "pairs": [{"left", "right"}], "why"}
  review-sort.ndjson    {"id", "key": {item text: zone label}, "why"}
Batches are applied in order over the shipped game, so a pending reshape is reviewed as it will ship.
"""
import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C  # noqa: E402


def scenarios(gid, batches, game_path=None):
    scns, errors = C.parse_file(game_path or os.path.join(C.GAMES, gid + ".ts"))
    if errors:
        raise SystemExit(f"{gid}: parse errors {errors[:3]}")
    by = {o["id"]: o for o in scns}
    for b in batches:
        for line in open(b, encoding="utf8"):
            if line.strip():
                o = json.loads(line)
                by[o["id"]] = o
    return by


def make(gid, out, batches, game_path=None, seed=None):
    by = scenarios(gid, batches, game_path)
    rng = random.Random(seed if seed is not None else gid)
    os.makedirs(out, exist_ok=True)
    files = {k: open(os.path.join(out, f"blind-{k}.ndjson"), "w", encoding="utf8") for k in ("choose", "match", "sort")}
    counts = {k: 0 for k in files}
    for o in by.values():
        t = o.get("type")
        if t == "choose":
            texts = [x["text"] for x in o["options"]]
            rng.shuffle(texts)
            row = {"id": o["id"], "question": f"{o['hook']} {o['prompt']}", "options": texts}
        elif t == "match":
            rights = [p["right"] for p in o["pairs"]]
            rng.shuffle(rights)
            row = {"id": o["id"], "hook": o["hook"], "lefts": [p["left"] for p in o["pairs"]], "rights": rights}
        elif t == "sort":
            items = [it["text"] for it in o["items"]]
            rng.shuffle(items)
            row = {"id": o["id"], "hook": o["hook"], "zones": [b["label"] for b in o["bins"]], "items": items}
        else:
            continue
        files[t].write(json.dumps(row, ensure_ascii=False) + "\n")
        counts[t] += 1
    for f in files.values():
        f.close()
    return counts


def _rows(path):
    return [json.loads(l) for l in open(path, encoding="utf8") if l.strip()] if os.path.exists(path) else []


def diff(gid, d, batches, game_path=None):
    """Disagreements as (kind, id, detail) plus the ids the reviewer skipped."""
    by = scenarios(gid, batches, game_path)
    out, seen = [], {"choose": set(), "match": set(), "sort": set()}
    for r in _rows(os.path.join(d, "review-choose.ndjson")):
        o = by[r["id"]]
        seen["choose"].add(r["id"])
        key = {x["text"] for x in o["options"] if x["fits"]}
        got = set(r.get("fits", []))
        if key != got:
            out.append(("choose", r["id"], f"missed {sorted(key - got)}, extra {sorted(got - key)}; {r.get('why', '')}"))
    for r in _rows(os.path.join(d, "review-match.ndjson")):
        o = by[r["id"]]
        seen["match"].add(r["id"])
        key = {(p["left"], p["right"]) for p in o["pairs"]}
        got = {(p.get("left"), p.get("right")) for p in r.get("pairs", [])}
        if key != got:
            out.append(("match", r["id"], f"key only {sorted(key - got)}, reviewer only {sorted(got - key)}; {r.get('why', '')}"))
    for r in _rows(os.path.join(d, "review-sort.ndjson")):
        o = by[r["id"]]
        seen["sort"].add(r["id"])
        label = {b["id"]: b["label"] for b in o["bins"]}
        key = {it["text"]: label[o["key"][it["id"]]] for it in o["items"]}
        wrong = {t: (key[t], r.get("key", {}).get(t)) for t in key if r.get("key", {}).get(t) != key[t]}
        if wrong:
            out.append(("sort", r["id"], f"(key, reviewer) {wrong}; {r.get('why', '')}"))
    missing = sorted(i for i, o in by.items() if o.get("type") in seen and i not in seen[o["type"]])
    return out, missing


def main():
    if len(sys.argv) < 4 or sys.argv[1] not in ("make", "diff"):
        raise SystemExit(__doc__)
    cmd, gid, d, batches = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
    if cmd == "make":
        print(f"✓ blind files in {d}: {make(gid, d, batches)}")
        return
    found, missing = diff(gid, d, batches)
    for kind, i, detail in found:
        print(f"  {kind} {i}: {detail}")
    if missing:
        print(f"  not reviewed: {len(missing)} ({', '.join(missing[:8])}{'...' if len(missing) > 8 else ''})")
    print(f"{'✗' if found else '✓'} {gid}: {len(found)} disagreement(s)")
    sys.exit(1 if found else 0)


if __name__ == "__main__":
    main()
