export const meta = {
  name: 'forge-generate-game',
  description: 'Grow one SwipeEd game toward 400 scenarios: ground → (generate → review) per category → assemble + merge gate',
  phases: [
    { title: 'Ground', detail: 'distil GDD/personas → GROUNDING.md, return category quotas' },
    { title: 'Generate', detail: 'one agent per category, self-validated against forge_check' },
    { title: 'Review', detail: 'adversarial semantic check per category (safety-key/age-tone/autonomy/anchor)' },
    { title: 'Assemble', detail: 'merge all batches → forge_check --game + forge_dedup --verify' },
  ],
}

const GID = (typeof args === 'string' ? args : args.gameId)
const REPO = '/Users/priyanshu/swipeed-equal-lens'

const SHAPES = `
TARGET MECHANIC SHAPES (the gate REQUIRES these for new content; read scripts/forge/common.py if unsure):
- sort: EXACTLY 6 items; EVERY bin declares "valence" ∈ {"pos","neg","tell","uhoh","neutral"}; key maps every
  item id → a bin id; every bin used. e.g. bins:[{"id":"safe","label":"Safe","valence":"pos"},{"id":"unsafe","label":"Unsafe","valence":"neg"}].
- spot: EXACTLY 5 scene items, EXACTLY 2 with "trick":true (3 truths + 2 lies). (ONLY if spot is allowed for this band.)
  POLARITY (the #1 spot bug, so get this right): the engine only registers taps on the "trick":true items and shows
  them as "🚩 Caught!". So "trick":true MUST be the UNSAFE / WRONG / MANIPULATIVE / red-flag item the player is meant
  to CATCH, never the good/safe/healthy one. The "hook" MUST tell the player to find those bad items (e.g. "Spot the
  two red flags", "Spot which lines assume a yes"), NEVER "spot the green flags / the kind ones / the good moves".
  "why" explains why the caught items are the red flags. Inverting this silently teaches the wrong reflex (the engine
  has no fail state), so double-check every spot: do the 2 trick:true items match the bad thing the hook asks for?
- match: EXACTLY 5 pairs; distinct lefts; distinct rights; no left text equals a right text.
- branch: exactly one option "best":true; every non-best option has a "consequence".
- reflect: NO right answer. options:[…] + affirm:"…". Never put best/key/trick/answer on a reflect. Keep reflect for
  feelings, personal choices and safety lines ("it's not your fault"), where every answer is acceptable.
- choose: prompt + EXACTLY 6 options:[{"text","fits","note"}], 2 to 4 with "fits":true (vary the count). Use it for a
  lesson or values question with a defensible answer. Wrong options must be genuinely tempting (a common belief or a
  near miss), never silly, never "Yes"/"No"/"Both", never a copy of the question. Every note is one short sentence:
  for a fitting option, why it fits (shown if missed); for the others, why it does not (shown if picked). Fitting
  option texts and every note must be TRUE.
- strike-rewrite: myth:{un, re, why}. "un" is the gentle myth; "re"+"why" MUST be true.
- role-play: setup + yourLine:[{text,best?}] (exactly one best).
- build: prompt + pieces:[…] + mode:"assemble"|"sequence" + key:[…] (key ⊆ pieces).
- swipe: cue (the card text) + left + right (short side labels) + answer:"left"|"right" + leftValence and rightValence
  from {"pos","neg","tell","uhoh","neutral"} (declared, never inferred). The two sides differ. (ONLY if swipe is
  allowed for this band.)
- explore-label: parts:[…] + find (what to look for, a noun phrase such as "the part that pumps blood") + answer (one
  of parts) + reveal (the fact shown after). Anatomy parts must be real body regions.
Base fields on EVERY scenario: id, cat, type, persona, source, relearn, hook.
HARD limits: every visible string ≤160 chars; whole-scenario prose total ≤ the band ceiling. Helpline numbers EXACT.
No US framing (no 911/CPS/$/"grade 3"/zip). ids globally unique.
NARRATOR: never start any line with "Lensy:" or "Sam:" (the app shows every hook on Lensy's question card, so a prefix
repeats the speaker). If the GROUNDING or GDD writes lines as "Lensy: ..." or "Sam: ...", drop the prefix.
VOICE (the gate rejects these, scripts/forge/lints.py): no em or en dashes anywhere (use a hyphen, comma, colon or full
stop). A reflect or choose hook plus prompt asks ONE question: no second question and no tag question such as
"Agree?", "Clear?" or "Useful shift?" at the end of the hook. A match left and its right share no word (so a pair
cannot be matched by wording), and match rights are clearly different from each other, never near-synonyms. A sort
item shares no word with its own zone's label. A strike-rewrite myth.re reads on its own (no "It", "They", "Both" or
"This" pointing back at the myth), because it may be shown alone as a truth card.`

