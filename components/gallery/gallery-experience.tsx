"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { PhotoCard } from "./photo-card";
import { Lightbox } from "@/components/lightbox/lightbox";
import { photoCategories } from "@/types/photography";
import type { Photo, PhotoCategory } from "@/types/photography";

const filters: Array<"All" | PhotoCategory> = ["All", ...photoCategories];

export function GalleryExperience({ photos, showFilters = true }: { photos: Photo[]; showFilters?: boolean }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [active, setActive] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const visible = useMemo(
    () => (filter === "All" ? photos : photos.filter((photo) => photo.category === filter)),
    [filter, photos],
  );

  return (
    <>
      {showFilters && (
        <div className="gallery-filters" role="group" aria-label="Filter gallery by category">
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {visible.length ? (
        <motion.div layout className="gallery-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((photo, index) => (
              <motion.div
                layout={!reduceMotion}
                key={photo.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.992 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.99 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.34,
                  delay: reduceMotion ? 0 : Math.min(index, 4) * 0.035,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <PhotoCard photo={photo} onOpen={() => setActive(index)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="empty-state" role="status" aria-live="polite">
          <p>No frames in this collection yet.</p>
          <span>The next photograph may already be on its way.</span>
        </div>
      )}

      <AnimatePresence>
        {active !== null && (
          <Lightbox photos={visible} index={active} onChange={setActive} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
