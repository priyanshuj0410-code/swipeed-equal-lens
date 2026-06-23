#!/usr/bin/env python3
"""Collect every narration string the v2 engine speaks, tagged by chapter, into a manifest the audio generator
renders (option C — pre-generated clips). Mirrors v2-engine.tsx's hookLine()/resolveLine() + the spoken nudges,
so a rendered clip matches exactly what speak() is asked to say. Lessons only (capstones added separately).

Usage:
  python3 scripts/collect-narration.py                 # all built lesson games
  python3 scripts/collect-narration.py --game feelings # one game (pilot)
  python3 scripts/collect-narration.py --chapter 1     # one chapter
Writes scripts/narration-manifest.json: [{ "chapter": "1"|"def", "text": "..." }] (raw; the generator cleans+hashes).
"""
import json, re, pathlib, sys, argparse
ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / "src" / "content" / "games"

# gameId -> chapter number, parsed from the canonical path table.
def game_chapters():
    t = (ROOT / "src" / "content" / "path.ts").read_text()
    m = {}
    for line in t.splitlines():
        g = re.search(r'game:\s*"([^"]+)"', line)
        c = re.search(r'chapter:\s*"Ch\.(\d+)', line)
        if g and c:
            m[g.group(1)] = c.group(1)
    return m

# static lines the engine speaks regardless of scenario (need a clip per chapter, since the voice differs).
STATIC_NUDGES = [
    "Look again — read the flag, then swipe it the right way.",
    "That's one way — now say the strong, brave line!",
    "Not there — try another bin.",
    "Not a match — try another.",
    "Hmm, which comes first?",
    "That one doesn't belong — try another.",
    "That one's okay. Which one is the tricky red flag?",
    "What shall we play?",
]

def load_scenarios(t):
    if "const SCENARIOS" not in t:
        return []
    blk = t[t.find("const SCENARIOS"):]
    body = blk[blk.find("[") + 1: blk.find("\n];")]
    out = []
    for ln in body.splitlines():
        ln = ln.strip().rstrip(",")
        if ln.startswith("{"):
            try: out.append(json.loads(ln))
            except Exception: pass
    return out

def hook_line(s):
    ty = s["type"]
    if ty == "reflect": return f'{s["hook"]} {s["prompt"]}'
    if ty == "role-play": return f'{s["hook"]} {s["setup"]}'
    if ty == "build": return f'{s["hook"]} {s["prompt"]}'
    if ty == "explore-label": return f'{s["hook"]} Find {s["find"]}.'
    return s["hook"]

def resolve_lines(s):
    """Every string the engine might speak on resolve (reflect echoes the picked option first)."""
    ty = s["type"]
    if ty == "reflect": return [f'{o}. {s["affirm"]}' for o in s.get("options", [])]
    if ty == "branch": return [s["debrief"]] + [o["consequence"] for o in s.get("options", [])]
    if ty == "strike-rewrite": return [f'{s["myth"]["re"]} {s["myth"]["why"]}']
    if ty == "explore-label": return [s["reveal"], f'Not quite — find {s["find"]}.']
    if ty == "spot": return [s["why"]]
    return [s["relearn"]]

def field(t, name):
    m = re.search(name + r':\s*"([^"]*)"', t)
    return m.group(1) if m else None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--game"); ap.add_argument("--chapter")
    a = ap.parse_args()
    chmap = game_chapters()
    seen = set(); rows = []
    def add(ch, text):
        text = (text or "").strip()
        if not text: return
        k = (ch, text)
        if k in seen: return
        seen.add(k); rows.append({"chapter": ch, "text": text})

    chapters_present = set()
    for f in sorted(CONTENT.glob("*.ts")):
        if f.stem in ("v2-schema", "capstone-schema") or f.stem.startswith("capstone-"): continue
        t = f.read_text()
        gid = field(t, "gameId")
        if not gid: continue
        ch = chmap.get(gid, "def")
        if a.game and gid != a.game: continue
        if a.chapter and ch != a.chapter: continue
        chapters_present.add(ch)
        for fld in ("greet",):
            v = field(t, fld); add(ch, v)
        add(ch, field(t, "blurb"))      # badge.blurb (done screen)
        add(ch, field(t, "helpLine"))   # spoken when the help button is tapped
        for s in load_scenarios(t):
            add(ch, hook_line(s))
            for r in resolve_lines(s): add(ch, r)

    for ch in sorted(chapters_present):
        for n in STATIC_NUDGES: add(ch, n)

    out = ROOT / "scripts" / "narration-manifest.json"
    out.write_text(json.dumps(rows, ensure_ascii=False, indent=0))
    print(f"collected {len(rows)} strings across chapters {sorted(chapters_present)} -> {out}")

if __name__ == "__main__":
    main()
