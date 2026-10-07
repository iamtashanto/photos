import type { Metadata } from "next";
import type { Photo } from "@/types/photography";

export const SITE_URL = "https://photos.tashanto.com";
export const SITE_NAME = "TA Shanto Photography";
const DEFAULT_SOCIAL_IMAGE = "/photos/street/dhaka-umbrellas.jpg";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function photoCreator(photo: Photo) {
  return photo.credit?.split(" / ")[0] ?? "TA Shanto";
}

export function photoSeoDescription(photo: Photo) {
  return `${photo.description} ${photo.category} photography from ${photo.location}, ${photo.country}.`;
}

export function createPageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: SITE_NAME, title: `${title} — TA Shanto Photography`, description, images: [DEFAULT_SOCIAL_IMAGE] },
    twitter: { card: "summary_large_image", title: `${title} — TA Shanto Photography`, description, images: [DEFAULT_SOCIAL_IMAGE] },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
