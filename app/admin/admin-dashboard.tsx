"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PhotoDocument } from "@/models/photo";
import { LoginForm } from "./components/login-form";
import { PhotoList } from "./components/photo-list";
import { PhotoUploadForm } from "./components/photo-upload-form";

type Collection = {
  slug: string;
  name: string;
  description: string;
  isPublished: boolean;
  sortOrder: number;
};

export default function AdminDashboard({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const [photos, setPhotos] = useState<PhotoDocument[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [editing, setEditing] = useState<PhotoDocument>();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"overview" | "photos" | "collections">(
    "overview",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(authenticated);
  const [collectionForm, setCollectionForm] = useState({
    slug: "",
    name: "",
    description: "",
  });

  const load = useCallback(async () => {
    const [photosResponse, collectionsResponse] = await Promise.all([
      fetch("/api/admin/photos", { cache: "no-store" }),
      fetch("/api/admin/collections", { cache: "no-store" }),
    ]);
    if (!photosResponse.ok)
      throw new Error(
        (await photosResponse.json()).error || "Could not load photos.",
      );
    setPhotos(await photosResponse.json());
    if (collectionsResponse.ok)
      setCollections(await collectionsResponse.json());
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    // This effect synchronizes the client with the protected admin API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
      .catch((reason: unknown) =>
        setError(
          reason instanceof Error ? reason.message : "Could not load archive.",
        ),
      )
      .finally(() => setLoading(false));
  }, [authenticated, load]);

  const stats = useMemo(
    () => ({
      total: photos.length,
      published: photos.filter((photo) => photo.published).length,
      drafts: photos.filter((photo) => !photo.published).length,
      featured: photos.filter(
        (photo) => photo.homepageFeatured || photo.featured,
      ).length,
    }),
    [photos],
  );

  async function deletePhoto(slug: string) {
    if (
      !window.confirm(
        "Delete this photograph and its Cloudinary asset permanently?",
      )
    )
      return;
    const response = await fetch("/api/admin/photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (!response.ok) {
      setError((await response.json()).error || "Could not delete photo.");
      return;
    }
    if (editing?.slug === slug) setEditing(undefined);
    await load();
  }

  async function toggle(
    photo: PhotoDocument,
    field: "published" | "featured" | "homepageFeatured",
  ) {
    const response = await fetch("/api/admin/photos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: photo.slug,
        updates: { [field]: !photo[field] },
      }),
    });
    if (!response.ok) {
      setError((await response.json()).error || "Could not update photo.");
      return;
    }
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }
  async function createCollection(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectionForm),
    });
    if (!response.ok) {
      setError((await response.json()).error || "Could not create collection.");
      return;
    }
    setCollectionForm({ slug: "", name: "", description: "" });
    await load();
  }
  async function deleteCollection(slug: string) {
    if (!window.confirm("Delete this collection?")) return;
    const response = await fetch("/api/admin/collections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (!response.ok) {
      setError((await response.json()).error || "Could not delete collection.");
      return;
    }
    await load();
  }

  if (!authenticated) return <LoginForm />;
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>TA SHANTO</span>
          <small>PHOTOGRAPHY / CMS</small>
        </div>
        <nav className="admin-nav">
          <button
            className={tab === "overview" ? "is-active" : ""}
            onClick={() => setTab("overview")}
          >
            Overview <b>⌂</b>
          </button>
          <button
            className={tab === "photos" ? "is-active" : ""}
            onClick={() => setTab("photos")}
          >
            Photographs <b>{stats.total}</b>
          </button>
          <button
            className={tab === "collections" ? "is-active" : ""}
            onClick={() => setTab("collections")}
          >
            Collections <b>{collections.length}</b>
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer">
            View live site ↗
          </a>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">Content management</p>
            <h1>
              {tab === "overview"
                ? "Good evening, TA"
                : tab === "photos"
                  ? "Photographs"
                  : "Collections"}
            </h1>
          </div>
          <div className="admin-topbar-actions"><span className="admin-live-dot">System online</span><button className="admin-primary-button" onClick={() => { setTab("photos"); setEditing(undefined); }}>+ New photograph</button></div>
        </header>
        {error && (
          <div className="admin-alert" role="alert">
            {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}
        {loading ? (
          <div className="admin-loading">Loading your archive…</div>
        ) : (
          <>
            {tab === "overview" && (
              <>
                <div className="admin-stat-grid">
                  <article>
                    <span>Total archive</span>
                    <strong>{stats.total}</strong>
                    <small>photographs</small>
                  </article>
                  <article>
                    <span>Published</span>
                    <strong>{stats.published}</strong>
                    <small>visible on site</small>
                  </article>
                  <article>
                    <span>Drafts</span>
                    <strong>{stats.drafts}</strong>
                    <small>awaiting review</small>
                  </article>
                  <article>
                    <span>Featured</span>
                    <strong>{stats.featured}</strong>
                    <small>selected for homepage</small>
                  </article>
                </div>
                <div className="admin-overview-grid">
                  <section className="admin-panel">
                    <div className="admin-panel-heading">
                      <div>
                        <p className="admin-kicker">Quick action</p>
                        <h2>Add a photograph</h2>
                      </div>
                    </div>
                    <PhotoUploadForm
                      key="new"
                      onSaved={load}
                      onCancel={() => setEditing(undefined)}
                      onError={setError}
                    />
                  </section>
                  <section className="admin-panel admin-recent">
                    <div className="admin-panel-heading">
                      <div>
                        <p className="admin-kicker">Latest uploads</p>
                        <h2>Recent archive</h2>
                      </div>
                      <button onClick={() => setTab("photos")}>View all</button>
                    </div>
                    {photos.slice(0, 5).map((photo) => (
                      <button
                        className="admin-recent-row"
                        key={photo.slug}
                        onClick={() => {
                          setEditing(photo);
                          setTab("photos");
                        }}
                      >
                        <span>
                          {photo.title}
                          <small>{photo.category}</small>
                        </span>
                        <span
                          className={`admin-status ${photo.published ? "is-live" : "is-draft"}`}
                        >
                          {photo.published ? "Live" : "Draft"}
                        </span>
                      </button>
                    ))}
                  </section>
                </div>
              </>
            )}
            {tab === "photos" && (
              <div className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <p className="admin-kicker">Archive management</p>
                    <h2>{editing ? "Edit photograph" : "All photographs"}</h2>
                  </div>
                  <div className="admin-heading-actions">
                    <input
                      className="admin-search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search archive…"
                    />
                    {editing && (
                      <button
                        className="admin-secondary-button"
                        onClick={() => setEditing(undefined)}
                      >
                        New photo
                      </button>
                    )}
                  </div>
                </div>
                {editing ? (
                  <PhotoUploadForm
                    key={editing.slug}
                    editing={editing}
                    onSaved={async () => {
                      setEditing(undefined);
                      await load();
                    }}
                    onCancel={() => setEditing(undefined)}
                    onError={setError}
                  />
                ) : (
                  <PhotoList
                    photos={photos}
                    search={search}
                    onEdit={setEditing}
                    onDelete={deletePhoto}
                    onToggle={toggle}
                  />
                )}
              </div>
            )}
            {tab === "collections" && (
              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <p className="admin-kicker">Taxonomy</p>
                    <h2>Collections & categories</h2>
                  </div>
                </div>
                <p className="admin-muted">
                  Create and organize the chapters that appear across the public
                  gallery.
                </p>
                <form
                  className="admin-collection-form"
                  onSubmit={createCollection}
                >
                  <input
                    placeholder="slug"
                    value={collectionForm.slug}
                    onChange={(event) =>
                      setCollectionForm({
                        ...collectionForm,
                        slug: event.target.value,
                      })
                    }
                    required
                  />
                  <input
                    placeholder="Collection name"
                    value={collectionForm.name}
                    onChange={(event) =>
                      setCollectionForm({
                        ...collectionForm,
                        name: event.target.value,
                      })
                    }
                    required
                  />
                  <input
                    placeholder="Short description"
                    value={collectionForm.description}
                    onChange={(event) =>
                      setCollectionForm({
                        ...collectionForm,
                        description: event.target.value,
                      })
                    }
                    required
                  />
                  <button type="submit">Create collection</button>
                </form>
                <div className="admin-collection-grid">
                  {collections.map((collection) => (
                    <article
                      className="admin-collection-card"
                      key={collection.slug}
                    >
                      <span>
                        {collection.isPublished ? "Published" : "Draft"}
                      </span>
                      <h3>{collection.name}</h3>
                      <p>{collection.description}</p>
                      <small>/{collection.slug}</small>
                      <button
                        className="admin-collection-delete"
                        onClick={() => deleteCollection(collection.slug)}
                      >
                        Delete
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
