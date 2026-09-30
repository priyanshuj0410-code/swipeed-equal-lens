#!/usr/bin/env python3
"""flux_batch.py: SwipeEd picture-card style test with FLUX.2 [klein] 4B (Apache 2.0) on the local Mac via mflux (SWED-91).

  <mflux python> flux_batch.py <out dir> [--style flat|shaded] [--edit <ref.png>[,<ref.png>...]] [--only id,id]

Run it with the mflux tool's Python (~/.local/share/uv/tools/mflux/bin/python). It loads the model once and writes, for
every concept, <id>.png (as generated) and <id>-cut.png (the white background made transparent for answer cards), plus
log.json with the prompt, seed and seconds of each picture. --edit draws in the style of a reference image (Lensy's art)
instead of from the text style alone; several references can be given, comma separated.

Round two (2026-09-30), after the owner chose the Lensy style but found it too flat: the brand's no-shadows rule is
for the UI, not illustrations, and Lensy, UN and RE are 2D with soft shading and light. --style shaded asks for that
look. The concepts also carry round one's fixes: black or dark brown hair for every child, no "fair" skin (it came out
blonde), and clearer poses for shy, proud, curious, slow breaths, count to five, share the toy, take turns, wait your
turn, walk away, and a whole joint family.

Changes after the first test batch (2026-09-15): an explicit skin tone and outfit per person, because every child came
out the same medium brown; "count to five" asks for all five fingers, because one raised finger read as "one"; a pure
white background that is cut to transparent, because a faint cream square sat behind each figure; and a man teacher and
a grandfather, so helpers are not all women.
"""
import json
import os
import sys
import time

from PIL import Image, ImageDraw

BACKGROUND = ("Pure white background, no frame, no border, no background shape, one centred subject with space around "
              "it, no text, no letters, no numbers. Every child's hair is black or dark brown, never purple or lavender.")
STYLES = {
    "flat": ("Rounded friendly shapes, big friendly eyes, thick soft dark purple outlines, simple flat colours with no "
             "gradients, no shadows, no texture. Limited palette of violet, lavender, cream and sunny yellow for clothes "
             "and objects. " + BACKGROUND),
    "shaded": ("2D cartoon mascot style like the reference: rounded friendly shapes, big glossy eyes with white "
               "highlights, thick soft dark purple outlines. Clearly visible soft cel shading with one light source from the upper left: "
               "lighter highlight tones on the top and left of every shape, gentle darker shade tones on the lower right, "
               "soft shading on faces, hair and clothes, a glossy highlight on the hair, rosy cheeks, a faint paper grain texture, and a soft oval shadow "
               "on the ground under the figures. Palette of violet, lavender, cream and sunny yellow for clothes and "
               "objects, with natural skin tones. " + BACKGROUND),
}
STYLE = STYLES["flat"]

# (id, card word, subject): Feelings Friends concepts. Skin tones, genders and outfits vary on purpose.
CONCEPTS = [
    ("happy", "Happy", "A young Indian boy with deep brown skin and short curly black hair, in a yellow t-shirt, smiling widely with bright eyes, arms open."),
    ("sad", "Sad", "A young Indian girl with light brown skin and a black ponytail, in a lavender frock, looking sad with a small tear and a droopy mouth, sitting quietly."),
    ("angry", "Angry", "A young Indian girl with medium brown skin and two black braids, in a violet kurta, feeling angry, frowning with scrunched eyebrows and clenched fists."),
    ("scared", "Scared", "A young Indian boy with light brown skin and black hair, in striped pyjamas, looking a little scared with wide eyes, hugging his knees, gentle and not frightening."),
    ("calm", "Calm", "A young Indian boy with dark brown skin and black hair, in a white kurta, sitting cross-legged with a relaxed gentle smile and soft closed eyes."),
    ("excited", "Excited", "A young Indian girl with light brown skin and short black bobbed hair, in a yellow dress, jumping with excitement, both arms up, big open smile."),
    ("shy", "Shy", "A young Indian boy with medium brown skin and black hair, in a school uniform shirt, feeling shy: half hiding behind a door frame, peeking out with a small shy smile and rosy cheeks, one finger at his lips."),
    ("proud", "Proud", "A young Indian girl with deep brown skin and two puffs of curly black hair, in a lavender t-shirt, standing tall and holding up her own drawing with both hands, chin up, big proud smile."),
    ("sleepy", "Sleepy", "A young Indian boy with light brown skin and black hair, in blue pyjamas, yawning and rubbing one eye, holding a soft toy."),
    ("curious", "Curious", "A young Indian girl with medium brown skin, wearing a small headscarf, looking at a green leaf through a big round magnifying glass with a dark handle, curious open eyes."),
    ("breathe", "Slow breaths", "A young Indian girl with dark brown skin and two black braids, standing and taking a slow deep breath: eyes gently closed, chest lifted, one hand resting flat on her tummy and the other on her chest, calm peaceful smile."),
    ("hug", "A hug", "A mother with medium brown skin and black hair in a simple salwar kameez giving her young son a warm hug, both smiling with eyes closed."),
    ("quiet-time", "Quiet time", "A young Indian girl with light brown skin and black hair sitting on a floor cushion in a cosy corner, reading a picture book calmly."),
    ("squeeze-toy", "Squeeze a soft toy", "A young Indian boy with deep brown skin and black hair gently squeezing a soft teddy bear to calm down, eyes closed, calm face."),
    ("count", "Count to five", "A young Indian girl with medium brown skin and black hair, shown from the waist up, holding one open hand up beside her face with all five fingers clearly spread apart, the whole hand inside the picture, counting calmly."),
    ("draw-feeling", "Draw your feeling", "A young Indian boy with light brown skin and black hair drawing a big coloured scribble with crayons on paper at a small table."),
    ("tell-grown-up", "Tell a grown-up", "A young Indian girl with dark brown skin and black hair talking to her kind grandfather with a white moustache, who is kneeling down to listen closely, both calm."),
    ("ask-help", "Ask for help", "A young Indian boy with medium brown skin and black hair raising his hand in a classroom while a smiling man teacher in a shirt and glasses walks over to help."),
    ("share-toy", "Share the toy", "Two young Indian children, a boy with deep brown skin and black hair and a girl with light brown skin and two black plaits, happily sharing one single toy car: he hands it to her."),
    ("take-turns", "Take turns", "Taking turns on one single swing: a young Indian girl with medium brown skin and black hair swings on it, while a boy with dark brown skin and black hair stands beside the swing, waiting for his turn and smiling."),
    ("say-sorry", "Say sorry", "A young Indian boy with light brown skin and black hair gently saying sorry to a girl friend with deep brown skin, hand on his chest, kind face, she is smiling."),
    ("help-friend", "Help a sad friend", "A young Indian girl with medium brown skin and black hair putting a caring hand on the shoulder of a sad friend with light brown skin and short black hair, both sitting on a bench."),
    ("wait-turn", "Wait your turn", "Three young Indian children with black hair standing one behind the other in a short line at a drinking water tap: the first child drinks, the two behind wait patiently, smiling."),
    ("talk-trust", "Someone I trust", "A young Indian boy with dark brown skin and black hair sitting beside his father on a sofa, talking while the father listens kindly."),
    ("walk-away", "Walk away calmly", "A young Indian girl with light brown skin and black hair calmly walking away with a steady face, while two small children behind her argue."),
    ("play-together", "Play together", "Three young Indian children with black hair, one with deep brown skin, one with medium brown skin and one with light brown skin, building a tower of blocks together, laughing."),
    ("grandmother", "Grandmother", "A smiling Indian grandmother with medium brown skin, grey hair in a bun and a simple sari, waving warmly."),
    ("teacher", "Teacher", "A friendly Indian woman teacher with dark brown skin and black hair holding a book, smiling, standing in front of a small green board with no writing."),
    ("friend", "Friend", "Two young Indian children with black hair, best friends, one with light brown skin and one with deep brown skin, walking side by side and holding hands, smiling."),
    ("family", "Family", "An Indian joint family at home: a grandfather, a grandmother, a mother, a father and two young children, with a range of skin tones, all sitting together on a sofa, smiling."),
]


