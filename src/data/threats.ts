import type { ThreatCard, ThreatDetail } from "@/types/site";

export const threatLevels: Record<ThreatCard["severity"], string> = {
  Low: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  Medium: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  High: "border-orange-300/30 bg-orange-400/10 text-orange-100",
  Critical: "border-rose-300/30 bg-rose-400/10 text-rose-100",
};

/**
 * Each course carries a hero banner, two diagram figures, a narrated attack
 * chain, key terms and a few facts. Image paths mirror
 * `scripts/image-manifest.json`; regenerate art with
 *   node scripts/generate-images.mjs --only=course-phishing-hero
 */
export const threats = [
  {
    name: "Phishing",
    slug: "phishing",
    category: "Message Fraud",
    severity: "High",
    summary:
      "Fake emails, SMS alerts, and chat messages that push you to click, pay, or verify too fast.",
    icon: "🎣",
    accent: "Cyan pulse",
    intro:
      "Phishing is the classic bait-and-switch attack. A message looks official, but it is really a trap designed to steal passwords, PINs, card data, or money.",
    deepDive:
      "Phishing works because it attacks your judgement rather than your device. There is nothing to install and nothing to detect, so no antivirus can warn you. The message itself carries the payload: a lookalike logo to borrow trust, a deadline to block reflection, and a link that quietly points somewhere else. By the time you notice the wrong domain, the account is already gone.\n\nModern phishing has gotten cheaper and more convincing. Attackers no longer need broken spelling or clumsy design, because generative tools can now produce fluent messages in any language, clone a real brand's tone within seconds, and even generate a working fake login page that mirrors the genuine one pixel for pixel. The old tell — bad spelling — is gone. What remains is the habit of checking the sender and the domain yourself.",
    attackTricks: [
      "Urgent language like 'verify now' or 'account locked'.",
      "Lookalike logos and sender names that borrow trust.",
      "Short links that hide the real destination.",
    ],
    warningSigns: [
      "Unexpected requests for OTPs, PINs, or passwords.",
      "Messages that create panic or artificial deadlines.",
      "Links that do not match the real company domain.",
    ],
    safetyTips: [
      "Open the official app or website yourself instead of tapping the link.",
      "Verify the sender through a trusted channel before acting.",
      "Never share OTPs or recovery codes with anyone.",
    ],
    realWorldExamples: [
      "A fake bank alert saying your card has been blocked.",
      "A fake delivery text asking you to pay a small release fee.",
      "A fake school or workplace notice asking for account verification.",
    ],
    ghanaExamples: [
      "Fake MoMo message claiming a payout is waiting if you send your PIN.",
      "Delivery-link scams that look like they came from a Ghana Post rider.",
      "Fake banking SMS messages with a logo pasted in and a rushed tone.",
    ],
    scenarioWalkthrough: [
      {
        label: "The bait",
        detail:
          "A message arrives from a name that looks official, leading with a problem that cannot wait: your account is frozen, a package is held, a payment bounced.",
      },
      {
        label: "The pressure",
        detail:
          "A deadline and a consequence are attached, usually a threat of loss. This exists to stop you from checking anything before you act.",
      },
      {
        label: "The trap",
        detail:
          "The link leads to a page built to look genuine. You enter your details on a copy that sends them straight to the attacker.",
      },
      {
        label: "The lockout",
        detail:
          "Your real account is changed from another device before you notice, so the recovery codes go to the attacker instead of you.",
      },
    ],
    keyTerms: [
      {
        term: "Lookalike domain",
        definition:
          "A web address that mimics a real brand closely enough to be trusted at a glance, such as a swapped letter or an extra prefix before the real domain.",
      },
      {
        term: "Credential harvesting",
        definition:
          "Collecting usernames and passwords by tricking someone into typing them into a fake page that simply forwards what it receives.",
      },
      {
        term: "Smishing",
        definition:
          "Phishing delivered by SMS. Short, mobile-formatted messages exploit the fact that we read texts on small screens with less scrutiny.",
      },
    ],
    didYouKnow: [
      "Phishing is responsible for the large majority of successful data breaches, and in most cases the first entry point was an ordinary person clicking a link.",
      "Hovering over a link on desktop reveals its real destination in the status bar. On a phone there is no hover, which is exactly why mobile phishing works so well.",
    ],
    heroImage: "/courses/phishing/hero.webp",
    heroAlt:
      "A glowing wire fishing hook descending toward a lit phone screen on a dark floor traced with circuitry.",
    figures: [
      {
        src: "/courses/phishing/figure-1.webp",
        alt:
          "A phone showing a notification bubble, with arrows marking the sender line and a highlighted link button.",
        caption:
          "Two things to check before anything else: who it is really from, and where the link actually goes.",
      },
      {
        src: "/courses/phishing/figure-2.webp",
        alt:
          "Two overlapping browser windows with circled address bars that differ only slightly.",
        caption:
          "Compare addresses character by character. A single swapped letter is the whole trick.",
      },
    ],
    quizPrompt:
      "A text says your mobile money wallet is frozen unless you tap a link. What is the safest move?",
    relatedSlugs: ["social-engineering", "fake-apps-scams", "ai-misinformation"],
  },
  {
    name: "Social Engineering",
    slug: "social-engineering",
    category: "Human Manipulation",
    severity: "High",
    summary:
      "Attackers manipulate trust, urgency, and emotions to get people to hand over access or information.",
    icon: "🕶️",
    accent: "Purple haze",
    intro:
      "Social engineering does not need malware. It just needs a convincing story, a fake identity, and a person under pressure.",
    deepDive:
      "Every other threat on this list is a technical problem. This one is a human problem, which is why strong security software alone will not stop it.\n\nThe method is always the same shape: establish a credible identity, create a reason to act now, and move the conversation somewhere private where nobody can check. Attackers research you first — your role, your workplace, your family, your publicly visible photos — and use that material to make the story feel accurate. The request that finally lands is always small. That is deliberate. Someone who asks for your PIN will be refused, but someone who asks you to confirm a delivery you were already expecting might not be.\n\nThe defence is structural, not emotional. Decide in advance, while you are calm, what you will never do regardless of who asks: you will never read out a code, you will never move money to a new number mid-conversation, and you will never let a conversation move you off the channel you started on. Decisions made in advance survive pressure. Decisions made in the moment usually do not.",
    attackTricks: [
      "Pretending to be a boss, support agent, or family member.",
      "Using praise, fear, guilt, or urgency to lower defenses.",
      "Moving the conversation to private chat or phone calls.",
    ],
    warningSigns: [
      "Someone asks you to keep the request secret.",
      "The message jumps straight into pressure or flattery.",
      "The request is unusual for the person or company involved.",
    ],
    safetyTips: [
      "Pause before responding to emotional or urgent requests.",
      "Check the identity using a known number or official channel.",
      "Create a habit of second-checking sensitive actions.",
    ],
    realWorldExamples: [
      "A fake IT staff member asking for your password to 'fix' an issue.",
      "A caller pretending to be a relative in trouble.",
      "A chat contact using details from social media to sound real.",
    ],
    ghanaExamples: [
      "A fake landlord on WhatsApp asking for an urgent transfer.",
      "Someone posing as a network technician and asking for device codes.",
      "A 'friend' story about an emergency that suddenly needs mobile money.",
    ],
    scenarioWalkthrough: [
      {
        label: "The research",
        detail:
          "The attacker learns your name, your employer and someone you work with, mostly from things you have posted publicly.",
      },
      {
        label: "The borrowed identity",
        detail:
          "A message arrives claiming to be from that person, using details that could only come from someone who has been paying attention.",
      },
      {
        label: "The channel move",
        detail:
          "The conversation shifts to private chat or a call, where colleagues who might warn you cannot see it.",
      },
      {
        label: "The small ask",
        detail:
          "The request is modest and framed as temporary: confirm a code, check a number, receive a small payment first.",
      },
    ],
    keyTerms: [
      {
        term: "Pretexting",
        definition:
          "Inventing a plausible scenario — a support call, a delivery, an emergency — to justify asking for access or information.",
      },
      {
        term: "Authority pressure",
        definition:
          "Claiming a position of power so that compliance feels like the correct response rather than a personal choice.",
      },
      {
        term: "Quid pro quo",
        definition:
          "Offering help or a favour first, so that the eventual request feels like settling a debt rather than a new demand.",
      },
    ],
    didYouKnow: [
      "Attackers frequently use details harvested from your own public posts, so a convincing story often contains information you already made public yourself.",
      "Moving a conversation to a private channel is almost always a signal. Legitimate organisations have no reason to hide the request from oversight.",
    ],
    heroImage: "/courses/social-engineering/hero.webp",
    heroAlt:
      "A cyan wireframe human silhouette surrounded by concentric magenta rings pulsing outward.",
    figures: [
      {
        src: "/courses/social-engineering/figure-1.webp",
        alt:
          "Two wireframe silhouettes facing each other with a stack of speech bubbles between them, the top one highlighted.",
        caption:
          "The bubbles get smaller and the pressure gets louder. That shrinking sequence is the signature of a push.",
      },
      {
        src: "/courses/social-engineering/figure-2.webp",
        alt:
          "A wireframe silhouette with four amber arrows converging on it from labelled corners.",
        caption:
          "Attention from several directions at once is a tactic. Scammers manufacture the feeling of an audience.",
      },
    ],
    quizPrompt:
      "A stranger says they are helping with a verification issue and asks for your OTP. What do you do?",
    relatedSlugs: ["phishing", "voice-cloning-scams", "deepfakes"],
  },
  {
    name: "Malware",
    slug: "malware",
    category: "Device Infection",
    severity: "Critical",
    summary:
      "Malicious software that spies, steals data, or locks your device until a ransom is paid.",
    icon: "🦠",
    accent: "Red flash",
    intro:
      "Malware can sneak in through attachments, fake installers, and shady downloads. Once inside, it can quietly steal or break things.",
    deepDive:
      "Not all malware announces itself. The category splits into two very different families, and the quiet one causes more long-term damage.\n\nRansomware is loud and obvious: files lock, a note appears, a deadline is set. It is a robbery with a receipt. Spyware is the opposite. It installs without complaint, grants itself permission to read messages and screen activity, and exfiltrates everything slowly over weeks. There is no moment where you realise it happened, because nothing ever visibly breaks. The theft is discovered later, usually when the stolen data is used against you.\n\nDelivery is the part most people can actually control. Malware almost never arrives on its own. It arrives inside something you chose to open — an attachment from someone you know, an installer from a site you found yourself, a crack for software you wanted. That is why attachment handling and install discipline do more than antivirus ever will.",
    attackTricks: [
      "Fake software updates that look important.",
      "Attachments that hide malware in documents or archives.",
      "Cracked apps and shortcuts from unofficial sites.",
    ],
    warningSigns: [
      "Your device becomes slow, noisy, or unstable.",
      "Unknown apps appear or browser settings change by themselves.",
      "Popups keep pushing you to install cleaner tools.",
    ],
    safetyTips: [
      "Install apps only from trusted stores or official sites.",
      "Keep your OS, browser, and antivirus updated.",
      "Avoid opening unexpected attachments or USB files.",
    ],
    realWorldExamples: [
      "A fake PDF invoice that drops a trojan when opened.",
      "A cracked game installer that adds spyware in the background.",
      "A popup claiming your system is infected and needs a fix.",
    ],
    ghanaExamples: [
      "A WhatsApp file pretending to be a job form but hiding a payload.",
      "A cheap paid-app clone shared through a direct download link.",
      "A fake computer-cleaner ad targeting a busy cybercafe user.",
    ],
    scenarioWalkthrough: [
      {
        label: "The delivery",
        detail:
          "Something arrives that looks routine — a document, an installer, an archive — from a source that seems plausible.",
      },
      {
        label: "The execution",
        detail:
          "Opening it runs code with your permissions. Macro prompts and 'enable content' dialogs are the handshake.",
      },
      {
        label: "The persistence",
        detail:
          "The malware installs quietly, starts with the device, and takes permission to read files and messages.",
      },
      {
        label: "The payload",
        detail:
          "Data is copied out steadily, or files are encrypted and a demand follows. Often nobody notices for weeks.",
      },
    ],
    keyTerms: [
      {
        term: "Trojan",
        definition:
          "Software disguised as something legitimate so that you install it yourself, granting it access by your own hand.",
      },
      {
        term: "Spyware",
        definition:
          "Quiet software that records activity and sends it elsewhere, typically with no visible symptoms on the device.",
      },
      {
        term: "Persistence",
        definition:
          "The malware's ability to restart with the device so that uninstalling is not enough to remove it.",
      },
    ],
    didYouKnow: [
      "Macro-enabled documents are a standard malware delivery route because they prompt the user to enable the feature that runs the code.",
      "Cracked software is disproportionately used to distribute malware, because the installer already expects to bypass security checks.",
    ],
    heroImage: "/courses/malware/hero.webp",
    heroAlt:
      "A dark crystalline mass threaded with magenta veins casting a corrupted glow across a navy floor.",
    figures: [
      {
        src: "/courses/malware/figure-1.webp",
        alt:
          "A desktop monitor showing a chaotic cluster of overlapping shapes, with arrows pointing at the screen and a row of icons.",
        caption:
          "After execution, the interface may still look normal. Disruption is a symptom, not a guarantee.",
      },
      {
        src: "/courses/malware/figure-2.webp",
        alt:
          "Four panels connected by a downward arrow, the lower two crossed out diagonally.",
        caption:
          "Encryption moves through files in sequence. Offline backups are what break the chain.",
      },
    ],
    quizPrompt:
      "You downloaded a free app from a random site and your browser starts behaving strangely. What should you do first?",
    relatedSlugs: ["ransomware", "fake-apps-scams", "public-wi-fi-attacks"],
  },
  {
    name: "Password Attacks",
    slug: "password-attacks",
    category: "Credential Theft",
    severity: "High",
    summary:
      "Brute force, password spraying, and stolen-password reuse attacks aimed at your accounts.",
    icon: "🔑",
    accent: "Neon key",
    intro:
      "Weak or reused passwords are a gift to attackers. If one account leaks, they try the same combo everywhere else.",
    deepDive:
      "Password attacks come in three shapes, and they differ mainly in speed. A brute-force attack tries every possible combination on one account, which is slow and obvious because the account gets locked. Password spraying does the opposite: it tries a handful of the most common passwords across thousands of accounts, moving too slowly on any one of them to trigger a lockout. Credential stuffing skips guessing entirely and simply takes passwords leaked from other breaches and tries them where people reuse them.\n\nCredential stuffing is the one that matters for ordinary users, because it requires no skill at all — just a list. The maths is brutal. If your password is reused anywhere that has ever been breached, the time an attacker needs to try it on your account is effectively zero, because they are not attacking your account; they are logging in with your own password.\n\nThis is why email deserves special protection. Nearly every password reset flows through email, so a compromised inbox is a master key that reopens everything else you have secured.",
    attackTricks: [
      "Trying common passwords and short variations.",
      "Using leaked credentials from older breaches.",
      "Password spraying across many accounts to avoid lockouts.",
    ],
    warningSigns: [
      "Repeated login failures or password reset alerts.",
      "Unusual sign-in prompts from unknown devices.",
      "A password manager warning you about reuse or weak passwords.",
    ],
    safetyTips: [
      "Use a unique password for every important account.",
      "Turn on multi-factor authentication wherever possible.",
      "Use a password manager to generate and store long passwords.",
    ],
    realWorldExamples: [
      "Attackers trying common passwords on a school portal.",
      "Credential stuffing after a third-party website breach.",
      "A reused email password unlocking multiple services.",
    ],
    ghanaExamples: [
      "Someone reusing the same WhatsApp-linked password across email and banking.",
      "A shared PC account with a weak password in a cybercafe.",
      "A small business inbox compromised because the login was too simple.",
    ],
    scenarioWalkthrough: [
      {
        label: "The breach",
        detail:
          "Somewhere unrelated to you, an account holding your email and password is compromised and listed publicly.",
      },
      {
        label: "The reuse",
        detail:
          "That same password is tried against your email, your bank, your social accounts — no guessing required.",
      },
      {
        label: "The foothold",
        detail:
          "Your email is compromised first because every password reset for every other account routes through it.",
      },
      {
        label: "The spread",
        detail:
          "From the inbox, attackers reset passwords on everything else you own, one service at a time.",
      },
    ],
    keyTerms: [
      {
        term: "Credential stuffing",
        definition:
          "Automatically trying username and password pairs leaked from other breaches against unrelated accounts.",
      },
      {
        term: "Password spraying",
        definition:
          "Trying a few common passwords across many accounts slowly enough that no single account hits a lockout threshold.",
      },
      {
        term: "Multi-factor authentication",
        definition:
          "A second, different proof of identity — a code, a prompt, a key — so that a stolen password alone is not enough.",
      },
    ],
    didYouKnow: [
      "Because most sites lock an account after a few failed attempts, attackers try common passwords slowly across thousands of accounts instead of attacking anyone directly.",
      "Password managers generate and remember unique passwords so you no longer have to choose between strong and memorable.",
    ],
    heroImage: "/courses/password-attacks/hero.webp",
    heroAlt:
      "A field of identical glowing cyan keys receding into darkness, one cracked and split with magenta light.",
    figures: [
      {
        src: "/courses/password-attacks/figure-1.webp",
        alt:
          "Four identical keys joined by a single glowing line passing through all of them.",
        caption:
          "One reused password is not one account at risk. It is a single key that fits every lock.",
      },
      {
        src: "/courses/password-attacks/figure-2.webp",
        alt:
          "A cyan wireframe padlock surrounded by a closing ring of magenta dots, with an arrow at the keyhole.",
        caption:
          "Automated attempts are relentless. MFA turns a correct password into an insufficient one.",
      },
    ],
    quizPrompt:
      "Which is safer: one strong unique password or the same password everywhere?",
    relatedSlugs: ["phishing", "social-engineering", "ransomware"],
  },
  {
    name: "Public Wi-Fi Attacks",
    slug: "public-wi-fi-attacks",
    category: "Network Tricks",
    severity: "Medium",
    summary:
      "Fake hotspots, snooping, and session hijacking on open networks like cafes, airports, and events.",
    icon: "📡",
    accent: "Electric blue",
    intro:
      "Public Wi-Fi is convenient, but not every hotspot is trustworthy. Attackers can imitate a hotspot or sniff traffic on open networks.",
    deepDive:
      "Two distinct problems share the name public Wi-Fi attacks, and confusing them leads to the wrong habit.\n\nThe first is a rogue hotspot: someone nearby broadcasts a network name matching the venue, and devices that auto-join connect to the attacker instead. No cracking is required, because the network is genuinely open and you genuinely connected to it. The second is passive sniffing on a legitimate open network, where traffic is broadcast in the clear and anyone with the right tool can read it.\n\nThe important correction is about encryption. HTTPS protects you more than most people assume: it encrypts traffic between your browser and the site, so a sniffer on the Wi-Fi sees only which sites you visited, not the contents or your credentials. The real danger is anything that bypasses that protection — a captive portal that harvests what you type, a downgrade to an unencrypted page, or simply logging into banking over a network you cannot vouch for.\n\nThe practical habit is narrow and easy: use your own hotspot for anything sensitive, and treat an unfamiliar free network as public information rather than a private one.",
    attackTricks: [
      "Creating a rogue hotspot with a believable name.",
      "Intercepting unencrypted traffic on open Wi-Fi.",
      "Pushing fake login portals that look like the real network page.",
    ],
    warningSigns: [
      "Multiple Wi-Fi names that look almost identical.",
      "Unexpected login prompts after connecting.",
      "Certificates or browser warnings on sites that should be safe.",
    ],
    safetyTips: [
      "Use trusted networks or a hotspot from your own device.",
      "Avoid sensitive logins on open Wi-Fi when possible.",
      "Use HTTPS and a reputable VPN on unfamiliar networks.",
    ],
    realWorldExamples: [
      "A cafe hotspot named almost like the real business Wi-Fi.",
      "A fake hotel portal asking guests to sign in again.",
      "Someone sniffing unsecured traffic at an event.",
    ],
    ghanaExamples: [
      "A conference Wi-Fi clone at a tech event in Accra.",
      "A fake hotspot at a bus station or mall with a familiar name.",
      "An open network at a school lab that someone quietly monitors.",
    ],
    scenarioWalkthrough: [
      {
        label: "The broadcast",
        detail:
          "An attacker nearby sets up a hotspot whose name closely matches the real venue network.",
      },
      {
        label: "The auto-join",
        detail:
          "Your phone connects automatically because it has seen that name before and ranks it as familiar.",
      },
      {
        label: "The portal",
        detail:
          "A fake sign-in page appears on open connection, styled to look like the venue's own network page.",
      },
      {
        label: "The harvest",
        detail:
          "Anything entered on that page goes to the attacker. Sessions on an untrusted network can also be captured.",
      },
    ],
    keyTerms: [
      {
        term: "Rogue hotspot",
        definition:
          "An attacker-controlled access point broadcasting a name that imitates a legitimate network.",
      },
      {
        term: "Captive portal",
        definition:
          "A page that intercepts your browsing to make you sign in or accept terms, and which can collect what you type.",
      },
      {
        term: "Session hijacking",
        definition:
          "Stealing the authentication token from an unencrypted connection so you can be signed in without your password.",
      },
    ],
    didYouKnow: [
      "Phones auto-join networks they have connected to before, which is exactly what makes a familiar-looking rogue hotspot so effective.",
      "HTTPS already encrypts your browser traffic, so casual snooping reveals which sites you visit rather than what you typed or typed in.",
    ],
    heroImage: "/courses/public-wi-fi-attacks/hero.webp",
    heroAlt:
      "Cyan wireless rings radiating from a small node over an unattended laptop in dark navy space.",
    figures: [
      {
        src: "/courses/public-wi-fi-attacks/figure-1.webp",
        alt:
          "Two nearly identical wifi signal icons side by side with a circled difference between them.",
        caption:
          "When two open networks have almost the same name, one of them is bait. Pick neither until you ask.",
      },
      {
        src: "/courses/public-wi-fi-attacks/figure-2.webp",
        alt:
          "A wifi node emitting rings with drifting packet shapes travelling toward a laptop.",
        caption:
          "On an open network, your traffic passes through space anyone nearby can observe.",
      },
    ],
    quizPrompt:
      "You need to check email on a random hotspot. What is the safest habit?",
    relatedSlugs: ["phishing", "malware", "ai-misinformation"],
  },
  {
    name: "Ransomware",
    slug: "ransomware",
    category: "Data Lockout",
    severity: "Critical",
    summary:
      "Malware that encrypts your files and demands payment to unlock them.",
    icon: "⛓️",
    accent: "Warning red",
    intro:
      "Ransomware is a digital hostage situation. Attackers may also steal data first and then threaten to leak it.",
    deepDive:
      "Modern ransomware is usually not sent to you directly. It arrives by remote delivery: an exploited service, an unpatched system, or a stolen credential used to log in. Once inside, the attacker moves laterally, reaches the file shares and backups, and only then encrypts. Encrypting first would tip you off. The delay between intrusion and impact is what makes this hard to catch, and it is why 'we noticed something odd' often arrives days after the breach that caused it.\n\nThe second stage is extortion. Increasingly, attackers exfiltrate the data before locking it, then demand payment for a promise not to publish it. This changes the decision: paying no longer buys a guaranteed key, and it funds the next attempt. For organisations, the realistic recovery path is rehearsed restore from offline backups, which is a boring operational habit rather than a technical control.\n\nFor individuals, the scale is usually survivable — phone replacement and lost photos rather than ruin. The lesson that transfers is about backups, not fear: a copy the malware cannot reach is the only thing that makes this a bad day rather than a catastrophe.",
    attackTricks: [
      "Infected attachments or fake download sites.",
      "Exploiting unpatched systems and exposed services.",
      "Tricking staff into enabling dangerous macros or access.",
    ],
    warningSigns: [
      "Files suddenly become unreadable or renamed.",
      "A ransom note appears after a suspicious click.",
      "Backups or shared drives become affected too.",
    ],
    safetyTips: [
      "Keep offline backups of important data.",
      "Patch devices and services quickly.",
      "Limit permissions so one account cannot reach everything.",
    ],
    realWorldExamples: [
      "A business server locked after one bad attachment.",
      "A school computer lab hit by a malicious installer.",
      "Cloud files encrypted after an infected password reuse event.",
    ],
    ghanaExamples: [
      "A small business losing access to customer records after a fake invoice opened.",
      "A shared office PC getting hit through a pirated software install.",
      "A finance team folder being locked after a rushed attachment click.",
    ],
    scenarioWalkthrough: [
      {
        label: "The intrusion",
        detail:
          "An attacker gets in through an exposed service, an unpatched system, or a stolen reused password.",
      },
      {
        label: "The stealth",
        detail:
          "They move through the network quietly, gathering access and locating the backups, for days or weeks.",
      },
      {
        label: "The exfiltration",
        detail:
          "Data is copied out first, so the extortion threat exists even if you refuse to pay for a key.",
      },
      {
        label: "The lock",
        detail:
          "Files are encrypted across shares and backups, and a deadline arrives with a demand.",
      },
    ],
    keyTerms: [
      {
        term: "Offline backup",
        definition:
          "A copy stored somewhere the malware cannot reach — a disconnected drive, not a folder on the same network.",
      },
      {
        term: "Exfiltration",
        definition:
          "Copying data out of the organisation before encrypting it, so the attacker can threaten to publish it.",
      },
      {
        term: "Lateral movement",
        definition:
          "Expanding from one compromised machine to others on the same network, often using valid credentials.",
      },
    ],
    didYouKnow: [
      "Attackers frequently reach backups before they encrypt anything, which is why a backup on the same network is not a real backup.",
      "Ransomware groups increasingly steal data first, so paying no longer guarantees your files come back.",
    ],
    heroImage: "/courses/ransomware/hero.webp",
    heroAlt:
      "A half-cyan half-magenta padlock hanging from a chain with one snapped glowing link.",
    figures: [
      {
        src: "/courses/ransomware/figure-1.webp",
        alt:
          "A grid of file slabs where intact cyan rows give way to tilted magenta ones.",
        caption:
          "Encryption progresses in order. The early rows surviving is not luck, it is usually an oversight.",
      },
      {
        src: "/courses/ransomware/figure-2.webp",
        alt:
          "A database cylinder connected only to a separate drive, with no cloud shape attached.",
        caption:
          "The recovery path depends on a copy that was never connected when the attack came.",
      },
    ],
    quizPrompt:
      "If ransomware appears on one laptop, what should your team prioritize first?",
    relatedSlugs: ["malware", "password-attacks", "fake-apps-scams"],
  },
  {
    name: "Fake Apps & Scams",
    slug: "fake-apps-scams",
    category: "App Fraud",
    severity: "High",
    summary:
      "Clone apps and fake download pages that steal credentials, money, or device access.",
    icon: "📲",
    accent: "Hot magenta",
    intro:
      "Fake apps copy the look of a trusted service well enough to trick busy users into installing the wrong thing.",
    deepDive:
      "A convincing fake is mostly a copy job. The icon, the colour scheme, the screenshots and even the app name can be reproduced exactly, often using material scraped from the genuine listing. What usually gives a fake away is the metadata rather than the artwork: an unexpected publisher name, a suspiciously large bundle for a simple tool, a flood of reviews with suspiciously identical phrasing, or a last update that never came.\n\nThe most damaging category is not a game clone but a credential harvester. These apps imitate a bank or a mobile money service, capture your login the first time you use them, and often prompt you to keep using the app so you never notice your real service has stopped working. Second and third-party stores are the primary distribution channel, because sideloading bypasses the review that official stores provide.\n\nThe permission screen is the best early warning you get. A torch should not want your contacts. A mobile money wallet should not need your SMS. Requests that are wildly out of proportion to what an app does are the single most reliable signal, and they appear before any harm is done.",
    attackTricks: [
      "Using a nearly identical app name and logo.",
      "Sending APKs or installers through chat groups.",
      "Faking payment, banking, or delivery interfaces.",
    ],
    warningSigns: [
      "The app asks for too many permissions.",
      "The developer name or store listing looks odd.",
      "The app link comes from a random message instead of the official store.",
    ],
    safetyTips: [
      "Download from official app stores or the vendor site.",
      "Check reviews, publisher names, and permissions.",
      "Compare the app icon and spelling carefully before installing.",
    ],
    realWorldExamples: [
      "A fake banking app that captures login details.",
      "A clone delivery app that asks for card details.",
      "A scam utility app that pushes ads and steals contacts.",
    ],
    ghanaExamples: [
      "A fake MoMo wallet app shared in a community group.",
      "A WhatsApp APK claiming to be a premium version of a popular app.",
      "A fake school portal app that quietly harvests passwords.",
    ],
    scenarioWalkthrough: [
      {
        label: "The bait",
        detail:
          "A link arrives through chat from someone you know, offering an unlocked, faster or premium version of an app.",
      },
      {
        label: "The bypass",
        detail:
          "It must be sideloaded, because a fake app would never pass review on an official store.",
      },
      {
        label: "The permissions",
        detail:
          "It asks for contacts, SMS, camera and location at once, before it can do anything useful.",
      },
      {
        label: "The capture",
        detail:
          "The app imitates the real service, collects your login, and keeps you using it so you never notice.",
      },
    ],
    keyTerms: [
      {
        term: "Sideloading",
        definition:
          "Installing an app from outside an official store, which removes the review that would likely have blocked it.",
      },
      {
        term: "Permission overreach",
        definition:
          "Requesting access unrelated to an app's stated purpose, a reliable signal that it is collecting more than it needs.",
      },
      {
        term: "Clone app",
        definition:
          "A copy of a genuine app built to capture the credentials or payments of anyone who installs it.",
      },
    ],
    didYouKnow: [
      "Official app stores review apps before publication, which is why fake versions are distributed almost entirely through direct links.",
      "An app that keeps working after you uninstall the real service is a strong signal that you have installed a copy.",
    ],
    heroImage: "/courses/fake-apps-scams/hero.webp",
    heroAlt:
      "Two identical app icons side by side, one glowing clean cyan and one cracked magenta.",
    figures: [
      {
        src: "/courses/fake-apps-scams/figure-1.webp",
        alt:
          "A phone beside a stack of permission toggles, one highlighted magenta and ringed in amber.",
        caption:
          "Permission requests arrive before the app does anything. Overreach here is the earliest warning.",
      },
      {
        src: "/courses/fake-apps-scams/figure-2.webp",
        alt:
          "Two matching store badges, one cyan and one magenta, joined by a line with a warning triangle between.",
        caption:
          "If the link did not come from the store, the app did not come from the store either.",
      },
    ],
    quizPrompt:
      "A friend sends you an APK file and says it is faster than the Play Store version. What should you think?",
    relatedSlugs: ["phishing", "malware", "deepfakes"],
  },
  {
    name: "Deepfakes",
    slug: "deepfakes",
    category: "Synthetic Media",
    severity: "High",
    summary:
      "AI-generated videos or images that make fake people or fake moments look real.",
    icon: "🎭",
    accent: "Cyber violet",
    intro:
      "Deepfakes can put a real face on a fake message. They make scam content feel trustworthy because the person looks familiar.",
    deepDive:
      "The reason deepfakes work is that authenticity used to be a reliable signal. A face you recognised meant the message probably came from that person. Generative models broke that assumption, and the instinctive check most people rely on no longer tells you anything.\n\nThe technical detail worth knowing is that the hardest part of face synthesis is not the centre of the face, it is the boundary. Hair against a background, teeth inside the mouth, a jaw turning in profile, and the exact moment a blink completes are all places where current models still show small inconsistencies, because these edges are less represented in training data. Real faces are also driven by physics that generators approximate rather than simulate: a real head rotates and the light on it changes consistently, while a generated one may keep lighting from an earlier frame.\n\nNone of this is a reliable detector. Models improve quickly, artefacts get smoothed away, and compressed re-encoding hides more signal. The durable defence is procedural: verify through a channel the content did not come from, and treat any urgent request for money or authority as requiring independent confirmation regardless of how convincing it looks.",
    attackTricks: [
      "Using a celebrity or executive face to make a message believable.",
      "Cloning mouth movement to match a fake announcement.",
      "Recycling real clips and stitching in fake audio.",
    ],
    warningSigns: [
      "Strange blinking, lip-sync drift, or awkward lighting.",
      "A message that feels urgent and unusual for the person.",
      "A clip that appears only on one source with no verification.",
    ],
    safetyTips: [
      "Confirm sensitive claims from an official account or website.",
      "Check the source of the clip before sharing.",
      "Treat viral videos with extra caution if money or power is involved.",
    ],
    realWorldExamples: [
      "A fake CEO video telling staff to rush a payment.",
      "A celebrity video endorsing a suspicious investment scheme.",
      "A manipulated clip used to push political confusion.",
    ],
    ghanaExamples: [
      "A fake public figure video claiming a giveaway or donation is live.",
      "A doctored clip used to make a payment request look official.",
      "A viral video edited to create panic about a local service.",
    ],
    scenarioWalkthrough: [
      {
        label: "The harvest",
        detail:
          "Public footage of the target — interviews, speeches, social clips — is collected and used as source material.",
      },
      {
        label: "The synthesis",
        detail:
          "A short clip is generated or edited so the face and voice appear to say something new.",
      },
      {
        label: "The delivery",
        detail:
          "It is pushed through the same channels the real person uses, so it arrives looking entirely ordinary.",
      },
      {
        label: "The ask",
        detail:
          "The content carries a request — money, credentials, silence — with a deadline attached before doubt sets in.",
      },
    ],
    keyTerms: [
      {
        term: "Face synthesis",
        definition:
          "Generating or altering a face in video so that it appears to be a real person saying or doing something.",
      },
      {
        term: "Lip-sync drift",
        definition:
          "A mismatch between mouth movement and speech audio, a recurring artefact when video and audio are generated separately.",
      },
      {
        term: "Provenance",
        definition:
          "The verifiable origin of a piece of media. Checking where something came from is more reliable than inspecting how it looks.",
      },
    ],
    didYouKnow: [
      "Edges are where deepfakes break most visibly — hair, teeth, jaw profile and the edge of the face against the background.",
      "Detection tools are unreliable and improve slowly compared with generation, which is why source verification is the dependable defence.",
    ],
    heroImage: "/courses/deepfakes/hero.webp",
    heroAlt:
      "A cyan wireframe face fragmenting into magenta polygonal shards drifting into darkness.",
    figures: [
      {
        src: "/courses/deepfakes/figure-1.webp",
        alt:
          "A cyan wireframe face outline with three arrows pointing at the jaw, eye and hairline.",
        caption:
          "Hair, teeth, blinking and the jaw are the four places worth looking before you believe a face.",
      },
      {
        src: "/courses/deepfakes/figure-2.webp",
        alt:
          "A video player with a magnified frame on the timeline showing an abstract mismatched face.",
        caption:
          "Audio and video generated separately is the usual reason the sync drifts. Re-encoding hides it further.",
      },
    ],
    quizPrompt:
      "You see a famous person on video asking viewers to send money quickly. What should you verify?",
    relatedSlugs: ["voice-cloning-scams", "ai-misinformation", "phishing"],
  },
  {
    name: "Voice Cloning Scams",
    slug: "voice-cloning-scams",
    category: "Synthetic Audio",
    severity: "Critical",
    summary:
      "AI-generated voices that imitate relatives, managers, or public figures to trick people on calls.",
    icon: "📞",
    accent: "Audio neon",
    intro:
      "Voice cloning scams sound personal because they borrow tone, accent, and urgency from someone you trust.",
    deepDive:
      "Voice synthesis needs far less audio than image synthesis needs video, which is why this became practical before deepfakes did. A few minutes of publicly available voice — from a speech, an interview, a livestream — is enough to build a convincing clone of how someone sounds, including their accent and their characteristic pauses.\n\nThe technical trap is emotional, not acoustic. We recognise voices by patterns we have never consciously learned, so a clone that reproduces tone and cadence convincingly bypasses a check we cannot inspect. Combined with a plausible story and a deadline, it reliably works, because being convinced by a familiar voice is not a mistake anyone would classify as a mistake.\n\nWhat defeats it is entirely structural. The channel is what matters: an attacker can control the number the call appears to come from, the account it arrives from, and the voice itself, but they cannot control what happens when you call the number you already had saved. A shared phrase works for the same reason — it exists on a channel the attacker does not control. Verification habits that seem paranoid when there is no attack are exactly what make them work during one.",
    attackTricks: [
      "Calling from an unknown number but sounding familiar.",
      "Using a short emergency story to block careful thinking.",
      "Making the request feel private and time-sensitive.",
    ],
    warningSigns: [
      "The caller refuses a callback to a known number.",
      "The request involves money, codes, or secrecy.",
      "The story is dramatic but oddly short on detail.",
    ],
    safetyTips: [
      "Call the person back on a trusted number before acting.",
      "Set a family or workplace verification phrase.",
      "Never send money or codes just because a voice sounds familiar.",
    ],
    realWorldExamples: [
      "A cloned voice pretending to be a manager asking for a transfer.",
      "A fake relative claiming an emergency and requesting money.",
      "A call that uses harvested voice clips from social media.",
    ],
    ghanaExamples: [
      "A voice message that sounds like a sibling asking for mobile money urgently.",
      "A fake boss call telling an employee to process a payment now.",
      "A scammer using a WhatsApp voice note to mimic a known contact.",
    ],
    scenarioWalkthrough: [
      {
        label: "The sample",
        detail:
          "Voice clips of the target are collected from public audio — a speech, an interview, a livestream.",
      },
      {
        label: "The clone",
        detail:
          "A few minutes of audio is enough to reproduce a convincing voice, including accent and rhythm.",
      },
      {
        label: "The setup",
        detail:
          "An unknown number messages or calls with a story: an emergency, an urgent transfer, a favour.",
      },
      {
        label: "The lock-in",
        detail:
          "The request is for money or a code, with a deadline, and a refusal to accept a callback to a known number.",
      },
    ],
    keyTerms: [
      {
        term: "Voice cloning",
        definition:
          "Generating speech that closely imitates a specific person's voice from a short sample of their audio.",
      },
      {
        term: "Verification phrase",
        definition:
          "A shared question or response known only to people in a group, used to confirm identity independently of the channel.",
      },
      {
        term: "Caller ID spoofing",
        definition:
          "Displaying a trusted number on the call screen without actually originating the call from it.",
      },
    ],
    didYouKnow: [
      "Caller ID and the WhatsApp name on a message can both be faked, so neither proves who is contacting you.",
      "Because voice synthesis needs so little audio, any voice recorded in a public video or broadcast is fair game.",
    ],
    heroImage: "/courses/voice-cloning-scams/hero.webp",
    heroAlt:
      "A cyan dot-grid head silhouette shedding magenta particles beside a breaking waveform.",
    figures: [
      {
        src: "/courses/voice-cloning-scams/figure-1.webp",
        alt:
          "A horizontal waveform split into a magenta section and a cyan section at a visible seam.",
        caption:
          "Real voices carry small inconsistencies and pauses. Synthetic speech is often unnaturally smooth.",
      },
      {
        src: "/courses/voice-cloning-scams/figure-2.webp",
        alt:
          "Four connected panels in sequence, the last magenta with a verification symbol beside it.",
        caption:
          "Add a check that the caller cannot control. A shared phrase does what the voice no longer can.",
      },
    ],
    quizPrompt:
      "A caller sounds exactly like your cousin and asks for money. What should you do next?",
    relatedSlugs: ["social-engineering", "deepfakes", "phishing"],
  },
  {
    name: "AI Misinformation",
    slug: "ai-misinformation",
    category: "Synthetic Truth",
    severity: "Medium",
    summary:
      "AI-generated posts, images, and claims that spread false or misleading information quickly.",
    icon: "🧠",
    accent: "Glitch green",
    intro:
      "Not every AI threat steals your account. Some try to steal your judgment by flooding feeds with convincing nonsense.",
    deepDive:
      "This threat is different in kind. Nothing is taken from you directly; instead the information environment around you is degraded until shared facts and invented ones are indistinguishable. Generated misinformation is cheap to produce at volume, fluent in any language, and can be tailored to feel locally credible, which is why it spreads faster than older forms of falsehood.\n\nThe two techniques worth recognising are wholesale fabrication and partial truth. The first invents an event that never happened. The second is more insidious: it takes a real document, screenshot or announcement and alters a detail — a date, a figure, a name, a condition — so the result survives casual checking because most of it is genuine. This is why 'the logo looks official' stopped being evidence some time ago.\n\nThe defence is provenance rather than polish. Generated content can match official tone, formatting and confidence. What it cannot supply is a traceable origin, and the habit that follows from that is simple: if you cannot name where a claim came from, you do not have a reason to believe it, regardless of how well it is written.",
    attackTricks: [
      "Generating a flood of believable but false posts.",
      "Mixing real facts with fake details to confuse readers.",
      "Using sensational images or quotes to trigger quick sharing.",
    ],
    warningSigns: [
      "A story has no trustworthy source or direct evidence.",
      "The content feels engineered to shock rather than inform.",
      "The image or quote appears everywhere but nowhere official.",
    ],
    safetyTips: [
      "Pause before sharing and check the source.",
      "Cross-reference important claims with reputable outlets.",
      "Be cautious with screenshots, edited clips, and AI-generated summaries.",
    ],
    realWorldExamples: [
      "Fake celebrity endorsements created by AI image tools.",
      "Misleading news posts generated to farm engagement.",
      "A fabricated screenshot of a public statement.",
    ],
    ghanaExamples: [
      "A fake viral post claiming a payment app outage without evidence.",
      "An AI-generated rumor about an event, service, or official notice.",
      "A manipulated image shared in a community group to spark panic.",
    ],
    scenarioWalkthrough: [
      {
        label: "The seeding",
        detail:
          "Generated posts appear across several groups and feeds, timed to look like independent corroboration.",
      },
      {
        label: "The corroboration",
        detail:
          "Because the claim appears in many places, it starts to feel verified by repetition alone.",
      },
      {
        label: "The escalation",
        detail:
          "The story spreads beyond its origin, often with added detail invented by people repeating it.",
      },
      {
        label: "The harm",
        detail:
          "People act on it — withdrawing money, panicking about a service, or amplifying it further.",
      },
    ],
    keyTerms: [
      {
        term: "Hallucination",
        definition:
          "Fluent, confident output that is factually invented, produced when a model fills gaps rather than knowing.",
      },
      {
        term: "Synthetic media",
        definition:
          "Images, audio or video generated or substantially altered by a model rather than captured from reality.",
      },
      {
        term: "Provenance checking",
        definition:
          "Tracing a claim back to a named original source before accepting or repeating it.",
      },
    ],
    didYouKnow: [
      "Partial misinformation is harder to catch than outright fabrication, because most of the content is genuinely real.",
      "Repetition is not corroboration. The same generated claim appearing in ten places is still one unverified claim.",
    ],
    heroImage: "/courses/ai-misinformation/hero.webp",
    heroAlt:
      "A swarm of cyan geometric fragments assembling and dissolving into an almost-face shape.",
    figures: [
      {
        src: "/courses/ai-misinformation/figure-1.webp",
        alt:
          "An abstract document of grey placeholder bars with several inconsistent magenta bars among them.",
        caption:
          "A single altered detail inside an otherwise real document is enough to change the whole claim.",
      },
      {
        src: "/courses/ai-misinformation/figure-2.webp",
        alt:
          "One node branching into three paths, one ending in a magenta node ringed and arrowed.",
        caption:
          "If you cannot trace a claim back to an origin, it is a rumour wearing the shape of news.",
      },
    ],
    quizPrompt:
      "A dramatic news post is spreading fast but has no source. What is your best move?",
    relatedSlugs: ["deepfakes", "phishing", "social-engineering"],
  },
] satisfies ThreatDetail[];

export const threatsBySlug = Object.fromEntries(
  threats.map((threat) => [threat.slug, threat]),
) as Record<string, ThreatDetail>;

export const threatCategories = [
  "All",
  ...Array.from(new Set(threats.map((threat) => threat.category))),
];