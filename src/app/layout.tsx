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

// og:image and friends must be absolute URLs and Next 16 requires an explicit
// metadataBase. SITE_URL wins when set (custom domain later); otherwise use
// Vercel's own env — the stable production domain in production, the
// deployment URL on previews — then localhost for `next dev`.
const SITE_BASE =
  process.env.SITE_URL ??
  (process.env.VERCEL_ENV === "production" &&
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE),
  title: "Harry & Susan | 21st Dec 2026",
  description:
    "You are cordially invited to the wedding of Harry & Susan at the InterContinental Hua Hin Resort, Thailand.",
  openGraph: {
    title: "Harry & Susan | 21st Dec 2026",
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
