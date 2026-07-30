import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png`;

export const metadata: Metadata = {
  title: "Field Notes · IGCSE Physics Chapter 6",
  description: "Interactive Cambridge IGCSE Physics teaching material for space physics: Earth and the Solar System, stars and the Universe.",
  openGraph: {
    title: "Field Notes · Space Physics",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 6.",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Field Notes: Space Physics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes · Space Physics",
    description: "Interactive Cambridge IGCSE Physics teaching material for Chapter 6.",
    images: [socialImage],
  },
};

export default function Chapter6Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
