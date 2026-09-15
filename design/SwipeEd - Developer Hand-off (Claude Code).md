# SwipeEd: Developer Hand-off (Claude Code)

*For the game-dev build chat · Updated June 2026 · companion to “SwipeEd: Seasons Implementation (Claude Code)”*

> ## ⚠️ HISTORICAL: June 2026 snapshot. Do not treat as live direction.
>
> This document is kept for provenance. Every count and most of the "what to do next" in it has been
> overtaken:
>
> - **Counts.** It says *36 → 42 games + 5 capstones (47 nodes)*, `node_id` `g01, g42` / `c1, c5`, `order`
>   `1…47`. The path is now **69 lesson games (`g01, g69`) + 8 capstones (`c1, c8`) = 77 nodes**, `order`
>   `1…77`, across **8 chapters, ages 3 → parenthood**. Every game has since been grown to **≥400
>   scenarios** by the [forge pipeline](knowledge/games/swipeed-content-pipeline.md).
> - **"Do NOT build yet" (§0.7, §7) is obsolete.** The **manosphere beat** was built as `g43` *The Rabbit
>   Hole*; the **parent layer** was built as **Chapter 8 (Parenthood, `g61, g69` + `c8`)`**; **18+ content**
>   was built as **Chapters 6-8**. Only **0-2** remains genuinely out of scope.
> - **Seasons are gone.** The companion "Seasons Implementation" doc is likewise historical: the Equal
>   Lens re-skin replaced the seasonal grassland with a season-independent canvas world. Only the §7
>   bedtime wind-down nudge survives. See [path world](knowledge/games/swipeed-world.md).
> - **Engine.** This predates the GDD v2 "mechanic-embodying" standard: the single shared `v2-engine.tsx`
>   that every game now wraps. See [game patterns](knowledge/games/swipeed-game-patterns.md).
>
> For current state start at [`knowledge/games/swipeed.md`](knowledge/games/swipeed.md) and
> [`knowledge/games/swipeed-build-overview.md`](knowledge/games/swipeed-build-overview.md).

---

## 0. TL;DR: what changed, what to do

Since the last build, the design grew and the data source changed. In priority order:

1. **Project grew from 36 → `42 games + 5 capstones` (47 nodes).** Six new games were added.
2. **Re-import the Master Node Table.** `order` was re-sequenced, the `prerequisite` chain rewired, a new **`gating`** column added, and several `topics` re-tagged. It is the single source of truth: pull node data from it, don’t hand-edit in code.
3. **Add the 6 new game nodes** (`g37`, `g42`) to the path at their `order` positions. Each has a full GDD.
4. **Implement the `gating` field** → drives the school-comfort toggle.
5. **Build a new cross-cutting system: the Life-Skills Toolkit + wellbeing shell** (see §5).
6. **Confirm the world↔game integration model** (open question: see §6).
7. **Do NOT build yet:** the manosphere/misogyny beat, the parent layer, and 0-2 / 18+ content (see §7).

---

## 1. Source-of-truth files (read these first)

| File | Status | Use it for |
|---|---|---|
| `SwipeEd - Master Node Table.xlsx` | **UPDATED** | The path data. 47 nodes; sheet “Master Node Table”. **Re-import.** |
| `Comprehensive Sexuality Education - Topic Map (Ages 3-18).xlsx` | **UPDATED** | The curriculum (content, not code). UNESCO-8; adds 5.6, 6.5; gating column. |
| `SwipeEd - Life-Skills Toolkit (Thread C Spine).docx` | **NEW** | Spec for the new Toolkit + wellbeing-shell system (§5). |
| `SwipeEd - Seasons Implementation (Claude Code).md` | unchanged | Seasons, weather FX, day/night wind-down. Still valid. |
| `GDD 01`, `GDD 42` (Word) | 6 new | Per-game content/specs. New: GDD 37, 38, 39, 40, 41, 42 + GDD 24 (standard edition). |
| `SwipeEd - Project Summary.docx` / `SwipeEd - Critical Audit (...).docx` | reference | Background & rationale; not required to build. |

---

## 2. What’s new & updated since the last build

**New game GDDs (6):** Clean Crew (g37), Heart Smart (g41), Mind Matters (g38), Bounce (g39), Firewall (g40), Life Ready (g42). Plus GDD 24: Green Light / Red Light *standard edition* (the two earlier GL/RL deep-dive docs remain as references).

**New system doc:** the Life-Skills Toolkit spine (§5).

**Updated data:** Master Node Table (re-sequenced + gating + retags) and the Topic Map (comprehensive UNESCO-8; new topics 5.6 Emotions/Mental Wellbeing, 6.5 Hygiene; enriched 7.x positive sexuality; gating column).

---

## 3. The 6 new game nodes (add to the path)

Exact current data from the Master Node Table. Season comes from the chapter (Ch1 Summer · Ch2 Rainy · Ch3 Autumn · Ch4 Winter · Ch5 Spring).

| order | node_id | game | chapter (age) · season | thread · hex | topics | prereq | builds_on | gating | GDD |
|---|---|---|---|---|---|---|---|---|---|
| 3 | `g37` | Clean Crew | Ch1 (3-6) · Summer | A · `#0EA5E9` | 6.5, 6.1 | g02 | none | Core | GDD 37 |
| 12 | `g41` | Heart Smart | Ch2 (6-9) · Rainy | C · `#F59E0B` | 5.6, 5.3, 5.2, 1.3 | g09 | g01 | Core | GDD 41 |
| 18 | `g38` | Mind Matters | Ch3 (9-12) · Autumn | C · `#F59E0B` | 5.6, 5.5 | g13 | g01 | Core | GDD 38 |
| 28 | `g39` | Bounce | Ch4 (12-15) · Winter | C · `#F59E0B` | 5.6, 5.5 | g21 | g38 | Core | GDD 39 |
| 35 | `g40` | Firewall | Ch4 (12-15) · Winter | B · `#DC2626` | 4.3, 4.1, 5.5 | g27 | g15 | **Gated** | GDD 40 |
| 45 | `g42` | Life Ready | Ch5 (15-18) · Spring | C · `#F59E0B` | 5.2, 5.6, 5.1, 5.5 | g35 | g39 | Core | GDD 42 |

