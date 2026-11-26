import type { Metadata, Viewport } from "next";
import { Anton, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { defaultDescription, SITE_NAME, SITE_URL } from "@/lib/seo";
import MotionProvider from "@/components/MotionProvider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Condensed display face for the brutalist headlines
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Udara Nalawansa | Software Engineer in Sri Lanka',
    template: '%s | Udara Nalawansa'
  },
  description: defaultDescription,
  authors: [{ name: 'Udara Nalawansa', url: SITE_URL }],
  creator: 'Udara Nalawansa',
  publisher: 'Udara Nalawansa',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Udara Nalawansa | Software Engineer in Sri Lanka',
    description: defaultDescription,
    images: [
      {
        url: '/screenshot.png',
        width: 1200,
        height: 630,
        alt: 'Udara Nalawansa Portfolio - Software Engineer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Udara Nalawansa | Software Engineer in Sri Lanka',
    description: defaultDescription,
    images: ['/screenshot.png'],
    creator: '@udaranalawansa'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: 'Udara Nalawansa — Blog' },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Browser extensions add classes to <html> before React hydrates; ignore those attribute diffs here only.
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} ${anton.variable}`} suppressHydrationWarning>
      <head />
      <body
        className={`${jetbrainsMono.variable} antialiased`}
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
