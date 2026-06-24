#!/usr/bin/env python3
"""forge/common.py — the shared foundation every forge gate imports.

This is the safety boundary in code: the byte-exact helpline allowlist, the band map, the per-band mechanic
allowlist, the must-be-true field-role map, parse-or-die parsing, dedup normalization, and the per-mechanic
structural validators. The individual gate scripts (forge_helpline/forge_shape/forge_mix/…) are thin wrappers
over this. Keep DATA here verified and version-pinned — its recall is what stands between the gate and a
shipped wrong child-safety number.

Allowlist last web-verified 2026-06-24 against india.gov.in/directory/helpline + childlineindia.org.
"""
import json, os, re
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", ".."))
GAMES = os.path.join(REPO, "src", "content", "games")
PATH_TS = os.path.join(REPO, "src", "content", "path.ts")

FIELD_MAX = 160
BAND_CEIL = {1: 360, 2: 360, 3: 400, 4: 400, 5: 460, 6: 460, 7: 500, 8: 500}

# Upgraded mechanic shapes (the founder's mechanic asks)
SORT_ITEMS = 6
SPOT_SCENE = 5
SPOT_TRICKS = 2
MATCH_PAIRS = 5

# ── the safety boundary: India helpline name <-> number binding (verified) ──────────────────────────────────
# Each service: canonical number (digits, no spaces) + accepted display forms + name regexes. A service NAME in
# prose must have its canonical number adjacent (or no number); a number in a HELPLINE CONTEXT must be its
# service's canonical number. Numbers NOT in a helpline context (calories, ages, counts) are ignored.
# Services carry ALL valid alternates (e.g. women = 181 OR 1091; emergency/police = 112 OR 100) so the gate is
# forgiving of correct variants while still catching a WRONG binding ("Childline 112"). The check is
# DIRECT-BINDING only: a service name immediately followed by a number must be one of that service's numbers —
# so "Childline, Tele-MANAS and 112" or "112 (emergency)" (number not directly after the name) never false-flag.
HELPLINES = [
    {"service": "Childline",  "forms": ["1098"],                                   "names": [r"child\s?line"]},
    {"service": "Women",      "forms": ["181", "1091"],                            "names": [r"women['’]?s? (?:helpline|help ?line)", r"domestic (?:abuse|violence) helpline", r"women in distress"]},
    {"service": "Emergency",  "forms": ["112", "100"],                             "names": [r"\bemergency (?:number|helpline|line|services?)\b", r"\bERSS\b", r"\bpolice\b"]},
    {"service": "TeleMANAS",  "forms": ["14416", "1-800-891-4416", "18008914416"], "names": [r"tele[-\s]?manas"]},
    {"service": "KIRAN",      "forms": ["1800-599-0019", "18005990019"],           "names": [r"\bKIRAN\b"]},
    {"service": "Cyber",      "forms": ["1930"],                                   "names": [r"cyber\s?crime helpline", r"cyber\s?crime number", r"report cyber\s?crime"]},
    {"service": "LegalAid",   "forms": ["15100"],                                  "names": [r"legal aid (?:helpline|number)", r"\bNALSA\b"]},
]
# every legit helpline digit-form (normalized, dashes stripped) — for the "dialed number must be allowlisted" check
HELPLINE_FORMS = {f.replace("-", "") for h in HELPLINES for f in h["forms"]}
# a number is "dialed" (and so must be a real helpline) only right after an explicit call/dial verb
DIAL_CONTEXT = re.compile(r"\b(?:call|dial|ring)\s+(\d[\d\- ]{2,4}\d)", re.I)

# US-centric framing that must never leak into India-first content
US_DENYLIST = re.compile(
    r"\b(9-1-1|911|CPS\b|child protective services|district attorney|\bDA\b|title ix|\bsophomore\b|\bfreshman\b|\bjunior high\b|\bmiddle school\b(?! in india)|\bgrade\s?\d{1,2}\b|\bzip ?code\b|\bSSN\b|\bDMV\b)|[$]\d",
    re.I)

