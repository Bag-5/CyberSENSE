import type { Story } from "@/types/story";

/**
 * Story Missions — Ghanaian-inspired short stories that teach one cyber lesson
 * each. Every story maps to an academy threat via `threatSlug`.
 *
 * Image paths mirror `scripts/image-manifest.json`. Regenerate art with:
 *   node scripts/generate-images.mjs --only=story-momo-message-cover
 */
export const stories: Story[] = [
  {
    slug: "momo-message",
    title: "The MoMo Message",
    logline: "A payout alert that wanted her PIN, not her money.",
    threatSlug: "phishing",
    setting: "A small provisions shop in Kumasi",
    protagonist: "Ama, 22",
    protagonistNote:
      "a young Ghanaian woman in her early twenties, natural coiled hair tied back, plain t-shirt, no accessories",
    minutes: 3,
    cover: "/stories/momo-message/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Ama standing behind the counter of her provisions shop, holding her phone with a worried frown, warm afternoon light from a doorway behind her.",
    beats: [
      {
        heading: "The alert",
        body: "The shop had been quiet for an hour. Then Ama's phone buzzed. A message, styled exactly like the ones her bank sends: YOUR MOMO ACCOUNT HAS BEEN SUSPENDED. TAP BELOW TO RESTORE ACCESS. It even carried the right colours. Her chest went tight. She had heard about a woman in Kejetia who lost everything to a message like this one. Her thumb hovered over the link.",
        image: "/stories/momo-message/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "Close-up of Ama's hands holding a phone, a blue notification glow lighting her fingers, shop counter blurred in the background.",
      },
      {
        heading: "The detail",
        body: "Something snagged. Ama did not tap. She looked at the sender line instead, the way her cousin had shown her once. The number was not the bank's. It was a long string of digits that looked official because it was meant to. She checked the bank's own app, opened from her home screen the way she always did. No suspension. No message. Nothing.",
        image: "/stories/momo-message/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Ama leaning over a shop counter reading her phone screen carefully, brow furrowed, morning light falling across her face.",
      },
      {
        heading: "The quiet part",
        body: "The next morning a boy she knew was circulating a screenshot of that same message. Fourteen people in the group had received it. Two had already entered their PINs. Ama was the reason two of them did not. She had not done anything clever. She had simply been late, and had looked one extra second. That is the entire trick: a second of patience, taken before the panic.",
        image: "/stories/momo-message/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "A group of young people clustered around a phone screen in a neighbourhood yard, serious expressions, late afternoon light.",
      },
    ],
    takeaway:
      "No bank, telecom, or government office will ever ask for your PIN by SMS. Not once, not for any reason.",
    habits: [
      "Open banking and telecom apps from your home screen, never from a link.",
      "Read the sender number before you read the message. Official alerts come from short, readable codes.",
      "When a message manufactures panic, that panic is the product.",
    ],
  },
  {
    slug: "helpful-stranger",
    title: "The Helpful Stranger",
    logline: "He fixed her data. That was never the job.",
    threatSlug: "social-engineering",
    setting: "A shared laptop in a cybercafe in Osu",
    protagonist: "Efua, 19",
    protagonistNote:
      "a young Ghanaian woman, university student, headwrap over braids, denim jacket, small stud earrings",
    minutes: 3,
    cover: "/stories/helpful-stranger/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Efua at a communal laptop in a busy cybercafe, a friendly young man leaning in beside her, both looking at the screen.",
    beats: [
      {
        heading: "The introduction",
        body: "The laptop at Efua's usual cybercafe had been slow for a week. A young man in a clean polo shirt appeared beside her, phone in hand, smiling. He worked with the network team, he said. He could sort it out, just needed her to follow a few steps on his own phone. People were queueing behind her. The cafe was loud and hot and she was tired.",
        image: "/stories/helpful-stranger/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "A young man showing his phone screen to Efua at a communal laptop, warm indoor light, other patrons blurred in the background.",
      },
      {
        heading: "The request",
        body: "He asked her to read a six-digit code that had just arrived. It was for the network, he explained, to confirm the repair. Then a second code. Then he asked her to read the OTP from her bank message. Something about the way he said it — fast, and already turning back to his phone — made her stop. She had never once seen a real technician need her bank code.",
        image: "/stories/helpful-stranger/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Efua pulling her hand back from her phone and looking up warily at the man beside her, tension in her posture.",
      },
      {
        heading: "The cafe",
        body: "She said no and he left, mildly annoyed, the whole thing over in under a minute. Nobody else in the cafe had noticed anything. The queue moved forward. But the man came back the following week, and he tried the same routine on someone else. Efua told the owner, and the owner told the others. A scammer had been working that cybercafe for weeks, riding people's impatience, and one conversation ended it.",
        image: "/stories/helpful-stranger/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "Efua standing and speaking to the cybercafe owner while other patrons look on, evening light through a doorway.",
      },
    ],
    takeaway:
      "Nobody legitimate needs your OTP, your PIN, or your code. Not a technician, not a bank, not anyone.",
    habits: [
      "Never read an OTP or PIN aloud to another person, however official they seem.",
      "If someone approaches you about a technical problem, end the conversation and restart it yourself from the official app.",
      "Being rushed is the warning. The scam depends on you not having time to think.",
    ],
  },
  {
    slug: "job-form",
    title: "The Job Form",
    logline: "The vacancy was real. The attachment was not.",
    threatSlug: "malware",
    setting: "A bedroom in Tema, late at night",
    protagonist: "Kwabena, 24",
    protagonistNote:
      "a young Ghanaian man, short hair, plain t-shirt, seated at a small desk in a modest room",
    minutes: 3,
    cover: "/stories/job-form/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Kwabena at a small desk late at night, phone in one hand and a laptop open in front of him, face lit by the screen.",
    beats: [
      {
        heading: "The opportunity",
        body: "The message came through WhatsApp from a number Kwabena did not recognise, claiming to be from a logistics company hiring. The pay was good enough to be interesting and the interview was immediate. He was out of work, and the timing felt like luck. They sent a form. Of course they sent a form — it had a logo, a reference number, an email address that looked right.",
        image: "/stories/job-form/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "Kwabena reading a WhatsApp message on his phone at a desk, laptop open beside him, late night desk lamp light.",
      },
      {
        heading: "The download",
        body: "The form needed to be opened to see the questions. It was not a form. Kwabena double-clicked it and nothing appeared to happen, which was the point. Over the following days his phone became warm to the touch. His data plan drained. Photos he had not opened appeared in a folder he did not recognise. The form was watching him.",
        image: "/stories/job-form/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Kwabena staring at his phone with a confused expression, a laptop screen glowing beside him in a dim room.",
      },
      {
        heading: "The clean-up",
        body: "It took two weeks and a borrowed laptop to undo. Kwabena changed every password on a device he had cleaned. The lesson was not really about malware at all — it was that the jobs came from a number with no history, the logo was slightly wrong, and the whole thing moved faster than any real employer would ever move. Everything about it was rushed. That was the tell.",
        image: "/stories/job-form/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "Kwabena sitting with a friend at a desk looking at a laptop screen together, daylight, calmer mood.",
      },
    ],
    takeaway:
      "An unsolicited attachment is not a document. Opening it can hand someone control of your device.",
    habits: [
      "Install software only from the official app store or the vendor's own website.",
      "A real employer never runs recruitment through an unknown WhatsApp number.",
      "If a file asks you to enable content or allow macros, that is the moment to close it.",
    ],
  },
  {
    slug: "one-password-many-doors",
    title: "One Password, Many Doors",
    logline: "One quiet leak opened four accounts.",
    threatSlug: "password-attacks",
    setting: "A shared house in Cape Coast",
    protagonist: "Nii, 21",
    protagonistNote:
      "a young Ghanaian man, short dreadlocks, plain white t-shirt, relaxed posture",
    minutes: 3,
    cover: "/stories/one-password-many-doors/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Nii sitting on a wooden bench outside a shared house, laptop balanced on his knees, focused on the screen.",
    beats: [
      {
        heading: "The habit",
        body: "Nii had one password. Not carelessly chosen — it was long, complicated, and he had made it himself. He just used it everywhere. His email, his streaming account, a food delivery app, and a forum he had joined in 2019 and barely remembered. Same string, four doors. It had been fine for years, which is exactly what made it dangerous: nothing had ever gone wrong, so there was no reason to change.",
        image: "/stories/one-password-many-doors/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "Nii typing on a laptop outside a shared house, hands on the keyboard, warm late afternoon light.",
      },
      {
        heading: "The leak",
        body: "Somebody breached the forum he had forgotten about. The email addresses went out, and with them a list of passwords — which is to say, one password, four times. Within a day his inbox was full of password-reset notices he did not request. Someone was already inside, and had been for hours, quietly reading.",
        image: "/stories/one-password-many-doors/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Nii sitting forward on the bench with a tense expression, many reset notification banners stacked on the laptop screen.",
      },
      {
        heading: "The count",
        body: "He lost the forum account, which did not matter. Then he noticed the food delivery app had a saved card. Then his email. That last one was the door that mattered, because email is where password resets for everything else live. He spent a weekend changing everything, and started using a different password for every account. More to remember, slightly — and considerably cheaper than what came next.",
        image: "/stories/one-password-many-doors/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "Nii sitting calmly at the same bench with a phone and laptop, relaxed, having resolved the problem.",
      },
    ],
    takeaway:
      "One reused password is not one mistake. It is every account you have ever signed into, waiting for the same key.",
    habits: [
      "Use a different password for every account that matters, especially your email.",
      "Your email address is the master key — protect it first.",
      "Turn on two-factor authentication wherever it is offered.",
    ],
  },
  {
    slug: "free-wifi",
    title: "The Free Wi-Fi",
    logline: "The network name was right. The owner was not.",
    threatSlug: "public-wi-fi-attacks",
    setting: "A tech conference in Accra",
    protagonist: "Selassie, 27",
    protagonistNote:
      "a young Ghanaian woman in smart-casual conference clothing, lanyard and badge, shoulder bag",
    minutes: 3,
    cover: "/stories/free-wifi/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Selassie seated at a conference table with a laptop and phone, looking up from the screen at a busy hall around her.",
    beats: [
      {
        heading: "The signal",
        body: "Selassie's conference pass included wifi. The network name was plausible, the signal was strong, and the hall was packed. She connected, opened her laptop, and started working through her email. Somewhere in the same room, on a jacket pocket, a small device was listening to the air and quietly reading the traffic passing over the network.",
        image: "/stories/free-wifi/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "A crowded conference hall with many seated attendees and laptops, warm stage lighting in the background.",
      },
      {
        heading: "The list",
        body: "By the afternoon she had noticed something. There were two networks with almost the same name, differing by a single character, and she had joined the one that had appeared first. Free, no password, strong signal. That combination should have told her something. Anyone can broadcast a name that looks official, and a device that accepts a connection often cannot tell who is on the other end.",
        image: "/stories/free-wifi/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Close-up of a phone held in a hand in a blurred conference hall, the screen showing only abstract grey placeholder bars, no readable text.",
      },
      {
        heading: "The hotspot",
        body: "She finished her work, then turned on her own hotspot for a colleague whose battery was dying. Two people had been quietly reading the room all afternoon, one of them using the same instinct she had almost abandoned. Nothing was taken that day. That was luck, not design — the point of a rogue hotspot is that you cannot tell the difference from the outside.",
        image: "/stories/free-wifi/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "Selassie smiling slightly while setting up a hotspot on her phone for a colleague at the conference table.",
      },
    ],
    takeaway:
      "A strong signal and a familiar network name prove nothing. Both are trivial to imitate.",
    habits: [
      "Use your own hotspot or a trusted network for anything you care about.",
      "Never connect two similar-looking networks — one of them is bait.",
      "Save banking and other sensitive logins for a connection you trust.",
    ],
  },
  {
    slug: "locked-shop",
    title: "The Locked Shop",
    logline: "Twenty-two files, one invoice, one weekend.",
    threatSlug: "ransomware",
    setting: "A printing shop in Ho",
    protagonist: "Adwoa, 38",
    protagonistNote:
      "a Ghanaian woman in her late thirties, practical blouse and wrapper, a manager, confident posture",
    minutes: 3,
    cover: "/stories/locked-shop/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Adwoa standing in her print shop looking at a laptop screen with a serious, worried expression, daylight through the storefront.",
    beats: [
      {
        heading: "The invoice",
        body: "Adwoa's printing shop had one shared laptop and a shared drive holding every customer's file — names, phone numbers, order histories, six years of it. An invoice arrived by email from a supplier they had never bought from. The subject line said it was overdue. Attached was a document. She opened it because the amount looked urgent and she was busy.",
        image: "/stories/locked-shop/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "Adwoa opening an email attachment on a laptop at a print shop counter, paper documents stacked around her.",
      },
      {
        heading: "The lock",
        body: "Twenty minutes later the files were still there, but they could not be opened. Their names had changed. A note had appeared demanding payment, with a deadline and a promise that the files would return if it was met. The shared drive had been reached through the laptop, and every record the shop owned was inside it. Everything she had built in six years, gone in a single evening.",
        image: "/stories/locked-shop/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Adwoa staring at a laptop screen showing unreadable file icons, hands raised slightly in distress.",
      },
      {
        heading: "The backup",
        body: "She did not pay. Her brother had taken a backup to an external drive every Friday for three years and had made fun of her for it. That Friday-night habit — boring, cheap, easy to skip, and the single reason the shop reopened in four days rather than four months. Adwoa now runs that backup herself, and she tells every shop owner she meets to do the same.",
        image: "/stories/locked-shop/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "Adwoa calmly connecting a small external hard drive to the shop laptop, relieved expression, bright daylight.",
      },
    ],
    takeaway:
      "A backup on the same laptop is not a backup. The offline copy, taken regularly, is the whole thing.",
    habits: [
      "Keep one copy of important files somewhere the internet cannot reach.",
      "Verify who sent an invoice before opening its attachment, especially new suppliers.",
      "Decide your ransomware policy before you need it, not during.",
    ],
  },
  {
    slug: "premium-apk",
    title: "The Premium APK",
    logline: "Faster, free, and asking for her whole address book.",
    threatSlug: "fake-apps-scams",
    setting: "A community WhatsApp group",
    protagonist: "Yaa, 20",
    protagonistNote:
      "a young Ghanaian woman, long braided hair, patterned top, holding a phone up while standing outdoors",
    minutes: 3,
    cover: "/stories/premium-apk/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Yaa standing outdoors in daylight holding her phone up, looking at it with a doubtful expression.",
    beats: [
      {
        heading: "The group",
        body: "One of the reliable numbers in the family and friends group posted a link: a mobile money app, unlocked, no data usage, works faster than the real one. There were screenshots. Someone had added please share, which is not an instruction but a nudge. By the time the first warning appeared, eleven people had downloaded it.",
        image: "/stories/premium-apk/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "A close-up of a hand holding a phone outdoors, the screen showing an abstract chat thread of plain green and grey message bubbles containing no readable text.",
      },
      {
        heading: "The permissions",
        body: "The app worked. It was also asking for contacts, camera, location, and SMS before it would run, which a mobile money app has no reason to need. Yaa went into her settings and checked what it had already taken — it had read her address book and sent messages on her behalf. The green double ticks beside the payment confirmations were not a faster app. They were her.",
        image: "/stories/premium-apk/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Yaa looking down at her phone with wide worried eyes, blurred outdoor background, daylight.",
      },
      {
        heading: "The reversal",
        body: "She uninstalled it and called her bank from the official app, where a real agent confirmed the limit on her mobile money account. It took a phone call and an afternoon to undo. The group now has one rule: apps come from the store, not from links, however generous the offer and however trusted the person who sent it. Nobody forwards those links any more.",
        image: "/stories/premium-apk/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "A small group of young people looking together at a phone outdoors, relaxed and smiling, warm daylight.",
      },
    ],
    takeaway:
      "An app that wants your contacts, camera and SMS before it functions is not an app. It is a collection.",
    habits: [
      "Install apps only from the official store or the developer's own site.",
      "Deny any permission an app does not genuinely need for what it does.",
      "A link shared by a friend is not the same as a link from the official source.",
    ],
  },
  {
    slug: "giveaway-video",
    title: "The Giveaway Video",
    logline: "A familiar face, a fabricated voice, and a deadline.",
    threatSlug: "deepfakes",
    setting: "A dormitory room, late evening",
    protagonist: "Kojo, 23",
    protagonistNote:
      "a young Ghanaian man, short hair, hoodie, seated cross-legged on a bed with a phone",
    minutes: 3,
    cover: "/stories/giveaway-video/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Kojo sitting on a bed in a dormitory room at night, watching his phone with an intent, slightly narrowed expression.",
    beats: [
      {
        heading: "The clip",
        body: "The video appeared at 11pm and spread fast. A man everyone recognised was telling his followers to send a small amount to a mobile money number and receive four times it back before midnight. The face was right. The voice was right. The mannerisms were right. Around a hundred people had already paid by the time Kojo watched it twice and felt something he could not name.",
        image: "/stories/giveaway-video/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "Kojo watching a video on his phone in a dim dormitory room, the phone glow lighting his face from below.",
      },
      {
        heading: "The face",
        body: "Kojo watched the jaw, then the eyes, then the light falling across the face. Something was slightly wrong with all three, though he could not have said what. He checked the official account of the person in the video. Nothing. No giveaway, no announcement, no pinned post. The face had been borrowed. The urgency was the product, and the deadline was set for tonight precisely so nobody would have time to check.",
        image: "/stories/giveaway-video/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Kojo leaning forward studying his phone screen closely with a frown, dark dormitory room, screen light on his face.",
      },
      {
        heading: "The morning",
        body: "By morning the clip had been reported and taken down, and the page running it had disappeared. Most of the people who had paid were gone. Kojo had not prevented anything by being clever. He had checked the source before acting, which took ninety seconds and a full data bundle, and it was the only reason he was not one of them.",
        image: "/stories/giveaway-video/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "Kojo showing the video to a friend in the dormitory, both looking serious, morning daylight through a window.",
      },
    ],
    takeaway:
      "A familiar face is no longer evidence of anything. Check the source, not the expression.",
    habits: [
      "Confirm any claim from the official account or website, never from the clip itself.",
      "Watch for what the face cannot do well — jaw, teeth, blinking, lighting on the edge of the face.",
      "Treat urgency plus money plus authority as three red flags arriving together.",
    ],
  },
  {
    slug: "brothers-voice",
    title: "My Brother's Voice",
    logline: "She knew his voice. She did not know his number.",
    threatSlug: "voice-cloning-scams",
    setting: "A kitchen in Tamale",
    protagonist: "Zulaiha, 26",
    protagonistNote:
      "a young Ghanaian woman, headscarf and long-sleeved top, in a home kitchen, phone on a table",
    minutes: 3,
    cover: "/stories/brothers-voice/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Zulaiha standing at a kitchen table with a phone on speaker, one hand raised slightly, concerned expression.",
    beats: [
      {
        heading: "The request",
        body: "Zulaiha's brother was abroad and had been away a long time. His voice note came in that evening, from the WhatsApp number of a man she had never heard of, saying he had been robbed and needed eight hundred cedis urgently. The voice was unmistakably his. Slightly hoarse, mid-sentence, complaining about the light where he was standing. It was him, except for the part that mattered.",
        image: "/stories/brothers-voice/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "Zulaiha at a kitchen table listening to her phone with a hand pressed to her forehead, evening interior light.",
      },
      {
        heading: "The number",
        body: "She nearly moved. Then she noticed the number and called the brother's actual WhatsApp, the one saved in her phone since secondary school. It rang. He picked up, confused, asking why she was calling from a strange number. He was fine. He was not robbed. He had no idea who had been calling.",
        image: "/stories/brothers-voice/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Zulaiha holding her phone to her ear listening with a hand over her mouth, relieved and shaken, kitchen interior.",
      },
      {
        heading: "The phrase",
        body: "Her cousin had been nearly convinced by the same trick a month before. That was when their family decided on a phrase — something nobody outside the family would know, asked before any money moved. They use it now as a matter of routine, unremarkable, the way you check a lock. It is not a password. It is a check that the voice belongs to the person.",
        image: "/stories/brothers-voice/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "Zulaiha on a phone call smiling with relief, seated at the kitchen table in warm evening light.",
      },
    ],
    takeaway:
      "A cloned voice can be perfect. The only reliable check is a channel the caller does not control.",
    habits: [
      "Call back on the number you already have saved. Never the one in the message.",
      "Agree a family phrase used before any money moves.",
      "Never move money based on voice alone, however much it sounds like them.",
    ],
  },
  {
    slug: "the-rumour",
    title: "The Rumour That Spread",
    logline: "It looked like a screenshot. It was written to be believed.",
    threatSlug: "ai-misinformation",
    setting: "A group chat, faster than the news",
    protagonist: "Abena, 34",
    protagonistNote:
      "a Ghanaian woman in her mid thirties, office attire, at a desk in an office, looking at her phone with a worried frown",
    minutes: 3,
    cover: "/stories/the-rumour/cover.webp",
    coverRatio: "3:2",
    coverAlt:
      "Abena in office clothing at a desk looking at her phone with a worried frown, office interior with daylight.",
    beats: [
      {
        heading: "The screenshot",
        body: "The message said a major service was down nationwide and people should withdraw any money they could reach immediately. It arrived as a screenshot, formatted exactly like an official notice, complete with a logo and a reference number. It was forwarded through the family group and the office group within an hour. By evening it had reached two communities Abena knew. Nobody in the thread knew where it had started.",
        image: "/stories/the-rumour/beat-1.webp",
        imageRatio: "3:2",
        imageAlt:
          "Abena holding her phone up at an office desk, looking at the screen with concern, office interior in daylight.",
      },
      {
        heading: "The shape of it",
        body: "What gave it away was not the logo but the wording — dramatic, urgent, and engineered to move people before they thought. Abena checked the official service's actual website instead of trusting the picture in the chat. The service was running normally. The operator had no such notice and had never issued one. The screenshot was entirely invented, and entirely believable.",
        image: "/stories/the-rumour/beat-2.webp",
        imageRatio: "3:2",
        imageAlt:
          "Abena at her desk using a laptop, one hand on the mouse, comparing information, calm office daylight.",
      },
      {
        heading: "The cost",
        body: "Thousands of people had acted on it. Some had emptied accounts on the strength of a screenshot. Abena spent that evening in the family group explaining how to check the source, and three people told her afterwards they had sent money before she said anything. Nothing in the picture could be trusted, because none of it had ever existed. That is the whole design — no source, no origin, nothing to verify.",
        image: "/stories/the-rumour/beat-3.webp",
        imageRatio: "3:2",
        imageAlt:
          "Abena standing and addressing a small group of colleagues in an office, clear and emphatic, daylight.",
      },
    ],
    takeaway:
      "No source, no check, no share. A screenshot is a picture, not evidence.",
    habits: [
      "Look for the original source. If you cannot name it, you cannot verify it.",
      "Cross-check important claims against an official site, not another forwarded message.",
      "Do not act on financial urgency you found in a chat group.",
    ],
  },
];

export const storiesBySlug = Object.fromEntries(stories.map((s) => [s.slug, s]));

export function getStoryBySlug(slug: string): Story | undefined {
  return storiesBySlug[slug];
}

export const storySlugs = stories.map((s) => s.slug);