export const assistantQuickPrompts = [
  "How do phishing scams work?",
  "How can I detect fake AI videos?",
  "Is this message suspicious?",
  "How do hackers steal passwords?",
];

export const assistantCapabilities = [
  {
    title: "Phishing guidance",
    description: "Breaks down suspicious emails, links, OTP traps, and impersonation signs.",
  },
  {
    title: "AI scam awareness",
    description: "Explains deepfakes, voice cloning, and fake social media or support messages.",
  },
  {
    title: "Safe defense tips",
    description: "Suggests practical next steps without giving harmful instructions.",
  },
];

export const assistantSafetyNotes = [
  "Educational only",
  "Defensive focus",
  "Beginner-friendly",
] as const;
