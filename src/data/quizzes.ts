import type {
  LeaderboardEntry,
  QuizAchievement,
  QuizCategory,
  QuizCategorySlug,
  QuizDifficulty,
  QuizQuestion,
} from "@/types/quiz";

type QuestionTemplate = {
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: QuizDifficulty;
};

type CategoryBlueprint = {
  slug: QuizCategorySlug;
  title: string;
  description: string;
  icon: string;
  accent: string;
  contexts: string[];
  templates: QuestionTemplate[];
};

function buildQuestions(
  category: QuizCategorySlug,
  contexts: string[],
  templates: QuestionTemplate[],
): QuizQuestion[] {
  return contexts.flatMap((context, contextIndex) =>
    templates.map((template, templateIndex) => ({
      id: `${category}-${contextIndex + 1}-${templateIndex + 1}`,
      question: `A ${context} ${template.stem}`,
      options: template.options,
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      difficulty: template.difficulty,
      category,
    })),
  );
}

function buildCategory(blueprint: CategoryBlueprint): QuizCategory {
  return {
    slug: blueprint.slug,
    title: blueprint.title,
    description: blueprint.description,
    icon: blueprint.icon,
    accent: blueprint.accent,
    questions: buildQuestions(
      blueprint.slug,
      blueprint.contexts,
      blueprint.templates,
    ),
  };
}

const phishingTemplates: QuestionTemplate[] = [
  {
    stem: "says your account is blocked. What is the safest response?",
    options: [
      "Tap the link immediately",
      "Pause and verify through an official channel",
      "Reply with your password",
      "Ignore all account messages forever",
    ],
    correctAnswer: "Pause and verify through an official channel",
    explanation:
      "Phishing relies on urgency. Verify using the official app, website, or support number.",
    difficulty: "Easy",
  },
  {
    stem: "asks you to confirm an OTP. What should you do?",
    options: [
      "Share the OTP to help",
      "Read the OTP aloud slowly",
      "Never share OTPs with anyone",
      "Forward the OTP to a friend",
    ],
    correctAnswer: "Never share OTPs with anyone",
    explanation:
      "OTP requests are a major scam signal. Real support teams should not ask for your code.",
    difficulty: "Easy",
  },
  {
    stem: "includes a login link. What should you inspect first?",
    options: [
      "The sender's favorite emoji",
      "The domain name in the URL",
      "The phone battery percentage",
      "The color of the logo",
    ],
    correctAnswer: "The domain name in the URL",
    explanation:
      "Lookalike domains are a classic phishing trick. Read the full address before clicking.",
    difficulty: "Medium",
  },
  {
    stem: "uses urgent language and threats. What tactic is this?",
    options: [
      "Friendly follow-up",
      "Pressure to act fast",
      "Helpful reminder",
      "Account recovery",
    ],
    correctAnswer: "Pressure to act fast",
    explanation:
      "Scammers create pressure so you stop checking details and click too quickly.",
    difficulty: "Medium",
  },
  {
    stem: "looks official but the address seems strange. What is likely happening?",
    options: [
      "A lookalike domain is being used",
      "The account is definitely safe",
      "The logo is too bright",
      "The device is fully protected",
    ],
    correctAnswer: "A lookalike domain is being used",
    explanation:
      "Fake brands often copy the real look while changing the domain slightly.",
    difficulty: "Hard",
  },
];

