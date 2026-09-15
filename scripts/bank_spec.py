#!/usr/bin/env python3
"""Bank spec: per-game / per-category coverage + mechanic-shape audit, and the gap to the >=400 floor.

This is the content-growth pipeline's INPUT. For each game it reports what exists and exactly what must be
generated to reach the >=400/game floor with the UPGRADED mechanic shapes:
    sort  -> 6 items        (was 4)
    spot  -> 5 scene items, EXACTLY 2 trick:true ("3 truths + 2 lies")   (was 3 items / 1 trick)
    match -> 5 pairs        (was 3)
and a healthy per-sub-topic depth (>= TARGET/ncats per category so a 6-beat session stays fresh on replay).

It is REPORTING-only (no writes) and deterministic: it parses the live .ts banks the same way the engine
loads them (one JSON object per line). The generation step consumes its --json output per game.

Usage:
  python3 scripts/bank_spec.py                      # fleet summary table (all 69 games)
  python3 scripts/bank_spec.py <gameId|file.ts>     # one game, human detail
  python3 scripts/bank_spec.py <gameId|file.ts> --json   # one game, machine-readable spec for the generator
"""
import glob, json, os, re, sys, math
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
GAMES = os.path.join(HERE, "..", "src", "content", "games")
PATH_TS = os.path.join(HERE, "..", "src", "content", "path.ts")

TARGET = 400                       # the per-game floor the founder set
UPGRADED = {"sort": 6, "spot": 5, "match": 5}   # target option counts per mechanic
SPOT_TRICKS = 2                    # exactly 2 lies per 5-item spot scene
# mechanics we guarantee a minimum depth of per category (if the game uses them at all), for variety
VARIETY_MECHANICS = ["sort", "spot", "match", "branch", "role-play", "strike-rewrite", "reflect", "choose"]


def game_to_chapter():
    m = {}
    if os.path.exists(PATH_TS):
        for line in open(PATH_TS, encoding="utf8"):
            gm = re.search(r'game:\s*"([^"]+)"', line)
            ch = re.search(r'chapter:\s*"Ch\.(\d)', line)
            if gm and ch:
                m[gm.group(1)] = int(ch.group(1))
    return m


def scenarios_of(path):
    """Every scenario object in a game .ts (one JSON per line, as the engine loads them)."""
    out = []
    for line in open(path, encoding="utf8").read().splitlines():
        ls = line.strip().rstrip(",")
        if ls.startswith("{") and '"id":' in ls and '"type":' in ls:
            try:
                out.append(json.loads(ls))
            except Exception:
                pass
    return out


def shape_audit(scns):
    """How many of each mechanic are at the LEGACY vs UPGRADED option shape (what must be reshaped)."""
    a = {
        "sort": {"total": 0, "at_target": 0, "legacy": 0},
        "spot": {"total": 0, "at_target": 0, "legacy": 0, "bad_tricks": 0},
        "match": {"total": 0, "at_target": 0, "legacy": 0},
    }
    for o in scns:
        t = o.get("type")
        if t == "sort" and isinstance(o.get("items"), list):
            n = len(o["items"]); a["sort"]["total"] += 1
            a["sort"]["at_target" if n >= UPGRADED["sort"] else "legacy"] += 1
        elif t == "spot" and isinstance(o.get("scene"), list):
            n = len(o["scene"]); tr = sum(1 for s in o["scene"] if s.get("trick"))
            a["spot"]["total"] += 1
            a["spot"]["at_target" if (n >= UPGRADED["spot"] and tr == SPOT_TRICKS) else "legacy"] += 1
            if tr != SPOT_TRICKS:
                a["spot"]["bad_tricks"] += 1
        elif t == "match" and isinstance(o.get("pairs"), list):
            n = len(o["pairs"]); a["match"]["total"] += 1
            a["match"]["at_target" if n >= UPGRADED["match"] else "legacy"] += 1
    return a