One-liners: **Clean Crew** (hygiene/self-care (parent co-play, no fail). **Heart Smart**) empathy, handling feelings, getting along. **Mind Matters** (mental wellbeing & resilience. **Bounce**) teen resilience/stress/mental health. **Firewall** (teen online safety (grooming/sexting/sextortion). **Life Ready**) adult life-skills (self-knowledge, decisions, transitions, support).

---

## 4. CRITICAL: re-import the Master Node Table (don’t hand-edit)

The table is the data source; the app should read it (or a generated JSON export of it). Key rules:

- **`node_id` is the stable identity** (g01, g42, c1, c5). **Key all save-data, routes and asset folders on `node_id`, never on `order`.** Many `order` values changed in this update; if progress is keyed on order, it will corrupt. `node_id` never changes.
- **`order` is the visual path position only** (1…47). Lay the path out in `order`.
- **`prerequisite`** = the immediately preceding node: the linear unlock gate (you can’t start a node until its prerequisite is done). It was rewired for every node after each insertion; re-read it wholesale.
- **`builds_on`** = a spiral “callback” link (non-blocking): use for the companion/UN&RE to reference the earlier game, not for gating.
- **`gating`** (new column) → `Core` / `Gated` / `Sensitive`:
  - `Core`: always on.
  - `Gated`: shown only when the **school-comfort toggle** is enabled (e.g., Plan It, Outbreak, Green Light/Red Light, Firewall, Reality Check, My Choices, Status, Decoded).
  - `Sensitive`: most sensitive (Mutual, Spectrum); gate and make individually disable-able.
- **Thread → colour** (apply to the node on the path):

  `A #0EA5E9` · `B #DC2626` · `C #F59E0B` · `D #EC4899` · `E #7C3AED` · `F #059669` · `G #475569` · Capstone ★ `#EAB308`

---

## 5. NEW SYSTEM: the Life-Skills Toolkit + wellbeing shell

Full spec: **`SwipeEd - Life-Skills Toolkit (Thread C Spine).docx`**. Summary for the build:

**The Toolkit**: a persistent, on-device object the player owns, holding four tools that unlock and level up as the Thread-C games are played:

- **Cool-Down** (feelings) · **Decision Steps** (choices) · **Talk-It-Out** (communication/conflict) · **Help Map** (help-seeking).
- Owned/levelled by the five Thread-C games, one per chapter: `g01` Feelings Friends → `g41` Heart Smart → `g38` Mind Matters → `g39` Bounce → `g42` Life Ready.

**Two surfaces to build:**
1. A **Toolkit drawer**: open any unlocked tool from anywhere.
2. **“Tool-moment” hooks**: short, optional, authored prompts injected into *other* games at key beats (e.g., “Cool-Down moment” before a tense choice in Green Light/Red Light or Mutual; “Help Map” in a Firewall sextortion scenario). Model: a tool-moment references a `tool_id` + the host game/beat. Wire these into the highest-stakes games first (Firewall, Mutual, Green Light/Red Light, Stand Up).

**The wellbeing app-shell** (chrome, app-wide):
- Optional **mood check-in** on entry (never required/scored; can suggest a Cool-Down or the Help Map).
- A **breathing space** one tap away from anywhere.
- **Kind streaks**: no shame on a missed day; offer a streak-freeze; no guilt-tripping.
- **Calm mode** (reduced-stimulation) across the app.
- **Day/night wind-down**: already specified in the Seasons doc; the Toolkit hooks into it.

