#!/usr/bin/env python3
"""forge_plan.py — S0 planner: the per-game resumable contract the generator + gates run against.

Emits .forge/<gameId>/plan.json: band-aware mechanic allowlist, per-(category × mechanic) generation quota
sized toward the 400 target (quality-first: a target, not an inviolable floor), the legacy-reshape worklist
(existing sorts/spots/matches to upgrade to 6 / 5-2 / 5), band ceiling, persona roster, intended_count, and
the existing-id/fingerprint set so generation avoids collisions.

Usage: python3 scripts/forge/forge_plan.py <gameId> [--write]
"""
import json, os, sys, glob, math, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C

TARGET = 400
VARIETY_FLOOR = 8  # each allowed variety mechanic gets >= this per category (deep enough for fresh 6-beat sessions)
STRATEGY = os.path.join(C.REPO, "Strategy")


def library_index():
    """gameId -> scenario-library json path, by scanning Strategy/ (the library carries its own gameId)."""
    idx = {}
    for p in glob.glob(os.path.join(STRATEGY, "*Scenario Library.json")):
        try:
            d = json.load(open(p, encoding="utf8"))
            if d.get("gameId"):
                idx[d["gameId"]] = p
        except Exception:
            pass
    return idx


def plan(game_id, lib_idx, g2ch):
    path = os.path.join(C.GAMES, game_id + ".ts")
    if not os.path.exists(path):
        raise SystemExit(f"no game file: {game_id}")
    scns, errors = C.parse_file(path)
    if errors:
        raise SystemExit(f"parse errors in {game_id} (fix before planning): {errors[:3]}")
    chapter = g2ch.get(game_id)
    ceil = C.BAND_CEIL.get(chapter)

    lib = {}
    lib_path = lib_idx.get(game_id)
    if lib_path:
        try:
            lib = json.load(open(lib_path, encoding="utf8"))
        except Exception:
            lib = {}
    lead = lib.get("leadMechanics", []) or []
    allowed = C.allowed_mechanics(chapter, lead)

    # per-category current state
    cats = {}
    for o in scns:
        c = o.get("cat", "?")
        cats.setdefault(c, {"count": 0, "mix": {}, "ids": []})
        cats[c]["count"] += 1
        cats[c]["mix"][o["type"]] = cats[c]["mix"].get(o["type"], 0) + 1
        cats[c]["ids"].append(o["id"])
    ncats = len(cats) or 1
    per_cat_target = math.ceil(TARGET / ncats)

    quota = {}
    for c, info in sorted(cats.items()):
        cur, mix = info["count"], info["mix"]
        # target per type: scale this category's CURRENT emphasis up to its target, floor the allowed variety
        # mechanics, ZERO any mechanic disallowed for the band, then generate the difference.
        tmix = {}
        for t, n in mix.items():
            if t in allowed:
                tmix[t] = max(n, round(n / max(cur, 1) * per_cat_target))
        for m in allowed:
            # only floor a mechanic the game actually uses somewhere (don't invent spots for a no-spot game)
            if any(m in cats[cc]["mix"] for cc in cats):
                tmix[m] = max(tmix.get(m, 0), VARIETY_FLOOR)
        gen = {t: max(0, tmix[t] - mix.get(t, 0)) for t in tmix}
        quota[c] = {
            "current": cur, "target": per_cat_target,
            "current_mix": mix, "generate_by_type": {k: v for k, v in gen.items() if v},
        }

    # legacy reshape worklist: existing mechanics not at the upgraded shape
    reshape = {"sort": [], "spot": [], "match": []}
    for o in scns:
        t = o.get("type")
        if t == "sort" and len(o.get("items", [])) != C.SORT_ITEMS:
            reshape["sort"].append(o["id"])
        elif t == "spot" and (len(o.get("scene", [])) != C.SPOT_SCENE or sum(1 for s in o["scene"] if s.get("trick")) != C.SPOT_TRICKS):
            reshape["spot"].append(o["id"])
        elif t == "match" and len(o.get("pairs", [])) != C.MATCH_PAIRS:
            reshape["match"].append(o["id"])

    total_generate = sum(sum(q["generate_by_type"].values()) for q in quota.values())
    return {
        "gameId": game_id, "chapter": chapter, "band_ceiling": ceil,
        "ages": lib.get("ages"), "thread": lib.get("thread"),
        "leadMechanics": lead, "allowed_mechanics": sorted(allowed),
        "disallowed_for_band": sorted(C.ALL_MECHANICS - allowed),
        "current_total": len(scns), "target_total": TARGET,
        "intended_count": len(scns) + total_generate, "to_generate": total_generate,
        "per_category_target": per_cat_target, "ncats": ncats,
        "categories": quota,
        "reshape_legacy": reshape,
        "library_path": lib_path, "library_categories": lib.get("categories"),
        "existing_ids": [o["id"] for o in scns],
        "id_prefix": (scns[0]["id"].rsplit("-", 1)[0] if scns else game_id),
    }


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    if not args:
        raise SystemExit("usage: forge_plan.py <gameId> [--write]")
    gid = args[0]
    p = plan(gid, library_index(), C.game_to_chapter())
    if "--write" in sys.argv:
        d = os.path.join(C.REPO, ".forge", gid)
        os.makedirs(d, exist_ok=True)
        out = os.path.join(d, "plan.json")
        open(out, "w", encoding="utf8").write(json.dumps(p, ensure_ascii=False, indent=2) + "\n")
        print(f"✓ wrote {out}")
    print(f"{gid} (Ch.{p['chapter']}) cur {p['current_total']} -> intended {p['intended_count']} "
          f"(generate {p['to_generate']}) | ceil {p['band_ceiling']} | allowed {p['allowed_mechanics']} "
          f"| disallow-for-band {p['disallowed_for_band']}")
    print(f"  reshape: sort {len(p['reshape_legacy']['sort'])} | spot {len(p['reshape_legacy']['spot'])} | match {len(p['reshape_legacy']['match'])}")
    for c, q in p["categories"].items():
        print(f"    {c:<22} {q['current']:>3} -> {q['target']:<3}   gen {q['generate_by_type']}")


if __name__ == "__main__":
    main()
