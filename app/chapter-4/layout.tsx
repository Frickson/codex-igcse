import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png`;

export const metadata: Metadata = {
  title: "Field Notes · IGCSE Physics Chapter 4",
  description: "Interactive Cambridge IGCSE Physics teaching material for electricity and magnetism.",
  openGraph: {
    title: "Field Notes · Electricity & Magnetism",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 4.",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Field Notes: Electricity and Magnetism" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes · Electricity & Magnetism",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 4.",
    images: [socialImage],
  },
};

export default function Chapter4Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
