---
type: reference
owner: the-equal-lens
title: SwipeEd question bank audit, 2026-09-14
description: A full pass over all 33,542 lesson scenarios, 70 capstone laps, every game's help strings and the Get Help sheet, for child safety, factual and legal accuracy, answer-key integrity and quality, with severity-ranked findings and proposed fixes.
tags: [swipeed, question-bank, audit, safety, accuracy, quality]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2e3bdb51-00e7-45ff-8181-a301db687b5b  # SWED-65
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/1163d808-7f9b-4cc5-8571-c2e084e7221e  # SWED-79
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5656f62f-d7dc-4f60-bdef-0e52c8a67b6b  # SWED-80
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/346e8997-2ede-4e3b-a749-f8e7da185355  # SWED-81
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e2f01bdc-6e38-4eb0-8f87-b9c69e897cb5  # SWED-82
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5f63c3db-0db3-4bb1-ab29-2806c72782cb  # SWED-83
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/73023a9c-e912-4e59-ab0a-b4028cacc7e7  # SWED-84
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f4f2b093-af4a-4dc3-ba7e-ae11b7838c58  # SWED-85
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007  # SWED-71
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62  # SWED-68
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/0c1b8795-8d5d-4208-92d0-e1365dd590bc  # SWED-122
---

# SwipeEd question bank audit, 2026-09-14

Read-only audit under SWED-65 of the content described in the [question bank](../schemas/question-bank.md), at commit `de7944d` (after SWED-62 retired KIRAN). The pipeline and gates that produced this content are reviewed separately in the [forge pipeline review](forge-pipeline-review-2026-09-14.md).

## Summary

- **The bank is structurally sound.** Every answer key passed deterministic checks with zero violations: spot tricks, branch and role-play best answers, sort keys and valence, match pairs, build keys and explore-label answers. No shipped match scenario can trigger the SWED-56 soft-lock. Categories, mechanic mix, band rules and capstone links are all clean, and the fleet numbers in the question bank doc re-verified with zero mismatches.
- **Reading level tracks age.** Estimated reading ease falls steadily from 92 in Chapter 1 to 77 in Chapter 7, never harder than "fairly easy".
- **Safeguarding language is mostly right.** Disclosure responses, self-harm and suicide messaging, "most abuse is by someone known" and age-of-consent statements all checked clean.
- **The serious problems are legal framing and a few claims:** content that presents transgender self-identification as current law after a 2026 amendment removed it, content telling 15-18-year-olds that mandatory reporting is a myth, and a model line that asks a trusted adult to keep something "just between us".

| Severity | Count | Ids |
|---|---|---|
| Critical | 2 | A1, A2 |
| High | 4 | A3, A4, A5, A6 |
| Medium | 8 | A7 to A14 |
| Low | 6 | A15 to A20 |

## Findings

### Critical

