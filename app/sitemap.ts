import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { photos } from "@/data/photos";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPhotoDate = [...photos].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))[0]?.dateAdded;
  return [
    { url: SITE_URL, lastModified: latestPhotoDate, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/gallery`, lastModified: latestPhotoDate, changeFrequency: "monthly", priority: .9 },
    { url: `${SITE_URL}/collections`, lastModified: latestPhotoDate, changeFrequency: "monthly", priority: .8 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: .6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: .5 },
    ...collections.map(({ slug, name }) => { const categoryPhotos = photos.filter((photo) => photo.category === name); const lastModified = [...categoryPhotos].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.updatedAt; return { url: `${SITE_URL}/collections/${slug}`, lastModified, changeFrequency: "monthly" as const, priority: .8 }; }),
    ...photos.map((photo) => ({ url: `${SITE_URL}/photo/${photo.slug}`, lastModified: photo.updatedAt, changeFrequency: "yearly" as const, priority: .7, images: [`${SITE_URL}${photo.src}`] })),
  ];
}
