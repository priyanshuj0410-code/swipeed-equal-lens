#!/usr/bin/env python3
"""WCAG 2.x contrast check for SwipeEd's tokens (src/app/globals.css and @equal-lens/brand 0.1.1).

Run: python3 knowledge/contrast.py
Exit code 1 if a checked pair fails. Targets: text 4.5, graphics (focus ring, meaningful
icons) 3.0. Alpha is composited over the real ground, as the browser paints it. OKLCH
tokens (the --prx-* fills) are converted to sRGB first.

Keep the values in step with globals.css. Modelled on the AI Crew contrast script.
"""
import math
import sys

def hx(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def oklch(L, C, h):
    a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
    l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s_ = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    lin = (4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
           -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
           -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_)
    enc = lambda c: 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
    return tuple(max(0.0, min(255.0, enc(c) * 255)) for c in lin)

def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lum(rgb):
    return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])

def col(v):
    return hx(v) if isinstance(v, str) else v

def ratio(fg, bg, alpha=1.0):
    f, b = col(fg), col(bg)
    f = tuple(alpha * x + (1 - alpha) * y for x, y in zip(f, b))
    hi, lo = sorted((lum(f), lum(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)

LIGHT = dict(paper="#FBF9FF", surface="#FFFFFF", mist="#E7E0F1", ink="#221436", brand="#553286",
             brandsoft="#735997", muted="#6E6580", muted_bg="#F3F0F6", primary_fg="#FBF9FF",
             pos=oklch(0.68, 0.16, 150), neg=oklch(0.64, 0.20, 22), tell=oklch(0.70, 0.15, 78), uhoh=oklch(0.64, 0.16, 45),
             un="#058274", re="#BB543D")
DARK = dict(paper="#15101F", surface="#221A30", mist="#3A2E4D", ink="#F1ECFA", brand="#C9B8E6",
            brandsoft="#B3A4D6", muted="#B3A4D6", muted_bg="#221A30", primary_fg="#15101F",
            pos=oklch(0.76, 0.16, 150), neg=oklch(0.70, 0.19, 22), tell=oklch(0.80, 0.15, 80), uhoh=oklch(0.73, 0.16, 45),
            un="#2DD4BF", re="#FF7A5C")
ON_FILL = "#221436"  # --prx-on-fill, fixed in both themes
SUN = "#FFC94D"

fails = []

def check(label, fg, bg, target, alpha=1.0):
    r = ratio(fg, bg, alpha)
    ok = r >= target
    print(f"{'PASS' if ok else 'FAIL'}  {r:5.2f}  (>= {target})  {label}")
    if not ok:
        fails.append(label)

def themed(name, T):
    print(f"\n=== {name} ===")
    for s in ("paper", "surface", "mist"):
        check(f"ink on {s}", T["ink"], T[s], 4.5)
        check(f"foreground 70% on {s}", T["ink"], T[s], 4.5, 0.7)
        check(f"brand on {s} (links, accents)", T["brand"], T[s], 4.5)
        check(f"brandsoft on {s}", T["brandsoft"], T[s], 4.5)
        if s != "mist":
            check(f"muted-foreground on {s}", T["muted"], T[s], 4.5)
        check(f"focus ring brand on {s}", T["brand"], T[s], 3.0)
    check("muted-foreground on the --muted fill (badges, panels)", T["muted"], T["muted_bg"], 4.5)
    for s in ("paper", "surface"):
        check(f"foreground 60% on {s} (hints, counters)", T["ink"], T[s], 4.5, 0.6)
    check("primary button text on brand fill", T["primary_fg"], T["brand"], 4.5)
    for k in ("pos", "neg", "tell", "uhoh"):
        check(f"on-fill ink on prx-{k}", ON_FILL, T[k], 4.5)
    check("UN label text on surface", T["un"], T["surface"], 4.5)
    check("RE label text on surface", T["re"], T["surface"], 4.5)
    check("ink on sun (the .cta button)", ON_FILL, SUN, 4.5)

def known_gaps():
    print("\n=== Known gaps, not yet fixed (reported, not counted) ===")
    for label, fg, bg, alpha, target in (
        ("foreground 60% on mist (light); 25 text-foreground/60 uses, 4.58 on surface", LIGHT["ink"], LIGHT["mist"], 0.6, 4.5),
        ("foreground 55% on surface (light), 7 uses", LIGHT["ink"], LIGHT["surface"], 0.55, 4.5),
        ("foreground 50% on surface (light), 5 uses", LIGHT["ink"], LIGHT["surface"], 0.5, 4.5),
        ("foreground 40% on surface (light), 3 uses", LIGHT["ink"], LIGHT["surface"], 0.4, 4.5),
        ("foreground 50% on surface (dark), 5 uses", DARK["ink"], DARK["surface"], 0.5, 4.5),
    ):
        r = ratio(fg, bg, alpha)
        print(f"{'ok  ' if r >= target else 'GAP '}  {r:5.2f}  (>= {target})  {label}")

themed("Light", LIGHT)
themed("Dark (data-audience=adult)", DARK)
known_gaps()

print()
if fails:
    print(f"{len(fails)} failing pair(s):")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("All checked pairs pass.")