# law/statute sniffer — these claims MUST be web-verified (force needsFact regardless of generator's tag)
STATUTE_YEAR = {"POSH": "2013", "PWDV": "2005", "DV Act": "2005", "BNS": "2023", "RPwD": "2016", "POCSO": "2012", "PCMA": "2006"}
LAW_TOKENS = re.compile(r"\b(POCSO|POSH|BNS|BNSS|IPC|RPwD|PCMA|age of consent|child marriage|domestic violence act|section \d+)\b", re.I)
STAT_PATTERN = re.compile(r"(\b\d{1,3}\s?%|\b\d+\s+(?:in|out of)\s+\d+\b|studies show|research shows|\baccording to\b|\bWHO\b|\bNCRB\b|\bNFHS\b)", re.I)
AGE_OF_CONSENT = "18"

# ── per-band mechanic allowlist ─────────────────────────────────────────────────────────────────────────────
# A mechanic is allowed for a game if it's in the band default-allowed set OR the game's library leadMechanics.
# Ch.1-2 (ages 3-9) default-DISALLOW the red-flag/predator-spotting (spot) and flag-reading (swipe) verbs —
# they need older cognition and risk teaching fear to little kids — UNLESS that game's GDD leads with them.
BAND_DISALLOW = {1: {"spot", "swipe"}, 2: {"spot", "swipe"}}
ALL_MECHANICS = {"reflect", "role-play", "strike-rewrite", "branch", "sort", "match", "build", "explore-label", "spot", "swipe"}

# ── field roles: where canonical facts MUST hold vs where deliberate myths/lies live ─────────────────────────
# Visible (rendered) string fields per type — used for <=160, normalization, dedup.
def visible_fields(o):
    """Yield (field_label, text) for every player-visible string in a scenario."""
    t = o.get("type")
    for k in ("hook", "relearn"):
        if isinstance(o.get(k), str):
            yield k, o[k]
    if t == "reflect":
        yield "prompt", o.get("prompt", "")
        for i, s in enumerate(o.get("options", []) or []):
            yield f"option[{i}]", s
        yield "affirm", o.get("affirm", "")
    elif t == "role-play":
        yield "setup", o.get("setup", "")
        for i, l in enumerate(o.get("yourLine", []) or []):
            yield f"yourLine[{i}]", l.get("text", "")
    elif t == "strike-rewrite":
        m = o.get("myth", {}) or {}
        for k in ("un", "re", "why"):
            yield f"myth.{k}", m.get(k, "")
    elif t == "branch":
        for i, op in enumerate(o.get("options", []) or []):
            yield f"option[{i}].text", op.get("text", "")
            yield f"option[{i}].consequence", op.get("consequence", "")
        yield "debrief", o.get("debrief", "")
    elif t == "sort":
        for it in o.get("items", []) or []:
            yield "item", it.get("text", "")
        for b in o.get("bins", []) or []:
            yield "bin", b.get("label", "")
    elif t == "match":
        for p in o.get("pairs", []) or []:
            yield "pair.left", p.get("left", "")
            yield "pair.right", p.get("right", "")
    elif t == "build":
        yield "prompt", o.get("prompt", "")
        for p in o.get("pieces", []) or []:
            yield "piece", p
    elif t == "explore-label":
        yield "find", o.get("find", "")
        yield "reveal", o.get("reveal", "")
        for p in o.get("parts", []) or []:
            yield "part", p
    elif t == "spot":
        for s in o.get("scene", []) or []:
            yield "scene", s.get("text", "")
        yield "why", o.get("why", "")
    elif t == "swipe":
        yield "cue", o.get("cue", "")
        yield "left", o.get("left", "")
        yield "right", o.get("right", "")

def must_be_true_texts(o):
    """The fields that assert canonical truth (fact gate enforces here, NOT in deliberate-myth fields)."""
    t = o.get("type")
    out = []
    if isinstance(o.get("relearn"), str):
        out.append(o["relearn"])
    if t == "strike-rewrite":
        m = o.get("myth", {}) or {}
        out += [m.get("re", ""), m.get("why", "")]   # NOT m['un'] — that's the myth being struck
    elif t == "branch":
        out.append(o.get("debrief", ""))
        for op in o.get("options", []) or []:
            if op.get("best"):
                out += [op.get("text", ""), op.get("consequence", "")]
    elif t == "reflect":
        out.append(o.get("affirm", ""))
    elif t == "spot":
        out.append(o.get("why", ""))
        for s in o.get("scene", []) or []:
            if not s.get("trick"):
                out.append(s.get("text", ""))    # truths; trick items are deliberate lies
    elif t == "swipe":
        out.append(o.get("relearn", ""))
    elif t == "explore-label":
        out.append(o.get("reveal", ""))
    elif t == "match":
        for p in o.get("pairs", []) or []:
            out += [p.get("left", ""), p.get("right", "")]
    elif t == "sort":
        out += [it.get("text", "") for it in o.get("items", []) or []]
    return [x for x in out if x]

