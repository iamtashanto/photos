"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, FolderPlus, Heart, ImagePlus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PhotoDocument } from "@/models/photo";

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
        <section className="admin-panel admin-recent"><div className="admin-panel-heading"><div><p className="admin-kicker">Latest uploads</p><h2>Recent archive</h2></div><Link href="/admin/photographs">View all</Link></div>{photos.slice(0, 6).map((photo) => <Link className="admin-recent-row admin-recent-photo" href={`/admin/photographs/${photo.slug}`} key={photo.slug}><Image src={photo.src} alt="" width={58} height={44} /><span>{photo.title}<small>{photo.category}</small></span><span className="admin-recent-metrics"><span><Eye />{photo.views || 0}</span><span><Heart />{photo.likes || 0}</span></span><ArrowRight /></Link>)}</section>
        <div className="admin-overview-side">
          <section className="admin-panel admin-quick-actions"><div className="admin-panel-heading"><div><p className="admin-kicker">Shortcuts</p><h2>Quick actions</h2></div></div><Link href="/admin/photographs"><ImagePlus /><span><strong>Add photograph</strong><small>Upload and publish a new frame</small></span><ArrowRight /></Link><Link href="/admin/collections"><FolderPlus /><span><strong>Create collection</strong><small>Organize photographs into a chapter</small></span><ArrowRight /></Link></section>
          <section className="admin-panel admin-library-health"><p className="admin-kicker">Library status</p><h2>Archive health</h2><dl><div><dt>Collections</dt><dd>{collections.length}</dd></div><div><dt>Draft photographs</dt><dd>{stats.total - stats.published}</dd></div><div><dt>Published rate</dt><dd>{stats.total ? Math.round((stats.published / stats.total) * 100) : 0}%</dd></div></dl></section>
        </div>
      </div>
    </>}
  </>;
}
