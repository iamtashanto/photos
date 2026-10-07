import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeHero } from "@/components/home/home-hero";
import { Reveal } from "@/components/motion/reveal";
import { PhotoImage } from "@/components/photo/photo-image";
import { collections } from "@/data/collections";
import { getCollectionCover, getFeaturedPhotos, getPhotoLocation, getPhotoYear, getRecentPhotos } from "@/lib/photos";

export default function Home() {
  const featured = getFeaturedPhotos();
  const recent = getRecentPhotos(4);
  const hero = featured[0];
  return (
    <>
      <HomeHero photo={hero} />

      <section className="section selected-work" id="selected">
        <Reveal className="section-heading"><p>01 / Selected work</p><h2>Frames I keep<br />returning to.</h2></Reveal>
        <div className="editorial-grid">
          {featured.slice(0, 3).map((photo, index) => <Link href={`/photo/${photo.slug}`} className={`editorial-item item-${index + 1}`} key={photo.id}><PhotoImage photo={photo} sizes={index === 0 ? "(max-width: 700px) 100vw, 62vw" : "(max-width: 700px) 100vw, 34vw"} /><p><span>{photo.title}</span><small>{getPhotoLocation(photo)} · {getPhotoYear(photo)}</small></p></Link>)}
        </div>
        <Link className="text-link" href="/gallery">Explore the complete gallery <ArrowUpRight /></Link>
      </section>

      <section className="statement"><Reveal><p>“Fragments of places, people and moments<br />I wanted to remember.”</p></Reveal></section>

      <section className="section home-collections">
        <Reveal className="section-heading inline"><p>02 / Collections</p><h2>Stories, in chapters.</h2></Reveal>
        <div className="collection-list">{collections.map((collection, index) => { const cover = getCollectionCover(collection.slug); return <Link href={`/collections/${collection.slug}`} className="collection-row" key={collection.slug}><span>{String(index + 1).padStart(2, "0")}</span><h3>{collection.name}</h3><p>{collection.description}</p>{cover && <div><PhotoImage photo={cover} sizes="280px" fill /></div>}<ArrowUpRight /></Link>; })}</div>
      </section>

      <section className="section recent-section">
        <Reveal className="section-heading inline"><p>03 / Latest frames</p><h2>Recently added.</h2></Reveal>
        <div className="recent-strip">{recent.map((photo) => <Link href={`/photo/${photo.slug}`} key={photo.id}><PhotoImage photo={photo} sizes="(max-width: 700px) 75vw, 25vw" /><span>{photo.title}</span></Link>)}</div>
      </section>
    </>
  );
}
