// "Can-Do Kids" (node #5, ages 3–6) — the anti-stereotype game. Audio-first, no-reading, no-fail.
// Spin a role wheel (anyone can do any job), pop a friendly, EVEN-HANDED myth monster ("only for
// boys/girls!" → "Anyone can!"), and learn that feelings, toys, colours and chores aren't gendered.
// The myth-pop is the ages-3–6 seed of Unlearn → Relearn → Grow (no UN&RE characters, no "you were wrong").

export type Role = { id: string; name: string; emoji: string; job: string };
export const ROLES: Role[] = [
  { id: "doctor", name: "Doctor", emoji: "🩺", job: "Listen to a heartbeat!" },
  { id: "pilot", name: "Pilot", emoji: "✈️", job: "Fly through the clouds!" },
  { id: "chef", name: "Chef", emoji: "🍳", job: "Flip a hot dosa!" },
  { id: "cricketer", name: "Cricketer", emoji: "🏏", job: "Score a big six!" },
  { id: "dancer", name: "Dancer", emoji: "💃", job: "Do a joyful dance!" },
  { id: "firefighter", name: "Firefighter", emoji: "🚒", job: "Rescue the cat!" },
  { id: "teacher", name: "Teacher", emoji: "🧑‍🏫", job: "Lead the class!" },
  { id: "scientist", name: "Scientist", emoji: "🔬", job: "Mix a bubbling experiment!" },
  { id: "soldier", name: "Soldier", emoji: "🪖", job: "March with pride!" },
  { id: "artist", name: "Artist", emoji: "🎨", job: "Paint a big mural!" },
];
export const BADGE_TARGET = 5; // try 5 roles to fill the Can-Do Badge Book

// The Myth Monster — EVEN-HANDED: challenges stereotypes about boys as often as about girls (and about
// things), so no gender is caricatured. Always reframed with the same warm line: "Anyone can!".
export const MYTHS: string[] = [
  "Girls can't play cricket!",
  "Boys don't cry!",
  "Cooking is only for girls!",
  "Leading is only for boys!",
  "Boys can't dance!",
  "Girls should stay home!",
  "Pink is only for girls!",
  "Trucks are only for boys!",
  "Dolls aren't for boys!",
];

export type Line = { emoji: string; say: string };
// Big Feelings for Everyone (a callback to Feelings Friends — busts "boys don't cry").
export const FEELINGS_ALL: Line[] = [
  { emoji: "😢", say: "Boys can cry — feelings are for everyone." },
  { emoji: "🦁", say: "Girls can be brave and strong." },
  { emoji: "😠", say: "Everyone can feel angry sometimes." },
  { emoji: "🤗", say: "Everyone can be gentle and kind." },
];
// Toys, Colours & Chores for All.
export const PLAY_ALL: Line[] = [
  { emoji: "🍳", say: "Papa can cook!" },
  { emoji: "🔧", say: "Didi can fix the cycle!" },
  { emoji: "🎀", say: "Pink is for everyone!" },
  { emoji: "🚚", say: "Trucks are for everyone!" },
  { emoji: "🧸", say: "Dolls are for everyone!" },
  { emoji: "🧹", say: "Everyone helps at home!" },
];

export const SAM = {
  greet: "What do you want to be today? Anyone can be anything!",
  home: "What shall we play?",
  be: "Spin the wheel — what will you be?",
  myth: "Uh oh, a myth monster! Tap to pop it!",
  mythPop: "POP! Anyone can!",
  feelings: "All feelings are for everyone!",
  play: "Toys, colours and chores are for everyone!",
  make: "Make your own Can-Do Kid — they can be anything!",
  badge: "Badge earned! Anyone can — and so can YOU!",
  complete: "Look at your Can-Do Badge Book! You can be anything you want.",
};
