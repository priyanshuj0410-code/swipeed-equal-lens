---
type: research
owner: the-equal-lens
title: "Visual answer options: tools and approach, including a zero-budget route (2026-09-15)"
description: How SwipeEd can give answer options pictures so children who cannot read yet can play and pictures build reading, covering what the reading research says, the scale of the job, a zero-budget route (Fluent Emoji, FLUX.1 schnell on the Mac, CC0 illustrations, CSS motion) and which free tiers the terms rule out, paid tools for reference, open symbol sets, safety rules for pictures, and a pilot plan.
tags: [swipeed, research, pictures, pre-readers, early-literacy, runway, recraft, image-generation, accessibility]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/533b7f5e-e740-46cf-bb6d-bd250addcbf5  # SWED-89
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/49cf4efd-6622-4ac8-907c-7c01ccfd0754  # SWED-90
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d1d37f37-4805-4e14-9274-100025838c49  # SWED-91
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/ec93c9d9-14cb-4419-a349-a716dbcc6fae  # SWED-113
---

# Visual answer options: tools and approach

**Ask (owner, 2026-09-15):** make answer options visual for players who cannot read, so pictures help them learn to
read and make the games more interesting, with the same approach open to older players. Find tools that can help;
Runway was suggested. Tracked as [SWED-89](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/533b7f5e-e740-46cf-bb6d-bd250addcbf5). It comes from Phase 3 of the
[playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md), where the Chapter 1 pilot needs options
that 3 to 6 year olds can use.

## Zero-budget route

The owner set the budget to zero on 2026-09-15 ([SWED-90](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/49cf4efd-6622-4ac8-907c-7c01ccfd0754)), so the paid tools later in this doc are for reference
only. Everything else here (the evidence, the proposed card, the rules for pictures) still applies.

| Need | Free tool | Licence and obligations |
|---|---|---|
| Feelings, faces, people, body parts, everyday objects | Microsoft Fluent Emoji, flat style (about 1,500) | MIT: keep the licence notice in the repo; no in-app credit; may recolour and combine |
| Actions and scenes in our style ("share the toy", "tell a grown-up", Indian homes and schools) | FLUX.1 [schnell] run on the Mac (Apple M4, 24 GB) with Draw Things (free Mac app) or mflux (free command line); SDXL as a smaller alternative | FLUX.1 [schnell] is Apache 2.0: pictures usable anywhere, no AI label required. SDXL (CreativeML Open RAIL++-M) allows commercial use with content restrictions |
| One style across hundreds of pictures | A small style model (LoRA) trained on the brand art in `public/brand/`, locally in Draw Things | Our own model; no third-party terms |
| Turning pictures into SVG | vtracer (MIT, full colour); Inkscape Trace Bitmap (free) for hand finishing | Tools only; the SVGs are ours |
| Ready-made people to build scenes | Humaaans and Open Peeps (Pablo Stanley) | CC0: no obligations |
| Motion | CSS or the Web Animations API on our own SVGs; GSAP (free for all use since 2025); Fluent Emoji Animated (MIT) | Free; far lighter than video on low-end phones |
| Tap to hear | The browser speech the app already uses | Free |
| Knowing which concepts need pictures | ARASAAC's vocabulary and free API, as a checklist | See "use with care" before using its pictograms |

