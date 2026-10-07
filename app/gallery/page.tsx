import type { Metadata } from "next";
import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { getAllPhotos } from "@/lib/photos";
import { absoluteUrl, breadcrumbSchema, createPageMetadata, photoCreator } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("Gallery", "Explore TA Shanto’s photography archive: street, travel, portrait, landscape and documentary photographs from Bangladesh and beyond.", "/gallery");

export default function GalleryPage() {
  const photos = getAllPhotos();
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": absoluteUrl("/gallery"), name: "TA Shanto Photography Gallery", description: "Street, travel, portrait, landscape and documentary photography from Bangladesh and beyond.", url: absoluteUrl("/gallery"), mainEntity: { "@type": "ItemList", numberOfItems: photos.length, itemListElement: photos.map((photo, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/photo/${photo.slug}`), item: { "@type": "ImageObject", name: photo.title, contentUrl: absoluteUrl(photo.src), creator: { "@type": "Person", name: photoCreator(photo) } } })) } },
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }]),
  ] };
  return <div className="page-shell gallery-page"><header className="page-intro"><p>Archive / {String(photos.length).padStart(2, "0")} frames</p><h1>The Gallery</h1><span>People, weather, streets and the spaces in between.</span></header><GalleryExperience photos={photos} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></div>;
}