def cut_out(src, dst, thresh=28):
    """Make the white background transparent: flood fill from every border pixel that is near white."""
    img = Image.open(src).convert("RGB")
    w, h = img.size
    key = (255, 0, 255)
    work = img.copy()
    px = work.load()
    for x, y in [(x, 0) for x in range(0, w, 8)] + [(x, h - 1) for x in range(0, w, 8)] + [(0, y) for y in range(0, h, 8)] + [(w - 1, y) for y in range(0, h, 8)]:
        r, g, b = px[x, y]
        if min(r, g, b) > 225 and px[x, y] != key:
            ImageDraw.floodfill(work, (x, y), key, thresh=thresh)
    out = img.convert("RGBA")
    o, k = out.load(), work.load()
    for y in range(h):
        for x in range(w):
            if k[x, y] == key:
                o[x, y] = (255, 255, 255, 0)
    out.save(dst)


def main():
    from mflux.models.common.config import ModelConfig
    from mflux.models.flux2.variants import Flux2Klein, Flux2KleinEdit

    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    ref = sys.argv[sys.argv.index("--edit") + 1].split(",") if "--edit" in sys.argv else None
    style = STYLES[sys.argv[sys.argv.index("--style") + 1]] if "--style" in sys.argv else STYLES["flat"]
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    t0 = time.time()
    model = (Flux2KleinEdit if ref else Flux2Klein)(quantize=8, model_config=ModelConfig.flux2_klein_4b())
    log_path = os.path.join(out, "log.json")
    log = json.load(open(log_path)) if os.path.exists(log_path) else {
        "model": "black-forest-labs/FLUX.2-klein-4B (Apache 2.0)", "runner": "mflux", "quantize": 8, "steps": 4,
        "size": 768, "style": style, "reference": ref, "pictures": []}
    log["load_seconds"] = round(time.time() - t0, 1)
    done = {p["id"] for p in log["pictures"]}
    for i, (cid, word, subject) in enumerate(CONCEPTS):
        if (only and cid not in only) or (not only and cid in done):
            continue
        lead = ("Using the drawing style of the reference images (not their characters), draw a new children's picture "
                "card illustration.") if ref else "Children's picture card illustration."
        prompt = f"{lead} {subject} {style}"
        seed = 2000 + i
        t = time.time()
        kw = dict(seed=seed, prompt=prompt, num_inference_steps=4, width=768, height=768)
        if ref:
            kw["image_paths"] = ref
        path = os.path.join(out, f"{cid}.png")
        model.generate_image(**kw).save(path)
        cut_out(path, os.path.join(out, f"{cid}-cut.png"))
        log["pictures"] = [p for p in log["pictures"] if p["id"] != cid]
        log["pictures"].append({"id": cid, "word": word, "seed": seed, "prompt": prompt, "seconds": round(time.time() - t, 1)})
        print(f"{cid}: {log['pictures'][-1]['seconds']}s", flush=True)
        json.dump(log, open(log_path, "w"), indent=1)


if __name__ == "__main__":
    main()
