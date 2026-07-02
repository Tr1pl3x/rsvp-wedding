import type { Metadata } from "next";
import { Geist, Geist_Mono, Great_Vibes } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Set SITE_URL in production (Vercel env var) so any config-based URLs
  // resolve absolutely; the file-convention OG/icon images work without it.
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "Harry & Susan | 21.12.2026",
  description:
    "You are cordially invited to the wedding of Harry & Susan at the InterContinental Hua Hin Resort, Thailand.",
  openGraph: {
    title: "Harry & Susan | 21.12.2026",
    description:
      "You are cordially invited to the wedding of Harry & Susan at the InterContinental Hua Hin Resort, Thailand.",
    siteName: "Harry & Susan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
