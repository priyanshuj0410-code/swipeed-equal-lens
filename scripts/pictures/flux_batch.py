#!/usr/bin/env python3
"""flux_batch.py: SwipeEd picture-card style test with FLUX.2 [klein] 4B (Apache 2.0) on the local Mac via mflux (SWED-91).

  <mflux python> flux_batch.py <out dir> [--style flat|shaded] [--edit <ref.png>[,<ref.png>...]] [--only id,id]
                                [--seed-base N]

Run it with the mflux tool's Python (~/.local/share/uv/tools/mflux/bin/python). It loads the model once and writes, for
every concept, <id>.png (as generated) and <id>-cut.png (the white background made transparent for answer cards), plus
log.json with the prompt, seed and seconds of each picture. --edit draws in the style of a reference image (Lensy's art)
instead of from the text style alone; several references can be given, comma separated.

Round two (2026-09-30), after the owner chose the Lensy style but found it too flat: the brand's no-shadows rule is
for the UI, not illustrations, and Lensy, UN and RE are 2D with soft shading and light. --style shaded asks for that
look. The concepts also carry round one's fixes: black or dark brown hair for every child, no "fair" skin (it came out
blonde), and clearer poses for shy, proud, curious, slow breaths, count to five, share the toy, take turns, wait your
turn, walk away, and a whole joint family.

Round three (2026-10-01) redraws the nine pictures whose action did not read in round two (calm read as winking,
shy as "shh", proud held a blank page, curious lost its magnifying glass, slow breaths read as praying, count to five as
waving, ask for help as a greeting, say sorry as sulking, walk away had a floating head). --seed-base (default 2000)
gives each concept a second seed, so every fix can be drawn twice and the better one kept.
The owner confirmed round two's amount of shading but found that the round hair highlight read as a bald spot in many
pictures (probably copied from the shine on Lensy's round head in the reference), so hair is now matte, and all 30 are redrawn.
After an independent review of round three (two checks per picture), the highlight rule was narrowed to faces, skin
and clothes (a highlight "on every shape" put a light patch on the top left of every head), everyone is asked for warm
brown skin (light brown came out pale peach), grown-ups are asked for adult proportions, and the scenes that grew
extra hands or missing people were simplified.
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
              "it, no text, no letters, no numbers. Every child's hair is black or dark brown, never purple or lavender. Everyone is Indian with warm brown skin, from light-medium brown to deep brown; nobody has pale, pink or white skin. Grown-ups are clearly adults, taller than the children, with adult faces and proportions.")
STYLES = {
    "flat": ("Rounded friendly shapes, big friendly eyes, thick soft dark purple outlines, simple flat colours with no "
             "gradients, no shadows, no texture. Limited palette of violet, lavender, cream and sunny yellow for clothes "
             "and objects. " + BACKGROUND),
    "shaded": ("2D cartoon mascot style like the reference: rounded friendly shapes, big glossy eyes with white "
               "highlights, thick soft dark purple outlines. Clearly visible soft cel shading with one light source from the upper left: "
               "lighter highlight tones on the top and left of faces, skin and clothes, gentle darker shade tones on the lower right, "
               "soft shading on faces, hair and clothes, matte hair that fully covers the head, shaded only with a slightly darker tone underneath and at the back, with no shine, no highlight and no light or grey patch anywhere on the hair, no blush at all, with cheeks the same skin tone as the rest of the face and no pink, red or warm tint, a faint paper grain texture, and a soft oval shadow "
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
    ("calm", "Calm", "A young Indian boy with dark brown skin and black hair, in a white kurta, sitting cross-legged with his hands resting loosely on his knees, a relaxed gentle smile, and both eyes softly closed in the same way, both eyelids down like gentle curves."),
    ("excited", "Excited", "A young Indian girl with light brown skin and short black bobbed hair, in a yellow dress, jumping with excitement, both arms up, big open smile."),
    ("shy", "Shy", "A young Indian boy with medium brown skin and black hair, in a school uniform shirt, feeling shy: peeking out from behind the edge of a door frame with both hands holding the door edge, head tilted down a little, eyes looking up, a small shy smile half hidden, rosy cheeks."),
    ("proud", "Proud", "A young Indian girl with deep brown skin and black hair in two small round buns on top of her head, in a lavender t-shirt, standing tall with her chin raised and a big wide proud grin, holding her own colourful crayon drawing of a yellow sun, a small house and flowers up high in front of her chest, the drawing facing the viewer."),
    ("sleepy", "Sleepy", "A young Indian boy with warm light-medium brown skin and black hair, in blue pyjamas, very sleepy: eyes half closed with heavy droopy eyelids, a big yawn with one hand over his mouth, a soft toy tucked under his other arm."),
    ("curious", "Curious", "A young Indian girl with medium brown skin, wearing a small headscarf, crouching down and looking closely through a big round magnifying glass at a small red ladybird on a green leaf on the ground; one hand holds the magnifying glass by its dark handle, the other hand rests on her knee, eyebrows raised with curiosity."),
    ("breathe", "Slow breaths", "A young Indian girl with dark brown skin and two black braids, taking slow calm breaths by gently blowing on a colourful paper pinwheel that she holds up in one hand in front of her face, lips in a small round shape, eyes softly closed, calm peaceful face."),
    ("hug", "A hug", "A mother with medium brown skin and black hair in a simple salwar kameez giving her young son a warm hug, both smiling with eyes closed."),
    ("quiet-time", "Quiet time", "A young Indian girl with warm light-medium brown skin and black hair sitting on a floor cushion, reading a picture book calmly."),
    ("squeeze-toy", "Squeeze a soft toy", "A young Indian boy with deep brown skin and short black hair, sitting and gently hugging a soft teddy bear to calm down. His whole face is clearly visible and turned toward the viewer, his hair stays above his eyebrows, both eyes are closed as gentle curved lines with relaxed eyebrows, and he has a small peaceful smile."),
    ("count", "Count to five", "A young Indian girl with medium brown skin and black hair, sitting at a small low table with five colourful wooden blocks lined up in a row in front of her, counting them: she touches the third block with one finger, calm focused face."),
    ("draw-feeling", "Draw your feeling", "A young Indian boy with light brown skin and black hair drawing a big coloured scribble with crayons on paper at a small table."),
    ("tell-grown-up", "Tell a grown-up", "A young Indian girl with dark brown skin and black hair talking to her kind grandfather, an elderly Indian man with warm medium brown skin, white hair and a white moustache, in a kurta, who kneels down to listen closely; both calm."),
    ("ask-help", "Ask for help", "A young Indian boy with medium brown skin and black hair sitting at a small school desk with an open workbook and a pencil, raising one hand high and looking up with a puzzled face, while a smiling grown-up Indian man teacher with warm medium brown skin, a shirt and glasses bends down beside the desk and points to the workbook to help."),
    ("share-toy", "Share the toy", "Two young Indian children, a boy with deep brown skin and black hair and a girl with warm light-medium brown skin and two black plaits, happily sharing one single toy car: he hands it to her."),
    ("take-turns", "Take turns", "Taking turns on one single swing: a young Indian girl with medium brown skin and black hair swings on it, while a boy with dark brown skin and black hair stands beside the swing, waiting for his turn and smiling."),
    ("say-sorry", "Say sorry", "A young Indian boy with light brown skin and black hair saying sorry to a girl friend with deep brown skin: he holds out a toy he took to give it back, his other hand on his chest, eyebrows raised with a sorry face and a small apologetic smile, arms not crossed; she smiles and reaches for the toy."),
    ("help-friend", "Help a sad friend", "A young Indian girl with medium brown skin and black hair, smiling kindly and warmly, putting a caring hand on the shoulder of a sad friend with warm light-medium brown skin and short black hair, who looks down; both sitting on a bench."),
    ("wait-turn", "Wait your turn", "Two young Indian children with black hair at a school drinking water tap: a girl with medium brown skin drinks from the tap, and a boy with deep brown skin stands behind her in line, waiting patiently with a smile."),
    ("talk-trust", "Someone I trust", "A young Indian boy with dark brown skin and black hair sitting beside his father on a sofa: the father is a grown-up Indian man with warm medium brown skin, a moustache and an adult build; the boy talks with his hands while the father listens with his head tilted and a kind face, his hands resting on his knees."),
    ("walk-away", "Walk away calmly", "A young Indian girl with light brown skin and black hair, her whole body visible, walking away to the right with a calm steady face; behind her on the left, two small children, both drawn with whole bodies, pull at the same ball and frown at each other."),
    ("play-together", "Play together", "Two young Indian children with black hair, one with deep brown skin and one with warm light-medium brown skin, kneeling on the floor and building a tower of blocks together, laughing, both children fully visible."),
    ("grandmother", "Grandmother", "An elderly Indian grandmother with medium brown skin, a kind wrinkled smile and grey hair in a bun, in a simple cotton sari, waving warmly; she is a grown-up woman with adult proportions."),
    ("teacher", "Teacher", "A grown-up Indian woman teacher with warm dark brown skin and black hair in a bun, in a cotton sari, holding a book and smiling, standing in front of a small green board with no writing; she has adult proportions and is clearly an adult."),
    ("friend", "Friend", "Two young Indian children with black hair, best friends, one with warm light-medium brown skin and one with deep brown skin, walking side by side and holding hands, smiling."),
    ("family", "Family", "An Indian joint family of five sitting together on a sofa, smiling: a grandfather with white hair, a grandmother with grey hair in a bun, a mother, a father, and one young child in the middle; all have brown skin and the four grown-ups are clearly adults."),
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
    seed_base = int(sys.argv[sys.argv.index("--seed-base") + 1]) if "--seed-base" in sys.argv else 2000
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
        seed = seed_base + i
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
