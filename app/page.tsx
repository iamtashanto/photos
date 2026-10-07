import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { Reveal } from "@/components/motion/reveal";
import { PhotoImage } from "@/components/photo/photo-image";
import {
  getCollectionCover,
  getFeaturedPhotos,
  getAllPhotos,
  getPhotoLocation,
  getPhotosByCategory,
  getPhotoYear,
  getRecentPhotos,
  getCollections,
} from "@/lib/photos";

export default async function Home() {
  const [featured, recent, collections, allPhotos] = await Promise.all([getFeaturedPhotos(), getRecentPhotos(4), getCollections(), getAllPhotos()]);
  const hero = featured[0] || allPhotos[0];
  const selected = [...featured, ...allPhotos]
    .filter((photo, index, items) => photo.id !== hero.id && items.findIndex((item) => item.id === photo.id) === index)
    .slice(0, 4);
  const homeCollections = collections.filter((collection) =>
    ["street", "nature", "travel", "portrait", "architecture", "night"].includes(collection.slug),
  );
  const homeCollectionData = await Promise.all(homeCollections.map(async (collection) => ({
    collection,
    cover: await getCollectionCover(collection.slug),
    count: (await getPhotosByCategory(collection.name)).length,
  })));

  return (
    <>
      <HomeHero photo={hero} />

      <section className="mx-auto max-w-[112rem] px-[clamp(1.25rem,5vw,6rem)] py-[clamp(5rem,9vw,9rem)]" id="selected">
        <Reveal className="mb-12 grid grid-cols-[minmax(10rem,1fr)_2fr] items-end gap-8 max-md:grid-cols-1">
          <p className="m-0 text-xs uppercase tracking-[.2em] text-[var(--muted)]">01 / Selected work</p>
          <h2 className="m-0 max-w-4xl font-[family-name:var(--serif)] text-[clamp(3.4rem,6vw,6.8rem)] leading-[.88] tracking-[-.045em]">
            A closer look at<br />the world around us.
          </h2>
        </Reveal>
        <div className="grid grid-cols-12 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          {selected.map((photo, index) => (
            <Link
              href={`/photo/${photo.slug}`}
              className={`group block ${index === 0 ? "col-span-7 max-md:col-span-2 max-sm:col-span-1" : index === 1 ? "col-span-5 max-md:col-span-1" : "col-span-6 max-md:col-span-1"}`}
              key={photo.id}
            >
              <PhotoImage
                photo={photo}
                className={`${index === 0 ? "aspect-[16/10]" : index === 1 ? "aspect-[4/5]" : "aspect-[3/2]"} [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.02]`}
                sizes={
                  index === 0
                    ? "(max-width: 700px) 100vw, 58vw"
                    : "(max-width: 700px) 100vw, 36vw"
                }
              />
              <p className="mt-3 flex items-start justify-between gap-4 text-sm">
                <span className="font-medium">{photo.title}</span>
                <small className="text-right text-xs leading-relaxed text-[var(--muted)]">{getPhotoLocation(photo)} · {getPhotoYear(photo)}</small>
              </p>
            </Link>
          ))}
        </div>
        <Link className="mt-12 inline-flex items-center gap-2 border-b border-[var(--line)] pb-2 text-xs uppercase tracking-widest" href="/gallery">
          Explore the complete gallery <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <section className="grid min-h-[32rem] place-items-center border-y border-[var(--line)] px-5 py-24 text-center" aria-label="Artist statement">
        <Reveal>
          <span className="mb-7 block text-xs uppercase tracking-[.2em] text-[var(--muted)]">Artist statement</span>
          <p className="m-0 max-w-6xl text-balance font-[family-name:var(--serif)] text-[clamp(2.7rem,5vw,5.7rem)] leading-none tracking-[-.025em]">
            &ldquo;Fragments of places, people and moments<br />
            I wanted to remember.&rdquo;
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[112rem] px-[clamp(1.25rem,5vw,6rem)] py-[clamp(5rem,9vw,9rem)]">
        <Reveal className="mb-12 grid grid-cols-[minmax(10rem,1fr)_2fr] items-end gap-8 max-md:grid-cols-1">
          <p className="m-0 text-xs uppercase tracking-[.2em] text-[var(--muted)]">02 / Collections</p>
          <h2 className="m-0 font-[family-name:var(--serif)] text-[clamp(3rem,5vw,5rem)] leading-none tracking-[-.04em]">Stories, in chapters.</h2>
        </Reveal>
        <div className="grid grid-cols-12 gap-4 max-sm:grid-cols-1">
          {homeCollectionData.map(({ collection, cover, count }, index) => {
            return (
              <Link
                href={`/collections/${collection.slug}`}
                className={`group relative flex h-[clamp(24rem,34vw,36rem)] items-end overflow-hidden bg-neutral-900 p-[clamp(1.1rem,2vw,2rem)] text-stone-100 ${index < 2 ? "col-span-6" : "col-span-4"} max-md:col-span-6 max-sm:col-span-1`}
                key={collection.slug}
                aria-label={`${collection.name} — ${count} ${count === 1 ? "photograph" : "photographs"}`}
              >
                {cover && (
                  <PhotoImage
                    photo={cover}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 34vw"
                    fill className="absolute inset-0 [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.025]"
                  />
                )}
                <span className="absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-transparent to-black/10" aria-hidden="true" />
                <span className="absolute left-6 top-6 z-[2] text-xs tracking-widest" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative z-[2]" aria-hidden="true">
                  <h3 className="m-0 font-[family-name:var(--serif)] text-[clamp(2.5rem,4vw,4.5rem)] leading-[.9] tracking-[-.035em]">{collection.name}</h3>
                  <p className="mt-2 text-xs uppercase tracking-widest text-stone-300">
                    {count} {count === 1 ? "photograph" : "photographs"}
                  </p>
                </div>
                <ArrowUpRight className="absolute bottom-7 right-7 z-[2] size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
        <Link className="mt-10 inline-flex items-center gap-2 border-b border-[var(--line)] pb-2 text-xs uppercase tracking-widest" href="/collections">
          View all collections <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <section className="mx-auto max-w-[112rem] px-[clamp(1.25rem,5vw,6rem)] py-[clamp(5rem,9vw,9rem)]">
        <Reveal className="mb-12 grid grid-cols-[minmax(10rem,1fr)_2fr] items-end gap-8 max-md:grid-cols-1">
          <p className="m-0 text-xs uppercase tracking-[.2em] text-[var(--muted)]">03 / Latest frames</p>
          <h2 className="m-0 font-[family-name:var(--serif)] text-[clamp(3rem,5vw,5rem)] leading-none tracking-[-.04em]">Recently added.</h2>
        </Reveal>
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:flex max-sm:overflow-x-auto">
          {recent.map((photo, index) => (
            <Link className="group block max-sm:min-w-[78vw]" href={`/photo/${photo.slug}`} key={photo.id} aria-label={photo.title}>
              <PhotoImage className="aspect-[4/5] [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.02]" photo={photo} sizes="(max-width: 700px) 78vw, 25vw" />
              <div className="relative mt-3 grid grid-cols-[1fr_auto] gap-1 pr-8" aria-hidden="true">
                <span className="font-[family-name:var(--serif)] text-xl">{photo.title}</span>
                <small className="col-start-1 text-xs text-[var(--muted)]">{getPhotoLocation(photo)} · {getPhotoYear(photo)}</small>
                <em className="absolute right-0 top-1 not-italic text-xs text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</em>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
