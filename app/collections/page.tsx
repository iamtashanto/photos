import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PhotoImage } from "@/components/photo/photo-image";
import { collections } from "@/data/collections";
import { getPhotoBySlug, getPhotosByCategory } from "@/lib/photos";

export const metadata: Metadata = { title: "Collections", description: "Photography stories organized by subject and place.", alternates: { canonical: "/collections" } };

export default function CollectionsPage() {
  return <div className="page-shell collections-page"><header className="page-intro"><p>Five visual journals</p><h1>Collections</h1><span>Not categories so much as different ways of looking.</span></header><div className="collections-grid">{collections.map((collection, index) => { const photo = getPhotoBySlug(collection.coverPhotoSlug)!; const count = getPhotosByCategory(collection.name).length; return <Link href={`/collections/${collection.slug}`} key={collection.slug} className="collection-card"><PhotoImage photo={photo} fill sizes="(max-width: 700px) 100vw, 50vw" /><span>0{index + 1}</span><div><h2>{collection.name}</h2><p>{count} {count === 1 ? "photograph" : "photographs"}</p></div><ArrowUpRight /></Link>; })}</div></div>;
}
