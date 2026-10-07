"use client";

import Image from "next/image";
import type { PhotoDocument } from "@/models/photo";

export function PhotoList({ photos, onDelete }: { photos: PhotoDocument[]; onDelete: (slug: string) => Promise<void> }) {
  if (!photos.length) return <p>No photographs found.</p>;
  return (
    <div style={{ display: "grid", gap: 12, marginTop: 48 }}>
      {photos.map((photo) => (
        <article key={photo.slug} style={{ display: "flex", gap: 16, alignItems: "center", borderBottom: "1px solid currentColor", padding: "12px 0" }}>
          <Image src={photo.src} alt="" width={96} height={64} style={{ objectFit: "cover" }} />
          <div style={{ flex: 1 }}><strong>{photo.title}</strong><br /><small>{photo.category} · {photo.slug}</small></div>
          <button type="button" onClick={() => onDelete(photo.slug)}>Delete</button>
        </article>
      ))}
    </div>
  );
}
