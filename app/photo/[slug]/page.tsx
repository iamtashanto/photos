import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/shared/share-button";
import { PhotoLikeButton } from "@/components/photo/photo-like-button";
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
    <article className="pt-[84px] max-sm:pt-[72px]">
      <figure
        className={`relative m-0 h-[min(76svh,54rem)] min-h-[30rem] w-full bg-neutral-950 max-sm:h-[min(68svh,38rem)] max-sm:min-h-[22rem] ${photo.orientation === "portrait" ? "mx-auto max-w-[82rem]" : ""}`}
        style={{ aspectRatio: `${photo.width}/${photo.height}` }}
      >
        <Image
          src={getPhotoUrl(photo)}
          alt={photo.alt}
          fill
          preload
          sizes="100vw"
          quality={92} className="object-contain"
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

      <div className="mx-auto max-w-[112rem] px-[clamp(1.25rem,8vw,10rem)] py-[clamp(5rem,9vw,10rem)]">
        <header className="grid grid-cols-[minmax(10rem,1fr)_2fr_auto] items-end border-b border-[var(--line)] pb-12 max-md:grid-cols-[1fr_auto] max-sm:block">
          <p className="text-xs uppercase tracking-[.15em] text-[var(--muted)] max-md:col-span-2">
            <Link href={`/collections/${collection.slug}`}>{photo.category}</Link>
            {photo.location || photo.city ? ` / ${photo.location || photo.city}` : ""}
          </p>
          <h1 className="m-0 font-[family-name:var(--serif)] text-[clamp(3.5rem,6.5vw,7rem)] leading-[.9] tracking-[-.04em] max-sm:my-6">{photo.title}</h1>
          <ShareButton
            downloadUrl={getPhotoUrl(photo)}
            downloadName={`${photo.slug}${photo.src.slice(photo.src.lastIndexOf("."))}`}
          />
          <PhotoLikeButton slug={photo.slug} />
        </header>

        <div className="ml-[16%] grid grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)] gap-[clamp(3rem,7vw,8rem)] pt-16 max-lg:ml-0 max-sm:block">
          <div className="grid content-start gap-4">
            <p className="m-0 text-xs uppercase tracking-[.15em] text-[var(--muted)]">Description</p>
            <p className="mb-7 font-[family-name:var(--serif)] text-[clamp(1.45rem,2.2vw,2.15rem)] leading-tight">{photo.description || photo.alt}</p>
            {photo.story && (
              <>
                <p className="m-0 text-xs uppercase tracking-[.15em] text-[var(--muted)]">Story</p>
                <p className="mb-7 text-[clamp(1.05rem,1.35vw,1.3rem)] leading-relaxed text-[var(--muted)]">{photo.story}</p>
              </>
            )}
          </div>
          <div className="max-sm:mt-12">
            <dl className="m-0 [&_dd]:m-0 [&_div]:grid [&_div]:grid-cols-[110px_1fr] [&_div]:border-t [&_div]:border-[var(--line)] [&_div]:py-3 [&_div]:text-sm [&_dt]:text-[var(--muted)]">
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
              <p className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]" aria-label="Tags">
                {photo.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>

      <nav className="grid grid-cols-2 border-y border-[var(--line)] max-sm:grid-cols-1" aria-label="Adjacent photographs">
        {prevSlug ? (
          <Link className="flex min-h-40 items-center gap-5 px-[var(--space-page)] py-8 transition-colors hover:bg-[var(--panel)]" href={`/photo/${prevSlug}`}>
            <ArrowLeft className="size-5" aria-hidden="true" />
            <span className="grid text-xs uppercase tracking-widest text-[var(--muted)]">
              Previous frame
              <small className="mt-2 font-[family-name:var(--serif)] text-2xl normal-case tracking-normal text-[var(--text)]">{previous!.title}</small>
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {nextSlug ? (
          <Link className="flex min-h-40 items-center justify-end gap-5 border-l border-[var(--line)] px-[var(--space-page)] py-8 text-right transition-colors hover:bg-[var(--panel)] max-sm:border-l-0 max-sm:border-t" href={`/photo/${nextSlug}`}>
            <span className="grid text-xs uppercase tracking-widest text-[var(--muted)]">
              Next frame
              <small className="mt-2 font-[family-name:var(--serif)] text-2xl normal-case tracking-normal text-[var(--text)]">{next!.title}</small>
            </span>
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
    </article>
  );
}
