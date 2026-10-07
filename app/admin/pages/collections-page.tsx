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
  return <>
    <header className="admin-topbar"><div><p className="admin-kicker">Content taxonomy</p><h1>Collections</h1></div><span className="admin-live-dot">{collections.length} collections</span></header>
    {error && <div className="admin-alert" role="alert">{error}<button onClick={() => setError("")}>×</button></div>}
    <section className="admin-panel admin-collection-editor"><div className="admin-panel-heading"><div><p className="admin-kicker">{editing ? "Editing collection" : "New collection"}</p><h2>{editing ? editing.name : "Create a chapter"}</h2></div></div><form className="admin-collection-form" onSubmit={save}><input placeholder="collection-slug" value={form.slug} disabled={Boolean(editing)} onChange={(event) => setForm({ ...form, slug: event.target.value })} required /><input placeholder="Collection name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><input placeholder="Describe this collection" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /><button type="submit"><Plus /> {editing ? "Save changes" : "Create"}</button>{editing && <button type="button" className="admin-secondary-button" onClick={() => { setEditing(undefined); setForm(empty); }}>Cancel</button>}</form></section>
    <section className="admin-collection-section"><div className="admin-panel-heading"><div><p className="admin-kicker">Library structure</p><h2>All collections</h2></div></div>{loading ? <p className="admin-loading">Loading collections…</p> : <div className="admin-collection-grid">{collections.map((collection) => <article className="admin-collection-card" key={collection.slug}><button className={`admin-status ${collection.isPublished ? "is-live" : "is-draft"}`} onClick={() => togglePublished(collection)}>{collection.isPublished ? "Published" : "Draft"}</button><h3>{collection.name}</h3><p>{collection.description}</p><small>/{collection.slug}</small><div className="admin-collection-actions"><button onClick={() => { setEditing(collection); setForm({ slug: collection.slug, name: collection.name, description: collection.description }); }}>Edit</button><button className="admin-collection-delete" onClick={() => remove(collection.slug)}>Delete</button></div></article>)}</div>}</section>
  </>;
}
