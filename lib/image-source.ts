import type { Photo } from "@/types/photography";

// Keep storage-specific URL logic here when migrating to R2, Cloudinary, or S3.
export const getPhotoUrl = (photo: Photo) => photo.src;
export const getPhotoThumbnailUrl = (photo: Photo) => photo.thumbnailSrc ?? getPhotoUrl(photo);
