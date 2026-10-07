import type { Photo } from "@/types/photography";

export const formatPhotoDate = (date?: string, detailed = false) => date
  ? new Intl.DateTimeFormat("en-GB", { day: detailed ? "numeric" : undefined, month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date.slice(0, 10)}T00:00:00Z`))
  : "Date not recorded";
export const getPhotoYear = (photo: Photo) => photo.dateCaptured?.slice(0, 4) ?? photo.dateAdded.slice(0, 4);
export const getPhotoLocation = (photo: Photo) => {
  const parts = [photo.location || photo.city, photo.country].filter(Boolean) as string[];
  return parts.filter((part, index) => !parts.slice(0, index).some((previous) => {
    const current = part.toLowerCase();
    const earlier = previous.toLowerCase();
    return current === earlier || current.includes(earlier) || earlier.includes(current);
  })).join(", ") || "Location not recorded";
};
