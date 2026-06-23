#!/usr/bin/env python3
"""Guard: every player-visible message / text block in a SwipeEd game must be <= MAX chars.

The v2 engine renders each of these as its own bubble or pill, so each is capped independently —
crucially the strike-rewrite `re` and `why` render as SEPARATE lines (see un-re.tsx / v2-engine
resolve), so they are checked separately, not combined. Run from the repo root:

    python3 scripts/check_msg_len.py            # check all lesson games
    python3 scripts/check_msg_len.py --fix-list # just print offenders

Exits non-zero if any string exceeds the cap, so it can gate a build / pre-commit.
"""
import glob, json, os, re, sys

MAX = 160
HERE = os.path.dirname(os.path.abspath(__file__))
GAMES = os.path.join(HERE, "..", "src", "content", "games")

# config-level string fields (per game) rendered as bubbles/pills/cards
CONFIG_FIELDS = ["greet", "reassure", "helpLine", "helpLabel"]
# scenario display fields; myth.re and myth.why are SEPARATE blocks (engine splits them)
SC_PLAIN = ["hook", "relearn", "affirm", "debrief", "why", "setup", "prompt"]

def _dec(body):
    # Decode a TS double-quoted string BODY to real characters (handles \" \\ \uXXXX; leaves literal UTF-8 —
    # emoji, curly quotes, en/em dashes — intact, so each counts as one code point, not several).
    try:
        return json.loads('"' + body + '"')
    except Exception:
        return body

def check_file(path):
    t = open(path, encoding="utf8").read()
    base = os.path.basename(path)
    bad = []
    for field in CONFIG_FIELDS:
        m = re.search(field + r':\s*"((?:[^"\\]|\\.)*)"', t)
        if m:
            s = _dec(m.group(1))
            if len(s) > MAX:
                bad.append((field, len(s), s[:70]))
    mb = re.search(r'blurb:\s*"((?:[^"\\]|\\.)*)"', t)
    if mb:
        s = _dec(mb.group(1))
        if len(s) > MAX:
            bad.append(("badge.blurb", len(s), s[:70]))
    for line in t.splitlines():
        ls = line.strip().rstrip(",")
        if ls.startswith("{") and '"id":' in ls and '"type":' in ls:
            try:
                o = json.loads(ls)
            except Exception:
                continue
            fid = o.get("id", "")
            for k in SC_PLAIN:
                if isinstance(o.get(k), str) and len(o[k]) > MAX:
                    bad.append((f"{fid}.{k}", len(o[k]), o[k][:70]))
            if isinstance(o.get("myth"), dict):
                for mk in ("un", "re", "why"):
                    v = o["myth"].get(mk, "")
                    if isinstance(v, str) and len(v) > MAX:
                        bad.append((f"{fid}.myth.{mk}", len(v), v[:70]))
            for opt in o.get("options", []) if isinstance(o.get("options"), list) else []:
                if isinstance(opt, dict):
                    for ok in ("text", "consequence"):
                        if isinstance(opt.get(ok), str) and len(opt[ok]) > MAX:
                            bad.append((f"{fid}.option.{ok}", len(opt[ok]), opt[ok][:70]))
            for yl in o.get("yourLine", []) if isinstance(o.get("yourLine"), list) else []:
                if isinstance(yl, dict) and isinstance(yl.get("text"), str) and len(yl["text"]) > MAX:
                    bad.append((f"{fid}.yourLine", len(yl["text"]), yl["text"][:70]))
    return base, bad

def main():
    total = 0
    for path in sorted(glob.glob(os.path.join(GAMES, "*.ts"))):
        if "capstone" in os.path.basename(path) or path.endswith("v2-schema.ts"):
            continue
        base, bad = check_file(path)
        for field, n, preview in bad:
            print(f"  OVER {n:>4}  {base:<28} {field}: {preview}...")
            total += 1
    if total:
        print(f"\n✗ {total} string(s) exceed {MAX} chars.")
        sys.exit(1)
    print(f"✓ all player-visible strings ≤ {MAX} chars.")

if __name__ == "__main__":
    main()
