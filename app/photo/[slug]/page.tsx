import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/shared/share-button";
import { collections } from "@/data/collections";
import { photos } from "@/data/photos";
import { formatPhotoDate, getAdjacentPhotos, getPhotoBySlug } from "@/lib/photos";
import { SITE_NAME, absoluteUrl, breadcrumbSchema, photoCreator, photoSeoDescription } from "@/lib/seo";

export function generateStaticParams() { return photos.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);
  if (!photo) return {};
  const description = photoSeoDescription(photo);
  return {
    title: photo.title,
    description,
    alternates: { canonical: `/photo/${slug}` },
    openGraph: { type: "article", url: `/photo/${slug}`, siteName: SITE_NAME, title: `${photo.title} — TA Shanto Photography`, description, publishedTime: photo.date, images: [{ url: photo.src, width: photo.width, height: photo.height, alt: photo.alt }] },
    twitter: { card: "summary_large_image", title: `${photo.title} — TA Shanto Photography`, description, images: [{ url: photo.src, alt: photo.alt }] },
  };
}
export default async function PhotoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);
  if (!photo) notFound();
  const { previous, next } = getAdjacentPhotos(slug);
  const collection = collections.find((item) => item.name === photo.category)!;
  const creator = photoCreator(photo);
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "ImageObject", "@id": `${absoluteUrl(`/photo/${slug}`)}#image`, name: photo.title, description: photo.description, contentUrl: absoluteUrl(photo.src), url: absoluteUrl(`/photo/${slug}`), width: photo.width, height: photo.height, representativeOfPage: true, dateCreated: photo.date, creator: { "@type": "Person", name: creator }, copyrightNotice: photo.credit ? `Photo by ${creator}` : "© TA Shanto", locationCreated: { "@type": "Place", name: `${photo.location}, ${photo.country}` }, keywords: photo.tags.join(", ") },
    breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }, { name: photo.title, path: `/photo/${slug}` }]),
  ] };
  return <article className="photo-page"><figure className={`photo-stage ${photo.orientation}`} style={{ aspectRatio: `${photo.width}/${photo.height}` }}><Image src={photo.src} alt={photo.alt} fill preload sizes="100vw" quality={92} /><figcaption className="sr-only">{photo.title}, photographed in {photo.location}, {photo.country}.</figcaption></figure><div className="photo-story"><header><p><Link href={`/collections/${collection.slug}`}>{photo.category}</Link> / {photo.location}</p><h1>{photo.title}</h1><ShareButton /></header><div className="story-copy"><p>{photo.description}</p><div className="metadata"><dl><div><dt>Captured</dt><dd>{formatPhotoDate(photo.date, true)}</dd></div><div><dt>Location</dt><dd>{photo.location}, {photo.country}</dd></div><div><dt>Camera</dt><dd>{photo.camera}</dd></div><div><dt>Lens</dt><dd>{photo.lens} · {photo.focalLength}</dd></div><div><dt>Aperture</dt><dd>{photo.aperture}</dd></div><div><dt>Shutter</dt><dd>{photo.shutterSpeed}</dd></div><div><dt>ISO</dt><dd>{photo.iso || "Not recorded"}</dd></div>{photo.credit && <div><dt>Photo Credit</dt><dd>{photo.sourceUrl ? <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.credit} ↗</a> : photo.credit}</dd></div>}</dl><p>{photo.tags.map((tag) => <span key={tag}>#{tag}</span>)}</p></div></div></div><nav className="adjacent" aria-label="Adjacent photographs"><Link href={`/photo/${previous!.slug}`}><ArrowLeft /><span>Previous frame<small>{previous!.title}</small></span></Link><Link href={`/photo/${next!.slug}`}><span>Next frame<small>{next!.title}</small></span><ArrowRight /></Link></nav><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></article>;
}
