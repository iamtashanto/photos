import { collections } from "@/data/collections";
import { photos } from "@/data/photos";
import type { PhotoCategory } from "@/types/photography";

export const getAllPhotos = () => photos;
export const getFeaturedPhotos = () => photos.filter((photo) => photo.featured);
export const getRecentPhotos = (limit = 4) => [...photos].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
export const getPhotoBySlug = (slug: string) => photos.find((photo) => photo.slug === slug);
export const getPhotosByCategory = (category: PhotoCategory) => photos.filter((photo) => photo.category === category);
export const getCollectionBySlug = (slug: string) => collections.find((collection) => collection.slug === slug);
export const getAdjacentPhotos = (slug: string) => {
  const index = photos.findIndex((photo) => photo.slug === slug);
  return { previous: index > 0 ? photos[index - 1] : photos.at(-1), next: index < photos.length - 1 ? photos[index + 1] : photos[0] };
};

export const formatPhotoDate = (date: string, detailed = false) =>
  new Intl.DateTimeFormat("en-GB", { day: detailed ? "numeric" : undefined, month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