# ── parsing (parse-or-die) ──────────────────────────────────────────────────────────────────────────────────
BASE_FIELDS = {"id", "type", "cat"}

def is_scenario_line(ls):
    return ls.startswith("{") and '"id":' in ls and '"type":' in ls

def parse_file(path):
    """Return (scenarios, errors). NO bare-except silent skipping: a candidate line that fails to parse or
    lacks base fields is an ERROR, not a skip. errors = list of (lineno, reason)."""
    scns, errors = [], []
    for n, raw in enumerate(open(path, encoding="utf8").read().splitlines(), 1):
        ls = raw.strip().rstrip(",")
        if not is_scenario_line(ls):
            continue
        try:
            o = json.loads(ls)
        except Exception as e:
            errors.append((n, f"json.loads failed: {e}"))
            continue
        missing = BASE_FIELDS - set(o)
        if missing:
            errors.append((n, f"missing base fields {missing}"))
            continue
        scns.append(o)
    return scns, errors

def game_to_chapter():
    m = {}
    if os.path.exists(PATH_TS):
        for line in open(PATH_TS, encoding="utf8"):
            gm = re.search(r'game:\s*"([^"]+)"', line)
            ch = re.search(r'chapter:\s*"Ch\.(\d)', line)
            if gm and ch:
                m[gm.group(1)] = int(ch.group(1))
    return m

def file_gameid(path):
    """The RUNTIME gameId from a content file's config — may differ from the filename stem (e.g.
    feelings-friends.ts → gameId 'feelings'). path.ts keys off this runtime id, not the filename."""
    if not os.path.exists(path):
        return os.path.basename(path)[:-3]
    m = re.search(r'gameId:\s*"([^"]+)"', open(path, encoding="utf8").read())
    return m.group(1) if m else os.path.basename(path)[:-3]

def chapter_of(gid_or_path):
    """Chapter for a game by filename stem OR path — resolves the config gameId first so a file whose name
    differs from its gameId still gets the right chapter (hence the right band ceiling + band-mechanic guard)."""
    g2ch = game_to_chapter()
    path = gid_or_path if gid_or_path.endswith(".ts") else os.path.join(GAMES, gid_or_path + ".ts")
    return g2ch.get(file_gameid(path)) if os.path.exists(path) else g2ch.get(gid_or_path)

# ── dedup normalization ─────────────────────────────────────────────────────────────────────────────────────
_WS = re.compile(r"\s+")
_PUNCT = re.compile(r"[^\w\s]")
def norm_text(s):
    s = s.lower()
    s = _PUNCT.sub(" ", s)
    return _WS.sub(" ", s).strip()

def norm_scenario(o, mask_helplines=True):
    """A normalized prose fingerprint for dedup. Helpline strings + named laws are MASKED so their mandatory
    repetition across many beats doesn't read as duplication."""
    parts = [txt for _, txt in visible_fields(o)]
    blob = " ".join(parts)
    if mask_helplines:
        for h in HELPLINES:
            for f in h["forms"]:
                blob = blob.replace(f, "<HL>")
            for nm in h["names"]:
                blob = re.sub(nm, "<HL>", blob, flags=re.I)
    return norm_text(blob)

def shingles(s, k=3):
    toks = s.split()
    return {" ".join(toks[i:i + k]) for i in range(max(1, len(toks) - k + 1))}

def jaccard(a, b):
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)

