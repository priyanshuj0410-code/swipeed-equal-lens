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

VALID_CHOOSE = {
    "id": "t-003", "cat": "c", "type": "choose", "persona": "any", "source": "s",
    "relearn": "Respect shows in small, steady choices.", "hook": "Your new partner is getting to know you.",
    "prompt": "Which of these show respect? Tap all that fit.",
    "options": [
        {"text": "Asks before sharing your photo", "fits": True, "note": "Asking first treats your image as yours."},
        {"text": "Listens when you disagree", "fits": True, "note": "Hearing a different view is respect."},
        {"text": "Makes plans with your friends too", "fits": True, "note": "Your friendships matter to them."},
        {"text": "Reads your messages to feel close", "fits": False, "note": "Closeness never needs your private messages."},
        {"text": "Decides what you wear on dates", "fits": False, "note": "Your clothes are your choice."},
        {"text": "Sulks until you cancel plans", "fits": False, "note": "Sulking to change your plans is pressure."},
    ],
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
    ("choose missing prompt",
     {**VALID_CHOOSE, "prompt": ""}),
    ("reflect missing affirm/options",
     {"id": "x", "cat": "c", "type": "reflect", "persona": "any", "source": "s", "relearn": "r", "hook": "h", "prompt": "p"}),
]

def main():
    fails = 0
    # valid scenarios must produce NO required-field errors
    for o in (VALID_SORT, VALID_STRIKE, VALID_CHOOSE):
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
    fails += choose_fixtures()
    fails += content_gate_fixtures()
    fails += regrowth_fixtures()
    if fails:
        print(f"\n✗ {fails} gate test(s) failed"); sys.exit(1)
    print("\n✓ all gate fixtures pass — missing-Base-field content is rejected")


def choose_fixtures():
    """choose (SWED-69): six options, two to four that fit, a note on every option, no option that only agrees or
    repeats the question, no duplicates."""
    import copy
    fails = 0
    if C.shape_errors(VALID_CHOOSE):
        fails += 1; print(f"  ✗ valid choose wrongly flagged: {C.shape_errors(VALID_CHOOSE)}")
    else:
        print("  ✓ valid choose passes its shape check")

    def variant(mutate):
        o = copy.deepcopy(VALID_CHOOSE); mutate(o); return o

    def set_opt(i, **kw):
        return lambda o: o["options"][i].update(kw)

    cases = [
        ("five options", lambda o: o["options"].pop(), "need 6"),
        ("one option that fits", lambda o: [op.update(fits=False) for op in o["options"][1:3]], "that fit=1"),
        ("five options that fit", lambda o: [op.update(fits=True) for op in o["options"][3:5]], "that fit=5"),
        ("an option without a note", set_opt(4, note=""), "missing note"),
        ("a fits flag that is not boolean", set_opt(0, fits="yes"), "fits not boolean"),
        ("an option that only says Yes", set_opt(5, text="Yes"), "only agrees"),
        ("an option that repeats the question", set_opt(5, text="Which of these show respect? Tap all that fit."), "repeats the question"),
        ("two options with the same text", set_opt(5, text="Listens when you disagree"), "duplicate option texts"),
    ]
    for name, mutate, needle in cases:
        errs = C.shape_errors(variant(mutate))
        if any(needle in e for e in errs):
            print(f"  ✓ choose check caught: {name}")
        else:
            fails += 1; print(f"  ✗ choose check MISSED: {name} → {errs}")
    notes_ok = all(op["note"] in C.must_be_true_texts(VALID_CHOOSE) for op in VALID_CHOOSE["options"])
    wrong_text_ok = VALID_CHOOSE["options"][3]["text"] not in C.must_be_true_texts(VALID_CHOOSE)
    if notes_ok and wrong_text_ok:
        print("  ✓ choose notes and fitting options are fact-checked; wrong options are not")
    else:
        fails += 1; print("  ✗ choose must-be-true fields wrong")
    return fails


def regrowth_fixtures():
    """A regrowth batch can add scenarios in its category's id block and reshape worklist ids, and nothing else
    (SWED-73): the batch gate and assembly must refuse overwrites, type or category changes, out-of-block and
    repeated ids, and non-scenario lines, and a failed assembly must leave the game file untouched."""
    import io, json, shutil, tempfile
    from contextlib import redirect_stdout
    import forge_assemble as A
    import forge_check as FC

    fails = 0
    tmp = tempfile.mkdtemp()
    game = os.path.join(tmp, "t.ts")
    batch = os.path.join(tmp, "batch.ndjson")
    shipped = [dict(VALID_SORT, id="t-001"), dict(VALID_STRIKE, id="t-002")]
    body = ("import type { Scenario } from \"./v2-schema\";\n\nconst SCENARIOS: Scenario[] = [\n"
            + "".join("  " + json.dumps(o) + ",\n" for o in shipped) + "];\n\nexport const T = { scenarios: SCENARIOS };\n")
    plan = {"allowed_mechanics": sorted(C.ALL_MECHANICS), "band_ceiling": None, "chapter": 9, "id_prefix": "t",
            "id_blocks": {"c": [100, 199]}, "reshape_legacy": {"sort": ["t-001"], "spot": [], "match": []}}
    new_sort = dict(VALID_SORT, id="t-150")

    def run(name, lines, expect_ok, fail_round_trip=False):
        nonlocal fails
        open(game, "w", encoding="utf8").write(body)
        open(batch, "w", encoding="utf8").write("\n".join(l if isinstance(l, str) else json.dumps(l) for l in lines) + "\n")
        real_parse = A.C.parse_file
        if fail_round_trip:
            A.C.parse_file = lambda p: ([], [(1, "simulated parse failure")]) if p.endswith(".assemble-tmp") else real_parse(p)
        with redirect_stdout(io.StringIO()):
            gate_ok = FC.check_batch(batch, "t", plan=plan, game_path=game)
            try:
                A.assemble("t", batch, True, ts=game, plan=plan)
                assembled = True
            except SystemExit:
                assembled = False
        A.C.parse_file = real_parse
        untouched = open(game, encoding="utf8").read() == body
        no_temp = not os.path.exists(game + ".assemble-tmp")
        if fail_round_trip:
            ok = not assembled and untouched and no_temp
        elif expect_ok:
            ok = gate_ok and assembled and not untouched and no_temp
        else:
            ok = not gate_ok and not assembled and untouched
        if ok:
            print(f"  ✓ regrowth safety right on: {name}")
        else:
            fails += 1
            print(f"  ✗ regrowth safety wrong on: {name} (gate {gate_ok}, assembled {assembled}, untouched {untouched})")

    run("a new scenario in its category's block", [new_sort], True)
    run("a reshape on the worklist that keeps its type and category", [dict(VALID_SORT, id="t-001", hook="Sort these six.")], True)
    run("a shipped id that is not on the reshape worklist", [dict(VALID_STRIKE, id="t-002", hook="Overwritten.")], False)
    run("a reshape that changes the mechanic", [dict(VALID_STRIKE, id="t-001")], False)
    run("a reshape that moves category", [dict(VALID_SORT, id="t-001", cat="other")], False)
    run("a new id outside the block", [dict(VALID_SORT, id="t-250")], False)
    run("the same new id twice", [new_sort, dict(new_sort, hook="Another.")], False)
    run("a line that is not a scenario", [new_sort, "this is not json"], False)
    run("a merge whose round trip fails leaves the game untouched", [new_sort], False, fail_round_trip=True)
    shutil.rmtree(tmp)
    return fails


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
