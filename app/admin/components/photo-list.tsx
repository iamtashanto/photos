"use client";

import Image from "next/image";
import { Eye, Heart, Pencil, Trash2 } from "lucide-react";
import type { PhotoDocument } from "@/models/photo";

export function PhotoList({ photos, search, onEdit, onDelete, onToggle }: {
  photos: PhotoDocument[]; search: string; onEdit: (photo: PhotoDocument) => void;
  onDelete: (slug: string) => Promise<void>; onToggle: (photo: PhotoDocument, field: "published" | "featured" | "homepageFeatured") => Promise<void>;
}) {
  const visible = photos.filter((photo) => [photo.title, photo.slug, photo.category, photo.location].join(" ").toLowerCase().includes(search.toLowerCase()));
  const th = "border-b border-stone-200 px-3 py-4 text-left text-[.7rem] font-medium uppercase tracking-[.12em] text-stone-500";
  const td = "border-b border-stone-200 px-3 py-4 align-middle text-sm";
  return <div className="overflow-x-auto"><table className="w-full border-collapse"><thead><tr><th className={th}>Photograph</th><th className={th}>Category</th><th className={th}>Engagement</th><th className={th}>Status</th><th className={th}>Placement</th><th className={th}><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.map((photo) => <tr className="transition-colors hover:bg-stone-50" key={photo.slug}>
    <td className={td}><div className="flex min-w-[220px] items-center gap-4"><Image className="h-[52px] w-[72px] rounded object-cover" src={photo.src} alt="" width={72} height={52} /><span className="grid gap-1"><strong>{photo.title}</strong><small className="text-stone-500">{photo.slug}</small></span></div></td>
    <td className={td}><span className="inline-block border border-stone-300 px-2 py-1 text-xs text-stone-600">{photo.category}</span>{photo.collection && <small className="mt-1 block text-stone-500">{photo.collection}</small>}</td>
    <td className={td}><div className="flex gap-4 text-stone-500"><span className="inline-flex items-center gap-1" title="Unique views"><Eye className="size-3.5" aria-hidden="true" />{photo.views || 0}</span><span className="inline-flex items-center gap-1" title="Likes"><Heart className="size-3.5" aria-hidden="true" />{photo.likes || 0}</span></div></td>
    <td className={td}><button type="button" className={`rounded-full border px-3 py-1 text-xs ${photo.published ? "border-emerald-300 text-emerald-700" : "border-amber-300 text-amber-700"}`} onClick={() => onToggle(photo, "published")}>{photo.published ? "Published" : "Draft"}</button></td>
    <td className={td}><div className="flex gap-2"><button type="button" className={`text-xs ${photo.featured ? "font-semibold text-stone-950 underline underline-offset-4" : "text-stone-500"}`} onClick={() => onToggle(photo, "featured")}>Featured</button><button type="button" className={`text-xs ${photo.homepageFeatured ? "font-semibold text-stone-950 underline underline-offset-4" : "text-stone-500"}`} onClick={() => onToggle(photo, "homepageFeatured")}>Homepage</button></div></td>
    <td className={td}><div className="flex gap-2"><button className="grid size-9 place-items-center border border-stone-300 hover:bg-stone-100" type="button" onClick={() => onEdit(photo)} aria-label={`Edit ${photo.title}`}><Pencil className="size-3.5" aria-hidden="true" /></button><button className="grid size-9 place-items-center border border-red-200 text-red-600 hover:bg-red-50" type="button" onClick={() => onDelete(photo.slug)} aria-label={`Delete ${photo.title}`}><Trash2 className="size-3.5" aria-hidden="true" /></button></div></td>
  </tr>)}</tbody></table>{!visible.length && <p className="py-12 text-center text-sm text-stone-500">No photographs match your search.</p>}</div>;
}