# ── per-mechanic structural validators ──────────────────────────────────────────────────────────────────────
def shape_errors(o, strict_target=True):
    """Structural integrity per type. strict_target=True enforces the UPGRADED shapes (sort 6 / spot 5-2 /
    match 5) for NEW content; False only checks internal consistency (for grandfathered/legacy checks)."""
    t = o.get("type")
    e = []
    if t == "sort":
        items = o.get("items", []); bins = o.get("bins", []); key = o.get("key", {})
        ids = [it.get("id") for it in items]
        if strict_target and len(items) != SORT_ITEMS:
            e.append(f"sort items={len(items)} (need {SORT_ITEMS})")
        if len(set(ids)) != len(ids):
            e.append("sort duplicate item ids")
        binids = {b.get("id") for b in bins}
        for i in ids:
            if i not in key:
                e.append(f"sort key missing item '{i}'")
            elif key[i] not in binids:
                e.append(f"sort key item '{i}' -> unknown bin '{key.get(i)}'")
        used = set(key.values())
        for b in bins:
            if b.get("id") not in used:
                e.append(f"sort bin '{b.get('id')}' never used")
            if strict_target and "valence" not in b:
                e.append(f"sort bin '{b.get('id')}' missing explicit valence")
    elif t == "spot":
        scene = o.get("scene", [])
        tricks = [s for s in scene if s.get("trick")]
        if strict_target and len(scene) != SPOT_SCENE:
            e.append(f"spot scene={len(scene)} (need {SPOT_SCENE})")
        if strict_target and len(tricks) != SPOT_TRICKS:
            e.append(f"spot tricks={len(tricks)} (need exactly {SPOT_TRICKS})")
        for s in scene:
            if not isinstance(s.get("trick"), bool):
                e.append(f"spot item '{s.get('id')}' trick not boolean")
        if len({s.get("id") for s in scene}) != len(scene):
            e.append("spot duplicate scene ids")
    elif t == "match":
        pairs = o.get("pairs", [])
        lefts = [p.get("left") for p in pairs]; rights = [p.get("right") for p in pairs]
        if strict_target and len(pairs) != MATCH_PAIRS:
            e.append(f"match pairs={len(pairs)} (need {MATCH_PAIRS})")
        if len(set(lefts)) != len(lefts):
            e.append("match duplicate lefts")
        if len(set(rights)) != len(rights):
            e.append("match duplicate rights")
        if set(lefts) & set(rights):
            e.append("match left text equals a right text (ambiguous)")
    elif t == "branch":
        opts = o.get("options", [])
        best = [op for op in opts if op.get("best")]
        if len(best) != 1:
            e.append(f"branch best count={len(best)} (need exactly 1)")
        for op in opts:
            if not op.get("best") and not op.get("consequence"):
                e.append("branch non-best option missing consequence")
    elif t == "reflect":
        for bad in ("best", "key", "trick", "answer"):
            if bad in json.dumps(o):
                pass  # checked at field level by callers; reflect must have no wrong answer
        if not o.get("options"):
            e.append("reflect missing options")
    elif t == "swipe":
        if o.get("answer") not in ("left", "right"):
            e.append("swipe answer not in {left,right}")
        if o.get("left") == o.get("right"):
            e.append("swipe labels identical")
    elif t == "build":
        key = o.get("key", []); pieces = o.get("pieces", [])
        if not set(key).issubset(set(pieces)):
            e.append("build key not subset of pieces")
        if len(set(pieces)) != len(pieces):
            e.append("build duplicate pieces")
    elif t == "explore-label":
        if o.get("answer") not in (o.get("parts") or []):
            e.append("explore-label answer not in parts")
    return e

def helpline_errors(o):
    """Precise helpline check over a scenario's visible text — DIRECT BINDING only, low false-positive.
      (1) US-framing tokens are blocked.
      (2) A service NAME immediately followed by a number (optionally via at/on/:/-) must be one of THAT
          service's valid numbers — catches 'Childline 112' but not '112 (emergency)' or multi-service lists.
      (3) A number right after a call/dial/ring verb must be an allowlisted helpline (catches a hallucinated
          dial-this number) — content numbers like '1000 calories' or '18 years' are never in a dial context.
    """
    e = []
    for label, txt in visible_fields(o):
        if US_DENYLIST.search(txt):
            e.append(f"{label}: US-framing token in '{txt[:50]}'")
        for h in HELPLINES:
            canon = {f.replace("-", "") for f in h["forms"]}
            for nm in h["names"]:
                for m in re.finditer(nm + r"\s*(?:at|on|number|helpline|[:\-–])?\s*(\d[\d\- ]{1,5}\d)", txt, re.I):
                    nd = re.sub(r"[\s\-]", "", m.group(1))
                    if nd not in canon and len(nd) <= 5:
                        e.append(f"{label}: '{h['service']}' bound to {m.group(1).strip()} (want {h['forms'][0]})")
        for m in DIAL_CONTEXT.finditer(txt):
            nd = re.sub(r"[\s\-]", "", m.group(1))
            if nd not in HELPLINE_FORMS and len(nd) <= 5:
                e.append(f"{label}: dialed number '{m.group(1).strip()}' not on the helpline allowlist")
    return e