const GROUND_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['grounding_path', 'band_ceiling', 'current_total', 'target_total', 'helpline', 'allowed_mechanics', 'id_prefix', 'categories'],
  properties: {
    grounding_path: { type: 'string' }, band_ceiling: { type: 'number' }, id_prefix: { type: 'string' },
    current_total: { type: 'number' }, target_total: { type: 'number' },
    helpline: { type: 'string' }, allowed_mechanics: { type: 'array', items: { type: 'string' } },
    categories: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['cat', 'target', 'quota', 'idStart', 'idEnd'],
        properties: {
          cat: { type: 'string' }, target: { type: 'number' }, idStart: { type: 'number' }, idEnd: { type: 'number' },
          quota: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['type', 'count'], properties: { type: { type: 'string' }, count: { type: 'number' } } } },
        },
      },
    },
  },
}

const GEN_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['cat', 'ndjson_path', 'generated', 'reshaped', 'gate_clean', 'exhausted', 'note'],
  properties: {
    cat: { type: 'string' }, ndjson_path: { type: 'string' },
    generated: { type: 'number' }, reshaped: { type: 'number' },
    gate_clean: { type: 'boolean' }, exhausted: { type: 'boolean' }, note: { type: 'string' },
  },
}

const REVIEW_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['cat', 'reviewed', 'fixed', 'gate_clean_after', 'flags'],
  properties: {
    cat: { type: 'string' }, reviewed: { type: 'number' }, fixed: { type: 'number' },
    gate_clean_after: { type: 'boolean' }, flags: { type: 'array', items: { type: 'string' } },
  },
}

const ASSEMBLE_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['total', 'gate_pass', 'dedup_intra', 'under_target', 'failures'],
  properties: {
    total: { type: 'number' }, gate_pass: { type: 'boolean' }, dedup_intra: { type: 'number' },
    under_target: { type: 'boolean' }, failures: { type: 'array', items: { type: 'string' } },
  },
}

phase('Ground')
let ground = null
for (let groundTry = 1; groundTry <= 3 && (!ground || !ground.categories); groundTry++) {
if (groundTry > 1) log(`ground:${GID} retry ${groundTry}/3: prior attempt returned null (likely transient server rate-limit)`)
ground = await agent(
  `You are the GROUNDING agent for SwipeEd game "${GID}" (repo ${REPO}; work there).
Read, in order: ${REPO}/.forge/${GID}/plan.json (categories, band ceiling, allowed mechanics, reshape worklist);
the game's GDD PDF + Scenario Library JSON + the matching Chapter personas PDF under ${REPO}/Strategy/ (glob for
them by the game's GDD number/name); and ${REPO}/src/content/games/v2-schema.ts.
Then WRITE ${REPO}/.forge/${GID}/GROUNDING.md containing: the game purpose + exact age band; for EACH category,
its teaching intent + 6-10 GDD-cited "truth anchors" (statements new content must NOT contradict); the persona
voices/names available; the EXACT helpline string for this game; and banned framings (e.g. fear-based scare copy,
any wrong-buzzer on a reflect, good/bad instead of safe/unsafe for young kids).
Return the schema object: grounding_path, band_ceiling, current_total, target_total, helpline, allowed_mechanics,
id_prefix (plan.json id_prefix), and categories[] with each cat's target, quota[] (convert plan.json's
generate_by_type dict to {type,count} array), and idStart/idEnd (plan.json id_blocks[cat][0] and [1]).`,
  { label: `ground:${GID}${groundTry > 1 ? ` r${groundTry}` : ''}`, phase: 'Ground', schema: GROUND_SCHEMA, agentType: 'general-purpose' })
}
if (!ground || !ground.categories) throw new Error(`ground:${GID} failed after 3 attempts. The server is likely rate-limiting; relaunch this game alone when the field is clear`)

const cats = ground.categories

