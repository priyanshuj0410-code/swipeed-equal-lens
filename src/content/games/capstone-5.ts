// Capstone 5 — "Ready for the World" (node c5, Chapter 5 graduation, ages 15–18) AND the close of the whole
// 4–18 SwipeEd journey. NEW rich build to GDD c5 ("Capstone format v1"), following the c1 reference and matching
// c2–c4, replacing the old nine-star tap build. Runs on the shared rich capstone engine (capstone-rich.tsx): its
// Landing config drives arrive → look back (the "Ready for the World" constellation gallery, nine Chapter-5
// stickers crowned by the whole-journey star) → play back (victory laps, each a chapter truth re-cued through a
// different mechanic: gallery · swipe · spot · branch · sort · match · branch · strike-rewrite · swipe) → reflect
// → celebrate (constellation + sunrise + graduation certificate for the whole 4–18 journey). Recaps the nine
// Chapter-5 lessons (My Choices, My Future · Status: Know It · Mutual · Spectrum · Lead the Way · Change Makers ·
// Justice League · Life Ready · Decoded). No score, no fail. gameId "capstone-5" (the Landing's "capstone-ch5" is
// aspirational; the engine-host registry id is "capstone-5").
import type { CapstoneConfig } from "./capstone-schema";

export const CAPSTONE_5: CapstoneConfig = {
  "gameId": "capstone-5",
  "capstone": "Ready for the World",
  "node": "c5",
  "chapter": 5,
  "ages": "15-18",
  "arrival": "Look how far you've come — from a small kid naming feelings to a near-adult ready for the world. Let's take a calm, proud walk back through it all.",
  "canvasPayoff": "Sunrise over the whole landscape: every chapter you've finished glows together, 4 to 18. Your nine stickers rise into the dawn as one bright constellation.",
  "threadsRecapped": [
    "B",
    "C",
    "D",
    "E",
    "F",
    "G"
  ],
  "recap": [
    {
      "node": "g29",
      "game": "My Choices, My Future",
      "thread": "F · Sexual & Reproductive Health",
      "bigTruth": "Your body and your future are yours to plan, you have the right to decide if and when, and the knowledge to do it well.",
      "glyph": "choice-compass"
    },
    {
      "node": "g30",
      "game": "Status: Know It",
      "thread": "F · Sexual & Reproductive Health",
      "bigTruth": "Knowing your status is strength, it's routine, private and protective; treatment works, and the only thing to fear is stigma.",
      "glyph": "status-strength"
    },
    {
      "node": "g31",
      "game": "Mutual",
      "thread": "B · Safety, Consent & Boundaries",
      "bigTruth": "Real intimacy is mutual, enthusiastic, ongoing, freely-given consent, every time and both ways.",
      "glyph": "mutual-hearts"
    },
    {
      "node": "g32",
      "game": "Spectrum",
      "thread": "D · Relationships",
      "bigTruth": "Love and identity live on a spectrum, and every point on it is natural and deserves respect.",
      "glyph": "spectrum-prism"
    },
    {
      "node": "g33",
      "game": "Lead the Way",
      "thread": "E · Gender & Respect",
      "bigTruth": "You can lead, quietly or out loud; everyone has a way to lift others and lead with respect.",
      "glyph": "lead-torch"
    },
    {
      "node": "g34",
      "game": "Change Makers",
      "thread": "E · Gender & Respect",
      "bigTruth": "You can change what's unfair, ordinary people taking small actions is how norms actually shift.",
      "glyph": "change-spark"
    },
    {
      "node": "g35",
      "game": "Justice League: Rights Edition",
      "thread": "G · Values, Rights & Media",
      "bigTruth": "Your rights are yours, the law protects you, and there are real, reachable routes to help and justice.",
      "glyph": "rights-shield"
    },
    {
      "node": "g42",
      "game": "Life Ready",
      "thread": "C · Feelings & Life Skills",
      "bigTruth": "You're ready for real life, money, work, time and stress are learnable skills, and asking for help is one of them.",
      "glyph": "life-toolkit"
    },
    {
      "node": "g36",
      "game": "Decoded",
      "thread": "G · Values, Rights & Media",
      "bigTruth": "You can read the machine, decode the feed, the fakes and yourself, and keep learning for life. Unlearn, Relearn, Grow.",
      "glyph": "decoder-lens"
    }
  ],
  "playback": [
    {
      "id": "c5-p1",
      "from": "all",
      "type": "gallery",
      "frame": "Your Ready for the World constellation, nine stickers from a whole chapter, and the crown of the whole journey. Tap any star to revisit what you grew into.",
      "stickers": [
        "choice-compass",
        "status-strength",
        "mutual-hearts",
        "spectrum-prism",
        "lead-torch",
        "change-spark",
        "rights-shield",
        "life-toolkit",
        "decoder-lens"
      ],
      "celebrate": "Nine stars in your sky, and a whole journey behind them. Look how far you've come."
    },
    {
      "id": "c5-p2",
      "from": "g31",
      "type": "swipe",
      "frame": "One more from Mutual, just for the joy of knowing your read. Swipe up for real, mutual consent.",
      "cue": "An enthusiastic yes from both people. A 'maybe, I'm not sure' treated as a yes. A yes that can be changed at any time.",
      "up": "Freely given, both ways, and never assumed.",
      "celebrate": "Mutual every time, you've got this."
    },
    {
      "id": "c5-p3",
      "from": "g36",
      "type": "spot",
      "frame": "From Decoded, spot the trick one more time, for the satisfaction of seeing straight through it.",
      "scene": [
        {
          "text": "A pre-ticked box quietly signing you up",
          "trick": true
        },
        {
          "text": "A clear, honest choice with a real 'no thanks'",
          "trick": false
        },
        {
          "text": "A fake countdown rushing your decision",
          "trick": true
        }
      ],
      "why": "You read the dark patterns now, the pre-ticked box and the fake urgency, and you're hard to nudge.",
      "celebrate": "You can read the machine. That's a skill for life."
    },
    {
      "id": "c5-p4",
      "from": "g34",
      "type": "branch",
      "frame": "One more from Change Makers, for the feeling of it. Something unfair is happening in your group, and everyone's gone quiet.",
      "options": [
        {
          "text": "Take one small, real action, you don't need to fix it all alone",
          "consequence": "You shift the moment; small actions are how norms move.",
          "outcome": "changemaker",
          "best": true
        },
        {
          "text": "Decide it's not your place to say anything",
          "consequence": "One small action from an ordinary person is exactly how things change, and you can be that person."
        }
      ],
      "debrief": "Change rarely comes from one hero; it comes from ordinary people taking small actions. You're one of them now.",
      "celebrate": "Changemaker, you can move what's unfair."
    },
    {
      "id": "c5-p5",
      "from": "g32",
      "type": "sort",
      "frame": "From Spectrum, a gentle sort, just to feel how clear it is to you now.",
      "items": [
        {
          "id": "a",
          "text": "Every identity deserves respect"
        },
        {
          "id": "b",
          "text": "Making someone the punchline"
        },
        {
          "id": "c",
          "text": "Letting people name themselves"
        },
        {
          "id": "d",
          "text": "Treating one way as the only normal"
        }
      ],
      "bins": [
        {
          "id": "respect",
          "label": "Respect"
        },
        {
          "id": "not",
          "label": "Not respect"
        }
      ],
      "key": {
        "a": "respect",
        "b": "not",
        "c": "respect",
        "d": "not"
      },
      "celebrate": "Every point on the spectrum, respected. That's who you are now."
    },
    {
      "id": "c5-p6",
      "from": "g35",
      "type": "match",
      "frame": "From Justice League, match a need to where help actually lives, the routes you now carry.",
      "pairs": [
        {
          "left": "Online abuse or a fake of you",
          "right": "cybercrime.gov.in / 1930"
        },
        {
          "left": "Can't afford a lawyer",
          "right": "Free legal aid (NALSA, 15100)"
        },
        {
          "left": "A child in danger",
          "right": "Childline 1098"
        }
      ],
      "celebrate": "You know the routes now. Rights you can actually claim."
    },
    {
      "id": "c5-p7",
      "from": "g42",
      "type": "branch",
      "frame": "One more from Life Ready, for real life. Your first month managing your own money, and it's tighter than you thought.",
      "options": [
        {
          "text": "Make a simple plan and ask someone who knows for tips",
          "consequence": "You steady it; budgeting and asking for help are both real skills.",
          "outcome": "lifeready",
          "best": true
        },
        {
          "text": "Hope it sorts itself out and tell no one",
          "consequence": "A simple plan plus asking for help is the grown-up move, and asking is a strength, not a weakness."
        }
      ],
      "debrief": "Money, time and stress are all learnable, and asking for help is one of the most capable things you can do.",
      "celebrate": "Ready for real life, and you don't have to do it alone."
    },
    {
      "id": "c5-p8",
      "from": "g30",
      "type": "strike-rewrite",
      "frame": "From Status: Know It, one more myth to clear, for the calm of knowing the truth.",
      "myth": {
        "un": "Only certain people need to know their status.",
        "re": "Knowing your status is routine, private and for everyone; it's strength, not shame.",
        "why": "Testing is routine and private — the only thing to fear is stigma, never the test."
      },
      "celebrate": "Knowing is strength. You carry that calmly now."
    },
    {
      "id": "c5-p9",
      "from": "g29",
      "type": "swipe",
      "frame": "From My Choices, My Future, swipe up for everything that's truly yours to decide.",
      "cue": "Whether and when. Your own plans and timing. Your body and your future.",
      "up": "Mine to decide, with the knowledge to do it well.",
      "celebrate": "Your choices, your future. You're ready to own them."
    }
  ],
  "reflect": [
    {
      "id": "c5-r1",
      "prompt": "Lensy: look how far you've come, all the way from naming feelings as a small kid to here. What feels different about how you see yourself and the world now?",
      "options": [
        "I know my own worth",
        "I can read the world clearly",
        "I know my rights and choices",
        "I've grown so much"
      ],
      "affirm": "That growth is real, and you did it yourself, year after year."
    },
    {
      "id": "c5-r2",
      "prompt": "Of everything this chapter, which idea will you carry into adulthood with you?",
      "options": [
        "My body, my choices",
        "Consent, both ways",
        "My rights are mine",
        "Unlearn, Relearn, Grow"
      ],
      "affirm": "Whatever you carry, it's yours now, and it goes with you."
    },
    {
      "id": "c5-r3",
      "prompt": "The biggest lesson of the whole journey: learning never stops, and that's a good thing. Does it feel like something you can keep doing for life?",
      "options": [
        "Yes, for life",
        "I can keep growing",
        "Unlearn and relearn, always"
      ],
      "affirm": "You can. You've been doing it for fifteen years, and now you carry the power yourself."
    },
    {
      "id": "c5-r4",
      "prompt": "As you step toward the world, what are you most ready for?",
      "options": [
        "To look after myself",
        "To look after others too",
        "To keep learning",
        "Whatever comes"
      ],
      "affirm": "Whatever you chose, you're more ready than you know, and Lensy is proud of you."
    }
  ],
  "celebration": {
    "glyph": "ready-for-the-world-star",
    "certificate": "This certifies you are Ready for the World — a graduate of Chapter 5 and the whole SwipeEd journey, ages 4 to 18. You did it yourself. Unlearn. Relearn. Grow.",
    "stickerBook": "All nine Chapter 5 stickers blaze in your Ready for the World constellation, crowned by a golden graduation star. Every sticker since age 4 glows with them."
  },
  "preview": "Next, Chapter 6: College (ages 18–22). The kids' journey is complete; the adult one begins — and Lensy is still right beside you.",
  "share": "Your call: share one thing you're proud of growing into with a grown-up you trust, or simply hold it for yourself. Either way, you've earned this.",
  "doneTitle": "🎓🌟 The whole journey complete!",
  "coins": 50
};
