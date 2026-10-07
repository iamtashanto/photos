"use client";

import { useState } from "react";
import type { PhotoDocument } from "@/models/photo";

type FormState = {
  slug: string; title: string; category: string; collection: string; alt: string;
  description: string; story: string; location: string; dateCaptured: string;
  tags: string; featured: boolean; homepageFeatured: boolean; published: boolean;
  featuredOrder: string; sortOrder: string;
};

const emptyForm: FormState = {
  slug: "", title: "", category: "Street", collection: "", alt: "", description: "",
  story: "", location: "", dateCaptured: "", tags: "", featured: false,
  homepageFeatured: false, published: true, featuredOrder: "", sortOrder: "",
};

function toForm(photo?: PhotoDocument): FormState {
  if (!photo) return emptyForm;
  return {
    slug: photo.slug, title: photo.title, category: photo.category, collection: photo.collection || "",
    alt: photo.alt, description: photo.description || "", story: photo.story || "",
    location: photo.location || "", dateCaptured: photo.dateCaptured || "", tags: photo.tags.join(", "),
    featured: photo.featured, homepageFeatured: photo.homepageFeatured, published: photo.published,
    featuredOrder: photo.featuredOrder?.toString() || "", sortOrder: photo.sortOrder?.toString() || "",
  };
}

export function PhotoUploadForm({ editing, onSaved, onCancel, onError }: {
  editing?: PhotoDocument;
  onSaved: () => Promise<void>;
  onCancel: () => void;
  onError: (message: string) => void;
}) {
  const [form, setForm] = useState<FormState>(() => toForm(editing));
  const [pending, setPending] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); onError("");
    const input = event.currentTarget.elements.namedItem("file");
    const file = input instanceof HTMLInputElement ? input.files?.[0] : undefined;
    const metadata = {
      ...form,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      featuredOrder: form.featuredOrder ? Number(form.featuredOrder) : undefined,
      sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
    };
    try {
      let response: Response;
      if (editing) {
        response = await fetch("/api/admin/photos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: editing.slug, updates: metadata }) });
      } else {
        if (!file) throw new Error("Choose an image first.");
        const body = new FormData();
        body.append("file", file);
        body.append("metadata", JSON.stringify(metadata));
        response = await fetch("/api/admin/photos", { method: "POST", body });
      }
      if (!response.ok) throw new Error((await response.json()).error || "Could not save photo.");
      await onSaved();
      if (!editing) { setForm(emptyForm); event.currentTarget.reset(); }
    } catch (reason) {
      onError(reason instanceof Error ? reason.message : "Could not save photo.");
    } finally { setPending(false); }
  }

  return (
    <form onSubmit={submit} className="admin-editor">
      <div className="admin-editor-heading">
        <div><p className="admin-kicker">{editing ? "Edit photograph" : "New photograph"}</p><h2>{editing ? editing.title : "Add to the archive"}</h2></div>
        {editing && <button type="button" className="admin-quiet-button" onClick={onCancel}>Close</button>}
      </div>
      {!editing && <label className="admin-dropzone"><span>Drop an image here or choose a file</span><small>JPEG, PNG, WebP or AVIF · maximum 15 MB</small><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></label>}
      <div className="admin-form-grid">
        <label>Title<input value={form.title} onChange={(event) => update("title", event.target.value)} required /></label>
        <label>Slug<input value={form.slug} onChange={(event) => update("slug", event.target.value)} placeholder="rainy-evening-dhaka" required disabled={Boolean(editing)} /></label>
        <label>Category<input value={form.category} onChange={(event) => update("category", event.target.value)} required /></label>
        <label>Collection<input value={form.collection} onChange={(event) => update("collection", event.target.value)} placeholder="street" /></label>
        <label>Location<input value={form.location} onChange={(event) => update("location", event.target.value)} /></label>
        <label>Date captured<input type="date" value={form.dateCaptured} onChange={(event) => update("dateCaptured", event.target.value)} /></label>
        <label className="admin-span-2">Alt text<input value={form.alt} onChange={(event) => update("alt", event.target.value)} required /></label>
        <label className="admin-span-2">Description<textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={3} /></label>
        <label className="admin-span-2">Story<textarea value={form.story} onChange={(event) => update("story", event.target.value)} rows={4} /></label>
        <label className="admin-span-2">Tags <small>comma separated</small><input value={form.tags} onChange={(event) => update("tags", event.target.value)} placeholder="rain, dhaka, evening" /></label>
      </div>
      <div className="admin-switches">
        <label><input type="checkbox" checked={form.published} onChange={(event) => update("published", event.target.checked)} /><span>Published</span><small>Visible on the public site</small></label>
        <label><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /><span>Featured</span><small>Include in selected work</small></label>
        <label><input type="checkbox" checked={form.homepageFeatured} onChange={(event) => update("homepageFeatured", event.target.checked)} /><span>Homepage feature</span><small>Eligible for the hero section</small></label>
      </div>
      <div className="admin-editor-actions"><button type="submit" disabled={pending}>{pending ? "Saving…" : editing ? "Save changes" : "Upload photograph"}</button>{editing && <button type="button" className="admin-secondary-button" onClick={onCancel}>Cancel</button>}</div>
    </form>
  );
}
