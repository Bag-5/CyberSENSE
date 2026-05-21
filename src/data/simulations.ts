import type {
  LabSimulationCard,
  PhishingRedFlag,
} from "@/types/lab";

export const labSimulationCards: LabSimulationCard[] = [
  {
    id: "phishing",
    title: "Phishing Simulation",
    description:
      "Inspect a fake email and click the suspicious parts before revealing the answer.",
    icon: "🎣",
    accent: "Cyan breach",
    time: "3 mins",
  },
  {
    id: "fake-login",
    title: "Fake Login Page Demo",
    description:
      "Compare spoofed branding and fake login cues against a safe mental checklist.",
    icon: "🪪",
    accent: "Violet veil",
    time: "2 mins",
  },
  {
    id: "password-cracking",
    title: "Password Cracking Visualizer",
    description:
      "Enter a sample password and see how weaknesses affect crack difficulty.",
    icon: "🔑",
    accent: "Neon key",
    time: "2 mins",
  },
  {
    id: "ransomware-awareness",
    title: "Ransomware Awareness Demo",
    description:
      "Watch a safe simulated progression from warning to file lockdown and prevention.",
    icon: "⛓️",
    accent: "Red pulse",
    time: "3 mins",
  },
  {
    id: "public-wifi",
    title: "Public Wi-Fi MITM Visualization",
    description:
      "See how unsafe traffic can be intercepted and how secure connections differ.",
    icon: "📡",
    accent: "Blue flow",
    time: "2 mins",
  },
  {
    id: "app-permissions",
    title: "Fake App Permission Abuse Demo",
    description:
      "Explore how a harmless-looking app can ask for far too much access.",
    icon: "📲",
    accent: "Magenta trap",
    time: "2 mins",
  },
];

export const phishingSimulationContent = {
  title: "Fake email preview",
  sender: "support-secure@cybersense-help.com",
  subject: "Urgent: Confirm your account now",
  bodyLines: [
    "Your account will be suspended within 15 minutes.",
    "Please click the secure login button below to verify your password.",
    "https://cybersense-help-login.com/verify",
  ],
  redFlags: [
    {
      id: "sender-domain",
      label: "Lookalike sender domain",
      explanation:
        "The email address copies real branding but is not the official domain.",
    },
    {
      id: "urgency-language",
      label: "Urgency language",
      explanation:
        "Threats and deadlines are used to make you act before thinking.",
    },
    {
      id: "password-request",
      label: "Password request",
      explanation:
        "Real services should not ask for your password by email like this.",
    },
    {
      id: "fake-url",
      label: "Suspicious URL",
      explanation:
        "The link looks like a login page, but the domain is not the real site.",
    },
  ] satisfies PhishingRedFlag[],
};

export const fakeLoginDemo = {
  fakeUrl: "https://cybersense-access.com/login",
  legitimateUrl: "https://app.cybersense.org/login",
  fakeBranding: [
    "Logo is slightly blurry",
    "Extra padding around the title",
    "Strange domain in the address bar",
  ],
  realBranding: [
    "Official domain and certificate",
    "Consistent logo and typography",
    "Clear support contact path",
  ],
};

export const ransomwareDemo = {
  phases: [
    "Normal files",
    "Suspicious activity",
    "Locked files",
    "Recovery plan",
  ],
  files: [
    "family-photos",
    "school-notes",
    "budget.xlsx",
    "reports.zip",
    "trip-plan.txt",
  ],
  preventionTips: [
    "Keep offline backups",
    "Avoid suspicious downloads",
    "Treat attachments carefully",
    "Install updates quickly",
  ],
};

export const wifiDemo = {
  securePath: ["Your device", "HTTPS tunnel", "Trusted service"],
  unsafePath: ["Your device", "Public Wi-Fi", "Attacker listener", "Trusted service"],
  notes: [
    "Open networks can let others see or alter unprotected traffic.",
    "HTTPS reduces exposure but does not make unsafe networks safe for everything.",
  ],
};

export const appPermissionDemo = {
  appName: "Ultra Flashlight",
  permissions: [
    {
      name: "Camera",
      risk: "High",
      reason: "A flashlight app usually does not need camera access.",
    },
    {
      name: "Contacts",
      risk: "High",
      reason: "Contact access can be abused to harvest personal data.",
    },
    {
      name: "Files",
      risk: "Medium",
      reason: "File access should be limited to a clear app purpose.",
    },
    {
      name: "Location",
      risk: "Medium",
      reason: "Location permission should be justified and optional.",
    },
  ],
};
