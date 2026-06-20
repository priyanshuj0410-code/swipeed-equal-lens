// Firewall (node #g40, play order: Ch.4, ages 12–15) — Chapter 4, Thread B (Safety, Consent & Boundaries).
// "Most people online are who they say they are — but some aren't. Spot the traps, protect what you
// share, and if something goes wrong: don't panic, it's not your fault, and there's help." The teen
// online-safety game; carries Smart Screen Heroes (#g12) & Boundary Bot (#g15) into the sharper teen
// risks; sets up Decoded (#g36). HIGH-STAKES safeguarding: non-explicit, never victim-blaming, no
// how-to-harm, routes real situations to help. School-Comfort sets how directly sexting/sextortion are
// named. Sam returns as a teen peer. See GDD 40.

export type Step = { emoji: string; say: string };

// 1 · Who's Really There? — spotting grooming, catfishing & fake-profile red flags. Most people are
// genuine — this teaches pattern-recognition, not fear of everyone.
export const WHOS_THERE: Step[] = [
  { emoji: "💝", say: "Showers you with flattery, gifts or favours, fast." },
  { emoji: "⏩", say: "Rushes a 'special', secret closeness." },
  { emoji: "🤫", say: "Asks you to keep the chat a secret." },
  { emoji: "📲", say: "Pushes you onto a private or disappearing-message app." },
  { emoji: "📸", say: "Asks you for photos." },
  { emoji: "🧪", say: "Tests your boundaries a little at a time." },
  { emoji: "🎭", say: "May not be who they claim — fake profiles are real. Check before you trust." },
];

// 2 · Think Before You Share — sharing risks, footprint, resisting pressure. BASE is non-explicit and
// always shown; OPEN names sexting directly and is added only when School-Comfort is OFF (per GDD §11).
export const SHARE_BASE: Step[] = [
  { emoji: "🔁", say: "Anything you send can be copied, saved and spread — and never fully taken back." },
  { emoji: "🚫", say: "Pressure to send is a red flag. 'No' is always valid." },
  { emoji: "🕰️", say: "Your digital footprint lasts — posts and messages can resurface years later." },
  { emoji: "🔒", say: "'Private' isn't guaranteed private — screenshots happen." },
  { emoji: "💔", say: "A partner who pressures you into it isn't respecting you." },
];
export const SHARE_OPEN: Step[] = [
  { emoji: "📵", say: "Sexting — sending sexual or intimate pictures — can't be undone once it's sent. You never owe anyone that." },
];

// 3 · Sextortion: Don't Panic (the signature & highest-safeguarding beat) — the calm, rehearsable plan.
// Non-explicit; never describes how the crime is done; 'not your fault' throughout.
export const NOT_YOUR_FAULT = "It is not your fault. The person threatening you is committing a crime — you are the victim.";
export const SEXTORTION_INTRO =
  "Sextortion is when someone threatens to share intimate images unless you pay or send more. If it ever happens, here's the plan — let's rehearse it.";
export const SEXTORTION_PLAN: { emoji: string; step: string }[] = [
  { emoji: "🛑", step: "Don't panic — and don't pay. Paying never makes it stop." },
  { emoji: "🙅", step: "Don't send more. That only gives them more." },
  { emoji: "💾", step: "Save the evidence — messages, profiles, usernames." },
  { emoji: "🚫", step: "Stop replying, and block them." },
  { emoji: "🗣️", step: "Tell a trusted adult. You will NOT be in trouble." },
  { emoji: "📞", step: "Report: cybercrime 1930 / cybercrime.gov.in · Childline 1098." },
];
export const SEXTORTION_DONE =
  "That's the whole plan. Any sexual image of someone under 18 is something the law protects you from — you're a victim to help, never in trouble. You've got this, and you're never alone.";

// 4 · Online Myths Busted — the UN & RE beat (Appendix A). Busting the self-blame myth is what gives a
// frightened teen the courage to tell someone.
export type Myth = { un: string; re: string };
export const MYTHS: Myth[] = [
  { un: "Everyone sexts — it's no big deal.", re: "Pressure to send is a red flag — and you can always say no." },
  { un: "If I send it, it'll stay private.", re: "Anything sent can be copied, saved and spread — forever." },
  { un: "They said they're my age too.", re: "Groomers lie about who they are — that's the trap." },
  { un: "If I got tricked, it's my fault.", re: "Being deceived or extorted is never your fault." },
  { un: "Paying or sending more will make it stop.", re: "It never does — stop, save, block, tell, report." },
];

// 5 · Lock It Down — practical privacy/security, block & report, footprint, who to tell + the helplines.
export const LOCK_DOWN: Step[] = [
  { emoji: "🔐", say: "Set your accounts to private; tighten your privacy & security settings." },
  { emoji: "🚷", say: "Learn where Block and Report live — and use them without guilt." },
  { emoji: "👣", say: "Tend your footprint: think before you post; clean up what you can." },
  { emoji: "🧑‍🤝‍🧑", say: "Decide who your trusted adults are now — before anything goes wrong." },
  { emoji: "📞", say: "Save the helplines: cybercrime 1930 · cybercrime.gov.in · Childline 1098." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Hey — Sam here. Most people online are genuine. Let's learn to spot the few who aren't, and what to do if something goes wrong.",
  home: "Where to? Take your time.",
  whos: "Who's Really There? Tap each red flag — spotting the pattern is the skill.",
  share: "Think Before You Share. Tap each one — what goes online can't be taken back.",
  sextortion: "Sextortion: Don't Panic. Let's rehearse the plan, step by step — it's never your fault.",
  myths: "Online Myths. Let's bust the ones that keep people unsafe and silent.",
  lock: "Lock It Down. Tap each safety move to add it to your toolkit.",
  badge: "Skill earned! Your safety toolkit's growing.",
  complete: "You can spot the traps, protect what you share, and handle the worst calmly. And if it ever goes wrong — it's not your fault, and there's help. 🧱",
};
