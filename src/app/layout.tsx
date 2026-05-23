import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";

import { SuperAdminShell } from "@/components/layout/superadmin-shell";
import { SiteShell } from "@/components/layout/site-shell";
import { siteDescription, siteName } from "@/data/site";
import "./globals.css";

export const dynamic = "force-dynamic";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "cybersecurity",
    "awareness",
    "cyberpunk",
    "training",
    "games",
    "simulations",
    "quizzes",
  ],
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: "website",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport = {
  themeColor: "#050816",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const shellVariant = requestHeaders.get("x-cybersense-shell");
  const isSuperAdminShell = shellVariant === "superadmin";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body
        className={[
          "min-h-full bg-background text-foreground",
          isSuperAdminShell ? "superadmin-mode" : "",
        ].join(" ")}
      >
        {isSuperAdminShell ? (
          <SuperAdminShell>{children}</SuperAdminShell>
        ) : (
          <SiteShell>{children}</SiteShell>
        )}
      </body>
    </html>
  );
}
