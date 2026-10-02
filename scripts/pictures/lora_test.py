#!/usr/bin/env python3
"""lora_test.py: draw the same prompts with and without trained picture LoRAs, side by side (SWED-112).
  <mflux python> scripts/pictures/lora_test.py <out dir> <prompts.json> <variant> [<variant> ...] [--size 768]
A variant is "none", or one or more LoRAs joined by "+", each <checkpoint.zip or .safetensors>[@scale], for example
  none  runs/characters/checkpoints/0000740_checkpoint.zip@1.0  a.zip@0.8+b.zip@0.6
prompts.json: [{"id": "...", "prompt": "...", "seed": 7}, ...]. Writes <out>/<variant n>/<id>.png and <out>/sheet.jpg
(rows are prompts, columns are variants). Run it with the mflux tool's Python (~/.local/share/uv/tools/mflux/bin/python).
"""
import json
import os
import sys
import zipfile

from PIL import Image, ImageDraw


def adapter(path, out):
    if not path.endswith(".zip"):
        return path
    with zipfile.ZipFile(path) as z:
        names = [n for n in z.namelist() if n.endswith("_adapter.safetensors")]
        if not names:
            sys.exit(f"no .safetensors adapter inside {path}")
        target = os.path.join(out, "adapters", os.path.basename(path)[:-4] + ".safetensors")
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with z.open(names[0]) as src, open(target, "wb") as dst:
            dst.write(src.read())
        return target


def main():
    from mflux.models.common.config import ModelConfig
    from mflux.models.flux2.variants import Flux2Klein

    args = sys.argv[1:]
    size = 768
    if "--size" in args:
        i = args.index("--size")
        size = int(args[i + 1])
        del args[i:i + 2]
    out, prompts, variants = args[0], json.load(open(args[1])), args[2:]
    os.makedirs(out, exist_ok=True)
    for n, variant in enumerate(variants):
        paths, scales = [], []
        if variant != "none":
            for part in variant.split("+"):
                p, _, s = part.partition("@")
                paths.append(adapter(p, out))
                scales.append(float(s or 1.0))
        model = Flux2Klein(quantize=8, model_config=ModelConfig.flux2_klein_4b(),
                           lora_paths=paths or None, lora_scales=scales or None)
        folder = os.path.join(out, f"v{n}")
        os.makedirs(folder, exist_ok=True)
        open(os.path.join(folder, "variant.txt"), "w").write(variant)
        for p in prompts:
            model.generate_image(seed=p.get("seed", 7), prompt=p["prompt"], num_inference_steps=4,
                                 width=size, height=size).save(os.path.join(folder, f"{p['id']}.png"))
            print(f"v{n} {p['id']}", flush=True)
        del model
    cell = 256
    sheet = Image.new("RGB", (cell * len(variants), (cell + 16) * len(prompts) + 16), "white")
    draw = ImageDraw.Draw(sheet)
    for n, variant in enumerate(variants):
        label = "none" if variant == "none" else "+".join(os.path.basename(v.split("@")[0]).split("_")[0] +
                                                        ("@" + v.split("@")[1] if "@" in v else "") for v in variant.split("+"))
        draw.text((n * cell + 4, 2), f"v{n} {label}", fill="black")
        for r, p in enumerate(prompts):
            im = Image.open(os.path.join(out, f"v{n}", f"{p['id']}.png")).convert("RGB").resize((cell, cell))
            sheet.paste(im, (n * cell, 16 + r * (cell + 16) + 16))
            if n == 0:
                draw.text((4, 16 + r * (cell + 16) + 2), p["id"], fill="black")
    sheet.save(os.path.join(out, "sheet.jpg"), quality=85)


if __name__ == "__main__":
    main()
