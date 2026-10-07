"use client";

import Link from "next/link";
import type { Photo } from "@/types/photography";
import { PhotoImage } from "@/components/photo/photo-image";
import { getPhotoLocation, getPhotoYear } from "@/lib/photo-format";

export function PhotoCard({ photo, onOpen }: { photo: Photo; onOpen?: () => void }) {
  return (
    <figure className="relative m-0 break-inside-avoid">
      <button
        className="group relative block w-full border-0 bg-transparent p-0 text-left"
        onClick={onOpen}
        aria-label={`Open ${photo.title} in fullscreen viewer`}
      >
        <PhotoImage
          photo={photo}
          sizes="(max-width: 680px) calc(100vw - 2.5rem), (max-width: 1100px) calc(50vw - 2rem), 31vw"
        />
        <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-transparent to-transparent p-5 text-white opacity-0 transition-opacity group-hover:opacity-100 max-sm:relative max-sm:bg-none max-sm:px-0 max-sm:pt-3 max-sm:text-[var(--text)] max-sm:opacity-100" aria-hidden="true">
          <strong className="font-[family-name:var(--serif)] text-xl font-normal">{photo.title}</strong>
          <small className="text-stone-300 max-sm:text-[var(--muted)]">{getPhotoLocation(photo)} · {getPhotoYear(photo)}</small>
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