const malwareTemplates: QuestionTemplate[] = [
  {
    stem: "contains an unexpected attachment. What is the safest move?",
    options: [
      "Open it quickly",
      "Scan and verify the source first",
      "Send it to all your contacts",
      "Disable antivirus before opening",
    ],
    correctAnswer: "Scan and verify the source first",
    explanation:
      "Unknown attachments are a common malware entry point. Verify before opening.",
    difficulty: "Easy",
  },
  {
    stem: "offers a sudden update download. What should you do?",
    options: [
      "Download it from the popup",
      "Use the official website or app store",
      "Turn off security tools",
      "Ignore all updates forever",
    ],
    correctAnswer: "Use the official website or app store",
    explanation:
      "Fake update prompts are a common trick for delivering malware.",
    difficulty: "Easy",
  },
  {
    stem: "arrives as an .exe file from someone you do not know. What does that suggest?",
    options: [
      "A safe image file",
      "A suspicious executable",
      "A verified document",
      "A normal password reset",
    ],
    correctAnswer: "A suspicious executable",
    explanation:
      "Executable files can install software. Unknown .exe files deserve extra caution.",
    difficulty: "Medium",
  },
  {
    stem: "asks you to enable macros in a document. What is the risk?",
    options: [
      "It may run malicious code",
      "It improves typing speed",
      "It makes the file smaller",
      "It automatically encrypts backups",
    ],
    correctAnswer: "It may run malicious code",
    explanation:
      "Macro-enabled documents are often used to deliver malware or malicious scripts.",
    difficulty: "Medium",
  },
  {
    stem: "tries to make you disable security tools. What should you do?",
    options: [
      "Turn them off immediately",
      "Leave protections on and investigate",
      "Give the file admin rights",
      "Restart and retry the download",
    ],
    correctAnswer: "Leave protections on and investigate",
    explanation:
      "Malware often asks you to weaken defenses. Keep protections active.",
    difficulty: "Hard",
  },
];

const passwordTemplates: QuestionTemplate[] = [
  {
    stem: "is being created for a new account. What is the best choice?",
    options: [
      "Use a unique passphrase",
      "Reuse your old password",
      "Pick your birthday",
      "Use the same password everywhere",
    ],
    correctAnswer: "Use a unique passphrase",
    explanation:
      "Unique, long passphrases reduce the risk that one breach unlocks everything.",
    difficulty: "Easy",
  },
  {
    stem: "is for a work portal. What should you add if possible?",
    options: [
      "A picture of the app",
      "Multi-factor authentication",
      "Your hometown",
      "A short number code only",
    ],
    correctAnswer: "Multi-factor authentication",
    explanation:
      "MFA adds a second barrier even if the password is guessed or stolen.",
    difficulty: "Easy",
  },
  {
    stem: "needs to be saved. What is the safest storage method?",
    options: [
      "Write it on a public note",
      "Use a password manager",
      "Send it in a group chat",
      "Reuse one password for all sites",
    ],
    correctAnswer: "Use a password manager",
    explanation:
      "Password managers help create and store unique credentials securely.",
    difficulty: "Medium",
  },
  {
    stem: "contains common words and dates. What is the problem?",
    options: [
      "It is harder to type",
      "It is easy to guess or crack",
      "It is too colorful",
      "It is automatically encrypted",
    ],
    correctAnswer: "It is easy to guess or crack",
    explanation:
      "Dictionary words and birthdays are weak because attackers can guess them quickly.",
    difficulty: "Medium",
  },
  {
    stem: "has already been exposed in a breach. What should happen next?",
    options: [
      "Keep using it",
      "Change it immediately everywhere it was reused",
      "Post it in your bio",
      "Share it with support agents",
    ],
    correctAnswer: "Change it immediately everywhere it was reused",
    explanation:
      "If one password leaks, any reused accounts become vulnerable too.",
    difficulty: "Hard",
  },
];

