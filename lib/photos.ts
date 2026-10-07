import { unstable_cache } from "next/cache";
import { collections as localCollections } from "@/data/collections";
import { photos as localPhotos } from "@/data/photos";
import { isDatabaseConfigured, getMongoose } from "@/lib/db";
import { PhotoModel } from "@/models/photo.model";
import { CollectionModel } from "@/models/collection.model";
import type { Collection, Photo, PhotoCategory } from "@/types/photography";
export { formatPhotoDate, getPhotoLocation, getPhotoYear } from "@/lib/photo-format";

const orderPhotos = (items: Photo[]) => [...items].sort((a, b) =>
  (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
  || (b.dateAdded || "").localeCompare(a.dateAdded || "")
  || (b.dateCaptured ?? "").localeCompare(a.dateCaptured ?? "")
  || a.slug.localeCompare(b.slug));

const readPhotos = unstable_cache(async (): Promise<Photo[]> => {
  if (!isDatabaseConfigured()) return localPhotos;
  await getMongoose();
  const items = await PhotoModel.find({ published: { $ne: false } }).lean();
  return (items.length ? items : localPhotos) as Photo[];
}, ["published-photos"], { revalidate: 300, tags: ["photos"] });

const readCollections = unstable_cache(async (): Promise<Collection[]> => {
  if (!isDatabaseConfigured()) return localCollections;
  await getMongoose();
  const items = await CollectionModel.find({ isPublished: { $ne: false } }).sort({ sortOrder: 1, name: 1 }).lean();
  return items.length ? items : localCollections;
}, ["photo-collections"], { revalidate: 300, tags: ["collections"] });

export const getAllPhotos = async () => orderPhotos(await readPhotos());
export const getFeaturedPhotos = async () => (await readPhotos()).filter((photo) => photo.homepageFeatured || photo.featured)
  .sort((a, b) => (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER) || b.dateAdded.localeCompare(a.dateAdded));
export const getLatestPhotos = async (limit = 4) => (await readPhotos()).filter((photo) => !photo.altNeedsReview).sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, limit);
export const getRecentPhotos = getLatestPhotos;
export const getPhotoBySlug = async (slug: string) => (await readPhotos()).find((photo) => photo.slug === slug);
export const getPhotosByCategory = async (category: PhotoCategory) => orderPhotos((await readPhotos()).filter((photo) => photo.category === category));
export const getPhotosByTag = async (tag: string) => orderPhotos((await readPhotos()).filter((photo) => photo.tags.some((item) => item.toLowerCase() === tag.toLowerCase())));
export const getPhotosByYear = async (year: number) => orderPhotos((await readPhotos()).filter((photo) => photo.dateCaptured?.startsWith(String(year))));
export const getPhotosByCamera = async (camera: string) => orderPhotos((await readPhotos()).filter((photo) => photo.camera?.toLowerCase() === camera.toLowerCase()));
export const getCollectionBySlug = async (slug: string) => (await readCollections()).find((collection) => collection.slug === slug);
export const getCollectionPhotos = async (slug: string) => {
  const collection = await getCollectionBySlug(slug);
  return collection ? getPhotosByCategory(collection.name) : [];
};
export const getCollectionCover = async (slug: string) => {
  const collection = await getCollectionBySlug(slug);
  if (!collection) return undefined;
  const collectionPhotos = await getPhotosByCategory(collection.name);
  return (collection.coverPhotoSlug && (await getPhotoBySlug(collection.coverPhotoSlug))) || collectionPhotos[0];
};
export const getAdjacentPhotos = async (slug: string) => {
  const ordered = await getAllPhotos();
  const index = ordered.findIndex((photo) => photo.slug === slug);
  return { previous: index > 0 ? ordered[index - 1] : ordered.at(-1), next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : ordered[0] };
};
export const getCollections = readCollections;
