import type { ThreatDetail, ThreatCard } from "@/types/site";

export const threatLevels: Record<ThreatCard["severity"], string> = {
  Low: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  Medium: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  High: "border-orange-300/30 bg-orange-400/10 text-orange-100",
  Critical: "border-rose-300/30 bg-rose-400/10 text-rose-100",
};

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
      "Fake bank alert saying your card has been blocked.",
      "Fake delivery text asking you to pay a small release fee.",
      "Fake school or workplace notice asking for account verification.",
    ],
    ghanaExamples: [
      "Fake MoMo message claiming a payout is waiting if you send your PIN.",
      "Delivery-link scams that look like they came from a Ghana Post rider.",
      "Fake banking SMS messages with a logo pasted in and a rushed tone.",
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

