# Writer brief: turn a game's single-step branches and role-plays into multi-step scenarios

Used by the multi-step rollout ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4)).
It generalises the Choosing & Building pilot brief ([SWED-96](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9))
and adds what the pilot's review caught. Your prompt names the game, its chapter and audience, and your batch number
`NN`. Paths below use `<game>` for the game's file stem.

## Why

SwipeEd is a phone game from The Equal Lens (India). The owner found `branch` and `role-play` too easy: each asked a
single question with two options and showed the right answer at once. The owner decided: at least 4 options, several
questions (3 to 5) on the same scenario, each building on the previous answer, and the right answers revealed only at
the end. Your job is to rewrite each source scenario into that shape, keeping its lesson.

## How it plays

**Branch.** Lensy's question card shows the `hook` and step 1's `prompt` together. Four or five option cards appear in
random order. The player taps one. Nothing says right or wrong: the option's `then` appears (what happens because of
that choice), with a Continue button. The card then shows step 2's `prompt` with new options, and so on. After the last
step comes the reveal: for every step, the player's pick, the best option if they missed it, and that step's `why`.
Then `debrief`, then `relearn`.

**Role-play.** The same, as a conversation. `hook` and `setup` set the scene. Each step's `prompt` is what the other
person says. The options are lines the player could say, in double quotes. Each option's `then` is how the other person
responds to that line.

## Output

One JSON object per line (NDJSON, no trailing commas, no blank lines) in `.forge/<game>/steps/batch-NN.ndjson`, one
line per source id, keeping the id. Field order:

```
branch:    {"id","cat","type":"branch","persona","source","hook","steps":[{"prompt","options":[{"text","then","best"}],"why"}],"debrief","relearn"}
role-play: {"id","cat","type":"role-play","persona","source","hook","setup","steps":[{"prompt","options":[{"text","then","best"}],"why"}],"relearn"}
```

- `id`, `cat`, `type`, `persona`, `source`: copy from the source unchanged. Cover every source id exactly once.
- Remove the old single-step fields: a branch's `options` (with `consequence` and `outcome`), a role-play's `yourLine`.
- `best`: write `"best": true` on exactly one option in each step and leave the key out on the others.
- The source tells you what the scenario teaches: its best option, consequences, `debrief` and `relearn`. Keep that
  lesson. Step 1 usually starts from the source's decision; later steps follow the same situation forward.

## Steps: how each answer builds on the last

- **Count.** 3 steps is the default. Use 4 when the situation naturally has more beats, and 5 only rarely. Across
  your batch aim for roughly 60% with 3, 35% with 4 and 5% with 5.
