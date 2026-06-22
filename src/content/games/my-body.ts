// Content for My Body, My Rules (node g02, ages 3–6) — reworked to GDD 02 v2 (mechanic-embodying).
// "My body, my rules." 84 researched scenarios across six categories, each re-encoded to one of the seven
// shared v2 play actions (reflect / role-play / strike-rewrite / branch / sort / match / build) — no binary
// "tap the right card". PANTS backbone; AAP real body names; safe/unsafe (never good/bad); secrets vs
// surprises; trusted-adults network; POCSO / Childline 1098. Empower never frighten; never the child's fault.
// Rendered by the shared engine (components/games/v2-engine.tsx).
// gameId "my-body" — node.game === GameDone key === engine-host id. DO NOT RENAME.

import type { Scenario, V2GameConfig } from "./v2-schema";

const SCENARIOS: Scenario[] = [
  // — My body is mine —
  {"id":"mb-001","cat":"my-body-mine","type":"reflect","hook":"Lensy: whose body is this?","prompt":"Point to the answer.","options":["Mine!","All mine","My very own"],"affirm":"Yes! Your body belongs to you. You're the boss of your body.","relearn":"Your body is yours; you are the boss of it.","persona":"any","source":"body autonomy"},
  {"id":"mb-002","cat":"my-body-mine","type":"role-play","hook":"You don't feel like a hug right now.","setup":"It's okay to say. Say:","yourLine":[{"text":"\"No thank you, not right now.\"","best":true},{"text":"Hug even though you don't want to"}],"relearn":"You can say no to a hug; your body, your rules.","persona":"Aria","source":"consent / voice"},
  {"id":"mb-003","cat":"my-body-mine","type":"strike-rewrite","hook":"\"You must always let grown-ups hug or kiss you.\"","myth":{"un":"You must always let grown-ups hug or kiss you.","re":"You can say no to a hug or kiss, even from people you love.","why":"Your body is yours; a wave or high-five is fine too."},"relearn":"You can choose how people show you love.","persona":"any","source":"body autonomy"},
  {"id":"mb-004","cat":"my-body-mine","type":"branch","hook":"A relative wants a kiss but you don't want one.","options":[{"text":"Offer a wave or high-five instead","consequence":"You greet them warmly and keep your body rules.","outcome":"empowered","best":true},{"text":"Let them, feeling uncomfortable","consequence":"You ignore your own 'no' feeling."}],"debrief":"You can be kind AND keep your body rules, a wave works.","relearn":"You can greet people in a way that feels okay to you.","persona":"any","source":"body autonomy"},
  {"id":"mb-005","cat":"my-body-mine","type":"reflect","hook":"Lensy: your tummy gives an 'uh-oh' feeling sometimes. Listen to it?","prompt":"What do you think?","options":["Yes","It's a warning","I'll listen"],"affirm":"Your 'uh-oh' feeling is clever, listen to it and tell someone.","relearn":"Your 'uh-oh' feeling is a helpful warning; listen to it.","persona":"any","source":"body cues"},
  {"id":"mb-006","cat":"my-body-mine","type":"role-play","hook":"Someone is tickling you and you've had enough.","setup":"Use your words. Say:","yourLine":[{"text":"\"Stop, please, I don't like it now.\"","best":true},{"text":"Keep laughing even though you want it to stop"}],"relearn":"Even in fun, you can say stop, and it should stop.","persona":"any","source":"consent / voice"},
  {"id":"mb-007","cat":"my-body-mine","type":"sort","hook":"Sort: my choice about my body, or someone else's?","items":[{"id":"a","text":"Whether I want a hug"},{"id":"b","text":"What a stranger says I must do"},{"id":"c","text":"Saying stop to tickling"},{"id":"d","text":"Someone forcing a kiss"}],"bins":[{"id":"mine","label":"My choice"},{"id":"no","label":"Not okay / not theirs"}],"key":{"a":"mine","b":"no","c":"mine","d":"no"},"relearn":"Choices about your body are yours; no one forces them.","persona":"any","source":"body autonomy"},
  {"id":"mb-008","cat":"my-body-mine","type":"reflect","hook":"Lensy: being the boss of your body feels good. Agree?","prompt":"What do you think?","options":["Yes","Strong","I'm in charge"],"affirm":"You're the boss of your body, and that's a strong, safe feeling.","relearn":"You're in charge of your own body.","persona":"any","source":"empowerment"},

  // — Real names —
  {"id":"mb-009","cat":"real-names","type":"strike-rewrite","hook":"\"Body parts have silly nicknames and the real names are naughty.\"","myth":{"un":"The real names for body parts are naughty.","re":"Real body names are just words; knowing them is smart and safe.","why":"Real names help you tell a grown-up clearly if something's wrong."},"relearn":"Knowing the real names for body parts is smart and keeps you safe.","persona":"any","source":"body literacy"},
  {"id":"mb-010","cat":"real-names","type":"reflect","hook":"Lensy: a doctor and your grown-up use the proper names. Is that okay to learn?","prompt":"What do you think?","options":["Yes","They're just words","Smart to know"],"affirm":"Yes, the proper names are just words, and knowing them is helpful.","relearn":"It's okay and smart to learn the proper names for your body.","persona":"any","source":"body literacy"},
  {"id":"mb-011","cat":"real-names","type":"match","hook":"Match the body part to what we do with it (the everyday ones!).","pairs":[{"left":"Hands","right":"Hold and wave"},{"left":"Feet","right":"Walk and run"},{"left":"Mouth","right":"Eat and talk"}],"relearn":"You can name your body parts and what they do.","persona":"any","source":"body literacy"},
  {"id":"mb-012","cat":"real-names","type":"sort","hook":"Sort: a private part (under your swimsuit), or not private?","items":[{"id":"a","text":"Hands"},{"id":"b","text":"The parts under your swimsuit"},{"id":"c","text":"Face"},{"id":"d","text":"Bottom & private parts"}],"bins":[{"id":"private","label":"Private (swimsuit areas)"},{"id":"not","label":"Not private"}],"key":{"a":"not","b":"private","c":"not","d":"private"},"relearn":"Your private parts are the ones a swimsuit covers.","persona":"any","source":"PANTS"},
  {"id":"mb-013","cat":"real-names","type":"strike-rewrite","hook":"\"You should feel ashamed of your private parts.\"","myth":{"un":"Your private parts are shameful.","re":"Private parts are a normal part of your body, just private.","why":"Private means yours, not bad."},"relearn":"Private parts are normal and yours; private isn't shameful.","persona":"any","source":"body normalcy"},
  {"id":"mb-014","cat":"real-names","type":"reflect","hook":"Lensy: knowing your body helps you keep it safe. Agree?","prompt":"What do you think?","options":["Yes","Knowing helps","I feel ready"],"affirm":"Knowing your body, names and all, helps you stay safe.","relearn":"Knowing your body helps you protect it.","persona":"any","source":"body literacy / safety"},
  {"id":"mb-015","cat":"real-names","type":"role-play","hook":"You want to tell a grown-up clearly about your body.","setup":"Use clear words. Practise saying:","yourLine":[{"text":"\"Something happened to my body and I want to tell you.\"","best":true},{"text":"Stay too shy to explain"}],"relearn":"Clear words help a trusted grown-up understand and help.","persona":"any","source":"disclosure / voice"},
  {"id":"mb-016","cat":"real-names","type":"match","hook":"Match: who can see or help with private parts, and when (to keep you healthy).","pairs":[{"left":"You","right":"Always, they're yours"},{"left":"A parent/doctor","right":"Only to keep you clean & healthy"},{"left":"Anyone else","right":"No"}],"relearn":"Only you, and a parent/doctor for health, with your private parts, no one else.","persona":"any","source":"PANTS / exceptions"},

  // — Safe or unsafe —
  {"id":"mb-017","cat":"safe-unsafe","type":"sort","hook":"Sort the touches into safe or unsafe.","items":[{"id":"a","text":"A hug you wanted"},{"id":"b","text":"Hitting or pinching"},{"id":"c","text":"A high-five"},{"id":"d","text":"A touch on your private parts"}],"bins":[{"id":"safe","label":"Safe touch"},{"id":"unsafe","label":"Unsafe touch"}],"key":{"a":"safe","b":"unsafe","c":"safe","d":"unsafe"},"relearn":"Safe touches feel caring; unsafe touches hurt or touch private parts.","persona":"any","source":"safe vs unsafe touch"},
  {"id":"mb-018","cat":"safe-unsafe","type":"strike-rewrite","hook":"Grown-ups sometimes say 'good touch / bad touch'.","myth":{"un":"Touch is either 'good' or 'bad' and you must judge it.","re":"We say 'safe' and 'unsafe', so nothing ever feels like your fault.","why":"Safe/unsafe takes blame off the child."},"relearn":"We say safe and unsafe touch.","persona":"educator","source":"language guidance"},
  {"id":"mb-019","cat":"safe-unsafe","type":"branch","hook":"Someone wants to touch your private parts.","options":[{"text":"Say no, get away, and tell a trusted grown-up","consequence":"You stay safe and a grown-up can help.","outcome":"safe","best":true},{"text":"Stay quiet because you're unsure","consequence":"Telling is what keeps you safe, you can always tell."}],"debrief":"That's an unsafe touch, no, go, tell, and it's never your fault.","relearn":"No one should touch your private parts; tell a trusted grown-up.","persona":"any","source":"body safety"},
  {"id":"mb-020","cat":"safe-unsafe","type":"reflect","hook":"Lensy: if a touch gives you an 'uh-oh' feeling, what does that mean?","prompt":"What do you think?","options":["Listen to it","It might be unsafe","Tell someone"],"affirm":"Your 'uh-oh' feeling is a clue, listen and tell a trusted grown-up.","relearn":"An 'uh-oh' feeling about a touch is worth telling someone.","persona":"any","source":"body cues"},
  {"id":"mb-021","cat":"safe-unsafe","type":"strike-rewrite","hook":"\"If something unsafe happens, it's the child's fault.\"","myth":{"un":"If an unsafe touch happens, the child is to blame.","re":"It is never, ever the child's fault.","why":"The grown-up who does it is responsible, always."},"relearn":"An unsafe touch is never the child's fault.","persona":"any","source":"non-blame"},
  {"id":"mb-022","cat":"safe-unsafe","type":"branch","hook":"A doctor needs to check you to keep you healthy, with your parent there.","options":[{"text":"That's okay, a parent is there and it's for health","consequence":"You understand the safe exception.","outcome":"safe","best":true},{"text":"Panic that all touching is unsafe","consequence":"Health check-ups with a parent are a safe exception."}],"debrief":"A doctor checking you, with a parent there, to keep you healthy is okay.","relearn":"A doctor with your parent, for your health, is a safe exception.","persona":"any","source":"exceptions"},
  {"id":"mb-023","cat":"safe-unsafe","type":"sort","hook":"Sort: a safe touch, or unsafe?","items":[{"id":"a","text":"Holding hands to cross the road"},{"id":"b","text":"Someone hurting your body"},{"id":"c","text":"A pat on the back you're okay with"},{"id":"d","text":"A secret touch you're told to hide"}],"bins":[{"id":"safe","label":"Safe"},{"id":"unsafe","label":"Unsafe"}],"key":{"a":"safe","b":"unsafe","c":"safe","d":"unsafe"},"relearn":"Caring, wanted touches are safe; hurting or secret touches are unsafe.","persona":"any","source":"safe vs unsafe touch"},
  {"id":"mb-024","cat":"safe-unsafe","type":"role-play","hook":"A touch feels unsafe and you want it to stop.","setup":"Say your big, clear words:","yourLine":[{"text":"\"No! Stop. I'm telling.\"","best":true},{"text":"Freeze and say nothing"}],"relearn":"You can say 'no, stop, I'm telling', it's strong and right.","persona":"Aria","source":"assertiveness / voice"},

  // — Ask first & stop —
  {"id":"mb-025","cat":"consent-stop","type":"role-play","hook":"You want to play a game that involves your friend.","setup":"Ask first. Say:","yourLine":[{"text":"\"Is it okay if we play this?\"","best":true},{"text":"Just grab them into it"}],"relearn":"Asking first is how we respect each other's bodies and choices.","persona":"any","source":"consent"},
  {"id":"mb-026","cat":"consent-stop","type":"strike-rewrite","hook":"\"If someone doesn't say no, it means yes.\"","myth":{"un":"If someone doesn't say no, it's a yes.","re":"Always ask, and listen for a real yes; a freeze or silence isn't yes.","why":"Checking shows you care about their choice."},"relearn":"Ask first and wait for a real yes.","persona":"any","source":"consent"},
  {"id":"mb-027","cat":"consent-stop","type":"branch","hook":"Your friend says 'stop' during a rough-and-tumble game.","options":[{"text":"Stop right away","consequence":"They feel respected; you can play again later.","outcome":"respectful","best":true},{"text":"Keep going, it's just fun","consequence":"Stop means stop, even in fun."}],"debrief":"When someone says stop, you stop, every time.","relearn":"Stop means stop, straight away.","persona":"any","source":"consent"},
  {"id":"mb-028","cat":"consent-stop","type":"sort","hook":"Sort: respects 'stop', or doesn't?","items":[{"id":"a","text":"Stopping when asked"},{"id":"b","text":"Carrying on after 'stop'"},{"id":"c","text":"Checking 'are you okay?'"},{"id":"d","text":"Ignoring how they feel"}],"bins":[{"id":"yes","label":"Respects stop"},{"id":"no","label":"Doesn't"}],"key":{"a":"yes","b":"no","c":"yes","d":"no"},"relearn":"Stopping and checking respects others; ignoring doesn't.","persona":"any","source":"consent"},
  {"id":"mb-029","cat":"consent-stop","type":"role-play","hook":"Your little cousin says 'stop' while you play.","setup":"Show you respect it. Say:","yourLine":[{"text":"\"Okay, I'll stop. Tell me when you're ready.\"","best":true},{"text":"\"Just one more time!\" (keep going)"}],"relearn":"Respecting 'stop' makes you a kind, safe playmate.","persona":"any","source":"consent / voice"},
  {"id":"mb-030","cat":"consent-stop","type":"branch","hook":"You want to share your toy with a friend who looks unsure.","options":[{"text":"Ask \"would you like to play with it?\"","consequence":"They choose freely; sharing feels good.","outcome":"kind","best":true},{"text":"Push it into their hands","consequence":"Asking respects their choice better."}],"debrief":"Asking first respects what someone else wants.","relearn":"Asking first respects another person's choice.","persona":"any","source":"consent"},
  {"id":"mb-031","cat":"consent-stop","type":"reflect","hook":"Lensy: 'ask first' and 'stop means stop' work for everyone. Agree?","prompt":"What do you think?","options":["Yes","For everyone","It's fair"],"affirm":"Yes, asking first and stopping when asked keeps everyone's body rules safe.","relearn":"Ask first and stop when asked, for everyone.","persona":"any","source":"consent"},
  {"id":"mb-032","cat":"consent-stop","type":"match","hook":"Match the consent move to what it shows.","pairs":[{"left":"Asking first","right":"You respect their choice"},{"left":"Stopping when asked","right":"You listen to their no"},{"left":"Checking 'okay?'","right":"You care how they feel"}],"relearn":"Asking, stopping and checking all show respect.","persona":"any","source":"consent"},

  // — Secret or surprise —
  {"id":"mb-033","cat":"secret-surprise","type":"sort","hook":"Sort: a happy surprise, or an unsafe secret?","items":[{"id":"a","text":"A birthday surprise (told soon)"},{"id":"b","text":"\"Don't tell your parents I touched you\""},{"id":"c","text":"A gift to reveal at the party"},{"id":"d","text":"\"Keep this touch a secret forever\""}],"bins":[{"id":"surprise","label":"Happy surprise"},{"id":"unsafe","label":"Unsafe secret, tell!"}],"key":{"a":"surprise","b":"unsafe","c":"surprise","d":"unsafe"},"relearn":"Surprises are happy and told soon; unsafe secrets you always tell.","persona":"any","source":"secrets vs surprises"},
  {"id":"mb-034","cat":"secret-surprise","type":"strike-rewrite","hook":"\"You must keep every secret you're told.\"","myth":{"un":"You must keep every secret you're told.","re":"Never keep a secret about an unsafe touch, always tell.","why":"Safety beats a promise to hide."},"relearn":"Never keep a secret about unsafe touch; tell a trusted grown-up.","persona":"any","source":"secrets"},
  {"id":"mb-035","cat":"secret-surprise","type":"branch","hook":"Someone says \"this is our secret, don't tell your parents.\"","options":[{"text":"Tell a trusted grown-up anyway","consequence":"You stay safe; that 'secret' was a red flag.","outcome":"safe","best":true},{"text":"Keep it because they asked","consequence":"'Don't tell your parents' is exactly when to tell."}],"debrief":"'Don't tell your parents' is a red flag, tell them.","relearn":"If a secret must be hidden from parents, that's the one to tell.","persona":"any","source":"grooming awareness"},
  {"id":"mb-036","cat":"secret-surprise","type":"reflect","hook":"Lensy: a secret that makes your tummy feel bad, what do you do?","prompt":"What do you think?","options":["Tell someone","Share it with a grown-up","Don't keep it"],"affirm":"A secret that feels bad inside is one to share with a trusted grown-up.","relearn":"If a secret feels bad, tell a trusted grown-up.","persona":"any","source":"body cues"},
  {"id":"mb-037","cat":"secret-surprise","type":"strike-rewrite","hook":"\"You'll get in trouble if you tell.\"","myth":{"un":"You'll get in trouble if you tell.","re":"You won't be in trouble for telling; telling keeps you safe.","why":"Telling is brave and right."},"relearn":"Telling about an unsafe secret is safe and brave.","persona":"any","source":"disclosure"},
  {"id":"mb-038","cat":"secret-surprise","type":"sort","hook":"Sort: okay to keep for now, or tell right away?","items":[{"id":"a","text":"A surprise party"},{"id":"b","text":"An unsafe touch"},{"id":"c","text":"A wrapped gift"},{"id":"d","text":"Someone hurting you"}],"bins":[{"id":"keep","label":"Keep (happy, told soon)"},{"id":"tell","label":"Tell right away"}],"key":{"a":"keep","b":"tell","c":"keep","d":"tell"},"relearn":"Happy surprises can wait; anything unsafe, tell right away.","persona":"any","source":"secrets vs surprises"},
  {"id":"mb-039","cat":"secret-surprise","type":"branch","hook":"You promised to keep an unsafe secret, but it feels wrong.","options":[{"text":"Tell a trusted grown-up; that promise doesn't count","consequence":"You did the safe, brave thing.","outcome":"safe","best":true},{"text":"Keep the promise","consequence":"A promise to hide something unsafe doesn't count."}],"debrief":"A promise to hide something unsafe doesn't count, you can tell.","relearn":"You can break a promise that hides something unsafe.","persona":"any","source":"disclosure"},

  // — Tell someone —
  {"id":"mb-040","cat":"tell-trusted","type":"build","hook":"Build your team of trusted grown-ups.","prompt":"Add grown-ups who help you feel safe.","pieces":["a parent","a grandparent","a teacher","a guardian","an aunt or uncle"],"mode":"assemble","key":["a parent","a grandparent","a teacher","a guardian","an aunt or uncle"],"relearn":"Pick a few trusted grown-ups you can always tell.","persona":"any","source":"trusted-adults network"},
  {"id":"mb-041","cat":"tell-trusted","type":"branch","hook":"You told one grown-up but they didn't help.","options":[{"text":"Tell another, and keep telling until someone helps","consequence":"Someone will help; keep going.","outcome":"safe","best":true},{"text":"Give up","consequence":"If one doesn't help, the next one can."}],"debrief":"Keep telling trusted grown-ups until someone helps.","relearn":"If one grown-up doesn't help, tell another.","persona":"any","source":"keep telling"},
  {"id":"mb-042","cat":"tell-trusted","type":"strike-rewrite","hook":"\"Telling a grown-up is tattling.\"","myth":{"un":"Telling a grown-up to stay safe is tattling.","re":"Telling to keep safe is smart and brave, not tattling.","why":"Safety telling helps you and others."},"relearn":"Telling to stay safe is brave, not tattling.","persona":"any","source":"telling vs tattling"},
  {"id":"mb-043","cat":"tell-trusted","type":"reflect","hook":"Lensy: in India you can call Childline at 1098 for help. Good to know?","prompt":"What do you think?","options":["Yes","1098 helps kids","Good to know"],"affirm":"Yes, Childline 1098 is there to help children in India.","relearn":"In India, Childline 1098 is a helpline for children.","persona":"India","source":"Childline 1098"},
  {"id":"mb-044","cat":"tell-trusted","type":"role-play","hook":"Something unsafe happened and you feel scared to tell.","setup":"Be brave. Say:","yourLine":[{"text":"\"I need to tell you something that happened.\"","best":true},{"text":"Keep it inside"}],"relearn":"Even when it's scary, telling a trusted grown-up is right.","persona":"any","source":"disclosure / voice"},
  {"id":"mb-045","cat":"tell-trusted","type":"branch","hook":"Something unsafe happened a while ago and you never told.","options":[{"text":"Tell a trusted grown-up now, it's never too late","consequence":"You can always tell, even later.","outcome":"safe","best":true},{"text":"Decide it's too late","consequence":"It's never too late to tell."}],"debrief":"It's never too late to tell, you can always tell.","relearn":"You can always tell, even if it happened a while ago.","persona":"any","source":"disclosure"},
  {"id":"mb-046","cat":"tell-trusted","type":"sort","hook":"Sort: a trusted grown-up to tell, or not the right person?","items":[{"id":"a","text":"A parent who listens"},{"id":"b","text":"Someone who says 'don't tell'"},{"id":"c","text":"A caring teacher"},{"id":"d","text":"Someone who made you feel unsafe"}],"bins":[{"id":"trusted","label":"Trusted grown-up"},{"id":"no","label":"Not the right person"}],"key":{"a":"trusted","b":"no","c":"trusted","d":"no"},"relearn":"Trusted grown-ups listen and help; not the ones who say 'don't tell'.","persona":"any","source":"trusted adults"},
  {"id":"mb-047","cat":"tell-trusted","type":"reflect","hook":"Lensy: telling makes unsafe things stop. Worth doing?","prompt":"What do you think?","options":["Yes","It helps","Always tell"],"affirm":"Yes, telling brings help and makes unsafe things stop.","relearn":"Telling a trusted grown-up brings help.","persona":"any","source":"disclosure"},
  {"id":"mb-048","cat":"tell-trusted","type":"role-play","hook":"A friend tells you something unsafe happened to them.","setup":"Help them. Say:","yourLine":[{"text":"\"Let's tell a trusted grown-up together.\"","best":true},{"text":"\"Keep it a secret.\""}],"relearn":"You can help a friend by telling a trusted grown-up together.","persona":"any","source":"peer support / voice"},

  // — My body is mine —
  {"id":"mb-049","cat":"my-body-mine","type":"strike-rewrite","hook":"\"You must always obey grown-ups, no matter what.\"","myth":{"un":"You must always do what a grown-up says, even if it feels unsafe.","re":"You can say no to anyone, even a grown-up, if a touch feels unsafe.","why":"Your safety comes first."},"relearn":"You can say no to unsafe touch, even from a grown-up.","persona":"any","source":"empowerment"},

  // — Ask first & stop —
  {"id":"mb-050","cat":"consent-stop","type":"branch","hook":"A grown-up asks you to do something with your body that feels wrong.","options":[{"text":"Say no, get away, and tell another trusted grown-up","consequence":"You keep yourself safe and get help.","outcome":"safe","best":true},{"text":"Do it because they're a grown-up","consequence":"You can say no to unsafe things, even to grown-ups."}],"debrief":"Being a grown-up doesn't make an unsafe ask okay.","relearn":"You can refuse an unsafe ask from anyone.","persona":"any","source":"empowerment / safety"},

  // — Safe or unsafe —
  {"id":"mb-051","cat":"safe-unsafe","type":"reflect","hook":"Lensy: your body rules keep you safe. Feeling like the boss?","prompt":"What do you think?","options":["Yes","I'm the boss","Safe and strong"],"affirm":"You know your body rules, that's real safety power.","relearn":"Knowing your body rules keeps you safe and strong.","persona":"any","source":"empowerment"},

  // — Real names —
  {"id":"mb-052","cat":"real-names","type":"branch","hook":"A friend giggles that real body names are 'rude'.","options":[{"text":"Say \"they're just the real names, it's okay\"","consequence":"You both learn names aren't rude.","outcome":"matter-of-fact","best":true},{"text":"Agree they're rude and feel embarrassed","consequence":"Real names are just words, nothing rude."}],"debrief":"Real body names are normal words, not rude.","relearn":"Real body names are normal, not rude.","persona":"any","source":"body normalcy"},

  // — Secret or surprise —
  {"id":"mb-053","cat":"secret-surprise","type":"role-play","hook":"Someone tries to give you a 'secret' about your body.","setup":"Say your safety line:","yourLine":[{"text":"\"I don't keep body secrets. I'm telling.\"","best":true},{"text":"\"Okay, I'll keep it.\""}],"relearn":"You don't keep secrets about your body; you tell.","persona":"any","source":"grooming awareness / voice"},

  // — Tell someone —
  {"id":"mb-054","cat":"tell-trusted","type":"build","hook":"Make a 'how to tell' plan.","prompt":"Order the telling steps.","pieces":["notice the 'uh-oh' feeling","find a trusted grown-up","use clear words","keep telling till someone helps"],"mode":"sequence","key":["notice the 'uh-oh' feeling","find a trusted grown-up","use clear words","keep telling till someone helps"],"relearn":"Notice, find a trusted grown-up, use clear words, keep telling.","persona":"any","source":"disclosure plan"},

  // — My body is mine —
  {"id":"mb-055","cat":"my-body-mine","type":"reflect","hook":"Lensy: PANTS rule, your privates are private. Remember?","prompt":"What's the rule?","options":["Private is private","My body, my rules","Tell if unsure"],"affirm":"Private is private, your body, your rules. You've got it.","relearn":"Your private parts are private; your body, your rules.","persona":"any","source":"PANTS"},

  // — Ask first & stop —
  {"id":"mb-056","cat":"consent-stop","type":"sort","hook":"Sort: an okay touch (with consent), or not okay?","items":[{"id":"a","text":"A hug you both want"},{"id":"b","text":"Forcing a hug"},{"id":"c","text":"A high-five you agreed to"},{"id":"d","text":"Touching when told no"}],"bins":[{"id":"ok","label":"Okay (consent)"},{"id":"no","label":"Not okay"}],"key":{"a":"ok","b":"no","c":"ok","d":"no"},"relearn":"Touch is okay when everyone agrees; not when someone says no.","persona":"any","source":"consent"},

  // — Safe or unsafe —
  {"id":"mb-057","cat":"safe-unsafe","type":"branch","hook":"An older kid wants to play a 'secret touching game'.","options":[{"text":"Say no and tell a trusted grown-up","consequence":"You stay safe; that's never an okay game.","outcome":"safe","best":true},{"text":"Play because they're older","consequence":"A 'secret touching game' is never okay."}],"debrief":"A 'secret touching game' is unsafe, no, and tell.","relearn":"A 'secret touching game' is never okay; tell a grown-up.","persona":"any","source":"grooming awareness"},

  // — Real names —
  {"id":"mb-058","cat":"real-names","type":"reflect","hook":"Lensy: it's okay to ask a grown-up questions about your body. Agree?","prompt":"What do you think?","options":["Yes","No question is silly","I can ask"],"affirm":"Yes, asking a trusted grown-up about your body is smart.","relearn":"You can ask a trusted grown-up questions about your body.","persona":"any","source":"body literacy"},

  // — Tell someone —
  {"id":"mb-059","cat":"tell-trusted","type":"match","hook":"Match the worry to who can help.","pairs":[{"left":"An unsafe touch","right":"A trusted grown-up / Childline 1098"},{"left":"A scary secret","right":"A parent or teacher"},{"left":"An 'uh-oh' feeling","right":"Someone you trust"}],"relearn":"For any body worry, a trusted grown-up (or 1098) can help.","persona":"India","source":"help-seeking"},

  // — My body is mine —
  {"id":"mb-060","cat":"my-body-mine","type":"role-play","hook":"Affirm your body rules out loud.","setup":"Say it strong:","yourLine":[{"text":"\"My body, my rules!\"","best":true},{"text":"Say nothing"}],"relearn":"\"My body, my rules\" is your safety motto.","persona":"any","source":"empowerment / voice"},

  // — Safe or unsafe —
  {"id":"mb-061","cat":"safe-unsafe","type":"sort","hook":"Sort: feels caring (safe), or hurts/scares (unsafe)?","items":[{"id":"a","text":"A goodnight hug you like"},{"id":"b","text":"Being grabbed hard"},{"id":"c","text":"A gentle pat you're okay with"},{"id":"d","text":"A touch that scares you"}],"bins":[{"id":"safe","label":"Safe"},{"id":"unsafe","label":"Unsafe"}],"key":{"a":"safe","b":"unsafe","c":"safe","d":"unsafe"},"relearn":"Safe touch feels caring; unsafe touch hurts or scares.","persona":"any","source":"safe vs unsafe touch"},

  // — Ask first & stop —
  {"id":"mb-062","cat":"consent-stop","type":"reflect","hook":"Lensy: your friends have body rules too. Do you respect theirs?","prompt":"What do you think?","options":["Yes","I ask first","I stop when asked"],"affirm":"Respecting others' body rules makes you a safe, kind friend.","relearn":"Everyone has body rules; respect others' too.","persona":"any","source":"consent / respect"},

  // — Secret or surprise —
  {"id":"mb-063","cat":"secret-surprise","type":"strike-rewrite","hook":"\"If they'll be sad when you tell, you should stay quiet.\"","myth":{"un":"You should stay quiet so the person isn't sad.","re":"Your safety matters more than someone's feelings about being told.","why":"A trusted grown-up will help you both."},"relearn":"Tell about unsafe things even if someone might be upset.","persona":"any","source":"disclosure"},

  // — Tell someone —
  {"id":"mb-064","cat":"tell-trusted","type":"branch","hook":"You feel unsafe somewhere and need help fast.","options":[{"text":"Go toward people and a trusted grown-up","consequence":"You get help quickly.","outcome":"safe","best":true},{"text":"Go off somewhere alone","consequence":"Head toward people and helpers, not away."}],"debrief":"When unsafe, head toward people and trusted grown-ups.","relearn":"If you feel unsafe, go toward people and helpers.","persona":"any","source":"safety"},

  // — My body is mine —
  {"id":"mb-065","cat":"my-body-mine","type":"branch","hook":"Someone keeps trying to hug you after you said no.","options":[{"text":"Say no again, step back, and tell a grown-up","consequence":"Your no counts; a grown-up backs you up.","outcome":"empowered","best":true},{"text":"Give in because they kept asking","consequence":"Your no still counts, even if they keep asking."}],"debrief":"Your no counts, even when someone keeps asking.","relearn":"Your no counts; you can keep saying it and tell a grown-up.","persona":"Aria","source":"body autonomy"},

  // — Real names —
  {"id":"mb-066","cat":"real-names","type":"sort","hook":"Sort: a body fact that's true, or a silly shame-myth?","items":[{"id":"a","text":"Private parts are normal"},{"id":"b","text":"Real names are 'dirty'"},{"id":"c","text":"Knowing names keeps me safe"},{"id":"d","text":"You should be ashamed of your body"}],"bins":[{"id":"true","label":"True"},{"id":"myth","label":"Shame-myth"}],"key":{"a":"true","b":"myth","c":"true","d":"myth"},"relearn":"Your body is normal; shame-myths about it aren't true.","persona":"any","source":"body normalcy"},

  // — Ask first & stop —
  {"id":"mb-067","cat":"consent-stop","type":"role-play","hook":"You're not sure if your friend wants to be picked up in play.","setup":"Check first. Say:","yourLine":[{"text":"\"Do you want me to pick you up?\"","best":true},{"text":"Just grab and lift them"}],"relearn":"Checking first respects your friend's body and choice.","persona":"any","source":"consent / voice"},

  // — Secret or surprise —
  {"id":"mb-068","cat":"secret-surprise","type":"reflect","hook":"Lensy: happy surprises end with a smile; unsafe secrets you tell. Got it?","prompt":"What do you think?","options":["Yes","Surprises smile, secrets tell","Got it"],"affirm":"Surprises end happily; unsafe secrets always get told.","relearn":"Surprises end happily; unsafe secrets you always tell.","persona":"any","source":"secrets vs surprises"},

  // — Tell someone —
  {"id":"mb-069","cat":"tell-trusted","type":"role-play","hook":"Practise telling, with Lensy as your trusted grown-up.","setup":"Try the words:","yourLine":[{"text":"\"Something unsafe happened and I need help.\"","best":true},{"text":"\"Never mind, forget it.\""}],"relearn":"Practising the words makes telling easier when it's real.","persona":"any","source":"disclosure / voice"},

  // — Safe or unsafe —
  {"id":"mb-070","cat":"safe-unsafe","type":"strike-rewrite","hook":"\"Only strangers give unsafe touches.\"","myth":{"un":"Only strangers give unsafe touches.","re":"Most unsafe touches come from someone known; the rule is the same, tell.","why":"What matters is the touch, not who it's from."},"relearn":"Unsafe touch can come from anyone; tell a trusted grown-up.","persona":"educator","source":"safeguarding"},

  // — My body is mine —
  {"id":"mb-071","cat":"my-body-mine","type":"reflect","hook":"Lensy: you get to decide who touches you and how. Feel that power?","prompt":"What do you think?","options":["Yes","It's my choice","I decide"],"affirm":"You decide who touches you and how. That's your right.","relearn":"You decide who touches you and how.","persona":"any","source":"body autonomy"},

  // — Ask first & stop —
  {"id":"mb-072","cat":"consent-stop","type":"branch","hook":"You and a friend disagree about a game; they say 'I don't want to'.","options":[{"text":"Respect their no and find another game","consequence":"You both stay happy and friends.","outcome":"respectful","best":true},{"text":"Make them play anyway","consequence":"Respecting their no keeps the friendship safe."}],"debrief":"Respecting a no, big or small, is how kind friends play.","relearn":"Respecting a friend's no keeps play safe and kind.","persona":"any","source":"consent"},

  // — Secret or surprise —
  {"id":"mb-073","cat":"secret-surprise","type":"sort","hook":"Sort: tell a trusted grown-up, or fine to keep?","items":[{"id":"a","text":"\"Don't tell, I touched you\""},{"id":"b","text":"Grandma's surprise visit (told soon)"},{"id":"c","text":"\"This hurts but keep it secret\""},{"id":"d","text":"A secret handshake with a friend"}],"bins":[{"id":"tell","label":"Tell a grown-up"},{"id":"keep","label":"Fine to keep"}],"key":{"a":"tell","b":"keep","c":"tell","d":"keep"},"relearn":"Fun, harmless secrets are fine; unsafe or hurting ones, tell.","persona":"any","source":"secrets vs surprises"},

  // — Tell someone —
  {"id":"mb-074","cat":"tell-trusted","type":"reflect","hook":"Lensy: you have a team of grown-ups to help. How does that feel?","prompt":"Pick one.","options":["Safe","Not alone","Strong"],"affirm":"You're never alone, your trusted grown-ups are your team.","relearn":"You have a team of trusted grown-ups; you're not alone.","persona":"any","source":"trusted adults"},

  // — Safe or unsafe —
  {"id":"mb-075","cat":"safe-unsafe","type":"role-play","hook":"You want to remember what to do about unsafe touch.","setup":"Say the three steps:","yourLine":[{"text":"\"No, go, tell!\"","best":true},{"text":"\"Stay quiet.\""}],"relearn":"No, go, tell, say no, get away, tell a trusted grown-up.","persona":"any","source":"No-Go-Tell / voice"},

  // — Real names —
  {"id":"mb-076","cat":"real-names","type":"match","hook":"Match: who decides about your body, and when.","pairs":[{"left":"You","right":"Always, it's yours"},{"left":"Parent/doctor","right":"To keep you healthy & clean"},{"left":"Anyone else","right":"Never without your okay"}],"relearn":"You decide about your body; grown-ups only help keep you healthy.","persona":"any","source":"body autonomy / exceptions"},

  // — My body is mine —
  {"id":"mb-077","cat":"my-body-mine","type":"branch","hook":"Capstone: someone you don't want to is trying to touch you.","options":[{"text":"Say 'no!', move away, and tell a trusted grown-up","consequence":"You used all your body-rules powers, safe!","outcome":"safe","best":true},{"text":"Do nothing","consequence":"You can always say no, go, and tell."}],"debrief":"No, go, tell, your body-rules superpower, and it's never your fault.","relearn":"No, go, tell keeps you safe, and it's never your fault.","persona":"any","source":"consolidation"},

  // — Ask first & stop —
  {"id":"mb-078","cat":"consent-stop","type":"reflect","hook":"Lensy: 'ask first, stop means stop', will you use it?","prompt":"What do you think?","options":["Yes","Always","With everyone"],"affirm":"Asking first and stopping when asked makes you safe and kind.","relearn":"Ask first; stop means stop, with everyone.","persona":"any","source":"consent"},

  // — Secret or surprise —
  {"id":"mb-079","cat":"secret-surprise","type":"role-play","hook":"A friend asks you to keep an unsafe secret.","setup":"Be a safe friend. Say:","yourLine":[{"text":"\"I care about you, so I'm going to tell a grown-up.\"","best":true},{"text":"\"Okay, our secret.\""}],"relearn":"A real friend tells a grown-up to keep you both safe.","persona":"any","source":"peer support / voice"},

  // — Tell someone —
  {"id":"mb-080","cat":"tell-trusted","type":"branch","hook":"You're worried no grown-up will believe you.","options":[{"text":"Tell anyway, and keep telling till someone listens","consequence":"A trusted grown-up will listen and help.","outcome":"safe","best":true},{"text":"Stay silent","consequence":"Keep telling, someone will believe and help you."}],"debrief":"Keep telling trusted grown-ups; you deserve to be heard.","relearn":"Keep telling until a trusted grown-up listens and helps.","persona":"any","source":"keep telling"},

  // — My body is mine —
  {"id":"mb-081","cat":"my-body-mine","type":"reflect","hook":"Lensy: what's your big body-rules motto?","prompt":"Pick one to carry.","options":["My body, my rules","No, go, tell","Private is private","I can always tell"],"affirm":"Carry that everywhere. You know how to keep your body safe.","relearn":"My body, my rules; safe vs unsafe; no, go, tell; always tell.","persona":"any","source":"consolidation"},

  // — Tell someone —
  {"id":"mb-082","cat":"tell-trusted","type":"reflect","hook":"Lensy: who is one trusted grown-up you'd tell?","prompt":"Picture them.","options":["A parent","A grandparent","A teacher","Someone I trust"],"affirm":"Keep them in mind, they're on your safety team (and 1098 too).","relearn":"Know your trusted grown-ups before you ever need them.","persona":"any","source":"trusted adults"},

  // — Safe or unsafe —
  {"id":"mb-083","cat":"safe-unsafe","type":"reflect","hook":"Lensy: if something feels unsafe, it's never your fault. Remember that?","prompt":"What do you think?","options":["Yes","Never my fault","I'll remember"],"affirm":"It is never your fault, and telling always helps.","relearn":"Unsafe things are never the child's fault.","persona":"any","source":"non-blame"},

  // — Real names —
  {"id":"mb-084","cat":"real-names","type":"role-play","hook":"Greet your amazing, all-yours body.","setup":"Say it proud:","yourLine":[{"text":"\"This is my body, and I'm the boss of it!\"","best":true},{"text":"Say nothing"}],"relearn":"Your body is yours; knowing and owning it keeps you safe.","persona":"any","source":"empowerment / voice"},
];

