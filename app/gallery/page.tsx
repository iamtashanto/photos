import type { Metadata } from "next";
import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { getAllPhotos } from "@/lib/photos";
import { absoluteUrl, breadcrumbSchema, createPageMetadata, photoCreator } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("Gallery", "Explore TA Shanto’s photography archive: street, travel, portrait, landscape and documentary photographs from Bangladesh and beyond.", "/gallery");

export default async function GalleryPage() {
  const photos = await getAllPhotos();
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": absoluteUrl("/gallery"), name: "TA Shanto Photography Gallery", description: "Street, travel, portrait, landscape and documentary photography from Bangladesh and beyond.", url: absoluteUrl("/gallery"), mainEntity: { "@type": "ItemList", numberOfItems: photos.length, itemListElement: photos.map((photo, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/photo/${photo.slug}`), item: { "@type": "ImageObject", name: photo.title, contentUrl: absoluteUrl(photo.src), creator: { "@type": "Person", name: photoCreator(photo) } } })) } },
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }]),
  ] };
  return <div className="mx-auto max-w-[112rem] px-[var(--space-page)] pb-36 pt-[clamp(8rem,14vw,12rem)]"><header className="mb-[clamp(4rem,8vw,8rem)] grid grid-cols-[minmax(11rem,1fr)_2fr] items-end gap-8 max-md:grid-cols-1"><p className="m-0 text-xs uppercase tracking-[.2em] text-[var(--muted)]">Archive / {String(photos.length).padStart(2, "0")} frames</p><h1 className="m-0 font-[family-name:var(--serif)] text-[clamp(4.2rem,7.6vw,8.5rem)] leading-[.84] tracking-[-.05em]">The Gallery</h1><span className="col-start-2 max-w-md text-[var(--muted)] max-md:col-start-1">People, weather, streets and the spaces in between.</span></header><GalleryExperience photos={photos} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></div>;
}
