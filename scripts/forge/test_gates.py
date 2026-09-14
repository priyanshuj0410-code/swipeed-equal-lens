#!/usr/bin/env python3
"""test_gates.py — fixtures proving the forge gate catches malformed content (esp. missing Base fields).

Run: python3 scripts/forge/test_gates.py   (exits non-zero if any assertion fails)
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C

VALID_SORT = {
    "id": "t-001", "cat": "c", "type": "sort", "persona": "any", "source": "s",
    "relearn": "Sorting helps you tell things apart.", "hook": "Sort each one.",
    "items": [{"id": a, "text": f"item {a}"} for a in "abcdef"],
    "bins": [{"id": "p", "label": "Good", "valence": "pos"}, {"id": "n", "label": "Bad", "valence": "neg"}],
    "key": {"a": "p", "b": "n", "c": "p", "d": "n", "e": "p", "f": "n"},
}
VALID_STRIKE = {
    "id": "t-002", "cat": "c", "type": "strike-rewrite", "persona": "any", "source": "s",
    "relearn": "Truth beats myth.", "hook": "\"A myth.\"",
    "myth": {"un": "A myth.", "re": "The truth.", "why": "Because reasons."},
}

FAILING = [
    ("match missing base fields (relearn/persona/source/hook)",
     {"id": "x", "cat": "c", "type": "match", "pairs": [{"left": f"l{i}", "right": f"r{i}"} for i in range(5)]}),
    ("branch missing relearn",
     {"id": "x", "cat": "c", "type": "branch", "persona": "any", "source": "s", "hook": "h",
      "options": [{"text": "a", "consequence": "c", "best": True}, {"text": "b", "consequence": "d"}], "debrief": "d"}),
    ("build missing hook",
     {"id": "x", "cat": "c", "type": "build", "persona": "any", "source": "s", "relearn": "r",
      "prompt": "p", "pieces": ["a", "b"], "mode": "assemble", "key": ["a"]}),
    ("sort missing persona",
     {**VALID_SORT, "persona": None}),
    ("strike-rewrite missing myth.why",
     {**VALID_STRIKE, "myth": {"un": "m", "re": "t", "why": ""}}),
    ("reflect missing affirm/options",
     {"id": "x", "cat": "c", "type": "reflect", "persona": "any", "source": "s", "relearn": "r", "hook": "h", "prompt": "p"}),
]

def main():
    fails = 0
    # valid scenarios must produce NO required-field errors
    for o in (VALID_SORT, VALID_STRIKE):
        errs = C.required_field_errors(o)
        if errs:
            fails += 1; print(f"  ✗ valid {o['type']} wrongly flagged: {errs}")
        else:
            print(f"  ✓ valid {o['type']} passes")
    # each malformed scenario MUST be caught
    for label, o in FAILING:
        errs = C.required_field_errors(o)
        if errs:
            print(f"  ✓ caught: {label} → {errs[0]}")
        else:
            fails += 1; print(f"  ✗ MISSED: {label} (gate passed malformed content!)")
    # a retired helpline is caught wherever it appears; a character named Kiran is not
    for txt, want in (("Call KIRAN 1800-599-0019 tonight.", True), ("Try 18005990019 any time.", True),
                      ("Tele-MANAS 14416 is free, any time.", False), ("Kiran from class says hi.", False)):
        got = any("retired helpline" in m for m in C.helpline_errors_text("t", txt))
        if got == want:
            print(f"  ✓ retired-helpline check right on {txt!r}")
        else:
            fails += 1; print(f"  ✗ retired-helpline check wrong on {txt!r}")
    fails += content_gate_fixtures()
    if fails:
        print(f"\n✗ {fails} gate test(s) failed"); sys.exit(1)
    print("\n✓ all gate fixtures pass — missing-Base-field content is rejected")


def content_gate_fixtures():
    """The build-time content gate (scripts/content_gate.py, SWED-72) must pass real content and fail each planted
    problem: a wrong helpline in scenario prose, an emptied bank, an over-length reflect option, a broken line, a
    wrong helpline in a capstone and on the help sheet."""
    import json, re, shutil, tempfile
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    import content_gate as G

    fails = 0
    tmp = tempfile.mkdtemp()
    leads = G.lead_mechanics()
    src = os.path.join(C.GAMES, "feelings-friends.ts")
    text = open(src, encoding="utf8").read()
    lines = text.splitlines()
    first = next(i for i, l in enumerate(lines) if C.is_scenario_line(l.strip().rstrip(",")))
    reflect = next(i for i, l in enumerate(lines) if '"type":"reflect"' in l)

    def with_line(i, mutate):
        o = json.loads(lines[i].strip().rstrip(","))
        mutate(o)
        out = list(lines)
        out[i] = "  " + json.dumps(o, ensure_ascii=False) + ","
        return "\n".join(out)

    def gate(name, body, expect_fail, needle):
        nonlocal fails
        path = os.path.join(tmp, "feelings-friends.ts")
        open(path, "w", encoding="utf8").write(body)
        _, errs = G.check_lesson(path, leads)
        passed = any(needle in e for e in errs) if expect_fail else not errs
        if passed:
            print(f"  ✓ content gate right on: {name}")
        else:
            fails += 1
            print(f"  ✗ content gate wrong on: {name} → {errs[:3]}")

    gate("the real Feelings Friends bank", text, False, "")
    gate("a wrong Childline number in a hook", with_line(first, lambda o: o.update(hook="Call Childline 112 if you need help.")), True, "Childline")
    gate("an emptied bank", "\n".join(l for l in lines if not C.is_scenario_line(l.strip().rstrip(","))), True, "floor")
    gate("a reflect option over 160 characters", with_line(reflect, lambda o: o["options"].__setitem__(0, "x" * 161)), True, "len:")
    broken = list(lines); broken[first] = broken[first].replace('"cat":', '"cat"', 1)
    gate("a broken scenario line", "\n".join(broken), True, "json.loads failed")

    cap = os.path.join(tmp, "capstone-1.ts")
    ctext = open(os.path.join(C.GAMES, "capstone-1.ts"), encoding="utf8").read()
    open(cap, "w", encoding="utf8").write(ctext)
    ok_cap = not G.check_capstone(cap)
    open(cap, "w", encoding="utf8").write(re.sub(r'"frame":"[^"]*"', '"frame":"Call Childline 100 any time."', ctext, count=1))
    bad_cap = any("Childline" in e for e in G.check_capstone(cap))
    help_path = os.path.join(tmp, "help.ts")
    htext = open(G.HELP_TS, encoding="utf8").read()
    open(help_path, "w", encoding="utf8").write(htext)
    ok_help = not G.check_help_sheet(help_path)
    open(help_path, "w", encoding="utf8").write(htext.replace("Call 1098", "Call 1099"))
    bad_help = bool(G.check_help_sheet(help_path))
    for name, ok in (("the real capstone 1", ok_cap), ("a wrong Childline number in a capstone lap", bad_cap),
                     ("the real help sheet", ok_help), ("a dialled number off the allowlist on the help sheet", bad_help)):
        if ok:
            print(f"  ✓ content gate right on: {name}")
        else:
            fails += 1
            print(f"  ✗ content gate wrong on: {name}")
    shutil.rmtree(tmp)
    return fails


if __name__ == "__main__":
    main()
