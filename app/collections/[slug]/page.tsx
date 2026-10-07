import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { getCollectionBySlug, getCollections, getPhotosByCategory } from "@/lib/photos";
import { SITE_NAME, absoluteUrl, breadcrumbSchema, photoCreator } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getCollections()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return {};
  const photos = await getPhotosByCategory(collection.name);
  const cover = photos.find((p) => p.slug === collection.coverPhotoSlug) ?? photos[0];
  const description = `${collection.description} Explore ${collection.name.toLowerCase()} photography by TA Shanto from Bangladesh and beyond.`;
  return {
    title: `${collection.name} Photography`,
    description,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      type: "website",
      url: `/collections/${slug}`,
      siteName: SITE_NAME,
      title: `${collection.name} Photography — TA Shanto`,
      description,
      images: cover ? [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.name} Photography — TA Shanto`,
      description,
      images: cover ? [{ url: cover.src, alt: cover.alt }] : [],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const photos = await getPhotosByCategory(collection.name);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": absoluteUrl(`/collections/${slug}`),
        name: `${collection.name} Photography`,
        description: collection.description,
        url: absoluteUrl(`/collections/${slug}`),
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: photos.length,
          itemListElement: photos.map((photo, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/photo/${photo.slug}`),
            item: {
              "@type": "ImageObject",
              name: photo.title,
              contentUrl: absoluteUrl(photo.src),
              creator: { "@type": "Person", name: photoCreator(photo) },
            },
          })),
        },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Collections", path: "/collections" },
        { name: collection.name, path: `/collections/${slug}` },
      ]),
    ],
  };

  return (
    <div className="page-shell collection-detail">
      <header className="page-intro">
        <p>Collection / {String(photos.length).padStart(2, "0")} frames</p>
        <h1>{collection.name}</h1>
        <span>{collection.description}</span>
      </header>

      <GalleryExperience photos={photos} showFilters={false} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
