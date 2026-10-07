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
  const card = "rounded-lg border border-[#dedbd2] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,.025)]";
  const kicker = "m-0 text-xs font-medium uppercase tracking-[.14em] text-stone-500";
  return <>
    <header className="mb-8 flex items-end justify-between gap-6 border-b border-[#d8d5cd] pb-8 max-sm:items-start max-sm:flex-col"><div><p className={kicker}>Dashboard overview</p><h1 className="mt-2 font-[family-name:var(--serif)] text-[clamp(2.6rem,4vw,4.35rem)] leading-[.95] tracking-[-.035em]">Welcome back, TA</h1></div><Link className="inline-flex items-center gap-2 bg-[#171716] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white" href="/admin/photographs"><Plus className="size-4" /> Manage photographs</Link></header>
    {error && <div className="mb-6 flex justify-between border border-red-300 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}<button onClick={() => setError("")}>×</button></div>}
    {loading ? <p className="text-sm text-stone-500">Loading dashboard…</p> : <>
      <div className="mb-6 grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        <article className={card}><span className="text-sm text-stone-500">Total archive</span><strong className="my-3 block font-[family-name:var(--serif)] text-5xl">{stats.total}</strong><small className="text-stone-500">photographs</small></article>
        <article className={card}><span className="text-sm text-stone-500">Published</span><strong className="my-3 block font-[family-name:var(--serif)] text-5xl">{stats.published}</strong><small className="text-stone-500">visible on site</small></article>
        <article className={card}><span className="text-sm text-stone-500">Unique views</span><strong className="my-3 block font-[family-name:var(--serif)] text-5xl">{stats.views}</strong><small className="text-stone-500">across the archive</small></article>
        <article className={card}><span className="text-sm text-stone-500">Audience likes</span><strong className="my-3 block font-[family-name:var(--serif)] text-5xl">{stats.likes}</strong><small className="text-stone-500">total appreciation</small></article>
      </div>
      <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)] items-start gap-6 max-lg:grid-cols-1">
        <section className={card}><div className="mb-6 flex items-end justify-between"><div><p className={kicker}>Latest uploads</p><h2 className="mt-2 font-[family-name:var(--serif)] text-3xl">Recent archive</h2></div><Link className="text-sm text-stone-500 underline underline-offset-4" href="/admin/photographs">View all</Link></div>{photos.slice(0, 6).map((photo) => <Link className="grid grid-cols-[58px_minmax(0,1fr)_auto_18px] items-center gap-4 border-t border-stone-200 py-3 max-sm:grid-cols-[48px_minmax(0,1fr)_18px]" href={`/admin/photographs/${photo.slug}`} key={photo.slug}><Image className="h-11 w-[58px] rounded object-cover" src={photo.src} alt="" width={58} height={44} /><span className="grid text-sm font-medium">{photo.title}<small className="font-normal text-stone-500">{photo.category}</small></span><span className="flex gap-3 text-xs text-stone-500 max-sm:hidden"><span className="flex items-center gap-1"><Eye className="size-3.5" />{photo.views || 0}</span><span className="flex items-center gap-1"><Heart className="size-3.5" />{photo.likes || 0}</span></span><ArrowRight className="size-4" /></Link>)}</section>
        <div className="grid gap-6">
          <section className={card}><div className="mb-6"><p className={kicker}>Shortcuts</p><h2 className="mt-2 font-[family-name:var(--serif)] text-3xl">Quick actions</h2></div>{[["/admin/photographs", ImagePlus, "Add photograph", "Upload and publish a new frame"], ["/admin/collections", FolderPlus, "Create collection", "Organize photographs into a chapter"]] .map(([href, Icon, title, copy]) => <Link className="grid grid-cols-[34px_1fr_18px] items-center gap-3 border-t border-stone-200 py-4" href={href as string} key={href as string}><Icon className="size-5" /><span className="grid"><strong className="text-sm">{title as string}</strong><small className="text-stone-500">{copy as string}</small></span><ArrowRight className="size-4" /></Link>)}</section>
          <section className={card}><p className={kicker}>Library status</p><h2 className="my-2 font-[family-name:var(--serif)] text-3xl">Archive health</h2><dl>{[["Collections", collections.length], ["Draft photographs", stats.total - stats.published], ["Published rate", `${stats.total ? Math.round((stats.published / stats.total) * 100) : 0}%`]].map(([label, value]) => <div className="flex justify-between border-t border-stone-200 py-3" key={label}><dt className="text-stone-500">{label}</dt><dd className="font-semibold">{value}</dd></div>)}</dl></section>
        </div>
      </div>
    </>}
  </>;
}
