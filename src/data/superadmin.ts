import type { PublicSessionUser } from "@/lib/auth/types";

export type SuperAdminMetricTone = "cyan" | "amber" | "emerald" | "rose";

export type SuperAdminMetric = {
  label: string;
  value: string;
  detail: string;
  tone: SuperAdminMetricTone;
};

export type SuperAdminRosterEntry = {
  name: string;
  email: string;
  status: "Active" | "Reserved";
  note: string;
};

export type SuperAdminSectionKey = "overview" | "access" | "content" | "security";

export type SuperAdminActionCard = {
  title: string;
  description: string;
  status: string;
  accent: string;
};

export type SuperAdminSection = {
  key: SuperAdminSectionKey;
  title: string;
  description: string;
  actionCards: SuperAdminActionCard[];
};

export type SuperAdminAuditEntry = {
  title: string;
  detail: string;
  when: string;
  severity: "Low" | "Medium" | "High";
};

export const superAdminMetrics: SuperAdminMetric[] = [
  {
    label: "Control plane",
    value: "Live",
    detail: "Protected by OTP and email allowlist checks.",
    tone: "cyan",
  },
  {
    label: "Trusted seats",
    value: "2 / 3",
    detail: "One superadmin slot remains reserved for later.",
    tone: "amber",
  },
  {
    label: "Audit trail",
    value: "On",
    detail: "Every privileged action should be logged once wired.",
    tone: "emerald",
  },
  {
    label: "Release posture",
    value: "Tight",
    detail: "Feature launches stay deliberate and review-first.",
    tone: "rose",
  },
];

export const superAdminRoster: SuperAdminRosterEntry[] = [
  {
    name: "Fred Bagini",
    email: "CyberSENSE.100@gmail.com",
    status: "Active",
    note: "Founding superadmin slot",
  },
  {
    name: "Tecxe",
    email: "tecxeghana@gmail.com",
    status: "Active",
    note: "Second trusted superadmin seat",
  },
  {
    name: "Reserved seat",
    email: "Pending email",
    status: "Reserved",
    note: "Final superadmin seat kept aside for later",
  },
];

export const superAdminSections: Record<SuperAdminSectionKey, SuperAdminSection> = {
  overview: {
    key: "overview",
    title: "Platform overview",
    description:
      "See the health of the learning platform, content readiness, and global release posture at a glance.",
    actionCards: [
      {
        title: "Global readiness",
        description:
          "Threat Academy, quizzes, games, and AI analysis are built to stay modular and easy to review.",
        status: "Ready for controlled releases",
        accent: "from-cyan-400/18 to-cyan-300/5",
      },
      {
        title: "Ghana-accented theme",
        description:
          "Subtle red, gold, and green accents keep the interface rooted locally without overwhelming the cyberpunk look.",
        status: "Visually aligned",
        accent: "from-amber-400/18 to-amber-300/5",
      },
      {
        title: "Responsive shell",
        description:
          "The full platform is designed to work across phones, tablets, iPads, Linux, iOS, Android, and desktop browsers.",
        status: "Cross-device ready",
        accent: "from-emerald-400/18 to-emerald-300/5",
      },
    ],
  },
  access: {
    key: "access",
    title: "Access control",
    description:
      "Superadmin access is controlled by CYBERSENSE_SUPERADMIN_EMAILS and OTP verification. Add future seats one email at a time.",
    actionCards: [
      {
        title: "Email allowlist",
        description:
          "Only trusted Gmail addresses listed in the environment may enter the superadmin portal.",
        status: "Protected",
        accent: "from-rose-400/18 to-rose-300/5",
      },
      {
        title: "Role inheritance",
        description:
          "Superadmin sits above the regular admin role and should remain rare and auditable.",
        status: "High trust",
        accent: "from-fuchsia-400/18 to-fuchsia-300/5",
      },
      {
        title: "Session safety",
        description:
          "Sessions are signed server-side and can be extended later with stricter rotation and timeout rules.",
        status: "Session scoped",
        accent: "from-cyan-400/18 to-cyan-300/5",
      },
    ],
  },
  content: {
    key: "content",
    title: "Content governance",
    description:
      "Keep the learning engine healthy by approving content changes before they become public.",
    actionCards: [
      {
        title: "Threat Academy",
        description:
          "Review new threat cards, Ghanaian examples, and category expansions before publishing.",
        status: "Review gate",
        accent: "from-amber-400/18 to-amber-300/5",
      },
      {
        title: "Quiz engine",
        description:
          "Approve quiz banks, difficulty curves, and achievement tuning as the library grows.",
        status: "Content locked",
        accent: "from-emerald-400/18 to-emerald-300/5",
      },
      {
        title: "Simulations and games",
        description:
          "Keep the attack lab and red-flag game educational, safe, and free from real attack behavior.",
        status: "Safety reviewed",
        accent: "from-cyan-400/18 to-cyan-300/5",
      },
    ],
  },
  security: {
    key: "security",
    title: "Security and audit",
    description:
      "Use this section for incident review, auth anomalies, and emergency actions when the platform needs a tighter grip.",
    actionCards: [
      {
        title: "Auth anomalies",
        description:
          "Track failed OTP requests, suspicious sign-in attempts, and repeated login retries.",
        status: "Monitoring",
        accent: "from-rose-400/18 to-rose-300/5",
      },
      {
        title: "Emergency lockout",
        description:
          "A future global control to freeze privileged access if something goes sideways.",
        status: "Prepared",
        accent: "from-amber-400/18 to-amber-300/5",
      },
      {
        title: "Audit trail",
        description:
          "Every privileged action should be written to an immutable log once the backend hooks are in place.",
        status: "Planned",
        accent: "from-fuchsia-400/18 to-fuchsia-300/5",
      },
    ],
  },
};

export const superAdminAuditTrail: SuperAdminAuditEntry[] = [
  {
    title: "Superadmin seat activated",
    detail: "Fred Bagini was granted the founding control-plane seat.",
    when: "Just now",
    severity: "Low",
  },
  {
    title: "Second superadmin enrolled",
    detail: "Tecxe was added to the trusted superadmin roster and allowlist.",
    when: "Today",
    severity: "Low",
  },
  {
    title: "OTP delivery guard enabled",
    detail: "Email verification remains required before any privileged session starts.",
    when: "Today",
    severity: "Medium",
  },
  {
    title: "Ghana accent palette applied",
    detail: "Red, gold, and green accents stay subtle across the platform shell.",
    when: "Today",
    severity: "Low",
  },
];

export const superAdminCallouts = [
  "Keep this route out of the public nav.",
  "Add the last superadmin email to the env allowlist when it is ready.",
  "Log every privileged action once the admin actions are wired.",
];

export function buildSuperAdminGreeting(user: PublicSessionUser) {
  return {
    title: `Welcome back, ${user.username}`,
    description:
      "This is the founding superadmin control room for CyberSENSE. Use it to oversee access, releases, and platform safety.",
  };
}
