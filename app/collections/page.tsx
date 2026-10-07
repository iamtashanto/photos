import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PhotoImage } from "@/components/photo/photo-image";
import { collections } from "@/data/collections";
import { getCollectionCover, getPhotosByCategory } from "@/lib/photos";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata("Collections", "Browse photography collections by TA Shanto, including street, nature, travel, portrait and architecture stories.", "/collections");

export default function CollectionsPage() {
  return <div className="page-shell collections-page"><header className="page-intro"><p>Fourteen visual journals</p><h1>Collections</h1><span>Not categories so much as different ways of looking.</span></header><div className="collections-grid">{collections.map((collection, index) => { const photo = getCollectionCover(collection.slug); const count = getPhotosByCategory(collection.name).length; return <Link href={`/collections/${collection.slug}`} key={collection.slug} className="collection-card">{photo && <PhotoImage photo={photo} fill sizes="(max-width: 700px) 100vw, 50vw" />}<span>{String(index + 1).padStart(2, "0")}</span><div><h2>{collection.name}</h2><p>{count} {count === 1 ? "photograph" : "photographs"}</p></div><ArrowUpRight /></Link>; })}</div></div>;
}
