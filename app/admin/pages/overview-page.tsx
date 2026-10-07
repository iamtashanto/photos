"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PhotoDocument } from "@/models/photo";
import { PhotoUploadForm } from "../components/photo-upload-form";

type Collection = { slug: string; name: string };

export function OverviewPage() {
  const [photos, setPhotos] = useState<PhotoDocument[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const [photoResponse, collectionResponse] = await Promise.all([fetch("/api/admin/photos", { cache: "no-store" }), fetch("/api/admin/collections", { cache: "no-store" })]);
    if (!photoResponse.ok) throw new Error("Could not load the archive.");
    setPhotos(await photoResponse.json());
    if (collectionResponse.ok) setCollections(await collectionResponse.json());
  }, []);
  // Synchronize this protected client workspace with the admin API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load dashboard.")).finally(() => setLoading(false)); }, [load]);
  const stats = useMemo(() => ({
    total: photos.length,
    published: photos.filter((photo) => photo.published).length,
    views: photos.reduce((sum, photo) => sum + (photo.views || 0), 0),
    likes: photos.reduce((sum, photo) => sum + (photo.likes || 0), 0),
  }), [photos]);
  return <>
    <header className="admin-topbar"><div><p className="admin-kicker">Dashboard overview</p><h1>Welcome back, TA</h1></div><Link className="admin-primary-button" href="/admin/photographs"><Plus /> Manage photographs</Link></header>
    {error && <div className="admin-alert" role="alert">{error}<button onClick={() => setError("")}>×</button></div>}
    {loading ? <p className="admin-loading">Loading dashboard…</p> : <>
      <div className="admin-stat-grid">
        <article><span>Total archive</span><strong>{stats.total}</strong><small>photographs</small></article>
        <article><span>Published</span><strong>{stats.published}</strong><small>visible on site</small></article>
        <article><span>Unique views</span><strong>{stats.views}</strong><small>across the archive</small></article>
        <article><span>Audience likes</span><strong>{stats.likes}</strong><small>total appreciation</small></article>
      </div>
      <div className="admin-overview-grid">
        <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-kicker">Quick upload</p><h2>Add a photograph</h2></div></div><PhotoUploadForm collections={collections} onSaved={load} onCancel={() => undefined} onError={setError} /></section>
        <section className="admin-panel admin-recent"><div className="admin-panel-heading"><div><p className="admin-kicker">Latest uploads</p><h2>Recent archive</h2></div><Link href="/admin/photographs">View all</Link></div>{photos.slice(0, 6).map((photo) => <Link className="admin-recent-row" href={`/admin/photographs/${photo.slug}`} key={photo.slug}><span>{photo.title}<small>{photo.category}</small></span><ArrowRight /></Link>)}</section>
      </div>
    </>}
  </>;
}
