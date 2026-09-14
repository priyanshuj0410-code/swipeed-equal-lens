#!/usr/bin/env python3
"""content_gate.py: the content gate every commit and every build runs (SWED-72).

Before this, every gate was opt-in: hooks needed core.hooksPath set by hand, Vercel ran a plain `next build`,
and the commit-time length guard missed scenario helplines, most fields and empty banks (forge pipeline review,
G2, G4, G5, G6, G18). This runs the deterministic checks over the whole bank in a few seconds, so `npm run build`
(and therefore every Vercel preview and production deploy) fails on:

  lesson games   parse errors · a bank under MIN_BANK · duplicate ids · every per-scenario check in
                 forge/common.py (required fields, strict shapes, helplines on every visible field, ≤160 per
                 field, the chapter band ceiling, band-mechanic membership with the library's lead mechanics)
                 · the mechanic-mix caps · config strings (greet, reassure, helpLine, helpLabel, badge blurb)
                 · for games on scripts/forge/lint_clean.json, zero content lints (scripts/forge/lints.py)
  capstones      ≤160 and helplines on every string in the config
  help sheet     helplines in every string of src/content/help.ts

Ids are unique per game, not across games (the audit found shared prefixes across games are legitimate, A16).

Run from anywhere:  python3 scripts/content_gate.py      Exits 1 on any failure.
"""
import glob
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "forge"))
import common as C  # noqa: E402
import lints as L  # noqa: E402

MIN_BANK = 300            # every lesson bank holds 396+; far fewer means a truncated or emptied file
MAX_MECH_SHARE = 0.35     # the same caps forge_check.py enforces at merge
EASY_VERBS = {"reflect", "role-play"}
MAX_EASY_SHARE = 0.42
CONFIG_FIELDS = ["greet", "reassure", "helpLine", "helpLabel"]
# capstone keys that hold structure, not words
CAPSTONE_STRUCTURAL = {"id", "type", "from", "node", "glyph", "thread", "mode", "valence", "outcome", "gameId"}
HELP_TS = os.path.join(C.REPO, "src", "content", "help.ts")
STRATEGY = os.path.join(C.REPO, "Strategy")
TS_STRING = re.compile(r'(\w+):\s*"((?:[^"\\]|\\.)*)"')
KEYED_STRING = re.compile(r'"?(\w+)"?\s*:\s*"((?:[^"\\]|\\.)*)"')
STRING_ARRAY = re.compile(r'"?(\w+)"?\s*:\s*\[((?:\s*"(?:[^"\\]|\\.)*"\s*,?\s*)+)\]')


def decode(body):
    try:
        return json.loads('"' + body + '"')
    except ValueError:
        return body


def lead_mechanics():
    """Library gameId -> leadMechanics, from the committed scenario libraries (the same source forge_plan uses)."""
    out = {}
    for p in glob.glob(os.path.join(STRATEGY, "*Scenario Library.json")):
        d = json.load(open(p, encoding="utf8"))
        if d.get("gameId"):
            out[d["gameId"]] = d.get("leadMechanics") or []
    return out


