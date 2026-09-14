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
    if fails:
        print(f"\n✗ {fails} gate test(s) failed"); sys.exit(1)
    print("\n✓ all gate fixtures pass — missing-Base-field content is rejected")


if __name__ == "__main__":
    main()
