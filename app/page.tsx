import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PhotoImage } from "@/components/photo/photo-image";
import { collections } from "@/data/collections";
import { getFeaturedPhotos, getPhotoBySlug, getRecentPhotos } from "@/lib/photos";

export default function Home() {
  const featured = getFeaturedPhotos();
  const recent = getRecentPhotos(4);
  const hero = featured[0];
  return (
    <>
      <section className="home-hero">
        <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" quality={90} />
        <div className="hero-shade" />
        <div className="hero-copy"><p>Md Tanvir Ahamed Shanto</p><h1>Stories through<br /><em>light, color & time.</em></h1></div>
        <div className="hero-index"><span>Dhaka, Bangladesh</span><Link href={`/photo/${hero.slug}`}>{hero.title} <ArrowUpRight /></Link></div>
        <a className="scroll-cue" href="#selected" aria-label="Scroll to selected work"><ArrowDown /></a>
      </section>

      <section className="section selected-work" id="selected">
        <div className="section-heading"><p>01 / Selected work</p><h2>Frames I keep<br />returning to.</h2></div>
        <div className="editorial-grid">
          {featured.slice(0, 3).map((photo, index) => <Link href={`/photo/${photo.slug}`} className={`editorial-item item-${index + 1}`} key={photo.id}><PhotoImage photo={photo} sizes={index === 0 ? "(max-width: 700px) 100vw, 62vw" : "(max-width: 700px) 100vw, 34vw"} /><p><span>{photo.title}</span><small>{photo.location} · {photo.date.slice(0, 4)}</small></p></Link>)}
        </div>
        <Link className="text-link" href="/gallery">Explore the complete gallery <ArrowUpRight /></Link>
      </section>

      <section className="statement"><p>“Fragments of places, people and moments<br />I wanted to remember.”</p></section>

      <section className="section home-collections">
        <div className="section-heading inline"><p>02 / Collections</p><h2>Stories, in chapters.</h2></div>
        <div className="collection-list">{collections.map((collection, index) => { const cover = getPhotoBySlug(collection.coverPhotoSlug)!; return <Link href={`/collections/${collection.slug}`} className="collection-row" key={collection.slug}><span>0{index + 1}</span><h3>{collection.name}</h3><p>{collection.description}</p><div><PhotoImage photo={cover} sizes="280px" fill /></div><ArrowUpRight /></Link>; })}</div>
      </section>

      <section className="section recent-section">
        <div className="section-heading inline"><p>03 / Latest frames</p><h2>Recently added.</h2></div>
        <div className="recent-strip">{recent.map((photo) => <Link href={`/photo/${photo.slug}`} key={photo.id}><PhotoImage photo={photo} sizes="(max-width: 700px) 75vw, 25vw" /><span>{photo.title}</span></Link>)}</div>
      </section>
    </>
  );
}
