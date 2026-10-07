"use client";

import Link from "next/link";
import type { Photo } from "@/types/photography";
import { PhotoImage } from "@/components/photo/photo-image";
import { getPhotoLocation, getPhotoYear } from "@/lib/photo-format";

export function PhotoCard({ photo, onOpen }: { photo: Photo; onOpen?: () => void }) {
  return (
    <figure className="photo-card-figure">
      <button
        className={`photo-card ${photo.orientation}`}
        onClick={onOpen}
        aria-label={`Open ${photo.title} in fullscreen viewer`}
      >
        <PhotoImage
          photo={photo}
          sizes="(max-width: 680px) calc(100vw - 2.5rem), (max-width: 1100px) calc(50vw - 2rem), 31vw"
        />
        <span className="photo-overlay" aria-hidden="true">
          <strong>{photo.title}</strong>
          <small>{getPhotoLocation(photo)} · {getPhotoYear(photo)}</small>
        </span>
      </button>
      {/* Visible to screen readers / keyboard nav — direct link to the photo story page */}
      <figcaption className="sr-only">
        <Link href={`/photo/${photo.slug}`}>
          {photo.title} — view photo story
        </Link>
      </figcaption>
    </figure>
  );
}
