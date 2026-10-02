---
type: research
owner: the-equal-lens
title: "SwipeEd and the MIT Solve 2027 Global Learning Challenge (2026-10-03)"
description: Whether SwipeEd is eligible for MIT Solve's 2027 Global Learning Challenge (deadline 2 November 2026), how it scores on Solve's eight criteria after the 2 and 3 October safety fixes, which focus area to lead with, which prizes fit, and what has to happen before applying.
tags: [swipeed, mit-solve, funding, eligibility, learning-challenge]
timestamp: 2026-10-03T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9f70534d-efc0-4daf-a265-e3ea21e69687  # SWED-124
---

# SwipeEd and the MIT Solve 2027 Global Learning Challenge

This updates a draft check from 2 October that lives in the parity-tracker repo
(`knowledge/research/solve-swipeed-learning-check.md`), which said the analysis belongs in SwipeEd's knowledge
base. Solve's challenge page was read on 3 October 2026. Scores are an internal 1 to 5, since Solve publishes no scale.

## Verdict

- **Eligible.** SwipeEd meets every hard rule: it is at least a Prototype, it uses technology, and the challenge has
  no country, organisation-type or language limits.
- **Not ready to win yet.** The topic fits the challenge, and since 2 and 3 October the safety record no longer
  blocks an application. But SwipeEd fits Solve's four focus areas only in part, and it has no evidence of
  learning. The month before 2 November is best spent on one measured pilot and one chosen focus area.

## Hard eligibility

| Rule (Solve challenge page) | SwipeEd | Met |
|---|---|---|
| Solution stage: Prototype, Pilot, Growth or Scale (Concept only for the Indigenous Communities Fellowship) | **Prototype**: live at swipeed.vercel.app and tested with players (friends playtesting Chapter 7). Solve counts a solution as a Prototype "until the solution transitions from testing to consistent availability". It becomes a Pilot once launched in at least one community, which a school or community pilot would do. | Yes |
| Uses technology (apps, software, AI and others) | A web app; an AI-generated curriculum checked by deterministic gates and a separate reviewer | Yes |
| Organisation type, country, applicant | No restrictions stated; global | Yes |
| Previously selected Solvers | Not applicable | Yes |
| Deadline | 2 November 2026, 12:00pm EST | 30 days away |

Still to confirm in Solve's FAQ (its old URL returns 404): whether one organisation can enter two different
solutions, since Nivel is being prepared for the Economic Prosperity challenge.

## What changed since 2 October

The draft named two blockers. Both are cleared:

- **The critical audit findings are fixed and live.** Transgender law content (SWED-79), the POCSO reporting limit (SWED-80), "just between us" model lines (SWED-81) and the Childline confidentiality promise (SWED-82) were all fixed on 2 October. So were the same promises in other under-18 games (SWED-122). Each line has a verdict in [the confidentiality sweep](../audits/confidentiality-sweep-2026-10-02.md).
- **The clinical-content position is decided (SWED-84):** the app teaches accurate health facts, never treatment advice, and every clinical topic points to care.

On 3 October these also shipped:
- statistics attributed (SWED-85);
- adult help routes in If, When & Whether (SWED-103);
- the Get Help button on every routed ending (SWED-88);
- internal ids removed from player text (SWED-123);
- three accessibility fixes (SWED-63, 86, 87);
- the POCSO e-Box on the helpline gate (SWED-64).

**Decided but not built:** correct body words from Chapter 1 (SWED-83). An application should describe it as under way.

## Scores (internal 1 to 5)

