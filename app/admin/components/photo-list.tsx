"use client";

import Image from "next/image";
import type { PhotoDocument } from "@/models/photo";

export function PhotoList({ photos, search, onEdit, onDelete, onToggle }: {
  photos: PhotoDocument[]; search: string; onEdit: (photo: PhotoDocument) => void;
  onDelete: (slug: string) => Promise<void>; onToggle: (photo: PhotoDocument, field: "published" | "featured" | "homepageFeatured") => Promise<void>;
}) {
  const visible = photos.filter((photo) => [photo.title, photo.slug, photo.category, photo.location].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Photograph</th><th>Category</th><th>Status</th><th>Flags</th><th>Actions</th></tr></thead><tbody>{visible.map((photo) => <tr key={photo.slug}>
    <td><div className="admin-photo-cell"><Image src={photo.src} alt="" width={72} height={52} /><span><strong>{photo.title}</strong><small>{photo.slug}</small></span></div></td>
    <td><span className="admin-pill">{photo.category}</span>{photo.collection && <small className="admin-table-muted">{photo.collection}</small>}</td>
    <td><button type="button" className={`admin-status ${photo.published ? "is-live" : "is-draft"}`} onClick={() => onToggle(photo, "published")}>{photo.published ? "Published" : "Draft"}</button></td>
    <td><div className="admin-flags"><button type="button" className={photo.featured ? "is-active" : ""} onClick={() => onToggle(photo, "featured")}>Featured</button><button type="button" className={photo.homepageFeatured ? "is-active" : ""} onClick={() => onToggle(photo, "homepageFeatured")}>Homepage</button></div></td>
    <td><div className="admin-row-actions"><button type="button" onClick={() => onEdit(photo)}>Edit</button><button type="button" className="is-danger" onClick={() => onDelete(photo.slug)}>Delete</button></div></td>
  </tr>)}</tbody></table>{!visible.length && <p className="admin-empty">No photographs match your search.</p>}</div>;
}
