import type { RedFlagScenario, RedFlagDifficulty } from "@/types/redflags";

export const redFlagDifficultyLevels: RedFlagDifficulty[] = [
  "Easy",
  "Medium",
  "Hard",
];

export const redFlagScenarios: RedFlagScenario[] = [
  {
    slug: "fake-whatsapp",
    title: "Fake WhatsApp Message",
    surface: "whatsapp",
    teaser: "A message claiming your mobile money account is locked.",
    intro:
      "This chat looks urgent and friendly, but the story is designed to make you tap too fast.",
    contentTitle: "WhatsApp chat preview",
    contentLines: [
      "Bank Support: Your account will be suspended in 10 minutes.",
      "Tap the secure link below to verify your PIN and keep access.",
      "https://verify-wallet-now.com/momo",
    ],
    elements: [
      {
        id: "urgent-timer",
        label: "10 minutes",
        suspicious: true,
        reason: "Artificial urgency pushes you to react before checking.",
        type: "text",
      },
      {
        id: "verify-pin",
        label: "verify your PIN",
        suspicious: true,
        reason: "Real services never ask for your PIN in a message.",
        type: "text",
      },
      {
        id: "fake-url",
        label: "verify-wallet-now.com",
        suspicious: true,
        reason: "The URL looks official but is not the real bank domain.",
        type: "url",
      },
      {
        id: "unknown-sender",
        label: "Bank Support",
        suspicious: true,
        reason: "The sender name can be copied to look trustworthy.",
        type: "sender",
      },
      {
        id: "message-body",
        label: "Open chat",
        suspicious: false,
        reason: "The chat shell itself is not the red flag; the content is.",
        type: "banner",
      },
    ],
    explanation:
      "This scam uses urgency, a fake sender identity, a fake domain, and a PIN request to steal access to a wallet or bank account.",
    safeAdvice: [
      "Open the official app instead of tapping the link.",
      "Never share a PIN, OTP, or password in chat.",
      "Call the bank or wallet provider through a verified number.",
    ],
    realWorldExamples: [
      "Fake bank alert asking you to verify a card.",
      "Delivery message that claims a package is held for payment.",
      "Email that says your account will close unless you log in now.",
    ],
    ghanaExamples: [
      "Fake MoMo text saying a payout is waiting if you send your PIN.",
      "A WhatsApp message posing as a bank or telecom support line.",
      "A community-group scam asking you to click a payment link fast.",
    ],
  },
  {
    slug: "fake-email",
    title: "Fake Email",
    surface: "email",
    teaser: "An inbox message from a supposed HR team with a suspicious attachment.",
    intro:
      "This email tries to look official by using company language, but it is packed with tiny warning signs.",
    contentTitle: "Email preview",
    contentLines: [
      "From: HR Team <hr-updates@company-secure-help.com>",
      "Subject: Immediate salary update required",
      "Attachment: Payroll-Details-2026.zip",
    ],
    elements: [
      {
        id: "sender-domain",
        label: "company-secure-help.com",
        suspicious: true,
        reason: "The sender domain is lookalike branding, not the real company domain.",
        type: "sender",
      },
      {
        id: "salary-update",
        label: "Immediate salary update required",
        suspicious: true,
        reason: "Urgency is used to make you act without thinking.",
        type: "text",
      },
      {
        id: "zip-attachment",
        label: "Payroll-Details-2026.zip",
        suspicious: true,
        reason: "Unexpected archives can hide malware or fake forms.",
        type: "button",
      },
      {
        id: "hr-team",
        label: "HR Team",
        suspicious: false,
        reason: "The title itself is not enough to prove the email is real.",
        type: "sender",
      },
    ],
    explanation:
      "The attacker uses a lookalike domain, pressure, and a compressed attachment to increase the chance that somebody opens a malicious file.",
    safeAdvice: [
      "Check the real sender address carefully.",
      "Verify HR requests through the official portal or internal channel.",
      "Avoid opening attachments you were not expecting.",
    ],
    realWorldExamples: [
      "Payroll email with a fake Excel file.",
      "Invoice message from a cloned vendor address.",
      "Document sharing email that hides a malicious link.",
    ],
    ghanaExamples: [
      "Fake company memo sent to a staff WhatsApp group.",
      "A school admin email that asks for a rush download.",
      "An invoice message pretending to be from a local supplier.",
    ],
  },
  {
    slug: "fake-login-page",
    title: "Fake Login Page",
    surface: "login",
    teaser: "A cloned sign-in page that is almost identical to the real thing.",
    intro:
      "This page is designed to collect your password and OTP before you notice the tiny mistakes.",
    contentTitle: "Login page preview",
    contentLines: [
      "https://cybersafe-login.com/account",
      "Email address or phone number",
      "Password",
      "Sign in to continue",
    ],
    elements: [
      {
        id: "fake-url-login",
        label: "cybersafe-login.com",
        suspicious: true,
        reason: "The domain is not the official login address.",
        type: "url",
      },
      {
        id: "typo-login",
        label: "Sign in to continue",
        suspicious: false,
        reason: "The button is fine, but the page context is not trustworthy.",
        type: "button",
      },
      {
        id: "otp-request",
        label: "OTP",
        suspicious: true,
        reason: "A login page asking for an OTP in a shady domain is a warning sign.",
        type: "field",
      },
      {
        id: "missing-lock",
        label: "No verified lock icon",
        suspicious: true,
        reason: "The site pretends to be secure without proving authenticity.",
        type: "banner",
      },
    ],
    explanation:
      "Fake login pages often copy the style of the real site while hiding a fake domain, bogus security cues, and a prompt for passwords or OTPs.",
    safeAdvice: [
      "Navigate to the site yourself using a trusted bookmark.",
      "Check the exact domain before entering credentials.",
      "If something feels off, stop and verify from another device or channel.",
    ],
    realWorldExamples: [
      "Bank login clone shared in a support chat.",
      "School portal page that steals passwords.",
      "Cloud account copycat used to capture OTPs.",
    ],
    ghanaExamples: [
      "A fake mobile money login page sent after a payment alert.",
      "A cloned student portal page that looks like the real university site.",
      "A fake business login page shared in a WhatsApp group.",
    ],
  },
  {
    slug: "fake-momo-alert",
    title: "Fake MoMo Alert",
    surface: "momo",
    teaser: "A mobile money message that promises cash if you reply fast.",
    intro:
      "This alert uses local payment language and a reward hook to make the scam feel familiar.",
    contentTitle: "Mobile money alert",
    contentLines: [
      "MOMO ALERT: You have received GHS 2,500.",
      "To release the funds, send your PIN to the number below.",
      "Reply now before the offer expires.",
    ],
    elements: [
      {
        id: "money-amount",
        label: "GHS 2,500",
        suspicious: true,
        reason: "Too-good-to-be-true winnings are a classic lure.",
        type: "text",
      },
      {
        id: "send-pin",
        label: "send your PIN",
        suspicious: true,
        reason: "A real mobile money service never needs your PIN in a text reply.",
        type: "text",
      },
      {
        id: "expires-now",
        label: "Reply now",
        suspicious: true,
        reason: "Urgency is added to stop you from checking the source.",
        type: "button",
      },
      {
        id: "momo-alert",
        label: "MOMO ALERT",
        suspicious: false,
        reason: "The header is plausible; the instructions are the danger.",
        type: "banner",
      },
    ],
    explanation:
      "The scam mixes a fake payout, a PIN request, and a countdown pressure tactic to trick the user into giving away payment credentials.",
    safeAdvice: [
      "Do not respond to PIN requests by message.",
      "Check the wallet inside the official app.",
      "Report suspicious money messages to the provider.",
    ],
    realWorldExamples: [
      "Fake payout SMS asking for a verification code.",
      "Cash prize message that demands a small fee first.",
      "A cloned wallet alert with a bogus support number.",
    ],
    ghanaExamples: [
      "A MoMo message saying a prize is blocked unless you pay a release fee.",
      "A fake transfer alert sent to a busy market trader.",
      "A payment scam using local slang to sound legitimate.",
    ],
  },
  {
    slug: "fake-job-offer",
    title: "Fake Job Offer",
    surface: "job",
    teaser: "A dream job that asks for personal data before the interview starts.",
    intro:
      "Scam recruiters use excitement and hope to get sensitive data or payment from job seekers.",
    contentTitle: "Job offer preview",
    contentLines: [
      "We saw your profile and you are hired immediately.",
      "Pay a refundable onboarding fee to reserve your spot.",
      "Send your ID, bank details, and OTP for verification.",
    ],
    elements: [
      {
        id: "hired-immediately",
        label: "hired immediately",
        suspicious: true,
        reason: "Instant offers with no interview are often bait.",
        type: "text",
      },
      {
        id: "refundable-fee",
        label: "refundable onboarding fee",
        suspicious: true,
        reason: "Legitimate employers do not ask you to pay to start.",
        type: "text",
      },
      {
        id: "send-id",
        label: "Send your ID, bank details, and OTP",
        suspicious: true,
        reason: "An employer should never ask for an OTP.",
        type: "text",
      },
      {
        id: "job-profile",
        label: "We saw your profile",
        suspicious: false,
        reason: "Recruitment language alone is not proof of a scam.",
        type: "sender",
      },
    ],
    explanation:
      "The scam appeals to hope and urgency while asking for money and secrets that real recruiters would never need.",
    safeAdvice: [
      "Research the company and recruiter separately.",
      "Never pay to be hired.",
      "Do not share OTPs, bank details, or ID photos without verification.",
    ],
    realWorldExamples: [
      "Telegram job offer that asks for a registration fee.",
      "Email claiming a remote job is ready after a small transfer.",
      "Messaging app recruiter requesting verification codes.",
    ],
    ghanaExamples: [
      "A group chat job post that asks for an upfront payment.",
      "A fake internship offer circulating in a student community group.",
      "A recruiter asking for mobile money to 'activate' the role.",
    ],
  },
];