const socialEngineeringTemplates: QuestionTemplate[] = [
  {
    stem: "asks for an OTP on a call. What is the best response?",
    options: [
      "Share it to prove you are real",
      "Hang up and verify independently",
      "Read it slowly and clearly",
      "Send a screenshot of the code",
    ],
    correctAnswer: "Hang up and verify independently",
    explanation:
      "Legitimate teams should not need your OTP. Verify through official contact details.",
    difficulty: "Easy",
  },
  {
    stem: "uses urgency and authority. What is the red flag?",
    options: [
      "The request is polite",
      "Someone wants you to act too fast",
      "The message has a greeting",
      "The sender is well known",
    ],
    correctAnswer: "Someone wants you to act too fast",
    explanation:
      "Pressure and authority are classic social engineering tactics.",
    difficulty: "Easy",
  },
  {
    stem: "claims to be a boss or support agent. What should you check first?",
    options: [
      "Their favorite football team",
      "A separate trusted communication channel",
      "Whether they used a big font",
      "How many emojis they sent",
    ],
    correctAnswer: "A separate trusted communication channel",
    explanation:
      "Always verify suspicious requests using a known number or official contact path.",
    difficulty: "Medium",
  },
  {
    stem: "pressures you to move money now. What is the safest habit?",
    options: [
      "Send it fast",
      "Pause and confirm the request",
      "Ignore all money requests forever",
      "Ask for a new password instead",
    ],
    correctAnswer: "Pause and confirm the request",
    explanation:
      "Scammers often push urgency to avoid scrutiny. Pause before transferring anything.",
    difficulty: "Medium",
  },
  {
    stem: "asks for secrets that should stay private. What should you do?",
    options: [
      "Share them to be helpful",
      "Refuse and report the attempt",
      "Save them in a screenshot",
      "Forward them to another scammer",
    ],
    correctAnswer: "Refuse and report the attempt",
    explanation:
      "Social engineers want private details. The safest response is to refuse and report.",
    difficulty: "Hard",
  },
];

const wifiSafetyTemplates: QuestionTemplate[] = [
  {
    stem: "is a public hotspot. What activity is riskiest?",
    options: [
      "Reading news",
      "Checking the weather",
      "Logging into a bank",
      "Streaming a song",
    ],
    correctAnswer: "Logging into a bank",
    explanation:
      "Sensitive logins on open networks increase your exposure to interception.",
    difficulty: "Easy",
  },
  {
    stem: "is open and unfamiliar. What helps reduce risk?",
    options: [
      "Use a trusted hotspot or VPN",
      "Share passwords over chat",
      "Turn off HTTPS",
      "Ignore the network name",
    ],
    correctAnswer: "Use a trusted hotspot or VPN",
    explanation:
      "Trusted connections and encryption reduce the chance of traffic interception.",
    difficulty: "Easy",
  },
  {
    stem: "shows HTTPS in the browser. What does that do?",
    options: [
      "It protects all traffic on the Wi-Fi",
      "It encrypts browser traffic to the site",
      "It makes the Wi-Fi private",
      "It removes login risk completely",
    ],
    correctAnswer: "It encrypts browser traffic to the site",
    explanation:
      "HTTPS protects data in transit, but public networks still deserve caution.",
    difficulty: "Medium",
  },
  {
    stem: "auto-connects to an open network. What is the safer setting?",
    options: [
      "Leave auto-join on",
      "Disable auto-join for public Wi-Fi",
      "Share your PIN before connecting",
      "Only connect when the network is unknown",
    ],
    correctAnswer: "Disable auto-join for public Wi-Fi",
    explanation:
      "Auto-joining public networks can connect you to unsafe hotspots without a second thought.",
    difficulty: "Medium",
  },
  {
    stem: "is used for sensitive work. What is a wise habit?",
    options: [
      "Keep signed out when finished",
      "Save passwords in plain text notes",
      "Ignore certificate warnings",
      "Use public Wi-Fi for banking only",
    ],
    correctAnswer: "Keep signed out when finished",
    explanation:
      "Logging out and avoiding risky sessions reduces exposure on shared networks.",
    difficulty: "Hard",
  },
];