- **Every prompt must make sense after any option of the step before.** This is the rule the pilot broke most: a
  reviewer found 137 of 373 later steps that only fit one earlier path. The player's path shows in the `then` of the
  option they picked, which appears just before the next prompt. So write each next prompt to move the situation
  forward in a way that fits every earlier pick: a new moment ("At the next family dinner...", "A week later..."), the
  other person's next point, or a new pressure. Never write a prompt that assumes one particular earlier choice
  ("After you told him no...", "At the meeting..." when one option refused the meeting). If an option's `then` ends
  the situation (you leave, refuse, block), write that `then` so the story can still continue ("...but the question
  comes back a week later").
- **A `then` is one specific, realistic sentence of what happens next.** Different for every option. It never grades
  the pick ("Good choice", "That was wrong", "Smart move"): the reveal at the end does that, and the gate rejects
  grading words. It can and should show honest natural effects, so the direction is felt: a partner opens up or goes
  quiet, tension eases or builds, the issue gets settled or stays hanging.
- **Role-play `then`** is the other person's reply in double quotes, optionally with a few words of action:
  `He puts his phone down. "Oh. I didn't realise. Tell me."`

## Options

- 4 options is the default. Use 5 only when all five are genuinely different.
- The best option is the most respectful, honest, safe and effective move at that moment, consistent with the game's
  GROUNDING.md.
- **The others must be tempting**: things real people really do, such as avoiding it, keeping the peace, going along
  with family pressure, over-reacting, a kind-sounding move that doesn't solve anything, or a near miss that is almost
  right but skips something important. Put at least one near miss in every step. Never a cartoon villain, never silly.
- **A near miss must still be clearly short of best** to a thoughtful reader: name what it skips (it decides alone,
  delays the real talk, asks the wrong person, promises what can't be kept). An independent reviewer picks the best
  option blind, and a step where a near miss is just as defensible gets rewritten.
- **Neither tone nor length may give the answer away.** The best option must not be the longest, the only calm one or
  the only warm one. Write some tempting options that sound kind or reasonable, and let the best one sometimes sound
  plain or a little uncomfortable. The gate rejects a scenario whose best option is clearly the longest in most steps.
- Every option in a step says something different. No option that only agrees or disagrees ("Yes", "No", "Maybe").

## Other fields

- `hook`: the situation in one or two short sentences, with a named person where natural. No question mark.
- **The player is always "you".** Never give the player's own character a name or "she" or "he" in the hook while the
  prompts say "you" ("A friend tells Razia..." then "What do you say?"). Other people get names.
- **Keep the source's life stage.** Don't add children, a wedding, a pregnancy or a job the source doesn't imply
  (Chapter 7 is before a first child, so no school forms for a couple's own kids).
- `setup` (role-play only): one sentence placing the conversation ("Tonight he looks up from his phone."). No question.
- The card shows `hook`, `setup` and step 1's `prompt` together, so none of them may repeat another's information.
- `prompt`, branch: what is happening now plus one question, for example "He texts to plan a fifth date. What do you
  do?" Exactly one question mark, at the end: the gate rejects a branch prompt with none or two.
- `prompt`, role-play: the other person's words, attributed with a verb: `Your mother asks: "When will you two start
  a family?"`. Never a bare name and colon ("Aunty: ..."): the gate treats that as a speaker prefix and rejects it.
- `why`: one sentence on why the best option is best, warm and plain, at most 120 characters.
- `debrief` (branch): one sentence with the scenario's lesson, from the source's debrief.
- `relearn`: one sentence. Keep the source's relearn unless the new story needs it reworded.

## Lengths (the gate counts characters)

- Every field at most 160 characters.
- Per step, the prompt plus every option text plus the longest `then` must total no more than the plan's
  `band_ceiling` (500 in Chapters 7 and 8); step 1 also counts the `hook` (and a role-play's `setup`). Aim for: hook 90,
  setup 60, prompt 90, option text 60 (branch) or 70 (role-play), then 100, why 120. That keeps step 1 near 450.

## Voice (the gate enforces the first two)

- **No em dash or en dash anywhere**, and no spaced hyphen standing in for one. Use a full stop, comma or colon.
- **Never start a line with "Lensy:", "Sam:" or a speaker's name and a colon.**
- No law names or sections, no statistics or percentages, no organisation names. Helpline numbers only where the
  source or GROUNDING.md already has them, exactly as written there.
- **No comma splices.** If the words after a comma could stand alone as a sentence, use a full stop instead:
  "It matters to me. Can we talk?" not "It matters to me, can we talk?" Quoted lines are where the pilot slipped most:
  "It's fine. I'll cover it this month." not "It's fine, I'll cover it this month."
- Concise, warm, curious, never preachy. Plain Indian English. Indian names across genders and communities; relatives,
  biodata, proposals, family WhatsApp groups and functions where natural. No US framing. Couples of any gender can
  appear where natural; do not make identity the point.
- **Never judge a life choice.** Marrying, waiting, never marrying, love or arranged marriage, living with family or
  not, children or not, how a family is formed: none of these is ever a wrong option. Wrong options are pressures,
  myths, shortcuts and behaviours.

## Safety scenarios

Some sources are about pressure, coercion, control, violence, abuse or an unsafe situation, or mention a helpline.

- The best option is always the safe one: say no, get to safety, talk to someone trusted, get help (keep the source's
  helplines).
- When one person controls, threatens or hurts another, the best option is never to try harder, keep the peace or fix
  it together as if both share the blame, and never to confront the person alone when that risks safety. It is safety
  and support for the person being harmed.
- When the player supports someone else who is being harmed, the best option believes them, says it is not their fault,
  respects their pace and their choices (never "You have to leave right now"), and offers a way to get help. Pushing,
  judging or taking over is a tempting wrong option, not the best one.
- **When the player is the one being pressured or harmed, their survival responses are never wrong options.**
  Freezing, staying silent, going along, giving in, pretending to be asleep and avoiding the person are how people
  get through danger, not mistakes, so never offer them as options to be marked short of best, and never write a
  `then` in which sex or harm happens because of the player's pick. Make the tempting options beliefs and myths
  ("Maybe marriage means I can't refuse"), self-blame ("Maybe I'm overreacting"), keeping it secret, or poor advice
  from others. Among the best moves over the story, include reaching support (a trusted person, and the game's
  helpline where the source has one), not only standing up to the person. Every such scenario says, in a `why` or the
  `debrief`, that it is never their fault.
- A `then` for an unsafe option shows the risk plainly, without graphic detail, and never blames the person under
  pressure.
- Keep "not your fault" in a `why` or the `debrief`. Never present control, surveillance, violence or forced marriage
  as fine or as a choice.
- Where a child tells an adult something worrying, the best response believes them, stays calm, says "I'm glad you
  told me. This is not your fault.", does not question them for details, and gets help. Say "safe touch" and "unsafe
  touch", never "good touch" and "bad touch".

## Two examples at the quality bar (Choosing & Building, adults 22+)

```
{"id":"cb-003","cat":"choosing-well","type":"branch","persona":"any","source":"values vs spark","hook":"The spark with Rehan is strong, but he laughs off your wish to decide money together.","steps":[{"prompt":"He texts to plan a fifth date. What do you do?","options":[{"text":"Say yes, and raise the money comment on the date","then":"Rehan looks surprised and says he was joking. He doesn't ask what you meant.","best":true},{"text":"Say yes and let it go. The spark matters more right now","then":"The date is fun. The money comment never comes up, and you push the feeling away."},{"text":"Stop replying without explaining","then":"Rehan sends two confused messages. You feel relieved, and unsure if you misread him."},{"text":"Ask your cousin whether he seems right for you","then":"Your cousin says he sounds fine. You still feel uneasy and haven't said a word to Rehan."}],"why":"Raising it early shows you how he responds before you invest more."},{"prompt":"A week later, a friend asks how it's going with Rehan. What do you focus on?","options":[{"text":"Whether our values on money fit","then":"Saying it out loud, you realise the laugh bothered you more than you admitted.","best":true},{"text":"How rare this kind of chemistry is","then":"Your friend grins. You leave excited and no clearer."},{"text":"Whether my family would like him","then":"You picture your parents approving, and the money question slips out of view."},{"text":"Whether I'm being too picky about one joke","then":"You start doubting yourself instead of the thing that bothered you."}],"why":"Values decide how a couple handles hard things; chemistry alone doesn't."},{"prompt":"Rehan says money talk is unromantic and asks to just see where things go. What do you do?","options":[{"text":"Say it matters and ask how he sees money in a couple","then":"He pauses, then tells you his parents fought over money. It's your first real talk.","best":true},{"text":"Agree and keep things light for now","then":"The evening stays easy. The question waits for a bigger, harder moment."},{"text":"End it on the spot, since he should already know","then":"Rehan is stunned. You never learn whether he could have met you halfway."},{"text":"Say you're fine with him handling all the money decisions","then":"He relaxes. You feel a small knot of regret on the way home."}],"why":"Asking how he sees it tests your values directly, instead of guessing or giving in."}],"debrief":"Chemistry can't carry a partnership through clashing values. Talk about them early.","relearn":"Take a values mismatch seriously, even when the chemistry is strong."}
{"id":"cb-015","cat":"what-it-takes","type":"role-play","persona":"any","source":"raising issues","hook":"Your partner Arjun has been on his phone through dinner all week, and it bothers you.","setup":"Tonight he looks up and notices your face.","steps":[{"prompt":"Arjun asks: \"What's wrong? You've been quiet.\"","options":[{"text":"\"I've felt unheard at dinner lately. Can we talk?\"","then":"He puts his phone down. \"Oh. I didn't realise. Tell me.\"","best":true},{"text":"\"Nothing. I'm fine.\"","then":"He shrugs and goes back to his phone. The silence feels heavier."},{"text":"\"You never listen to me. That's what's wrong.\"","then":"Arjun stiffens. \"That's not fair. I listen all the time.\""},{"text":"\"Maybe we should just eat separately if you're so busy.\"","then":"He looks hurt. \"Is that what you want?\""}],"why":"An \"I felt\" opener names the problem without attacking, so he can listen."},{"prompt":"Arjun says: \"Work has been crazy. I didn't think it mattered.\"","options":[{"text":"\"I get that. Could we keep phones away at dinner?\"","then":"\"That's fair,\" he says. \"Maybe I need that break too.\"","best":true},{"text":"\"It matters. You should have known without me saying.\"","then":"He folds his arms. \"I'm not a mind reader.\""},{"text":"\"Forget it. It's not a big deal.\"","then":"He nods, relieved, and the problem stays exactly where it was."},{"text":"\"Your work always comes first, doesn't it?\"","then":"\"That's not true,\" he snaps, and dinner ends in silence."}],"why":"A small, specific ask is easier to say yes to than blame."},{"prompt":"Arjun asks: \"What if work calls during dinner, though?\"","options":[{"text":"\"Then take it and tell me. The rest is ours.\"","then":"He smiles. \"Deal. Remind me if I slip?\"","best":true},{"text":"\"Then don't answer. Ever.\"","then":"Arjun frowns. \"You know I can't promise that.\""},{"text":"\"Do whatever you want.\"","then":"He can't tell whether you mean it, and neither can you."},{"text":"\"Honestly, we'll see if you even try this time.\"","then":"His face falls. \"I said I would.\""}],"why":"Leaving room for real exceptions makes the agreement fair, so it lasts."}],"relearn":"Raise an issue with an 'I felt...' opener, not a 'you never' attack."}
```

## Process

1. Read `.forge/<game>/GROUNDING.md` (truth anchors, persona voices, helplines, banned framings) and this brief.
2. Read `.forge/<game>/steps/source-NN.ndjson`, one scenario per line.
3. Write the batch in small chunks, at most 4 scenarios per tool call, with a short Python script that appends
   `json.dumps(o, ensure_ascii=False)` lines to `.forge/<game>/steps/batch-NN.ndjson`. Never rewrite the whole file in
   one call.
4. Check and fix until it prints `batch: 0 rejected` (shape, lengths, band, helplines, dashes, speaker prefixes, graded
   thens, best-longest):
   `python3 scripts/forge/forge_check.py --batch .forge/<game>/steps/batch-NN.ndjson --game <game>`
5. Check coverage and the step split until it prints `✓`:
   `python3 scripts/forge/steps_batch.py .forge/<game>/steps/source-NN.ndjson .forge/<game>/steps/batch-NN.ndjson`
6. Re-read every line once as a player would. For every step after the first, read each option's `then` of the step
   before and then the next prompt: does it follow? Is each step's best option clearly best to a thoughtful adult while
   the others stay tempting? Any comma splice? Fix, then repeat steps 4 and 5.
7. Write the reviewer's files: `python3 scripts/forge/blind_review.py make <game> .forge/<game>/steps/review-NN .forge/<game>/steps/batch-NN.ndjson --batch-only`
8. Reply with the counts asked for. Do not paste scenarios into the reply.
