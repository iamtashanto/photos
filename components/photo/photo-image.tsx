"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/types/photography";

export function PhotoImage({ photo, sizes, preload = false, fill = false, className = "" }: { photo: Photo; sizes: string; preload?: boolean; fill?: boolean; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`photo-image ${loaded ? "is-loaded" : ""} ${className}`} style={{ backgroundColor: photo.dominantColor }}>
      <Image src={photo.src} alt={photo.alt} width={fill ? undefined : photo.width} height={fill ? undefined : photo.height} fill={fill} sizes={sizes} preload={preload} quality={88} onLoad={() => setLoaded(true)} data-loaded={loaded} />
    </div>
  );
}