**Ruled out by their own terms** (checked on the vendors' pages on 2026-09-15):

- **Google AI Studio and the Gemini API:** "You must be 18 years of age or older to use the APIs. You also will not use
  the Services as part of a website, application, or other service ... that is directed towards or is likely to be
  accessed by individuals under the age of 18." Unpaid use also trains Google's models.
- **Recraft free:** "Free Tier Assets are owned by Recraft" and "no commercial use of Free Tier Assets is permitted".
- **Runway free:** personal, non-commercial use only, and uploads may train its models.
- **Krea free:** no commercial licence. **Leonardo and Ideogram free:** outputs are forced public, so unreleased brand
  art would be copyable before launch.
- **FLUX.1 [dev]:** its outputs may be used commercially, but each must be reviewed and disclosed as AI-generated;
  [schnell] has no such terms, so use [schnell].
- **Streamline free** (its licence bars offering icons for users to pick from), **Icons8 free** (a link on every
  screen), **Rive** for our own files (exporting is a paid feature).

**Use with care:**

- **ARASAAC** (13,500+ pictograms) covers our concepts best, but it is CC BY-NC-SA: no commercial use of any kind,
  changed pictograms must stay under the same licence, and every use needs its credit line ("The pictographic symbols
  used are the property of the Government of Aragón and have been created by Sergio Palao for ARASAAC, that
  distribute them under Creative Commons License BY-NC-SA"). Many are black-and-white schematic figures that look
  clinical beside our cards. Acceptable only while SwipeEd stays free and without paid partners, and only if the
  owner agrees; email ARASAAC first.
- **OpenMoji** (CC BY-SA: credit, and changed icons must stay CC BY-SA), **Noto Emoji** (Apache 2.0, glossier look),
  **Jellow** (Indian contexts, but non-commercial, share-alike and small).

**How the free sets look.** A side-by-side of six Feelings Friends concepts (angry, sad, a hug, ask for help, slow
breaths, share) on our card style: Fluent Emoji is bright, flat and consistent (its hug is already violet); OpenMoji's
black outlines echo our sticker cards but some poses read poorly; Noto uses gradients; ARASAAC is the most explicit
for actions but mostly black-and-white stick figures. Emoji sets cover feelings well and social actions only partly,
which is where locally generated pictures come in.

**Free costs time instead of money.** About a day to set up (install, download 7 to 12 GB of model weights, train
the style model overnight; the Mac has about 39 GB free), then under a minute to render a picture and one to two
minutes to review it. About 200 Feelings Friends pictures is roughly two to three working days including review.

**Free pilot:**

1. Prototype the picture card with Fluent Emoji for Feelings Friends' feelings words.
2. Install Draw Things, download FLUX.1 [schnell], train a style model on the brand art, and make 30 test action
   pictures for the owner to sign off.
3. Make the Feelings Friends action pictures, vectorise them, review each against the rules below, and tag the options.
4. Playtest as planned below. Motion stays CSS animation on our own SVGs; no video.

## Recommendation in brief

Written before the budget was set to zero; item 3's tools are paid (see the zero-budget route above).

1. **Picture and word together, never a picture alone.** The word stays large and always visible; the picture sits
   above it as a scaffold, Lensy reads the word when it is tapped, and the picture fades as reading grows. The
   research below is clear that a picture next to a word can stop a child looking at the word, so the design has to
   keep attention on print if the goal is reading.
2. **A picture bank, not a picture per option.** One picture means one thing everywhere it appears, so the same word
   and picture recur across games. About 200 pictures cover most of Feelings Friends, and 1,000 to 1,500 cover
   Chapters 1 and 2.
3. **Tools:** generate the bank with **Recraft** (native SVG, a reusable style built from our brand art, about $0.04
   an image, full ownership on paid plans). Use **Runway** for motion (Lensy reacting, short clips), not for the
   static library. Use **Gemini 3.1 Flash Image** when a richer scene needs strong character consistency. Prototype
   first with free, commercially licensed emoji art (Microsoft Fluent Emoji, MIT) before paying for anything.
4. **Pilot on Feelings Friends** with a playtest that checks the real question: can children read the words later
   without the pictures?

## What the research says

Evidence strength is marked: **strong** (replicated or meta-analytic), **mixed**, **weak**.

- **Pictures help understanding, vocabulary and motivation (strong).** A meta-analysis of 39 studies found a moderate
  positive effect of graphics on reading comprehension (Guo et al., 2020, g = 0.39), and picture books help literacy
  and language outcomes (2025 meta-analysis). This is why pictures let pre-readers play.
- **Pictures can hurt learning the printed word itself (strong).** Samuels' focal attention research (1967 onward):
  children taught a word with a picture recognise the word worse later, because they look at the picture. Eye-tracking
  shows preschoolers look at pictures far more than print unless attention is drawn to the print.
- **Symbols next to text do not reliably teach reading (strong).** Syntheses of symbol-supported ("symbolated") text
  find little evidence it improves reading, and the same attention problem. Symbols are well evidenced for access and
  communication, not as a way to teach decoding.
- **Turning the picture into the word looks promising (weak, small study).** In an AAC app study (Caron, Light and
  McNaughton, 2020; five participants, single-case design), selecting a picture made its printed word appear and grow
  while it was spoken, and participants' reading of the target words improved. It is a model worth copying and testing,
  not settled proof.
- **What makes a picture help rather than hinder (mixed to strong):** the word is visually dominant; the picture shows
  the concept (representational, not decorative); the art is simple, since removing extra detail raised beginning
  readers' attention to text and comprehension (Eng, Godwin and Fisher, 2020); support fades as skill grows.
- **Audio:** reading the word aloud on tap supports print-to-speech links, and word highlighting during audio is
  promising but mixed, so test it. The strongest real-world analogue is Indian: PlanetRead's Same Language Subtitling
  improved reading at huge scale, though mostly for older children. Interactive extras unrelated to the content hurt
  learning ("seductive details", Harp and Mayer, 1998; Takacs, Swart and Bus, 2015).
- **India:** no published study was found on picture support for word learning in Indian multilingual children, so our
  playtest would be new evidence. Symbol "guessability" varies by culture, so imported symbol sets may not read the
  same way to Indian children.

## The size of the job in our content

Counted from the shipped bank on 2026-09-15 (option-like texts: reflect and choose options, sort items, match sides,
role-play lines, branch options, build pieces):

| Scope | Scenarios | Option texts | Unique | Distinct content words |
|---|---|---|---|---|
| Feelings Friends | 488 | 1,879 | 1,465 | about 770 |
| Chapter 1 (7 games) | 2,813 | 12,090 | 9,726 | about 2,100 |
| Chapter 2 (9 games) | 3,904 | 15,393 | 13,100 | not counted |

Most options are short: a median of two or three words in Feelings Friends reflects, sorts, matches and build pieces,
and six or seven in branch and role-play lines. In Chapter 1 the 500 most common content words appear in 89% of
options, and 1,000 words cover every word of 84% of options. Meaning often sits in the whole phrase ("keep it a
secret" and "tell a grown-up" need action pictures, not keyword icons), so the bank holds concepts and actions, not
single words. A picture per unique option (over 22,000 in Chapters 1 and 2) would be slow to review and inconsistent.

## Proposed design (not built)

Builds on the Answer cards and Choose card set rows of [design.md](../design.md) and the question card in
[v2-engine.md](../architecture/v2-engine.md). Real-app reference: Duolingo's "select the correct image" cards (a flat
illustration above the word, audio on the prompt) and Drops (one large illustration with its word). Lazyweb
references: https://www.lazyweb.com/agentic-search/1e9412a0-49ff-4259-95a4-45bd5fdbeac3.

- **Picture card:** an optional picture in a fixed box (so card heights stay stable) above the option's word. The word
  keeps its size, weight and position on every card. All pictures in a question have equal size, colour weight and
  detail, so no card looks like the answer, and a picture never carries a tick, a cross or a green or red tint.
- **Tap to hear:** in Chapters 1 and 2, tapping a card selects it and Lensy reads its word. Try a "word grows from the
  picture" moment on tap, modelled on the study above, with a still highlight under reduced motion.
- **Fading:** picture-forward in Chapter 1, smaller pictures in Chapter 2, and pictures on request from Chapter 3 on.
  Later, per player: fade when a player recognises words without pictures.
- **Where first:** reflect, sort, match and build options (short labels), then choose. A six-option choose with
  pictures needs a two-column grid on a 360px phone.
- **Picture bank:** a manifest (id, word, alt text, file, concept tags, tool and prompt, reviewer, review date) and a
  `pic` id on options. A tagger proposes a picture id for each option from the bank; a gate checks every id exists and
  has passed review. Alt text is the word, so screen readers say the same thing the card shows.
- **Files:** SVG where possible (tiny, crisp, recolourable to the light and dark themes and brand tokens), otherwise
  WebP, loaded per game.

## Tools

Prices checked on 2026-09-15; they change often. "Unverified" marks what we could not confirm on the vendor's own page.

| Tool | Best for | Keeps a style or character by | Output | Price | Ownership and training |
|---|---|---|---|---|---|
| **Recraft** | A flat vector picture library | A reusable Style made from reference images | Native SVG, PNG | V4.1 35 API units an image (about $0.035); style creation 40 units; vectorise or background removal 10 units | Full ownership and commercial rights on paid plans; whether paid-plan data is used for training is unverified |
| **Runway** | Motion: Lensy reacting (Act-Two animates a still character from a recorded performance), short clips | Up to 3 reference images per call | PNG, JPEG, MP4; no SVG | 1 credit = $0.01; Gen-4 Image Turbo 2 credits an image; Gen-4.5 video 12 credits a second; its API also resells Veo, GPT Image 2 and Gemini models | Users own outputs on paid plans; **Runway may train on inputs and outputs, with no opt-out below Enterprise** |
| **Google Gemini 3.1 Flash Image** | Rich scenes with a consistent character, cheaply | Several reference images in one request | PNG | About $0.04 an image for its predecessor (unverified for 3.1) | Paid API data is not used for training. Gemini 2.5 Flash Image shuts down on 2 October 2026 and Imagen 4 shut down on 17 August 2026 |
| OpenAI GPT Image 2 | General quality, text inside images | Editing from a reference image | PNG, WebP, transparent backgrounds | About $0.03 to $0.08 an image (estimate) | Customer owns outputs; API data not used for training by default |
| FLUX Kontext (Black Forest Labs) | Edits that keep a character; can be self-hosted | Reference-image chains; open weights for a trained style | PNG, JPEG | About $0.04 (Pro) to $0.08 (Max) an image | Pay-per-use commercial terms; open [dev] weights are non-commercial unless licensed |
| Scenario | A trained house style or mascot model for large batches | A small custom model trained on 10 to 30 of our images | PNG | Plans $15 to $75 a month | User owns outputs; self-serve content may improve the service |
| Ideogram, Leonardo, Adobe Firefly | Text in images; broad style libraries; copyright indemnity | Character reference; trained elements; style reference | PNG | $0.03 to $0.20 an image; Firefly API is enterprise-only | Varies; Firefly is trained only on licensed content |

**Is Runway right for us?** For motion, yes: it can animate Lensy from our existing art, and 500 two-second clips cost
roughly $50 to $120 depending on the model. For the static picture library it is not the best fit: no SVG, no
saved style (references are resent with every call), and our uploads could be used to train its models unless we are
on Enterprise. Video is also heavy for low-end phones, so clips should be rare, short, and have a still fallback.

**Open symbol sets.** Built for pre-readers and AAC, but none fits as our main art:

| Set | Licence | Fit |
|---|---|---|
| ARASAAC (about 14,000), Sclera | Non-commercial (ARASAAC also share-alike) | Strong vocabulary for feelings and social scripts; style does not match ours; licence risk if the app ever has paid partners |
| Jellow (IIT Bombay, about 1,200) | Non-commercial, share-alike | The only Indian-context set found; small |
| Mulberry | CC BY-SA | Commercial use allowed but unmaintained, adult vocabulary |
| Widgit, PCS (Boardmaker) | Paid licences | Broad and clinical; not needed |
| Fluent Emoji (MIT), Noto Emoji (Apache 2.0), Twemoji (CC BY), OpenMoji (CC BY-SA) | Free for commercial use | Single concepts only ("sad face", not "tell a grown-up"); good for a prototype |

Use the AAC vocabularies (and Jellow's Indian contexts) as a checklist of concepts, and the emoji sets for a free
prototype. Global Symbols offers one search API across the open sets, with Hindi and Urdu keywords.

## Rules for our pictures

Drawn from the brand and child-safe content rules and the safety research:

- Match the brand art in `public/brand/` (Lensy, UN, RE): 2D, rounded shapes, soft dark-violet outlines, violet and
  cream palette, big friendly eyes, and the mascots' soft shading and light (highlights, gentle shade, a soft ground
  shadow). The brand's no-shadows rule is for the app's cards and buttons, not illustrations (owner, 2026-09-30). No
  text inside the picture.
- **No photographs of children, ever**, and no realistic renders of children.
- Show trusted helpers (parents, grandparents, teachers) with visible diversity of gender, skin tone, clothing and
  family shape, including joint families. Avoid "stranger danger" imagery: most child sexual abuse is by someone the
  child knows.
- Say and show "safe touch" and "unsafe touch", never "good touch" and "bad touch". Never depict harm, injury,
  frightening faces, explicit body detail, or a child singled out or marked. Pair unsafe-touch pictures with a clear
  "not your fault" cue.
- Body-safety pictures wait for the owner's decision on anatomical words in Chapters 1 to 3
  ([SWED-83](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5f63c3db-0db3-4bb1-ab29-2806c72782cb)).
- Every picture is reviewed by a person against these rules before it ships, and the review is recorded in the manifest.

## Pilot plan

1. **Prototype, no spend.** Add the picture slot and tap-to-hear to answer cards behind a Chapter 1 flag, with Fluent
   Emoji placeholders for about 60 Feelings Friends feelings and actions. Try the word-grows moment.
2. **Style test, about $20.** In a Recraft account, build a style from the brand art and draw 30 concepts in two
   candidate styles, plus the same 30 in Gemini with Lensy references, for the owner to choose.
3. **Feelings Friends bank.** About 200 pictures (generation about $10 to $20; review roughly 1 to 2 minutes each), tag
   its options, and turn it on for Chapter 1.
4. **Playtest.** Compare word-only and picture-and-word cards on accuracy and time; count replays; and, most
   importantly, check whether children recognise the same words later without the pictures. Segment by age and home
   language.
5. **Runway test, about $5.** Three Lensy reaction clips with Act-Two, to judge whether motion adds enough to justify
   its weight on low-end phones.

## Local FLUX style test ([SWED-91](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d1d37f37-4805-4e14-9274-100025838c49))

The zero-budget route's first test, run on the owner's Mac (Apple M4, 24 GB) with no spend.

- **Runner and model.** [mflux](https://github.com/filipstrand/mflux) 0.19 as a `uv` tool, running
  `black-forest-labs/FLUX.2-klein-4B`, licensed Apache 2.0 (checked on the model page on 2026-09-30), so pictures it
  makes can ship in the app. The weights are about 15 GB in the Hugging Face cache; generation works offline after
  the first download. Settings: 8-bit, 4 steps, 768 px.
- **Recipe.** `scripts/pictures/flux_batch.py` holds the style prompt and the 30 Feelings Friends concepts, and cuts the
  white background to transparent for answer cards; `--edit <picture>` draws in the style of a reference picture.
  `scripts/pictures/review_page.py` builds the owner's review page. Outputs live in `.forge/pictures/` (not in git).
- **Timing.** About 84 seconds a picture from the text style and 111 seconds with Lensy's art as a reference, while
  other work ran on the Mac.
- **Round one (2026-09-30).** 30 concepts in two styles. Both look on brand (flat, rounded, soft violet outlines, big
  eyes) and the cut-outs are clean. The Lensy-reference style adds a soft ground shadow under most figures (flagged
  at the time as against the no-shadows rule, which the owner later clarified applies only to the UI). Across both styles: some children get lavender hair from the palette; "fair wheatish" skin came
  out blonde and very pale, which reads as not Indian; several actions do not read (take turns, wait your turn, slow
  breaths, shy, count to five); one picture has a stray line and one sad friend is bald. The next round names black or
  dark brown hair, avoids "fair", and redraws the actions that did not read.
- **Owner review, round one.** The owner chose the Lensy style but found it too flat: Lensy, UN and RE are 2D with
  shading and light, and the no-shadows rule is for the UI, not illustrations.
- **Round two (2026-09-30).** `flux_batch.py --style shaded` asks for soft cel shading with light from the upper left,
  glossy hair and eye highlights and a soft ground shadow, with Lensy's waving picture as the reference, plus round
  one's fixes (black or dark brown hair for every child, no "fair" skin, clearer poses). About 145 seconds a picture.
  The look now matches the mascots; share the toy, take turns, wait your turn and the full joint family read clearly.
  Still to fix: calm reads as winking, curious lost its magnifying glass, slow breaths still reads as praying, count to
  five reads as waving, say sorry reads as sulking, and walk away has a stray floating head. The review page
  (`review_page.py --round 2`) asks the owner whether this is the look and collects per-picture verdicts.
- **Owner review, round two (2026-10-01, in chat).** The amount of shading is right. But the round, circular highlight
  on the hair looks like a bald spot in many pictures (the heads crop shows a pale round shine on top of the hair; it
  is probably copied from the shine on Lensy's round head in the reference).
- **Round three (2026-10-01).** A five-picture test with thin highlight streaks along the strands removed the spot on
  straight hair but left a grey round patch on curly hair and turned some streaks tan, so the hair looked dyed. The
  style prompt now asks for matte hair that fully covers the head, shaded only with a darker tone underneath and at the
  back, with no shine or light patch; a second test kept the faces' shading and removed the tan streaks, though one
  curly head still drew a darker round patch at its seed, so every picture is checked for it and redrawn with another
  seed when found. All 30 are redrawn. The nine pictures whose
  action did not read get new prompts (calm with both eyes closed, shy peeking with no finger at the lips, proud holding
  a real drawing, curious looking through the magnifying glass at a ladybird, slow breaths breathing out with a hand on
  the tummy, count to five touching each finger, ask for help at a desk with a raised hand, say sorry handing back a
  toy, walk away with whole children behind her), each drawn with two seeds (`--seed-base`) so the better one is kept.
  `scripts/pictures/previews.py` makes small previews and a magnified heads crop of each card for image review.
- **Independent review of round three (2026-10-01).** A workflow gave every picture two independent checks: a blind
  reader who names the card without being told its word, and an inspector for hair, anatomy, artefacts, the concept,
  representation and safety. 29 of 39 were marked redo, and spot checks confirmed the claims. Matte hair alone did not
  remove the spot: 12 pictures still had a round grey patch on the top left of the head, traced to the style line
  "lighter highlight tones on the top and left of every shape", which the model applied to hair as well. "Light brown
  skin" came out pale peach on nine children and adults, so they read as white or East Asian. Grandmother, teacher and
  father had toddler proportions. Poses with several hand instructions grew a third hand (slow breaths, curious), and
  crowded scenes lost a person or showed a floating head (wait your turn, family, play together). Nine concepts
  passed: draw your feeling, scared, shy, a hug, squeeze a soft toy, take turns, walk away, ask for help and say sorry.
- **Round four (2026-10-01).** Highlights are limited to faces, skin and clothes; everyone is asked for warm brown
  skin from light-medium to deep; grown-ups are asked for adult proportions; slow breaths rests both hands on the
  tummy, curious crouches over a ladybird, and wait your turn, play together and family have fewer people. The 21
  failing concepts are drawn with two seeds, and the six hardest with a third, then reviewed the same way.
- **Round four picks (2026-10-01).** Hair, skin and grown-ups are fixed in the chosen versions. Count to five still
  read as waving in all three seeds and the slow-breaths breath lines looked like a white moustache, so both were
  redrawn as concrete actions: counting five blocks lined up on a table, and gently blowing a pinwheel with eyes closed.
  The chosen 30 are in `.forge/pictures/flux-style-test/final-r4/` (`picks.json` names the round and seed of each).
  Grown-ups keep the style's big-headed proportions, which suits the mascots but makes the grandmother and teacher
  read young on their own; that is the owner's call.
- **Owner review, round four (2026-10-01, in chat).** The blush is too strong. The owner chose to skip a second
  independent image review and keep the weekly budget for the Chapter 6 rollout.
- **Round five (2026-10-01).** `scripts/pictures/flux_edit.py` gives each approved picture back to the model as its
  own reference with an instruction to change one detail, so poses, people and colours stay as approved. A test
  showed it softens the blush cleanly, and that it can also clear the grey shine still left on some heads (sleepy,
  angry), but the hair instruction turned the grandmother's grey hair black. So 27 pictures get "faint warmth on the
  cheeks, solid matte black hair", and the three with elders (grandmother, tell a grown-up, family) get the blush
  change only. The style prompt now asks for a very faint warm tint on the cheeks instead of rosy cheeks.



- **Owner review, round five (2026-10-01, in chat).** Drop the blush entirely.
- **Round six (2026-10-01 to 02).** The style prompt now asks for no blush at all, with cheeks the same tone as the rest
  of the face, and an edit pass removed it from all 30 (the curious girl's headscarf and the grandmother's grey hair
  named as things to keep). The edit overreached on five pictures, which were redone with what to keep: sleepy had
  opened his eyes, tell a grown-up lost the grandfather's moustache, friend shifted the boy's skin redder, walk away
  kept a grey shine on the girl's hair. Three edit passes could not remove the family grandfather's pink cheeks (the
  last painted bright circles), so `scripts/pictures/recolor_cheeks.py` recoloured them to the skin around them by
  script. The owner found the near-faceless squeeze-toy boy creepy; it was redrawn from text with his whole face
  visible and closed eyes as gentle curves, four seeds, and the owner chose one.
- **Approved (owner, 2026-10-02).** All 30 round-six cards. They ship as the first set of the picture bank:
  `public/pictures/feelings-friends/` holds 512 px WebP cut-outs (911 KB in all) and `manifest.json` (id, word, alt
  text, file, subject, tool, source round, reviewer, review date). The full-size originals stay in
  `.forge/pictures/flux-style-test/final-r6-picks/`. A LoRA trained on the owner's Lensy comic was tested and not adopted
  ([picture LoRAs](picture-loras-2026-10-01.md)); the cards stay on the untrained model.

## Rollout tickets (2026-10-02)

The owner asked for illustrations throughout SwipeEd. Umbrella: [SWED-113](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/ec93c9d9-14cb-4419-a349-a716dbcc6fae).

| Ticket | State | What |
|---|---|---|
| [SWED-114](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f81e4045-7d9c-4baa-a146-a990462c8678) | Todo | Picture bank: manifest, pic ids on options and a review gate |
| [SWED-115](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/00b958a7-94ae-4886-bc5c-b244a900457a) | Todo | Picture answer cards: picture slot, tap to hear, fading by chapter |
| [SWED-116](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/c22c55c2-a9c8-4207-8413-70ea7a1b66d4) | Todo | Feelings Friends picture bank: tag options and draw the missing concepts |
| [SWED-117](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/fc9f2774-34f1-4656-8de0-d59945e81526) | Todo | Picture pipeline playbook and character bible |
| [SWED-118](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/4d8f7c3f-6fd6-499f-982b-c4aef3087cd6) | Backlog | Playtest picture cards against word-only cards |
| [SWED-119](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/496b921f-3625-4332-908c-3cdbae0e947b) | Backlog | Chapters 1 and 2 picture rollout |
| [SWED-120](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/4d0f7291-49cc-405a-a7c2-74d69cff2c46) | Backlog | Replace emoji placeholders with illustrations |
| [SWED-121](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/231ea93b-bb70-4b82-95fd-7262fd2c2816) | Backlog | Body-safety pictures (waits on SWED-83) |

## Owner decisions

- With a zero budget: a day of setup on the Mac and 7 to 12 GB of disk for local models.
- Whether to use ARASAAC pictograms at all (non-commercial and share-alike terms, clinical look).
- (Paid route, if budget appears later) who holds the accounts and API keys (Recraft; Runway; Google).
- Sign-off on the picture style after the style test.
- Whether Runway training on our uploads is acceptable, or motion waits for an Enterprise plan or another tool.
- Whether the emoji-placeholder prototype can go to the playtest.
- SWED-83 (anatomical words) before any body-safety pictures.

## Sources

Zero-budget route: Gemini API additional terms (https://ai.google.dev/gemini-api/terms); Recraft terms
(https://www.recraft.ai/legal/terms); FLUX [dev] licence (https://bfl.ai/legal/non-commercial-license-terms); FLUX.1
[schnell] model card (https://huggingface.co/black-forest-labs/FLUX.1-schnell); SDXL licence
(https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/blob/main/LICENSE.md); Draw Things LoRA training notes
(https://wiki.drawthings.ai/wiki/LoRa_Training_Notes); mflux (https://github.com/filipstrand/mflux); vtracer
(https://github.com/visioncortex/vtracer); Runway usage policy
(https://help.runwayml.com/hc/en-us/articles/17944787368595-Runway-s-Usage-Policy); Krea terms
(https://www.krea.ai/terms); Leonardo commercial usage (https://intercom.help/leonardo-ai/en/articles/8044018-commercial-usage);
Ideogram terms (https://ideogram.ai/legal/tos/); Humaaans (https://www.humaaans.com/); Open Peeps
(https://www.openpeeps.com/); ARASAAC terms (https://arasaac.org/terms-of-use, https://aulaabierta.arasaac.org/en/terms-of-use);
Fluent Emoji Animated (https://github.com/microsoft/fluentui-emoji-animated); GSAP free announcement
(https://webflow.com/blog/gsap-becomes-free); Streamline free licence
(https://help.streamlinehq.com/en/articles/5354376-streamline-free-license); Icons8 licence (https://icons8.com/license);
Rive pricing (https://rive.app/pricing).

Reading research: Samuels 1967 (https://eric.ed.gov/?id=ED014370); review of Samuels-era replications
(https://pmc.ncbi.nlm.nih.gov/articles/PMC12034512/); Guo et al. 2020, AERA Open
(https://journals.sagepub.com/doi/full/10.1177/2332858420901696); picture books meta-analysis 2025
(https://link.springer.com/article/10.1007/s11145-025-10753-6); Eng, Godwin and Fisher 2020, npj Science of Learning
(https://www.nature.com/articles/s41539-020-00073-5); symbolated text synthesis, T-TAC ODU
(https://ttac.odu.edu/at/symbolated-text-does-it-make-learning-to-read-easier-or-harder/); Caron, Light and
McNaughton 2020 (https://eric.ed.gov/?id=EJ1253823, https://rerc-aac.psu.edu/2020/05/18/effects-of-an-aac-app-with-t2l-features-on-single-word-reading-of-individuals-with-ccn-caron-et-al-2020/);
Harp and Mayer 1998 (https://eric.ed.gov/?id=EJ576496); Takacs, Swart and Bus 2015
(https://pmc.ncbi.nlm.nih.gov/articles/PMC4647204/); PlanetRead Same Language Subtitling, UNESCO LitBase
(https://www.uil.unesco.org/en/litbase/reading-billion-same-language-subtitling-india); symbol iconicity for rural
Zulu children (https://sajcd.org.za/index.php/sajcd/article/view/216); CDC on child sexual abuse
(https://www.cdc.gov/child-abuse-neglect/about/about-child-sexual-abuse.html).

Tools: Runway API pricing (https://docs.dev.runwayml.com/guides/pricing/), Gen-4 References
(https://help.runwayml.com/hc/en-us/articles/40042718905875-Creating-with-Gen-4-Image-References), Act-Two
(https://help.runwayml.com/hc/en-us/articles/42311337895827-Performance-Capture-with-Act-Two), terms of use
(https://runway.com/terms-of-use), training on content summary (https://terms.law/ai-output-rights/runway/); Recraft
API pricing (https://www.recraft.ai/pricing?tab=api) and ownership (https://www.recraft.ai/docs/trust-and-security/ownership);
Gemini deprecations (https://ai.google.dev/gemini-api/docs/deprecations), billing
(https://ai.google.dev/gemini-api/docs/billing), regions (https://ai.google.dev/gemini-api/docs/available-regions);
OpenAI pricing (https://developers.openai.com/api/docs/pricing); Black Forest Labs pricing (https://bfl.ai/pricing);
Scenario API pricing (https://www.scenario.com/api-pricing); Ideogram licensing (https://ideogram.ai/licensing/);
Leonardo pricing (https://www.leonardo.ai/pricing); Adobe child safety (https://www.adobe.com/trust/transparency/child-safety.html).

Symbol sets: Global Symbols (https://globalsymbols.com/symbolsets/?locale=en), ARASAAC API
(https://github.com/Arasaac/public-api), Sclera copyright (https://www.sclera.be/en/picto/copyright), Jellow
(https://jellow.org/jellow-basic.php), Mulberry (https://github.com/mulberrysymbols/mulberry-symbols), OpenMoji FAQ
(https://openmoji.org/faq/), Fluent Emoji licence (https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE),
Noto Emoji (https://github.com/googlefonts/noto-emoji), Twemoji (https://github.com/jdecked/twemoji), Widgit licensing
(https://www.widgit.com/symbol-services/licensing.htm), PCS licensing (https://www.tobiidynavox.com/pages/pcs-licensing).
