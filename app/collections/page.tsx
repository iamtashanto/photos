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
    <div className="mx-auto max-w-[112rem] px-[var(--space-page)] pb-36 pt-[clamp(8rem,14vw,12rem)]">
      <header className="mb-[clamp(4rem,8vw,8rem)] grid grid-cols-[minmax(11rem,1fr)_2fr] items-end gap-8 max-md:grid-cols-1">
        <p className="m-0 text-xs uppercase tracking-[.2em] text-[var(--muted)]">Fourteen visual journals</p>
        <h1 className="m-0 font-[family-name:var(--serif)] text-[clamp(4.2rem,7.6vw,8.5rem)] leading-[.84] tracking-[-.05em]">Collections</h1>
        <span className="col-start-2 text-[var(--muted)] max-md:col-start-1">Not categories so much as different ways of looking.</span>
      </header>

      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {collectionData.map(({ collection, photo, count }, index) => {
          return (
            <Link
              href={`/collections/${collection.slug}`}
              key={collection.slug}
              className="group relative flex h-[clamp(28rem,48vw,48rem)] items-end overflow-hidden bg-neutral-900 p-7 text-white"
              aria-label={`${collection.name} — ${count} ${count === 1 ? "photograph" : "photographs"}`}
            >
              {photo && (
                <PhotoImage className="absolute inset-0 [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.02]" photo={photo} fill sizes="(max-width: 700px) 100vw, 50vw" />
              )}
              <span className="absolute left-7 top-7 z-[2] text-xs tracking-widest" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-transparent" />
              <div className="relative z-[2]" aria-hidden="true">
                <h2 className="m-0 font-[family-name:var(--serif)] text-[clamp(3rem,5vw,5.5rem)] leading-[.9]">{collection.name}</h2>
                <p className="mt-2 text-xs uppercase tracking-widest text-stone-300">
                  {count} {count === 1 ? "photograph" : "photographs"}
                </p>
              </div>
              <ArrowUpRight className="absolute bottom-8 right-8 z-[2] size-5" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
