#!/usr/bin/env python3
"""lints.py: content lints from the playtest feedback plan (SWED-77, with the match and sort rules of SWED-68 and the
question rules of SWED-71).

Playtesters answered without reading, solved match boards by matching words, and read two questions in one bubble.
These checks catch the content half of those problems. The shipped bank predates them, so they block in two places
only: every new forge batch (forge_check.py --batch), and every game listed in lint_clean.json, which the content
gate holds at zero findings once a game has been cleaned (a game is added to the list, never removed).

  dash            an em or en dash in any visible field (the brand voice uses hyphens, commas and colons)
  narrator        a "Lensy:" or "Sam:" prefix, or the scenario's own persona name as one ("Aditya: ..."), because the
                  question card is already Lensy speaking
  two-questions   a reflect or choose hook plus prompt that asks more than one question
  clipped-tag     a hook ending in a short tag question ("Agree?", "Useful shift?") before its prompt
  match-giveaway  a left and its right share a content word, so the pair can be matched by wording alone
  sort-giveaway   an item shares a content word with its own zone's label that no other zone's label has
  myth-context    a myth's truth (myth.re) opens with a pronoun, so it does not stand alone on a myth card
  single-step     a branch or role-play with one question and its answer shown at once; content is multi-step now,
                  3 to 5 steps with 4 or 5 options each and the answers revealed at the end (SWED-96)
  then-verdict    a step's `then` that grades the pick ("Good choice", "That was wrong"), which gives the answer away
                  before the end reveal
  step-questions  a branch step prompt that asks more than one question
  best-longest    a multi-step scenario whose best option is clearly the longest (6 or more characters longer than every
                  other option) in more than half its steps, which players learn to spot

Review flags (reported, never blocking): match rights that share a content word, which may be near-synonyms that
turn the pairing into guesswork (question bank audit A12).

Usage: python3 scripts/forge/lints.py <game file stem>... [--review]   (e.g. feelings-friends, not its gameId feelings)
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C  # noqa: E402

CLEAN_LIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lint_clean.json")

STOP = set("""a an the and or but if so of to in on at by for with from as is are was were be been being am do does did
have has had i you he she it we they me him her us them my your his its our their this that these those there here
not no yes can could will would should shall may might must just very really more most less least than then too also
what which who whom whose when where why how all any both each few many much some such own same other another only
up down out over under again once about into onto off per via like get gets got make makes made let lets say says
said one two three four five six first second new every someone something anyone anything everyone everything
nothing because while until though always never often ever still even""".split())
_WORD = re.compile(r"[A-Za-z][A-Za-z'’]+")
DASH = re.compile("[\u2013\u2014]")
NARRATOR = re.compile(r"(^|[.!?…]\s+)(?:Lensy|Sam)\s*:", re.I)
TAG = re.compile(r"[.!?…]\s+([^.!?…]{1,30})\?\s*$")
PRONOUN_OPEN = re.compile(r"^(?:it|they|both|this|these|those|he|she)\b", re.I)
VERDICT = re.compile(r"\b(?:good|great|best|right|wrong|correct|incorrect|smart|poor|bad|nice|kind|brave)\s+(?:choice|move|answer|call|pick|option|decision)\b|\b(?:well done|good job|that was (?:wrong|right|the best))\b", re.I)
IDIOM_OPEN = re.compile(r"^it(?:'s|’s| is) (?:okay|ok|fine|normal|natural|alright|all right|never|always|not)\b", re.I)


def stem(w):
    w = w.lower().strip("'’")
    for suf in ("ingly", "edly", "ness", "ment", "ing", "ies", "ied", "ed", "es", "ly", "s"):
        if len(w) > len(suf) + 2 and w.endswith(suf):
            return w[: -len(suf)]
    return w


def content_words(s):
    return {stem(w) for w in _WORD.findall(s or "") if w.lower().strip("'’") not in STOP and len(w) > 2}


def content_lints(o):
    """Blocking findings for one scenario, as short strings."""
    out = []
    t = o.get("type")
    persona = (o.get("persona") or "").strip()
    speaker = re.compile(rf"(^|[.!?…]\s+){re.escape(persona)}\s*:") if persona and persona.lower() != "any" else None
    for label, txt in C.visible_fields(o):
        if DASH.search(txt or ""):
            out.append(f"dash: {label} uses an em or en dash")
        if NARRATOR.search(txt or "") or (speaker and speaker.search(txt or "")):
            out.append(f"narrator: {label} starts a line with a narrator prefix")
    if t in ("reflect", "choose"):
        if f"{o.get('hook', '')} {o.get('prompt', '')}".count("?") > 1:
            out.append("two-questions: the hook and prompt ask more than one question")
        m = TAG.search(o.get("hook", "") or "")
        if m and len(m.group(1).split()) <= 4:
            out.append(f"clipped-tag: the hook ends with the tag question '{m.group(1).strip()}?'")
    elif t == "match":
        for p in o.get("pairs", []):
            shared = content_words(p.get("left")) & content_words(p.get("right"))
            if shared:
                out.append(f"match-giveaway: '{p.get('left')}' and '{p.get('right')}' share {sorted(shared)}")
    elif t == "sort":
        labels = {b.get("id"): content_words(b.get("label")) for b in o.get("bins", [])}
        for it in o.get("items", []):
            own = o.get("key", {}).get(it.get("id"))
            others = set().union(*(w for bid, w in labels.items() if bid != own)) if len(labels) > 1 else set()
            tell = (content_words(it.get("text")) & labels.get(own, set())) - others
            if tell:
                out.append(f"sort-giveaway: '{it.get('text')}' shares {sorted(tell)} with its zone's label")
    if t in C.STORY_TYPES and not C.is_story(o):
        out.append(f"single-step: a {t} with one question; make it {C.STORY_STEPS[0]} to {C.STORY_STEPS[1]} steps (SWED-96)")
    if C.is_story(o):
        for i, st in enumerate(o.get("steps") or []):
            if not isinstance(st, dict):
                continue
            if t == "branch" and (st.get("prompt") or "").count("?") > 1:
                out.append(f"step-questions: step[{i}] prompt asks more than one question")
            for j, op in enumerate(st.get("options") or []):
                m = VERDICT.search((op or {}).get("then") or "")
                if m:
                    out.append(f"then-verdict: step[{i}].option[{j}] then grades the pick ('{m.group(0)}')")
        clear = sum(1 for st in o.get("steps") or [] if best_clearly_longest(st))
        if clear * 2 > len(o.get("steps") or []):
            out.append(f"best-longest: the best option is clearly the longest in {clear} of {len(o['steps'])} steps")
    if t == "strike-rewrite":
        re_text = ((o.get("myth") or {}).get("re") or "").strip()
        if PRONOUN_OPEN.match(re_text) and not IDIOM_OPEN.match(re_text):
            out.append(f"myth-context: myth.re opens with a pronoun ('{re_text[:40]}...')")
    return out


LENGTH_TELL = 6  # characters by which a best option must out-length every other option to count as a visible tell


def best_clearly_longest(st):
    opts = [op for op in (st.get("options") or []) if isinstance(op, dict)] if isinstance(st, dict) else []
    best = [len(op.get("text") or "") for op in opts if op.get("best")]
    rest = [len(op.get("text") or "") for op in opts if not op.get("best")]
    return bool(best and rest) and best[0] >= max(rest) + LENGTH_TELL


def review_flags(o):
    if o.get("type") != "match":
        return []
    pairs = o.get("pairs", [])
    words = [content_words(p.get("right")) for p in pairs]
    out = []
    for i in range(len(pairs)):
        for j in range(i + 1, len(pairs)):
            if words[i] & words[j]:
                out.append(f"match-rights: '{pairs[i].get('right')}' and '{pairs[j].get('right')}' share {sorted(words[i] & words[j])}")
    return out


def clean_games():
    return json.load(open(CLEAN_LIST, encoding="utf8"))["games"] if os.path.exists(CLEAN_LIST) else []


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit("usage: lints.py <game file stem>... [--review]")
    total = 0
    for gid in args:
        scns, errors = C.parse_file(os.path.join(C.GAMES, gid + ".ts"))
        if errors:
            raise SystemExit(f"{gid}: parse errors {errors[:3]}")
        found = [(o["id"], f) for o in scns for f in content_lints(o)]
        kinds = {}
        for _, f in found:
            kinds[f.split(":")[0]] = kinds.get(f.split(":")[0], 0) + 1
        print(f"■ {gid}: {len(found)} finding(s) {kinds}")
        for sid, f in found:
            print(f"  {sid}  {f}")
        if "--review" in sys.argv:
            for o in scns:
                for f in review_flags(o):
                    print(f"  {o['id']}  review {f}")
        total += len(found)
    sys.exit(1 if total else 0)


if __name__ == "__main__":
    main()
