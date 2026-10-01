#!/usr/bin/env python3
"""lora_dataset.py: cut LoRA training images out of an illustrated PDF, such as the Lensy comic (SWED-112).
  python3 scripts/pictures/lora_dataset.py pages <comic.pdf> <work dir>
      extracts every page picture once (identical pages are dropped) into <work>/pages
  python3 scripts/pictures/lora_dataset.py candidates <work dir> [--size 512] [--stride 256] [--max-bubble 0.06]
      slides square windows over every page and keeps those with little speech-bubble paper in them, as numbered
      candidates in <work>/candidates, plus contact sheets in <work>/sheets for a person to choose from
  python3 scripts/pictures/lora_dataset.py build <work dir> <captions.json> <dataset dir> [--px 768]
      writes the chosen crops and their captions as mflux-train pairs: 01.png + 01.txt, ...
      captions.json: {"<candidate id, page:x,y,w,h or file:/path.png>": "caption", ...}; "preview_N" keys become
      preview_N.txt
Comic pages carry lettering in cream speech bubbles; a model trained on them learns to draw garbled text, so windows
where bubble paper (very light, low-colour pixels) covers more than --max-bubble of the area are not offered.
"""
import hashlib
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw

SHEET_COLS, SHEET_THUMB = 4, 180
NEWLINE_LIMIT = 170  # the image reader refuses files with more newline bytes than this


def arg(name, default, cast=int):
    return cast(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default


def pages(pdf, work):
    raw = os.path.join(work, "raw")
    out = os.path.join(work, "pages")
    os.makedirs(raw, exist_ok=True)
    os.makedirs(out, exist_ok=True)
    subprocess.run(["pdfimages", "-png", pdf, os.path.join(raw, "img")], check=True)
    seen, n = set(), 0
    for f in sorted(os.listdir(raw)):
        im = Image.open(os.path.join(raw, f))
        if im.mode in ("L", "1"):  # soft masks that ride along with each page
            continue
        digest = hashlib.sha1(im.convert("RGB").tobytes()).hexdigest()
        if digest in seen:
            continue
        seen.add(digest)
        n += 1
        im.convert("RGB").save(os.path.join(out, f"p{n:02d}.png"))
    print(f"{n} unique page pictures in {out}")


def bubble_fraction(rgb):
    a = rgb.astype(int)
    light = a.min(-1) > 205
    grey = (a.max(-1) - a.min(-1)) < 40
    return float((light & grey).mean())


def small_jpeg(im, path):
    for q in (70, 60, 50, 42, 35, 28, 22):
        im.save(path, quality=q)
        if open(path, "rb").read().count(b"\n") < NEWLINE_LIMIT:
            return
    print(f"warning: {path} is still over the reader limit")


def candidates(work):
    size, stride = arg("--size", 512), arg("--stride", 256)
    max_bubble = arg("--max-bubble", 0.06, float)
    out, sheets = os.path.join(work, "candidates"), os.path.join(work, "sheets")
    os.makedirs(out, exist_ok=True)
    os.makedirs(sheets, exist_ok=True)
    index = {}
    for f in sorted(os.listdir(os.path.join(work, "pages"))):
        page = Image.open(os.path.join(work, "pages", f)).convert("RGB")
        arr = np.asarray(page)
        h, w, _ = arr.shape
        for y in range(0, h - size + 1, stride):
            for x in range(0, w - size + 1, stride):
                win = arr[y:y + size, x:x + size]
                if bubble_fraction(win) > max_bubble or win.std() < 25:
                    continue
                cid = f"{f[:-4]}-{x:04d}-{y:04d}"
                index[cid] = {"page": f, "box": [x, y, size, size]}
                Image.fromarray(win).save(os.path.join(out, f"{cid}.png"))
    json.dump(index, open(os.path.join(work, "candidates.json"), "w"), indent=1)
    ids = sorted(index)
    per = SHEET_COLS * 3
    for s in range(0, len(ids), per):
        group = ids[s:s + per]
        rows = (len(group) + SHEET_COLS - 1) // SHEET_COLS
        sheet = Image.new("RGB", (SHEET_COLS * SHEET_THUMB, rows * (SHEET_THUMB + 14)), "white")
        draw = ImageDraw.Draw(sheet)
        for i, cid in enumerate(group):
            t = Image.open(os.path.join(out, f"{cid}.png")).resize((SHEET_THUMB, SHEET_THUMB))
            x, y = (i % SHEET_COLS) * SHEET_THUMB, (i // SHEET_COLS) * (SHEET_THUMB + 14)
            sheet.paste(t, (x, y + 14))
            draw.text((x + 2, y + 1), cid, fill="black")
        small_jpeg(sheet, os.path.join(sheets, f"sheet-{s // per + 1:03d}.jpg"))
    print(f"{len(ids)} candidates, {(len(ids) + per - 1) // per} sheets in {sheets}")


def build(work, captions_path, dataset):
    px = arg("--px", 768)
    caps = json.load(open(captions_path))
    os.makedirs(dataset, exist_ok=True)
    index = json.load(open(os.path.join(work, "candidates.json"))) if os.path.exists(
        os.path.join(work, "candidates.json")) else {}
    n = 0
    for key, caption in caps.items():
        if key.startswith("preview_"):
            open(os.path.join(dataset, f"{key}.txt"), "w").write(caption)
            continue
        if key.startswith("file:"):  # a whole picture, such as brand art
            crop = Image.open(key[5:]).convert("RGB")
            bw, bh = crop.size
        else:
            if ":" in key:  # page:x,y,w,h for a hand-picked box
                page, box = key.split(":")
                x, y, bw, bh = map(int, box.split(","))
            else:
                page, (x, y, bw, bh) = index[key]["page"], index[key]["box"]
            im = Image.open(os.path.join(work, "pages", page if page.endswith(".png") else f"{page}.png")).convert("RGB")
            crop = im.crop((x, y, x + bw, y + bh))
        scale = px / max(bw, bh)
        crop = crop.resize((round(bw * scale) // 16 * 16, round(bh * scale) // 16 * 16), Image.LANCZOS)
        n += 1
        crop.save(os.path.join(dataset, f"{n:02d}.png"))
        open(os.path.join(dataset, f"{n:02d}.txt"), "w").write(caption)
    print(f"{n} training pairs in {dataset}")


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "pages":
        pages(sys.argv[2], sys.argv[3])
    elif cmd == "candidates":
        candidates(sys.argv[2])
    elif cmd == "build":
        build(sys.argv[2], sys.argv[3], sys.argv[4])
    else:
        sys.exit(__doc__)