phase('Generate')
const results = await pipeline(cats,
  (c) => agent(
    `You GENERATE new scenarios for ONE category of SwipeEd game "${GID}" and self-validate them against a
deterministic gate until clean. Work in ${REPO}.
CATEGORY: "${c.cat}". QUOTA (generate up to this many of each mechanic): ${JSON.stringify(c.quota)}.
ID RANGE: every NEW scenario's id is ${ground.id_prefix}-N with N from ${c.idStart} to ${c.idEnd}, the block the planner
allocated to this category above every id in the bank. The gate rejects any other id, any id used twice, and any
shipped id that is not a reshape on the plan's worklist (assembly would otherwise overwrite a live scenario).

1) GROUND: read ${REPO}/.forge/${GID}/GROUNDING.md (authoritative), ${REPO}/src/content/games/v2-schema.ts, and
   EVERY existing scenario with "cat":"${c.cat}" in ${REPO}/src/content/games/${GID}.ts (match voice; AVOID making
   near-duplicates of them or of each other).
${SHAPES}
2) GENERATE up to the quota, all cat:"${c.cat}", all at the TARGET shapes above, genuinely DISTINCT (different
   real situations, India-grounded, not reworded twins). QUALITY-FIRST: if you run out of genuinely distinct,
   GDD-faithful ideas before hitting the quota, STOP and set exhausted=true with a note. Do NOT pad with
   paraphrases (padding is the exact failure we're avoiding).
3) RESHAPE: also find every existing "cat":"${c.cat}" scenario in ${GID}.ts whose shape is legacy (sort with ≠6
   items, spot with ≠5 items or ≠2 tricks, match with ≠5 pairs) AND is on plan.json's reshape_legacy worklist,
   and rewrite it to the target shape KEEPING ITS ID, TYPE AND CATEGORY (add genuinely-fitting items/pairs + the
   required valence; never change a correct answer). Include these in your output (they replace by id on assembly).
4) WRITE all of them as NDJSON (one JSON object per line, no array) to ${REPO}/.forge/${GID}/gen/${c.cat}.ndjson
5) SELF-VALIDATE (Bash), repeat until it prints "batch: 0 rejected":
     cd ${REPO} && python3 scripts/forge/forge_check.py --batch .forge/${GID}/gen/${c.cat}.ndjson --game ${GID}
   Read every REJECT, FIX that scenario, re-run. The Python gate is the arbiter: make IT pass.
Return the schema object (ndjson_path, generated, reshaped, gate_clean, exhausted, note).`,
    { label: `gen:${c.cat}`, phase: 'Generate', schema: GEN_SCHEMA, agentType: 'general-purpose' }),
  (gen, c) => agent(
    `You are an ADVERSARIAL content reviewer (a DIFFERENT perspective than the generator) for SwipeEd game
"${GID}", category "${c.cat}". The generated batch is at ${gen.ndjson_path}. Read it + ${REPO}/.forge/${GID}/GROUNDING.md.
For EACH scenario, check (and FIX in the file if wrong):
- SAFETY-KEY: independently re-derive the correct answer (sort item→bin, branch best, match pairing, spot tricks,
  strike re, choose fits: decide which of the 6 options fit BEFORE reading the "fits" flags, then compare). REJECT/FIX any INVERSION, e.g. trusting a stranger or keeping an unsafe secret marked "safe/best",
  a green-flag binned as a red-flag, telling a trusted adult framed as wrong. (The engine has no fail state, so a
  wrong key silently teaches the unsafe reflex. This is the most important check.)
- AGE-TONE: for this age band, nothing frightening, graphic, or more detail than the GDD introduces; gentlest
  GDD-faithful framing; safe/unsafe not good/bad for young kids.
- AUTONOMY: no feeling or bodily "no" presented as a wrong answer; every reflect option genuinely acceptable.
- TRUTH-ANCHOR: doesn't contradict or NARROW a GROUNDING anchor (e.g. "tell ANY trusted adult", not "only a teacher").
Edit ${gen.ndjson_path} in place to fix issues. Then re-run (Bash) until "batch: 0 rejected":
   cd ${REPO} && python3 scripts/forge/forge_check.py --batch .forge/${GID}/gen/${c.cat}.ndjson --game ${GID}
Return the schema object (reviewed, fixed, gate_clean_after, flags = short notes on what you changed and why).`,
    { label: `review:${c.cat}`, phase: 'Review', schema: REVIEW_SCHEMA, agentType: 'general-purpose' })
)

phase('Assemble')
const assembled = await agent(
  `You ASSEMBLE + GATE SwipeEd game "${GID}". Work in ${REPO}. Steps (Bash):
1) Combine all category batches: cat ${REPO}/.forge/${GID}/gen/*.ndjson > ${REPO}/.forge/${GID}/combined.ndjson
2) Merge into the game (writes ${GID}.ts, parse-or-die round-trip):
     python3 scripts/forge/forge_assemble.py --game ${GID} --batch .forge/${GID}/combined.ndjson --apply
3) Run the BLOCKING merge gate over the whole committed file:
     python3 scripts/forge/forge_check.py --game ${GID}
   If it FAILS, read the failures, FIX the offending scenarios directly in ${REPO}/src/content/games/${GID}.ts
   (every sort must be 6 items + valence, spot 5/2, match 5; ≤160/field; under band ceiling), and re-run until PASS.
   Note: ALL legacy scenarios must now be at target shape too. If the gate flags an un-reshaped legacy sort/match,
   fix it in place.
4) Whole-bank dedup: python3 scripts/forge/forge_dedup.py --verify --game ${GID}  (resolve any INTRA-band collision
   by editing the newer scenario to be genuinely distinct, then re-run).
5) If the final total is < 400, that's allowed (quality-first) but you MUST write
   ${REPO}/.forge/${GID}/exhaustion.json = {"count": <n>, "target": 400, "reason": "<which categories exhausted and why>"}
   so the gate permits the dip on record.
6) Confirm: python3 scripts/forge/forge_check.py --game ${GID} prints PASS, and tsc is unaffected (you changed only
   ${GID}.ts content).
Return the schema object: total (final scenario count), gate_pass, dedup_intra (count of unresolved intra-band
collisions, must be 0), under_target (true if <400), failures (any remaining issues; empty if clean).`,
  { label: `assemble:${GID}`, phase: 'Assemble', schema: ASSEMBLE_SCHEMA, agentType: 'general-purpose', effort: 'high' })

return { game: GID, ground, perCategory: results, assembled }
