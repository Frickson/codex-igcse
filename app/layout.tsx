import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Field Notes · IGCSE Physics Chapter 4",
  description: "Interactive Cambridge IGCSE Physics teaching material for electricity and magnetism.",
  openGraph: {
    title: "Field Notes · Electricity & Magnetism",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 4.",
    type: "website",
    images: [{ url: `${basePath}/og.png`, width: 1200, height: 630, alt: "Field Notes: Electricity and Magnetism" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes · Electricity & Magnetism",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 4.",
    images: [`${basePath}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
