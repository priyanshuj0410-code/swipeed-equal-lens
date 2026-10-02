---
type: research
owner: the-equal-lens
title: "Picture LoRAs from the Lensy comic (2026-10-01)"
description: Two LoRAs for the local FLUX picture generator, trained on the owner's comic Lensy and the Life Cycle of a Stereotype, one for the characters (Lensy, UN, RE) and one for the comic's painted style; how the training sets were cut, how training runs on this Mac, and how to test and use them.
tags: [swipeed, research, pictures, image-generation, lora, flux, mflux, lensy]
timestamp: 2026-10-01T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/43fe632c-cf79-4e56-9d1e-0f22c747a055  # SWED-112
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d1d37f37-4805-4e14-9274-100025838c49  # SWED-91
---

# Picture LoRAs from the Lensy comic

A LoRA is a small add-on to an image model, trained on a few dozen pictures, that teaches it something the text
prompt cannot hold on its own: what a character looks like, or a house style. The picture cards
([visual answer options](visual-answer-options-2026-09-15.md), [SWED-91](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d1d37f37-4805-4e14-9274-100025838c49))
are drawn from a paragraph of style text plus one Lensy reference picture, so the style drifts between cards and
recurring characters change from card to card. On 2026-10-01 the owner asked for LoRAs trained on their comic
*Lensy and the Life Cycle of a Stereotype* (a local PDF outside the repo) and chose two of them, used separately or
together ([SWED-112](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/43fe632c-cf79-4e56-9d1e-0f22c747a055)).

## The source

18 painted pages, one full-page picture each; two pages repeat, so 16 are unique. The look is rich and painterly:
warm, dark, lamplit scenes, dense panels and lettered speech bubbles. That is very different from the round-six card
style (2D mascot, soft shading, plain white background), which is why the style is its own LoRA and the character
LoRA also learns the flat brand art.

Round six of the cards was not approved when training started, so no cards are in either training set.

## The two training sets

Cut by `scripts/pictures/lora_dataset.py` from boxes picked by hand on gridded page previews. A model trained on
lettering learns to draw garbled text, so every crop was checked on contact sheets and any that caught a speech
bubble or a sign was tightened or dropped.

| LoRA | Images | What is in it | Trigger words in captions |
|---|---|---|---|
| characters | 37 | 31 comic crops of Lensy, UN and RE, plus the 6 brand SVGs (`public/brand/lensy/*.svg`, `un.svg`, `re.svg`) rendered on white | "Lensy, a violet heart-shaped alien mascot…", "UN, a violet eraser…", "RE, a violet pencil…"; each caption ends "painted comic illustration" or "flat 2D brand illustration… plain white background", so the character is learned apart from either style |
| comic-style | 18 | scenes: puzzle-piece landscapes, the glowing stereotype creature, puppet theatre, the forest of treehouses, the hall of mirrors, cosy studies | "eqlcomic style painting of …" |

Captions and boxes: `scripts/pictures/lora/characters.json` and `comic-style.json`. The children in the comic are
painted, fictional figures. No photograph of a real child is ever used for training.

## Training on this Mac

`mflux-train` (mflux 0.19.1) on FLUX.2 klein 4B, the model already downloaded for the cards (15 GB). The usual choice
is the non-distilled "base" model, another 15 GB; with 20 GB of disk free, training runs on the distilled model first,
and the base model waits for the owner's go-ahead.

| Setting | Value | Why |
|---|---|---|
| resolution | 384 px | a 4-step smoke test at 512 px took 80 to 110 s a step: it overflows the M4's 24 GB. 384 px with 8-bit weights takes about 15 to 22 s a step; 4-bit at 512 px took 50 s. |
| steps | characters 740 (37 × 20 epochs), comic-style 720 (18 × 40) | about 3 to 4 hours each, run back to back overnight |
| LoRA | rank 16 on attention and feed-forward layers of all blocks; AdamW, learning rate 1e-4 | the mflux FLUX.2 example |
| checkpoints and previews | every ~185 steps | about 270 MB per checkpoint |

`scripts/pictures/train_lora.sh characters comic-style` runs both and resumes from the newest checkpoint after a Metal
GPU timeout; run it under `caffeinate -i` so the Mac does not sleep. Configs: `scripts/pictures/lora/train-*.json`.
Runs, checkpoints and previews go to `.forge/pictures/lora/runs/` (not in git).

## Testing and using them

`scripts/pictures/lora_test.py` draws `scripts/pictures/lora/test-prompts.json` once without a LoRA and once per
variant (a checkpoint zip or adapter, with a strength such as `@0.8`, joined with `+` to combine the two), and puts
them side by side on one sheet. Once [SWED-91](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d1d37f37-4805-4e14-9274-100025838c49)
merges, `flux_batch.py` can take the same LoRA paths for card batches.

## Open questions (for any later attempt)

- Whether a LoRA trained at 384 px holds up when cards are drawn at 768 px; if not, retrain at 512 px with the base
  model and more memory headroom.
- Whether the comic's origin allows training on it: if its pictures came from an image service, check that service's
  terms on using outputs for training.
- Whether to add the approved round-six cards to the character set, so Lensy, UN and RE learn the card style too.

## Results (2026-10-02)

Both trained to the end: characters at 00:16, comic-style overnight. The first run stopped at step 214 when the Claude
session that launched it ended, and resumed from the step-185 checkpoint; launch long runs detached from the session
(`setsid` plus `nohup`). Test sheet: `lora_test.py` at 768 px, six prompts, five variants (no LoRA; characters at step 740;
characters at step 370; comic style; both at 0.7).

| | Works | Does not work yet |
|---|---|---|
| characters | Draws Lensy, UN and RE on-model where the plain model guesses: the trio in a painted scene comes out as Lensy, UN and RE instead of two children, and UN and RE keep the eraser and pencil shapes and letters. | Flat cards come out paler and softer than the brand art. It leaks: a garden or classroom prompt with no mascots turns people into purple creatures, so it must only be used for pictures of the mascots. The step-370 checkpoint is no better than step 740. |
| comic-style | Gives scenes the comic's warm lamplit palette and painterly texture. | Faces and detail are softer than the comic, and RE loses its pencil shape when the style is applied to a card. |

**Owner decision (2026-10-02): not adopted.** The picture cards stay on the untrained FLUX.2 klein model with the
shaded style prompt, the Lensy reference picture and edit passes, the setup that produced round five. No LoRA is used,
`flux_batch.py` does not gain a `--lora` option, and no second round is planned. The scripts stay for a later attempt.

Likely causes: training ran on the 4-step distilled model (mflux recommends the non-distilled base model) at 384 px
because 512 px overflows the Mac's memory, and the character set had no plain pictures of people to stop the
characters spreading to every figure. Next round, if wanted: the base model (a 15 GB download), 512 px with 4-bit
weights, and 20 to 30 "regularisation" pictures of ordinary people captioned without the trigger words.
