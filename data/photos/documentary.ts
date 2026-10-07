import type { Photo } from "@/types/photography";

export const documentaryPhotos = [
  {
    id: "documentary-001", slug: "market-aisle", title: "Market Aisle",
    description: "A crowded aisle holds the layered gestures, exchanges and details of everyday commerce.",
    src: "/photos/documentary/market-aisle.jpg", width: 3000, height: 2007, orientation: "landscape", category: "Documentary",
    location: "Local Market", country: "Türkiye", date: "2026-05-14", camera: "Film scan", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["documentary", "market", "daily life"], alt: "People moving through a busy covered market aisle", dominantColor: "#75604e",
    credit: "Onur Kurt / Unsplash", sourceUrl: "https://unsplash.com/photos/fKdUakd75kU",
  },
] satisfies Photo[];

