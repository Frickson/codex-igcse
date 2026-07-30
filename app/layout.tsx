import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Field Notes · IGCSE Physics",
  description: "Interactive Cambridge IGCSE Physics teaching chapters aligned to the 2026–2028 syllabus (0625).",
  openGraph: {
    title: "Field Notes · IGCSE Physics",
    description: "Interactive Cambridge IGCSE Physics teaching chapters aligned to the 2026–2028 syllabus.",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "Field Notes: IGCSE Physics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes · IGCSE Physics",
    description: "Interactive Cambridge IGCSE Physics teaching chapters aligned to the 2026–2028 syllabus.",
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
