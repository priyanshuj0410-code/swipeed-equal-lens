#!/usr/bin/env python3
"""test_gates.py: fixtures proving the forge gate catches malformed content (esp. missing Base fields).

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

VALID_REFLECT = {
    "id": "t-003", "cat": "c", "type": "reflect", "persona": "any", "source": "s",
    "relearn": "Every feeling is allowed.", "hook": "A new school year starts tomorrow.",
    "prompt": "How do you feel about it?", "options": ["Excited", "Nervous", "A bit of both"],
    "affirm": "Whatever you feel, it makes sense.",
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
    fails += lint_fixtures()
    fails += content_gate_fixtures()
    fails += regrowth_fixtures()
    fails += blind_review_fixtures()
    fails += no_dashes_fixtures()
    fails += story_fixtures()
    if fails:
        print(f"\n✗ {fails} gate test(s) failed"); sys.exit(1)
    print("\n✓ all gate fixtures pass: missing-Base-field content is rejected")


def lint_fixtures():
    """Content lints (SWED-77): each rule fires on its problem and stays quiet on the clean version, and the content
    gate enforces them for a game on the clean list."""
    import copy, shutil, tempfile
    import lints as L
    fails = 0
    reflect = {"id": "t-010", "cat": "c", "type": "reflect", "persona": "any", "source": "s", "relearn": "Choices are yours.",
               "hook": "Your timeline is your own.", "prompt": "What feels true for you?", "options": ["Slow is fine", "I'm ready"], "affirm": "That's yours to decide."}
    match = {"id": "t-011", "cat": "c", "type": "match", "persona": "any", "source": "s", "relearn": "r", "hook": "Match each worry to a steady truth.",
             "pairs": [{"left": "Conflict means we're failing", "right": "Disagreeing well builds trust"},
                       {"left": "A small hurt is festering", "right": "Name it early and gently"}]}
    sort = {**copy.deepcopy(VALID_SORT), "bins": [{"id": "p", "label": "Builds trust", "valence": "pos"}, {"id": "n", "label": "Breaks it", "valence": "neg"}],
            "items": [{"id": a, "text": t} for a, t in zip("abcdef", ["Keeping promises", "Snooping", "Owning mistakes", "Hiding debts", "Listening", "Mocking"])]}
    strike = copy.deepcopy(VALID_STRIKE)

    def check(name, o, needle, expect):
        nonlocal fails
        hit = any(f.startswith(needle) for f in L.content_lints(o))
        if hit == expect:
            print(f"  ✓ lint right on: {name}")
        else:
            fails += 1; print(f"  ✗ lint wrong on: {name} → {L.content_lints(o)}")

    def mod(o, **kw):
        x = copy.deepcopy(o); x.update(kw); return x

    check("a clean reflect", reflect, "", False)
    check("an em dash in a hook", mod(reflect, hook="Your timeline \u2014 your call."), "dash", True)
    check("a Lensy: prefix", mod(reflect, hook="Lensy: your timeline is your own."), "narrator", True)
    check("the persona's name as a prefix", mod(reflect, persona="Sneha", hook="Sneha: relatives keep asking."), "narrator", True)
    check("the persona's name inside a sentence", mod(reflect, persona="Sneha", hook="Sneha's relatives keep asking."), "narrator", False)
    check("two questions", mod(reflect, hook="Is your timeline your own?"), "two-questions", True)
    check("a clipped tag question", mod(reflect, hook="Your timeline is your own. Useful shift?"), "clipped-tag", True)
    check("reflect follow-up questions", mod(reflect, ask="What makes that one feel right?", deeper="What might a friend pick, and why?"), "", False)
    check("a follow-up that is not a question", mod(reflect, ask="Tell Lensy more."), "follow-up", True)
    check("a follow-up that asks two questions", mod(reflect, deeper="Why? What else?"), "follow-up", True)
    check("a follow-up that invites a disclosure", mod(reflect, ask="Has this ever happened to you?"), "disclosure", True)
    check("a match without shared words", match, "match-giveaway", False)
    check("a match pair that shares a word", mod(match, pairs=[{"left": "Conflict means we're failing", "right": "Conflict is normal"}]), "match-giveaway", True)
    check("a sort without giveaways", sort, "sort-giveaway", False)
    giveaway = copy.deepcopy(sort); giveaway["items"][3]["text"] = "Breaking a promise"; giveaway["key"]["d"] = "n"
    check("a sort item that shares its zone's word", giveaway, "sort-giveaway", True)
    check("a truth that stands alone", strike, "myth-context", False)
    check("a truth that opens with 'They'", mod(strike, myth={"un": "m", "re": "They may feel lonely.", "why": "w"}), "myth-context", True)
    check("a truth that opens with the idiom 'It's okay'", mod(strike, myth={"un": "m", "re": "It's okay to feel sad.", "why": "w"}), "myth-context", False)

    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    import content_gate as G
    tmp = tempfile.mkdtemp()
    path = os.path.join(tmp, "choosing-building.ts")
    shutil.copy(os.path.join(C.GAMES, "choosing-building.ts"), path)
    clean = not any(" lint " in e for e in G.check_lesson(path, G.lead_mechanics(), lint=True)[1])
    text = open(path, encoding="utf8").read()
    open(path, "w", encoding="utf8").write(text.replace('"hook":"', '"hook":"Lensy: ', 1))
    quiet = not any(" lint " in e for e in G.check_lesson(path, G.lead_mechanics(), lint=False)[1])
    loud = any(" lint " in e for e in G.check_lesson(path, G.lead_mechanics(), lint=True)[1])
    shutil.rmtree(tmp)
    if clean and quiet and loud:
        print("  ✓ content gate applies the lints only to games on the clean list")
    else:
        fails += 1; print(f"  ✗ content gate lint switch wrong (clean game {clean}, quiet {quiet}, loud {loud})")
    return fails


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
    repeated ids, and non-scenario lines, and a failed assembly must leave the game file untouched. The one allowed
    type change is a listed reflect becoming a choose (SWED-69)."""
    import io, json, shutil, tempfile
    from contextlib import redirect_stdout
    import forge_assemble as A
    import forge_check as FC

    fails = 0
    tmp = tempfile.mkdtemp()
    game = os.path.join(tmp, "t.ts")
    batch = os.path.join(tmp, "batch.ndjson")
    shipped = [dict(VALID_SORT, id="t-001"), dict(VALID_STRIKE, id="t-002"), dict(VALID_REFLECT, id="t-003"), dict(VALID_REFLECT, id="t-004")]
    body = ("import type { Scenario } from \"./v2-schema\";\n\nconst SCENARIOS: Scenario[] = [\n"
            + "".join("  " + json.dumps(o) + ",\n" for o in shipped) + "];\n\nexport const T = { scenarios: SCENARIOS };\n")
    plan = {"allowed_mechanics": sorted(C.ALL_MECHANICS), "band_ceiling": None, "chapter": 9, "id_prefix": "t",
            "id_blocks": {"c": [100, 199]}, "reshape_legacy": {"sort": ["t-001"], "spot": [], "match": [], "lint": ["t-004"]},
            "convert": {"reflect:choose": ["t-003"]}}
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
    run("a reflect on the convert list becoming a choose", [dict(VALID_CHOOSE, id="t-003")], True)
    run("a reflect on the lint worklist but not the convert list becoming a choose", [dict(VALID_CHOOSE, id="t-004")], False)
    run("a reflect on the convert list becoming a sort", [dict(VALID_SORT, id="t-003")], False)
    run("a conversion that moves category", [dict(VALID_CHOOSE, id="t-003", cat="other")], False)
    run("a new id outside the block", [dict(VALID_SORT, id="t-250")], False)
    run("the same new id twice", [new_sort, dict(new_sort, hook="Another.")], False)
    run("a line that is not a scenario", [new_sort, "this is not json"], False)
    run("a merge whose round trip fails leaves the game untouched", [new_sort], False, fail_round_trip=True)
    shutil.rmtree(tmp)
    return fails


