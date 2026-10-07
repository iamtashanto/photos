"use client";

import { Heart } from "lucide-react";
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
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void fetch(`/api/photos/${slug}/like/count`).then((response) => response.ok ? response.json() : null).then((data: { likes?: number } | null) => {
      if (data?.likes !== undefined) setLikes(data.likes);
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

  return <button type="button" className={`photo-like-button ${liked ? "is-liked" : ""}`} onClick={toggle} disabled={pending} aria-label={liked ? "Remove like" : "Like this photograph"} aria-pressed={liked}><Heart fill={liked ? "currentColor" : "none"} aria-hidden="true" /><span>{likes}</span></button>;
}
