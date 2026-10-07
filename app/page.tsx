import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { Reveal } from "@/components/motion/reveal";
import { PhotoImage } from "@/components/photo/photo-image";
import {
  getCollectionCover,
  getFeaturedPhotos,
  getPhotoLocation,
  getPhotosByCategory,
  getPhotoYear,
  getRecentPhotos,
  getCollections,
} from "@/lib/photos";

export default async function Home() {
  const [featured, recent, collections] = await Promise.all([getFeaturedPhotos(), getRecentPhotos(4), getCollections()]);
  const hero = featured[0];
  const selected = featured.filter((photo) => photo.id !== hero.id).slice(0, 4);
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

      <section className="section selected-work" id="selected">
        <Reveal className="section-heading">
          <p>01 / Selected work</p>
          <h2>
            Frames worth<br />
            staying with.
          </h2>
        </Reveal>
        <div className="editorial-grid">
          {selected.map((photo, index) => (
            <Link
              href={`/photo/${photo.slug}`}
              className={`editorial-item item-${index + 1}`}
              key={photo.id}
            >
              <PhotoImage
                photo={photo}
                sizes={
                  index === 0
                    ? "(max-width: 700px) 100vw, 58vw"
                    : "(max-width: 700px) 100vw, 36vw"
                }
              />
              <p>
                <span>{photo.title}</span>
                <small>{getPhotoLocation(photo)} · {getPhotoYear(photo)}</small>
              </p>
            </Link>
          ))}
        </div>
        <Link className="text-link" href="/gallery">
          Explore the complete gallery <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <section className="statement" aria-label="Artist statement">
        <Reveal>
          <span>Artist statement</span>
          <p>
            &ldquo;Fragments of places, people and moments<br />
            I wanted to remember.&rdquo;
          </p>
        </Reveal>
      </section>

      <section className="section home-collections">
        <Reveal className="section-heading inline">
          <p>02 / Collections</p>
          <h2>Stories, in chapters.</h2>
        </Reveal>
        <div className="home-collection-grid">
          {homeCollectionData.map(({ collection, cover, count }, index) => {
            return (
              <Link
                href={`/collections/${collection.slug}`}
                className="home-collection-card"
                key={collection.slug}
                aria-label={`${collection.name} — ${count} ${count === 1 ? "photograph" : "photographs"}`}
              >
                {cover && (
                  <PhotoImage
                    photo={cover}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 34vw"
                    fill
                  />
                )}
                <span className="home-collection-shade" aria-hidden="true" />
                <span className="home-collection-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div aria-hidden="true">
                  <h3>{collection.name}</h3>
                  <p>
                    {count} {count === 1 ? "photograph" : "photographs"}
                  </p>
                </div>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            );
          })}
        </div>
        <Link className="text-link" href="/collections">
          View all collections <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <section className="section recent-section">
        <Reveal className="section-heading inline">
          <p>03 / Latest frames</p>
          <h2>Recently added.</h2>
        </Reveal>
        <div className="recent-strip">
          {recent.map((photo, index) => (
            <Link href={`/photo/${photo.slug}`} key={photo.id} aria-label={photo.title}>
              <PhotoImage photo={photo} sizes="(max-width: 700px) 78vw, 25vw" />
              <div aria-hidden="true">
                <span>{photo.title}</span>
                <small>{getPhotoLocation(photo)} · {getPhotoYear(photo)}</small>
                <em>{String(index + 1).padStart(2, "0")}</em>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
