#!/usr/bin/env python3
"""release.py: version and release SwipeEd (SWED-108).
SwipeEd ships continuously (every merge to main deploys), so releases use calendar versions: YYYY.M.N, where N
counts the releases already made that month (2026.10.0, 2026.10.1, ...). The version is valid semver, so it sits in
package.json; each release is an annotated git tag vYYYY.M.N and a GitHub release whose notes come from the project
log (knowledge/log/log.md).

  python3 scripts/release.py --next                 print the next version
  python3 scripts/release.py --bump                 on the branch you are about to merge: set package.json and
                                                    package-lock.json to the next version
  python3 scripts/release.py --notes [--since DATE] print the notes for the next release
  python3 scripts/release.py --publish [--since DATE] [--intro FILE] [--dry-run]
                                                    on main after the merge is pushed: tag HEAD with the version in
                                                    package.json, push the tag, create the GitHub release

The notes list every log entry dated after the previous release (or on or after --since for the first one). Git
identity comes from the environment (GIT_AUTHOR_NAME and friends) or git config, as for any commit.
"""
import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG = os.path.join(ROOT, "knowledge", "log", "log.md")
REPO_URL = "https://github.com/priyanshuj0410-code/swipeed-equal-lens"
ENTRY = re.compile(r"^## (\d{4}-\d{2}-\d{2}) · ([^:]+): (.+)$")


def git(*args, check=True):
    return subprocess.run(["git", "-C", ROOT, *args], capture_output=True, text=True, check=check).stdout.strip()


def tags():
    out = git("tag", "--list", "v*")
    found = []
    for t in out.split():
        m = re.fullmatch(r"v(\d{4})\.(\d{1,2})\.(\d+)", t)
        if m:
            found.append((int(m[1]), int(m[2]), int(m[3]), t))
    return sorted(found)


def next_version(today=None):
    today = today or datetime.date.today()
    n = [x[2] for x in tags() if x[0] == today.year and x[1] == today.month]
    return f"{today.year}.{today.month}.{max(n) + 1 if n else 0}"


def last_release():
    t = tags()
    if not t:
        return None, None
    tag = t[-1][3]
    when = git("log", "-1", "--format=%cs", tag)
    return tag, datetime.date.fromisoformat(when)


def log_entries(since=None):
    entries = []
    for line in open(LOG, encoding="utf8"):
        m = ENTRY.match(line.rstrip("\n"))
        if not m:
            continue
        day = datetime.date.fromisoformat(m[1])
        if since and day < since:
            continue
        entries.append((day, m[2].strip(), m[3].strip()))
    return entries


def entries_added_since(tag):
    """The log entries added to knowledge/log/log.md since a tag, in log order (newest first)."""
    diff = git("diff", f"{tag}..HEAD", "--", "knowledge/log/log.md")
    added = []
    for line in diff.splitlines():
        if line.startswith("+") and not line.startswith("+++"):
            m = ENTRY.match(line[1:])
            if m:
                added.append((datetime.date.fromisoformat(m[1]), m[2].strip(), m[3].strip()))
    return added


def notes(version, since=None, intro=None):
    tag, _ = last_release()
    entries = log_entries(since=since) if since or not tag else entries_added_since(tag)
    lines = [f"SwipeEd {version}, live at https://swipeed.vercel.app.", ""]
    if intro:
        lines += [open(intro, encoding="utf8").read().strip(), ""]
    lines.append("## What changed")
    lines.append("")
    if not entries:
        lines.append("No log entries since the last release.")
    for day, area, title in entries:
        lines.append(f"- **{area}** ({day:%d %b}): {title}")
    lines.append("")
    since_text = f"since {tag}" if tag and not since else "in full"
    lines.append(f"Read the [project log]({REPO_URL}/blob/v{version}/knowledge/log/log.md) {since_text}.")
    return "\n".join(lines) + "\n"


def set_version(version):
    for name in ("package.json", "package-lock.json"):
        path = os.path.join(ROOT, name)
        data = json.load(open(path, encoding="utf8"))
        data["version"] = version
        if name == "package-lock.json" and "" in data.get("packages", {}):
            data["packages"][""]["version"] = version
        with open(path, "w", encoding="utf8") as f:
            f.write(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def publish(since=None, intro=None, dry_run=False):
    version = json.load(open(os.path.join(ROOT, "package.json"), encoding="utf8"))["version"]
    tag = f"v{version}"
    if tag in {t[3] for t in tags()}:
        sys.exit(f"{tag} already exists; run --bump on the next change first")
    if not re.fullmatch(r"\d{4}\.\d{1,2}\.\d+", version):
        sys.exit(f"package.json version {version} is not a calendar version; run --bump first")
    if git("rev-parse", "--abbrev-ref", "HEAD") != "main":
        sys.exit("publish from main")
    git("fetch", "-q", "origin", "main")
    if git("rev-parse", "HEAD") != git("rev-parse", "origin/main"):
        sys.exit("main is not the same as origin/main: push or pull first")
    body = notes(version, since, intro)
    if dry_run:
        print(f"would tag {tag} at {git('rev-parse', '--short', 'HEAD')}\n\n{body}")
        return
    git("tag", "-a", tag, "-m", f"SwipeEd {version}")
    git("push", "-q", "origin", tag)
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf8") as f:
        f.write(body)
    subprocess.run(["gh", "release", "create", tag, "--title", f"SwipeEd {version}", "--notes-file", f.name,
                    "--verify-tag"], cwd=ROOT, check=True)
    os.unlink(f.name)
    print(f"released {tag}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--next", action="store_true")
    ap.add_argument("--bump", action="store_true")
    ap.add_argument("--notes", action="store_true")
    ap.add_argument("--publish", action="store_true")
    ap.add_argument("--since", type=datetime.date.fromisoformat)
    ap.add_argument("--intro")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    if a.next:
        print(next_version())
    elif a.bump:
        v = next_version()
        set_version(v)
        print(f"package.json and package-lock.json set to {v}")
    elif a.notes:
        print(notes(next_version(), a.since, a.intro))
    elif a.publish:
        publish(a.since, a.intro, a.dry_run)
    else:
        ap.print_help()


if __name__ == "__main__":
    main()