def blind_review_fixtures():
    """The blind review tool (blind_review.py) hides every answer, reports no disagreement for a reviewer who matches
    the keys, and reports each choose, match and sort the reviewer answered differently."""
    import json, shutil, tempfile
    import blind_review as B

    fails = 0
    tmp = tempfile.mkdtemp()
    game = os.path.join(tmp, "t.ts")
    match = {"id": "t-004", "cat": "c", "type": "match", "persona": "any", "source": "s", "relearn": "r", "hook": "Match them.",
             "pairs": [{"left": f"left {i}", "right": f"right {i}"} for i in range(5)]}
    shipped = [dict(VALID_CHOOSE), match, dict(VALID_SORT)]
    open(game, "w", encoding="utf8").write("import type { Scenario } from \"./v2-schema\";\n\nconst SCENARIOS: Scenario[] = [\n"
                                           + "".join("  " + json.dumps(o) + ",\n" for o in shipped) + "];\n")

    def result(name, ok):
        nonlocal fails
        if ok:
            print(f"  ✓ blind review right on: {name}")
        else:
            fails += 1; print(f"  ✗ blind review wrong on: {name}")

    B.make("t", tmp, [], game_path=game, seed=1)
    blind = "".join(open(os.path.join(tmp, f"blind-{k}.ndjson"), encoding="utf8").read() for k in ("choose", "match", "sort"))
    result("blind files carry no answers", '"fits"' not in blind and '"key"' not in blind and '"note"' not in blind and "right 0" in blind)

    def write(choose_fits, pairs, key):
        rows = {"choose": {"id": "t-003", "fits": choose_fits}, "match": {"id": "t-004", "pairs": pairs}, "sort": {"id": "t-001", "key": key}}
        for k, row in rows.items():
            open(os.path.join(tmp, f"review-{k}.ndjson"), "w", encoding="utf8").write(json.dumps(row) + "\n")

    fits = [x["text"] for x in VALID_CHOOSE["options"] if x["fits"]]
    labels = {b["id"]: b["label"] for b in VALID_SORT["bins"]}
    key = {it["text"]: labels[VALID_SORT["key"][it["id"]]] for it in VALID_SORT["items"]}
    write(fits, match["pairs"], key)
    found, missing = B.diff("t", tmp, [], game_path=game)
    result("a reviewer who matches every key", not found and not missing)
    swapped = [dict(p) for p in match["pairs"]]
    swapped[0]["right"], swapped[1]["right"] = swapped[1]["right"], swapped[0]["right"]
    write(fits[:-1], swapped, dict(key, **{VALID_SORT["items"][0]["text"]: "Bad"}))
    found, _ = B.diff("t", tmp, [], game_path=game)
    result("a missed fit, a swapped pair and a misplaced item", sorted(k for k, _, _ in found) == ["choose", "match", "sort"])
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


