"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Photo } from "@/types/photography";
import { getPhotoUrl } from "@/lib/image-source";

export function HomeHero({ photo }: { photo: Photo }) {
  const reduceMotion = useReducedMotion();
  const transition = { duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section className="relative h-svh min-h-[620px] overflow-hidden text-[#f0ede6] max-sm:min-h-[42rem]" aria-label="Hero — TA Shanto Photography">
      <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.018 }} animate={{ opacity: 1, scale: 1 }} transition={transition}>
        <Image className="object-cover max-sm:object-[58%_center]" src={getPhotoUrl(photo)} alt={photo.alt} fill preload sizes="100vw" quality={90} />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.55),transparent_62%),linear-gradient(0deg,rgba(0,0,0,.4),transparent_50%)]" />
      <div className="absolute bottom-[clamp(7.5rem,15vh,10.5rem)] left-[clamp(1.25rem,6vw,7rem)] right-5">
        <motion.p className="mb-5 text-xs uppercase tracking-[.22em]" initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.12 }}>TA Shanto / Photography</motion.p>
        <motion.h1 className="m-0 max-w-5xl text-balance font-[family-name:var(--serif)] text-[clamp(3.4rem,6.6vw,7.25rem)] leading-[.88] tracking-[-.04em] max-sm:text-[clamp(3rem,14vw,4.25rem)]" initial={{ opacity: 0, y: reduceMotion ? 0 : 9 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.2 }}>Stories shaped by<br /><em className="font-normal text-[#d5d0c6]">light, place & time.</em></motion.h1>
      </div>
      <motion.div className="absolute bottom-9 left-[clamp(1.25rem,4vw,4.5rem)] right-[clamp(1.25rem,4vw,4.5rem)] flex justify-between text-xs uppercase tracking-widest max-sm:bottom-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.3 }}><span className="max-sm:hidden">Dhaka, Bangladesh</span><Link className="flex items-center gap-2" href={`/photo/${photo.slug}`}>{photo.title} <ArrowUpRight className="size-4" /></Link></motion.div>
      <motion.a className="absolute right-[clamp(1.25rem,4vw,4.5rem)] top-1/2 grid size-14 place-items-center rounded-full border border-white/30 max-sm:hidden" href="#selected" aria-label="Scroll to selected work" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.35 }} whileTap={{ scale: reduceMotion ? 1 : 0.96 }}><ArrowDown className="size-4" /></motion.a>
    </section>
  );
}
