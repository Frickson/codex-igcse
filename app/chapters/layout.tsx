import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png`;

export const metadata: Metadata = {
  title: "Field Notes · IGCSE Physics — Chapter directory",
  description: "Directory of interactive Cambridge IGCSE Physics teaching chapters aligned to the 2026–2028 syllabus.",
  openGraph: {
    title: "Field Notes · IGCSE Physics chapters",
    description: "Interactive, syllabus-aligned Cambridge IGCSE Physics lessons.",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Field Notes: IGCSE Physics chapters" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes · IGCSE Physics chapters",
    description: "Interactive, syllabus-aligned Cambridge IGCSE Physics lessons.",
    images: [socialImage],
  },
};

export default function ChaptersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
