// Content for Capstone 1 — My First Friends (node c1, Chapter 1 graduation, ages 3–6). NEW rich build to
// GDD c1 ("Capstone format v1"), the REFERENCE implementation the other capstones follow. Not a lesson,
// never a test: a joyful, no-fail celebration that consolidates the chapter's six big truths through spaced,
// VARIED retrieval (each truth re-cued through a different mechanic — gallery · match · sort · build · spot ·
// swipe), then blooms the Friendship Garden and awards a graduation sticker. Faithful from the Landing JSON,
// rendered by the shared rich engine (components/games/capstone-rich.tsx). gameId "capstone-1" (the Landing's
// "capstone-ch1" is design-doc only). DO NOT RENAME.

import type { CapstoneConfig } from "./capstone-schema";

export const CAPSTONE_1: CapstoneConfig = {
  gameId: "capstone-1",
  capstone: "My First Friends",
  node: "c1",
  chapter: 1,
  ages: "3-6",
  arrival: "Lensy: you did it! Look, every seed you planted in Chapter 1 is about to bloom. Let's take a happy walk back through everything you learned.",
  canvasPayoff: "The whole Friendship Garden bursts into bloom — every flower you grew in Chapter 1 opens at once — and Lensy hangs your stickers in the sky like little suns.",
  threadsRecapped: ["C", "A", "D", "E"],
  recap: [
    {"node":"g01","game":"Feelings Friends","thread":"C · Feelings & Life Skills","bigTruth":"All your feelings are okay, you can name them, and you can say a big NO.","glyph":"feelings-faces"},
    {"node":"g02","game":"My Body, My Rules","thread":"A · Body & Growing Up","bigTruth":"Your body is yours; you know safe from unsafe touch, and you can tell a trusted grown-up.","glyph":"body-shield"},
    {"node":"g03","game":"My Family Garden","thread":"D · Relationships","bigTruth":"Families come in all shapes; love makes a family, and everyone belongs.","glyph":"family-heart"},
    {"node":"g04","game":"Same Same, Different","thread":"E · Gender & Respect","bigTruth":"We're equal inside; difference is wonderful, and toys, colours and dreams are for everyone.","glyph":"rainbow-friends"},
    {"node":"g05","game":"Can-Do Kids","thread":"E · Gender & Respect","bigTruth":"Anyone can be anything, whatever their gender.","glyph":"can-do-star"},
    {"node":"g37","game":"Clean Crew","thread":"A · Body & Growing Up","bigTruth":"Washing, brushing and healthy habits keep your body well, for everyone.","glyph":"bubble-clean"},
  ],
  playback: [
    {"id":"c1-p1","from":"all","type":"gallery","frame":"Your sticker book! Here are all six stickers you earned in Chapter 1. Tap each one to hear its happy truth again.","stickers":["feelings-faces","body-shield","family-heart","rainbow-friends","can-do-star","bubble-clean"],"celebrate":"Six stickers, what a collection. You earned every one."},
    {"id":"c1-p2","from":"g01","type":"match","frame":"Remember your Feelings Friends? Match each face to its feeling, just for fun, you know these by heart now.","pairs":[{"left":"Big smile","right":"Happy"},{"left":"Teary eyes","right":"Sad"},{"left":"Stompy feet","right":"Angry"}],"celebrate":"You've got it, feelings expert!"},
    {"id":"c1-p3","from":"g02","type":"sort","frame":"A quick happy recap: which of these is your choice to make? Pop them where they belong.","items":[{"id":"a","text":"Who hugs you"},{"id":"b","text":"Keeping your body yours"},{"id":"c","text":"A trusted grown-up to tell"}],"bins":[{"id":"mine","label":"My body, my rules"},{"id":"help","label":"My helpers"}],"key":{"a":"mine","b":"mine","c":"help"},"celebrate":"Yes! You're the boss of your body."},
    {"id":"c1-p4","from":"g03","type":"build","frame":"Let's grow your family garden again. Plant the people who love you, big family, small family, every kind belongs.","pieces":["the grown-ups who care for me","people I love","people who love me"],"mode":"assemble","celebrate":"A beautiful garden, every family is wonderful."},
    {"id":"c1-p5","from":"g04","type":"spot","frame":"Spot the wonderful difference, every answer here is a happy one: which shows everyone is welcome?","scene":[{"text":"All the kids share every toy","trick":true},{"text":"A sunny day","trick":false},{"text":"\"That colour is for everyone\"","trick":true}],"why":"Difference is wonderful and sharing is for everyone.","celebrate":"You see it, difference makes the garden brighter."},
    {"id":"c1-p6","from":"g05","type":"swipe","frame":"Cheer it on! Swipe up for every can-do kid.","cue":"Can a girl be an astronaut? Can a boy be a dancer? Can anyone be kind?","up":"Yes, anyone can!","celebrate":"Anyone can be anything, hooray!"},
    {"id":"c1-p7","from":"g37","type":"build","frame":"Run through your Clean Crew routine one happy time. Put the steps in order.","pieces":["wet hands","soap and scrub","rinse","dry"],"mode":"sequence","celebrate":"Squeaky clean, healthy habits for the win."},
    {"id":"c1-p8","from":"g03","type":"match","frame":"One more from the family garden, match the love to where it lives.","pairs":[{"left":"A caring hug","right":"Family love"},{"left":"Playing together","right":"Friend love"},{"left":"Looking after you","right":"Grown-up care"}],"celebrate":"So many kinds of love, and you know them all."},
  ],
  reflect: [
    {"id":"c1-r1","prompt":"Lensy: which feeling-friend do you say hello to most these days?","options":["Happy","Excited","Calm","All of them"],"affirm":"However you feel, your feelings are always welcome."},
    {"id":"c1-r2","prompt":"Lensy: who lives in your family garden?","options":["My grown-ups","My brothers or sisters","My whole big family","My special people"],"affirm":"Whoever they are, your garden is full of love."},
    {"id":"c1-r3","prompt":"Lensy: what's one way you keep your body yours and well?","options":["I say what's okay","I wash my hands","I tell a trusted grown-up","All of these"],"affirm":"You take wonderful care of you."},
    {"id":"c1-r4","prompt":"Lensy: which happy idea will you carry into your next adventure?","options":["My feelings are okay","Everyone belongs","Anyone can be anything","My body, my rules"],"affirm":"Carry it with you, it's yours forever now."},
  ],
  celebration: {"glyph": "friendship-garden-bloom", "certificate": "You are now a My First Friends graduate! You name your feelings, know your body is yours, know everyone belongs, anyone can be anything. The garden is yours.", "stickerBook": "All six Chapter 1 stickers are now glowing in your sticker book, with a brand-new golden Friendship-Garden bloom on top, your Chapter 1 graduation sticker."},
  preview: "Next, Chapter 2: you become a Fair & Safe Explorer, heading further into the world to learn about fairness, safe surprises and looking out for friends.",
  share: "Show a grown-up your blooming Friendship Garden and tell them one thing you learned. They'll be so proud, and you can teach them your favourite feeling-friend.",
  doneTitle: "🎓 Chapter One complete!",
  coins: 25,
};
