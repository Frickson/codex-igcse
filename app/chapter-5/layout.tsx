import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png`;

export const metadata: Metadata = {
  title: "Field Notes · IGCSE Physics Chapter 5",
  description: "Interactive Cambridge IGCSE Physics teaching material for nuclear physics: the nuclear model of the atom and radioactivity.",
  openGraph: {
    title: "Field Notes · Nuclear Physics",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 5.",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Field Notes: Nuclear Physics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes · Nuclear Physics",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 5.",
    images: [socialImage],
  },
};

export default function Chapter5Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