export const MY_BODY: V2GameConfig = {
  gameId: "my-body",
  title: "My Body, My Rules",
  greet: "Your body is amazing — and it's all yours! Let's learn to keep it safe. 💛",
  scenarios: SCENARIOS,
  categories: [
  { id: "my-body-mine", emoji: "🙋", label: "My body is mine" },
  { id: "real-names", emoji: "🏷️", label: "Real names" },
  { id: "safe-unsafe", emoji: "🤚", label: "Safe or unsafe" },
  { id: "consent-stop", emoji: "✋", label: "Ask first & stop" },
  { id: "secret-surprise", emoji: "🎁", label: "Secret or surprise" },
  { id: "tell-trusted", emoji: "💛", label: "Tell someone" },
  ],
  badge: {
    title: "My Body, My Rules! 🛡️",
    blurb: "My body is mine, safe or unsafe is the rule, I can say no and tell, and it's never my fault. 🛡️",
  },
  helpLine: "Childline 1098 — a free helpline for children in India, any time. A grown-up can help you call.",
  helpLabel: "Get help — Childline 1098",
  reassureCats: ["safe-unsafe", "secret-surprise", "tell-trusted"],
  reassure: "It's never your fault. Telling a trusted grown-up helps. 💛",
};

// Back-compat exports — Safety Squad (Ch.2) reuses this game's trusted-adult network. Keep these stable.
export type Trusted = { id: string; name: string; emoji: string };
export const TRUSTED: Trusted[] = [
  { id: "mum", name: "Mum", emoji: "👩" },
  { id: "dad", name: "Dad", emoji: "👨" },
  { id: "grandma", name: "Grandma", emoji: "👵" },
  { id: "grandpa", name: "Grandpa", emoji: "👴" },
  { id: "teacher", name: "Teacher", emoji: "🧑‍🏫" },
  { id: "aunt", name: "Aunty", emoji: "👩‍🦰" },
  { id: "doctor", name: "Doctor", emoji: "🧑‍⚕️" },
  { id: "sibling", name: "Big sis/bro", emoji: "🧑" },
];
export const NET_TARGET = 3;
export const HELPLINE = "Childline 1098 — a free helpline for children in India, any time. A grown-up can help you call.";
export const TELL_RULE = "If one grown-up can't help, tell another — and keep telling until someone does.";
