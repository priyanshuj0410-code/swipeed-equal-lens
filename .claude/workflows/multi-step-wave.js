export const meta = {
  name: 'multi-step-wave',
  description: 'One chapter of the multi-step rollout: write each batch, then blind, audit and safety review in up to 4 rounds with fixes (SWED-100)',
  whenToUse: 'Run with args from `python3 scripts/forge/steps_wave.py plan <chapter>` (.forge/rollout/wave-args.json); safe to rerun after any stop, because every batch resumes from its files',
  phases: [
    { title: 'Write', detail: 'one writer per batch of about 50 (Opus for safety-heavy games)' },
    { title: 'Review', detail: 'per round (up to 4): blind picks (Sonnet), transition audit and safety-fidelity review (Opus)' },
    { title: 'Fix', detail: 'one fixer per batch per round; later rounds review only what changed' },
  ],
}

// Model choices (global rule 1 asks for a reason for Opus): the transition audit and the safety review run on Opus because
// a Sonnet auditor could not finish the audit, and Sonnet writers produced survivor-blaming options in Respect at Home.

const MAX_ROUNDS = args.maxRounds || 4
const STOP = { stopped_by_guard: { type: 'boolean', description: 'true if a usage guard message told you to stop before finishing' } }
const WRITE = { type: 'object', properties: { scenarios: { type: 'integer' }, rejected: { type: 'integer' }, coverage_ok: { type: 'boolean' }, round_one_ready: { type: 'boolean' }, unsure: { type: 'array', items: { type: 'string' } }, ...STOP }, required: ['scenarios', 'rejected', 'coverage_ok', 'round_one_ready'] }
const PICKS = { type: 'object', properties: { reviewed: { type: 'integer' }, hard_steps: { type: 'integer' }, ...STOP }, required: ['reviewed', 'hard_steps'] }
const AUDIT = { type: 'object', properties: { rows: { type: 'integer' }, breaks: { type: 'integer' }, notes: { type: 'integer' }, safety_notes: { type: 'integer' }, check_line: { type: 'string' }, ...STOP }, required: ['rows', 'breaks', 'notes', 'check_line'] }
const SAFETY = { type: 'object', properties: { rows: { type: 'integer' }, block: { type: 'integer' }, note: { type: 'integer' }, ...STOP }, required: ['rows', 'block', 'note'] }
const FIX = {
  type: 'object',
  properties: {
    coverage_ok: { type: 'boolean', description: 'false if steps_final.py check reported coverage problems' },
    blocking_found: { type: 'integer' }, notes_found: { type: 'integer' }, fixed: { type: 'integer' },
    kept: { type: 'integer', description: 'findings you judged wrong and left, each logged with a reason' },
    changed: { type: 'integer', description: 'the count printed by steps_final.py next' },
    rejected: { type: 'integer' }, batch_coverage_ok: { type: 'boolean' }, ...STOP,
  },
  required: ['coverage_ok', 'blocking_found', 'notes_found', 'fixed', 'kept', 'changed', 'rejected', 'batch_coverage_ok'],
}

const items = args.items
log(`${items.length} batches, ${items.reduce((n, it) => n + it.count, 0)} scenarios`)

const who = it => `${it.name} (\`${it.stem}\`), a SwipeEd Chapter ${it.chapter} game for ${it.audience}`
const S = it => `.forge/${it.stem}/steps`
const batch = it => `${S(it)}/batch-${it.nn}.ndjson`
const source = it => `${S(it)}/source-${it.nn}.ndjson`
const rdir = (it, r) => `${S(it)}/final-${it.nn}/r${r}`
const key = it => `${it.stem}-${it.nn}`
const minors = it => it.minors ? ' The players are under 18: also apply `scripts/forge/briefs/steps-minors.md`, which wins where it differs.' : ''
const shared = 'Other agents are working on other batches at the same time: touch no files except the ones your brief names for this batch, never edit scripts, and do not run git. If a check script seems wrong, say so in your reply instead of changing it. If a "Usage guard" message tells you to stop, save what you have and return with stopped_by_guard true.'
const halted = x => !x || x.stopped_by_guard
const heavyModel = it => it.safetyHeavy ? { model: 'opus' } : { model: 'sonnet', effort: 'high' }

