import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/shared/share-button";
import { photos } from "@/data/photos";
import { formatPhotoDate, getAdjacentPhotos, getPhotoBySlug } from "@/lib/photos";

export function generateStaticParams() { return photos.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const photo = getPhotoBySlug(slug); if (!photo) return {};
  return { title: photo.title, description: photo.description, alternates: { canonical: `/photo/${slug}` }, openGraph: { type: "article", title: `${photo.title} — Tashanto Photography`, description: photo.description, images: [{ url: photo.src, width: photo.width, height: photo.height, alt: photo.alt }] }, twitter: { card: "summary_large_image", title: photo.title, description: photo.description, images: [photo.src] } };
}
export default async function PhotoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const photo = getPhotoBySlug(slug); if (!photo) notFound(); const { previous, next } = getAdjacentPhotos(slug);
  const schema = { "@context": "https://schema.org", "@type": "ImageObject", name: photo.title, description: photo.description, contentUrl: `https://photos.tashanto.com${photo.src}`, dateCreated: photo.date, creator: { "@type": "Person", name: "Md Tanvir Ahamed Shanto" } };
  return <article className="photo-page"><div className="photo-stage" style={{ aspectRatio: `${photo.width}/${photo.height}` }}><Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" quality={92} /></div><div className="photo-story"><header><p>{photo.category} / {photo.location}</p><h1>{photo.title}</h1><ShareButton /></header><div className="story-copy"><p>{photo.description}</p><div className="metadata"><dl><div><dt>Captured</dt><dd>{formatPhotoDate(photo.date, true)}</dd></div><div><dt>Location</dt><dd>{photo.location}, {photo.country}</dd></div><div><dt>Camera</dt><dd>{photo.camera}</dd></div><div><dt>Lens</dt><dd>{photo.lens} · {photo.focalLength}</dd></div><div><dt>Exposure</dt><dd>{photo.aperture} · {photo.shutterSpeed} · ISO {photo.iso}</dd></div></dl><p>{photo.tags.map((tag) => <span key={tag}>#{tag}</span>)}</p></div></div></div><nav className="adjacent" aria-label="Adjacent photographs"><Link href={`/photo/${previous!.slug}`}><ArrowLeft /><span>Previous frame<small>{previous!.title}</small></span></Link><Link href={`/photo/${next!.slug}`}><span>Next frame<small>{next!.title}</small></span><ArrowRight /></Link></nav><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></article>;
}
