---
type: research
owner: the-equal-lens
title: Visual answer options - tools and approach (2026-09-15)
description: How SwipeEd can give answer options pictures so children who cannot read yet can play and pictures build reading - what the reading research says, the scale of the job, image and animation tools (Runway, Recraft, Gemini and others) with prices and licences, open symbol sets, safety rules for pictures, and a pilot plan with owner decisions.
tags: [swipeed, research, pictures, pre-readers, early-literacy, runway, recraft, image-generation, accessibility]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/533b7f5e-e740-46cf-bb6d-bd250addcbf5  # SWED-89
---

# Visual answer options: tools and approach

**Ask (owner, 2026-09-15):** make answer options visual for players who cannot read, so pictures help them learn to
read and make the games more interesting, with the same approach open to older players. Find tools that can help;
Runway was suggested. Tracked as [SWED-89](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/533b7f5e-e740-46cf-bb6d-bd250addcbf5). It comes from Phase 3 of the
[playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md), where the Chapter 1 pilot needs options
that 3 to 6 year olds can use.

## Recommendation in brief

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

- Match the brand art in `public/brand/` (Lensy, UN, RE): flat vector, rounded shapes, soft dark-violet outlines,
  violet and cream palette, big friendly eyes, no text inside the picture.
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

## Owner decisions

- Budget and who holds the accounts and API keys (Recraft; Runway; Google).
- Sign-off on the picture style after the style test.
- Whether Runway training on our uploads is acceptable, or motion waits for an Enterprise plan or another tool.
- Whether the emoji-placeholder prototype can go to the playtest.
- SWED-83 (anatomical words) before any body-safety pictures.

## Sources

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
