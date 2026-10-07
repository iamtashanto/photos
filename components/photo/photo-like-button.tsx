"use client";

import { Eye, Heart } from "lucide-react";
import { useEffect, useState } from "react";

function getVisitorId() {
  const key = "ta-shanto-visitor-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  window.localStorage.setItem(key, value);
  return value;
}

export function PhotoLikeButton({ slug }: { slug: string }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void fetch(`/api/photos/${slug}/engagement`, { method: "POST", headers: { "x-visitor-id": getVisitorId() } }).then((response) => response.ok ? response.json() : null).then((data: { likes?: number; views?: number; liked?: boolean } | null) => {
      if (data?.likes !== undefined) setLikes(data.likes);
      if (data?.views !== undefined) setViews(data.views);
      if (data?.liked !== undefined) setLiked(data.liked);
    });
  }, [slug]);

  async function toggle() {
    if (pending) return;
    setPending(true);
    const response = await fetch(`/api/photos/${slug}/like`, {
      method: liked ? "DELETE" : "POST",
      headers: { "x-visitor-id": getVisitorId() },
    });
    if (response.ok) {
      const data = await response.json() as { liked: boolean; likes: number };
      setLiked(data.liked); setLikes(data.likes);
    }
    setPending(false);
  }

  return <div className="photo-engagement"><span className="photo-view-count" aria-label={`${views} unique views`}><Eye aria-hidden="true" /><span>{views}</span><small>views</small></span><button type="button" className={`photo-like-button ${liked ? "is-liked" : ""}`} onClick={toggle} disabled={pending} aria-label={liked ? "Remove like" : "Like this photograph"} aria-pressed={liked}><Heart fill={liked ? "currentColor" : "none"} aria-hidden="true" /><span>{likes}</span><small>{likes === 1 ? "like" : "likes"}</small></button></div>;
}