def allowed_mechanics(chapter, lead_mechanics):
    base = ALL_MECHANICS - BAND_DISALLOW.get(chapter or 9, set())
    return base | set(lead_mechanics or [])

def field_len_errors(o):
    return [f"{label} >{FIELD_MAX} ({len(txt)})" for label, txt in visible_fields(o) if len(txt) > FIELD_MAX]

# keys that are NOT narrated prose — excluded from the per-scenario band total. MUST match check_msg_len.py's
# NON_PROSE so the forge gate is at least as strict as the pre-commit length guard (else the gate passes a
# scenario the commit hook then blocks).
NON_PROSE = {"id", "cat", "type", "key", "persona", "source", "mode", "valence", "outcome"}

def prose_chars(o):
    def walk(v, k=None):
        if isinstance(v, str):
            return len(v) if k not in NON_PROSE else 0
        if isinstance(v, dict):
            return sum(walk(vv, kk) for kk, vv in v.items())
        if isinstance(v, list):
            return sum(walk(it, k) for it in v)
        return 0
    return sum(walk(vv, kk) for kk, vv in o.items())

def band_error(o, ceil):
    if not ceil:
        return []
    tot = prose_chars(o)
    return [f"prose total {tot} > band ceiling {ceil}"] if tot > ceil else []

def claim_flags(o):
    """Claims that MUST be web-verified (force needsFact regardless of the generator's tag). Only scans
    must-be-true fields — a law/stat asserted inside a deliberate myth (myth.un / trick item) is not a claim
    the app makes. Returns list of (kind, snippet)."""
    flags = []
    for txt in must_be_true_texts(o):
        if LAW_TOKENS.search(txt):
            flags.append(("law", txt[:70]))
        if STAT_PATTERN.search(txt):
            flags.append(("stat", txt[:70]))
    return flags

def membership_errors(o, allowed, personas=None):
    e = []
    if allowed is not None and o.get("type") not in allowed:
        e.append(f"mechanic '{o.get('type')}' not allowed for this band")
    p = o.get("persona")
    if personas and p and p != "any" and p not in personas:
        e.append(f"persona '{p}' not in chapter roster")
    return e

def scenario_errors(o, chapter=None, allowed=None, ceil=None, strict_shape=True, personas=None):
    """Every DETERMINISTIC per-scenario check, as a flat list of error strings (empty = clean)."""
    out = []
    out += [f"shape: {x}" for x in shape_errors(o, strict_target=strict_shape)]
    out += [f"helpline: {x}" for x in helpline_errors(o)]
    out += [f"len: {x}" for x in field_len_errors(o)]
    out += [f"band: {x}" for x in band_error(o, ceil)]
    out += [f"membership: {x}" for x in membership_errors(o, allowed, personas)]
    return out


if __name__ == "__main__":
    # self-test: parse the whole bank, report parse errors + run shape (legacy mode) + helpline over it.
    import glob
    total = 0; perr = 0; herr = 0
    for f in sorted(glob.glob(os.path.join(GAMES, "*.ts"))):
        b = os.path.basename(f)
        if b.startswith("capstone") or "schema" in b:
            continue
        scns, errors = parse_file(f)
        total += len(scns); perr += len(errors)
        for n, reason in errors:
            print(f"  PARSE {b}:{n} {reason}")
        for o in scns:
            he = helpline_errors(o)
            for x in he:
                herr += 1
                print(f"  HELPLINE {b} {o.get('id')}: {x}")
    print(f"\nself-test: {total} scenarios parsed | parse errors {perr} | helpline-binding flags {herr}")
