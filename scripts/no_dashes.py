#!/usr/bin/env python3
"""no_dashes.py: fail if any tracked text file contains an em dash or an en dash (SWED-92).

The Equal Lens never uses them, in content, UI, code comments, scripts or docs. Write around them: two sentences, a comma,
a colon, "like" or "such as", or a hyphen for numeric ranges (3-6). A spaced hyphen is not a dash substitute in copy.

Usage: python3 scripts/no_dashes.py [paths...]   (default: every file git tracks; text types only either way)

Skipped: .read-first/ holds hash-pinned attestations quoting source documents word for word, so rewriting them would
break the pins.
"""
import os
import subprocess
import sys

TEXT = (".ts", ".tsx", ".js", ".mjs", ".cjs", ".jsx", ".css", ".md", ".mdx", ".json", ".py", ".sh", ".txt", ".html",
        ".yml", ".yaml", ".svg", ".webmanifest", ".env.example")
DASHES = ("\u2014", "\u2013")
SKIP = (".read-first/",)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def tracked():
    out = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, check=True).stdout
    return out.splitlines()


def scannable(p):
    return p.endswith(TEXT) and not p.startswith(SKIP)


def find(paths):
    hits = []
    for p in filter(scannable, paths):
        full = os.path.join(ROOT, p)
        if not os.path.isfile(full):
            continue
        try:
            text = open(full, encoding="utf8").read()
        except (UnicodeDecodeError, OSError):
            continue
        if not any(d in text for d in DASHES):
            continue
        for n, line in enumerate(text.splitlines(), 1):
            if any(d in line for d in DASHES):
                hits.append((p, n, line.strip()[:100]))
    return hits


def main():
    paths = [p for p in (sys.argv[1:] or tracked()) if scannable(p)]
    hits = find(paths)
    for p, n, line in hits[:40]:
        print(f"  {p}:{n}  {line}")
    if hits:
        print(f"✗ {len(hits)} line(s) with an em or en dash in {len({h[0] for h in hits})} file(s). Rewrite without them.")
        sys.exit(1)
    print(f"✓ no em or en dashes in {len(paths)} file(s)")


if __name__ == "__main__":
    main()
