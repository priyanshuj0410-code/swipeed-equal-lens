#!/usr/bin/env python3
"""steps_wave.py: plan and track a multi-step rollout wave, one chapter at a time (SWED-100).

Every step of a wave leaves files under .forge/<game>/steps/, so the next step of every batch is worked out from those
files, never from a session's memory. That makes a wave safe to stop at any point (the usage guard, a closed app) and to
resume from any session.

  steps_wave.py split <chapter>              re-plan each game that still has single-step stories and split its stories
                                              into source files of about 50 (never overwrites existing sources)
  steps_wave.py plan <chapter> [--out f]      work out each batch's next stage, prepare any review round that is due, and
                                              write the multi-step-wave workflow's args (default .forge/rollout/wave-args.json)
  steps_wave.py status <chapter>              print each batch's next stage
  steps_wave.py state                         print the rollout state (.forge/rollout/state.json)
  steps_wave.py alive                         minutes since any rollout file under .forge changed (a live workflow writes
                                              them all the time, so a recent change means another session owns the work)
  steps_wave.py mark <status> [--chapter N] [--note text]   record running, paused, shipping, waiting-for-owner or done

Stages, in order: write, review (round 1 to 4), fix (round 1 to 4), then certified (a fix changed nothing), read (the
round 4 fix changed scenarios that no reviewer has seen, so the shipping session reads them), or ship-ready once every
batch is certified or read. Rounds: round 1 reviews every scenario; later rounds review only what the last fix changed, up to round 4.
"""
import json
import math
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import common as C  # noqa: E402
import steps_batch as SB  # noqa: E402
import steps_final as F  # noqa: E402

REPO = C.REPO
ROLLOUT = os.path.join(REPO, ".forge", "rollout")
MAX_ROUNDS = 4  # Chapter 7 still had blocking findings after round 3 in several batches
BATCH = 50
AUDIENCE = {1: "children aged 3 to 6, playing with a grown-up", 2: "children aged 6 to 9", 3: "children aged 9 to 12",
            4: "young teens aged 12 to 15", 5: "teens aged 15 to 18", 6: "young adults aged 18 to 22",
            7: "adults from 22 until their first child", 8: "parents, from their first child on"}
# Games whose stories most often involve harm, abuse, addiction or a child's safety: their writers and fixers run on
# Opus, because Sonnet writers produced survivor-blaming options in Respect at Home (SWED-100).
SAFETY_HEAVY = {"respect-at-home", "be-the-safe-adult", "break-the-cycle", "navigating-addictions", "the-talks",
                "consent-real", "know-your-rights", "mind-belonging", "swipe-right", "real-relationships",
                "mutual", "status-know-it", "my-choices", "justice-league", "spectrum",
                "glrl", "reality-check", "firewall", "bounce", "rabbit-hole", "stand-up",
                "boundary-bot", "defenders", "speak-up", "mind-matters", "puberty-quest",
                "safety-squad", "body-lab", "friend-frenemy", "my-body", "feelings-friends"}


def rows(path):
    return [json.loads(line) for line in open(path, encoding="utf8") if line.strip()] if os.path.exists(path) else []


def labels():
    """file stem -> the game's name, from path.ts through each file's runtime gameId."""
    by_id = {}
    for line in open(C.PATH_TS, encoding="utf8"):
        g, lab = re.search(r'game:\s*"([^"]+)"', line), re.search(r'label:\s*"([^"]+)"', line)
        if g and lab:
            by_id[g.group(1)] = lab.group(1)
    out = {}
    for f in os.listdir(C.GAMES):
        if f.endswith(".ts"):
            gid = C.file_gameid(os.path.join(C.GAMES, f))
            if gid in by_id:
                out[f[:-3]] = by_id[gid]
    return out


def chapter_games(chapter):
    names = labels()
    return sorted(stem for stem in names if C.chapter_of(stem) == chapter)


