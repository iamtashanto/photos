"use client";

import { useCallback, useEffect, useState } from "react";
import type { PhotoDocument } from "@/models/photo";
import { LoginForm } from "./components/login-form";
import { PhotoList } from "./components/photo-list";
import { PhotoUploadForm } from "./components/photo-upload-form";

export default function AdminDashboard({ authenticated }: { authenticated: boolean }) {
  const [photos, setPhotos] = useState<PhotoDocument[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(authenticated);

  const loadPhotos = useCallback(async () => {
    const response = await fetch("/api/admin/photos", { cache: "no-store" });
    if (!response.ok) throw new Error((await response.json()).error || "Could not load photos.");
    setPhotos(await response.json());
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    void fetch("/api/admin/photos", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).error || "Could not load photos.");
        setPhotos(await response.json());
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load photos."))
      .finally(() => setLoading(false));
  }, [authenticated]);

  async function deletePhoto(slug: string) {
    if (!window.confirm(`Delete "${slug}" permanently?`)) return;
    const response = await fetch("/api/admin/photos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    if (!response.ok) { setError((await response.json()).error || "Could not delete photo."); return; }
    await loadPhotos();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  if (!authenticated) return <LoginForm />;
  return (
    <main className="page-shell" style={{ maxWidth: 1100 }}>
      <header className="page-intro">
        <p>Content management</p>
        <h1>Photography Admin</h1>
        <span>{photos.length} photographs in the archive</span>
        <button type="button" onClick={logout}>Sign out</button>
      </header>
      {error && <p role="alert">{error}</p>}
      <PhotoUploadForm onUploaded={loadPhotos} onError={setError} />
      {loading ? <p>Loading archive…</p> : <PhotoList photos={photos} onDelete={deletePhoto} />}
    </main>
  );
}
