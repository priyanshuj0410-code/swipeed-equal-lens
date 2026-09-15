#!/usr/bin/env python3
"""blind_review.py: blind answer-key review for choose, match, sort and multi-step branch and role-play scenarios
(playtest feedback plan, Phase 2; first used on the Choosing & Building pilot under SWED-75, stories added in SWED-96).

A reviewer who has not seen the keys answers every question with its answers removed and its options, rights or
items shuffled. This script writes those blind files and diffs the reviewer's answers against the keys. A
disagreement means the intended answer is not the only defensible one, so the scenario is rewritten before it ships.

  make <gameId> <dir> [batch.ndjson ...]   write blind-choose/match/sort/story.ndjson for the game, with batches applied,
                                           plus continuity.ndjson for stories
  diff <gameId> <dir> [batch.ndjson ...]   compare the reviewer's files in <dir> with the keys; exit 1 on disagreement

  --batch-only   only the scenarios in the given batches (a rollout reviews one batch at a time, SWED-100)
  --ids a,b,c    only these ids (a re-check of the steps a fixer rewrote)
  --ids-from f   only the ids in f: one per line, or the "id" of each row of an .ndjson file

The reviewer writes, one JSON object per line:
  review-choose.ndjson  {"id", "fits": [option texts], "unsure": [option texts], "why"}
  review-match.ndjson   {"id", "pairs": [{"left", "right"}], "why"}
  review-sort.ndjson    {"id", "key": {item text: zone label}, "why"}
  review-story.ndjson   {"id", "best": [the chosen option text for each step, in order], "why"}
A story's blind row shows every step's prompt and its options shuffled, without any `then`: a then describes what an
option leads to, which a player only sees after picking it. Its continuity row adds each option's `then` and still
hides `best`, so a second pass can check that every next prompt follows from every earlier pick.
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


KINDS = ("choose", "match", "sort", "story")


def kind(o):
    return "story" if C.is_story(o) else o.get("type")


def make(gid, out, batches, game_path=None, seed=None, only=None):
    by = scenarios(gid, batches, game_path)
    rng = random.Random(seed if seed is not None else gid)
    os.makedirs(out, exist_ok=True)
    files = {k: open(os.path.join(out, f"blind-{k}.ndjson"), "w", encoding="utf8") for k in KINDS}
    counts = {k: 0 for k in files}
    continuity = open(os.path.join(out, "continuity.ndjson"), "w", encoding="utf8")
    for o in by.values():
        if only is not None and o["id"] not in only:
            continue
        t = kind(o)
        if t == "story":
            steps, full = [], []
            for st in o["steps"]:
                opts = [{"text": x["text"], "then": x["then"]} for x in st["options"]]
                rng.shuffle(opts)
                steps.append({"prompt": st["prompt"], "options": [x["text"] for x in opts]})
                full.append({"prompt": st["prompt"], "options": opts})
            head = {"id": o["id"], "type": o["type"], "hook": o["hook"], **({"setup": o["setup"]} if o.get("setup") else {})}
            row = {**head, "steps": steps}
            continuity.write(json.dumps({**head, "steps": full}, ensure_ascii=False) + "\n")
        elif t == "choose":
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
    for f in (*files.values(), continuity):
        f.close()
    return counts


def read_ids(path):
    """Ids from a file: one per line, or the "id" of each row of an .ndjson file."""
    lines = [l.strip() for l in open(path, encoding="utf8") if l.strip()]
    return [json.loads(l)["id"] for l in lines] if path.endswith(".ndjson") else lines


def _rows(path):
    return [json.loads(l) for l in open(path, encoding="utf8") if l.strip()] if os.path.exists(path) else []


def diff(gid, d, batches, game_path=None, only=None):
    """Disagreements as (kind, id, detail) plus the ids the reviewer skipped (within `only` when given)."""
    by = scenarios(gid, batches, game_path)
    out, seen = [], {k: set() for k in KINDS}
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
    for r in _rows(os.path.join(d, "review-story.ndjson")):
        o = by[r["id"]]
        seen["story"].add(r["id"])
        key = [next(x["text"] for x in st["options"] if x.get("best")) for st in o["steps"]]
        got = list(r.get("best", []))
        wrong = [(i, key[i], got[i] if i < len(got) else None) for i in range(len(key)) if i >= len(got) or got[i] != key[i]]
        if wrong:
            out.append(("story", r["id"], f"(step, key, reviewer) {wrong}; {r.get('why', '')}"))
    missing = sorted(i for i, o in by.items() if kind(o) in seen and i not in seen[kind(o)] and (only is None or i in only))
    return out, missing


def main():
    if len(sys.argv) < 4 or sys.argv[1] not in ("make", "diff"):
        raise SystemExit(__doc__)
    cmd, gid, d, rest = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
    ids = rest[rest.index("--ids") + 1] if "--ids" in rest else None
    ids_from = rest[rest.index("--ids-from") + 1] if "--ids-from" in rest else None
    if ids_from:
        ids = ",".join(read_ids(ids_from))
    batches = [a for a in rest if not a.startswith("--") and a not in (ids, ids_from)]
    only = None
    if "--batch-only" in rest:
        only = {json.loads(l)["id"] for b in batches for l in open(b, encoding="utf8") if l.strip()}
    if ids is not None:
        only = (only if only is not None else set(scenarios(gid, batches))) & {i.strip() for i in ids.split(",") if i.strip()}
    if cmd == "make":
        print(f"✓ blind files in {d}: {make(gid, d, batches, only=only)}")
        return
    found, missing = diff(gid, d, batches, only=only)
    for kind, i, detail in found:
        print(f"  {kind} {i}: {detail}")
    if missing:
        print(f"  not reviewed: {len(missing)} ({', '.join(missing[:8])}{'...' if len(missing) > 8 else ''})")
    print(f"{'✗' if found else '✓'} {gid}: {len(found)} disagreement(s)")
    sys.exit(1 if found else 0)


if __name__ == "__main__":
    main()
