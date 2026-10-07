import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { universe } from "@/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });

const title = `${universe.profile.name} — ${universe.profile.headline}`;
const description =
  "A space-adventure portfolio: each employer is a star system, each project a planet with its own mission record. AWS platforms, Bedrock agents, data pipelines and computer vision.";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: title, template: `%s | ${universe.profile.name}` },
  description,
  applicationName: "Space Portfolio",
  authors: [{ name: universe.profile.fullName, url: universe.profile.links.github }],
  openGraph: { type: "website", siteName: universe.profile.name, title, description, url: "/" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#03050c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-ink">{children}</body>
    </html>
  );
}