VALID_STORY = {"id": "t-020", "cat": "c", "type": "branch", "persona": "any", "source": "s", "relearn": "Standing with someone helps.",
               "hook": "Kabir's classmates laugh at his lunch.", "debrief": "Checking in and naming it both help.",
               "steps": [{"prompt": f"Moment {k + 1}. What do you do?", "why": f"Reason {k + 1}.",
                          "options": [{"text": f"Choice {k + 1}{c}", "then": f"What happens after {k + 1}{c}.", **({"best": True} if c == "b" else {})}
                                      for c in "abcd"]} for k in range(3)]}


def story_fixtures():
    """Multi-step branch and role-play (SWED-96): 3 to 5 steps, 4 or 5 options with exactly one best, a then on every
    option and a why on every step, never both steps and the legacy field, the band ceiling per step; the single-step
    and then-verdict lints; and the blind review of each step's best option."""
    import copy, json, shutil, tempfile
    import lints as L
    import blind_review as B
    fails = 0

    def result(name, ok, detail=""):
        nonlocal fails
        if ok:
            print(f"  ✓ story check right on: {name}")
        else:
            fails += 1; print(f"  ✗ story check wrong on: {name} {detail}")

    def variant(mutate):
        o = copy.deepcopy(VALID_STORY); mutate(o); return o

    role = variant(lambda o: o.update(type="role-play", setup="Kabir sits down beside you.", id="t-021"))
    del role["debrief"]
    for name, o in (("a valid multi-step branch", VALID_STORY), ("a valid multi-step role-play", role)):
        errs = C.scenario_errors(o, 1, None, C.BAND_CEIL[1])
        result(name, not errs, errs)
    cases = [
        ("two steps", lambda o: o["steps"].pop(), "steps=2"),
        ("six steps", lambda o: o["steps"].extend(copy.deepcopy(o["steps"][:3])), "steps=6"),
        ("three options in a step", lambda o: o["steps"][1]["options"].pop(0), "options=3"),
        ("six options in a step", lambda o: o["steps"][1]["options"].extend(copy.deepcopy(o["steps"][0]["options"][:2])), "options=6"),
        ("no best option in a step", lambda o: o["steps"][2]["options"][1].pop("best"), "best count=0"),
        ("two best options in a step", lambda o: o["steps"][2]["options"][0].update(best=True), "best count=2"),
        ("an option without a then", lambda o: o["steps"][0]["options"][3].update(then=""), "missing then"),
        ("a step without a why", lambda o: o["steps"][0].pop("why"), "missing why"),
        ("two options with the same text", lambda o: o["steps"][0]["options"][3].update(text="Choice 1a"), "duplicate option texts"),
        ("steps and legacy options together", lambda o: o.update(options=[{"text": "a", "consequence": "c", "best": True}]), "has both"),
        ("a step over the Chapter 1 band ceiling", lambda o: [op.update(text=f"{op['text']} " + "x" * 90) for op in o["steps"][1]["options"]], "step[1] prose"),
    ]
    for name, mutate, needle in cases:
        errs = C.scenario_errors(variant(mutate), 1, None, C.BAND_CEIL[1])
        result(f"caught {name}", any(needle in e for e in errs), errs)
    legacy = {"id": "t-022", "cat": "c", "type": "branch", "persona": "any", "source": "s", "relearn": "r", "hook": "h", "debrief": "d",
              "options": [{"text": "a", "consequence": "c", "best": True}, {"text": "b", "consequence": "d"}]}
    result("a legacy branch still passes its shape check", not C.shape_errors(legacy))
    result("the single-step lint fires on a legacy branch", any(f.startswith("single-step") for f in L.content_lints(legacy)))
    result("no lint on a clean multi-step branch", not L.content_lints(VALID_STORY), L.content_lints(VALID_STORY))
    for name, prompt in (("no question", "Moment 2."), ("two questions", "Moment 2? What now?")):
        asks = json.loads(json.dumps(VALID_STORY))
        asks["steps"][1]["prompt"] = prompt
        result(f"the step-questions lint fires on a branch prompt with {name}", any(f.startswith("step-questions") for f in L.content_lints(asks)))
    verdict = variant(lambda o: o["steps"][0]["options"][1].update(then="Good choice. Kabir smiles."))
    result("the then-verdict lint fires on a graded then", any(f.startswith("then-verdict") for f in L.content_lints(verdict)))
    long_best = variant(lambda o: [st["options"][1].update(text=st["options"][1]["text"] + " and a long reason") for st in o["steps"][:2]])
    result("the best-longest lint fires when the best is clearly longest in most steps", any(f.startswith("best-longest") for f in L.content_lints(long_best)))
    one_long = variant(lambda o: o["steps"][0]["options"][1].update(text="Choice 1b and a long reason"))
    result("no best-longest lint for one long best option", not any(f.startswith("best-longest") for f in L.content_lints(one_long)))
    truths = C.must_be_true_texts(VALID_STORY)
    result("best options and reasons are fact-checked, other options are not", "Choice 1b" in truths and "Reason 2." in truths and "Choice 1a" not in truths)

    tmp = tempfile.mkdtemp()
    game = os.path.join(tmp, "t.ts")
    open(game, "w", encoding="utf8").write("import type { Scenario } from \"./v2-schema\";\n\nconst SCENARIOS: Scenario[] = [\n  " + json.dumps(VALID_STORY) + ",\n];\n")
    B.make("t", tmp, [], game_path=game, seed=1)
    blind = open(os.path.join(tmp, "blind-story.ndjson"), encoding="utf8").read()
    result("the blind story row hides best and then", '"best"' not in blind and '"then"' not in blind and "Choice 2c" in blind)
    best = [next(x["text"] for x in st["options"] if x.get("best")) for st in VALID_STORY["steps"]]
    open(os.path.join(tmp, "review-story.ndjson"), "w", encoding="utf8").write(json.dumps({"id": "t-020", "best": best}) + "\n")
    found, missing = B.diff("t", tmp, [], game_path=game)
    result("a reviewer who picks every best option", not found and not missing, found)
    open(os.path.join(tmp, "review-story.ndjson"), "w", encoding="utf8").write(json.dumps({"id": "t-020", "best": [best[0], "Choice 2a", best[2]]}) + "\n")
    found, _ = B.diff("t", tmp, [], game_path=game)
    result("a reviewer who picks a different option in one step", len(found) == 1 and "Choice 2a" in found[0][2], found)
    cont = [json.loads(l) for l in open(os.path.join(tmp, "continuity.ndjson"), encoding="utf8") if l.strip()]
    result("the continuity row shows every then and hides best", len(cont) == 1 and all("then" in x for st in cont[0]["steps"] for x in st["options"])
           and '"best"' not in json.dumps(cont))
    sub = os.path.join(tmp, "only")
    counts = B.make("t", sub, [], game_path=game, seed=1, only={"t-999"})
    found, missing = B.diff("t", sub, [], game_path=game, only={"t-999"})
    result("a make limited to other ids writes no story and reports nothing missing", counts["story"] == 0 and not found and not missing, (counts, missing))
    shutil.rmtree(tmp)
    return fails


def no_dashes_fixtures():
    """The dash gate (scripts/no_dashes.py, SWED-92) must flag an em dash and an en dash in any text file, pass a
    hyphenated range and a clean line, and skip files that are not text."""
    import tempfile
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    import no_dashes as D

    fails = 0
    tmp = tempfile.mkdtemp()
    cases = (("an em dash in copy", "copy.ts", 'hook: "Your timeline \u2014 your call."', True),
             ("an en dash in a range", "doc.md", "Ages 3\u20136", True),
             ("a hyphenated range", "range.md", "Ages 3-6, then 6-9.", False),
             ("a clean sentence", "clean.tsx", "Your timeline is your call.", False),
             ("a dash in a file that is not text", "art.png", "\u2014", False))
    for name, fname, body, want in cases:
        path = os.path.join(tmp, fname)
        open(path, "w", encoding="utf8").write(body)
        got = bool(D.find([path])) if D.scannable(fname) else False
        if got == want:
            print(f"  ✓ dash gate right on: {name}")
        else:
            fails += 1
            print(f"  ✗ dash gate wrong on: {name}")
    return fails


if __name__ == "__main__":
    main()
