---
type: audit
owner: the-equal-lens
title: "Confidentiality sweep of the under-18 games (2026-10-02)"
description: Line-by-line record for SWED-80 and SWED-122 of every player-facing line in the under-18 games that says confidential, private or secret, after the fixes, with a verdict and a reason for each.
tags: [swipeed, audit, safeguarding, pocso, confidentiality, chapter-5]
timestamp: 2026-10-02T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5656f62f-d7dc-4f60-bdef-0e52c8a67b6b  # SWED-80
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/0c1b8795-8d5d-4208-92d0-e1365dd590bc  # SWED-122
---

# Confidentiality sweep: My Choices and Status: Know It

Follow-up to finding A2 of the [question bank audit](question-bank-audit-2026-09-14.md) ([SWED-80](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5656f62f-d7dc-4f60-bdef-0e52c8a67b6b)). Chapter 5 players are 15 to 18. Under POCSO, any sexual activity involving someone under 18 is an offence, and anyone who learns of it, a clinician included, must report it to the police or the Special Juvenile Police Unit (ss.19 to 21). The report goes to the police, not the family. So "clinics tell your family" is a myth, but "mandatory reporting is a myth" was false.

## What changed

- **The limit is taught.** `mc-945` no longer calls mandatory reporting a myth. `mc-956` and `sk-1083` (relearns) now state it: clinics don't tell your family, but if a clinician learns that someone under 18 is having sex or being abused, the law says they must tell the police. The "ask what stays private" role-plays (`mc-050`, `mc-904`, `mc-921`, `mc-1263`, `mc-1416`) say a clinician will explain, including the one legal limit.
- **Promises reworded.** `mc-931` ("it stays private"), `mc-1320` ("what you tell a clinician stays private"), `mc-1375` ("confidentially, whoever you are"), `sk-1378` ("care is fully confidential", now "your HIV status is protected by law") and `sk-1315` ("no matter what").
- **Plan It and My Body.** `pl-1106`, `pl-1125`, `pl-1129` (ages 12 to 15) and `mb-1393` (ages 3 to 6) no longer promise confidentiality. Other under-18 games with the same wording are tracked in [SWED-122](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/0c1b8795-8d5d-4208-92d0-e1365dd590bc).
- **Game strings.** Both `helpLine` strings and the My Choices badge blurb no longer promise confidentiality. Capstone 5's status line says the result is protected by law.

## Every remaining line

369 player-facing lines (internal `source` notes left out). Counts: service 124, testing 88, rewritten 33, hiv-status 32, asking 31, secrecy-flag 22, peer 22, setting 14, photos 3.

| Verdict | Why it stands |
|---|---|
| rewritten | Rewritten in SWED-80. |
| service | Names a service's confidentiality policy (AFHC, RKSK, clinics, counselling, helplines); accurate. The legal limit is now taught in mc-945, mc-956, the 'ask what stays private' role-plays, sk-1083 and both helpLines. |
| testing | HIV and STI testing: results are confidential under the HIV and AIDS (Prevention and Control) Act 2017, or the line describes the test itself. |
| hiv-status | Someone's HIV status is theirs to share; disclosure needs consent under the HIV and AIDS Act 2017. |
| peer | About respecting another person's private health information, not a promise from a service. |
| asking | The player asks what stays private, which is the behaviour the game teaches. |
| secrecy-flag | Teaches 'keep it secret' as a grooming or coercion red flag. |
| setting | A private setting or a personal choice (a calm talk, deciding who to tell), not a confidentiality promise. |
| photos | Image-based abuse: threats to share private photos are named as harm. |

