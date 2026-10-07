import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: ["400", "500", "600"] });
const siteUrl = "https://photos.tashanto.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "TA Shanto — Photography", template: "%s — TA Shanto Photography" },
  description: "A personal photography portfolio by TA Shanto: quiet stories of people, places, light and time.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: siteUrl, siteName: "TA Shanto Photography", title: "TA Shanto — Photography", description: "Stories through light, color and time." },
  twitter: { card: "summary_large_image", title: "TA Shanto — Photography", description: "Stories through light, color and time." },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#0a0a0a" };

const structuredData = {
  "@context": "https://schema.org", "@graph": [
    { "@type": "WebSite", name: "TA Shanto Photography", url: siteUrl },
    { "@type": "Person", name: "TA Shanto", url: "https://tashanto.com", jobTitle: "Photographer" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${serif.variable}`}><body><a className="skip-link" href="#main">Skip to content</a><Navbar /><main id="main">{children}</main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></body></html>;
}