const aiThreatTemplates: QuestionTemplate[] = [
  {
    stem: "sounds dramatic and urgent. What is the likely tactic?",
    options: [
      "Pressure and emotional manipulation",
      "Technical maintenance",
      "A normal status update",
      "A secure reminder",
    ],
    correctAnswer: "Pressure and emotional manipulation",
    explanation:
      "AI scams often optimize for urgency and emotion to make people react fast.",
    difficulty: "Easy",
  },
  {
    stem: "shares a surprising story. What should you do before believing it?",
    options: [
      "Forward it to everyone",
      "Check trusted sources first",
      "Assume the tone makes it true",
      "Edit the caption to sound calmer",
    ],
    correctAnswer: "Check trusted sources first",
    explanation:
      "Cross-checking with reliable sources is the simplest defense against AI misinformation.",
    difficulty: "Easy",
  },
  {
    stem: "uses weird facts or dates. What is the best clue?",
    options: [
      "It is always fake",
      "It may be hallucinated or inaccurate",
      "It is definitely verified",
      "It is safe because it is long",
    ],
    correctAnswer: "It may be hallucinated or inaccurate",
    explanation:
      "AI content can sound confident while still being wrong or fabricated.",
    difficulty: "Medium",
  },
  {
    stem: "offers a support chat. What should you avoid?",
    options: [
      "Sharing secrets with a fake helper",
      "Reading the first line",
      "Logging out after use",
      "Checking the source URL",
    ],
    correctAnswer: "Sharing secrets with a fake helper",
    explanation:
      "Scammers can use AI chat to impersonate support and harvest credentials or OTPs.",
    difficulty: "Medium",
  },
  {
    stem: "shows a fake video clip. What should you do next?",
    options: [
      "Post it instantly",
      "Verify with trusted reporting",
      "Assume the clip is genuine",
      "Change the title only",
    ],
    correctAnswer: "Verify with trusted reporting",
    explanation:
      "AI-generated media needs source checks before anyone trusts it.",
    difficulty: "Hard",
  },
];

const deepfakeTemplates: QuestionTemplate[] = [
  {
    stem: "shows odd lighting around the face. What is a possible sign?",
    options: [
      "A deepfake artifact",
      "A perfect recording",
      "A strong password",
      "A normal shadow only",
    ],
    correctAnswer: "A deepfake artifact",
    explanation:
      "Deepfakes often struggle with edge details like lighting, shadows, and facial transitions.",
    difficulty: "Easy",
  },
  {
    stem: "has audio that does not match the lips. What should you suspect?",
    options: [
      "A harmless glitch",
      "Possible manipulation",
      "A stronger internet connection",
      "A verified live stream",
    ],
    correctAnswer: "Possible manipulation",
    explanation:
      "Audio and lip mismatch is a common clue that a clip may have been edited or generated.",
    difficulty: "Easy",
  },
  {
    stem: "claims a celebrity said something shocking. What should you do first?",
    options: [
      "Share it immediately",
      "Check a trusted source",
      "Assume fame means truth",
      "Resize the video",
    ],
    correctAnswer: "Check a trusted source",
    explanation:
      "A polished clip is not proof. Verify the story with reputable reporting first.",
    difficulty: "Medium",
  },
  {
    stem: "is circulating as a viral image or clip. What tool can help?",
    options: [
      "Reverse search or source tracing",
      "Changing the audio volume",
      "Turning on dark mode",
      "Compressing the file once",
    ],
    correctAnswer: "Reverse search or source tracing",
    explanation:
      "Source tracing and reverse searches can reveal the original context of suspicious media.",
    difficulty: "Medium",
  },
  {
    stem: "is meant to provoke anger fast. What is the safest habit?",
    options: [
      "React immediately",
      "Pause and verify before sharing",
      "Trust the most dramatic caption",
      "Assume all clips are authentic",
    ],
    correctAnswer: "Pause and verify before sharing",
    explanation:
      "Deepfakes are often designed to trigger an instant emotional reaction.",
    difficulty: "Hard",
  },
];