| Game | Scenario | Field | Text | Verdict |
|---|---|---|---|---|
| my-choices | `mc-046` | `.hook` | You want contraception but worry it won't be private. | service |
| my-choices | `mc-046` | `.options[0].text` | Use an Adolescent Friendly Health Clinic / doctor, confidentiality is part of the service | testing |
| my-choices | `mc-046` | `.options[0].consequence` | You get private, professional care. | service |
| my-choices | `mc-046` | `.options[0].outcome` | confidential | service |
| my-choices | `mc-046` | `.options[1].consequence` | AFHCs and doctors offer confidential services; you can ask privately. | asking |
| my-choices | `mc-046` | `.debrief` | Confidential services exist; privacy is part of good care. | testing |
| my-choices | `mc-046` | `.relearn` | AFHCs / doctors offer confidential contraceptive services. | service |
| my-choices | `mc-047` | `.pairs[0].left` | Confidential adolescent SRH care | service |
| my-choices | `mc-048` | `.pairs[1].left` | To private care | service |
| my-choices | `mc-048` | `.pairs[1].right` | Confidentiality | service |
| my-choices | `mc-049` | `.yourLine[0].text` | "I'd like to talk about contraception options, privately. Can you help me?" | asking |
| my-choices | `mc-050` | `.hook` | You want to ask whether your visit stays confidential. | rewritten |
| my-choices | `mc-050` | `.yourLine[0].text` | "Is what we discuss here kept confidential?" | rewritten |
| my-choices | `mc-050` | `.relearn` | You can ask up front what stays private; they'll explain, including the one legal limit. | rewritten |
| my-choices | `mc-051` | `.yourLine[0].text` | "There are adolescent-friendly clinics for this, confidential, and a doctor can help too." | service |
| my-choices | `mc-051` | `.relearn` | Knowing services exist lets you guide a friend to confidential help. | service |
| my-choices | `mc-054` | `.myth.re` | Adolescent-friendly services offer confidential information and counselling. | service |
| my-choices | `mc-054` | `.myth.why` | Confidentiality is a core part of these services. | testing |
| my-choices | `mc-054` | `.relearn` | Confidential adolescent services exist; you can seek information privately. | service |
| my-choices | `mc-057` | `.items[0].text` | Confidential care | service |
| my-choices | `mc-057` | `.relearn` | Confidential care, free choice, accurate info and your own pace are rights; coercion and shaming are violations. | service |
| my-choices | `mc-066` | `.options[0].text` | Pick a calm, private moment and start simply and honestly | testing |
| my-choices | `mc-066` | `.options[1].consequence` | A calm, private, simple opener makes the talk doable. | setting |
| my-choices | `mc-066` | `.relearn` | Start the talk simply, in a calm private moment. | testing |
| my-choices | `mc-900` | `.options[0].text` | Ask at an Adolescent-Friendly Clinic, where confidentiality is part of the service | testing |
| my-choices | `mc-900` | `.options[0].consequence` | You get private, professional information. | service |
| my-choices | `mc-900` | `.options[0].outcome` | private | service |
| my-choices | `mc-900` | `.options[1].consequence` | AFHCs are built to be confidential; forums mislead. | service |
| my-choices | `mc-900` | `.debrief` | Adolescent-friendly clinics are designed to be private; that's their point. | service |
| my-choices | `mc-900` | `.relearn` | AFHC / Ujala clinics give confidential info; staff won't tell your family. | service |
| my-choices | `mc-903` | `.options[0].text` | Go in and say you'd like to ask about your options privately | asking |
| my-choices | `mc-904` | `.hook` | You're not sure whether the clinic keeps your visit confidential. | rewritten |
| my-choices | `mc-904` | `.options[0].text` | Ask directly whether what you share stays private | rewritten |
| my-choices | `mc-904` | `.options[1].consequence` | You're allowed to ask about confidentiality before you share. | rewritten |
| my-choices | `mc-904` | `.relearn` | Ask up front what stays private; a clinician will explain it, including the one legal limit. | rewritten |
| my-choices | `mc-905` | `.hook` | A friend confides that an adult is coercing them and begs you to keep it secret. | secrecy-flag |
| my-choices | `mc-905` | `.options[0].consequence` | Your friend gets real protection, not just a kept secret. | secrecy-flag |
| my-choices | `mc-905` | `.debrief` | Some secrets are too heavy to hold alone; safeguarding help protects your friend. | secrecy-flag |
| my-choices | `mc-906` | `.options[0].text` | Visit an adolescent-friendly service, which provides it confidentially | service |
| my-choices | `mc-906` | `.debrief` | Information is your right; adolescent services give it confidentially. | service |
| my-choices | `mc-909` | `.options[0].text` | Point out that confidentiality is part of the service and go anyway | testing |
| my-choices | `mc-909` | `.options[0].consequence` | You both get accurate, private guidance. | service |
| my-choices | `mc-909` | `.options[1].consequence` | Confidentiality is built into these services; rumours mislead. | service |
| my-choices | `mc-909` | `.debrief` | Fear of gossip shouldn't cost you private, accurate care. | service |
| my-choices | `mc-909` | `.relearn` | Confidentiality is built into adolescent services; don't let rumour block care. | service |
| my-choices | `mc-911` | `.options[0].text` | Choose the AFHC / Ujala clinic for accurate, confidential guidance | service |
| my-choices | `mc-911` | `.options[1].consequence` | Trained services give accurate, private answers; gossip doesn't. | service |
| my-choices | `mc-911` | `.debrief` | For real answers, go to the trained, confidential service, not the rumour mill. | service |
| my-choices | `mc-911` | `.relearn` | For accurate, private guidance, choose a clinic over hostel rumour. | service |
| my-choices | `mc-912` | `.pairs[0].left` | Confidential adolescent SRH guidance | service |
| my-choices | `mc-913` | `.pairs[1].left` | To private care | service |
| my-choices | `mc-913` | `.pairs[1].right` | Confidentiality of the service | service |
| my-choices | `mc-914` | `.pairs[0].left` | "Is this kept confidential?" | asking |
| my-choices | `mc-916` | `.pairs[1].right` | The service is confidential | service |
| my-choices | `mc-917` | `.pairs[2].right` | Confidential SRH counselling | service |
| my-choices | `mc-918` | `.pairs[0].left` | Right to confidential care | service |
| my-choices | `mc-919` | `.pairs[1].left` | "Does this stay private?" | asking |
| my-choices | `mc-920` | `.yourLine[0].text` | "I'd like to talk about my contraception options, privately. Can you help?" | asking |
| my-choices | `mc-921` | `.hook` | You want to confirm the visit is confidential before you open up. | rewritten |
| my-choices | `mc-921` | `.yourLine[0].text` | "Before we start, is everything I share here kept confidential?" | rewritten |
| my-choices | `mc-921` | `.yourLine[1].text` | Stay quiet and just hope it stays private | rewritten |
| my-choices | `mc-921` | `.relearn` | Ask what stays private before you share; they'll explain, including the one legal limit. | rewritten |
| my-choices | `mc-922` | `.hook` | A friend doesn't know confidential services exist. Point them the right way. | service |
| my-choices | `mc-922` | `.yourLine[0].text` | "There are adolescent-friendly clinics for this, confidential, and a doctor can help too." | service |
| my-choices | `mc-922` | `.relearn` | Knowing services exist lets you guide a friend to confidential help. | service |
| my-choices | `mc-931` | `.yourLine[0].text` | "I'll come with you. They do this every day, and they'll explain what stays private." | rewritten |
| my-choices | `mc-932` | `.myth.re` | Adolescent-friendly services offer confidential information and counselling. | service |
| my-choices | `mc-932` | `.myth.why` | Confidentiality is a core part of how these services work. | testing |
| my-choices | `mc-932` | `.relearn` | Confidential adolescent services exist; you can seek information privately. | service |
| my-choices | `mc-933` | `.myth.re` | Confidentiality is part of adolescent-friendly care; you can ask how it works. | testing |
| my-choices | `mc-933` | `.relearn` | Adolescent care is confidential; you can ask how your privacy is handled. | service |
| my-choices | `mc-938` | `.hook` | "Confidential teen clinics are made up; no such thing exists in India." | service |
| my-choices | `mc-938` | `.myth.un` | Confidential adolescent clinics don't really exist in India. | service |
| my-choices | `mc-938` | `.myth.re` | Adolescent-Friendly Health Clinics (Ujala) offer confidential SRH care. | service |
| my-choices | `mc-938` | `.relearn` | AFHC / Ujala clinics are real and confidential SRH services in India. | service |
| my-choices | `mc-941` | `.items[0].text` | Confidential care | service |
| my-choices | `mc-941` | `.relearn` | Confidential care, free choice, accurate info and your own pace are rights; coercion and shaming aren't. | service |
| my-choices | `mc-942` | `.items[3].text` | Confidential counselling | service |
| my-choices | `mc-943` | `.hook` | Sort: respects your confidentiality, or breaks it? | asking |
| my-choices | `mc-943` | `.items[3].text` | A counsellor keeping your session private | service |
| my-choices | `mc-943` | `.relearn` | Asking first, explaining privacy and keeping sessions private respect you; gossip and exposure don't. | asking |
| my-choices | `mc-944` | `.items[1].text` | An adult pushing you to keep a secret | secrecy-flag |
| my-choices | `mc-944` | `.items[4].text` | A counsellor offering confidential help | service |
| my-choices | `mc-945` | `.items[2].text` | Adolescent services are confidential | rewritten |
| my-choices | `mc-945` | `.relearn` | Asking freely, private care and routine checks are real; 'clinics tell your family' and 'too young to ask' are myths. | rewritten |
| my-choices | `mc-946` | `.items[2].text` | Confidential SRH counselling | service |
| my-choices | `mc-947` | `.items[0].text` | A service that promises confidentiality | service |
| my-choices | `mc-947` | `.relearn` | Confidentiality and plain answers open the door; mockery and rumour slam it shut. | service |
| my-choices | `mc-949` | `.options[0]` | Clinics are confidential | service |
| my-choices | `mc-949` | `.relearn` | Confidentiality, no-permission info, safeguarding and routine care are all yours. | service |
| my-choices | `mc-951` | `.hook` | Lensy: how does it feel to know confidentiality is part of the service? | testing |
| my-choices | `mc-951` | `.relearn` | Confidentiality is built into adolescent services; you can also confirm it. | service |
| my-choices | `mc-954` | `.options[0]` | Clear confidentiality | service |
| my-choices | `mc-954` | `.relearn` | You can expect confidentiality, no judgement, plain answers and time to ask. | service |
| my-choices | `mc-955` | `.scene[0].text` | "The clinic is free and keeps it private." | service |
| my-choices | `mc-955` | `.scene[1].text` | "Don't tell anyone we talked, keep it our secret." | secrecy-flag |
| my-choices | `mc-955` | `.why` | Demanding secrecy and money up front are the red flags; real services are private and don't work like that. | service |
| my-choices | `mc-955` | `.relearn` | Secrecy-pushing and pay-first 'pills' are red flags; real help is open and confidential. | service |
| my-choices | `mc-956` | `.scene[2].text` | Adolescent services are confidential. | rewritten |
| my-choices | `mc-958` | `.scene[0].text` | Adolescent clinics offer confidential counselling. | service |
| my-choices | `mc-961` | `.scene[2].text` | "A counsellor keeps it confidential." | service |
| my-choices | `mc-962` | `.hook` | Spot the two replies that aren't real confidentiality. | service |
| my-choices | `mc-962` | `.why` | Telling your cousin and posting your case break confidentiality; the others honour it. | testing |
| my-choices | `mc-962` | `.relearn` | Spot the privacy breaks: passing it to relatives or posting it isn't confidential. | testing |
| my-choices | `mc-1010` | `.relearn` | You can decide privately; you don't owe everyone an explanation. | setting |
| my-choices | `mc-1010` | `.options[0].text` | Keep your choice private; you decide who, if anyone, to tell | setting |
| my-choices | `mc-1010` | `.options[0].outcome` | private | setting |
| my-choices | `mc-1010` | `.debrief` | You can decide privately; no one is owed your reproductive plans. | setting |
| my-choices | `mc-1042` | `.scene[0].text` | A doctor offering confidential advice | service |
| my-choices | `mc-1042` | `.scene[1].text` | An older adult saying 'keep this our secret' | secrecy-flag |
| my-choices | `mc-1050` | `.items[2].text` | Asking a doctor confidentially | asking |
| my-choices | `mc-1068` | `.yourLine[1].text` | Keep it secret and handle it alone | secrecy-flag |
| my-choices | `mc-1072` | `.pairs[1].left` | To private care | service |
| my-choices | `mc-1072` | `.pairs[1].right` | Confidentiality | service |
| my-choices | `mc-1074` | `.pairs[0].left` | Confidential adolescent care | service |
| my-choices | `mc-1123` | `.items[0].text` | Asking a clinic about your options privately | asking |
| my-choices | `mc-1134` | `.options[2].text` | Keep it secret and decide alone | secrecy-flag |
| my-choices | `mc-1157` | `.scene[2].text` | "Ask the clinic privately whenever you like" | asking |
| my-choices | `mc-1158` | `.scene[1].text` | "You're mature, so marry me and keep it secret" | secrecy-flag |
| my-choices | `mc-1158` | `.scene[2].text` | "A clinic can answer your questions privately" | testing |
| my-choices | `mc-1158` | `.why` | 'Keep it secret' and 'don't tell anyone' isolate you: red flags to step back from. | secrecy-flag |
| my-choices | `mc-1210` | `.scene[1].text` | "A clinic can answer that confidentially" | service |
| my-choices | `mc-1244` | `.hook` | An older person you barely know pushes a relationship and says to keep it secret. What do you do? | secrecy-flag |
| my-choices | `mc-1244` | `.relearn` | Older-person pressure plus 'keep it secret' is a flag; step back and tell someone. | secrecy-flag |
| my-choices | `mc-1263` | `.hook` | You want to check that what you tell the clinic stays private. | rewritten |
| my-choices | `mc-1263` | `.yourLine[0].text` | "Before we start, is what I share here kept confidential?" | rewritten |
| my-choices | `mc-1263` | `.relearn` | It's your right to ask plainly what stays private before you share. | rewritten |
| my-choices | `mc-1273` | `.yourLine[0].text` | "Is this confidential between us? I'd like to ask freely." | asking |
| my-choices | `mc-1273` | `.relearn` | Adolescent-friendly services are confidential; you can ask about that upfront. | service |
| my-choices | `mc-1285` | `.yourLine[0].text` | "Can we talk in person, somewhere private? This matters more than texting." | asking |
| my-choices | `mc-1285` | `.relearn` | A calm, private, face-to-face moment beats a tense text thread. | setting |
| my-choices | `mc-1289` | `.options[0].consequence` | You get confidential, judgment-free answers. | service |
| my-choices | `mc-1289` | `.options[1].consequence` | You don't need permission; these services give info confidentially. | service |
| my-choices | `mc-1289` | `.debrief` | You can ask for contraception information confidentially, no permission needed. | asking |
| my-choices | `mc-1289` | `.relearn` | You can ask a clinician for information, confidentially. | asking |
| my-choices | `mc-1293` | `.options[0].consequence` | You reach the right, confidential service. | service |
| my-choices | `mc-1293` | `.options[1].consequence` | A clinic or AFHC gives accurate, confidential guidance; group chats don't. | service |
| my-choices | `mc-1298` | `.options[0].text` | Ask the staff if you can speak privately for your questions | testing |
| my-choices | `mc-1298` | `.options[0].outcome` | private | setting |
| my-choices | `mc-1298` | `.options[1].consequence` | You can ask for a private word; clinics expect that. | asking |
| my-choices | `mc-1298` | `.debrief` | You can request a private space to ask your real questions. | testing |
| my-choices | `mc-1298` | `.relearn` | Ask staff for a private word so you can speak freely at a clinic. | asking |
| my-choices | `mc-1300` | `.options[0].text` | Ask for a calm, private moment just the two of you | asking |
| my-choices | `mc-1300` | `.options[0].outcome` | private | setting |
| my-choices | `mc-1300` | `.options[1].consequence` | A private, calm moment is where this conversation works best. | setting |
| my-choices | `mc-1300` | `.debrief` | Start this talk in a calm, private moment, simply and honestly. | testing |
| my-choices | `mc-1300` | `.relearn` | Pick a calm, private moment to start the conversation. | testing |
| my-choices | `mc-1304` | `.scene[1].text` | Asks if the visit is confidential | asking |
| my-choices | `mc-1309` | `.scene[1].text` | "You can ask a clinic anything, privately." | asking |
| my-choices | `mc-1309` | `.relearn` | Pressuring you into total secrecy is a flag; seeking confidential help is your right. | service |
| my-choices | `mc-1310` | `.scene[0].text` | Older person: "Keep us secret from your family." | secrecy-flag |
| my-choices | `mc-1317` | `.hook` | Lensy: knowing you can walk into a clinic and ask, confidentially, is a quiet kind of power. Feel it? | asking |
| my-choices | `mc-1317` | `.relearn` | Knowing you can ask a clinic confidentially is real, usable power. | asking |
| my-choices | `mc-1320` | `.hook` | "A clinician won't keep what I tell them private." | rewritten |
| my-choices | `mc-1320` | `.myth.re` | Consultations are confidential; what you share stays between you and the clinician. | rewritten |
| my-choices | `mc-1320` | `.myth.why` | Confidentiality is part of how the care is meant to work. | rewritten |
| my-choices | `mc-1320` | `.relearn` | Asking a clinician about contraception stays private from your family; they'll explain the one legal limit. | rewritten |
| my-choices | `mc-1328` | `.items[2].text` | "Is this kept confidential?" | asking |
| my-choices | `mc-1336` | `.pairs[0].left` | "Is my visit private?" | asking |
| my-choices | `mc-1339` | `.pairs[4].left` | Unsure it's confidential | service |
| my-choices | `mc-1339` | `.pairs[4].right` | "Is what I share kept private?" | asking |
| my-choices | `mc-1341` | `.pairs[0].left` | Confidential SRH counselling | service |
| my-choices | `mc-1370` | `.pairs[4].left` | Confidential SRH counselling | service |
| my-choices | `mc-1370` | `.relearn` | Pharmacy for condoms/EC; doctor or AFHC (Ujala) clinic for fitted methods, prescriptions and confidential counselling. | service |
| my-choices | `mc-1375` | `.pairs[1].left` | 'Is this kept private?' | rewritten |
| my-choices | `mc-1375` | `.pairs[1].right` | Yes, confidentiality is part of the service | rewritten |
| my-choices | `mc-1375` | `.relearn` | Asking a clinician is routine care. They inform and help in private, whoever you are, and explain any limits. | rewritten |
| my-choices | `mc-1381` | `.myth.re` | Condoms and the EC pill are sold at any pharmacy, and AFHC (Ujala) clinics give confidential information to young people. | service |
| my-choices | `mc-1381` | `.relearn` | A pharmacy sells condoms/EC to anyone; AFHC clinics inform young people confidentially. | service |
| my-choices | `mc-1406` | `.scene[1].text` | "AFHC clinics keep your visit confidential" | service |
| my-choices | `mc-1406` | `.relearn` | Anyone can buy condoms; methods are reversible and AFHC care is confidential. | service |
| my-choices | `mc-1416` | `.yourLine[0].text` | "Before we start, is what we discuss here kept confidential?" | rewritten |
| my-choices | `mc-1416` | `.relearn` | It's your right to ask what stays private; they won't tell your family, and they'll explain the one legal limit. | rewritten |
| my-choices | `mc-1420` | `.options[0].consequence` | Real routes, accurate options, confidential help. | service |
| my-choices | `mc-1420` | `.relearn` | AFHC (Ujala) clinics give young people confidential method advice. | service |
| my-choices | `(game strings)` | `blurb` | blurb: "You know contraception and planning, can decide by your values with no pressure, and know your rights, where to find care and what s | rewritten |
| my-choices | `(game strings)` | `helpLine` | helpLine: "A doctor or Adolescent-Friendly Health Clinic can answer questions and explain what stays private. If anyone pressures or exploit | rewritten |
| status-know-it | `sk-004` | `.myth.why` | They're a valid, private way to know your status. | hiv-status |
| status-know-it | `sk-006` | `.items[2].text` | Testing can be free and confidential | testing |
| status-know-it | `sk-006` | `.relearn` | Windows, free confidential care and valid self-tests are true; 'one forever', symptom-only and 'tell by looking' are myths. | testing |
| status-know-it | `sk-008` | `.hook` | You want to test but worry it won't be private. | testing |
| status-know-it | `sk-008` | `.options[0].text` | Use a confidential service like a NACO ICTC centre | testing |
| status-know-it | `sk-008` | `.options[0].consequence` | You test privately and free of charge. | testing |
| status-know-it | `sk-008` | `.options[0].outcome` | confidential | service |
| status-know-it | `sk-008` | `.options[1].consequence` | ICTC testing is free and confidential; privacy is built in. | testing |
| status-know-it | `sk-008` | `.debrief` | Free, confidential testing exists; privacy is part of the service. | testing |
| status-know-it | `sk-008` | `.relearn` | NACO ICTC offers free, confidential testing. | testing |
| status-know-it | `sk-011` | `.options[0]` | Knowing it's confidential | service |
| status-know-it | `sk-011` | `.affirm` | Confidential, free and routine, that's exactly what good services offer. | service |
| status-know-it | `sk-011` | `.relearn` | Testing is confidential, free and routine, which makes it doable. | testing |
| status-know-it | `sk-012` | `.pairs[1].right` | Free, confidential testing | testing |
| status-know-it | `sk-012` | `.pairs[3].right` | A private check you do at home | testing |
| status-know-it | `sk-016` | `.items[2].text` | Confidential clinics | service |
| status-know-it | `sk-016` | `.relearn` | Routine testing, confidential clinics and self-tests help; 'looks healthy', shame and 'once is enough' block you. | testing |
| status-know-it | `sk-062` | `.myth.re` | Someone's health status is private; sharing it without consent is harmful and wrong. | hiv-status |
| status-know-it | `sk-062` | `.myth.why` | Confidentiality is part of dignity. | testing |
| status-know-it | `sk-062` | `.relearn` | A person's status is private; never gossip about it. | hiv-status |
| status-know-it | `sk-065` | `.items[0].text` | Keeping a status private | hiv-status |
| status-know-it | `sk-068` | `.yourLine[0].text` | "That's someone's private health, and it's not a joke. Let's drop it." | peer |
| status-know-it | `sk-068` | `.relearn` | Name it: someone's health is private and not a joke. | peer |
| status-know-it | `sk-074` | `.options[0].consequence` | You reach free, confidential, real services. | service |
| status-know-it | `sk-074` | `.options[1].consequence` | ICTC centres, RKSK clinics and doctors are all real, confidential options. | testing |
| status-know-it | `sk-074` | `.debrief` | Real, confidential services exist; knowing them makes care reachable. | service |
| status-know-it | `sk-076` | `.pairs[0].left` | Free, confidential HIV test | testing |
| status-know-it | `sk-905` | `.myth.re` | Their status is private; sharing it without consent isn't 'informing', it's breaking trust. | hiv-status |
| status-know-it | `sk-905` | `.myth.why` | Confidentiality is part of dignity; it's theirs to share, not yours. | testing |
| status-know-it | `sk-909` | `.myth.re` | Your result is confidential; an ICTC counsellor protects your privacy, it's not shared on demand. | hiv-status |
| status-know-it | `sk-909` | `.myth.why` | Confidentiality is built into the service so people feel safe to test. | testing |
| status-know-it | `sk-909` | `.relearn` | Your result is confidential; the service protects your privacy. | hiv-status |
| status-know-it | `sk-913` | `.myth.re` | They trusted you with something private; staying a steady, normal friend is exactly what dignity looks like. | peer |
| status-know-it | `sk-916` | `.myth.re` | Their status is private and not your business; working together carries no everyday risk. | hiv-status |
| status-know-it | `sk-916` | `.myth.why` | Demanding private health info is intrusive and based on myth. | service |
| status-know-it | `sk-916` | `.relearn` | A colleague's status is private and not needed to work together. | hiv-status |
| status-know-it | `sk-935` | `.hook` | Sort: keeps it private, or breaks confidentiality? | asking |
| status-know-it | `sk-935` | `.bins[0].id` | private | peer |
| status-know-it | `sk-935` | `.bins[0].label` | Keeps it private | peer |
| status-know-it | `sk-935` | `.bins[1].label` | Breaks confidentiality | peer |
| status-know-it | `sk-935` | `.key.a` | private | peer |
| status-know-it | `sk-935` | `.key.c` | private | peer |
| status-know-it | `sk-935` | `.key.e` | private | peer |
| status-know-it | `sk-935` | `.relearn` | Their consent and their choice keep it private; posting, whispering and asking around break it. | testing |
| status-know-it | `sk-947` | `.hook` | Spot the two lines that break confidentiality. | peer |
| status-know-it | `sk-947` | `.why` | Telling the warden and forwarding the report break confidentiality; the rest protect their choice. | peer |
| status-know-it | `sk-948` | `.scene[3].text` | "Their status is private and fine by me" | hiv-status |
| status-know-it | `sk-951` | `.yourLine[0].text` | "No, that's private. Forwarding it would really hurt them, let's delete it." | peer |
| status-know-it | `sk-951` | `.relearn` | Refuse to forward a private report; protect their confidentiality. | peer |
| status-know-it | `sk-957` | `.options[0].outcome` | confidentiality | peer |
| status-know-it | `sk-957` | `.debrief` | Seeing something private doesn't make it yours to pass on. | peer |
| status-know-it | `sk-962` | `.hook` | A friend asked you to keep their status secret; now a relative pries. What do you do? | asking |
| status-know-it | `sk-962` | `.options[0].text` | Keep your word: 'that's private, not mine to discuss' | peer |
| status-know-it | `sk-962` | `.options[0].outcome` | confidentiality | peer |
| status-know-it | `sk-962` | `.debrief` | Confidentiality means holding the line even when someone pries. | peer |
| status-know-it | `sk-963` | `.pairs[4].right` | Their status is private | hiv-status |
| status-know-it | `sk-970` | `.hook` | Match each confidentiality choice to what it protects or breaks. | peer |
| status-know-it | `sk-970` | `.pairs[1].right` | Breaks their confidentiality | peer |
| status-know-it | `sk-970` | `.pairs[3].right` | Spreads private health info | service |
| status-know-it | `sk-995` | `.myth.re` | Confidential services keep your visit private; that's part of the care. | testing |
| status-know-it | `sk-995` | `.relearn` | Confidential testing keeps your visit private; privacy is built in. | testing |
| status-know-it | `sk-996` | `.myth.why` | They're a valid, private way to learn your status at home. | hiv-status |
| status-know-it | `sk-1004` | `.items[0].text` | Knowing it's free and confidential | service |
| status-know-it | `sk-1004` | `.relearn` | Free, confidential, planned and supported testing helps; fear, shame and 'they'll all know' block it. | testing |
| status-know-it | `sk-1005` | `.items[2].text` | Use a confidential clinic | service |
| status-know-it | `sk-1005` | `.relearn` | Windows, confidential clinics and re-testing belong in a plan; guessing, fear-only and hoping don't. | testing |
| status-know-it | `sk-1007` | `.hook` | Sort: a confidential India testing route, or not one? | testing |
| status-know-it | `sk-1008` | `.items[4].text` | "Confidential care exists" | service |
| status-know-it | `sk-1008` | `.relearn` | Tests, windows and confidential care are solid; 'tell by looking', 'clinics gossip' and 'one test forever' need checking. | testing |
| status-know-it | `sk-1010` | `.items[0].text` | Using a confidential clinic | service |
| status-know-it | `sk-1010` | `.relearn` | Confidential clinics, home self-tests and your-terms disclosure protect privacy; posting, sharing and gossip leak it. | testing |
| status-know-it | `sk-1016` | `.options[0].consequence` | You test confidentially at no cost. | testing |
| status-know-it | `sk-1016` | `.options[1].consequence` | Free, confidential testing exists; cost needn't stop you. | testing |
| status-know-it | `sk-1016` | `.options[2].text` | Wait to save up for a private lab | testing |
| status-know-it | `sk-1016` | `.debrief` | Free, confidential testing is real; cost is no reason to wait. | testing |
| status-know-it | `sk-1016` | `.relearn` | NACO ICTC testing is free and confidential; cost needn't stop you. | testing |
| status-know-it | `sk-1018` | `.options[0].consequence` | You get youth-friendly, confidential SRH care. | service |
| status-know-it | `sk-1018` | `.relearn` | RKSK clinics offer confidential adolescent SRH care for under-18s. | service |
| status-know-it | `sk-1021` | `.options[0].consequence` | You get a private, valid way to know your status. | hiv-status |
| status-know-it | `sk-1027` | `.options[0]` | Knowing it's confidential | service |
| status-know-it | `sk-1027` | `.affirm` | Confidential care, a friend or a self-care reminder, any of these helps. | service |
| status-know-it | `sk-1027` | `.relearn` | Confidentiality, a friend or a self-care reminder makes testing easier. | testing |
| status-know-it | `sk-1029` | `.options[1]` | It's private | service |
| status-know-it | `sk-1029` | `.affirm` | Normal, private and a sign of strength, that's the heart of it. | testing |
| status-know-it | `sk-1029` | `.relearn` | Testing is normal, private and a sign of strength. | testing |
| status-know-it | `sk-1036` | `.pairs[1].right` | Free, confidential HIV testing | testing |
| status-know-it | `sk-1036` | `.pairs[3].right` | A private check you read at home | testing |
| status-know-it | `sk-1037` | `.hook` | Match each need to the right confidential route. | service |
| status-know-it | `sk-1037` | `.pairs[2].left` | Private home check | service |
| status-know-it | `sk-1038` | `.pairs[0].right` | Confidential care keeps it private | service |
| status-know-it | `sk-1040` | `.pairs[0].right` | A private result on your own terms | hiv-status |
| status-know-it | `sk-1041` | `.pairs[2].right` | Pick a confidential clinic | service |
| status-know-it | `sk-1042` | `.pairs[4].right` | Choose a confidential service | service |
| status-know-it | `sk-1042` | `.relearn` | A friend, a plain sentence, working treatment, ICTC and confidential care meet each feeling. | testing |
| status-know-it | `sk-1045` | `.scene[4].text` | "A confidential clinic is nearby" | service |
| status-know-it | `sk-1046` | `.scene[0].text` | "I went to a confidential clinic" | service |
| status-know-it | `sk-1046` | `.why` | Naming who you saw and sharing her result both break confidentiality. | hiv-status |
| status-know-it | `sk-1046` | `.relearn` | Outing who tested or sharing a result breaks confidentiality; status is private. | hiv-status |
| status-know-it | `sk-1048` | `.scene[0].text` | "NACO ICTC testing is free and confidential" | testing |
| status-know-it | `sk-1055` | `.setup` | You'd rather keep it private but stay calm and matter-of-fact. | setting |
| status-know-it | `sk-1055` | `.relearn` | Your status is yours; 'a routine health check-up' keeps it private and calm. | hiv-status |
| status-know-it | `sk-1082` | `.hook` | You want a confidential HIV test but worry someone will find out. | testing |
| status-know-it | `sk-1082` | `.relearn` | NACO ICTC testing is free and confidential by design. | testing |
| status-know-it | `sk-1082` | `.options[0].text` | Go to a NACO ICTC centre; confidentiality is built into the service | testing |
| status-know-it | `sk-1082` | `.options[0].consequence` | You test privately, on your terms. | testing |
| status-know-it | `sk-1082` | `.options[1].consequence` | ICTC privacy is part of the service; you can test confidentially. | testing |
| status-know-it | `sk-1082` | `.debrief` | Confidentiality is built in, so the worry shouldn't stop you. | service |
| status-know-it | `sk-1088` | `.options[0].consequence` | You get accurate, confidential answers. | service |
| status-know-it | `sk-1088` | `.options[1].consequence` | Random sites mislead; a doctor or ICTC gives you real, confidential facts. | testing |
| status-know-it | `sk-1091` | `.hook` | An older 'mentor' offers gifts in exchange for keeping things secret. | secrecy-flag |
| status-know-it | `sk-1091` | `.relearn` | Secret-for-favours pressure is exploitation; tell a trusted adult. | secrecy-flag |
| status-know-it | `sk-1091` | `.options[1].text` | Accept and keep the secret | secrecy-flag |
| status-know-it | `sk-1093` | `.relearn` | Point a friend to a confidential ICTC and the window period. | testing |
| status-know-it | `sk-1093` | `.options[0].text` | Reassure them and point them to a confidential ICTC and the window period | testing |
| status-know-it | `sk-1093` | `.options[1].consequence` | They deserve facts; share the confidential ICTC route and the window period. | testing |
| status-know-it | `sk-1094` | `.options[0].consequence` | You reach real, free, confidential testing. | testing |
| status-know-it | `sk-1098` | `.hook` | You're under 18 and someone threatens to share private photos of you. | photos |
| status-know-it | `sk-1103` | `.pairs[0].left` | Free, confidential HIV test | testing |
| status-know-it | `sk-1105` | `.pairs[0].right` | ICTC testing is confidential | testing |
| status-know-it | `sk-1106` | `.pairs[1].left` | Threats to share private photos | photos |
| status-know-it | `sk-1106` | `.pairs[3].left` | You need a confidential HIV test | testing |
| status-know-it | `sk-1110` | `.pairs[0].right` | Free, confidential HIV testing | testing |
| status-know-it | `sk-1116` | `.hook` | A younger friend hints someone is pressuring them for secret 'favours'. | secrecy-flag |
| status-know-it | `sk-1124` | `.options[3]` | Find a confidential clinic | service |
| status-know-it | `sk-1137` | `.items[3].text` | Threats to share private photos | photos |
| status-know-it | `sk-1137` | `.items[5].text` | An adult trading gifts for secrets | secrecy-flag |
| status-know-it | `sk-1139` | `.items[0].text` | Keeping someone's status private | hiv-status |
| status-know-it | `sk-1142` | `.why` | 'Keep it secret' and 'gifts if you do this' are coercion signs, not care. | secrecy-flag |
| status-know-it | `sk-1146` | `.scene[2].text` | "ICTC testing is confidential" | testing |
| status-know-it | `sk-1147` | `.scene[0].text` | "Your status is private, I won't share it" | hiv-status |
| status-know-it | `sk-1149` | `.hook` | "There's nowhere confidential to get tested." | testing |
| status-know-it | `sk-1149` | `.relearn` | NACO ICTC centres offer free, confidential testing nationwide. | testing |
| status-know-it | `sk-1149` | `.myth.un` | There's nowhere confidential to get tested. | testing |
| status-know-it | `sk-1149` | `.myth.re` | NACO ICTC centres give free, confidential testing, with privacy built in. | testing |
| status-know-it | `sk-1149` | `.myth.why` | Confidentiality is part of the service, so real testing is reachable. | testing |
| status-know-it | `sk-1189` | `.pairs[0].right` | Free, confidential HIV testing | testing |
| status-know-it | `sk-1219` | `.affirm` | ICTC, RKSK and a doctor are real and confidential; knowing them puts care in reach. | testing |
| status-know-it | `sk-1219` | `.relearn` | Real, confidential services put the stack within reach. | service |
| status-know-it | `sk-1279` | `.yourLine[0].text` | "It's quick and private, and I'll be right there with you. Knowing is better than worrying." | testing |
| status-know-it | `sk-1280` | `.yourLine[0].text` | "My health is private. Please don't share it; that's between us." | peer |
| status-know-it | `sk-1280` | `.relearn` | Your status is private; asking a partner to keep it so is your right. | hiv-status |
| status-know-it | `sk-1282` | `.yourLine[0].text` | "Loads of people test as routine, no shame in it. We can go to an ICTC centre where it's free and confidential." | testing |
| status-know-it | `sk-1282` | `.relearn` | Testing is routine; NACO ICTC centres are free and confidential. | testing |
| status-know-it | `sk-1292` | `.options[0].text` | Pick a calm, private moment, lead with 'for both of us' | setting |
| status-know-it | `sk-1296` | `.options[0].text` | Agree to keep it private, that's fair, and proceed | setting |
| status-know-it | `sk-1296` | `.relearn` | Keeping the talk private is fine; never trade away the protection. | setting |
| status-know-it | `sk-1298` | `.options[0].text` | Ask for confidentiality, then share | asking |
| status-know-it | `sk-1298` | `.debrief` | Ask for confidentiality, then disclose honestly. | asking |
| status-know-it | `sk-1298` | `.relearn` | Set a confidentiality boundary, then share; your status is private. | hiv-status |
| status-know-it | `sk-1299` | `.hook` | A partner asks you to keep their HIV status a secret from everyone. | secrecy-flag |
| status-know-it | `sk-1299` | `.debrief` | A partner's status is theirs alone to disclose; keep it private. | hiv-status |
| status-know-it | `sk-1299` | `.relearn` | Someone's status is theirs to share; keeping it private is the rule. | hiv-status |
| status-know-it | `sk-1304` | `.options[2].consequence` | A calm, private opener beats an ambush. | setting |
| status-know-it | `sk-1305` | `.scene[4].text` | "It's quick and private; I'll come with you." | testing |
| status-know-it | `sk-1307` | `.hook` | Spot the two lines that break a partner's confidentiality. | testing |
| status-know-it | `sk-1307` | `.scene[0].text` | "Your status is private; I won't share it." | hiv-status |
| status-know-it | `sk-1307` | `.why` | Telling others and threatening to use a status later both breach confidentiality. | hiv-status |
| status-know-it | `sk-1307` | `.relearn` | A partner's status is private; sharing or threatening with it is wrong. | hiv-status |
| status-know-it | `sk-1309` | `.scene[4].text` | "There's a free, confidential centre near us." | testing |
| status-know-it | `sk-1315` | `.hook` | Lensy: keeping a partner's status private is a quiet kind of loyalty. Feel it? | rewritten |
| status-know-it | `sk-1315` | `.relearn` | Keeping a partner's status private is a quiet loyalty. | rewritten |
| status-know-it | `sk-1319` | `.pairs[3].right` | A breach of confidentiality | peer |
| status-know-it | `sk-1321` | `.pairs[3].right` | Promising confidentiality | service |
| status-know-it | `sk-1321` | `.pairs[4].left` | "There's a free, confidential centre." | service |
| status-know-it | `sk-1323` | `.pairs[0].left` | "I'll keep your status private." | hiv-status |
| status-know-it | `sk-1323` | `.pairs[1].right` | Weaponises a secret | secrecy-flag |
| status-know-it | `sk-1324` | `.pairs[1].right` | "It's quick, private; I'll come." | testing |
| status-know-it | `sk-1324` | `.pairs[4].left` | Ask for confidentiality | asking |
| status-know-it | `sk-1326` | `.pairs[1].right` | Confidentiality | service |
| status-know-it | `sk-1326` | `.relearn` | Good partners show responsibility, confidentiality, dignity and care. | testing |
| status-know-it | `sk-1327` | `.items[2].text` | "I'll come with you; it's quick and private." | testing |
| status-know-it | `sk-1329` | `.hook` | Sort each move: respects confidentiality or breaks it? | asking |
| status-know-it | `sk-1329` | `.relearn` | A status is private; sharing, weaponising or gossiping breaches it. | secrecy-flag |
| status-know-it | `sk-1365` | `.myth.re` | ART care is confidential; your status is private health information. | hiv-status |
| status-know-it | `sk-1365` | `.myth.why` | Confidentiality is built into the service so people can get care without fear. | service |
| status-know-it | `sk-1365` | `.relearn` | ART care is confidential; your status stays private. | hiv-status |
| status-know-it | `sk-1373` | `.items[4].text` | Care is confidential | service |
| status-know-it | `sk-1373` | `.relearn` | Free, confidential care and safe relationships are real; the scare lines are myths. | service |
| status-know-it | `sk-1378` | `.relearn` | Free, confidential, full-life, U=U and nearby care answer the common worries. | rewritten |
| status-know-it | `sk-1380` | `.pairs[1].right` | Confidential testing and counselling | testing |
| status-know-it | `sk-1382` | `.hook` | Lensy: knowing treatment is free and confidential changes how a result feels. Does it? | hiv-status |
| status-know-it | `sk-1382` | `.affirm` | When care is free and private, a result feels like a step you can take, not a trap. | hiv-status |
| status-know-it | `sk-1382` | `.relearn` | Free, confidential care makes acting on a result feel doable. | hiv-status |
| status-know-it | `sk-1383` | `.options[3]` | Care is confidential | service |
| status-know-it | `sk-1399` | `.options[0].text` | Go soon to an ICTC or doctor, where it's free and confidential | testing |
| status-know-it | `sk-1399` | `.debrief` | Free, confidential care turns worry into a clear next step. | service |
| status-know-it | `sk-1399` | `.relearn` | Go for free, confidential care soon; it turns worry into a plan. | service |
| status-know-it | `sk-1406` | `.scene[2].text` | "Care is confidential" | service |
| status-know-it | `sk-1406` | `.why` | 'Costs a fortune' and 'everyone will find out' are false; care is free and confidential. | service |
| status-know-it | `sk-1406` | `.relearn` | Spot the cost and exposure myths; care is free and confidential. | service |
| status-know-it | `sk-1409` | `.yourLine[0].text` | "Treatment works, it's free and private, and I'll go with you. You've got this." | testing |
| status-know-it | `(game strings)` | `helpLine` | helpLine: "Free HIV/STI testing: find a NACO ICTC centre or ask a doctor, who will explain what stays private. If anyone pressures or exploi | rewritten |

