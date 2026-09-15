// Capstone 8: "Full Circle" (node c8, Chapter 8 graduation, Parenthood). NEW rich build to GDD c8 ("Capstone
// format v1"), matching c1-c7, on the shared rich capstone engine (capstone-rich.tsx): the FINAL capstone of the
// whole 3 -> parenthood catalog. Its Landing config drives arrive -> look back (the "Full Circle" constellation
// gallery, nine Chapter-8 stickers) -> play back (eight victory laps: gallery -> strike-rewrite -> branch ->
// role-play -> match -> swipe -> strike-rewrite -> sort) -> reflect (five prompts) -> celebrate (constellation +
// a "Full Circle" certificate). Recaps the nine Chapter-8 lessons (Us, After Kids · Equal Parents · Looking After
// You · The Talks · Break the Cycle · Raising Gender-Diverse Kids · Raising Neurodiverse Kids · Navigating
// Addictions · Be the Safe Adult). Faithful transforms of loosely-specced Landing laps: c8-p2 & c8-p8
// (strike-rewrite) gained their myth.why + celebrate, c8-p4 (branch) gained per-option consequences + a debrief,
// c8-p7 (swipe) was reframed from a v2-style left/right read into the capstone's swipe-up-to-affirm, and the
// authored 'reflect' lap (c8-p3, an unsupported CapLap type) folded into the reflect section as a fifth prompt.
// No score, no fail. gameId "capstone-8" (the Landing's "capstone-ch8" is aspirational; the engine-host registry
// id is "capstone-8").
import type { CapstoneConfig } from "./capstone-schema";

