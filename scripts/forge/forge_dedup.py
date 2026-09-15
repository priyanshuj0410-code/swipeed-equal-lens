#!/usr/bin/env python3
"""forge_dedup.py: whole-bank (all 69 games) duplicate detection, band-aware, helpline-masked.

Two signals, so a generator can't beat it by swapping nouns:
  STRUCTURAL: a per-mechanic signature over the answer-bearing structure (sort item-set+partition, match
               pair-set, spot scene-set+trick count, branch option-set, swipe cue+side, reflect option-set,
               role-play line-set). Identical structure with reskinned nouns = a twin.
  PROSE: 3-shingle Jaccard over normalized visible text (helpline strings + named services MASKED so
               their mandatory repetition across beats doesn't read as duplication).

INTRA-band near-dups BLOCK (same chapter = the same lesson twice). CROSS-band near-dups are LOGGED only
(re-teaching a concept at a new age is legitimate).

Usage:
  python3 scripts/forge/forge_dedup.py                 # report over the whole bank
  python3 scripts/forge/forge_dedup.py --game <gid>    # focus: collisions involving this game
  python3 scripts/forge/forge_dedup.py --verify --game <gid>   # exit 1 if <gid> has an intra-band collision
"""
import glob, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C

PROSE_JACCARD = 0.82


def struct_sig(o):
    t = o.get("type")
    def nz(s): return C.norm_text(s or "")
    if t == "sort":
        return ("sort", frozenset((nz(it.get("text")), o.get("key", {}).get(it.get("id"))) for it in o.get("items", [])))
    if t == "match":
        return ("match", frozenset((nz(p.get("left")), nz(p.get("right"))) for p in o.get("pairs", [])))
    if t == "spot":
        return ("spot", frozenset((nz(s.get("text")), bool(s.get("trick"))) for s in o.get("scene", [])))
    if C.is_story(o):
        return (t, tuple(frozenset(nz(op.get("text")) for op in st.get("options", [])) for st in o.get("steps", [])))
    if t == "branch":
        return ("branch", frozenset(nz(op.get("text")) for op in o.get("options", [])))
    if t == "swipe":
        return ("swipe", nz(o.get("cue")), o.get("answer"))
    if t == "reflect":
        return ("reflect", nz(o.get("prompt")), frozenset(nz(x) for x in o.get("options", [])))
    if t == "choose":
        return ("choose", nz(o.get("prompt")), frozenset((nz(op.get("text")), bool(op.get("fits"))) for op in o.get("options", [])))
    if t == "role-play":
        return ("role-play", frozenset(nz(l.get("text")) for l in o.get("yourLine", [])))
    if t == "strike-rewrite":
        m = o.get("myth", {}) or {}
        return ("strike", nz(m.get("un")))
    if t == "build":
        return ("build", frozenset(nz(p) for p in o.get("pieces", [])))
    if t == "explore-label":
        return ("explore", nz(o.get("find")), nz(o.get("answer")))
    # FAIL CLOSED. This used to `return (t,)`, giving every scenario of an unregistered mechanic the
    # SAME signature: so N genuinely-distinct scenarios collapse into N-choose-2 false STRUCT
    # collisions and the merge gate becomes un-passable for reasons that look nothing like the cause.
    raise ValueError(
        f"struct_sig: unhandled scenario type {t!r} (id={o.get('id')!r}). Add a signature for it: "
        f"it must capture what makes two scenarios of this mechanic structurally the same."
    )


def load_all():
    g2ch = C.game_to_chapter()
    recs = []
    for f in sorted(glob.glob(os.path.join(C.GAMES, "*.ts"))):
        b = os.path.basename(f)
        if b.startswith("capstone") or "schema" in b:
            continue
        gid = b[:-3]
        scns, _ = C.parse_file(f)
        for o in scns:
            recs.append({
                "gid": gid, "ch": g2ch.get(gid), "id": o["id"], "type": o["type"],
                "sig": struct_sig(o), "sh": C.shingles(C.norm_scenario(o)),
            })
    return recs


def find_collisions(recs, focus=None):
    intra, cross = [], []
    # structural exact-signature buckets
    by_sig = {}
    for r in recs:
        by_sig.setdefault(r["sig"], []).append(r)
    for sig, group in by_sig.items():
        # Was: `len(group) < 2 or sig[0] in ("reflect",) and len(sig) < 2`. The second clause was
        # unreachable: `and` binds tighter than `or`, and struct_sig returns a 3-tuple for reflect, so
        # `len(sig) < 2` was never true. It was guarding against the bare `(t,)` fallthrough, which
        # struct_sig no longer produces (it raises instead), so the clause is now genuinely redundant.
        if len(group) < 2:
            continue
        for i in range(len(group)):
            for j in range(i + 1, len(group)):
                a, b = group[i], group[j]
                if a["gid"] == b["gid"] and a["id"] == b["id"]:
                    continue
                pair = ("STRUCT", a, b)
                (intra if a["ch"] == b["ch"] else cross).append(pair)
    # prose near-dup: only compare within the same mechanic + chapter bucket for tractability
    buck = {}
    for r in recs:
        buck.setdefault((r["type"], r["ch"]), []).append(r)
    for (ty, ch), group in buck.items():
        for i in range(len(group)):
            for j in range(i + 1, len(group)):
                a, b = group[i], group[j]
                if a["gid"] == b["gid"] and a["id"] == b["id"]:
                    continue
                if C.jaccard(a["sh"], b["sh"]) >= PROSE_JACCARD:
                    intra.append(("PROSE", a, b))
    if focus:
        intra = [p for p in intra if focus in (p[1]["gid"], p[2]["gid"])]
        cross = [p for p in cross if focus in (p[1]["gid"], p[2]["gid"])]
    return intra, cross


def main():
    focus = sys.argv[sys.argv.index("--game") + 1] if "--game" in sys.argv else None
    verify = "--verify" in sys.argv
    recs = load_all()
    intra, cross = find_collisions(recs, focus)
    # de-dupe the pair list for display
    def show(pairs, n=30):
        seen = set(); out = []
        for kind, a, b in pairs:
            k = tuple(sorted([f"{a['gid']}:{a['id']}", f"{b['gid']}:{b['id']}"])) + (kind,)
            if k in seen: continue
            seen.add(k); out.append((kind, a, b))
        for kind, a, b in out[:n]:
            print(f"    [{kind}] {a['gid']}:{a['id']} ({a['type']}) ≈ {b['gid']}:{b['id']}  (Ch.{a['ch']}/{b['ch']})")
        return len(out)
    print(f"forge_dedup over {len(recs)} scenarios" + (f": focus {focus}" if focus else ""))
    ni = show(intra)
    print(f"  INTRA-band collisions (BLOCK): {ni}")
    if cross:
        print(f"  cross-band echoes (LOGGED, ok): {len({tuple(sorted([a['id'],b['id']])) for _,a,b in cross})}")
    if verify and ni:
        print(f"\n✗ {focus}: {ni} intra-band collision(s), resolve before merge.")
        sys.exit(1)
    if not intra:
        print("  ✓ no intra-band duplicates")


if __name__ == "__main__":
    main()
