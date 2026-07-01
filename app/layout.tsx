import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleTagManager from "@/components/GoogleTagManager";
import {
  absoluteUrl,
  clinicDescription,
  clinicName,
  clinicTitle,
  homeKeywords,
  instagramUrl,
  siteUrl,
} from "@/lib/seo";
import "./globals.css";

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
  applicationName: clinicTitle,
  title: {
    default: clinicTitle,
    template: `%s | ${clinicName}`,
  },
  description: clinicDescription,
  keywords: homeKeywords,
  authors: [{ name: clinicName }],
  creator: clinicName,
  publisher: clinicName,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: absoluteUrl("/"),
    siteName: clinicTitle,
    title: clinicTitle,
    description: clinicDescription,
    images: [
      {
        url: absoluteUrl("/images/doctora.jpg"),
        width: 1200,
        height: 900,
        alt: clinicName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: clinicTitle,
    description: clinicDescription,
    images: [absoluteUrl("/images/doctora.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "healthcare",
  other: {
    "instagram:site": instagramUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        {children}
      </body>
    </html>
  );
}
