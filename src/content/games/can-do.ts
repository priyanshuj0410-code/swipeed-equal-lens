// "Can-Do Kids" — ages 3–6, UNESCO topic 3.2 (equality & stereotypes).
// Audio-first, no-reading, no-fail. The child picks an avatar and spins a "Today I want
// to be…" wheel; the kid does the job whatever their gender. A myth-monster pops up
// ("only for boys/girls!") and the child taps it away → "Anyone can!". A feelings round
// shows boys can cry and girls can be strong. India adaptation: familiar, aspirational
// roles (cricketer, doctor, soldier, dancer, cook); nothing is gendered.

export type Avatar = { emoji: string; name: string };
export type Role = { emoji: string; name: string; bust: string }; // bust = the "Anyone can…" line
export type Feeling = { emoji: string; line: string };

export const AVATARS: Avatar[] = [
  { emoji: "👧🏽", name: "Riya" },
  { emoji: "👦🏾", name: "Arjun" },
  { emoji: "🧒🏻", name: "Sam" },
  { emoji: "👧🏿", name: "Meena" },
  { emoji: "👦🏼", name: "Dev" },
  { emoji: "🧒🏾", name: "Aria" },
];

export const ROLES: Role[] = [
  { emoji: "✈️", name: "pilot", bust: "Anyone can be a pilot!" },
  { emoji: "🩺", name: "doctor", bust: "Anyone can be a doctor!" },
  { emoji: "🍳", name: "chef", bust: "Anyone can cook!" },
  { emoji: "🏏", name: "cricketer", bust: "Anyone can play cricket!" },
  { emoji: "💃", name: "dancer", bust: "Anyone can dance!" },
  { emoji: "🚒", name: "firefighter", bust: "Anyone can be a firefighter!" },
  { emoji: "👩‍🏫", name: "teacher", bust: "Anyone can teach!" },
  { emoji: "🔬", name: "scientist", bust: "Anyone can be a scientist!" },
  { emoji: "🚀", name: "astronaut", bust: "Anyone can be an astronaut!" },
  { emoji: "🪖", name: "soldier", bust: "Anyone can be a soldier!" },
];

// even-handed: half "only for boys", half "only for girls"
export const MYTHS: string[] = ["But that's only for boys!", "But that's only for girls!"];

export const FEELINGS: Feeling[] = [
  { emoji: "😢", line: "Boys can cry too." },
  { emoji: "🧭", line: "Girls can lead the team." },
  { emoji: "💪", line: "Girls can be strong." },
  { emoji: "🤗", line: "Boys can be gentle." },
];

export const ROLE_ROUNDS = 3; // how many spins before the feelings round
