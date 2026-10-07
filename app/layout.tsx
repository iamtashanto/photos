import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getFeaturedPhotos } from "@/lib/photos";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: ["400", "500", "600"] });
const defaultImage = getFeaturedPhotos()[0];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "TA Shanto — Photography", template: "%s — TA Shanto Photography" },
  description: "Photography portfolio of TA Shanto, a Dhaka-based photographer documenting streets, people, landscapes and everyday life across Bangladesh and beyond.",
  keywords: ["TA Shanto Photography", "Bangladesh photographer", "Dhaka street photography", "Bangladesh photography", "travel photography Bangladesh", "photography portfolio Bangladesh"],
  authors: [{ name: "TA Shanto", url: "https://tashanto.com" }],
  creator: "TA Shanto",
  publisher: "TA Shanto",
  category: "Photography",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", url: SITE_URL, siteName: SITE_NAME, locale: "en_US", title: "TA Shanto — Photography", description: "Street, travel, portrait and landscape photography from Bangladesh and beyond.", images: [{ url: defaultImage.src, width: defaultImage.width, height: defaultImage.height, alt: defaultImage.alt }] },
  twitter: { card: "summary_large_image", title: "TA Shanto — Photography", description: "Street, travel, portrait and landscape photography from Bangladesh and beyond.", images: [defaultImage.src] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { colorScheme: "dark light", themeColor: "#090909" };

const themeScript = `(function(){try{var saved=localStorage.getItem('ta-shanto-theme');var theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

const structuredData = {
  "@context": "https://schema.org", "@graph": [
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, description: "The photography portfolio of TA Shanto." },
    { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "TA Shanto", url: "https://tashanto.com", jobTitle: "Photographer", homeLocation: { "@type": "Place", name: "Dhaka, Bangladesh" }, sameAs: [absoluteUrl("/"), "https://tashanto.com"] },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><a className="skip-link" href="#main">Skip to content</a><Navbar /><main id="main">{children}</main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></body></html>;
}
