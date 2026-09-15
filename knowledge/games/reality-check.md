---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/reality-check.md
title: Reality Check
description: A media-literacy game for ages 12-15, where you spot what's staged, faked or just untrue online. Judge real vs reel, open the manipulation files (UN & RE), get the honest media-and-sexuality reality check (School-Comfort-gated), learn your rights against deepfakes, and build a critical-questions toolkit. Critical, calm, never explicit; no-fail.
resource: https://swipeed.vercel.app/game/reality-check
tags: [games, swipeed, media-literacy, ages-12-15, deepfakes]
timestamp: 2026-06-20T20:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Reality Check

> **Reworked to GDD 28 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The teen media-literacy peak (Thread G · Values, Rights & Media, ages 12-15) is now a
> **566-scenario typed library** (`content/games/reality-check.ts`: real-vs-reel 99 · manipulation-files 99 ·
> media-love-sex 88 · fakes-and-rights 97 · finding-help 96 · think-for-yourself 87), generated **faithfully**
> from the scorecard-passed GDD 28 JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). **Eight
> typed play actions** (spot ×84 · strike-rewrite ×90 · **swipe ×81** · branch ×80 · reflect ×62 · sort ×57 ·
> role-play ×67 · match ×45), **0% binary tap**, led by spot (catch the trick), strike-rewrite (bust the claim)
> and **swipe** (real or reel? The **second game to use the swipe verb** after [GLRL](green-light-red-light.md)
> g24). Arc: real vs reel → the manipulation files → love/sex on screen (gated) → fakes & rights → find help →
> think for yourself. Teaches: seeing the curation (filters, highlight reels, ads), the manipulation toolkit, a
> **GATED non-explicit media-&-sexuality module** (films ≠ real love; pornography is staged performance, **not
> sex-ed**; normal bodies vary; **curiosity is normal, no shame**; learn from trusted sources), **deepfakes &
> your rights** (a fake nude of a minor is illegal CSAM, **never the target's fault**, reportable; verify the
> source), and the four critical questions. **Calm, critical, never explicit; POCSO/BNS/IT-Rules aware**; routes
> to a trusted adult, **cybercrime.gov.in / 1930, Childline 1098** (`reassureCats` [media-love-sex ·
> fakes-and-rights · finding-help] + `reassure` + helpLine). `gameId "reality-check"` (matches the registry id).
> Engine: **no new mechanic** (reuses 8 of 10); `binStyle` added `manipulation`→red + `not trusted`→red. Spot
> scene-item ids injected (16). Builds on [Crossroads](crossroads.md) (g16) & g12/g17; sets up
> [Decoded](decoded.md) (g36). The sections below describe the original v1 build, superseded by the v2 mechanic
> engine.

**Node #28: the media-literacy step of Chapter 4** (ages 12-15). *Almost nothing online is as real as it
looks: ads, influencers, romance, even photos.* The teen learns to **spot what's staged, what's fake, and
what's just not true.** It's the grown-up culmination of [Smart Screen Heroes](smart-screen-heroes.md)
(#12, online safety) and [Flip the Script](flip-the-script.md) (#17, media & image), widening their lens to
the whole feed and adding the **honest media-and-sexuality reality check** that teens reach the age to need.
It hands forward to **Decoded (#36)**, the finale. **Critical and calm, never explicit; the
media-and-sexuality card is gated by the School-Comfort toggle.**

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `reality-check`, route `/game/reality-check`.
- **Type:** reading-light **media-literacy** game · no fail · Q&A private; School-Comfort gates the love/sex card.
- **Age band:** 12-15 · **Curriculum:** UNESCO Key Concept 7 (media literacy & sexuality, incl. pornography) + media & information literacy. Builds on #12, #17; sets up #36.
- **Status:** live · https://swipeed.vercel.app/game/reality-check

## How it works: five modes + the Badge Book
1. **Real vs Reel**: the signature: judge whether a post/image/"life" is **real or staged & curated** (the
   influencer holiday, the glossy ad, the "we never fight" couple).
2. **The Manipulation Files**: spot the tricks via the **UN & RE** beat: *"if it's online it's real"* →
   *"posts are curated; images and video can be faked"*; *"everyone's life is better than mine"* →
   highlight reels; boss: *"you can't tell what's fake"* → *"every trick has a tell."*
3. **Love & Sex on Screen**: media dramatises and idealises love; and, **hidden in School-Comfort mode**,
   *pornography is staged performance, not real life, not a model to copy, and not sex education* (non-explicit).
4. **Fakes & Your Rights**: deepfakes/AI fakes; **non-consensual images are wrong and illegal**; protect
   and **report** (cybercrime helpline **1930**, cybercrime.gov.in, **Childline 1098**; never forward it).
5. **Think for Yourself**: the critical-questions toolkit: *Who made this, and why? What's left out? Is it
   staged, sponsored or faked? Does a reliable source confirm it?*

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Lensy returns in the teen
look, sharp and unshockable. Reuses the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), **myth-bust-by-choosing-the-truth (#19)**, **empower-never-frighten (#16)** (the
media-and-sexuality card non-explicit and gated; reporting built in), the **Ask-It / safe-helper box (#18)**
lineage (reporting routes to 1930 / cybercrime.gov.in / Childline 1098), and **Made-for-India +
School-Comfort (#14)** (IT-Act/POCSO-aware; the porn-specific card hidden in School-Comfort mode).

## Status & roadmap
- **Built:** Real vs Reel (judge sequence), The Manipulation Files (UN & RE, incl. a boss), Love & Sex on
  Screen (School-Comfort-gated card), Fakes & Your Rights (with the 1930/cybercrime/Childline reporting
  route), Think for Yourself (the toolkit); the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a richer "spot the tell" deepfake-detection mini-game, a fuller feed bank,
  crown levels, the returning Ask-It Q&A, Classroom-Mode polish, calm mode, and **Hindi**.