## Other under-18 games ([SWED-122](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/0c1b8795-8d5d-4208-92d0-e1365dd590bc), 2026-10-02)

The same sweep across Speak Up (Chapter 3), Outbreak and Stand Up (Chapter 4), and Mutual, Spectrum and Life Ready (Chapter 5). Consent, For Real and Equal & Confident are Chapter 6 (adults) and out of scope.

- **Mutual** told 15 to 17-year-olds that disclosing abuse leads to "confidential" help where "you decide what happens next". For a minor, a helpline or counsellor must act on a sexual offence. `mt-1191` now says help goes at your pace and they explain each step, and if you're under 18 and being hurt, they act to keep you safe. The other promises now say help is "on your side" or "real".
- **Outbreak** (ages 12 to 15) promised outright that testing is confidential in about fifteen lines. These now say "often confidential" or "treated as private", and `ob-1356` teaches asking what stays private, including any legal limits.
- **Spectrum** keeps its lessons on never outing a friend. Two model lines drop "always" and "I won't tell anyone": "It stays with me, and you decide who knows. If you're ever unsafe, I'll help you get support." The "safe support" line in `sp-1325` is now "It stays with me unless you're in danger." `sp-1282` describes a helpline without "on your own terms".
- **Speak Up, Stand Up, Life Ready:** Childline and Women Helpline 181 are "free" help, not "confidential", and a good counsellor "explains what stays private".