const voiceCloningTemplates: QuestionTemplate[] = [
  {
    stem: "sounds like a family member asking for urgent money. What should you do?",
    options: [
      "Send money quickly",
      "Call them back on a known number",
      "Share your PIN first",
      "Ignore your instincts completely",
    ],
    correctAnswer: "Call them back on a known number",
    explanation:
      "Voice cloning can sound familiar. Verify requests using a separate trusted channel.",
    difficulty: "Easy",
  },
  {
    stem: "asks for your OTP. What is the right response?",
    options: [
      "Read it aloud",
      "Never share OTPs",
      "Forward it by text",
      "Say it once for confirmation",
    ],
    correctAnswer: "Never share OTPs",
    explanation:
      "A cloned voice can still be a scam. OTPs and PINs should never be shared.",
    difficulty: "Easy",
  },
  {
    stem: "wants money sent right now. What is a good verification step?",
    options: [
      "Use a separate known number to confirm",
      "Trust the voice immediately",
      "Turn up the volume and send cash",
      "Ignore all emergency requests forever",
    ],
    correctAnswer: "Use a separate known number to confirm",
    explanation:
      "Never rely on the caller ID or the voice alone. Call back independently.",
    difficulty: "Medium",
  },
  {
    stem: "sounds emotional and rushed. What tactic is being used?",
    options: [
      "A normal family update",
      "Manipulation through urgency",
      "Official verification",
      "A harmless voice note",
    ],
    correctAnswer: "Manipulation through urgency",
    explanation:
      "Urgency makes people skip verification, which is exactly what scammers want.",
    difficulty: "Medium",
  },
  {
    stem: "is from a voice you know well. What is the safest rule?",
    options: [
      "Familiar voice means safe",
      "Verify identity separately before acting",
      "Share all account details",
      "Reply only in voice notes",
    ],
    correctAnswer: "Verify identity separately before acting",
    explanation:
      "A familiar voice is no longer enough proof because cloning makes imitation easier.",
    difficulty: "Hard",
  },
];

const fakeAppTemplates: QuestionTemplate[] = [
  {
    stem: "is a flashlight app asking for contacts. What does that suggest?",
    options: [
      "Normal behavior",
      "Possible permission abuse",
      "A guaranteed security upgrade",
      "A hidden backup feature only",
    ],
    correctAnswer: "Possible permission abuse",
    explanation:
      "Apps should only request permissions they truly need for their purpose.",
    difficulty: "Easy",
  },
  {
    stem: "is being installed from an unknown file. What should you check first?",
    options: [
      "The publisher name and store listing",
      "How flashy the icon looks",
      "The phone wallpaper",
      "The file's color",
    ],
    correctAnswer: "The publisher name and store listing",
    explanation:
      "Fake apps often copy the look of real apps but use suspicious publishers.",
    difficulty: "Easy",
  },
  {
    stem: "asks for camera, files, and location at once. What is the concern?",
    options: [
      "It is definitely safe",
      "It wants far too much access",
      "It is a battery saver only",
      "It is a normal update",
    ],
    correctAnswer: "It wants far too much access",
    explanation:
      "Excessive permissions are a strong warning that the app may be malicious or invasive.",
    difficulty: "Medium",
  },
  {
    stem: "has very few reviews but huge claims. What should you do?",
    options: [
      "Install immediately",
      "Read more reviews and permissions first",
      "Assume the claims are real",
      "Give it admin access to test it",
    ],
    correctAnswer: "Read more reviews and permissions first",
    explanation:
      "Big promises and low trust signals are common in fake app scams.",
    difficulty: "Medium",
  },
  {
    stem: "comes as a sideloaded APK from a random link. What is safest?",
    options: [
      "Install it right away",
      "Avoid unknown sideloads and verify the source",
      "Disable all app permissions first",
      "Share it in a group chat",
    ],
    correctAnswer: "Avoid unknown sideloads and verify the source",
    explanation:
      "Unknown downloads and sideloads are a common way to spread fake apps.",
    difficulty: "Hard",
  },
];

