#!/usr/bin/env python3
"""steps_final.py: the final certification pass for multi-step batches before they ship (SWED-100).

Earlier rounds reviewed, fixed and re-checked each batch, but the last fixes were never reviewed again. This pass reviews
every scenario once more from three independent angles, then re-reviews whatever a fixer changes, round by round:

  1. blind pick: a reviewer picks each step's best option without seeing the answer (steps-review.md, pass 1)
  2. transition audit: a verdict on every option's then followed by the next prompt (steps-audit.md)
  3. safety and fidelity: each final scenario beside its single-step source (steps-final-safety.md)

  steps_final.py make <gameId> <dir> <batch> <source> [--ids-from f]   write the three reviewers' inputs into <dir>
  steps_final.py check <gameId> <dir> <batch> [--ids-from f]           collect every finding into <dir>/findings.json and
                                                                        print them; exit 1 when any review is incomplete
  steps_final.py snapshot <dir> <batch>                                 keep <dir>/batch-before.ndjson (once) before a fix
  steps_final.py next <gameId> <dir> <batch> <source> <nextdir>        list the scenarios a fix changed since the
                                                                        snapshot in <dir>/changed.txt and, if any, make
                                                                        <nextdir> for them

A review row that is missing, or an audit with the wrong number of verdicts, is a coverage problem, never a pass.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import blind_review as B  # noqa: E402
import common as C  # noqa: E402
import steps_audit as A  # noqa: E402

SEVERITIES = ("block", "note")
LENSES = ("safety", "fidelity", "facts", "choice", "voice")


def rows(path):
    return [json.loads(line) for line in open(path, encoding="utf8") if line.strip()] if os.path.exists(path) else []


def read_ids(path):
    return set(B.read_ids(path)) if path else None


def fidelity_row(final, source):
    s = {k: source[k] for k in ("hook", "setup", "options", "yourLine", "debrief", "relearn") if k in source}
    f = {"hook": final["hook"], **({"setup": final["setup"]} if final.get("setup") else {}),
         "steps": [{"step": k + 1, "prompt": st["prompt"], "why": st["why"],
                    "options": [{"text": x["text"], "then": x["then"], **({"best": True} if x.get("best") else {})} for x in st["options"]]}
                   for k, st in enumerate(final["steps"])],
         **({"debrief": final["debrief"]} if final.get("debrief") else {}), "relearn": final.get("relearn")}
    return {"id": final["id"], "type": final["type"], "cat": final["cat"], "persona": final.get("persona"), "source": s, "final": f}


def make(gid, d, batch, source, only=None, game_path=None):
    os.makedirs(d, exist_ok=True)
    stories = [o for o in rows(batch) if C.is_story(o) and (only is None or o["id"] in only)]
    ids = {o["id"] for o in stories}
    B.make(gid, d, [batch], only=ids, game_path=game_path)
    A.make(d, batch, only=ids)
    src = {o["id"]: o for o in rows(source)}
    with open(os.path.join(d, "fidelity.ndjson"), "w", encoding="utf8") as f:
        for o in stories:
            f.write(json.dumps(fidelity_row(o, src.get(o["id"], {})), ensure_ascii=False) + "\n")
    return len(stories)


def check(gid, d, batch, only=None, game_path=None):
    ids = {o["id"] for o in rows(batch) if C.is_story(o) and (only is None or o["id"] in only)}
    out = {"disagreements": [], "breaks": [], "notes": [], "safety": [], "coverage": []}
    if not os.path.exists(os.path.join(d, "review-story.ndjson")):
        out["coverage"].append("blind picks: review-story.ndjson missing")
    else:
        found, missing = B.diff(gid, d, [batch], only=ids, game_path=game_path)
        out["disagreements"] = [f"{i}: {detail}" for _, i, detail in found]
        out["coverage"] += [f"blind picks: {i} not reviewed" for i in missing]
    if not os.path.exists(os.path.join(d, "review-audit.ndjson")):
        out["coverage"].append("audit: review-audit.ndjson missing")
    else:
        problems, breaks, notes = A.check(d, batch, only=ids)
        out["coverage"] += [f"audit: {p}" for p in problems]
        out["breaks"] = [f"{i} step {t['into_step']} after \"{t['picked']}\": {v}" for i, t, v in breaks]
        out["notes"] = [f"{i}: {n}" for i, n in notes]
    safety = {r.get("id"): r for r in rows(os.path.join(d, "review-safety.ndjson"))}
    if not os.path.exists(os.path.join(d, "review-safety.ndjson")):
        out["coverage"].append("safety: review-safety.ndjson missing")
    else:
        out["coverage"] += [f"safety: {i} not reviewed" for i in sorted(ids - set(safety))]
        for i in sorted(ids & set(safety)):
            for x in safety[i].get("findings") or []:
                sev = x.get("severity") if x.get("severity") in SEVERITIES else "block"
                out["safety"].append(f"{i} [{sev}, {x.get('lens', '?')}] {x.get('field', '?')}: {x.get('problem', '')}")
    blocking = (len(out["disagreements"]) + len(out["breaks"]) + sum(1 for s in out["safety"] if "[block," in s)
                + sum(1 for n in out["notes"] if ": safety:" in n))
    out["summary"] = {"scenarios": len(ids), "blocking": blocking, "disagreements": len(out["disagreements"]),
                      "breaks": len(out["breaks"]), "notes": len(out["notes"]), "safety_findings": len(out["safety"]),
                      "coverage_problems": len(out["coverage"])}
    json.dump(out, open(os.path.join(d, "findings.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
    return out


def changed_ids(before, batch):
    old = {o["id"]: o for o in rows(before)}
    return [o["id"] for o in rows(batch) if old.get(o["id"]) != o]


def main():
    a = sys.argv[1:]
    only = None
    if "--ids-from" in a:
        k = a.index("--ids-from")
        only = read_ids(a[k + 1])
        a = a[:k] + a[k + 2:]
    if a[:1] == ["make"] and len(a) == 5:
        print(f"✓ {make(a[1], a[2], a[3], a[4], only)} scenarios ready for review in {a[2]}")
    elif a[:1] == ["check"] and len(a) == 4:
        out = check(a[1], a[2], a[3], only)
        for k in ("disagreements", "breaks", "safety", "notes", "coverage"):
            for line in out[k]:
                print(f"  {k[:-1] if k.endswith('s') else k}: {line}")
        s = out["summary"]
        print(f"{'✗' if s['coverage_problems'] else '✓'} {s['scenarios']} scenarios: {s['blocking']} blocking "
              f"({s['disagreements']} disagreements, {s['breaks']} breaks, safety and fidelity {s['safety_findings']}), "
              f"{s['notes']} audit notes, {s['coverage_problems']} coverage problems")
        sys.exit(1 if s["coverage_problems"] else 0)
    elif a[:1] == ["snapshot"] and len(a) == 3:
        dst = os.path.join(a[1], "batch-before.ndjson")
        os.makedirs(a[1], exist_ok=True)
        if not os.path.exists(dst):
            open(dst, "w", encoding="utf8").write(open(a[2], encoding="utf8").read())
        print(f"✓ snapshot {dst}")
    elif a[:1] == ["next"] and len(a) == 6:
        _, gid, d, batch, source, nxt = a
        ids = changed_ids(os.path.join(d, "batch-before.ndjson"), batch)
        open(os.path.join(d, "changed.txt"), "w", encoding="utf8").write("".join(i + "\n" for i in ids))
        if ids:
            make(gid, nxt, batch, source, set(ids))
        print(f"changed: {len(ids)}" + (f" (next review in {nxt})" if ids else ""))
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
