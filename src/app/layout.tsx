import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { SuperAdminShell } from "@/components/layout/superadmin-shell";
import { SiteShell } from "@/components/layout/site-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { siteDescription, siteName } from "@/data/site";
import { buildThemeInitScript } from "@/lib/theme";
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
      suppressHydrationWarning
    >
      <Script id="cybersense-theme-init" strategy="beforeInteractive">
        {buildThemeInitScript()}
      </Script>
      <body
        className={[
          "min-h-full bg-background text-foreground",
          isSuperAdminShell ? "superadmin-mode" : "",
        ].join(" ")}
      >
        <ThemeProvider>
          {isSuperAdminShell ? (
            <SuperAdminShell>{children}</SuperAdminShell>
          ) : (
            <SiteShell>{children}</SiteShell>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
