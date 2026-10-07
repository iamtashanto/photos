"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Collection = { slug: string; name: string; description: string; isPublished: boolean; sortOrder: number };
const empty = { slug: "", name: "", description: "" };

export function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<Collection>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { const response = await fetch("/api/admin/collections", { cache: "no-store" }); if (!response.ok) throw new Error("Could not load collections."); setCollections(await response.json()); }, []);
  // Synchronize this protected client workspace with the admin API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load collections.")).finally(() => setLoading(false)); }, [load]);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/collections", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { slug: editing.slug, updates: { name: form.name, description: form.description } } : form) });
    if (!response.ok) return setError((await response.json()).error || "Could not save collection.");
    setEditing(undefined); setForm(empty); await load();
  }
  async function togglePublished(collection: Collection) { const response = await fetch("/api/admin/collections", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: collection.slug, updates: { isPublished: !collection.isPublished } }) }); if (!response.ok) return setError((await response.json()).error || "Could not update collection."); await load(); }
  async function remove(slug: string) { if (!window.confirm("Delete this collection? Photographs will remain in the archive.")) return; const response = await fetch("/api/admin/collections", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) }); if (!response.ok) return setError((await response.json()).error || "Could not delete collection."); await load(); }
  const card = "rounded-lg border border-stone-200 bg-white p-6 shadow-sm";
  return <>
    <header className="mb-8 flex items-end justify-between border-b border-stone-300 pb-8"><div><p className="text-xs uppercase tracking-widest text-stone-500">Content taxonomy</p><h1 className="mt-2 font-[family-name:var(--serif)] text-[clamp(2.6rem,4vw,4.35rem)] leading-none">Collections</h1></div><span className="text-sm text-stone-500">{collections.length} collections</span></header>
    {error && <div className="mb-6 flex justify-between border border-red-300 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}<button onClick={() => setError("")}>×</button></div>}
    <section className={`${card} mb-8`}><div className="mb-6"><p className="text-xs uppercase tracking-widest text-stone-500">{editing ? "Editing collection" : "New collection"}</p><h2 className="mt-2 font-[family-name:var(--serif)] text-3xl">{editing ? editing.name : "Create a chapter"}</h2></div><form className="grid grid-cols-[1fr_1fr_1.5fr_auto_auto] gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1 [&_input]:border [&_input]:border-stone-300 [&_input]:bg-stone-50 [&_input]:px-4 [&_input]:py-3" onSubmit={save}><input placeholder="collection-slug" value={form.slug} disabled={Boolean(editing)} onChange={(event) => setForm({ ...form, slug: event.target.value })} required /><input placeholder="Collection name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><input placeholder="Describe this collection" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /><button className="inline-flex items-center justify-center gap-2 bg-[#171716] px-4 py-3 text-xs uppercase text-white" type="submit"><Plus className="size-4" /> {editing ? "Save changes" : "Create"}</button>{editing && <button type="button" className="border border-stone-300 px-4 py-3 text-xs uppercase" onClick={() => { setEditing(undefined); setForm(empty); }}>Cancel</button>}</form></section>
    <section><div className="mb-6"><p className="text-xs uppercase tracking-widest text-stone-500">Library structure</p><h2 className="mt-2 font-[family-name:var(--serif)] text-3xl">All collections</h2></div>{loading ? <p className="text-sm text-stone-500">Loading collections…</p> : <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">{collections.map((collection) => <article className={card} key={collection.slug}><button className={`rounded-full border px-3 py-1 text-xs ${collection.isPublished ? "border-emerald-300 text-emerald-700" : "border-amber-300 text-amber-700"}`} onClick={() => togglePublished(collection)}>{collection.isPublished ? "Published" : "Draft"}</button><h3 className="my-4 font-[family-name:var(--serif)] text-2xl">{collection.name}</h3><p className="min-h-12 text-sm text-stone-500">{collection.description}</p><small className="text-stone-400">/{collection.slug}</small><div className="mt-5 flex gap-2"><button className="border border-stone-300 px-4 py-2 text-xs uppercase" onClick={() => { setEditing(collection); setForm({ slug: collection.slug, name: collection.name, description: collection.description }); }}>Edit</button><button className="border border-red-200 px-4 py-2 text-xs uppercase text-red-600" onClick={() => remove(collection.slug)}>Delete</button></div></article>)}</div>}</section>
  </>;
}
