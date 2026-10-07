import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/shared/share-button";
import {
  formatPhotoDate,
  getAdjacentPhotos,
  getAllPhotos,
  getCollections,
  getPhotoBySlug,
  getPhotoLocation,
} from "@/lib/photos";
import { getPhotoUrl } from "@/lib/image-source";
import {
  SITE_NAME,
  absoluteUrl,
  breadcrumbSchema,
  photoCreator,
  photoSeoDescription,
} from "@/lib/seo";

export async function generateStaticParams() {
  return (await getAllPhotos()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);
  if (!photo) return {};
  const description = photoSeoDescription(photo);
  // Ensure publishedTime is a full ISO 8601 string (some OG parsers reject date-only strings)
  const publishedTime = photo.dateCaptured
    ? photo.dateCaptured.length === 10
      ? `${photo.dateCaptured}T00:00:00Z`
      : photo.dateCaptured
    : photo.dateAdded.length === 10
      ? `${photo.dateAdded}T00:00:00Z`
      : photo.dateAdded;
  return {
    title: photo.title,
    description,
    alternates: { canonical: `/photo/${slug}` },
    openGraph: {
      type: "article",
      url: `/photo/${slug}`,
      siteName: SITE_NAME,
      title: `${photo.title} — TA Shanto Photography`,
      description,
      publishedTime,
      images: [{ url: photo.src, width: photo.width, height: photo.height, alt: photo.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${photo.title} — TA Shanto Photography`,
      description,
      images: [{ url: photo.src, alt: photo.alt }],
    },
  };
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);
  if (!photo) notFound();

  const { previous, next } = await getAdjacentPhotos(slug);
  // Guard: if somehow adjacent is missing (empty photo set), fall back to gallery
  const prevSlug = previous?.slug;
  const nextSlug = next?.slug;

  const collection = (await getCollections()).find((item) => item.name === photo.category);
  // Guard: if the photo's category doesn't match any collection, surface gracefully
  if (!collection) notFound();

  const creator = photoCreator(photo);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ImageObject",
        "@id": `${absoluteUrl(`/photo/${slug}`)}#image`,
        name: photo.title,
        description: photo.description || photo.alt,
        contentUrl: absoluteUrl(photo.src),
        url: absoluteUrl(`/photo/${slug}`),
        width: photo.width,
        height: photo.height,
        representativeOfPage: true,
        dateCreated: photo.dateCaptured,
        creator: { "@type": "Person", name: creator },
        copyrightNotice:
          photo.copyright || (photo.credit ? `Photo by ${creator}` : "© TA Shanto"),
        ...(photo.location || photo.city || photo.country
          ? { locationCreated: { "@type": "Place", name: getPhotoLocation(photo) } }
          : {}),
        keywords: photo.tags.join(", "),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Gallery", path: "/gallery" },
        { name: photo.title, path: `/photo/${slug}` },
      ]),
    ],
  };

  return (
    <article className="photo-page">
      <figure
        className={`photo-stage ${photo.orientation}`}
        style={{ aspectRatio: `${photo.width}/${photo.height}` }}
      >
        <Image
          src={getPhotoUrl(photo)}
          alt={photo.alt}
          fill
          preload
          sizes="100vw"
          quality={92}
          placeholder={photo.blurDataURL ? "blur" : "empty"}
          blurDataURL={photo.blurDataURL}
        />
        <figcaption className="sr-only">
          {photo.title}
          {photo.location || photo.city || photo.country
            ? `, photographed in ${getPhotoLocation(photo)}`
            : ""}
          .
        </figcaption>
      </figure>

      <div className="photo-story">
        <header>
          <p>
            <Link href={`/collections/${collection.slug}`}>{photo.category}</Link>
            {photo.location || photo.city ? ` / ${photo.location || photo.city}` : ""}
          </p>
          <h1>{photo.title}</h1>
          <ShareButton
            downloadUrl={getPhotoUrl(photo)}
            downloadName={`${photo.slug}${photo.src.slice(photo.src.lastIndexOf("."))}`}
          />
        </header>

        <div className="story-copy">
          <div className="story-prose">
            <p className="story-label">Description</p>
            <p className="story-description">{photo.description || photo.alt}</p>
            {photo.story && (
              <>
                <p className="story-label">Story</p>
                <p className="story-narrative">{photo.story}</p>
              </>
            )}
          </div>
          <div className="metadata">
            <dl>
              {photo.dateCaptured && (
                <div>
                  <dt>Captured</dt>
                  <dd>{formatPhotoDate(photo.dateCaptured, true)}</dd>
                </div>
              )}
              <div>
                <dt>Location</dt>
                <dd>{getPhotoLocation(photo)}</dd>
              </div>
              {photo.camera && (
                <div>
                  <dt>Camera</dt>
                  <dd>{photo.camera}</dd>
                </div>
              )}
              {(photo.lens || photo.focalLength) && (
                <div>
                  <dt>Lens</dt>
                  <dd>{[photo.lens, photo.focalLength].filter(Boolean).join(" · ")}</dd>
                </div>
              )}
              {photo.aperture && photo.aperture !== "Not recorded" && (
                <div>
                  <dt>Aperture</dt>
                  <dd>{photo.aperture}</dd>
                </div>
              )}
              {photo.shutterSpeed && photo.shutterSpeed !== "Not recorded" && (
                <div>
                  <dt>Shutter</dt>
                  <dd>{photo.shutterSpeed}</dd>
                </div>
              )}
              {photo.iso !== undefined && photo.iso > 0 && (
                <div>
                  <dt>ISO</dt>
                  <dd>{photo.iso}</dd>
                </div>
              )}
              {photo.credit && (
                <div>
                  <dt>Photo Credit</dt>
                  <dd>
                    {photo.sourceUrl ? (
                      <a href={photo.sourceUrl} target="_blank" rel="noreferrer">
                        {photo.credit} ↗
                      </a>
                    ) : (
                      photo.credit
                    )}
                  </dd>
                </div>
              )}
            </dl>
            {photo.tags.length > 0 && (
              <p aria-label="Tags">
                {photo.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>

      <nav className="adjacent" aria-label="Adjacent photographs">
        {prevSlug ? (
          <Link href={`/photo/${prevSlug}`}>
            <ArrowLeft aria-hidden="true" />
            <span>
              Previous frame
              <small>{previous!.title}</small>
            </span>
          </Link>
        ) : (
          <span className="adjacent-placeholder" aria-hidden="true" />
        )}
        {nextSlug ? (
          <Link href={`/photo/${nextSlug}`} style={{ justifyContent: "flex-end", textAlign: "right" }}>
            <span>
              Next frame
              <small>{next!.title}</small>
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
        ) : (
          <span className="adjacent-placeholder" aria-hidden="true" />
        )}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
    </article>
  );
}
