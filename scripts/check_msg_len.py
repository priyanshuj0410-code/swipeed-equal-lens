#!/usr/bin/env python3
"""Message-length guard — keeps SwipeEd copy readable AND keeps per-scenario text from drifting.

Two rules, both enforced at commit time (wired into scripts/githooks/pre-commit):

  RULE 1 — per-field cap (readability): every player-visible string the engine renders as one
           bubble/pill/card is ≤ 160 real code points (emoji & curly quotes count as one). The
           strike-rewrite `re` and `why` render as SEPARATE lines (un-re.tsx), so they count
           separately, never combined.

  RULE 2 — per-scenario band budget (anti-drift): a single scenario's TOTAL narratable prose must
           stay under its CHAPTER BAND's ceiling. Content legitimately gets denser with reader age,
           so the ceiling RISES by band — but it is bounded, so no one scenario can become a wall and
           the per-chapter average can't drift past today's intentional curve.

Run from the repo root:
    python3 scripts/check_msg_len.py            # all lesson games + capstones
Exits non-zero on any violation so it can gate a build / pre-commit. Override (rare, deliberate):
    SWIPEED_MSGLEN_OVERRIDE=1 git commit ...
"""
import glob, json, os, re, sys

FIELD_MAX = 160
# per-scenario prose ceiling by chapter band (rises with reader age; bounded to stop drift)
BAND_CEIL = {1: 360, 2: 360, 3: 400, 4: 400, 5: 460, 6: 460, 7: 500, 8: 500}

HERE = os.path.dirname(os.path.abspath(__file__))
GAMES = os.path.join(HERE, "..", "src", "content", "games")
PATH_TS = os.path.join(HERE, "..", "src", "content", "path.ts")

CONFIG_FIELDS = ["greet", "reassure", "helpLine", "helpLabel"]
SC_PLAIN = ["hook", "relearn", "affirm", "debrief", "why", "setup", "prompt"]
# keys that are NOT narrated prose (ids/answers/structure) — excluded from the per-scenario total.
# MUST stay identical to forge/common.py's NON_PROSE so the forge gate and this guard never disagree.
NON_PROSE = {"id", "cat", "type", "key", "persona", "source", "mode", "valence", "outcome"}


def _dec(body):
    try:
        return json.loads('"' + body + '"')
    except Exception:
        return body


def _game_to_chapter():
    """game-id -> chapter number (1..8), parsed from the generated path.ts."""
    m = {}
    if not os.path.exists(PATH_TS):
        return m
    for line in open(PATH_TS, encoding="utf8"):
        gm = re.search(r'game:\s*"([^"]+)"', line)
        ch = re.search(r'chapter:\s*"Ch\.(\d)', line)
        if gm and ch:
            m[gm.group(1)] = int(ch.group(1))
    return m


def _scn_prose_chars(o):
    def walk(v, k=None):
        if isinstance(v, str):
            return len(v) if k not in NON_PROSE else 0
        if isinstance(v, dict):
            return sum(walk(vv, kk) for kk, vv in v.items())
        if isinstance(v, list):
            return sum(walk(it, k) for it in v)
        return 0
    return sum(walk(vv, kk) for kk, vv in o.items())


def _field_violations(o):
    """RULE 1: per-field >160. Returns list of (label, len)."""
    bad = []
    fid = o.get("id", "")
    for k in SC_PLAIN:
        if isinstance(o.get(k), str) and len(o[k]) > FIELD_MAX:
            bad.append((f"{fid}.{k}", len(o[k])))
    if isinstance(o.get("myth"), dict):
        for mk in ("un", "re", "why"):
            v = o["myth"].get(mk, "")
            if isinstance(v, str) and len(v) > FIELD_MAX:
                bad.append((f"{fid}.myth.{mk}", len(v)))
    for opt in o.get("options", []) if isinstance(o.get("options"), list) else []:
        if isinstance(opt, dict):
            for ok in ("text", "consequence"):
                if isinstance(opt.get(ok), str) and len(opt[ok]) > FIELD_MAX:
                    bad.append((f"{fid}.option.{ok}", len(opt[ok])))
    for yl in o.get("yourLine", []) if isinstance(o.get("yourLine"), list) else []:
        if isinstance(yl, dict) and isinstance(yl.get("text"), str) and len(yl["text"]) > FIELD_MAX:
            bad.append((f"{fid}.yourLine", len(yl["text"])))
    return bad


def main():
    g2ch = _game_to_chapter()
    field_bad, scn_bad = [], []
    for path in sorted(glob.glob(os.path.join(GAMES, "*.ts"))):
        base = os.path.basename(path)
        if base.endswith("v2-schema.ts") or base.endswith("capstone-schema.ts"):
            continue
        t = open(path, encoding="utf8").read()
        is_capstone = base.startswith("capstone-")
        # Rule 2 (per-scenario band ceiling) applies to LESSON games only — capstones are a ceremonial
        # surface and get Rule 1 (≤160/field) alone.
        ceil = None if is_capstone else BAND_CEIL.get(g2ch.get(base[:-3]), None)
        # config-level fields (RULE 1)
        for field in CONFIG_FIELDS:
            mm = re.search(field + r':\s*"((?:[^"\\]|\\.)*)"', t)
            if mm and len(_dec(mm.group(1))) > FIELD_MAX:
                field_bad.append((base, field, len(_dec(mm.group(1)))))
        mb = re.search(r'blurb:\s*"((?:[^"\\]|\\.)*)"', t)
        if mb and len(_dec(mb.group(1))) > FIELD_MAX:
            field_bad.append((base, "badge.blurb", len(_dec(mb.group(1)))))
        # scenario lines
        for line in t.splitlines():
            ls = line.strip().rstrip(",")
            if not (ls.startswith("{") and '"id":' in ls and '"type":' in ls):
                continue
            try:
                o = json.loads(ls)
            except Exception:
                continue
            for label, n in _field_violations(o):
                field_bad.append((base, label, n))
            if ceil is not None:  # RULE 2 (lesson games only)
                tot = _scn_prose_chars(o)
                if tot > ceil:
                    scn_bad.append((base, o.get("id", ""), tot, ceil))

    if field_bad:
        print(f"✗ RULE 1 — {len(field_bad)} field(s) over {FIELD_MAX} chars (a bubble can't hold it):")
        for b, f, n in field_bad[:40]:
            print(f"    {n:>4}  {b:<30} {f}")
    if scn_bad:
        print(f"✗ RULE 2 — {len(scn_bad)} scenario(s) over their chapter band ceiling (content drift):")
        for b, i, n, c in sorted(scn_bad, key=lambda x: -x[2])[:40]:
            print(f"    {n:>4} (ceil {c})  {b:<30} {i}")
    if field_bad or scn_bad:
        print("\n  Tighten the copy (cut redundancy/hedging — keep every helpline number and the meaning),")
        print("  or override once: SWIPEED_MSGLEN_OVERRIDE=1 git commit ...")
        sys.exit(1)
    print(f"✓ message-length guard: all fields ≤{FIELD_MAX}; all scenarios within their chapter band ceiling.")


if __name__ == "__main__":
    main()