const ransomwareTemplates: QuestionTemplate[] = [
  {
    stem: "arrives as a zip attachment. What is the safest response?",
    options: [
      "Open it immediately",
      "Verify the source before opening",
      "Disable backups first",
      "Forward it to a colleague",
    ],
    correctAnswer: "Verify the source before opening",
    explanation:
      "Suspicious attachments are a common ransomware delivery path.",
    difficulty: "Easy",
  },
  {
    stem: "is being downloaded from a pirated installer. What is the risk?",
    options: [
      "It is usually safer than official software",
      "It may include malware or ransomware",
      "It always improves updates",
      "It prevents encryption completely",
    ],
    correctAnswer: "It may include malware or ransomware",
    explanation:
      "Pirated installers are a frequent source of malicious payloads.",
    difficulty: "Easy",
  },
  {
    stem: "asks for admin rights during installation. What should you check?",
    options: [
      "Whether the app really needs that access",
      "Whether the icon is colorful",
      "Whether the popup is large",
      "Whether the file name is short",
    ],
    correctAnswer: "Whether the app really needs that access",
    explanation:
      "Least privilege matters. Unnecessary admin rights increase the damage a bad app can do.",
    difficulty: "Medium",
  },
  {
    stem: "shows file names changing and becoming locked. What is the best defense afterward?",
    options: [
      "Pay the attacker immediately",
      "Restore from offline backups",
      "Delete all backups",
      "Disable all updates",
    ],
    correctAnswer: "Restore from offline backups",
    explanation:
      "Offline backups are the best recovery path when ransomware hits.",
    difficulty: "Medium",
  },
  {
    stem: "uses a fake invoice or school file share. What should you do before opening it?",
    options: [
      "Assume it is legitimate",
      "Check the sender and file source carefully",
      "Forward it to every device",
      "Turn off security tools",
    ],
    correctAnswer: "Check the sender and file source carefully",
    explanation:
      "Attackers often hide ransomware inside convincing business or school messages.",
    difficulty: "Hard",
  },
];

