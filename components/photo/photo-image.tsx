"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/types/photography";
import { getPhotoThumbnailUrl } from "@/lib/image-source";

export function PhotoImage({ photo, sizes, preload = false, fill = false, className = "" }: { photo: Photo; sizes: string; preload?: boolean; fill?: boolean; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden leading-none ${className}`} style={{ backgroundColor: photo.dominantColor }}>
      <Image className={`block h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out ${loaded ? "scale-100 opacity-100" : "scale-[1.006] opacity-0"}`} src={getPhotoThumbnailUrl(photo)} alt={photo.alt} width={fill ? undefined : photo.width} height={fill ? undefined : photo.height} fill={fill} sizes={sizes} preload={preload} quality={88} placeholder={photo.blurDataURL ? "blur" : "empty"} blurDataURL={photo.blurDataURL} onLoad={() => setLoaded(true)} data-loaded={loaded} />
    </div>
  );
}
