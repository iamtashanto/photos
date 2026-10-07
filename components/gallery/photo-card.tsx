"use client";

import Link from "next/link";
import type { Photo } from "@/types/photography";
import { PhotoImage } from "@/components/photo/photo-image";
import { getPhotoLocation, getPhotoYear } from "@/lib/photos";

export function PhotoCard({ photo, onOpen }: { photo: Photo; onOpen?: () => void }) {
  return (
    <figure className="photo-card-figure">
      <button className={`photo-card ${photo.orientation}`} onClick={onOpen} aria-label={`Open ${photo.title} in fullscreen viewer`}>
      <PhotoImage photo={photo} sizes="(max-width: 680px) calc(100vw - 2.5rem), (max-width: 1100px) calc(50vw - 2rem), 31vw" />
      <span className="photo-overlay"><strong>{photo.title}</strong><small>{getPhotoLocation(photo)} · {getPhotoYear(photo)}</small></span>
      </button>
      <figcaption className="sr-only"><Link href={`/photo/${photo.slug}`}>{photo.title} — {getPhotoLocation(photo)}</Link></figcaption>
    </figure>
  );
}