**A1. Transgender self-identification is presented as current law.**
- `raising-gender-diverse-kids` (Chapter 8, parents): `gd-051` (strike-rewrite: "the NALSA judgment recognises transgender persons and self-ID"), `gd-052` (match: "NALSA judgment (2014)" with "Recognises transgender persons and self-ID", "NALSA self-ID principle" with "One's own sense of gender is respected", and a relearn that lists NALSA, the 2018 decriminalisation and the 2019 Act as the rights in force).
- `what-makes-me` (Chapter 2, ages 6-9): 7 scenarios say "India's law recognises a third gender" and cite NALSA 2014 (`wm-039`, `wm-048`, `wm-1176`, `wm-1189`, `wm-1201`, `wm-1216`, `wm-1233`). That is still broadly true, because the law still recognises transgender persons, but `wm-1189`'s "so everyone is seen" now overstates it.
- **Why it matters.** The Transgender Persons (Protection of Rights) Amendment Act, 2026 received presidential assent on 30 March 2026. It removed self-identification, requires a medical board recommendation before a District Magistrate issues a certificate, and narrowed the statutory definition of a transgender person. It is being challenged in the Supreme Court, which issued notice but did not stay it. A parent of a gender-diverse child could act on the old rule. The 2014 NALSA judgment and the 2018 decriminalisation are still described correctly as history.
- **Fix.** In `gd-051` and `gd-052`, keep NALSA as history ("in 2014 the Supreme Court said..."), state that since 2026 a legal gender certificate needs a medical board and a District Magistrate under a law now before the Supreme Court, and point families to current legal advice; never imply self-declaration is how certification works. Keep the dignity message, which does not depend on a certificate. In `what-makes-me`, keep the child-level fact and drop "so everyone is seen". Re-verify the law's status before shipping.
- Sources: [PRS India bill track](https://prsindia.org/billtrack/the-transgender-persons-protection-of-rights-amendment-bill-2026), [Wikipedia summary with citations](https://en.wikipedia.org/wiki/Transgender_Persons_(Protection_of_Rights)_Amendment_Act,_2026), [Human Rights Watch, 26 Mar 2026](https://www.hrw.org/news/2026/03/26/indias-transgender-rights-bill-a-huge-setback).

**A2. Minors are told that mandatory reporting is a myth and that sexual-health care is simply confidential.** Chapter 5 (ages 15-18).
- `my-choices:mc-945` (sort) files "Clinics must report you to family" under Myth, and its relearn says "mandatory reporting and 'too young' are myths". `mc-956` (spot) marks "Clinics are required to report you to your family" as the claim to catch; `mc-054` and `mc-932` say adolescent services offer "confidential information and counselling"; `status-know-it:sk-1083` presents RKSK services as made for under-18s with no caveat.
- Pattern: 74 of 545 `my-choices` scenarios and 90 of 506 `status-know-it` scenarios promise confidential sexual or reproductive health care without naming its limit. Both games' `helpLine` strings repeat the promise ("can help, confidentially", "Free, confidential HIV/STI testing"), and capstone 5 echoes it.
- **Why it matters.** Under POCSO the age of consent is 18 with no exception, and anyone who learns of a sexual offence against a minor, a clinician included, must report it to the police or the Special Juvenile Police Unit. Reporting goes to the police, not the family, so "clinics tell your family" is fairly called a myth, but "mandatory reporting is a myth" is false. The child-safe-content reference names this exact tension.
- **Fix.** Keep "clinics don't tell your family" and "you can ask for information". Add the distinction between asking for information or services, which stays confidential, and telling a clinician you are already sexually active, which can create a legal duty to report to the police. Rewrite the `mc-945` relearn, the two `helpLine` strings and the capstone 5 line. Have the change reviewed against legal-india guidance before shipping.

### High

**A3. A model line teaches children to ask for secrecy.** `plan-it` (Chapter 4, ages 12-15).
- `pl-072` (role-play): the best line is "Can I ask you something about growing up, just between us?"; `pl-1096` (role-play): "Can I ask you something privately, just between us?" to a doctor, with the relearn "your questions are kept confidential".
- **Why it matters.** `safety-squad` and `firewall` correctly teach "just between us" as a grooming red flag, so the bank contradicts itself, and `pl-1096` promises a 12-15-year-old confidentiality a doctor may not be able to keep.
- **Fix.** "Can I ask you something about growing up?" and "Can I ask you something privately?", with a relearn that says a doctor explains what stays private.

**A4. The Get Help sheet calls Childline confidential with no exception.** `src/content/help.ts` shows "Free, 24/7, confidential help for children" on the help sheet reachable from every node.
- **Fix.** "Free, 24/7 help for children. Call any time." Or name the limit: they keep it private unless someone is being hurt.

**A5. Chapter 1-3 body-safety content uses no anatomical words.** `my-body`, `body-lab` and `defenders` (1,537 scenarios, ages 3-12) say only "private parts" (70, 51 and 5 uses). Correct anatomical terms first appear in the Chapter 3 puberty and reproduction games.
- **Why it matters.** The child-safe-content language rules say to use anatomical words at normal volume, because a child who has the words can report abuse clearly.
- **Fix.** A curriculum decision for the owner: whether to introduce the correct words in `my-body` and `body-lab`, as body-safety guidance recommends, given the GDDs and the Indian context.

**A6. An accepting-parent statistic is presented without attribution, and with two different outcomes.** `raising-gender-diverse-kids`: `gd-005`, `gd-907` and `gd-935` say acceptance "roughly halves" the odds of a suicide attempt, while the game's greeting, badge blurb, `helpLine` and `reassure` strings say "suicidal thoughts".
- **Why it matters.** The finding comes from US research (the Trevor Project and the Family Acceptance Project); no comparable large Indian study was found. The mismatch between "attempt" and "thoughts" overstates it.
- **Fix.** Attribute the finding ("US research found..."), say "suicide attempt" everywhere, and state that Indian data is limited.

### Medium

**A7. Clinical content is taught, against the organisation's canon.** The Equal Lens canon says it does no clinical content (contraception, STIs or mental-health treatment) and refers instead. Keyword sweep, hand-cleaned:

| Ch | Ages | Scenarios | Contraception | STI or HIV | Medicine or treatment | Main games |
|---|---|---|---|---|---|---|
| 1-2 | 3-9 | 0 | 0 | 0 | 0 | none |
| 3 | 9-12 | 242 | 1 | 231 | 44 | `defenders` (240, HIV facts) |
| 4 | 12-15 | 399 | 75 | 322 | 76 | `outbreak` (345), `plan-it` (42) |
| 5 | 15-18 | 399 | 192 | 201 | 150 | `status-know-it` (249), `my-choices` (123) |
| 6 | 18-22 | 212 | 124 | 91 | 45 | `own-your-health` (185) |
| 7 | 22+ | 83 | 7 | 2 | 74 | family planning |
| 8 | parenthood | 104 | 7 | 1 | 96 | `navigating-addictions` |

A policy decision, recorded in the [knowledge base index](../README.md) as an open question; this table quantifies it. The facts themselves checked out (see Verified correct).

**A8. "23 million girls drop out after periods start" has no clear primary source.** `puberty-quest:pq-037`. The figure traces to a 2014 NGO report and is widely repeated without a checkable survey. Fix: drop the number and keep the well-supported point, or attribute it.

**A9. A global chores statistic is presented as an India figure.** `fair-play:fp-014`, `fp-069`, `fp-946` ("In India, girls do about 40% more chores than boys"). UNICEF's 40% is a worldwide figure for ages 5-14; its South Asia figure for girls aged 10-14 is nearly double. Fix: say "worldwide", or use the regional figure with attribution.

**A10. One game gives three different puberty age ranges.** `puberty-quest`: `pq-003` (8-14), `pq-1151` (9-14), `pq-1004` (periods 8-15). None is clinically wrong, but a 9-12-year-old sees conflicting numbers. Fix: one range for puberty (about 8 to 14) and a distinct one for periods.

**A11. "Around one in ten fathers get postnatal depression" is stated as fact.** `looking-after-you:ly-029`, `ly-1083`. It matches international meta-analysis (about 10%) but no Indian study was found. Fix: "research suggests around one in ten new fathers".

**A12. Near-duplicate right-hand texts in match scenarios.** 139 candidate scenarios (305 pairwise hits) of 3,444 matches; 15 of 37 sampled were confirmed (41%). Examples: `be-the-safe-adult:sa-1199` (three rights ending "worth noticing"), `break-the-cycle:bc-1209` ("Holds compassion" versus "...warmly" versus "...gently"), `norm-storm:ns-055`. The pairing becomes guesswork. Fix: hand-review the candidate list and give each right-hand text its own distinguishing detail.

**A13. Em and en dashes throughout player text.** 2,999 in player-visible scenario text across 58 of 69 games (4,260 in the game files counting comments and config); top: `family-map` 129, `lead-the-way` 126, `norm-storm` 123, `money-together` 121, `defenders` 111. Against the brand voice rule. Fix: a scripted cleanup reviewed by sample, plus a gate (see the pipeline review).

**A14. Two uses of "bad feeling" in model text for ages 6-9.** `body-lab:bl-036` ("The bad feeling eases") and `safety-squad:ss-1322` ("when a person gives you a bad feeling"). The other seven uses in the bank negate it or sit in myth text. The child-safe-content rule is "no bad feelings, only hard ones", and body-safety content usually says "uh-oh feeling". Fix: reword both.

### Low

| Id | Finding | Evidence | Fix |
|---|---|---|---|
| A15 | Absolute "completely confidential" phrasing for adults | `own-your-health:oh-067`, `oh-954` (ages 18-22) | Say "confidential" and what that covers |
| A16 | Scenario id prefixes are reused across games (unique only within a file) | `ff-1328` exists in both `feelings-friends` and `friend-frenemy`; also `rh`, `mb`, `bc`, `cr`, `mt`, `ss` (7 prefixes, 16 games) | Always pair an id with its gameId in tooling and bug reports |
| A17 | US spelling stragglers | "mom" 3 times (`equal-partners` 2, `outbreak` 1) against "mum" 440; "center" twice in `stand-up` against "centre" 173 | Replace the 5 instances |
| A18 | Mixed straight and curly quotes within a file | `family-map`, `real-relationships`, `the-talks` | Normalise to straight quotes |
| A19 | `persona` holds research tags instead of a persona | `body-lab:bl-037`, `bl-1137`, `bl-1141`, `bl-045` (not shown to players) | Set a real persona |
| A20 | Non-numeric ids | `lead-the-way:lw-9a0` to `lw-9a7` | Cosmetic |

## Checked and clean

| Check | Scope | Result |
|---|---|---|
| Spot shape and trick polarity | 2,721 spots | 0 shape violations; polarity heuristic 0 confirmed of 35 sampled |
| Branch and role-play single best answer | 6,070 branches, 4,323 role-plays | 0 violations; best-framing heuristic 0 confirmed of 40 sampled |
| Sort keys, bins and valence | 4,292 sorts | 0 violations; valence-versus-text heuristic 0 confirmed of 34 sampled |
| Swipe valence | 201 swipes | 0 same-valence pairs; label-to-valence consistency clean |
| Match duplicates and SWED-56 triggers | 3,444 matches | 0 duplicate lefts or rights, 0 live soft-lock triggers |
| Build keys and sequence order | 1,307 builds | 0 violations; 15 of 15 sampled sequences in a sensible order |
| Explore-label answers | 78 scenarios | 0 violations |
| Categories, mechanic caps, band rules | 69 games | 0 orphan categories; highest single-mechanic share 27.5%; highest easy-verb share 37.6%; the only Chapter 1-2 spot use (`safety-squad`) is allowed by its library |
| Capstones | 8 capstones, 70 laps | all node ids, chapters and glyphs valid; lap counts match the doc |
| Exact duplicates | fleet | 25 clusters (50 scenarios), all cross-game and intentional except the pair already in SWED-55 |
| Hygiene | fleet | 0 "Sam", 0 empty fields, 0 double spaces, 0 placeholders |
| Self-disclosure invitations | fleet | 31 flagged, 0 confirmed |
| Disclosure responses modelled | `be-the-safe-adult`, `my-body`, `safety-squad`, `speak-up`, `the-talks` | 37 flagged, 0 confirmed: belief, "not your fault", no secrecy, no confronting the abuser |
| Graphic detail, Chapters 1-3 | 195 flagged | 0 confirmed |
| Stranger danger | fleet | busted correctly (305 known-person mentions against 47 stranger mentions) |
| Self-harm and suicide messaging | 55 scenarios | no method detail, no romanticising |
| Help routing on sensitive scenarios | 868 scenarios | every one has a route (1 apparent gap was "grooming" in the hygiene sense) |
| Victim-blaming reinforced | 107 flagged | 0 confirmed |
| Outing and slurs | fleet | 0 confirmed |

### Readability by chapter

| Ch | Ages | Words per sentence | Long-word rate | Reading ease |
|---|---|---|---|---|
| 1 | 3-6 | 5.5 | 10.7% | 92.2 |
| 2 | 6-9 | 6.3 | 11.4% | 92.9 |
| 3 | 9-12 | 6.6 | 14.8% | 87.3 |
| 4 | 12-15 | 6.7 | 16.7% | 84.3 |
| 5 | 15-18 | 7.1 | 18.8% | 79.7 |
| 6 | 18-22 | 7.5 | 17.9% | 80.9 |
| 7 | 22 to first child | 8.1 | 19.1% | 76.8 |
| 8 | parenthood | 8.7 | 18.3% | 80.2 |

### Verified correct

40 distinct factual and legal propositions were extracted and checked against legislation, ministry sites, WHO and peer-reviewed sources. Besides the items above, these were confirmed: age of consent 18 under POCSO, with no exception (and the 2023 Law Commission advice against lowering it); POCSO is gender-neutral; BNS replaced the IPC on 1 July 2024 (no IPC or CrPC section numbers remain); child marriage ages 18 and 21 under the PCMA 2006; the DV Act 2005 protections; POSH 2013 covers interns; RPwD 2016 covers autism and learning disabilities; the 2018 decriminalisation of consensual same-sex relations; CARA 2022 single-parent adoption rules; Childline 1098, Tele-MANAS 14416, emergency 112, cybercrime 1930, the women's helpline 181 and NALSA 15100; RKSK clinics for ages 10-19; the PCPNDT Act; U=U and HIV transmission routes; HPV vaccine coverage and the free national programme for 14-year-old girls launched in February 2026; contraceptive effectiveness figures; emergency contraception is not abortion and works up to 5 days; vaccines do not cause autism; infertility affects about 1 in 6 people; postpartum depression affects about one in five mothers in India; about 80% of Indian students report exam anxiety (NCERT 2022). "Two in three couples' satisfaction dips after a first child" is correct but rests on Western research.

## Method and limits

- Four reviewers ran scripted sweeps over every scenario, capstone lap, config string and the help sheet, then read flagged items in context. Precision is reported above; lexical heuristics finding nothing is not proof that nothing is there.
- About 100 of the 139 match-ambiguity candidates were not read individually.
- Clinical-content counts come from a hand-cleaned keyword sweep, not a read of every match.
- Named-persona gender balance (about 54% female, 46% male) used general name knowledge, not a verified dataset.
- The fact-check parsed 33,191 scenario lines with its own extractor, slightly fewer than the 33,542 in the bank.
- Text only: rendering, audio and runtime behaviour were out of scope.

## Follow-up tickets

Proposed with this audit and filed on 2026-09-15. The last two were folded into tickets that already cover the same
work.

**2026-10-02:** [SWED-79](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/1163d808-7f9b-4cc5-8571-c2e084e7221e), [SWED-80](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5656f62f-d7dc-4f60-bdef-0e52c8a67b6b), [SWED-81](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/346e8997-2ede-4e3b-a749-f8e7da185355) and [SWED-82](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e2f01bdc-6e38-4eb0-8f87-b9c69e897cb5) are fixed. Every confidentiality line in the two Chapter 5 games is recorded in the [confidentiality sweep](confidentiality-sweep-2026-10-02.md). The same wording in other under-18 games moved to [SWED-122](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/0c1b8795-8d5d-4208-92d0-e1365dd590bc), fixed the same day.

**2026-10-03:** [SWED-85](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f4f2b093-af4a-4dc3-ba7e-ae11b7838c58) is fixed: A6 and A8 to A11 are attributed, hedged or dropped.

| Priority | Ticket | Covers |
|---|---|---|
| Urgent | [SWED-79](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/1163d808-7f9b-4cc5-8571-c2e084e7221e) Update transgender law content for the 2026 amendment | A1 |
| Urgent | [SWED-80](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5656f62f-d7dc-4f60-bdef-0e52c8a67b6b) Name the POCSO reporting limit in sexual-health confidentiality content | A2, and `pl-1096` from A3 |
| High | [SWED-81](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/346e8997-2ede-4e3b-a749-f8e7da185355) Replace the "just between us" model lines | A3 |
| High | [SWED-82](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e2f01bdc-6e38-4eb0-8f87-b9c69e897cb5) Reword the Get Help sheet's Childline confidentiality line | A4 |
| Decision | [SWED-83](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5f63c3db-0db3-4bb1-ab29-2806c72782cb) Anatomical words in Chapter 1-3 body-safety games | A5 |
| Decision | [SWED-84](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/73023a9c-e912-4e59-ab0a-b4028cacc7e7) Clinical content policy for the app | A7 |
| Medium | [SWED-85](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f4f2b093-af4a-4dc3-ba7e-ae11b7838c58) Attribute and qualify statistics; unify puberty ages | A6, A8 to A11 |
| Medium | [SWED-71](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007) Voice cleanup (dashes, spelling, quotes, "bad feeling" added to it) | A13, A14, A17, A18 |
| Medium | [SWED-68](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62) Match and sort challenge (content half, near-duplicate rights added to it) | A12 |
