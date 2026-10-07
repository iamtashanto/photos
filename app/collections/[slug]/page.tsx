import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { collections } from "@/data/collections";
import { getCollectionBySlug, getPhotosByCategory } from "@/lib/photos";

export function generateStaticParams() { return collections.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const collection = getCollectionBySlug(slug); if (!collection) return {};
  return { title: `${collection.name} Photography`, description: collection.description, alternates: { canonical: `/collections/${slug}` } };
}
export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const collection = getCollectionBySlug(slug); if (!collection) notFound(); const photos = getPhotosByCategory(collection.name);
  return <div className="page-shell collection-detail"><header className="page-intro"><p>Collection / {String(photos.length).padStart(2, "0")} frames</p><h1>{collection.name}</h1><span>{collection.description}</span></header><GalleryExperience photos={photos} showFilters={false} /></div>;
}
