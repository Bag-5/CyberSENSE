import type { FeatureCard, MissionCard, NavLink } from "@/types/site";

export const siteName = "CyberSENSE";
export const siteTagline = "Learn Cybersecurity Before Hackers Learn You";
export const siteDescription =
  "CyberSENSE is an interactive cybersecurity awareness platform with simulations, games, storytelling, and quizzes wrapped in a cyberpunk interface.";

export const publicNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
];

export const authenticatedNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Threat Academy", href: "/threats" },
  { label: "AI Analyzer", href: "/threats/analyzer" },
  { label: "Quizzes", href: "/quizzes" },
  { label: "Attack Lab", href: "/lab" },
  { label: "Spot the Red Flags", href: "/games/red-flags" },
  { label: "Simulations", href: "/#simulations" },
  { label: "Training", href: "/#training" },
];

export const featureCards: FeatureCard[] = [
  {
    title: "Threat Spotter",
    description:
      "Learn how phishing, social engineering, and fake links disguise themselves in plain sight.",
    accent: "Neon scan",
  },
  {
    title: "Simulated Attacks",
    description:
      "Practice in safe scenarios that mirror real-world attacks without the panic tax.",
    accent: "Live fire",
  },
  {
    title: "Story Missions",
    description:
      "Follow Ghanaian-inspired stories that make cyber lessons memorable, playful, and local.",
    accent: "Story mode",
  },
  {
    title: "Quick Quizzes",
    description:
      "Test your instincts with fast checks that reinforce the right decision under pressure.",
    accent: "Brain check",
  },
];

export const missionCards: MissionCard[] = [
  {
    title: "Start with the basics",
    description:
      "Build a foundation on passwords, MFA, and safe browsing before the tricky stuff starts.",
    tag: "Level 01",
  },
  {
    title: "React to suspicious signals",
    description:
      "Spot impossible promises, urgent language, and mismatched sender identities.",
    tag: "Level 02",
  },
  {
    title: "Train for real situations",
    description:
      "Practice account recovery, device safety, and secure communication habits.",
    tag: "Level 03",
  },
];
