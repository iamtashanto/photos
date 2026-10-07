import { collections } from "@/data/collections";
import { photos } from "@/data/photos";
import type { Photo, PhotoCategory } from "@/types/photography";

const orderPhotos = (items: Photo[]) => [...items].sort((a, b) =>
  (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
  || b.dateAdded.localeCompare(a.dateAdded)
  || (b.dateCaptured ?? "").localeCompare(a.dateCaptured ?? "")
  || a.slug.localeCompare(b.slug));

export const getAllPhotos = () => orderPhotos(photos);
export const getFeaturedPhotos = () => [...photos]
  .filter((photo) => photo.homepageFeatured || photo.featured)
  .sort((a, b) => (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER) || b.dateAdded.localeCompare(a.dateAdded));
export const getLatestPhotos = (limit = 4) => [...photos].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, limit);
export const getRecentPhotos = getLatestPhotos;
export const getPhotoBySlug = (slug: string) => photos.find((photo) => photo.slug === slug);
export const getPhotosByCategory = (category: PhotoCategory) => orderPhotos(photos.filter((photo) => photo.category === category));
export const getPhotosByTag = (tag: string) => orderPhotos(photos.filter((photo) => photo.tags.some((item) => item.toLowerCase() === tag.toLowerCase())));
export const getPhotosByYear = (year: number) => orderPhotos(photos.filter((photo) => photo.dateCaptured?.startsWith(String(year))));
export const getPhotosByCamera = (camera: string) => orderPhotos(photos.filter((photo) => photo.camera?.toLowerCase() === camera.toLowerCase()));
export const getCollectionBySlug = (slug: string) => collections.find((collection) => collection.slug === slug);
export const getCollectionPhotos = (slug: string) => { const collection = getCollectionBySlug(slug); return collection ? getPhotosByCategory(collection.name) : []; };
export const getCollectionCover = (slug: string) => { const collection = getCollectionBySlug(slug); if (!collection) return undefined; const collectionPhotos = getPhotosByCategory(collection.name); return (collection.coverPhotoSlug && getPhotoBySlug(collection.coverPhotoSlug)) || collectionPhotos[0]; };
export const getAdjacentPhotos = (slug: string) => {
  const ordered = getAllPhotos();
  const index = ordered.findIndex((photo) => photo.slug === slug);
  return { previous: index > 0 ? ordered[index - 1] : ordered.at(-1), next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : ordered[0] };
};

export const formatPhotoDate = (date?: string, detailed = false) => date
  ? new Intl.DateTimeFormat("en-GB", { day: detailed ? "numeric" : undefined, month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date.slice(0, 10)}T00:00:00Z`))
  : "Date not recorded";
export const getPhotoYear = (photo: Photo) => photo.dateCaptured?.slice(0, 4) ?? photo.dateAdded.slice(0, 4);
export const getPhotoLocation = (photo: Photo) => [photo.location || photo.city, photo.country].filter(Boolean).join(", ") || "Location not recorded";