**Guardrails (enforce in content tooling):**
- **Healthy-coping only**: the Cool-Down library must be a curated safe set (breathe, ground, talk, move, rest, create). No strategy using pain, physical discomfort, shock or restriction can be authored in.
- **Help-routing**: mood check-in & Help Map route any sign of crisis to real help (trusted adult, Childline 1098, Tele-MANAS 14416, KIRAN 1800-599-0019, cybercrime 1930).
- **Privacy**: toolkit, mood data, notes and any Ask-It content are **on-device, never uploaded, never identity-linked** (DPDP-aligned). This is the most sensitive data in the app.

---

## 6. Open decisions / flags

- **World↔game integration model: please confirm.** The 3D seasonal world and the (mostly 2D) games need a defined join: is the world the lobby/map you travel and games launch from nodes, or do games play *inside* the world? This wasn’t pinned in the design docs; the build presumably made a call, document it so design and code stay in sync.
- **Reality Check (`g28`) re-tagged with `4.3`** (online safety): it already covers image-abuse/reporting; just a metadata sync, no behaviour change.

---

## 7. Planned: do NOT build yet

- **Manosphere / online-misogyny beat**: a new content area (rising in current guidance). Will be spec’d as a beat or small game and slotted in like Firewall. Leave a hook, don’t build.
- **Parent layer**: a parent-facing curriculum/onboarding (the project assumes parent sign-off + mediation, esp. for younger ages). Coming later.
- **0-2 and 18+ content**: deliberately out of scope for now.

---

## 8. Build checklist

- [ ] Re-import / re-export the Master Node Table → app path data (47 nodes).
- [ ] Verify all save-data, routes and assets key on **`node_id`**, not `order`.
- [ ] Add nodes **g37, g42** at their `order` positions, with correct season region, thread colour, prereq and gating.
- [ ] Implement the **`gating`** field → school-comfort toggle (gate `Gated`/`Sensitive`).
- [ ] Build the **Life-Skills Toolkit** object + drawer UI + tool-moment hooks (start with Firewall, Mutual, GL/RL, Stand Up).
- [ ] Build the **wellbeing shell** (mood check-in, breathing space, kind streaks, calm mode) and hook the existing day/night wind-down.
- [ ] Wire the 6 new games’ content from their GDDs.
- [ ] Confirm & document the **world↔game integration** model.
- [ ] Leave a hook for the **manosphere** beat; don’t build the parent layer / 0-2 / 18+ yet.

---

## Appendix: new-node data block (for import)

```json
[
  {"order":3,  "node_id":"g37","label":"Clean Crew",  "type":"Lesson","chapter":"Ch.1","age_gate":3, "thread":"A","hex":"#0EA5E9","topics":["6.5","6.1"],            "prerequisite":"g02","builds_on":null,"gating":"Core",  "season":"Summer"},
  {"order":12, "node_id":"g41","label":"Heart Smart", "type":"Lesson","chapter":"Ch.2","age_gate":6, "thread":"C","hex":"#F59E0B","topics":["5.6","5.3","5.2","1.3"],"prerequisite":"g09","builds_on":"g01","gating":"Core","season":"Rainy"},
  {"order":18, "node_id":"g38","label":"Mind Matters","type":"Lesson","chapter":"Ch.3","age_gate":9, "thread":"C","hex":"#F59E0B","topics":["5.6","5.5"],            "prerequisite":"g13","builds_on":"g01","gating":"Core","season":"Autumn"},
  {"order":28, "node_id":"g39","label":"Bounce",      "type":"Lesson","chapter":"Ch.4","age_gate":12,"thread":"C","hex":"#F59E0B","topics":["5.6","5.5"],            "prerequisite":"g21","builds_on":"g38","gating":"Core","season":"Winter"},
  {"order":35, "node_id":"g40","label":"Firewall",    "type":"Lesson","chapter":"Ch.4","age_gate":12,"thread":"B","hex":"#DC2626","topics":["4.3","4.1","5.5"],     "prerequisite":"g27","builds_on":"g15","gating":"Gated","season":"Winter"},
  {"order":45, "node_id":"g42","label":"Life Ready",  "type":"Lesson","chapter":"Ch.5","age_gate":15,"thread":"C","hex":"#F59E0B","topics":["5.2","5.6","5.1","5.5"],"prerequisite":"g35","builds_on":"g39","gating":"Core","season":"Spring"}
]
```

*Note: `order`/`prerequisite` for the existing nodes also shifted, always treat the Master Node Table as the source of truth and re-import the full set, not just these six.*
