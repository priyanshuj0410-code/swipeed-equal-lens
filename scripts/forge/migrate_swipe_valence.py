#!/usr/bin/env python3
"""Add declared leftValence/rightValence to every swipe scenario.

BYTE-SAFE BY CONSTRUCTION. Key order is not uniform across the bank (some lines start {"id",...} and
others {"type",...}), so a json.loads -> json.dumps round-trip would reorder keys and re-escape strings
on all 201 lines: burying a changed `answer` in the diff. Instead we splice two keys in textually at a
single anchor and prove the edit was additive by stripping them again and comparing bytes.

  --apply    write the change
  --verify   strip the two keys from the current files and assert the result is byte-identical to HEAD
"""
import json, os, re, subprocess, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
GAMES = os.path.join(ROOT, "src", "content", "games")
MAP = json.load(open(os.path.join(HERE, "swipe_valence_map.json"), encoding="utf8"))
VALID = {"pos", "neg", "tell", "uhoh", "neutral"}

ANCHOR = re.compile(r'("answer":"(?:left|right)")')
STRIP = re.compile(r',"leftValence":"[a-z]+","rightValence":"[a-z]+"')


def sides(line):
    l = re.search(r'"left":"((?:[^"\\]|\\.)*)"', line)
    r = re.search(r'"right":"((?:[^"\\]|\\.)*)"', line)
    return (json.loads('"' + l.group(1) + '"'), json.loads('"' + r.group(1) + '"')) if l and r else (None, None)


def apply():
    changed = total = skipped = 0
    missing = []
    for path in sorted(glob.glob(os.path.join(GAMES, "*.ts"))):
        out, dirty = [], False
        for line in open(path, encoding="utf8").read().split("\n"):
            if '"type":"swipe"' not in line or '"leftValence"' in line:
                out.append(line); continue
            # CapSwipeLap ({type:"swipe"; frame; cue; up; celebrate}) shares the type name but has no
            # left/right/answer: a different shape, correctly out of scope. Skip explicitly and count it,
            # so a genuinely malformed v2 swipe can never hide in the same bucket.
            lv, rv = sides(line)
            if lv is None and '"answer"' not in line:
                skipped += 1; out.append(line); continue
            total += 1
            key = f"{lv}|{rv}"
            if key not in MAP:
                missing.append((os.path.basename(path), key)); out.append(line); continue
            a, b = MAP[key]
            if a not in VALID or b not in VALID:
                missing.append((os.path.basename(path), f"{key} -> bad valence {a}/{b}")); out.append(line); continue
            new, n = ANCHOR.subn(lambda m: f'{m.group(1)},"leftValence":"{a}","rightValence":"{b}"', line, count=1)
            if n != 1:
                missing.append((os.path.basename(path), f"{key} -> anchor not found")); out.append(line); continue
            out.append(new); dirty = True; changed += 1
        if dirty:
            open(path, "w", encoding="utf8").write("\n".join(out))
    if missing:
        print(f"✗ REFUSING: {len(missing)} unmapped/invalid swipe pair(s). Add them to swipe_valence_map.json:")
        for f, k in missing[:20]:
            print(f"    {f}: {k}")
        sys.exit(1)
    print(f"✓ {changed}/{total} swipe scenarios given a declared side valence"
          f" ({skipped} capstone swipe-lap lines skipped: different type)")


def verify():
    """Strip the added keys and compare against HEAD: proves the edit added nothing but those two keys."""
    bad = 0
    for path in sorted(glob.glob(os.path.join(GAMES, "*.ts"))):
        # schema files are hand-edited alongside the migration; only the CONTENT banks are asserted
        # byte-reducible, since they are the files this script rewrites.
        if os.path.basename(path) in ("v2-schema.ts", "capstone-schema.ts"):
            continue
        rel = os.path.relpath(path, ROOT)
        try:
            head = subprocess.run(["git", "show", f"HEAD:{rel}"], cwd=ROOT, capture_output=True, check=True).stdout.decode("utf8")
        except subprocess.CalledProcessError:
            continue
        now = open(path, encoding="utf8").read()
        if STRIP.sub("", now) != head:
            print(f"    ✗ {rel}: stripping the added keys does NOT reproduce HEAD")
            bad += 1
    if bad:
        print(f"✗ {bad} file(s) changed beyond the two added keys: an answer key may have moved."); sys.exit(1)
    print("✓ inverse-splice byte identity: every file reduces exactly to HEAD; no answer key moved")


if __name__ == "__main__":
    if "--verify" in sys.argv: verify()
    elif "--apply" in sys.argv: apply()
    else: print(__doc__); sys.exit(2)