def singles(stem):
    scns, errors = C.parse_file(os.path.join(C.GAMES, stem + ".ts"))
    if errors:
        raise SystemExit(f"{stem}: parse errors {errors[:2]}")
    return sorted((o for o in scns if o.get("type") in C.STORY_TYPES and not C.is_story(o)),
                  key=lambda o: (o["cat"], o["type"], C.id_number(o["id"]) or 0))


def steps_dir(stem):
    return os.path.join(REPO, ".forge", stem, "steps")


def sources(stem):
    d = steps_dir(stem)
    return sorted(f[7:9] for f in os.listdir(d) if re.fullmatch(r"source-\d\d\.ndjson", f)) if os.path.isdir(d) else []


def cmd_split(chapter):
    for stem in chapter_games(chapter):
        todo = singles(stem)
        if not todo or sources(stem):
            print(f"  {stem}: {'already split' if sources(stem) else 'nothing single-step'}")
            continue
        r = subprocess.run(["python3", os.path.join(REPO, "scripts/forge/forge_plan.py"), stem, "--write"], capture_output=True, text=True, cwd=REPO)
        if r.returncode:
            raise SystemExit(f"{stem}: forge_plan failed: {r.stderr[-300:]}")
        n = math.ceil(len(todo) / BATCH)
        size = math.ceil(len(todo) / n)
        os.makedirs(steps_dir(stem), exist_ok=True)
        for k in range(n):
            with open(os.path.join(steps_dir(stem), f"source-{k + 1:02d}.ndjson"), "w", encoding="utf8") as f:
                for o in todo[k * size:(k + 1) * size]:
                    f.write(json.dumps(o, ensure_ascii=False) + "\n")
        print(f"  {stem}: {len(todo)} stories in {n} batches")


def gate_rejects(stem, batch):
    r = subprocess.run(["python3", os.path.join(REPO, "scripts/forge/forge_check.py"), "--batch", batch, "--game", stem],
                       capture_output=True, text=True, cwd=REPO)
    m = re.search(r"batch: (\d+) rejected", r.stdout)
    return int(m.group(1)) if m else 999


def state(stem, nn, prepare=False):
    """(stage, round, detail) for one batch; with prepare, also write the inputs of a review round that is due."""
    d = steps_dir(stem)
    src, batch = os.path.join(d, f"source-{nn}.ndjson"), os.path.join(d, f"batch-{nn}.ndjson")
    if not os.path.exists(batch) or SB.problems(rows(src), rows(batch)):
        return "write", 1, "batch incomplete"
    rej = gate_rejects(stem, batch)
    if rej:
        return "write", 1, f"{rej} gate rejects"
    for r in range(1, MAX_ROUNDS + 1):
        rd = os.path.join(d, f"final-{nn}", f"r{r}")
        if not os.path.exists(os.path.join(rd, "audit.ndjson")):
            if not prepare:
                return "review", r, "not prepared yet"
            if r == 1:
                F.make(stem, rd, batch, src)
            else:
                prev = os.path.join(d, f"final-{nn}", f"r{r - 1}", "changed.txt")
                F.make(stem, rd, batch, src, F.read_ids(prev))
            return "review", r, "prepared"
        changed = os.path.join(rd, "changed.txt")
        if os.path.exists(changed):
            # a finished round: its fixer passed coverage then; later fixes change the batch, so never re-check it
            if not F.read_ids(changed):
                return "certified", r, "the last fix changed nothing"
            if r == MAX_ROUNDS:
                return "read", r, f"{len(F.read_ids(changed))} changed after the last review"
            continue
        ids = F.read_ids(os.path.join(rd, "audit.ndjson"))
        out = F.check(stem, rd, batch, ids)
        if out["summary"]["coverage_problems"]:
            return "review", r, f"{out['summary']['coverage_problems']} reviews missing"
        return "fix", r, f"{out['summary']['blocking']} blocking"
    return "read", MAX_ROUNDS, "?"