| Criterion | Stage | 2 Oct | Now | Why it moved, and the gap that remains |
|---|---|---|---|---|
| Alignment | screening | 3 | 3 | Relationships, sexuality and life-skills education from age 3 to parenthood is a recognised gap. The four focus areas fit only in part (below). |
| Potential for Impact | screening | 2.5 | 2.5 | 69 games across 8 age bands. No learners counted and no outcome measured. |
| Feasibility | screening | 3 | 3.5 | The critical content fixes are done, and safety checks are now enforced at build. Still English only, no school deployment plan, and the engine question (Owhile, SWED-111) is open. |
| Innovative Approach | screening | 4 | 4 | The mechanic is the lesson; one path from age 3 to parenthood; an AI curriculum behind deterministic gates. Name the alternatives (UNICEF's Oky, Love Matters India). |
| Human-Centered Design | screening | 2.5 | 2.5 | Safeguarding-first, with no fail state and Get Help everywhere. No co-design with children, parents or teachers is documented. |
| Scalability | finalists | 3.5 | 3.5 | Near-zero cost per learner; the pipeline can add languages. No distribution or funding plan. |
| Partnership Potential | finalists | 3 | 3 | Solve could help with school systems, evaluation, translation and safeguarding review. Not yet written. |
| Technical Feasibility | finalists | 4 | 4.5 | 77 nodes and 33,542 scenarios live; the gates now also catch confidentiality promises, internal ids and e-Box numbers. |

## Focus areas

| Focus area | SwipeEd today | To fit |
|---|---|---|
| Assessment of what learners know | None yet. The Unlearn, Relearn, Grow ritual already surfaces each misconception. | A short misconception check before and after a chapter, scored on the device and reported only as counts. **The most natural lead.** |
| Assistive or multilingual | Read-aloud, text size, calm mode, colour never the only signal; English only | Picture answer cards with tap-to-hear for children who cannot read yet (SWED-115 and 116, from the approved round-six pictures), then Hindi through the same pipeline. **A strong second.** |
| Teachers' instructional practice | Learner-facing; a School-Comfort mode | A facilitator mode inside The Equal Lens's school programmes |
| Emergency or low-resource settings | No offline mode (the service worker only clears caches) | Offline play and low data use. The weakest fit. |

Recommendation: lead with **assessment**, and name assistive design (pictures and read-aloud for pre-readers) as
the second focus. Both build on work already planned.

## Prizes

| Prize | Fit |
|---|---|
| Solver Award ($10,000) | Every selected team |
| AI for Humanity Prize (up to $150,000) | Strong. AI has a specific, load-bearing job: it writes the curriculum, deterministic gates prove helplines and age rules, and a separate reviewer re-derives answer keys. The audit and the fixes it led to are evidence that the review loop works. |
| Crescent Enterprises AI Prize (up to $100,000) | Possible; read its terms |
| Citizens Workforce Innovation Prize | Not eligible (US-based teams) |
| Community Catalyst, E Ink, Seeding the Future | Read each prize's terms before claiming fit |

## Before 2 November

1. **One measured pilot** with a classroom or community group, under The Equal Lens's child-safety rules: a misconception check before and after one chapter, with guardian consent and no photographs of children. This is the single biggest gain, and it moves SwipeEd from Prototype to Pilot.
2. **Build SWED-83** (correct body words in Chapters 1 to 3) through the reviewed pipeline, or describe it as in progress.
3. **The picture answer cards** (SWED-114 to 116) for Feelings Friends, if the assistive focus is claimed.
4. **State ownership:** The Equal Lens owns the curriculum and brand, and Owhile owns the engine. Say on what terms SwipeEd uses it (SWED-111).
5. **Team, budget and distribution plan,** naming delivery partners from The Equal Lens's school programmes if they agree.
6. **Confirm with Solve** whether The Equal Lens can enter SwipeEd here and Nivel in Economic Prosperity.

## Sources

- MIT Solve, [2027 Global Learning Challenge](https://solve.mit.edu/challenges/2027-global-learning-challenge), read 3 October 2026 (question, focus areas, stage rule, technology rule, deadline, prizes, criteria).
- MIT Solve stage definitions (Prototype, Pilot), via [Become a Solver](https://solve.mit.edu/innovators/become-a-solver), read 3 October 2026.
- The 2 October draft: parity-tracker repo, `knowledge/research/solve-swipeed-learning-check.md`.
- SwipeEd: [the question bank audit](../audits/question-bank-audit-2026-09-14.md), [the confidentiality sweep](../audits/confidentiality-sweep-2026-10-02.md), [the log](../log/log.md), [visual answer options](visual-answer-options-2026-09-15.md), README.
