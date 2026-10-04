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
  step-questions  a branch step prompt that does not ask exactly one question
  best-longest    a multi-step scenario whose best option is clearly the longest (6 or more characters longer than every
                  other option) in more than half its steps, which players learn to spot
  follow-up       a reflect `ask` or `deeper` that is not exactly one question (SWED-97)
  disclosure      a reflect `ask` or `deeper` that asks players about harm in their own life ("Has this happened to you?",
                  "Tell me about a time..."): the app cannot receive a disclosure (child-safe content rules)
  splice          a comma splice: two sentences joined by a comma ("It's fine, I'll cover it."), which the brand voice
                  writes as two sentences. A heuristic tuned on the Choosing & Building review (SWED-100): it catches
                  68 of the 71 splices that review fixed by hand and skips tags ("I guess"), intros ("Honestly,") and
                  clauses opened by if, when or because

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
DISCLOSURE = re.compile(r"\b(?:tell (?:me|us|lensy) about (?:a time|when)|(?:has|did) (?:this|that|anything like this|something like this) (?:ever )?happen(?:ed)? to you|describe what happened|who (?:hurt|touched|hit) you|what happened to you)\b", re.I)
# comma splice heuristic: a comma between a left part that reads as a clause and a right part that opens one
_SUBJ = r"(?:i|you|he|she|it|we|they)"
_CONTR = (r"(?:nothing's|everything's|something's|who's|where's|how's|i'm|i'll|i've|i'd|you're|you'll|you've|you'd|he's|"
          r"he'll|he'd|she's|she'll|she'd|it's|it'll|it'd|we're|we'll|we've|we'd|they're|they'll|they've|they'd|there's|"
          r"that's|that'll|here's|what's|let's)")
_AUX = (r"(?:am|is|are|was|were|do|does|did|don't|doesn't|didn't|can|can't|could|couldn't|will|won't|would|wouldn't|should|"
        r"shouldn't|have|has|had|haven't|hasn't|need|needs|know|think|feel|feels|want|wants|get|gets|got|go|goes|went|make|"
        r"makes|made|say|says|said|see|sees|saw|look|looks|seem|seems)")
_NOT_VERB = r"(?:and|or|too|both|all|guys|two|three|alone|included)"
_OPENER = (r"(?:whatever|whoever|wherever|however|whichever|if|when|whenever|because|although|though|as|since|while|after|"
           r"before|once|unless|until|whether|even|so|and|but|or|then|like|with|without|by|for|in|on|at|from|to|of|about|"
           r"not|instead|later|first|finally|usually|often|meanwhile|besides)")
_INTRO = (r"(?:no|yes|okay|ok|well|sorry|honestly|sometimes|fine|sure|look|listen|maybe|please|oh|hey|thanks|right|wow|hmm|"
          r"still|now|again|really|actually|anyway|also|just|only|seriously|see|alright|great|good|true|wait|arre|haan|"
          r"accha|achha|beta|yaar|ji)")
_IMPERATIVE = (r"(?:don't|do|fix|be|stay|get|go|come|hold|find|help|show|bring|write|read|note|name|say|tell|ask|let|take|"
               r"give|keep|stop|try|make|leave|call|text|suggest|agree|thank|wait|forget|trust|remind|check|share|talk|"
               r"explain|offer|admit|promise|decide|refuse|insist|point|mention|pause|listen|nod|laugh|smile|change|drop|"
               r"skip|join|pay|split|book|plan|put|send|reply|block|report|walk|move)")
_INTRO_PHRASES = {"i mean", "you know", "you see", "i guess", "i think", "i suppose"}
_TAG_QUESTION = r"(?:\w+n't|do|does|did|can|could|would|will|is|are|am|was|were|have|has)\s+(?:i|you|we|they|he|she|it)\W*"
_TAG = re.compile(r"(?:i guess|i suppose|i think|i mean|i know|i hope|i promise|i swear|you know|you know that|you see|"
                  rf"that's all|that's it|right)\W*|{_TAG_QUESTION}")
_SUBORDINATE = re.compile(r"\b(?:if|when|whenever|because|although|though|once|unless|until|since|while|before|after|whether)\b")
_GERUND = re.compile(r"^(?!(?:nothing|something|everything|anything|during|morning|evening|thing)\b)\w+ing\s")
_OPENS_CLAUSE = re.compile(
    rf"^(?:{_CONTR}\b|(?:why|what|how|where|who)\s+(?:do|does|did|would|could|should|can|is|are|was|were|will|have|has)\b"
    rf"|(?:can|could|would|will|shall|should|do|does|did|is|are)\s+(?:we|you|i|he|she|they)\b"
    rf"|{_SUBJ}\s+(?!{_NOT_VERB}\b)\w+"
    r"|(?:this|that|the|my|your|his|her|our|their|nothing|everything|something|nobody|everyone)\s+(?:\w+\s+){0,2}"
    r"(?:is|are|was|were|isn't|aren't|wasn't|doesn't|don't|didn't|won't|can't|will|would|has|have|had|matters|counts)\b)")
_IS_CLAUSE = re.compile(rf"\b{_CONTR}\b|^{_IMPERATIVE}\b|^{_SUBJ}\s+(?!{_NOT_VERB}\b)\w+|\b(?:{_SUBJ}|that|this|there|[a-z]+)\s+{_AUX}\b")


def comma_splices(text):
    """Comma splices in one text, each as 'left, right'."""
    out = []
    t = (text or "").replace("\u201c", '"').replace("\u201d", '"').replace("\u2019", "'")
    for sentence in re.split(r'(?<=[.!?])"?\s+', t):
        parts = [x for x in re.split(r',(?!")\s+', sentence) if not re.fullmatch(rf"\W*{_INTRO}\W*", x.strip().lower())]
        for a, b in zip(parts, parts[1:]):
            left = re.split(r'[:"]', a.strip().strip('"').lower())[-1].strip()
            left = re.sub(rf"^(?:{_INTRO}|i mean|you know|you see)\s+", "", left)
            right = b.strip().strip('"').lower()
            if left == right or left in _INTRO_PHRASES or _TAG.fullmatch(right) or _SUBORDINATE.search(left):
                continue
            if len(left.split()) < 2 or re.match(rf"^{_OPENER}\b", left) or _GERUND.match(left):
                continue
            if _OPENS_CLAUSE.match(right) and _IS_CLAUSE.search(left):
                out.append(f"{a.strip()}, {b.strip()}")
    return out


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
        for splice in comma_splices(txt)[:1]:
            out.append(f"splice: {label} joins two sentences with a comma ('{splice[:70]}')")
        if NARRATOR.search(txt or "") or (speaker and speaker.search(txt or "")):
            out.append(f"narrator: {label} starts a line with a narrator prefix")
    if t == "reflect":
        for k in ("ask", "deeper"):
            q = o.get(k)
            if not isinstance(q, str):
                continue
            if q.count("?") != 1 or not q.rstrip().endswith("?"):
                out.append(f"follow-up: {k} must be one question ending in '?'")
            if DISCLOSURE.search(q):
                out.append(f"disclosure: {k} asks about the player's own experience")
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
            if t == "branch" and (st.get("prompt") or "").count("?") != 1:
                out.append(f"step-questions: step[{i}] prompt must ask exactly one question")
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
        scns, errors = C.parse_file(C.game_path(gid))
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
