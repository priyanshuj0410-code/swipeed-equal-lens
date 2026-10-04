---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/firewall.md
title: Firewall
description: "SwipeEd node #g40 (ages 12-15), the teen online-safety game. With Lensy, a teen spots grooming/catfishing red flags, thinks before sharing, rehearses a calm no-blame sextortion-response plan, busts online myths (UN & RE), and locks down privacy. High-stakes safeguarding, non-explicit, never victim-blaming, no how-to-harm, routes real situations to help."
resource: https://swipeed.vercel.app/game/firewall
tags: [games, swipeed, ages-12-15, online-safety, grooming, sextortion, digital-footprint, safeguarding, pocso, sam, un-re]
timestamp: 2026-06-21T14:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Firewall

> **Reworked to GDD 40 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The teen online-safety node (Thread B · Safety, ages 12-15), high-stakes safeguarding
> handled **calm, never fear-mongering**, is now a **538-scenario typed library** (`content/games/firewall.json`:
> spot-grooming 99 · think-before-share 91 · sextortion-plan 88 · myths-busted 99 · lock-it-down 75 ·
> find-help-no-blame 86), generated **faithfully** from the scorecard-passed GDD 40 JSON, on the **shared v2
> engine** (`components/games/v2-engine.tsx`). The old build is replaced by **seven typed play actions** (branch
> ×119 · strike-rewrite ×79 · spot ×85 · sort ×76 · role-play ×60 · reflect ×69 · match ×50), **0% binary tap**, led
> by the **safe-move chooser** (branch), **spot** (grooming red flags) and role-play. Arc: spot grooming & fakes
> → think before you share → the sextortion plan → online myths busted → lock it down → find help, no blame. The
> **signature SEXTORTION PLAN**: don't panic, don't pay, don't send more, it's **NOT your fault**, save the
> evidence (block but don't delete), tell a trusted adult, report. **Non-explicit, never victim-blaming, never
> how-to-harm; POCSO/IT-Act aware** (a minor is a **protected victim, never in trouble**); real routes: a
> trusted adult, **cybercrime.gov.in / 1930, Childline 1098** (`reassureCats` [spot-grooming · sextortion-plan ·
> find-help-no-blame] + `reassure` + helpLine). `gameId "firewall"` (matches the registry id). Engine: **no new
> mechanic**; `binStyle` gained `\bsafe\b`/`green flag`/`the truth`→green and `red flag`/`a trap`/`grows your
> risk`/`leaves you exposed`→red, plus a **safe-negation guard** (`not a red flag`/`not a trap`→green, checked
> *before* NEG so GLRL's milder "not a red flag" side stays correct). Spot scene-item ids injected (12). Builds
> on [Boundary Bot](boundary-bot.md) (g15); prereq g27. The sections below describe the original v1 build,
> superseded by the v2 mechanic engine.

**Node #g40 of the SwipeEd path** (ages 12-15, Thread B · Safety, Consent & Boundaries), inserted in
**Chapter 4 between [Stand Up](stand-up.md) (#g27) and [Reality Check](reality-check.md) (#g28)**. It
closes a real gap: the **highest-risk age for online grooming, sexting pressure and sextortion** had no
dedicated safety home between [Boundary Bot](boundary-bot.md) (#g15, 9-12) and [Decoded](decoded.md)
(#g36, 15-18). Guided by **Lensy** (a teen peer), a teenager learns to **recognise grooming and fake
profiles**, **think before they share** and understand the permanence of their **digital footprint**,
rehearse a calm response to **sextortion**, and **lock down** privacy/security, knowing exactly what to
do if something goes wrong, **calmly and without shame**. Its defining feature is its handling of
**sextortion**, which hits Indian teens especially hard because fear of family/social shame keeps victims
silent: *don't panic, don't pay, don't send more, it's not your fault, save the evidence, block, tell a
trusted adult, report.*

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path that launches in place (engine id `firewall`, route `/game/firewall`).
- **Type:** teen online-safety scenario game · **tap-list + rehearse-the-plan + UN & RE** engine (no punitive fail, no timer).
- **Age band:** 12-15 (self-directed, private). **Curriculum:** UNESCO **4.3** (safe use of ICTs) + **4.1** (violence/abuse) + **5.5** (finding help); India: cybercrime 1930, POCSO/IT-Act.
- **Prereq:** [Stand Up](stand-up.md) (#g27). **Builds on:** [Boundary Bot](boundary-bot.md) (#g15). **Carries:** [Smart Screen Heroes](smart-screen-heroes.md) (#g12). **Sets up:** [Decoded](decoded.md) (#g36); pairs with [Reality Check](reality-check.md) (#g28).
- **Status:** live · https://swipeed.vercel.app/game/firewall · **gated** node.

## How it works: five modes (no punitive fail)
1. **Who's Really There?** spot grooming/catfishing **red flags** (flattery & gifts, fast secret closeness, secrecy, moving to private/disappearing apps, asking for photos, testing boundaries, fake profiles). Calm, proportionate: *most people online are genuine*.
2. **Think Before You Share**: the risks and permanence of sharing, resisting pressure to send (*'no' is always valid; a partner who pressures is a red flag*), and the digital footprint. The **explicit sexting line is gated behind School-Comfort** (per GDD §11).
3. **Sextortion: Don't Panic** *(the signature)*: **rehearse the calm, no-blame plan step by step** (don't panic / don't pay / don't send more / save evidence / block / tell a trusted adult / report) under a **persistent "It is not your fault" banner**. POCSO/IT-Act-aware: a minor is a **protected victim**, never in trouble.
4. **Online Myths Busted** *(the UN & RE beat)*: **unlearn** the myths that enable these harms ("everyone sexts", "it'll stay private", "if I got tricked it's my fault", "paying makes it stop") and **relearn** the safe truth. Busting the **self-blame** myth is what gives a frightened teen the courage to tell someone.
5. **Lock It Down**: privacy/security settings, **block & report**, footprint care, naming your trusted adults, and the helplines.

A **5-skill badge book** (🛡️ per mode) fills as each mode completes; the fifth finishes the node via
`GameDone` (`gameId="firewall"`, 3★ / 30 coins). **Lensy** (teen) hosts; voice via the shared `speak.ts`;
the myth-busting reuses the shared **[UN & RE](swipeed-core-principle.md)** duo.

## Safeguarding (high-stakes: read first, GDD §12 & §18)
- **Non-explicit; no how-to-harm.** Teaches recognition and safe response only, never depicts explicit
  content or describes how grooming/sextortion is carried out (no harmful "safe move" can be authored in).
- **Never victim-blaming.** The fault is always the abuser's; being tricked, pressured or extorted is
  never the teen's fault, stated repeatedly. The honour/shame pressure is addressed directly.
- **Calm, action-focused sextortion beat.** A rehearsable, reassuring plan, never frightening.
- **Urgent disclosure routing.** Any sign a teen is being groomed, pressured or extorted routes
  immediately to a trusted adult and **cybercrime 1930 / cybercrime.gov.in · Childline 1098**, the
  highest priority in the safety thread.
- **POCSO/IT-Act-aware.** Any sexual image of an under-18 is treated as child sexual abuse material to
  report; the minor is a protected victim, never the wrongdoer.
- **School-Comfort-gated & expert-reviewed.** The toggle sets the sexting/sextortion depth.
- The anonymous **Ask-It** Q&A with the strongest grooming/sextortion triage is **GDD Phase 2**,
  deferred here; the Lock It Down + Sextortion modes carry the help-seeking learning and helplines.

## Inherited & established patterns
Inherits the [reusable patterns](swipeed-game-patterns.md), and **extends pattern #16 (empower, never
frighten) into teen online-safety**: a **rehearsable, no-blame action plan** for a worst-case scenario, a
persistent "it's never your fault" message, **no how-to-harm**, and a **minor-as-protected-victim**
(POCSO/IT-Act) framing, with the most explicit naming behind **School-Comfort**. It uses the 5-mode grid
on `GameShell` with a Lensy header + badge row, **UN & RE on the key unlearn** (the self-blame myth), and
the **step-by-step rehearsal** sequence (shared with Clean Crew's routine).

## Status & roadmap
- **Built:** all five modes (Who's Really There? · Think Before You Share · Sextortion: Don't Panic ·
  Online Myths · Lock It Down), the 5-skill badge book, Lensy (teen) + voice, School-Comfort gating of the
  sexting specifics, helpline signposting, English narration.
- **Deferred (GDD Phase 2/3):** the anonymous **Ask-It** Q&A with urgent grooming/sextortion triage,
  crown levels, a richer scenario bank, a reduced-stimulation calm mode, Classroom internet-safety tools,
  and **Hindi** (with the app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [Boundary Bot (#g15)](boundary-bot.md) · [Smart Screen Heroes (#g12)](smart-screen-heroes.md) · [Stand Up (#g27)](stand-up.md) · [Reality Check (#g28)](reality-check.md) · [Decoded (#g36)](decoded.md) · [Core principle: Unlearn → Relearn → Grow](swipeed-core-principle.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
