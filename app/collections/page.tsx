import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PhotoImage } from "@/components/photo/photo-image";
import { getCollectionCover, getCollections, getPhotosByCategory } from "@/lib/photos";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
  "Collections",
  "Browse photography collections by TA Shanto, including street, nature, travel, portrait and architecture stories.",
  "/collections",
);

export default async function CollectionsPage() {
  const collections = await getCollections();
  const collectionData = await Promise.all(collections.map(async (collection) => ({
    collection,
    photo: await getCollectionCover(collection.slug),
    count: (await getPhotosByCategory(collection.name)).length,
  })));
  return (
    <div className="page-shell collections-page">
      <header className="page-intro">
        <p>Fourteen visual journals</p>
        <h1>Collections</h1>
        <span>Not categories so much as different ways of looking.</span>
      </header>

      <div className="collections-grid">
        {collectionData.map(({ collection, photo, count }, index) => {
          return (
            <Link
              href={`/collections/${collection.slug}`}
              key={collection.slug}
              className="collection-card"
              aria-label={`${collection.name} — ${count} ${count === 1 ? "photograph" : "photographs"}`}
            >
              {photo && (
                <PhotoImage photo={photo} fill sizes="(max-width: 700px) 100vw, 50vw" />
              )}
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div aria-hidden="true">
                <h2>{collection.name}</h2>
                <p>
                  {count} {count === 1 ? "photograph" : "photographs"}
                </p>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
