"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { photoCategories, type PhotoDocument } from "@/models/photo";

type FormState = {
  slug: string; title: string; category: string; collection: string; alt: string;
  description: string; story: string; location: string; city: string; country: string; dateCaptured: string;
  camera: string; lens: string; focalLength: string; aperture: string; shutterSpeed: string; iso: string;
  copyright: string; credit: string; sourceUrl: string;
  tags: string; featured: boolean; homepageFeatured: boolean; published: boolean;
  featuredOrder: string; sortOrder: string;
};

const emptyForm: FormState = {
  slug: "", title: "", category: "Street", collection: "", alt: "", description: "",
  story: "", location: "", city: "", country: "", dateCaptured: "", tags: "", featured: false,
  camera: "", lens: "", focalLength: "", aperture: "", shutterSpeed: "", iso: "",
  copyright: "", credit: "", sourceUrl: "",
  homepageFeatured: false, published: true, featuredOrder: "", sortOrder: "",
};

function toForm(photo?: PhotoDocument): FormState {
  if (!photo) return emptyForm;
  return {
    slug: photo.slug, title: photo.title, category: photo.category, collection: photo.collection || "",
    alt: photo.alt, description: photo.description || "", story: photo.story || "",
    location: photo.location || "", city: photo.city || "", country: photo.country || "", dateCaptured: photo.dateCaptured || "", tags: photo.tags.join(", "),
    camera: photo.camera || "", lens: photo.lens || "", focalLength: photo.focalLength || "",
    aperture: photo.aperture || "", shutterSpeed: photo.shutterSpeed || "", iso: photo.iso?.toString() || "",
    copyright: photo.copyright || "", credit: photo.credit || "", sourceUrl: photo.sourceUrl || "",
    featured: photo.featured, homepageFeatured: photo.homepageFeatured, published: photo.published,
    featuredOrder: photo.featuredOrder?.toString() || "", sortOrder: photo.sortOrder?.toString() || "",
  };
}

export function PhotoUploadForm({ editing, onSaved, onCancel, onError, collections }: {
  editing?: PhotoDocument;
  onSaved: () => Promise<void>;
  onCancel: () => void;
  onError: (message: string) => void;
  collections: Array<{ slug: string; name: string }>;
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
      iso: form.iso ? Number(form.iso) : undefined,
    };
    try {
      let response: Response;
      if (editing) {
        if (file) {
          const body = new FormData(); body.append("file", file); body.append("slug", editing.slug); body.append("metadata", JSON.stringify(metadata));
          response = await fetch("/api/admin/photos", { method: "PATCH", body });
        } else response = await fetch("/api/admin/photos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: editing.slug, updates: metadata }) });
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
      <div className={`admin-media-editor ${editing ? "has-current-image" : ""}`}>
        {editing && <div className="admin-current-image"><Image src={editing.src} alt={editing.alt} fill sizes="(max-width: 800px) 100vw, 380px" /><span>Current image</span></div>}
        <label className="admin-dropzone"><ImagePlus aria-hidden="true" /><span>{editing ? "Replace photograph" : "Upload photograph"}</span><small>JPEG, PNG, WebP or AVIF · maximum 15 MB</small><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required={!editing} /></label>
      </div>
      <div className="admin-form-grid">
        <label>Title<input value={form.title} onChange={(event) => update("title", event.target.value)} required /></label>
        <label>Slug<input value={form.slug} onChange={(event) => update("slug", event.target.value)} placeholder="rainy-evening-dhaka" required disabled={Boolean(editing)} /></label>
        <label>Category<select value={form.category} onChange={(event) => update("category", event.target.value)} required>{photoCategories.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
        <label>Collection<select value={form.collection} onChange={(event) => update("collection", event.target.value)}><option value="">No collection</option>{collections.map((collection) => <option value={collection.slug} key={collection.slug}>{collection.name}</option>)}</select></label>
        <label>Location<input value={form.location} onChange={(event) => update("location", event.target.value)} /></label>
        <label>Date captured<input type="date" value={form.dateCaptured} onChange={(event) => update("dateCaptured", event.target.value)} /></label>
        <label>City<input value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Dhaka" /></label>
        <label>Country<input value={form.country} onChange={(event) => update("country", event.target.value)} placeholder="Bangladesh" /></label>
        <label className="admin-span-2">Alt text<input value={form.alt} onChange={(event) => update("alt", event.target.value)} required /></label>
        <label className="admin-span-2">Description<textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={3} /></label>
        <label className="admin-span-2">Story<textarea value={form.story} onChange={(event) => update("story", event.target.value)} rows={4} /></label>
        <label className="admin-span-2">Tags <small>comma separated</small><input value={form.tags} onChange={(event) => update("tags", event.target.value)} placeholder="rain, dhaka, evening" /></label>
        <div className="admin-form-section admin-span-2"><span>Camera & exposure</span></div>
        <label>Camera<input value={form.camera} onChange={(event) => update("camera", event.target.value)} placeholder="Sony A7 IV" /></label>
        <label>Lens<input value={form.lens} onChange={(event) => update("lens", event.target.value)} placeholder="35mm f/1.8" /></label>
        <label>Focal length<input value={form.focalLength} onChange={(event) => update("focalLength", event.target.value)} placeholder="35 mm" /></label>
        <label>Aperture<input value={form.aperture} onChange={(event) => update("aperture", event.target.value)} placeholder="f/2.8" /></label>
        <label>Shutter speed<input value={form.shutterSpeed} onChange={(event) => update("shutterSpeed", event.target.value)} placeholder="1/250 s" /></label>
        <label>ISO<input type="number" min="0" value={form.iso} onChange={(event) => update("iso", event.target.value)} placeholder="400" /></label>
        <div className="admin-form-section admin-span-2"><span>Rights & attribution</span></div>
        <label>Copyright<input value={form.copyright} onChange={(event) => update("copyright", event.target.value)} placeholder="© TA Shanto" /></label>
        <label>Credit<input value={form.credit} onChange={(event) => update("credit", event.target.value)} placeholder="Photo by TA Shanto" /></label>
        <label className="admin-span-2">Source URL<input type="url" value={form.sourceUrl} onChange={(event) => update("sourceUrl", event.target.value)} placeholder="https://…" /></label>
        <div className="admin-form-section admin-span-2"><span>Display order</span></div>
        <label>Archive order<input type="number" min="0" value={form.sortOrder} onChange={(event) => update("sortOrder", event.target.value)} placeholder="Automatic" /></label>
        <label>Featured order<input type="number" min="0" value={form.featuredOrder} onChange={(event) => update("featuredOrder", event.target.value)} placeholder="Automatic" /></label>
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
