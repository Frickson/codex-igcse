import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png`;

export const metadata: Metadata = {
  title: "Field Notes · IGCSE Physics Chapter 3",
  description: "Interactive Cambridge IGCSE Physics teaching material for waves: wave properties and v = fλ, reflection, refraction and total internal reflection, lenses, dispersion, the electromagnetic spectrum and sound.",
  openGraph: {
    title: "Field Notes · Waves",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 3.",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Field Notes: Waves" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes · Waves",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 3.",
    images: [socialImage],
  },
};

export default function Chapter3Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
