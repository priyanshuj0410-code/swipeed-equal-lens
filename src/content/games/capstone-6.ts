// Capstone 6 — "Standing on My Own" (node c6, Chapter 6 graduation, ages 18–22, College). NEW rich build to GDD
// c6 ("Capstone format v1"), following the c1 reference and matching c2–c5, replacing the old nine-star tap build
// (the simple CapstoneEngine). Runs on the shared rich capstone engine (capstone-rich.tsx): its Landing config
// drives arrive → look back (the "Standing on My Own" constellation gallery, nine Chapter-6 stickers) → play back
// (victory laps, each a chapter truth re-cued through a different mechanic: gallery · swipe · branch · sort ·
// strike-rewrite · match · role-play · strike-rewrite · swipe) → reflect → celebrate (constellation + a
// genuinely-independent-young-adult certificate). Recaps the nine Chapter-6 lessons (Consent, For Real · Swipe
// Right? · Real Relationships · Own Your Health · Money & Independence · Mind & Belonging · Find Your Feet · Equal
// & Confident · Know Your Rights). This is the FIRST capstone to use the role-play victory lap (CapRolePlayLap).
// No score, no fail. gameId "capstone-6" (the Landing's "capstone-ch6" is aspirational; the engine-host registry
// id is "capstone-6").
import type { CapstoneConfig } from "./capstone-schema";

