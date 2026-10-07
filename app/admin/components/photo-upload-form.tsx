"use client";

import { useState } from "react";
import { photoCategories, type PhotoMetadataInput } from "@/models/photo";

const initialForm: PhotoMetadataInput = { slug: "", title: "", category: "Street", alt: "", description: "", tags: [] };

export function PhotoUploadForm({ onUploaded, onError }: { onUploaded: () => Promise<void>; onError: (message: string) => void }) {
  const [form, setForm] = useState<PhotoMetadataInput>(initialForm);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    onError("");
    const input = event.currentTarget.elements.namedItem("file");
    if (!(input instanceof HTMLInputElement) || !input.files?.[0]) {
      onError("Choose an image first.");
      setPending(false);
      return;
    }
    const body = new FormData();
    body.append("file", input.files[0]);
    body.append("metadata", JSON.stringify(form));
    const response = await fetch("/api/admin/photos", { method: "POST", body });
    if (!response.ok) onError((await response.json()).error || "Upload failed.");
    else {
      setForm(initialForm);
      event.currentTarget.reset();
      await onUploaded();
    }
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="contact-form">
      <label>Image<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></label>
      <label>Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="rainy-evening-dhaka" required /></label>
      <label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
      <label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as PhotoMetadataInput["category"] })}>{photoCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label>Alt text<input value={form.alt} onChange={(event) => setForm({ ...form, alt: event.target.value })} /></label>
      <label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
      <button type="submit" disabled={pending}>{pending ? "Uploading…" : "Upload to Cloudinary"}</button>
    </form>
  );
}
