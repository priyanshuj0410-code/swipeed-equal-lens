#!/usr/bin/env python3
"""flux_edit.py: change one detail of finished picture cards with FLUX.2 [klein] 4B edit, keeping the rest (SWED-91).
  <mflux python> flux_edit.py <out dir> <instruction> <picture.png> [<picture.png> ...] [--seed N]
Each picture is its own reference: the model redraws it following the instruction, so an approved picture keeps its
pose, people and colours instead of being drawn again from text. Writes <out>/<id>.png, <id>-cut.png and log.json.
Used in round five after the owner found the cheek blush too strong, and in round six when the owner dropped the blush.
"""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from flux_batch import cut_out  # noqa: E402

KEEP = ("Keep this exact picture: the same people, faces, poses, hair, clothes, objects, colours, outlines, shading, "
        "framing and plain white background. Change only this: ")


def main():
    from mflux.models.common.config import ModelConfig
    from mflux.models.flux2.variants import Flux2KleinEdit

    args = [a for a in sys.argv[1:]]
    seed = 7
    if "--seed" in args:
        i = args.index("--seed")
        seed = int(args[i + 1])
        del args[i:i + 2]
    out, instruction, pictures = args[0], args[1], args[2:]
    os.makedirs(out, exist_ok=True)
    model = Flux2KleinEdit(quantize=8, model_config=ModelConfig.flux2_klein_4b())
    log_path = os.path.join(out, "log.json")
    log = json.load(open(log_path)) if os.path.exists(log_path) else {"instruction": instruction, "pictures": []}
    for src in pictures:
        cid = os.path.basename(src)[:-4]
        t = time.time()
        path = os.path.join(out, f"{cid}.png")
        model.generate_image(seed=seed, prompt=KEEP + instruction, num_inference_steps=4, width=768, height=768,
                             image_paths=[src]).save(path)
        cut_out(path, os.path.join(out, f"{cid}-cut.png"))
        log["pictures"] = [p for p in log["pictures"] if p["id"] != cid]
        log["pictures"].append({"id": cid, "source": src, "seed": seed, "seconds": round(time.time() - t, 1)})
        print(f"{cid}: {log['pictures'][-1]['seconds']}s", flush=True)
        json.dump(log, open(log_path, "w"), indent=1)


if __name__ == "__main__":
    main()
