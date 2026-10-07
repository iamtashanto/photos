"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { PhotoDocument } from "@/models/photo";
import { PhotoList } from "../components/photo-list";
import { PhotoUploadForm } from "../components/photo-upload-form";

type Collection = { slug: string; name: string };

export function PhotographsPage({ editSlug }: { editSlug?: string }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoDocument[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const [photoResponse, collectionResponse] = await Promise.all([fetch("/api/admin/photos", { cache: "no-store" }), fetch("/api/admin/collections", { cache: "no-store" })]);
    if (!photoResponse.ok) throw new Error((await photoResponse.json()).error || "Could not load photographs.");
    setPhotos(await photoResponse.json());
    if (collectionResponse.ok) setCollections(await collectionResponse.json());
  }, []);
  // Synchronize this protected client workspace with the admin API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load photographs.")).finally(() => setLoading(false)); }, [load]);
  const editing = editSlug ? photos.find((photo) => photo.slug === editSlug) : undefined;

  async function remove(slug: string) {
    if (!window.confirm("Permanently delete this photograph and its image asset?")) return;
    const response = await fetch("/api/admin/photos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    if (!response.ok) return setError((await response.json()).error || "Could not delete photograph.");
    await load();
  }
  async function toggle(photo: PhotoDocument, field: "published" | "featured" | "homepageFeatured") {
    const response = await fetch("/api/admin/photos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: photo.slug, updates: { [field]: !photo[field] } }) });
    if (!response.ok) return setError((await response.json()).error || "Could not update photograph.");
    await load();
  }
  const editorOpen = creating || Boolean(editSlug);
  async function saved() { setCreating(false); await load(); if (editSlug) router.push("/admin/photographs"); }
  const card = "rounded-lg border border-stone-200 bg-white p-6 shadow-sm";
  return <>
    <header className="mb-8 flex items-end justify-between gap-6 border-b border-stone-300 pb-8 max-sm:flex-col max-sm:items-start"><div><p className="m-0 text-xs uppercase tracking-[.14em] text-stone-500">Archive management</p><h1 className="mt-2 font-[family-name:var(--serif)] text-[clamp(2.6rem,4vw,4.35rem)] leading-[.95]">{editing ? `Edit ${editing.title}` : creating ? "New photograph" : "Photographs"}</h1></div>{editorOpen ? <Link className="inline-flex items-center gap-2 border border-stone-300 px-4 py-3 text-xs uppercase tracking-wider" href="/admin/photographs"><ArrowLeft className="size-4" /> Back to archive</Link> : <button className="inline-flex items-center gap-2 bg-[#171716] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white" onClick={() => setCreating(true)}><Plus className="size-4" /> New photograph</button>}</header>
    {error && <div className="mb-6 flex justify-between border border-red-300 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}<button onClick={() => setError("")}>×</button></div>}
    {loading ? <p className="text-sm text-stone-500">Loading photographs…</p> : editSlug && !editing ? <section className={card}><h2 className="font-[family-name:var(--serif)] text-3xl">Photograph not found</h2><p className="text-stone-500">This photograph may have been removed or renamed.</p><Link className="inline-flex border border-stone-300 px-4 py-3 text-xs uppercase" href="/admin/photographs">Return to archive</Link></section> : editorOpen ? <section className={card}><PhotoUploadForm key={editing?.slug || "new"} editing={editing} collections={collections} onSaved={saved} onCancel={() => { setCreating(false); if (editSlug) router.push("/admin/photographs"); }} onError={setError} /></section> : <section className={card}><div className="mb-8 flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-stretch"><div><p className="m-0 text-xs uppercase tracking-[.14em] text-stone-500">{photos.length} items</p><h2 className="mt-2 font-[family-name:var(--serif)] text-3xl">Complete archive</h2></div><input className="min-w-[280px] border border-stone-300 bg-stone-50 px-4 py-3 text-sm" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, category or location…" /></div><PhotoList photos={photos} search={search} onEdit={(photo) => router.push(`/admin/photographs/${photo.slug}`)} onDelete={remove} onToggle={toggle} /></section>}
  </>;
}
