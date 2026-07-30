import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png`;

export const metadata: Metadata = {
  title: "Field Notes · IGCSE Physics Chapter 2",
  description: "Interactive Cambridge IGCSE Physics teaching material for thermal physics: kinetic particle model, thermal properties, and transfer of thermal energy.",
  openGraph: {
    title: "Field Notes · Thermal Physics",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 2.",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Field Notes: Thermal Physics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes · Thermal Physics",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 2.",
    images: [socialImage],
  },
};

export default function Chapter2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