export const quizCategories: QuizCategory[] = [
  buildCategory({
    slug: "phishing",
    title: "Phishing",
    description: "Spot fake emails, MoMo alerts, and link tricks before you tap.",
    icon: "🎣",
    accent: "Cyan alert",
    contexts: [
      "MoMo alert",
      "bank email",
      "delivery SMS",
      "work chat message",
      "social media DM",
      "account recovery notice",
    ],
    templates: phishingTemplates,
  }),
  buildCategory({
    slug: "malware",
    title: "Malware",
    description: "Learn how malicious files, installers, and fake updates spread.",
    icon: "🦠",
    accent: "Violet pulse",
    contexts: [
      "email attachment",
      "fake update popup",
      "USB drive",
      "installer download",
      "document macro",
      "security warning",
    ],
    templates: malwareTemplates,
  }),
  buildCategory({
    slug: "password-security",
    title: "Password Security",
    description: "Strengthen passwords, passphrases, and account protection habits.",
    icon: "🔑",
    accent: "Neon key",
    contexts: [
      "new account setup",
      "work portal login",
      "gaming account",
      "mobile app sign-in",
      "email reset flow",
      "shared family account",
    ],
    templates: passwordTemplates,
  }),
  buildCategory({
    slug: "social-engineering",
    title: "Social Engineering",
    description: "Spot emotional manipulation, fake authority, and pressure tactics.",
    icon: "🗣️",
    accent: "Magenta mask",
    contexts: [
      "support call",
      "boss request",
      "friend DM",
      "courier text",
      "office visitor",
      "bank callback",
    ],
    templates: socialEngineeringTemplates,
  }),
  buildCategory({
    slug: "public-wi-fi-safety",
    title: "Public Wi-Fi Safety",
    description: "Understand why open hotspots can expose your traffic.",
    icon: "📡",
    accent: "Blue flow",
    contexts: [
      "cafe hotspot",
      "airport network",
      "hotel lobby Wi-Fi",
      "school Wi-Fi",
      "mall hotspot",
      "library network",
    ],
    templates: wifiSafetyTemplates,
  }),
  buildCategory({
    slug: "ai-threats",
    title: "AI Threats",
    description: "Analyze AI-generated scams, fake news, and suspicious automation.",
    icon: "🤖",
    accent: "Electric violet",
    contexts: [
      "AI-generated email",
      "chatbot reply",
      "news clip",
      "voice note",
      "social post",
      "support message",
    ],
    templates: aiThreatTemplates,
  }),
  buildCategory({
    slug: "deepfakes",
    title: "Deepfakes",
    description: "Spot manipulated video, altered faces, and fake celebrity clips.",
    icon: "🎭",
    accent: "Neon mirror",
    contexts: [
      "celebrity video",
      "political clip",
      "family photo",
      "live stream",
      "advert clip",
      "news video",
    ],
    templates: deepfakeTemplates,
  }),
  buildCategory({
    slug: "voice-cloning-scams",
    title: "Voice Cloning Scams",
    description: "Learn how cloned voices can imitate family members or managers.",
    icon: "🎙️",
    accent: "Crystal voice",
    contexts: [
      "family emergency call",
      "manager request",
      "bank callback",
      "friend voice note",
      "unknown caller",
      "delivery helpline",
    ],
    templates: voiceCloningTemplates,
  }),
  buildCategory({
    slug: "fake-apps",
    title: "Fake Apps",
    description: "Inspect suspicious mobile apps and permission abuse tricks.",
    icon: "📲",
    accent: "Pink trap",
    contexts: [
      "flashlight app",
      "QR scanner",
      "battery saver",
      "photo editor",
      "game booster",
      "music downloader",
    ],
    templates: fakeAppTemplates,
  }),
  buildCategory({
    slug: "ransomware",
    title: "Ransomware",
    description: "See how attack chains progress and why backups matter.",
    icon: "⛓️",
    accent: "Red pulse",
    contexts: [
      "fake invoice",
      "zip attachment",
      "software installer",
      "remote support email",
      "school file share",
      "HR document",
    ],
    templates: ransomwareTemplates,
  }),
];

export const quizLeaderboardEntries: LeaderboardEntry[] = [
  { name: "Kojo Firewall", score: 980, streak: 12, badge: "Firewall Master" },
  { name: "Ama Byte", score: 945, streak: 9, badge: "Digital Defender" },
  { name: "Esi Shield", score: 910, streak: 7, badge: "Threat Hunter" },
  { name: "Kwame Patch", score: 870, streak: 6, badge: "Cyber Rookie" },
  { name: "Yaa Secure", score: 840, streak: 5, badge: "Scam Spotter" },
];

export const quizAchievementPreview: QuizAchievement[] = [
  {
    id: "first-quiz",
    title: "First Quiz Completed",
    description: "Finish your first CyberSENSE quiz.",
    icon: "1",
  },
  {
    id: "phishing-expert",
    title: "Phishing Expert",
    description: "Master phishing recognition.",
    icon: "🎣",
  },
  {
    id: "password-guardian",
    title: "Password Guardian",
    description: "Show strong password habits.",
    icon: "🔐",
  },
  {
    id: "ai-threat-detective",
    title: "AI Threat Detective",
    description: "Spot AI scam tactics and fake media.",
    icon: "🤖",
  },
  {
    id: "scam-spotter",
    title: "Scam Spotter",
    description: "Earn a top-tier quiz result.",
    icon: "⚡",
  },
  {
    id: "cyber-defender",
    title: "Cyber Defender",
    description: "Complete a strong learning streak.",
    icon: "🛡️",
  },
];

export function getQuizBySlug(slug: string) {
  return quizCategories.find((quiz) => quiz.slug === slug);
}