def items(chapter, prepare=False):
    names = labels()
    out = []
    for stem in chapter_games(chapter):
        for nn in sources(stem):
            stage, r, detail = state(stem, nn, prepare)
            out.append({"stem": stem, "name": names[stem], "chapter": chapter, "audience": AUDIENCE[chapter], "nn": nn,
                        "count": len(rows(os.path.join(steps_dir(stem), f"source-{nn}.ndjson"))), "stage": stage, "round": r,
                        "detail": detail, "safetyHeavy": stem in SAFETY_HEAVY, "minors": chapter <= 5})
    return out


STATE = os.path.join(ROLLOUT, "state.json")
STATUSES = ("running", "paused", "shipping", "waiting-for-owner", "done")
QUEUE = [7, 8, 6, 5, 4, 3]  # owner decision 2026-09-29; then a one-game Chapter 1 pilot that waits for the owner


def load_state():
    try:
        return json.load(open(STATE, encoding="utf8"))
    except (OSError, ValueError):
        return {"queue": QUEUE, "chapter": QUEUE[0], "status": "paused", "updated": 0, "history": []}


def cmd_mark(status, chapter=None, note=None):
    import time
    if status not in STATUSES:
        raise SystemExit(f"status must be one of {STATUSES}")
    st = load_state()
    st["status"], st["updated"] = status, int(time.time())
    if chapter is not None:
        st["chapter"] = chapter
    st["note"] = note or ""
    st.setdefault("history", []).append({"at": st["updated"], "chapter": st["chapter"], "status": status, "note": st["note"]})
    st["history"] = st["history"][-100:]
    os.makedirs(ROLLOUT, exist_ok=True)
    json.dump(st, open(STATE, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    print(f"rollout: Chapter {st['chapter']} {status}{': ' + st['note'] if st['note'] else ''}")


def cmd_alive():
    import time
    newest = 0
    for g in os.listdir(os.path.join(REPO, ".forge")):
        d = os.path.join(REPO, ".forge", g, "steps")
        if not os.path.isdir(d):
            continue
        for root, _, files in os.walk(d):
            for f in files:
                newest = max(newest, os.path.getmtime(os.path.join(root, f)))
    mins = (time.time() - newest) / 60 if newest else float("inf")
    print(f"last rollout file change: {mins:.0f} min ago")


def cmd_state():
    import time
    st = load_state()
    age = (time.time() - st.get("updated", 0)) / 3600
    print(f"rollout: Chapter {st['chapter']} {st['status']} (updated {age:.1f} h ago){': ' + st['note'] if st.get('note') else ''}")
    print(f"queue: {st.get('queue')}")


def main():
    a = sys.argv[1:]
    if a[:1] == ["state"]:
        cmd_state()
        return
    if a[:1] == ["alive"]:
        cmd_alive()
        return
    if a[:1] == ["mark"] and len(a) >= 2:
        chapter = int(a[a.index("--chapter") + 1]) if "--chapter" in a else None
        note = a[a.index("--note") + 1] if "--note" in a else None
        cmd_mark(a[1], chapter, note)
        return
    if len(a) >= 2 and a[0] in ("split", "plan", "status"):
        chapter = int(a[1])
        if a[0] == "split":
            cmd_split(chapter)
            return
        its = items(chapter, prepare=a[0] == "plan")
        for it in its:
            print(f"  {it['stem']}-{it['nn']}: {it['stage']} r{it['round']} ({it['detail']})")
        tally = {}
        for it in its:
            tally[it["stage"]] = tally.get(it["stage"], 0) + 1
        print(f"Chapter {chapter}: {len(its)} batches {tally}")
        if a[0] == "plan":
            out = a[a.index("--out") + 1] if "--out" in a else os.path.join(ROLLOUT, "wave-args.json")
            os.makedirs(os.path.dirname(out), exist_ok=True)
            todo = [it for it in its if it["stage"] in ("write", "review", "fix")]
            todo.sort(key=lambda it: (not it["safetyHeavy"], it["stem"], it["nn"]))
            json.dump({"items": todo}, open(out, "w", encoding="utf8"), ensure_ascii=False)
            print(f"workflow args for {len(todo)} batches: {out}")
        return
    raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
