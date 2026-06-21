import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { TransitionProvider } from "@/components/common/TransitionProvider";
import { Navbar } from "@/components/common/Navbar";
import { CanvasContainer } from "@/components/canvas/CanvasContainer";
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aura-portfolio.vercel.app"),
  title: "Dinesh Singothu // Senior Creative Developer Portfolio",
  description: "Premium interactive WebGL portfolio engineering award-winning interfaces, powered by Next.js, Three.js, GSAP, and Prisma.",
  keywords: ["WebGL", "Three.js", "GSAP", "Next.js App Router", "Creative Developer Portfolio", "Creative Director", "Dinesh Singothu"],
  authors: [{ name: "Dinesh Singothu" }],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Dinesh Singothu // Senior Creative Developer Portfolio",
    description: "Premium interactive WebGL portfolio engineering award-winning interfaces, powered by Next.js, Three.js, GSAP, and Prisma.",
    url: "https://aura-portfolio.vercel.app",
    siteName: "Aura Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/about_showcase.png",
        width: 1200,
        height: 630,
        alt: "Dinesh Singothu Portfolio Preview Screenshot",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dinesh Singothu // Senior Creative Developer Portfolio",
    description: "Premium interactive WebGL portfolio engineering award-winning interfaces, powered by Next.js, Three.js, GSAP, and Prisma.",
    images: ["/about_showcase.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TransitionProvider>
          {/* Header menu navigation */}
          <Navbar />
          
          {/* Background WebGL Scene */}
          <CanvasContainer />
          
          {/* Content layer scrollable on top of Canvas */}
          <main className="main-content">
            {children}
          </main>

          {/* Vercel Analytics */}
          <Analytics />
        </TransitionProvider>
      </body>
    </html>
  );
}
