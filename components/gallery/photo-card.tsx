"use client";

import type { Photo } from "@/types/photography";
import { PhotoImage } from "@/components/photo/photo-image";

export function PhotoCard({ photo, onOpen, priority = false }: { photo: Photo; onOpen?: () => void; priority?: boolean }) {
  return (
    <button className={`photo-card ${photo.orientation}`} onClick={onOpen} aria-label={`View ${photo.title}`}>
      <PhotoImage photo={photo} sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw" priority={priority} />
      <span className="photo-overlay"><strong>{photo.title}</strong><small>{photo.location} · {photo.date.slice(0, 4)}</small></span>
    </button>
  );
}
