---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/be-the-safe-adult.md
title: Be the Safe Adult
description: "Safeguarding literacy for parents, covering spotting abuse, POCSO basics, online dangers, and how to respond to a disclosure. The safeguarding keystone that closes the Parent Layer and underwrites the entire kids' journey: from My Body, My Rules onward the curriculum tells children to tell a trusted adult. This node makes sure that adult exists, notices and responds right. Maximum-care, trauma-informed, never graphic; the child is always the protected victim; routes real concerns to authorities."
resource: https://swipeed.vercel.app/game/be-the-safe-adult
tags: [games, swipeed, parenting, safeguarding, child-protection, pocso, disclosure, chapter-8]
timestamp: 2026-06-24T04:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Be the Safe Adult

> **Built to GDD 69 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The safeguarding keystone (the last Chapter-8 lesson node) that closes the Parent Layer and underwrites the
> *entire* kids' journey:** from [My Body, My Rules](my-body-my-rules.md) (g02) onward, every child node tells
> children to *"tell a trusted adult"*. **This node makes sure that adult exists, notices, and responds right.**
> *Maximum-care and trauma-informed; direct but never fear-mongering and never graphic.* A **406-scenario typed
> library** (`content/games/be-the-safe-adult.ts`: be-tellable 74 · spot-the-signs 74 · if-they-tell-you 36 ·
> the-law-and-the-call 76 · safe-online-and-off 72 · tools-and-respond 74), with seven play actions (strike-rewrite
> ×70 · role-play ×68 · branch ×63 · sort ×61 · match ×50 · spot ×47 · reflect ×47), **0% binary**, led by
> strike-rewrite (bust the myth) + role-play (say it) + branch (your move). Six modes: **be tellable** (the biggest
> protection is a child who knows they can tell you anything: the open, no-blame door built on purpose; busts
> *"it won't happen to us"* & *"they'd tell me anyway"*; **read silence as fear and threats, not betrayal**);
> **spot the signs** (behavioural & physical signs and grooming red flags, told calmly without paranoia; **most
> abuse is by a known, trusted adult, not a stranger**. A child's sudden fear of a familiar person is a signal);
> **if they tell you** (the disclosure response that shapes everything: **believe** the child, stay calm rather
> than show horror or rage, tell them clearly it is **not their fault**, do not interrogate but let them talk at
> their own pace, then **act and protect, never hush it up for the family's image**); **the law and the call**
> (**POCSO** basics: any sexual offence against an under-18 is a crime and the child is **always the victim**;
> reporting is obliged & protective; routes to **Childline 1098, the police, the POCSO e-Box**, and **cybercrime
> 1930** for online abuse); **safe online and off** (online grooming, exploitation & sextortion are real and
> **never the child's fault**: stay involved, keep the door open, keep evidence and report); **tools and respond**
> (the signs checklist, the disclosure-response steps, the helpline card; the child's safety always first).
> **High-care: educational and not legal advice; routes real concerns immediately to authorities; never provides
> any detail that could enable harm; centres the child as always the protected victim** (`reassureCats` [be-tellable
> · if-they-tell-you · safe-online-and-off] + `reassure` + `helpLine`). **gameId:** library, GDD and engine-host
> registry all agree on **`be-the-safe-adult`** (no trap). Engine: **no new mechanic and no `binStyle` change**.
> Pair-aware `binStyles` emulation found no visible mis-colours (*Helps spot it* / *Helps the child* / *Healthy
> safety* / *Real route* green; *Harms them* / *A dead end* red; the rest neutral). Spot ids injected (8). New-node
> wiring: `g69 → be-the-safe-adult` in the gen-path `GAME` dict (+ 🛟 emoji), `path.ts` regenerated (76
> built/playable, **all 69 lesson nodes now v2**), registered in `engine-host`. Read-first attested. **Builds on**
> [Safety Squad](safety-squad.md) (g08), [My Body, My Rules](my-body-my-rules.md) (g02) and [Firewall](firewall.md)
> (g40): the safety/online-safety spine, now in the trusted adult's hands. **Several Chapter-8 nodes route their
> child-safety concerns here** ([The Talks](the-talks.md) g64, [Break the Cycle](break-the-cycle.md) g65).

**Node #g69: Chapter 8, Parent Layer (safeguarding).** *Every game your child plays here tells them to tell a
trusted adult. This is where you become that adult.* This is the **node the whole catalog has been quietly
pointing to**: from [My Body, My Rules](my-body-my-rules.md) (#2) and [Safety Squad](safety-squad.md) (#8) onward,
children are taught to recognise unsafe situations and *tell someone*: g69 makes sure the someone is tellable,
observant, and gets the disclosure response right. Lensy returns with the catalog's most careful, trauma-informed
voice. **The spine: build the open, no-blame door on purpose; notice calmly (most harm is by someone known);
respond to a disclosure with belief, calm and "it's not your fault"; act and report; and treat the child as always
the protected victim.**

## What it embodies

- **Be tellable (14)**: the biggest protection is a child who can tell you anything; the open, no-blame door;
  read silence as fear and threats, not betrayal; busts *"it won't happen to us"* and *"they'd tell me anyway"*.
- **Spot the signs (14)**: behavioural & physical signs and grooming red flags, calmly; **most abuse is by a
  known, trusted adult**. A child's sudden fear of a familiar person is a signal.
- **If they tell you (14)**: the disclosure response: **believe**, stay calm, **not their fault**, don't
  interrogate, then act and protect, never hush it up.
- **The law and the call (14)**: POCSO basics; any sexual offence against an under-18 is a crime and the child is
  **always the victim**; reporting is obliged & protective; **Childline 1098, police, POCSO e-Box, cybercrime 1930**.
- **Safe online and off (14)**: grooming, exploitation & sextortion are real and **never the child's fault**;
  stay involved, keep evidence, report.
- **Tools and respond (14)**: the signs checklist, the disclosure-response steps, the helpline card; the child's
  safety always first.

**Safeguarding (maximum-care).** Trauma-informed and never graphic; **educational, not legal advice**; routes real
concerns immediately to authorities; **never provides any detail that could enable harm**; and centres the child
as **always the protected victim**. India: most child sexual abuse is by someone known to the family while silence,
disbelief and victim-blaming remain common, which makes the safe, tellable, correctly-responding parent decisive.
Routes: Childline 1098, the POCSO e-Box, the police, cybercrime 1930 (online), and 112 in immediate danger.
