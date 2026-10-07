"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PhotoCard } from "./photo-card";
import { Lightbox } from "@/components/lightbox/lightbox";
import type { Photo, PhotoCategory } from "@/types/photography";

const filters: Array<"All" | Exclude<PhotoCategory, "Miscellaneous">> = ["All", "Street", "Nature", "Travel", "Portrait", "Architecture"];

export function GalleryExperience({ photos, showFilters = true }: { photos: Photo[]; showFilters?: boolean }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [active, setActive] = useState<number | null>(null);
  const visible = useMemo(() => filter === "All" ? photos : photos.filter((photo) => photo.category === filter), [filter, photos]);
  return (
    <>
      {showFilters && <div className="gallery-filters" role="group" aria-label="Filter gallery">{filters.map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>}
      {visible.length ? <motion.div layout className="gallery-grid">{visible.map((photo, index) => <motion.div layout key={photo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PhotoCard photo={photo} priority={index < 3} onOpen={() => setActive(index)} /></motion.div>)}</motion.div> : <div className="empty-state"><p>No frames in this collection yet.</p><span>The next photograph may already be on its way.</span></div>}
      <AnimatePresence>{active !== null && <Lightbox photos={visible} index={active} onChange={setActive} onClose={() => setActive(null)} />}</AnimatePresence>
    </>
  );
}