def spec_for(path, g2ch):
    base = os.path.basename(path)
    gid = base[:-3]
    scns = scenarios_of(path)
    total = len(scns)
    bycat = defaultdict(list)
    for o in scns:
        bycat[o.get("cat", "?")].append(o)
    cats = sorted(bycat)
    ncats = len(cats) or 1
    per_cat_target = math.ceil(TARGET / ncats)
    type_mix = Counter(o.get("type") for o in scns)

    cat_specs = []
    for c in cats:
        cur = bycat[c]
        cmix = Counter(o.get("type") for o in cur)
        cur_n = len(cur)
        gap = max(0, per_cat_target - cur_n)
        # target per-type for this category: scale the category's CURRENT emphasis up to its target,
        # then floor the variety mechanics the game actually uses so each stays playable on rotation.
        target_mix = {}
        if cur_n:
            for t, n in cmix.items():
                target_mix[t] = max(n, round(n / cur_n * per_cat_target))
        for vm in VARIETY_MECHANICS:
            if type_mix.get(vm, 0) > 0:  # game uses this mechanic somewhere
                target_mix[vm] = max(target_mix.get(vm, 0), 8)  # >= ~8/category => deep enough for fresh 6-beat sessions
        need_mix = {t: max(0, target_mix.get(t, 0) - cmix.get(t, 0)) for t in target_mix}
        cat_specs.append({
            "cat": c, "current": cur_n, "target": per_cat_target, "gap": gap,
            "current_mix": dict(cmix), "need_by_type": {k: v for k, v in need_mix.items() if v},
        })

    return {
        "gameId": gid, "chapter": g2ch.get(gid), "total": total, "target": TARGET,
        "gap": max(0, TARGET - total), "ncats": ncats,
        "type_mix": dict(type_mix),
        "shape_audit": shape_audit(scns),
        "categories": cat_specs,
        "existing_ids": [o.get("id") for o in scns],
    }


def resolve(arg):
    if arg.endswith(".ts"):
        p = arg if os.path.isabs(arg) else os.path.join(GAMES, os.path.basename(arg))
    else:
        p = os.path.join(GAMES, arg + ".ts")
    return p if os.path.exists(p) else None


def main():
    g2ch = game_to_chapter()
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    as_json = "--json" in sys.argv

    if args:
        p = resolve(args[0])
        if not p:
            print(f"no such game: {args[0]}"); sys.exit(2)
        spec = spec_for(p, g2ch)
        if as_json:
            print(json.dumps(spec, ensure_ascii=False, indent=2)); return
        sa = spec["shape_audit"]
        print(f"■ {spec['gameId']}  (Ch.{spec['chapter']})   {spec['total']}/{TARGET}  gap {spec['gap']}   {spec['ncats']} categories")
        print(f"  type mix: {spec['type_mix']}")
        print(f"  shape audit: sort@6 {sa['sort']['at_target']}/{sa['sort']['total']} (legacy {sa['sort']['legacy']}) | "
              f"spot@5/2 {sa['spot']['at_target']}/{sa['spot']['total']} (legacy {sa['spot']['legacy']}, bad-tricks {sa['spot']['bad_tricks']}) | "
              f"match@5 {sa['match']['at_target']}/{sa['match']['total']} (legacy {sa['match']['legacy']})")
        print(f"  per-category target ~{math.ceil(TARGET / spec['ncats'])}:")
        for cs in spec["categories"]:
            print(f"    {cs['cat']:<22} {cs['current']:>3} -> {cs['target']:<3} (need {cs['gap']:>3})   {cs['need_by_type']}")
        return

    # fleet table
    rows = []
    for f in sorted(glob.glob(os.path.join(GAMES, "*.ts"))):
        b = os.path.basename(f)
        if b.startswith("capstone") or "schema" in b:
            continue
        rows.append(spec_for(f, g2ch))
    tot_gap = sum(r["gap"] for r in rows)
    leg_sort = sum(r["shape_audit"]["sort"]["legacy"] for r in rows)
    leg_spot = sum(r["shape_audit"]["spot"]["legacy"] for r in rows)
    leg_match = sum(r["shape_audit"]["match"]["legacy"] for r in rows)
    print(f"FLEET: {len(rows)} games | current {sum(r['total'] for r in rows):,} | floor {TARGET}/game | NEW scenarios needed: {tot_gap:,}")
    print(f"legacy shapes to reshape: sort(4->6): {leg_sort} | spot(3/1->5/2): {leg_spot} | match(3->5): {leg_match}")
    print(f"{'game':<26}{'Ch':>3}{'cur':>5}{'gap':>6}{'cats':>5}")
    for r in sorted(rows, key=lambda x: (x["chapter"] or 0, x["gameId"])):
        print(f"{r['gameId']:<26}{r['chapter'] or 0:>3}{r['total']:>5}{r['gap']:>6}{r['ncats']:>5}")


if __name__ == "__main__":
    main()
