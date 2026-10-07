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
  return <>
    <header className="admin-topbar"><div><p className="admin-kicker">Archive management</p><h1>{editing ? `Edit ${editing.title}` : creating ? "New photograph" : "Photographs"}</h1></div>{editorOpen ? <Link className="admin-secondary-button" href="/admin/photographs"><ArrowLeft /> Back to archive</Link> : <button className="admin-primary-button" onClick={() => setCreating(true)}><Plus /> New photograph</button>}</header>
    {error && <div className="admin-alert" role="alert">{error}<button onClick={() => setError("")}>×</button></div>}
    {loading ? <p className="admin-loading">Loading photographs…</p> : editSlug && !editing ? <section className="admin-panel"><h2>Photograph not found</h2><p className="admin-muted">This photograph may have been removed or renamed.</p><Link className="admin-secondary-button" href="/admin/photographs">Return to archive</Link></section> : editorOpen ? <section className="admin-panel"><PhotoUploadForm key={editing?.slug || "new"} editing={editing} collections={collections} onSaved={saved} onCancel={() => { setCreating(false); if (editSlug) router.push("/admin/photographs"); }} onError={setError} /></section> : <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-kicker">{photos.length} items</p><h2>Complete archive</h2></div><input className="admin-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, category or location…" /></div><PhotoList photos={photos} search={search} onEdit={(photo) => router.push(`/admin/photographs/${photo.slug}`)} onDelete={remove} onToggle={toggle} /></section>}
  </>;
}
