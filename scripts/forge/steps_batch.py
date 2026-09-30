#!/usr/bin/env python3
"""steps_batch.py: coverage check for a multi-step rollout batch (SWED-100).

  steps_batch.py <source.ndjson> <batch.ndjson>

A writer turns every single-step branch and role-play in a source file into a multi-step scenario in its batch.
forge_check.py --batch proves each line is valid; this proves the batch is complete and faithful to its source: every
source id exactly once, nothing extra, the same type, category, persona and source, and every line multi-step. It also
prints the batch's split of 3, 4 and 5 steps. Exits 1 on any problem.
"""
import json
import os
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C  # noqa: E402

KEPT = ("type", "cat", "persona", "source")


def rows(path):
    return [json.loads(line) for line in open(path, encoding="utf8") if line.strip()]


def problems(source, batch):
    src = {o["id"]: o for o in source}
    ids = Counter(o.get("id") for o in batch)
    out = [f"{i} appears {n} times" for i, n in ids.items() if n > 1]
    out += [f"{i} is missing" for i in src if i not in ids]
    out += [f"{i} is not in the source" for i in ids if i not in src]
    for o in batch:
        s = src.get(o.get("id"))
        if not s:
            continue
        out += [f"{o['id']} changes {k} from {s.get(k)!r} to {o.get(k)!r}" for k in KEPT if o.get(k) != s.get(k)]
        if not C.is_story(o):
            out.append(f"{o['id']} is not multi-step")
    return out


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    source, batch = rows(sys.argv[1]), rows(sys.argv[2])
    found = problems(source, batch)
    split = Counter(len(o.get("steps") or []) for o in batch if C.is_story(o))
    print(f"  {len(batch)} of {len(source)} scenarios; steps {dict(sorted(split.items()))}")
    for f in found:
        print(f"  {f}")
    print(f"{'✗' if found else '✓'} {os.path.basename(sys.argv[2])}: {len(found)} problem(s)")
    sys.exit(1 if found else 0)


if __name__ == "__main__":
    main()
