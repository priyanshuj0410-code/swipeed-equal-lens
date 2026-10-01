#!/usr/bin/env python3
"""private_files.py: fail if a personal or internal document is tracked in this public repo (SWED-107, SWED-110).
The repo is public by design. A CV, case studies, a job description, the strategy documents and the brand guidelines
PDF were committed by mistake and purged from every commit on 2026-10-01, and so were third-party app screenshots
saved by the Lazyweb research tool (.lazyweb/); this gate keeps them, and anything like them, out. The two strategy
PDFs that scripts/read_first.py reads stay on the owner's machine, untracked (.gitignore).
Usage:
  python3 scripts/private_files.py              checks every file git tracks (part of `npm run gates`)
  python3 scripts/private_files.py --push REV…  checks every file added or changed by commits reachable from REV that
                                                no remote has yet (the pre-push hook), so a branch still built on the
                                                history from before a purge cannot bring the purged files back
"""
import re
import subprocess
import sys

PRIVATE = [
    (re.compile(r"resume|curriculum.?vitae|(^|[/_ -])cv[._ -]", re.I), "a CV or resume"),
    (re.compile(r"case.?study", re.I), "a case study"),
    (re.compile(r"design-builder-role|job.?description|offer.?letter", re.I), "a job application document"),
    (re.compile(r"game strategy \(build bible\)|transition plan \(step", re.I), "an internal strategy document"),
    (re.compile(r"project summary\.docx$", re.I), "an internal project summary"),
    (re.compile(r"brand-guidelines", re.I), "the brand guidelines PDF (the brand package is the public reference)"),
    (re.compile(r"(^|/)\.lazyweb/"), "third-party app screenshots from Lazyweb research"),
]
ALLOWED = {
    # The game-doc template lists "case study" as a game type; it is not a document.
    "knowledge/games/_game-template.md",
}


def flag(files):
    bad = []
    for f in files:
        if not f or f in ALLOWED:
            continue
        for rx, what in PRIVATE:
            if rx.search(f):
                bad.append((f, what))
                break
    return bad


def check_push(revs):
    log = subprocess.run(
        ["git", "-c", "core.quotepath=false", "log", "--format=", "--name-only", "--no-renames", "--diff-filter=d", *revs, "--not", "--remotes"],
        capture_output=True, text=True, check=True,
    ).stdout
    bad = sorted(set(flag(log.splitlines())))
    if bad:
        print("⛔ push blocked: these commits add private or purged files to the public repo:", file=sys.stderr)
        for f, what in bad:
            print(f"   {f}  ({what})", file=sys.stderr)
        print("   A branch from before the 2026-10-01 purges still carries them. Rebase only its own commits onto", file=sys.stderr)
        print("   origin/main (git rebase --onto origin/main <old base> <branch>) and push that instead.", file=sys.stderr)
        sys.exit(1)


def main():
    if sys.argv[1:2] == ["--push"]:
        check_push(sys.argv[2:])
        return
    files = subprocess.run(["git", "ls-files", "-z"], capture_output=True, text=True, check=True).stdout.split("\0")
    bad = flag(files)
    if bad:
        print("⛔ private documents are tracked in this public repo:", file=sys.stderr)
        for f, what in bad:
            print(f"   {f}  ({what})", file=sys.stderr)
        print("   Remove them with `git rm --cached` and keep them outside the repo (see SWED-107).", file=sys.stderr)
        sys.exit(1)
    print(f"✓ no private documents in {len([f for f in files if f])} tracked file(s)")


if __name__ == "__main__":
    main()
