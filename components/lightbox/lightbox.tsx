"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Info, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPhotoDate, getPhotoLocation } from "@/lib/photos";
import { getPhotoUrl } from "@/lib/image-source";
import type { Photo } from "@/types/photography";

export function Lightbox({
  photos,
  index,
  onClose,
  onChange,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const photo = photos[index];
  const [info, setInfo] = useState(false);
  const [direction, setDirection] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const infoPanelRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const indexRef = useRef(index);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  const change = useCallback(
    (nextDirection: number) => {
      setDirection(nextDirection);
      onChange((indexRef.current + nextDirection + photos.length) % photos.length);
      showControls();
      // Close info panel on navigation so it doesn't feel stale
      setInfo(false);
    },
    [onChange, photos.length, showControls],
  );

  // Toggle info panel and move focus into it (or back to button on close)
  const toggleInfo = useCallback(() => {
    setInfo((prev) => {
      const next = !prev;
      if (next) {
        // Focus the panel after it mounts
        requestAnimationFrame(() => {
          infoPanelRef.current?.focus();
        });
      } else {
        infoButtonRef.current?.focus();
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    idleTimer.current = setTimeout(() => setControlsVisible(false), 3000);

    const handler = (event: KeyboardEvent) => {
      showControls();
      if (event.key === "Escape") {
        if (info) {
          setInfo(false);
          infoButtonRef.current?.focus();
        } else {
          onClose();
        }
      }
      if (event.key === "ArrowLeft") change(-1);
      if (event.key === "ArrowRight") change(1);
      if (event.key.toLowerCase() === "i") toggleInfo();
      if (event.key === "Tab") {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href], [tabindex='0']") ?? [],
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1)!;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      previousFocus?.focus();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change, onClose, showControls, toggleInfo]);

  return (
    <motion.div
      ref={dialogRef}
      className={`lightbox ${controlsVisible || info ? "controls-visible" : "controls-hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} — fullscreen viewer`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24 }}
      onMouseMove={showControls}
      onPointerDown={(e) => {
        startX.current = e.clientX;
        showControls();
      }}
      onPointerUp={(e) => {
        const delta = e.clientX - startX.current;
        if (Math.abs(delta) > 55) {
          change(delta > 0 ? -1 : 1);
        }
      }}
      // Show controls on any tap/click that didn't trigger a swipe
      onClick={(e) => {
        const delta = Math.abs(e.clientX - startX.current);
        if (delta < 10) showControls();
      }}
    >
      <motion.div
        className="lightbox-top"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 0.1 }}
      >
        <span>
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <div>
          <button
            ref={infoButtonRef}
            onClick={toggleInfo}
            aria-label="Toggle photograph information"
            aria-pressed={info}
          >
            <Info aria-hidden="true" />
          </button>
          <button ref={closeRef} onClick={onClose} aria-label="Close viewer">
            <X aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id}
          className="lightbox-image"
          initial={{ opacity: 0, x: reduceMotion ? 0 : direction * 14, scale: reduceMotion ? 1 : 0.992 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: reduceMotion ? 0 : direction * -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={getPhotoUrl(photo)}
            alt={photo.alt}
            fill
            sizes="100vw"
            quality={92}
            loading="eager"
            fetchPriority="high"
            placeholder={photo.blurDataURL ? "blur" : "empty"}
            blurDataURL={photo.blurDataURL}
          />
        </motion.div>
      </AnimatePresence>

      <button className="lightbox-prev" onClick={() => change(-1)} aria-label="Previous photograph">
        <ArrowLeft aria-hidden="true" />
      </button>
      <button className="lightbox-next" onClick={() => change(1)} aria-label="Next photograph">
        <ArrowRight aria-hidden="true" />
      </button>

      <div className="lightbox-caption">
        <div>
          <strong>{photo.title}</strong>
          <span>{getPhotoLocation(photo)}</span>
        </div>
        <Link href={`/photo/${photo.slug}`}>
          View story <ExternalLink aria-hidden="true" />
        </Link>
      </div>

      <AnimatePresence>
        {info && (
          <motion.aside
            ref={infoPanelRef}
            className="lightbox-info"
            tabIndex={-1}
            aria-label="Photograph details"
            initial={{ opacity: 0, x: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : 10 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{formatPhotoDate(photo.dateCaptured, true)}</p>
            <dl>
              {photo.camera && (
                <div>
                  <dt>Camera</dt>
                  <dd>{photo.camera}</dd>
                </div>
              )}
              {photo.lens && (
                <div>
                  <dt>Lens</dt>
                  <dd>{photo.lens}</dd>
                </div>
              )}
              {(photo.aperture || photo.shutterSpeed || photo.iso) && (
                <div>
                  <dt>Exposure</dt>
                  <dd>
                    {[
                      photo.aperture && photo.aperture !== "Not recorded" ? photo.aperture : null,
                      photo.shutterSpeed && photo.shutterSpeed !== "Not recorded" ? photo.shutterSpeed : null,
                      photo.iso && photo.iso > 0 ? `ISO ${photo.iso}` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Not recorded"}
                  </dd>
                </div>
              )}
              {photo.credit && (
                <div>
                  <dt>Photo Credit</dt>
                  <dd>{photo.credit}</dd>
                </div>
              )}
            </dl>
            <small>Press I to toggle details</small>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