async function run(it) {
  const k = key(it)
  const trail = []
  let r = it.round
  let stage = it.stage
  if (stage === 'write') {
    const w = await agent(
      `You are the writer for batch ${it.nn} of ${who(it)}.${minors(it)}\n\n` +
      `Follow \`scripts/forge/briefs/steps-write.md\` exactly, with <game> = ${it.stem} and NN = ${it.nn}. Your source is \`${source(it)}\` (${it.count} scenarios) and your output is \`${batch(it)}\`. ` +
      `If the output already exists from an interrupted run, keep its valid lines and write only the ids it lacks (steps_batch.py lists them), then fix any gate rejects.\n\n` +
      `Skip the brief's step 7. Instead, once forge_check prints \`batch: 0 rejected\` and steps_batch.py prints a tick, run \`python3 scripts/forge/steps_final.py make ${it.stem} ${rdir(it, 1)} ${batch(it)} ${source(it)}\` and set round_one_ready to true if it printed a tick. In \`unsure\`, list any source id whose lesson or best option you were unsure of, with a few words why.\n\n${shared}`,
      { ...heavyModel(it), label: `write:${k}`, phase: 'Write', schema: WRITE })
    if (halted(w) || !w.round_one_ready) return { batch: k, status: 'stopped', at: 'write', trail }
    trail.push({ written: w.scenarios, unsure: w.unsure || [] })
    stage = 'review'
    r = 1
  }
  for (; r <= MAX_ROUNDS; r++) {
    const dir = rdir(it, r)
    const scope = r === 1 ? 'every scenario in the batch' : 'the scenarios the previous fixer changed'
    let a = { breaks: 0 }
    let sf = { block: 0 }
    if (stage === 'review') {
      const [p, a1, s1] = await parallel([
        () => agent(
          `You are an independent blind reviewer for batch ${it.nn} of ${who(it)} (review round ${r}, covering ${scope}).\n\n` +
          `Do pass 1 of \`scripts/forge/briefs/steps-review.md\` only, with <game> = ${it.stem} and <dir> = \`${dir}\`: read \`${dir}/blind-story.ndjson\` and write \`${dir}/review-story.ndjson\`, covering every id in it. Skip pass 2. If the file already has rows from an interrupted run, keep them and add only the ids it lacks.\n\n${shared}`,
          { model: 'sonnet', effort: 'high', label: `picks:${k}:r${r}`, phase: 'Review', schema: PICKS }),
        () => agent(
          `You are the auditor for batch ${it.nn} of ${who(it)} (review round ${r}, covering ${scope}).${minors(it)}\n\n` +
          `Follow \`scripts/forge/briefs/steps-audit.md\` exactly, with <game> = ${it.stem} and <dir> = \`${dir}\`. \`${dir}/audit.ndjson\` is already written, so do not run make. When the brief tells you to run the check command, run exactly:\n\`python3 scripts/forge/steps_audit.py check ${it.stem} ${dir} ${batch(it)} --ids-from ${dir}/audit.ndjson\`\nIf \`${dir}/review-audit.ndjson\` already has rows from an interrupted run, keep them and append rows for the ids it lacks, in the order of audit.ndjson.\n\n${shared}`,
          { model: 'opus', label: `audit:${k}:r${r}`, phase: 'Review', schema: AUDIT }),
        () => agent(
          `You are the safety and fidelity reviewer for batch ${it.nn} of ${who(it)} (review round ${r}, covering ${scope}).${minors(it)}\n\n` +
          `Follow \`scripts/forge/briefs/steps-final-safety.md\` exactly, with <game> = ${it.stem} and <dir> = \`${dir}\`. If \`${dir}/review-safety.ndjson\` already has rows from an interrupted run, keep them and append rows for the ids it lacks.\n\n${shared}`,
          { model: 'opus', label: `safety:${k}:r${r}`, phase: 'Review', schema: SAFETY }),
      ])
      if (halted(p) || halted(a1) || halted(s1)) return { batch: k, status: 'stopped', at: `review r${r}`, trail }
      a = a1
      sf = s1
    }
    stage = 'review'
    const last = r === MAX_ROUNDS
    const opus = it.safetyHeavy || a.breaks + sf.block > 15
    const f = await agent(
      `You are the fixer for batch ${it.nn} of ${who(it)}, review round ${r}. Three independent reviewers (blind picks, transition audit, safety and fidelity) have reviewed ${scope} in \`${dir}\`.${minors(it)}\n\n` +
      `1. Run \`python3 scripts/forge/steps_final.py snapshot ${dir} ${batch(it)}\`.\n` +
      `2. Run \`python3 scripts/forge/steps_final.py check ${it.stem} ${dir} ${batch(it)} --ids-from ${dir}/audit.ndjson\`. It prints every finding and writes \`${dir}/findings.json\`. If it reports coverage problems, change nothing and return coverage_ok false.\n` +
      `3. Read \`scripts/forge/briefs/steps-write.md\`, \`.forge/${it.stem}/GROUNDING.md\`, and the Safety notes, Disagreements, Breaks (with its role-play techniques), Other notes and gate rejects, and Edit safely sections of \`scripts/forge/briefs/steps-fix.md\`.\n` +
      `4. Fix every blocking finding: safety and fidelity findings marked block, blind disagreements, transition breaks, and audit notes that start with "safety:". ` +
      (r === 1 ? 'Also fix notes that point at a real problem. ' : 'Fix a note only when it is small and clearly right: this round should converge. ') +
      `A reviewer can be wrong: if you judge a finding wrong (a fact that GROUNDING.md supports, a disagreement where the key is right and the step is clear), leave the text and give your reason in the log. Re-read every scenario you change, whole, for continuity.\n` +
      `5. Append one line per finding to \`${dir}/fix-log.ndjson\`: {"id", "finding", "decision": "fixed" or "kept", "note"}.\n` +
      `6. Finish: \`python3 scripts/forge/forge_check.py --batch ${batch(it)} --game ${it.stem}\` must print \`batch: 0 rejected\`, and \`python3 scripts/forge/steps_batch.py ${source(it)} ${batch(it)}\` must print a tick. Then run \`python3 scripts/forge/steps_final.py next ${it.stem} ${dir} ${batch(it)} ${source(it)} ${rdir(it, r + 1)}\` and return the changed count it prints.\n` +
      (last ? `\nThis is the last round: nothing you change will be reviewed by another agent, and the shipping session will read every scenario you change. Change only what the blocking findings require.\n` : '') +
      `\n${shared}`,
      { ...(opus ? { model: 'opus' } : { model: 'sonnet', effort: 'high' }), label: `fix:${k}:r${r}`, phase: 'Fix', schema: FIX })
    if (halted(f)) return { batch: k, status: 'stopped', at: `fix r${r}`, trail }
    trail.push({ round: r, breaks: a.breaks, safetyBlock: sf.block, blocking: f.blocking_found, fixed: f.fixed, kept: f.kept, changed: f.changed, rejected: f.rejected })
    log(`${k} r${r}: ${f.blocking_found} blocking, fixed ${f.fixed}, kept ${f.kept}, changed ${f.changed}`)
    if (!f.coverage_ok) return { batch: k, status: 'coverage problem', at: `r${r}`, trail }
    if (f.changed === 0) return { batch: k, status: 'certified', rounds: r, trail }
    if (last) return { batch: k, status: 'read', rounds: r, trail }
  }
  return { batch: k, status: 'read', trail }
}

const results = await pipeline(items, it => run(it))
const done = results.filter(Boolean)
const tally = {}
for (const x of done) tally[x.status] = (tally[x.status] || 0) + 1
log(`done: ${JSON.stringify(tally)}`)
return done
