---
type: Index
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/index.md
title: Games Catalog
description: The catalog of individual games (learning experiences), grouped by the app they live in and the age band they teach.
tags: [games, index, catalog]
timestamp: 2026-06-19T12:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Games Catalog

A **game** is a single interactive learning experience - a micro-learning game, interactive
simulation, or case study (see [vision](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/platform/vision.md)). Each game is documented here as a
first-class concept, even when several games ship inside the same app.

> **New here?** Read **[SwipeEd - what we built & why](swipeed-build-overview.md)** first - the
> end-to-end synthesis of the product, the v2 engine, the [forge content pipeline](swipeed-content-pipeline.md),
> and the run that grew **all 69 games to ≥400 scenarios**.

> **Apps vs. games.** [SwipeEd](swipeed.md) is an **app** (a whole learning path), not a game; the
> games below are the individual lessons that live on its path. In the *planned*
> [poly-repo topology](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/repo-topology.md) each game would have its own repo + registry
> id and depend on the shared [Engine SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md); **today** they are in-app
> modules within the SwipeEd repo (see [SwipeEd → current state](swipeed.md#current-state-vs-the-plan)).

## SwipeEd - games on the path

All live at https://swipeed.vercel.app (play in place over the 3D path). Listed by age band.

| Game | Age | Engine | Status | Doc |
|------|-----|--------|--------|-----|
| **Feelings Friends** | 3-6 | Seven v2 mechanics · GDD 01 v2 (SEL) | live | [doc](feelings-friends.md) |
| **My Body, My Rules** | 3-6 | Seven v2 mechanics · GDD 02 v2 (body-safety) | live | [doc](my-body-my-rules.md) |
| **Clean Crew** | 3-6 | Seven v2 mechanics · GDD 37 v2 (self-care) | live | [doc](clean-crew.md) |
| **My Family Garden** | 3-6 | Seven v2 mechanics · GDD 03 v2 (relationships) | live | [doc](my-family-garden.md) |
| **Same Same, Different** | 3-6 | Seven v2 mechanics · GDD 04 v2 (gender) | live | [doc](same-same-different.md) |
| **Can-Do Kids** | 3-6 | Seven v2 mechanics · GDD 05 v2 (gender/careers) | live | [doc](can-do-kids.md) |
| **Body Lab Juniors** | 6-9 | Eight v2 mechanics · GDD 06 v2 (body-science · explore-label) | live | [doc](body-lab-juniors.md) |
| **What Makes Me, Me** | 6-9 | Seven v2 mechanics · GDD 07 v2 (sex vs gender · gender-thread root) | live | [doc](what-makes-me-me.md) |
| **Safety Squad** | 6-9 | Seven v2 mechanics · GDD 08 v2 (safety/consent · spot-the-trick) | live | [doc](safety-squad.md) |
| **Friend or Frenemy?** | 6-9 | Seven v2 mechanics · GDD 09 v2 (healthy friendships · dilemmas) | live | [doc](friend-or-frenemy.md) |
| **Heart Smart** | 6-9 | Seven v2 mechanics · GDD 41 v2 (emotional intelligence · feeling-moment dilemmas) | live | [doc](heart-smart.md) |
| **Fair Play World** | 6-9 | Seven v2 mechanics · GDD 10 v2 (fairness/gender equality · dilemmas · India chore-gap) | live | [doc](fair-play-world.md) |
| **Not Fair, Not Funny** | 6-9 | Seven v2 mechanics · GDD 11 v2 (gender teasing & ally · impact over intent) | live | [doc](not-fair-not-funny.md) |
| **Smart Screen Heroes** | 6-9 | Six v2 mechanics · GDD 12 v2 (media literacy · spot-the-ad · screen wellbeing) | live | [doc](smart-screen-heroes.md) |
| **Puberty Quest** | 9-12 | Seven v2 mechanics · GDD 13 v2 (puberty · periods no-shame · private/solo) | live | [doc](puberty-quest.md) |
| **Mind Matters** | 9-12 | Seven v2 mechanics · GDD 38 v2 (mental wellbeing · coping chooser · Childline) | live | [doc](mind-matters.md) |
| **The Amazing Journey** | 9-12 | Seven v2 mechanics · GDD 14 v2 (reproduction · inclusive families · journey-builder) | live | [doc](the-amazing-journey.md) |
| **Boundary Bot** | 9-12 | Seven v2 mechanics · GDD 15 v2 (consent & boundaries · say-the-line · red-flags) | live | [doc](boundary-bot.md) |
| **Crossroads** | 9-12 | Seven v2 mechanics · GDD 16 v2 (decision routine · branching-dilemma flagship) | live | [doc](crossroads.md) |
| **Flip the Script** | 9-12 | Seven v2 mechanics · GDD 17 v2 (gender stereotypes · strike-rewrite flagship) | live | [doc](flip-the-script.md) |
| **Norm Storm** | 9-12 | Seven v2 mechanics · GDD 18 v2 (social norms · help/harm sort · good-norm test) | live | [doc](norm-storm.md) |
| **Speak Up** | 9-12 | Seven v2 mechanics · GDD 19 v2 (bystander→upstander · the 5 Ds · Childline) | live | [doc](speak-up.md) |
| **Defenders of the Body** | 9-12 | Seven v2 mechanics · GDD 20 v2 (immune system · HIV facts · kindness-not-fear · closes Ch.3) | live | [doc](defenders-of-the-body.md) |
| **Body Confident** | 12-15 | Seven v2 mechanics · GDD 21 v2 (body image · media literacy · body-neutral · colourism · opens Ch.4) | live | [doc](body-confident.md) |
| **Bounce** | 12-15 | Seven v2 mechanics · GDD 39 v2 (resilience · real coping · Tele-MANAS/Childline) | live | [doc](bounce.md) |
| **Plan It** | 12-15 | Seven v2 mechanics · GDD 22 v2 (fertility · myth-busting · delaying-valid · non-explicit) | live | [doc](plan-it.md) |
| **Outbreak: Stop the Spread** | 12-15 | Seven v2 mechanics · GDD 23 v2 (STIs · the toolkit · stigma-is-the-enemy · non-explicit) | live | [doc](outbreak.md) |
| **Green Light / Red Light** | ~12-15 | Seven v2 mechanics · GDD 24 v2 (teen flagship · adds the SWIPE verb · FRIES consent · One Love flags) | live | [doc](green-light-red-light.md) |
| **MythBuster: Gender** | 12-15 | Seven v2 mechanics · GDD 25 v2 (gender myths · pseudo-science inoculation · evenhanded) | live | [doc](mythbuster-gender.md) |
| **Equalize** | 12-15 | Seven v2 mechanics · GDD 26 v2 (equality pays off · child marriage as a rights issue · evenhanded) | live | [doc](equalize.md) |
| **Stand Up** | 12-15 | Seven v2 mechanics · GDD 27 v2 (teen bystander→upstander · the 5 Ds · safety-first · 181/112/1098) | live | [doc](stand-up.md) |
| **Firewall** | 12-15 | Seven v2 mechanics · GDD 40 v2 (online safety · the sextortion plan · never victim-blaming · 1930/1098) | live | [doc](firewall.md) |
| **The Rabbit Hole** | 12-15 | Seven v2 mechanics · GDD 43 v2 (manosphere → positive masculinity · never shame the boy · Tele-MANAS) | live | [doc](rabbit-hole.md) |
| **Reality Check** | 12-15 | Eight v2 mechanics · GDD 28 v2 (media literacy · real vs reel swipe · gated non-explicit · fakes & rights) | live | [doc](reality-check.md) |
| **My Choices, My Future** | 15-18 | Seven v2 mechanics · GDD 29 v2 (contraception · autonomy-first · rights · confidential care) | live | [doc](my-choices-my-future.md) |
| **Status: Know It** | 15-18 | Seven v2 mechanics · GDD 30 v2 (HIV/STI testing · U=U · zero stigma · NACO ICTC) | live | [doc](status-know-it.md) |
| **Mutual** | 15-18 | Seven v2 mechanics · GDD 31 v2 (sexual consent · FRIES · age-18/POCSO · even-handed · 181/1098) | live | [doc](mutual.md) |
| **Spectrum** | 15-18 | Seven v2 mechanics · GDD 32 v2 (orientation/identity · respect-not-a-debate · dignity floor · 2018/NALSA) | live | [doc](spectrum.md) |
| **Lead the Way** | 15-18 | Seven v2 mechanics · GDD 33 v2 (structural equality → everyday leadership · allyship · men-as-allies · pay~34% · Reservation Act 2023) | live | [doc](lead-the-way.md) |
| **Change Makers** | 15-18 | Seven v2 mechanics · GDD 34 v2 (campaign/collective change · the law as a tool · safe-lawful-ethical · DV Act/POSH/BNS) | live | [doc](change-makers.md) |
| **Justice League: Rights** | 15-18 | Seven v2 mechanics · GDD 35 v2 (rights & redress · educational-not-advice · POCSO/POSH/NALSA · Zero FIR) | live | [doc](justice-league-rights.md) |
| **Life Ready** | 15-18 | Seven v2 mechanics · GDD 42 v2 (adult life-skills · culminates the feelings thread · help-seeking is strength · Tele-MANAS) | live | [doc](life-ready.md) |
| **Decoded** | 15-18 | Seven v2 mechanics · GDD 36 v2 (media-literacy finale · decode the machine/influence/porn/self · no dark patterns · cybercrime 1930) | live | [doc](decoded.md) |
| **Consent, For Real** | 18-22 | Seven v2 mechanics · GDD 44 v2 (adult consent · drinks/capacity · survivor-centred · campus IC/POSH · 181/1091/112) | live | [doc](consent-for-real.md) |
| **Swipe Right?** | 18-22 | Seven v2 mechanics · GDD 45 v2 (modern dating & app safety · fakes/ghosts · video-verify · romance scams · cybercrime 1930) | live | [doc](swipe-right.md) |
| **Real Relationships** | 18-22 | Seven v2 mechanics · GDD 46 v2 (healthy vs coercive · Four Horsemen · coercive control · leaving safely · 181/1091/112) | live | [doc](real-relationships.md) |
| **Own Your Health** | 18-22 | Seven v2 mechanics · GDD 47 v2 (adult SRH ownership · dual protection · U=U · confidential · NACO ICTC/RKSK) | live | [doc](own-your-health.md) |
| **Money & Independence** | 18-22 | Seven v2 mechanics · GDD 48 v2 (financial literacy · debt traps · pay gap · financial control as abuse · DV Act/181) | live | [doc](money-independence.md) |
| **Mind & Belonging** | 18-22 | Seven v2 mechanics · GDD 49 v2 (college mental health · loneliness/leaving home · help=strength · Tele-MANAS 14416) | live | [doc](mind-belonging.md) |
| **Find Your Feet** | 18-22 | Seven v2 mechanics · GDD 52 v2 (career/future anxiety · comparison trap · worth≠CV · JEE/NEET/UPSC · Tele-MANAS) | live | [doc](find-your-feet.md) |
| **Equal & Confident** | 18-22 | Seven v2 mechanics · GDD 50 v2 (voice/leadership/allyship · everyday bias · bossy double-bind · POSH/181) | live | [doc](equal-confident.md) |
| **Know Your Rights** | 18-22 | Seven v2 mechanics · GDD 51 v2 (work/POSH IC · tenancy/consumer · cyber/DPDP · redress · NALSA 15100) | live | [doc](know-your-rights.md) |
| **Choosing & Building** | 22+ | Seven v2 mechanics · GDD 53 v2 (Ch.7 opener · choose on values not sparks · what it takes/repair · eyes-open commitment · love & arranged, consent always · equal day one · 181/1091/112/1098) | live | [doc](choosing-building.md) |
| **Your Path, Your Call** | 22+ | Seven v2 mechanics · GDD 54 v2 (Ch.7 equity heart · counterpoint to g53 · marriage/kids one path not the measure · not-marrying & childfree dignified · bust "still unmarried?" stigma · hold your ground · worth ≠ status/looks · 181/1091/112/1098) | live | [doc](your-path-your-call.md) |
| **Equal Partners** | 22+ | Seven v2 mechanics · GDD 55 v2 (Ch.7 equal-home heart · second shift & invisible mental load · "helping"→OWNING reframe · share fairly · dual careers · keep it equal · engages men, never shames · coercive control→g56/help) | live | [doc](equal-partners.md) |
| **Respect at Home** | 22+ | Seven v2 mechanics · GDD 56 v2 (Ch.7's highest-safeguarding node · marriage ≠ standing consent · spot abuse & coercive control · safety-planning · survivor-centred, never victim-blaming · DV Act 2005 · 181/1091/112) | live | [doc](respect-at-home.md) |
| **The Family Map** | 22+ | Seven v2 mechanics · GDD 57 v2 (Ch.7 · in-laws & joint family · callback to My Family Garden g03 · kind boundaries · couple-as-team · respect both ways ≠ obedience · dowry illegal/abuse→g56 · 181/112) | live | [doc](family-map.md) |
| **Money, Together** | 22+ | Seven v2 mechanics · GDD 58 v2 (Ch.7 · work & money in partnership · the money talk · joint+personal accounts · stay independent · fair-not-gendered · economic abuse/stridhan → PWDVA 2005/g56 · 181/1091/112/NALSA 15100) | live | [doc](money-together.md) |
| **If, When & Whether** | 22+ | Seven v2 mechanics · GDD 59 v2 (Ch.7 · reproductive decisions · adult My Choices · childfree complete · calm fertility facts (women & men) · own timeline · infertility ~1-in-6, no shame · son-preference/sex-selection illegal PCPNDT · non-coercive · RKSK/clinician) | live | [doc](if-when-whether.md) |
| **Many Ways to Family** | 22+ | Seven v2 mechanics · GDD 60 v2 (Ch.7 equity close · routes to family - adoption/fostering/IVF-ART/surrogacy/single & LGBTQ+/blended/childfree · real family ≠ only biological · honest dated India barriers (CARA/ART Acts/Supriyo 2023) · full dignity, no outing · not legal advice · CARA/NALSA 15100) | live | [doc](many-ways-to-family.md) |
| **Us, After Kids** | Parent | Seven v2 mechanics · GDD 61 v2 (Ch.8 opener · partnership & self after a baby · post-baby dip normal ~2-in-3, not a verdict · name the tiredness not each other · share don't resent · fathers as equal parents, not 'babysitting' · reconnect at both partners' pace, no deadline · perinatal depression → Tele-MANAS 14416/g63 · strain→g56) | live | [doc](us-after-kids.md) |
| **Equal Parents** | Parent | Seven v2 mechanics · GDD 62 v2 (Ch.8 · co-parenting as equals · g55's equal-home work in raising kids · share the care (only breastfeeding mother-specific) · the parental mental load · involved dads = pro-men · kids are watching · everyone gains · burnout→g63/Tele-MANAS · binStyle: +`one-sided`→NEG) | live | [doc](equal-parents.md) |
| **Looking After You** | Parent | Seven v2 mechanics · GDD 63 v2 (Ch.8 high-care · parental wellbeing/burnout · can't pour from an empty cup · self-care=childcare, struggling≠failing · baby blues vs PPD/anxiety (mums & dads), intrusive thoughts=symptom not verdict · help=strength · not therapy · PPD ~1-in-5 India · Tele-MANAS 14416/KIRAN 1800-599-0019/112) | live | [doc](looking-after-you.md) |
| **The Talks, Age by Age** | Parent Layer | Seven v2 mechanics · GDD 64 v2 (Ch.8 Parent-Layer keystone · age-by-age RSE · not one dreaded 'talk' but many small ones · correct body names protect against abuse · puberty before it starts · porn-literacy vs the manosphere · facts AND your values · be the askable door · mirrors My Body My Rules g02 · child-safety→g69/Childline 1098) | live | [doc](the-talks.md) |
| **Break the Cycle** | Parent Layer | Seven v2 mechanics · GDD 65 v2 (Ch.8 emotional core · deepest UN→RE beat · positive parenting / breaking generational trauma · discipline without fear/shame/hitting · repair beats perfection · calm yourself · heal your wounds · firmly non-shaming, busts the practice not the parent · Tele-MANAS 14416, harm→g69 · binStyle: +3 'keep/passes' NEG tokens) | live | [doc](break-the-cycle.md) |
| **Raising Gender-Diverse Kids** | Parent Layer | Seven v2 mechanics · GDD 66 v2 (Ch.8 · affirming an LGBTQ+/gender-nonconforming child, Spectrum's care · acceptance is protection - roughly halves suicide-thought odds · orientation/identity/expression are 3 things · first reaction matters, never out the child · never conversion 'cures' · NALSA/decriminalisation · KIRAN 1800-599-0019/Tele-MANAS 14416 · binStyle +`keeps you stuck`) | live | [doc](raising-gender-diverse-kids.md) |
| **Raising Neurodiverse Kids** | Parent Layer | Seven v2 mechanics · GDD 67 v2 (Ch.8 · autism/ADHD/learning differences · Same Same Different g04 grown up · difference not deficiency, different not less · accommodate not force masking · advocate (RPwD Act 2016) · drop the shame - no one's fault, not parenting/screens/vaccines · meltdowns=overwhelm · not a diagnostic tool · burnout→g63/Tele-MANAS 14416) | live | [doc](raising-neurodiverse-kids.md) |
| **Navigating Addictions** | Parent Layer | Seven v2 mechanics · GDD 68 v2 (Ch.8 high-care · child's substance/screen/gaming dependence · shame drives it underground, connection brings it to light · spot signs calmly not snooping · respond don't rupture · health issue not moral failing · get help early · model healthy habits · acute risk=emergency 112 · Tele-MANAS 14416/Childline 1098) | live | [doc](navigating-addictions.md) |
| **Be the Safe Adult** | Parent Layer | Seven v2 mechanics · GDD 69 v2 (Ch.8 safeguarding keystone · underwrites the whole kids' journey · be tellable (open no-blame door) · spot signs - most abuse is by someone known · disclosure response: believe/calm/not-their-fault/protect · POCSO basics, child always the victim · online grooming/sextortion · maximum-care · Childline 1098/POCSO e-Box/police/cybercrime 1930) | live | [doc](be-the-safe-adult.md) |

**The whole catalog is built** - **69 lesson nodes** across Chapters 1-8 (ages 3 → parenthood) plus
**8 [capstone graduations](capstones.md)**, 77 nodes in all. (The child journey, Chapters 1-5 / ages
3-18, is the first 43 lesson nodes and capstones c1-c5.) The ten gender-equality lessons (Same Same Different →
Justice League) began from the **Gender Equality Game Pack** brief and the rest from a GDD per node - but
each is an **individual game**, not a bundle. **[Feelings Friends](feelings-friends.md)** (node #1) is the
child's first game and first meeting with Lensy. Most lessons share a **5-mode + UN & RE** shape; the
exceptions are **[Green Light / Red Light](green-light-red-light.md)** (the #24 roguelike) and
**[MythBuster](mythbuster-gender.md)** (which also keeps its original swipe deck at `/play/mythbuster`).

**The adult journey (Ch.6-8, ages 18-22 → parenthood).** Chapter 6 (#g44-g52) was first built on a shared
**[ModesEngine](swipeed-game-patterns.md)** (home grid · Lensy · badge book · four mode kinds), and is **now
being reworked onto the shared [v2 mechanic engine](swipeed-game-patterns.md)** - the same
mechanic-embodying standard as the child journey - one node at a time from its v2-reworked GDD + scenario
library. **All nine Chapter-6 lessons (g44-g52) are now v2,** and the **c6 capstone (Standing on My Own)** has had
its rich rework. **Chapter 7 (Building a Life, 22 → first child) is built:** its opener
**[Choosing & Building](choosing-building.md)** (#g53) and its equity heart **[Your Path, Your Call](your-path-your-call.md)**
(#g54) are live - the **first genuinely-new nodes** built after the Ch.1-6 retrofit, authored v2-native (each
needed fresh wiring: a new `gameId` in the gen-path `GAME` dict, regenerated `path.ts`, and an `engine-host`
registration). g53 equips the person who chooses a partnership; g54 is its deliberate counterpoint - marriage and
children are one valid path, not the measure of a life; **[Equal Partners](equal-partners.md) (#g55)** is the
equal-home heart - the second shift, the invisible mental load, and the "helping → owning" reframe; and
**[Respect at Home](respect-at-home.md) (#g56)** is the chapter's **highest-safeguarding node** - consent inside
marriage, recognising abuse & coercive control, survivor-centred routing to help; and
**[The Family Map](family-map.md) (#g57)** brings the in-laws & joint family - the full-circle callback to
My Family Garden (g03); and **[Money, Together](money-together.md) (#g58)** carries the Work & Money domain into
partnership (the money talk, fair-not-gendered roles, economic abuse → g56); and
**[If, When & Whether](if-when-whether.md) (#g59)** is the reproductive-decision heart (the adult My Choices -
whether/when/how many children, non-coercive, childfree complete, infertility without shame); and
**[Many Ways to Family](many-ways-to-family.md) (#g60)** closes the lesson nodes as the equity bookend (diverse
routes to family, real family ≠ only biological, honest dated India barriers, full dignity); and the
**[c7 capstone - A Life, Built](capstones.md)** crowns the chapter. **All of Chapter 7 (g53-g60 + c7) is now
live** - which means the **entire 3 → first-child journey (Chapters 1-7, 67 nodes) is built** to the v2/rich
standard.

**Chapter 8 (Parenthood, first child on) is built.** Its opener
**[Us, After Kids](us-after-kids.md) (#g61)** is live - the partnership and the self after a baby (the post-baby
dip is normal, fathers are equal parents, reconnect at your own pace, perinatal depression routes to help) - and
**[Equal Parents](equal-parents.md) (#g62)** takes the equal-home work into raising children (share the care and
the parental mental load, involved fatherhood as pro-men, kids learn equality by watching); and the high-care
**[Looking After You](looking-after-you.md) (#g63)** protects the parent's own wellbeing (burnout, baby blues vs
postpartum depression, help-seeking as strength); and **[The Talks, Age by Age](the-talks.md) (#g64)** is the
**Parent-Layer keystone** - age-by-age RSE guidance that closes the generational loop (many small talks, correct
names, facts-and-values, the askable door; mirrors My Body, My Rules g02); and **[Break the Cycle](break-the-cycle.md)
(#g65)** is the **emotional core** - positive parenting and breaking generational trauma, the deepest Unlearn→Relearn
beat (discipline without fear/shame/hitting, repair beats perfection, heal your own wounds; firmly non-shaming);
**[Raising Gender-Diverse Kids](raising-gender-diverse-kids.md) (#g66)** affirms and protects an LGBTQ+ child
(Spectrum's care - acceptance is protection, never out the child, never conversion "cures"); **[Raising Neurodiverse Kids](raising-neurodiverse-kids.md) (#g67)** supports an autistic/ADHD/learning-different
child (Same Same, Different g04 grown up - difference not deficiency, accommodate, advocate, drop the shame); the high-care **[Navigating Addictions](navigating-addictions.md) (#g68)** helps a parent meet a child's substance/
screen/gaming dependence (shame drives it underground, connection brings it to light; health not moral failing;
help early; acute risk = emergency); and the maximum-care **[Be the Safe Adult](be-the-safe-adult.md) (#g69)** is
the **safeguarding keystone** - spotting abuse, POCSO basics, the disclosure response, online dangers - that
underwrites the whole kids' journey (it's the trusted adult every child node assumes); and the
**[c8 capstone - Full Circle](capstones.md)** crowns the chapter. **🎉 The entire catalog is complete:** all of
Chapters 1-8 (**77 nodes - 69 lessons + 8 capstones**) are now built to the v2/rich standard. The **3 → parenthood
journey is fully built**, and the generational loop comes full circle - the child the journey began with (My Body,
My Rules, g02) is now the parent who teaches it (The Talks g64; Be the Safe Adult g69).

## Documenting a new game
1. **Inherit the [reusable game patterns](swipeed-game-patterns.md)** (no-fail, safeguarding-never-scored, content-as-data, white-hat, accessibility, Unlearn → Relearn → Grow…).
2. Copy **[`_game-template.md`](_game-template.md)** to `games/<game-slug>.md`.
3. Fill in identity, what it teaches, how it works, and (for SwipeEd games) the route + lesson engine.
4. Add a row to the table above.
5. If the game introduces a **new lesson engine**, note it on the [SwipeEd](swipeed.md) engines table.
6. If it makes a **new reusable decision**, add it to the [patterns doc](swipeed-game-patterns.md) in the same branch.

## Related
- [SwipeEd - what we built & why](swipeed-build-overview.md) · [SwipeEd (app)](swipeed.md) · [Reusable game patterns](swipeed-game-patterns.md) · [The Interaction Model (gestures)](swipeed-interaction-model.md) · [Capstones (chapter graduations)](capstones.md) · [Core principle: Unlearn → Relearn → Grow](swipeed-core-principle.md) · [SwipeEd - The Path World (3D)](swipeed-world.md) · [Content-growth pipeline (forge)](swipeed-content-pipeline.md) · [Repo topology](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/repo-topology.md) · [Game registry](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/game-registry.md) · [Engine SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md)
