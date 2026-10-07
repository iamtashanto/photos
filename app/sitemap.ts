import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { photos } from "@/data/photos";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://photos.tashanto.com";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...["gallery", "collections", "about", "contact"].map((route) => ({ url: `${base}/${route}`, changeFrequency: "monthly" as const, priority: .7 })),
    ...collections.map(({ slug }) => ({ url: `${base}/collections/${slug}`, changeFrequency: "monthly" as const, priority: .7 })),
    ...photos.map((photo) => ({ url: `${base}/photo/${photo.slug}`, lastModified: photo.date, changeFrequency: "yearly" as const, priority: .6 })),
  ];
}
