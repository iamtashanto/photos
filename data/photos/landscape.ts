import type { Photo } from "@/types/photography";

export const landscapePhotos = [
  {
    id: "landscape-001", slug: "rural-horizon", title: "Rural Horizon",
    description: "Palms rise above an open field beneath a broad blue sky, a quiet study of scale and distance.",
    src: "/photos/landscape/rural-bangladesh.jpg", width: 3000, height: 2247, orientation: "landscape", category: "Landscape",
    location: "Rural Bangladesh", country: "Bangladesh", date: "2026-03-06", camera: "Realme RMX3491", lens: "Built-in lens", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: true, tags: ["landscape", "rural", "palms"], alt: "Tall palm trees standing above a green field under a blue sky", dominantColor: "#7397a6",
    credit: "Ashikul Islam Anik / Unsplash", sourceUrl: "https://unsplash.com/photos/929JkT8KGxs",
  },
] satisfies Photo[];