export const CAPSTONE_6: CapstoneConfig = {
  "gameId": "capstone-6",
  "capstone": "Standing on My Own",
  "node": "c6",
  "chapter": 6,
  "ages": "18-22",
  "arrival": "look at you, standing on your own. A year or two ago someone else held the phone; now it's all yours. This chapter you took the wheel of an adult life, consent and dating, your health and your money, your mind, your worth, your equality and your rights, and you carried it. Let's take a calm, proud walk back through everything you can now handle for yourself.",
  "canvasPayoff": "The Standing on My Own canvas opens on a young adult at the centre of their own life, a room of their own in a new city, the lights of the world beyond the window. As it settles, the nine things you grew this chapter switch on around you like the furniture of an independent life: a steady relationship, a health you own, a budget that holds, a calm mind, a path of your own, a clear voice, your rights in your pocket. Your nine stickers rise into the night as a constellation called Standing on My Own.",
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
      "node": "g44",
      "game": "Consent, For Real",
      "thread": "B · Safety, Consent & Boundaries",
      "bigTruth": "Real consent is an enthusiastic, ongoing, freely-given yes between equals, and survivors are always believed, never blamed.",
      "glyph": "consent-real"
    },
    {
      "node": "g45",
      "game": "Swipe Right?",
      "thread": "D · Relationships",
      "bigTruth": "Date safely and treat people like people, not profiles; verify the real ones, and rejection is survivable both ways.",
      "glyph": "swipe-smart"
    },
    {
      "node": "g46",
      "game": "Real Relationships",
      "thread": "D · Relationships",
      "bigTruth": "Healthy relationships are built; love expands your world while control shrinks it, and leaving an unsafe one is brave.",
      "glyph": "real-relationships"
    },
    {
      "node": "g47",
      "game": "Own Your Health",
      "thread": "F · Sexual & Reproductive Health",
      "bigTruth": "Your sexual and reproductive health is yours: dual protection, routine check-ups, and confidential, shame-free care.",
      "glyph": "own-health"
    },
    {
      "node": "g48",
      "game": "Money & Independence",
      "thread": "C · Feelings & Life Skills",
      "bigTruth": "Money is freedom: budget, save, dodge debt traps, and your own income is your safety net, especially as a woman.",
      "glyph": "independence-key"
    },
    {
      "node": "g49",
      "game": "Mind & Belonging",
      "thread": "C · Feelings & Life Skills",
      "bigTruth": "Leaving home is hard and that's normal; build belonging, cope healthily, and reaching out for help is the strong move.",
      "glyph": "mind-belonging"
    },
    {
      "node": "g52",
      "game": "Find Your Feet",
      "thread": "C · Feelings & Life Skills",
      "bigTruth": "No one has it figured out; setbacks are information, not verdicts, and your worth is never your CV.",
      "glyph": "find-feet"
    },
    {
      "node": "g50",
      "game": "Equal & Confident",
      "thread": "E · Gender & Respect",
      "bigTruth": "Claim your voice, lead from any seat, and be an active ally; equality lifts everyone.",
      "glyph": "equal-confident"
    },
    {
      "node": "g51",
      "game": "Know Your Rights",
      "thread": "G · Values, Rights & Media",
      "bigTruth": "You have rights at work, in a rented room and online, and real, reachable routes to claim them.",
      "glyph": "rights-shield"
    }
  ],
  "playback": [
    {
      "id": "c6-p1",
      "from": "all",
      "type": "gallery",
      "frame": "Your Standing on My Own constellation, nine stickers from a whole chapter of growing into an adult life. Tap any star to revisit what you can now handle for yourself.",
      "stickers": [
        "consent-real",
        "swipe-smart",
        "real-relationships",
        "own-health",
        "independence-key",
        "mind-belonging",
        "find-feet",
        "equal-confident",
        "rights-shield"
      ],
      "celebrate": "Nine stars in your sky, and an independent life behind them. Look at you, standing on your own."
    },
    {
      "id": "c6-p2",
      "from": "g44",
      "type": "swipe",
      "frame": "One more from Consent, For Real, just for the clarity of it. Swipe up for real, freely-given consent.",
      "cue": "An enthusiastic yes between equals. A 'yes' worn down by pressure. A yes that can be withdrawn any time.",
      "up": "Freely given, sober enough, and never assumed.",
      "celebrate": "Consent, for real, you live it now."
    },
    {
      "id": "c6-p3",
      "from": "g46",
      "type": "branch",
      "frame": "One more from Real Relationships, for the feel of it. A partner wants to know your every move and dislikes your friends.",
      "options": [
        {
          "text": "Name it: control isn't love, and love expands your world",
          "consequence": "You read it clearly, like the relationship-builder you've become.",
          "outcome": "reads-it",
          "best": true
        },
        {
          "text": "Tell yourself it just means they care",
          "consequence": "Love expands your world; control shrinks it, and you can tell them apart now."
        }
      ],
      "debrief": "Healthy love is built on respect and freedom; control is a red flag, not devotion. You know the difference.",
      "celebrate": "Love expands, control shrinks, you've got this."
    },
    {
      "id": "c6-p4",
      "from": "g48",
      "type": "sort",
      "frame": "From Money & Independence, a quick sort, just to feel how clear it is now.",
      "items": [
        {
          "id": "a",
          "text": "An emergency fund"
        },
        {
          "id": "b",
          "text": "Buy-now-pay-later on wants"
        },
        {
          "id": "c",
          "text": "Your own bank account"
        },
        {
          "id": "d",
          "text": "Handing all your money to someone else"
        }
      ],
      "bins": [
        {
          "id": "freedom",
          "label": "Builds freedom"
        },
        {
          "id": "trap",
          "label": "A trap"
        }
      ],
      "key": {
        "a": "freedom",
        "b": "trap",
        "c": "freedom",
        "d": "trap"
      },
      "celebrate": "Money as freedom, you own that now."
    },
    {
      "id": "c6-p5",
      "from": "g49",
      "type": "strike-rewrite",
      "frame": "From Mind & Belonging, one more myth to clear, for the calm of knowing the truth.",
      "myth": {
        "un": "Asking for help means I'm weak or can't cope.",
        "re": "Reaching out early is the strong, smart move; everyone needs support sometimes.",
        "why": "You can bust this one in your sleep now."
      },
      "celebrate": "Reaching out is strength, you carry that now."
    },
    {
      "id": "c6-p6",
      "from": "g51",
      "type": "match",
      "frame": "From Know Your Rights, match a problem to where help actually lives, the routes you now carry.",
      "pairs": [
        {
          "left": "Workplace harassment",
          "right": "The POSH Internal Committee"
        },
        {
          "left": "Can't afford a lawyer",
          "right": "Free legal aid (NALSA, 15100)"
        },
        {
          "left": "Online fraud or abuse",
          "right": "cybercrime.gov.in / 1930"
        }
      ],
      "celebrate": "You know the routes now. Rights you can actually claim."
    },
    {
      "id": "c6-p7",
      "from": "g50",
      "type": "role-play",
      "frame": "From Equal & Confident, one more, for the voice in it. A colleague's good point keeps getting overlooked.",
      "setup": "Amplify them. Say:",
      "yourLine": [
        {
          "text": "\"I want to build on what they just said, it's an important point.\"",
          "best": true
        },
        {
          "text": "Stay quiet and let it pass"
        }
      ],
      "celebrate": "Claim your voice, lift others, that's leadership."
    },
    {
      "id": "c6-p8",
      "from": "g52",
      "type": "strike-rewrite",
      "frame": "From Find Your Feet, clear the big one, for the weight it lifts.",
      "myth": {
        "un": "My worth is my results, package or job title.",
        "re": "Your worth isn't your CV; you are far more than your achievements and status.",
        "why": "You can bust this one in your sleep now."
      },
      "celebrate": "Your worth was never your CV. You know that now."
    },
    {
      "id": "c6-p9",
      "from": "g47",
      "type": "swipe",
      "frame": "From Own Your Health, swipe up for everything that's truly yours to own.",
      "cue": "Your choices about protection. Knowing your status, calmly. Confidential, shame-free care.",
      "up": "Mine to own, with no shame and the facts on my side.",
      "celebrate": "Your health, fully yours. You're ready."
    }
  ],
  "reflect": [
    {
      "id": "c6-r1",
      "prompt": "look how far you've come, from someone who needed an adult in the room to the adult yourself. What feels most different about standing on your own now?",
      "options": [
        "I can handle my own life",
        "I know where to turn",
        "I trust my own judgement",
        "I've grown so much"
      ],
      "affirm": "That capability is real, and you built it yourself, choice by choice."
    },
    {
      "id": "c6-r2",
      "prompt": "Of everything this chapter, which idea will you carry deepest into your independent life?",
      "options": [
        "My consent, both ways",
        "My own income is freedom",
        "Reaching out is strength",
        "My worth isn't my CV"
      ],
      "affirm": "Whatever you carry, it's yours now, and it'll steady you through whatever comes."
    },
    {
      "id": "c6-r3",
      "prompt": "Standing on your own doesn't mean doing it all alone. Does it feel okay to be independent and still lean on people?",
      "options": [
        "Yes, both at once",
        "Independent, not isolated",
        "I can ask for help"
      ],
      "affirm": "Real independence includes knowing when and how to reach for support; you've got both."
    },
    {
      "id": "c6-r4",
      "prompt": "As your own adult now, what are you most ready for?",
      "options": [
        "To run my own life",
        "To build real relationships",
        "To keep growing",
        "Whatever's next"
      ],
      "affirm": "Whatever you chose, you're more ready than you know, and Lensy is proud of who you've become."
    }
  ],
  "celebration": {
    "glyph": "standing-on-my-own-star",
    "certificate": "This certifies that you are Standing on My Own, a graduate of Chapter 6 and a genuinely independent young adult. You live consent as mutual and respect, you date safely and treat people as people, you build healthy relationships and can leave an unhealthy one, you own your health with confidence and no shame, you handle your money and guard your independence, you look after your mind and reach for help as a strength, you hold your worth apart from your CV, you claim your voice and act as an ally, and you know your rights and how to claim them. You took the wheel of an adult life, and you can drive it. Stand tall, you've earned it.",
    "stickerBook": "All nine Chapter 6 stickers now shine in your Standing on My Own constellation, crowned by a golden graduation star. Beneath it, every chapter sticker since age 4 glows on, a whole life of growing, with the adult chapters still ahead."
  },
  "preview": "Next, Chapter 7: Building a Life (ages 22 onward). Standing on your own is the start; now comes building, partnerships and commitment, a home and shared money, the choices about whether and when to start a family, all built, together or solo, on the independence you just earned. It goes deeper and more real, at your own pace, with Lensy still beside you.",
  "share": "This whole chapter is yours, so this is your call: if you'd like, tell someone you trust one thing you're proud of growing into, maybe someone who remembers you before you left home. Or simply hold it for yourself, that's completely okay too. Either way, you've earned this.",
  "doneTitle": "🎓 Standing on my own!",
  "coins": 50
};
