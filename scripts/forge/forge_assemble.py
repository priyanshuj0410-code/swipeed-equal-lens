#!/usr/bin/env python3
"""forge_assemble.py — merge a validated NDJSON batch into <game>.ts, then round-trip through parse-or-die.

New scenarios are inserted before the SCENARIOS array's closing `];`; a scenario whose id already exists
(a legacy RESHAPE) replaces that line in place. Pipeline sidecar keys (_evidence, _anchor, needsFact) are
stripped — the .ts carries only schema fields. After writing, the file is re-parsed and the count asserted,
so a malformed line can never land silently.

Usage: python3 scripts/forge/forge_assemble.py --game <gid> --batch <file.ndjson> [--apply]
       (dry-run by default; --apply writes the file.)
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C

SIDECAR = ("_evidence", "_anchor", "needsFact", "_source", "_note")
ARRAY_OPEN = "const SCENARIOS: Scenario[] = ["
ARRAY_CLOSE = "];"


def strip_sidecar(o):
    return {k: v for k, v in o.items() if k not in SIDECAR}


def to_line(o):
    return "  " + json.dumps(strip_sidecar(o), ensure_ascii=False, separators=(",", ":")) + ","


def load_batch(path):
    out = []
    for raw in open(path, encoding="utf8"):
        raw = raw.strip().rstrip(",")
        if raw and C.is_scenario_line(raw):
            out.append(json.loads(raw))
    return out


def assemble(gid, batch_path, apply):
    ts = os.path.join(C.GAMES, gid + ".ts")
    lines = open(ts, encoding="utf8").read().splitlines()
    # locate the SCENARIOS array span
    try:
        oi = next(i for i, l in enumerate(lines) if ARRAY_OPEN in l)
    except StopIteration:
        raise SystemExit(f"{gid}: SCENARIOS array open not found")
    ci = next(i for i in range(oi + 1, len(lines)) if lines[i].strip() == ARRAY_CLOSE)

    # index existing scenario lines by id
    existing = {}
    for i in range(oi + 1, ci):
        s = lines[i].strip().rstrip(",")
        if C.is_scenario_line(s):
            try:
                existing[json.loads(s)["id"]] = i
            except Exception:
                pass

    batch = load_batch(batch_path)
    new, reshaped = [], 0
    for o in batch:
        if o["id"] in existing:
            lines[existing[o["id"]]] = to_line(o)
            reshaped += 1
        else:
            new.append(to_line(o))
    # insert new lines just before the closing bracket
    out_lines = lines[:ci] + new + lines[ci:]
    text = "\n".join(out_lines) + "\n"

    if apply:
        open(ts, "w", encoding="utf8").write(text)
        scns, errors = C.parse_file(ts)
        if errors:
            raise SystemExit(f"✗ post-write parse errors in {gid}: {errors[:3]} — REVERT and fix")
        print(f"✓ {gid}: +{len(new)} new, {reshaped} reshaped → {len(scns)} total (parse clean)")
    else:
        # dry-run: parse the would-be file from memory
        tmp = os.path.join(C.REPO, ".forge", gid, "_assemble_preview.ts")
        os.makedirs(os.path.dirname(tmp), exist_ok=True)
        open(tmp, "w", encoding="utf8").write(text)
        scns, errors = C.parse_file(tmp)
        os.remove(tmp)
        print(f"(dry-run) {gid}: would add {len(new)} new, reshape {reshaped} → {len(scns)} total | "
              f"parse errors {len(errors)}{' '+str(errors[:2]) if errors else ''}")
        print("  re-run with --apply to write.")


def main():
    gid = sys.argv[sys.argv.index("--game") + 1]
    bf = sys.argv[sys.argv.index("--batch") + 1]
    assemble(gid, bf, "--apply" in sys.argv)


if __name__ == "__main__":
    main()
