#!/usr/bin/env python3
"""recolor_cheeks.py: take the pink out of a drawn cheek by recolouring it to the skin around it (SWED-91).
  python3 scripts/pictures/recolor_cheeks.py <in.png> <out.png> cx,cy,rx,ry [cx,cy,rx,ry ...]
For each oval (centre and radii in card pixels), the skin inside takes the colour and lightness of a ring of skin just
outside it, feathered at the edge; outlines, hair, beards and white background are left alone. Works on <id>.png and on
the transparent <id>-cut.png alike. Used in round six (2026-10-01) for the grandfather in "family", whose blush three
FLUX edit passes could not remove (the last one painted bright pink circles instead).
"""
import sys

import numpy as np
from PIL import Image

M = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
WHITE = np.array([0.95047, 1.0, 1.08883])


def rgb2lab(rgb):
    c = np.where(rgb > 0.04045, ((rgb + 0.055) / 1.055) ** 2.4, rgb / 12.92)
    xyz = c @ M.T / WHITE
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def lab2rgb(lab):
    fy = (lab[..., 0] + 16) / 116
    fx, fz = fy + lab[..., 1] / 500, fy - lab[..., 2] / 200
    f = np.stack([fx, fy, fz], -1)
    xyz = np.where(f ** 3 > 0.008856, f ** 3, (f - 16 / 116) / 7.787) * WHITE
    c = xyz @ np.linalg.inv(M).T
    rgb = np.where(c > 0.0031308, 1.055 * np.clip(c, 0, None) ** (1 / 2.4) - 0.055, 12.92 * c)
    return np.clip(rgb, 0, 1)




def fix(src, dst, cheeks):
    img = Image.open(src)
    has_alpha = img.mode == "RGBA"
    arr = np.asarray(img.convert("RGBA")).astype(float) / 255.0
    rgb, alpha = arr[..., :3], arr[..., 3]
    lab = rgb2lab(rgb)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    yy, xx = np.mgrid[0:rgb.shape[0], 0:rgb.shape[1]]
    skin = (L > 45) & (L < 90) & (b > 12)
    for (cx, cy), (rx, ry) in cheeks:
        d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
        ring = skin & (d > 1.3) & (d < 2.0)
        tL, ta, tb = np.median(L[ring]), np.median(a[ring]), np.median(b[ring])
        w = np.clip((1.35 - d) / 0.5, 0, 1) * skin  # 1 inside, feathered to 0 at the oval's edge
        a[:] = a + w * (ta - a)
        b[:] = b + w * (tb - b)
        L[:] = np.where(L < tL, L + 0.85 * w * (tL - L), L)  # the blush also darkened the cheek
        print(f"cheek {cx},{cy}: target L={tL:.1f} a*={ta:.1f} b*={tb:.1f}, pixels touched={(w > 0).sum()}")
    out = lab2rgb(np.stack([L, a, b], -1))
    out = np.concatenate([out, alpha[..., None]], -1) if has_alpha else out
    Image.fromarray((out * 255 + 0.5).astype("uint8")).save(dst)


if __name__ == "__main__":
    # the oval spec: cx,cy,rx,ry for each cheek, for example 149,296,19,15 214,296,19,16 (the family grandfather)
    fix(sys.argv[1], sys.argv[2], [((s[0], s[1]), (s[2], s[3])) for s in (tuple(map(int, v.split(","))) for v in sys.argv[3:])])
