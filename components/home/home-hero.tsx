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
    <section className="home-hero">
      <motion.div className="hero-image" initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.018 }} animate={{ opacity: 1, scale: 1 }} transition={transition}>
        <Image src={getPhotoUrl(photo)} alt={photo.alt} fill preload sizes="100vw" quality={90} />
      </motion.div>
      <div className="hero-shade" />
      <div className="hero-copy">
        <motion.p initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.12 }}>TA Shanto / Photography</motion.p>
        <motion.h1 initial={{ opacity: 0, y: reduceMotion ? 0 : 9 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.2 }}>Stories shaped by<br /><em>light, place &amp; time.</em></motion.h1>
      </div>
      <motion.div className="hero-index" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.3 }}><span>Dhaka, Bangladesh</span><Link href={`/photo/${photo.slug}`}>{photo.title} <ArrowUpRight /></Link></motion.div>
      <motion.a className="scroll-cue" href="#selected" aria-label="Scroll to selected work" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.35 }} whileTap={{ scale: reduceMotion ? 1 : 0.96 }}><ArrowDown /></motion.a>
    </section>
  );
}