export const CAPSTONE_8: CapstoneConfig = {
  "gameId": "capstone-8",
  "doneTitle": "🎓 Full circle!",
  "coins": 50,
  "capstone": "Full Circle",
  "node": "c8",
  "chapter": 8,
  "ages": "Parenthood",
  "arrival": "Lensy: look at you. Eight chapters ago you were three, co-played with by a grown-up. Now you ARE the grown-up you always deserved. The circle closes here.",
  "canvasPayoff": "A doorway at golden hour: a parent kneeling to a child's height, phone held gently, eight glyphs arcing overhead, nine stars ringed and crowned by one finale.",
  "threadsRecapped": [
    "B",
    "C",
    "D",
    "E",
    "F"
  ],
  "recap": [
    {
      "node": "g61",
      "game": "Us, After Kids",
      "thread": "D · Relationships",
      "bigTruth": "After a baby you're not a worse couple, just one under new load; share it, repair quickly, and let intimacy return at your own pace.",
      "glyph": "us-after-kids"
    },
    {
      "node": "g62",
      "game": "Equal Parents",
      "thread": "E · Gender & Respect",
      "bigTruth": "Both are real parents; sharing the care and the invisible mental load, not just helping, protects the couple, and children learn equality by watching you.",
      "glyph": "equal-parents"
    },
    {
      "node": "g63",
      "game": "Looking After You",
      "thread": "C · Feelings & Life Skills",
      "bigTruth": "You can't pour from an empty cup; self-care is part of childcare, struggling doesn't make you a bad parent, and reaching for help is courage.",
      "glyph": "looking-after-you"
    },
    {
      "node": "g64",
      "game": "The Talks (Age by Age)",
      "thread": "F · Parent Layer · RSE guidance",
      "bigTruth": "It isn't one big talk but many small, age-right ones; talking and proper body names keep children safer, and you give honest facts alongside your values.",
      "glyph": "the-talks"
    },
    {
      "node": "g65",
      "game": "Break the Cycle",
      "thread": "C · Parent Layer · Positive Parenting",
      "bigTruth": "We parent the way we were parented, until we choose not to; lead with firm warmth not fear, repair when you slip, and the cycle stops with you.",
      "glyph": "break-the-cycle"
    },
    {
      "node": "g66",
      "game": "Raising Gender-Diverse Kids",
      "thread": "E · Parent Layer · Positive Parenting",
      "bigTruth": "An affirming parent is the biggest protection a gender-diverse child can have; lead with love, never out them, and meet your own fear with facts, not blame.",
      "glyph": "gender-diverse"
    },
    {
      "node": "g67",
      "game": "Raising Neurodiverse Kids",
      "thread": "C · Parent Layer · Positive Parenting",
      "bigTruth": "Different, not less; understand and accommodate how your child is wired, advocate for them, and drop the shame, because it's no one's fault.",
      "glyph": "neurodiverse"
    },
    {
      "node": "g68",
      "game": "Navigating Addictions",
      "thread": "B · Parent Layer · Positive Parenting",
      "bigTruth": "Shame drives addiction underground while calm connection brings it to light; dependence is a treatable health issue, so respond without rupture and get help.",
      "glyph": "navigating-addictions"
    },
    {
      "node": "g69",
      "game": "Be the Safe Adult",
      "thread": "B · Parent Layer · Safeguarding",
      "bigTruth": "The biggest protection is a child who knows they can tell you anything; be tellable, notice the signs, and if they tell you, believe them and act.",
      "glyph": "safe-adult"
    }
  ],
  "playback": [
    {
      "id": "c8-p1",
      "from": "all",
      "type": "gallery",
      "frame": "Your Full Circle constellation: nine stars from becoming the grown-up, closing an eight-chapter journey from age three. Tap any star to revisit it.",
      "stickers": [
        "us-after-kids",
        "equal-parents",
        "looking-after-you",
        "the-talks",
        "break-the-cycle",
        "gender-diverse",
        "neurodiverse",
        "navigating-addictions",
        "safe-adult"
      ],
      "celebrate": "Nine stars in your sky, and a whole life of growing beneath them. The child Chapter 1 began with is now the safe adult."
    },
    {
      "id": "c8-p2",
      "from": "g62",
      "type": "strike-rewrite",
      "frame": "Remember the flip? Erase the old line and write the truer one.",
      "myth": {
        "un": "A father looking after his own child is babysitting.",
        "re": "It's just parenting; caring for his child is a father's own responsibility, not a favour.",
        "why": "A parent doesn't babysit their own child."
      },
      "celebrate": "Owned, not 'helped': that's an equal parent."
    },
    {
      "id": "c8-p4",
      "from": "g65",
      "type": "branch",
      "frame": "Remember the choice? The old harsh reflex rises in a hard moment.",
      "options": [
        {
          "text": "Pause, breathe, and choose firm warmth, then repair if you slip",
          "outcome": "cycle-broken",
          "best": true,
          "consequence": "You pause, choose firm warmth, and repair if you slip."
        },
        {
          "text": "Run the inherited pattern on autopilot",
          "consequence": "Pausing to choose firm warmth, and repairing when you slip, is how the cycle stops; autopilot passes it on."
        }
      ],
      "celebrate": "You pause, you choose, you repair. The cycle stops with you.",
      "debrief": "Pause, choose, repair. That's how the cycle stops with you."
    },
    {
      "id": "c8-p5",
      "from": "g66",
      "type": "role-play",
      "frame": "Remember the words? Your child trusts you with who they are.",
      "setup": "Lead with love:",
      "yourLine": [
        {
          "text": "\"Thank you for trusting me, I love you exactly as you are, and that will never change.\"",
          "best": true
        },
        {
          "text": "\"Are you sure? It's probably just a phase.\""
        }
      ],
      "celebrate": "An affirming parent is the biggest protection there is, and you are that parent."
    },
    {
      "id": "c8-p6",
      "from": "g67",
      "type": "match",
      "frame": "Remember the pairs? Different, not less.",
      "pairs": [
        {
          "left": "A child's deep focus",
          "right": "A real strength to nurture"
        },
        {
          "left": "An accommodation",
          "right": "Fair access, like glasses"
        },
        {
          "left": "A meltdown",
          "right": "Overwhelm, met with calm"
        }
      ],
      "celebrate": "You see the whole, wonderful child, and you champion them."
    },
    {
      "id": "c8-p7",
      "from": "g68",
      "type": "swipe",
      "frame": "Remember the calm read? Swipe up for the truth about a struggling child.",
      "cue": "Shame and crackdowns drive a struggle underground. Calm connection and the right help bring it into the light.",
      "celebrate": "You know it now: shame drives it underground; connection brings it to light.",
      "up": "Connection over shame."
    },
    {
      "id": "c8-p8",
      "from": "g69",
      "type": "strike-rewrite",
      "frame": "Remember the most important flip of all? Erase it and write the truth.",
      "myth": {
        "un": "If a child discloses, question whether they're making it up.",
        "re": "Believe your child; children very rarely lie about abuse, and being believed is vital to their safety and recovery.",
        "why": "Children very rarely lie about abuse; belief keeps them safe."
      },
      "celebrate": "Believe, stay calm, protect. You are the safe adult."
    },
    {
      "id": "c8-p9",
      "from": "g64",
      "type": "sort",
      "frame": "Remember the sort? Honest facts, or your family's values, both belong.",
      "items": [
        {
          "id": "a",
          "text": "How bodies work and stay safe"
        },
        {
          "id": "b",
          "text": "What your family believes about timing"
        },
        {
          "id": "c",
          "text": "The proper body names"
        },
        {
          "id": "d",
          "text": "Your hopes for them"
        }
      ],
      "bins": [
        {
          "id": "facts",
          "label": "Honest facts"
        },
        {
          "id": "values",
          "label": "Your values"
        }
      ],
      "key": {
        "a": "facts",
        "b": "values",
        "c": "facts",
        "d": "values"
      },
      "celebrate": "Facts to keep them safe, values to guide them, you give your child both."
    }
  ],
  "reflect": [
    {
      "id": "c8-r1",
      "prompt": "Lensy: eight chapters ago, you were a three-year-old being co-played with. Now you're the grown-up, the safe source the next child needs. How does that feel?",
      "options": [
        "Full circle",
        "I'm ready",
        "A little nervous, in a good way",
        "Proud"
      ],
      "affirm": "From the child who was learning to the adult who guides, you have come the whole way, and you carry all of it forward."
    },
    {
      "id": "c8-r2",
      "prompt": "Lensy: this last chapter was about raising the next generation better than we were raised. What do you most want to give your child that you wished you'd had?",
      "options": [
        "An open door, always",
        "Safety to be themselves",
        "Equality at home",
        "A parent who heals their own wounds"
      ],
      "affirm": "Whatever you named, choosing to give it is how a whole generation grows up freer than the last."
    },
    {
      "id": "c8-r3",
      "prompt": "Lensy: across the whole journey you learned consent, respect, equality, health, rights and safety. Which thread do you most want to pass on?",
      "options": [
        "Consent and respect",
        "Equality and fairness",
        "Health and wellbeing",
        "Safety and being tellable"
      ],
      "affirm": "Every thread you pass on becomes part of how your child meets the world, and how their child will too."
    },
    {
      "id": "c8-r4",
      "prompt": "Lensy: you don't have to be a perfect parent, only a present, learning, loving one. Does that feel like enough?",
      "options": [
        "It's enough",
        "I can be that",
        "Present and learning",
        "Yes"
      ],
      "affirm": "A present, learning, loving parent is exactly what a child needs, and exactly what you have become."
    },
    {
      "id": "c8-r3",
      "prompt": "Lensy: Remember the breakthrough? You can't pour from an empty cup. What do you most want to keep giving yourself, so you can keep giving to your child?",
      "options": [
        "A little rest",
        "A self of my own",
        "Help when it's heavy",
        "Grace on hard days"
      ],
      "affirm": "Looking after yourself was never selfish; it's part of how you show up for your child."
    }
  ],
  "celebration": {
    "glyph": "full-circle-star",
    "certificate": "This certifies you have come Full Circle: graduate of Chapter 8 and the journey from age three. You are the safe adult now. Stand tall, you earned every star.",
    "stickerBook": "All nine Chapter 8 stars shine in your Full Circle constellation, crowned by the golden finale. Every sticker since age three glows on, a whole life to give."
  },
  "preview": "There's no Chapter 9: the next one is written by the small person in front of you. A new three-year-old is about to start your journey, with you to guide it.",
  "share": "Your call: tell someone you trust, or just tell yourself, one thing you want to give the next generation that you wished you'd had. You've come the whole way."
};
