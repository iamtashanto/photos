"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Info, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPhotoDate } from "@/lib/photos";
import type { Photo } from "@/types/photography";

export function Lightbox({ photos, index, onClose, onChange }: { photos: Photo[]; index: number; onClose: () => void; onChange: (index: number) => void }) {
  const photo = photos[index];
  const [info, setInfo] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const change = useCallback((direction: number) => onChange((index + direction + photos.length) % photos.length), [index, onChange, photos.length]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") change(-1);
      if (event.key === "ArrowRight") change(1);
      if (event.key.toLowerCase() === "i") setInfo((value) => !value);
      if (event.key === "Tab") {
        const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1)!;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); previousFocus?.focus(); };
  }, [change, onClose]);

  return (
    <motion.div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label={`${photo.title} fullscreen viewer`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onPointerDown={(e) => startX.current = e.clientX} onPointerUp={(e) => { const delta = e.clientX - startX.current; if (Math.abs(delta) > 55) change(delta > 0 ? -1 : 1); }}>
      <div className="lightbox-top">
        <span>{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
        <div><button onClick={() => setInfo(!info)} aria-label="Toggle photograph information" aria-pressed={info}><Info /></button><button ref={closeRef} onClick={onClose} aria-label="Close viewer"><X /></button></div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={photo.id} className="lightbox-image" initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>
          <Image src={photo.src} alt={photo.alt} fill sizes="100vw" quality={92} priority />
        </motion.div>
      </AnimatePresence>
      <button className="lightbox-prev" onClick={() => change(-1)} aria-label="Previous photograph"><ArrowLeft /></button>
      <button className="lightbox-next" onClick={() => change(1)} aria-label="Next photograph"><ArrowRight /></button>
      <div className="lightbox-caption"><div><strong>{photo.title}</strong><span>{photo.location}, {photo.country}</span></div><Link href={`/photo/${photo.slug}`}>View story <ExternalLink /></Link></div>
      <AnimatePresence>{info && <motion.aside className="lightbox-info" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}><p>{formatPhotoDate(photo.date, true)}</p><dl><div><dt>Camera</dt><dd>{photo.camera}</dd></div><div><dt>Lens</dt><dd>{photo.lens}</dd></div><div><dt>Exposure</dt><dd>{photo.aperture} · {photo.shutterSpeed} · ISO {photo.iso || "—"}</dd></div>{photo.credit && <div><dt>Demo credit</dt><dd>{photo.credit}</dd></div>}</dl><small>Press I to toggle details</small></motion.aside>}</AnimatePresence>
    </motion.div>
  );
}
