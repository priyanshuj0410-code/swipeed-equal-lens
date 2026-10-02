#!/usr/bin/env python3
"""previews.py: small JPEG previews of generated picture cards for image review (SWED-91).
  python3 scripts/pictures/previews.py <picture dir> [<out dir>]
For every <id>.png in the picture dir, writes <out>/<id>.jpg (the whole card) and <id>-heads.jpg (the top of the drawn
figures, magnified, where hair and faces are easiest to check). Each file is kept small enough for an image reader that
refuses large images. The out dir defaults to <picture dir>/previews.
"""
import os
import sys

from PIL import Image

LIMIT = 170


def save_small(im, path, side):
    im = im.convert("RGB")
    im.thumbnail((side, side), Image.LANCZOS)
    for q in (80, 72, 64, 56, 48, 40):
        im.save(path, quality=q)
        if open(path, "rb").read().count(b"\n") < LIMIT:
            return
    save_small(im, path, int(side * 0.8))


def heads(im):
    """The top 40% of the drawn figures (the non-white bounding box), where the heads are."""
    g = im.convert("L").point(lambda v: 255 if v < 235 else 0)
    box = g.getbbox() or (0, 0, im.width, im.height)
    left, top, right, bottom = box
    return im.crop((left, top, right, top + int((bottom - top) * 0.4)))


def main():
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(src, "previews")
    os.makedirs(out, exist_ok=True)
    n = 0
    for name in sorted(os.listdir(src)):
        if not name.endswith(".png") or name.endswith("-cut.png"):
            continue
        cid = name[:-4]
        im = Image.open(os.path.join(src, name))
        save_small(im, os.path.join(out, f"{cid}.jpg"), 512)
        save_small(heads(im), os.path.join(out, f"{cid}-heads.jpg"), 512)
        n += 1
    print(f"{out}: {n} pictures")


if __name__ == "__main__":
    main()