132 lines (internal `source` notes and build keys left out). Counts: peer 40, hedged 27, rewritten 25, service 22, setting 13, situation 4, secrecy-flag 1.

| Verdict | Why it stands |
|---|---|
| rewritten | Rewritten in SWED-122. |
| hedged | Already hedged ('often', 'many', 'can be') or the player asks what stays private. |
| service | Names a helpline, counsellor or clinic as a confidential service; accurate as a description. The limit is now taught in Mutual (`mt-1191`), Spectrum (`sp-1282`, `sp-1299`, `sp-1325`), Outbreak (`ob-1356`) and Life Ready (`lr-1411`). |
| peer | About keeping someone else's identity, story or health status private (never outing anyone), not a promise from a service. |
| setting | A private setting or way of doing something (talk privately, learn privately), not a confidentiality promise. |
| situation | Describes a child's situation ('won't tell a parent'), matched to a helper; not a promise. |
| secrecy-flag | The line the game teaches against: agreeing to keep an older person's secret. |

| Game | Scenario | Field | Text | Verdict |
|---|---|---|---|---|
| speak-up | `su-056` | `.pairs[0].right` | Listen and support privately | peer |
| speak-up | `su-973` | `.pairs[4].left` | Won't tell a parent or teacher | situation |
| speak-up | `su-1073` | `.pairs[3].left` | You won't tell parents | situation |
| speak-up | `su-1189` | `.options[0].text` | Tell a trusted adult and ask them to keep it private | hedged |
| speak-up | `su-1217` | `.yourLine[0].text` | "Sir, can we talk privately? It's important." | hedged |
| speak-up | `su-1336` | `.pairs[3].left` | Won't tell parents or teachers | situation |
| speak-up | `su-1427` | `.pairs[3].left` | You won't tell parents | situation |
| outbreak | `ob-043` | `.options[0].text` | Go to a clinic or doctor; it's routine and often confidential | rewritten |
| outbreak | `ob-043` | `.options[1].consequence` | Testing is routine and often confidential; it's the responsible step. | rewritten |
| outbreak | `ob-043` | `.relearn` | Testing is routine and often confidential; getting tested is responsible. | rewritten |
| outbreak | `ob-045` | `.options[0].text` | Ask about confidentiality; many services protect your privacy | hedged |
| outbreak | `ob-045` | `.options[1].consequence` | Ask, many services are confidential and youth-friendly. | hedged |
| outbreak | `ob-045` | `.relearn` | You can ask about confidentiality; many testing services protect privacy. | hedged |
| outbreak | `ob-055` | `.pairs[0].right` | Often confidential | hedged |
| outbreak | `ob-074` | `.options[0].text` | Share that testing is normal, smart and often confidential | rewritten |
| outbreak | `ob-924` | `.myth.re` | Testing is a normal, smart health check, like any other; often confidential. | hedged |
| outbreak | `ob-929` | `.items[2].text` | Testing is often confidential | rewritten |
| outbreak | `ob-929` | `.relearn` | Curable, often confidential, treatable are facts; 'death sentence' and 'only bad people' are myths. | rewritten |
| outbreak | `ob-951` | `.options[1]` | "Testing is often confidential" | rewritten |
| outbreak | `ob-959` | `.yourLine[0].text` | "Testing's just a normal health check, often confidential, not a confession." | hedged |
| outbreak | `ob-959` | `.relearn` | Testing is a normal, often confidential health check, not a confession. | hedged |
| outbreak | `ob-960` | `.pieces[2]` | "Testing is often confidential" | rewritten |
| outbreak | `ob-960` | `.relearn` | Calm, true lines, surfaces are safe, most are curable, testing is often confidential, beat a scary forward. | rewritten |
| outbreak | `ob-974` | `.relearn` | Testing is a routine, often confidential health check, not a confession. | rewritten |
| outbreak | `ob-976` | `.pairs[1].right` | A real, confidential route | peer |
| outbreak | `ob-991` | `.options[0].text` | Keep it private and ask how you can support them | hedged |
| outbreak | `ob-991` | `.relearn` | A person's STI status is theirs to share; keep it confidential. | peer |
| outbreak | `ob-1025` | `.options[1]` | Someone who keeps it private | peer |
| outbreak | `ob-1032` | `.affirm` | Testing is routine, smart and often confidential; you get to ask. | hedged |
| outbreak | `ob-1042` | `.bins[0].label` | Keeps it private | peer |
| outbreak | `ob-1045` | `.items[0].text` | Knowing it's confidential. | peer |
| outbreak | `ob-1049` | `.pairs[3].right` | A promise to keep it private. | peer |
| outbreak | `ob-1054` | `.pieces[1]` | Promise it stays private | peer |
| outbreak | `ob-1058` | `.pieces[0]` | Knowing it's confidential | peer |
| outbreak | `ob-1058` | `.relearn` | Safe testing: confidential, company, 'it's routine', and no judgement. | service |
| outbreak | `ob-1226` | `.debrief` | Testing is a normal, often confidential health check, not a confession. | rewritten |
| outbreak | `ob-1226` | `.relearn` | Clinics treat testing as routine and often confidential; it's not a confession. | rewritten |
| outbreak | `ob-1272` | `.debrief` | Testing is smart, routine and often confidential, never a confession. | hedged |
| outbreak | `ob-1272` | `.relearn` | Testing is a routine, often-confidential health check, not a confession. | hedged |
| outbreak | `ob-1278` | `.debrief` | People test when it feels private; confidentiality is part of the tool. | service |
| outbreak | `ob-1278` | `.relearn` | Testing is often confidential; privacy is what brings people in. | hedged |
| outbreak | `ob-1311` | `.options[2]` | I'd keep it private | peer |
| outbreak | `ob-1311` | `.relearn` | A person's STI status is private; keeping it confidential protects them. | peer |
| outbreak | `ob-1313` | `.relearn` | Testing is a routine, often-confidential health check, never a confession. | hedged |
| outbreak | `ob-1330` | `.pairs[4].left` | Want it kept private | hedged |
| outbreak | `ob-1330` | `.pairs[4].right` | A confidential check-up | hedged |
| outbreak | `ob-1356` | `.options[0].text` | Ask the clinic about confidentiality first | rewritten |
| outbreak | `ob-1356` | `.options[1].consequence` | Ask first; many youth services keep visits confidential. | rewritten |
| outbreak | `ob-1356` | `.relearn` | Ask what stays private before you share; they'll explain any legal limits. | rewritten |
| outbreak | `ob-1361` | `.options[1].consequence` | Many youth services are confidential; that's worth sharing. | hedged |
| outbreak | `ob-1361` | `.debrief` | Knowing a service is confidential is often what lets someone finally test. | hedged |
| outbreak | `ob-1370` | `.options[1].consequence` | Keep it private and still tell those at risk to test. | service |
| outbreak | `ob-1378` | `.hook` | A student quietly asks you if a test will stay confidential. | rewritten |
| outbreak | `ob-1378` | `.yourLine[0].text` | "Youth services treat this as private. Let's find one you trust and ask what stays private." | rewritten |
| outbreak | `ob-1387` | `.myth.re` | Youth-friendly services treat your visit as confidential. | rewritten |
| outbreak | `ob-1387` | `.relearn` | Youth-friendly services treat testing visits as private; you can ask what stays private. | rewritten |
| outbreak | `ob-1396` | `.pieces[0]` | "Is this confidential?" | hedged |
| outbreak | `ob-1398` | `.pieces[3]` | keep their visit confidential | peer |
| outbreak | `ob-1398` | `.relearn` | Support a friend: normalise it, go along, find privacy, keep it confidential. | peer |
| outbreak | `ob-1403` | `.pairs[1].right` | Ask about confidentiality | hedged |
| outbreak | `ob-1420` | `.pairs[0].left` | Confidential | rewritten |
| outbreak | `ob-1409` | `.affirm` | Clinics handle results with care and in private: that is what makes walking in feel possible. | rewritten |
| outbreak | `ob-1413` | `.items[4].text` | Testing can be confidential | hedged |
| outbreak | `(game strings)` | `helpLine` | helpLine: "For STI facts or testing, see a clinic, youth health service, or doctor, it's routine and often confidential. Get facts from clin | hedged |
| stand-up | `st-995` | `.options[0].text` | Don't forward; report the message and tell her privately | setting |
| stand-up | `st-1388` | `.items[2].text` | In private DMs and group chats | setting |
| mutual | `mt-1239` | `.yourLine[1].text` | "Okay, I won't tell anyone about it." | secrecy-flag |
| spectrum | `sp-044` | `.relearn` | Meet someone sharing with warmth and unchanged respect; keep it confidential. | peer |
| spectrum | `sp-051` | `.options[0].text` | Reach a trusted adult/counsellor or a confidential line (Tele-MANAS 14416) | service |
| spectrum | `sp-051` | `.options[1].consequence` | You don't have to carry it alone; trusted support and confidential lines exist. | peer |
| spectrum | `sp-051` | `.debrief` | Confidential, caring support is there whenever you need it. | peer |
| spectrum | `sp-054` | `.relearn` | Promise and keep confidentiality; their story is theirs to share. | peer |
| spectrum | `sp-058` | `.options[0].text` | Reach careful, confidential support to help you through it | peer |
| spectrum | `sp-058` | `.options[1].consequence` | Family tension is heavy; confidential support (Tele-MANAS 14416) can help. | service |
| spectrum | `sp-058` | `.relearn` | For family tension, reach confidential support like Tele-MANAS 14416 or a counsellor. | service |
| spectrum | `sp-069` | `.options[0].text` | Use a safe move, tell an adult, support privately, you don't have to go it alone | peer |
| spectrum | `sp-077` | `.options[0].text` | Point them to a trusted adult, counsellor or a confidential line | service |
| spectrum | `sp-077` | `.options[1].consequence` | Trusted adults, counsellors and confidential lines (14416, 1098) are real options. | service |
| spectrum | `sp-077` | `.relearn` | Point a friend to a trusted adult, counsellor or confidential line. | service |
| spectrum | `sp-907` | `.relearn` | You're allowed to keep things private while you work them out. | setting |
| spectrum | `sp-929` | `.options[0].text` | Reach a trusted adult or a confidential line for support | service |
| spectrum | `sp-929` | `.debrief` | When it gets heavy, confidential, caring support is always within reach. | peer |
| spectrum | `sp-931` | `.options[0].text` | Look up accurate info privately and at your own pace | setting |
| spectrum | `sp-931` | `.options[1].consequence` | Learning about yourself is your right; you can do it privately, in your own time. | setting |
| spectrum | `sp-931` | `.debrief` | Quietly learning the facts is yours to do, privately and pressure-free. | setting |
| spectrum | `sp-931` | `.relearn` | You can learn about yourself privately, at your own pace. | setting |
| spectrum | `sp-951` | `.pairs[1].right` | Keeps your story confidential | peer |
| spectrum | `sp-951` | `.relearn` | A good friend offers no-rush warmth, confidentiality, reassurance and a route to support. | peer |
| spectrum | `sp-952` | `.why` | Telling others breaks confidentiality, and pushing a label ignores that it's their choice and time. | peer |
| spectrum | `sp-952` | `.relearn` | Keep a friend's trust: confidentiality, no outing, no pressure to label. | peer |
| spectrum | `sp-1005` | `.options[1].consequence` | Even a small part breaks the trust; keep it fully confidential. | peer |
| spectrum | `sp-1023` | `.relearn` | Meet someone's sharing with warmth, sameness and confidentiality. | peer |
| spectrum | `sp-1195` | `.yourLine[0].text` | "Ma'am, can I talk to you privately? Someone's being bullied for who they are." | hedged |
| spectrum | `sp-1203` | `.scene[4].text` | "Support them, keep it private." | peer |
| spectrum | `sp-1225` | `.myth.why` | You can tell an adult and back the person privately without a public showdown. | setting |
| spectrum | `sp-1260` | `.pairs[3].left` | Want to talk in private first | setting |
| spectrum | `sp-1262` | `.pairs[1].right` | Confidential, on-campus support | peer |
| spectrum | `sp-1266` | `.pairs[3].left` | Confidential support | peer |
| spectrum | `sp-1267` | `.pairs[4].left` | "Please keep this private" | peer |
| spectrum | `sp-1268` | `.pairs[3].right` | Real, confidential help is there | peer |
| spectrum | `sp-1272` | `.hook` | Lensy: a friend with nowhere to turn can always be pointed to a confidential line. Reassuring? | hedged |
| spectrum | `sp-1272` | `.affirm` | 'Nowhere' is rarely true; a trusted adult, counsellor or confidential line is a real, safe route. | service |
| spectrum | `sp-1282` | `.affirm` | A helpline gives you a trained, caring listener who explains what stays private. | rewritten |
| spectrum | `sp-1282` | `.relearn` | A helpline gives you a trained, caring listener who explains what stays private. | rewritten |
| spectrum | `sp-1285` | `.hook` | Lensy: if home feels tense, a confidential line or counsellor is there. Good to keep in mind? | hedged |
| spectrum | `sp-1285` | `.affirm` | Family tension is real and hard; a counsellor or Tele-MANAS 14416 can hold space for you, in private. | setting |
| spectrum | `sp-1285` | `.relearn` | If home feels tense, a confidential line or counsellor is there. | service |
| spectrum | `sp-1292` | `.myth.re` | Trusted adults, counsellors and confidential lines like Tele-MANAS 14416 are real and there for you. | service |
| spectrum | `sp-1297` | `.myth.re` | A confidential line gives a trained, caring listener; reaching out is a step toward feeling better. | service |
| spectrum | `sp-1297` | `.relearn` | A confidential line connects you to real, caring support. | service |
| spectrum | `sp-1299` | `.myth.un` | There's no private, confidential place to talk. | peer |
| spectrum | `sp-1299` | `.myth.re` | A counsellor or a line like Tele-MANAS 14416 gives you a calm space to talk, and can explain what stays private. | service |
| spectrum | `sp-1299` | `.myth.why` | Confidential routes exist precisely so you can talk safely. | peer |
| spectrum | `sp-1302` | `.options[0].text` | Listen, keep it private, and mention a counsellor or Tele-MANAS 14416 | service |
| spectrum | `sp-1302` | `.debrief` | Listen, keep confidence, and point to a confidential route, never broadcast it. | peer |
| spectrum | `sp-1302` | `.relearn` | Listen, keep confidence, and point to a confidential route, never broadcast it. | peer |
| spectrum | `sp-1307` | `.hook` | A classmate asks where to find confidential, low-cost support. | hedged |
| spectrum | `sp-1307` | `.debrief` | A counsellor and a confidential line are concrete, real routes. | service |
| spectrum | `sp-1307` | `.relearn` | A counsellor and a confidential line are concrete, real routes. | service |
| spectrum | `sp-1313` | `.items[0].text` | Listen and keep it private | peer |
| spectrum | `sp-1313` | `.items[1].text` | Share a confidential helpline | service |
| spectrum | `sp-1315` | `.items[2].text` | A confidential helpline | service |
| spectrum | `sp-1322` | `.setup` | A friend confides and begs you to keep it private. Say: | rewritten |
| spectrum | `sp-1324` | `.yourLine[0].text` | "A counsellor or Tele-MANAS 14416 can listen, in private, any time." | setting |
| spectrum | `sp-1328` | `.scene[0].text` | Listen and keep it private. | peer |
| spectrum | `sp-1328` | `.scene[2].text` | Share a confidential helpline. | service |
| spectrum | `sp-1329` | `.scene[2].text` | A counsellor listens in private. | setting |
| spectrum | `sp-1404` | `.relearn` | It's not yours to guess or spread; let people's private business stay private. | peer |
| spectrum | `sp-1415` | `.options[0].text` | Don't repeat it: what's private about someone stays private | peer |
| spectrum | `sp-1415` | `.relearn` | Don't spread private guesses about people; what's private stays private. | peer |
| life-ready | `lr-1272` | `.setup` | Raise it fairly, in private. Say: | setting |
| life-ready | `lr-1411` | `.scene[4].text` | A counsellor who explains what stays private | rewritten |
