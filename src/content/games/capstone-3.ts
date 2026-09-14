// Content for Capstone 3 — Growing Up Smart (node c3, Chapter 3 graduation, ages 9–12). NEW rich build to
// GDD c3 ("Capstone format v1"), following the c1 reference. Not a lesson, never a test: a calm, near-peer,
// no-fail celebration that consolidates the chapter's nine big truths through spaced, VARIED retrieval (each
// truth re-cued through a DIFFERENT mechanic — gallery · match · swipe · sort · branch · spot · build), then
// lights up the Growing-Up constellation and awards a graduation sticker. Closes Chapter 3 (#g13–g20).
// Faithful from the Landing JSON, rendered by the shared rich engine (components/games/capstone-rich.tsx).
// gameId "capstone-3" (the Landing's "capstone-ch3" is design-doc only). DO NOT RENAME.

import type { CapstoneConfig } from "./capstone-schema";

export const CAPSTONE_3: CapstoneConfig = {
  gameId: "capstone-3",
  capstone: "Growing Up Smart",
  node: "c3",
  chapter: 3,
  ages: "9-12",
  arrival: "Lensy: look how far you've come. When this chapter started, so much was brand new — now it's just how you think. Let's walk back through it together.",
  canvasPayoff: "The Growing-Up map lights up at dusk. Every skill you built switches on across your skyline, until your nine stickers rise like a constellation.",
  threadsRecapped: ["A","C","F","B","D","E"],
  recap: [
    {"node":"g13","game":"Puberty Quest","thread":"A · Body & Growing Up","bigTruth":"Growing up and a changing body are normal; being patient and kind to yourself is the heart of it.","glyph":"growing-body"},
    {"node":"g38","game":"Mind Matters","thread":"C · Feelings & Life Skills","bigTruth":"Your mind matters, feelings pass, you have tools, and asking for help is strong.","glyph":"mind-care"},
    {"node":"g14","game":"The Amazing Journey","thread":"F · Sexual & Reproductive Health","bigTruth":"You understand the basics of how life begins, and you can hold that knowledge with calm confidence and respect.","glyph":"journey-map"},
    {"node":"g15","game":"Boundary Bot","thread":"B · Safety, Consent & Boundaries","bigTruth":"Your boundaries matter and so do others'; ask before sharing, guard private info, and tell someone if pressured.","glyph":"boundary-bot"},
    {"node":"g16","game":"Crossroads","thread":"D · Relationships","bigTruth":"Stop, see your options, weigh them, and choose by your values, and keep the friends who respect your right to choose.","glyph":"crossroads-compass"},
    {"node":"g17","game":"Flip the Script","thread":"E · Gender & Respect","bigTruth":"Spot the stereotype, flip it, and call it out, that's the skill.","glyph":"flip-star"},
    {"node":"g18","game":"Norm Storm","thread":"E · Gender & Respect","bigTruth":"Some norms help and some harm; you can question a harmful one, kindly.","glyph":"norm-compass"},
    {"node":"g19","game":"Speak Up","thread":"E · Gender & Respect","bigTruth":"With the five upstander moves and the helplines, you're ready to help safely.","glyph":"upstander-badge"},
    {"node":"g20","game":"Defenders of the Body","thread":"F · Sexual & Reproductive Health","bigTruth":"You know the facts about infections and HIV, and you can be a safe, kind, well-informed friend to anyone.","glyph":"defender-heart"},
  ],
  playback: [
    {"id":"c3-p1","from":"all","type":"gallery","frame":"Your Growing-Up constellation, nine stickers from nine games. Tap any star to revisit what you learned there.","stickers":["growing-body","mind-care","journey-map","boundary-bot","crossroads-compass","flip-star","norm-compass","upstander-badge","defender-heart"],"celebrate":"Nine stars in your sky. That's a whole chapter of growing up."},
    {"id":"c3-p2","from":"g13","type":"match","frame":"From Puberty Quest, match each change to the calm truth about it. You know these now.","pairs":[{"left":"Body changing at its own pace","right":"Normal and healthy"},{"left":"Everyone changes at different times","right":"Totally okay"},{"left":"Big feelings during puberty","right":"Expected, and they pass"}],"celebrate":"Calm and confident, that's growing up well."},
    {"id":"c3-p3","from":"g14","type":"swipe","frame":"From The Amazing Journey, swipe up for every fact you can hold with calm confidence.","cue":"Everyone began as a tiny cell. Bodies can make babies when grown up. Asking questions about it is healthy.","up":"True, and nothing to be shy about.","celebrate":"You own this knowledge with respect."},
    {"id":"c3-p4","from":"g38","type":"sort","frame":"From Mind Matters, sort the healthy ways to handle a big feeling, you've got a whole toolkit.","items":[{"id":"a","text":"Slow breathing"},{"id":"b","text":"Bottling it all up"},{"id":"c","text":"Talking to someone you trust"},{"id":"d","text":"Being harsh with yourself"}],"bins":[{"id":"healthy","label":"Healthy tool","valence":"pos"},{"id":"not","label":"Not so helpful","valence":"uhoh"}],"key":{"a":"healthy","b":"not","c":"healthy","d":"not"},"celebrate":"Toolkit ready, you're never stuck."},
    {"id":"c3-p5","from":"g15","type":"sort","frame":"From Boundary Bot, sort the respectful online move, you're a pro at this.","items":[{"id":"a","text":"Ask before sharing someone's photo"},{"id":"b","text":"Post a friend's secret"},{"id":"c","text":"Guard your private info"},{"id":"d","text":"Give in when pressured"}],"bins":[{"id":"respect","label":"Respectful & safe","valence":"pos"},{"id":"no","label":"Crosses a line","valence":"neg"}],"key":{"a":"respect","b":"no","c":"respect","d":"no"},"celebrate":"Boundaries, yours and theirs, respected."},
    {"id":"c3-p6","from":"g16","type":"branch","frame":"One more Crossroads, just for the joy of knowing your move. Friends push you toward something that clashes with your values.","options":[{"text":"Stop, weigh it, and choose your values","consequence":"You choose like the thoughtful decider you've become.","outcome":"values","best":true},{"text":"Follow the crowd","consequence":"You know the move now, your values lead."}],"debrief":"Stop, see options, weigh, choose your values, you've got this.","celebrate":"Decision-maker of your own life."},
    {"id":"c3-p7","from":"g17","type":"spot","frame":"From Flip the Script, spot the stereotype hiding in plain sight, every answer's a win here.","scene":[{"text":"\"Boys don't cry\" in a show","trick":true},{"text":"A catchy theme tune","trick":false},{"text":"\"That job's not for girls\"","trick":true}],"why":"Those are stereotypes, and you can flip them to something fair.","celebrate":"Spotted and flipped, script-flipper."},
    {"id":"c3-p8","from":"g18","type":"match","frame":"From Norm Storm, match each norm to what it really does, you read these easily now.","pairs":[{"left":"Be kind to guests","right":"Makes people feel welcome"},{"left":"Girls eat last","right":"Says some people matter less"},{"left":"Wait your turn","right":"Keeps things fair for all"}],"celebrate":"Keep the helpful, question the harmful."},
    {"id":"c3-p9","from":"g19","type":"build","frame":"From Speak Up, build the upstander toolkit, the five safe ways to help.","pieces":["say something","distract","get an adult","check in after","report online harm"],"mode":"assemble","celebrate":"Five moves, always one that's safe to use."},
    {"id":"c3-p10","from":"g20","type":"sort","frame":"From Defenders of the Body, sort what spreads HIV from what truly doesn't, facts beat fear.","items":[{"id":"a","text":"A hug"},{"id":"b","text":"Sharing food"},{"id":"c","text":"Shared needles"},{"id":"d","text":"Sitting together"}],"bins":[{"id":"not","label":"Does NOT spread it","valence":"neutral"},{"id":"can","label":"Can spread it","valence":"neutral"}],"key":{"a":"not","b":"not","c":"can","d":"not"},"celebrate":"Facts clear, heart kind, a true defender."},
  ],
  reflect: [
    {"id":"c3-r1","prompt":"Lensy: look how far you've come this chapter. What feels different about you now?","options":["I'm calmer about growing up","I make better choices","I speak up more","I know more"],"affirm":"That growth is real, and it's all yours."},
    {"id":"c3-r2","prompt":"Lensy: which growing-up skill are you most glad to have?","options":["Knowing my body","Handling feelings","Choosing by my values","Standing up for others"],"affirm":"A skill like that will serve you for life."},
    {"id":"c3-r3","prompt":"Lensy: when something's hard now, what do you reach for?","options":["A coping tool","A trusted person","My own values","A deep breath"],"affirm":"You've built real ways to handle hard things."},
    {"id":"c3-r4","prompt":"Lensy: what will you carry into the teen years ahead?","options":["Be kind to myself","Choose my values","Speak up","Keep growing"],"affirm":"Carry it forward, the next chapter's ready for you."},
  ],
  celebration: {"glyph":"growing-up-star","certificate":"This certifies that you are a Growing Up Smart graduate. You understand your body and mind, handle big feelings, choose well, and stand up for others.","stickerBook":"All nine Chapter 3 stickers now shine in your Growing-Up constellation, topped by a golden Growing-Up star, your Chapter 3 graduation sticker."},
  preview: "Next, Chapter 4: Reading Relationships (ages 12–15). Relationships get more real — attraction, deeper consent, reading people — at your own pace.",
  share: "This chapter is more your own, so it's your call: if you'd like, share one thing you're proud of with a grown-up you trust. Or keep it for yourself.",
  doneTitle: "🎓 Chapter Three complete!",
  coins: 30,
};