def check_lesson(path, leads, lint=False):
    base = os.path.basename(path)
    errs = []
    scns, perr = C.parse_file(path)
    errs += [f"line {n}: {reason}" for n, reason in perr]
    if len(scns) < MIN_BANK:
        errs.append(f"bank has {len(scns)} scenarios, under the {MIN_BANK} floor")
    dupes = [i for i, c in Counter(o["id"] for o in scns).items() if c > 1]
    if dupes:
        errs.append(f"duplicate ids: {dupes[:5]}")
    chapter = C.chapter_of(path)
    if chapter is None:
        errs.append("no chapter: the game's gameId is not on the path (src/content/path.ts)")
    lead = leads.get(base[:-3]) or leads.get(C.file_gameid(path)) or []
    allowed = C.allowed_mechanics(chapter, lead)
    ceil = C.BAND_CEIL.get(chapter)
    for o in scns:
        for e in C.scenario_errors(o, chapter, allowed, ceil, strict_shape=True):
            errs.append(f"{o['id']}: {e}")
        if lint:
            errs += [f"{o['id']}: lint {e}" for e in L.content_lints(o)]
    n = len(scns)
    mix = Counter(o["type"] for o in scns)
    for t, c in mix.items():
        if n and c / n > MAX_MECH_SHARE:
            errs.append(f"mix: '{t}' is {c}/{n} ({100 * c / n:.0f}%), over {int(MAX_MECH_SHARE * 100)}%")
    easy = sum(mix[t] for t in EASY_VERBS)
    if n and easy / n > MAX_EASY_SHARE:
        errs.append(f"mix: reflect and role-play are {easy}/{n} ({100 * easy / n:.0f}%), over {int(MAX_EASY_SHARE * 100)}%")
    text = open(path, encoding="utf8").read()
    for field in CONFIG_FIELDS + ["blurb"]:
        m = re.search(field + r':\s*"((?:[^"\\]|\\.)*)"', text)
        if not m:
            continue
        val = decode(m.group(1))
        if len(val) > C.FIELD_MAX:
            errs.append(f"config {field}: {len(val)} chars, over {C.FIELD_MAX}")
        errs += [f"config {e}" for e in C.helpline_errors_text(field, val)]
    return len(scns), errs


def check_capstone(path):
    """Capstone configs are TypeScript object literals (one JSON line per lap in capstones 1-4, pretty-printed in
    5-8), so read their strings by pattern rather than parsing: every keyed string and every string in an array.
    TypeScript itself (next build) rejects a malformed file."""
    errs = []
    text = re.sub(r"^\s*//.*$", "", open(path, encoding="utf8").read(), flags=re.M)
    strings = [(m.group(1), decode(m.group(2))) for m in KEYED_STRING.finditer(text)]
    for m in STRING_ARRAY.finditer(text):
        strings += [(m.group(1), decode(s)) for s in re.findall(r'"((?:[^"\\]|\\.)*)"', m.group(2))]
    for key, s in strings:
        if key not in CAPSTONE_STRUCTURAL and len(s) > C.FIELD_MAX:
            errs.append(f"{key}: {len(s)} chars, over {C.FIELD_MAX}: '{s[:40]}...'")
        errs += C.helpline_errors_text(key, s)
    return errs


def check_help_sheet(path=HELP_TS):
    text = open(path, encoding="utf8").read()
    errs = []
    for m in TS_STRING.finditer(text):
        errs += C.helpline_errors_text(m.group(1), decode(m.group(2)))
    return errs


def main():
    leads = lead_mechanics()
    clean = set(L.clean_games())
    failures, lessons, scenarios, capstones = {}, 0, 0, 0
    for path in sorted(glob.glob(os.path.join(C.GAMES, "*.ts"))):
        base = os.path.basename(path)
        if base.endswith("-schema.ts"):
            continue
        if base.startswith("capstone-"):
            errs = check_capstone(path)
            capstones += 1
        else:
            n, errs = check_lesson(path, leads, lint=base[:-3] in clean)
            lessons += 1
            scenarios += n
        if errs:
            failures[base] = errs
    help_errs = check_help_sheet()
    if help_errs:
        failures["src/content/help.ts"] = help_errs

    if failures:
        total = sum(len(v) for v in failures.values())
        print(f"✗ content gate: {total} problem(s) in {len(failures)} file(s)")
        for f, errs in failures.items():
            print(f"  {f}")
            for e in errs[:12]:
                print(f"    {e}")
            if len(errs) > 12:
                print(f"    … {len(errs) - 12} more")
        sys.exit(1)
    print(f"✓ content gate: {lessons} lesson games ({scenarios} scenarios, {len(clean)} held lint-clean), {capstones} capstones and the help sheet pass")


if __name__ == "__main__":
    main()
