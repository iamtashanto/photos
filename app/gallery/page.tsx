import type { Metadata } from "next";
import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { getAllPhotos } from "@/lib/photos";

export const metadata: Metadata = { title: "Gallery", description: "The complete photography archive of TA Shanto.", alternates: { canonical: "/gallery" } };

export default function GalleryPage() {
  const photos = getAllPhotos();
  return <div className="page-shell gallery-page"><header className="page-intro"><p>Archive / {String(photos.length).padStart(2, "0")} frames</p><h1>The Gallery</h1><span>People, weather, streets and the spaces in between.</span></header><GalleryExperience photos={photos} /></div>;
}
