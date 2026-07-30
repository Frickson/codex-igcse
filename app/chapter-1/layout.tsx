import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png`;

export const metadata: Metadata = {
  title: "Field Notes · IGCSE Physics Chapter 1",
  description: "Interactive Cambridge IGCSE Physics teaching material for motion, forces and energy: measurement, motion graphs, forces, momentum, energy and pressure.",
  openGraph: {
    title: "Field Notes · Motion, Forces & Energy",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 1.",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Field Notes: Motion, Forces & Energy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes · Motion, Forces & Energy",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 1.",
    images: [socialImage],
  },
};

export default function Chapter1Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
