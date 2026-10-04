#!/usr/bin/env python3
"""forge_check.py: the deterministic validator, used in two modes (one code path, no rubber-stamp):

  --batch <file.ndjson> --game <gid>   per-batch lint during generation: validate each candidate line
                                       (parse, id safety against the shipped bank and the plan's id blocks,
                                       strict shape, helpline binding, <=160, band, band-mechanic membership,
                                       claim-sniffer). Every non-empty line must be a scenario. Prints
                                       ACCEPT/REJECT + reasons per line.
  --game <gid>                         the BLOCKING merge gate over the committed <gid>.json: parse-or-die,
                                       every per-scenario check (strict shapes), unique ids, mechanic-mix +
                                       share caps, and count vs the planned target (quality-first: a logged
                                       exhaustion at .forge/<gid>/exhaustion.json permits a dip).

Exits non-zero on any HARD failure so it can gate a commit. Truth is recomputed from the file: never an
agent's self-report.
"""
import json, os, sys, glob
from collections import Counter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C
import lints as L

TARGET = 400
MAX_MECH_SHARE = 0.35          # no single mechanic > 35% of a game's bank
EASY_VERBS = {"reflect", "role-play"}
MAX_EASY_SHARE = 0.42          # growth must come from harder verbs, not reflect/role-play padding


def personas_from_plan(plan):
    if not plan:
        return None
    cats = plan.get("library_categories")
    roster = set()
    if isinstance(cats, list):
        for c in cats:
            for s in (c.get("scenarios") or []) if isinstance(c, dict) else []:
                if isinstance(s, dict) and s.get("persona"):
                    roster.add(s["persona"])
    return roster or None


def check_batch(batch_file, gid, plan=None, game_path=None):
    plan = plan or C.load_plan(gid)
    if not plan:
        raise SystemExit(f"no plan for {gid}: run forge_plan.py {gid} --write first")
    allowed = set(plan["allowed_mechanics"])
    ceil = plan.get("band_ceiling")
    chapter = plan.get("chapter")
    shipped = {o["id"]: o for o in C.parse_file(game_path or C.game_path(gid))[0]}
    reshapes, seen = C.reshape_ids(plan), set()
    bad = 0
    for n, raw in enumerate(open(batch_file, encoding="utf8"), 1):
        raw = raw.strip().rstrip(",")
        if not raw:
            continue
        if not C.is_scenario_line(raw):
            print(f"  L{n} REJECT  not a scenario line: {raw[:60]!r}"); bad += 1; continue
        try:
            o = json.loads(raw)
        except Exception as e:
            print(f"  L{n} REJECT  unparseable: {e}"); bad += 1; continue
        errs = C.regrowth_id_errors(o, shipped, reshapes, plan, seen)
        errs += C.scenario_errors(o, chapter, allowed, ceil, strict_shape=True)
        errs += L.content_lints(o)
        claims = C.claim_flags(o)
        needs_ev = claims or o.get("needsFact")
        if needs_ev and not o.get("_evidence"):
            errs.append(f"evidence: claim {claims or 'flagged'} has no _evidence row")
        if errs:
            bad += 1
            print(f"  {o.get('id','L'+str(n))} REJECT  " + " · ".join(errs[:4]))
        else:
            tag = "  (needs-fact)" if needs_ev else ""
            print(f"  {o.get('id','L'+str(n))} ACCEPT{tag}")
    print(f"\nbatch: {bad} rejected")
    return bad == 0


def check_game(gid):
    path = C.game_path(gid)
    if not os.path.exists(path):
        raise SystemExit(f"no game file: {gid}")
    plan = C.load_plan(gid)
    chapter = (plan or {}).get("chapter") or C.chapter_of(gid)
    ceil = (plan or {}).get("band_ceiling", C.BAND_CEIL.get(chapter))
    allowed = set(plan["allowed_mechanics"]) if plan else C.allowed_mechanics(chapter, [])
    personas = personas_from_plan(plan)

    scns, perr = C.parse_file(path)
    hard = []
    for n, reason in perr:
        hard.append(f"PARSE {gid}:{n} {reason}")

    ids = [o["id"] for o in scns]
    dupe = [i for i, c in Counter(ids).items() if c > 1]
    if dupe:
        hard.append(f"duplicate ids: {dupe[:5]}")

    per_scn = 0
    for o in scns:
        errs = C.scenario_errors(o, chapter, allowed, ceil, strict_shape=True, personas=personas)
        if errs:
            per_scn += 1
            if per_scn <= 25:
                hard.append(f"{o['id']}: " + " · ".join(errs[:3]))

    # mechanic mix
    n = len(scns)
    mix = Counter(o["type"] for o in scns)
    mix_warn = []
    for t, c in mix.items():
        if n and c / n > MAX_MECH_SHARE:
            mix_warn.append(f"mechanic '{t}' is {c}/{n} ({100*c/n:.0f}%) > {int(MAX_MECH_SHARE*100)}%")
    easy = sum(mix[t] for t in EASY_VERBS)
    if n and easy / n > MAX_EASY_SHARE:
        mix_warn.append(f"reflect+role-play {easy}/{n} ({100*easy/n:.0f}%) > {int(MAX_EASY_SHARE*100)}%")

    # count vs target (quality-first: exhaustion log permits a dip)
    exhausted = os.path.exists(os.path.join(C.REPO, ".forge", gid, "exhaustion.json"))
    count_fail = (n < TARGET) and not exhausted

    print(f"■ forge_check {gid} (Ch.{chapter}): {n} scenarios, ceil {ceil}")
    print(f"  parse errors: {len(perr)} | per-scenario failures: {per_scn} | dup ids: {len(dupe)}")
    if mix_warn:
        print("  MIX:")
        for w in mix_warn:
            print(f"    ⚠ {w}")
    if count_fail:
        print(f"  COUNT: {n} < {TARGET} and no .forge/{gid}/exhaustion.json, below target")
    if hard or mix_warn or count_fail:
        print("\n  ✗ FAIL:")
        for h in hard[:30]:
            print(f"    {h}")
        if per_scn > 25:
            print(f"    … +{per_scn-25} more per-scenario failures")
        sys.exit(1)
    print("  ✓ PASS: all shapes/helplines/lengths/band/membership/mix/count clean")


def main():
    if "--batch" in sys.argv:
        bf = sys.argv[sys.argv.index("--batch") + 1]
        gid = sys.argv[sys.argv.index("--game") + 1]
        sys.exit(0 if check_batch(bf, gid) else 1)
    if "--game" in sys.argv:
        check_game(sys.argv[sys.argv.index("--game") + 1])
        return
    raise SystemExit("usage: forge_check.py --game <gid>  |  --batch <file> --game <gid>")


if __name__ == "__main__":
    main()
