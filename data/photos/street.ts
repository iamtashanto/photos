import type { Photo } from "@/types/photography";

export const streetPhotos = [
  {
    id: "street-001", slug: "after-the-monsoon", title: "Monsoon Crossing",
    description: "Umbrellas move through the restless rhythm of a Dhaka street, turning an ordinary crossing into a layered city scene.",
    src: "/photos/street/dhaka-umbrellas.jpg", width: 3000, height: 2000, orientation: "landscape", category: "Street",
    location: "Dhaka", country: "Bangladesh", date: "2024-03-01", camera: "Fujifilm X-T30", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: true, tags: ["street", "umbrellas", "Dhaka"], alt: "People walking beneath umbrellas on a busy street in Dhaka", dominantColor: "#3a4141",
    credit: "Austin Curtis / Unsplash", sourceUrl: "https://unsplash.com/photos/kK199azc-5o",
  },
  {
    id: "street-002", slug: "the-long-way-home", title: "The Long Way Home",
    description: "Evening traffic, wet stone and one last fare through the old city.",
    src: "/photos/street/the-long-way-home.png", width: 1536, height: 1024, orientation: "landscape", category: "Street",
    location: "Chawkbazar, Dhaka", country: "Bangladesh", date: "2025-09-29", camera: "iPhone 15", lens: "Main camera", focalLength: "26mm equivalent", aperture: "f/1.6", shutterSpeed: "1/200s", iso: 1000,
    featured: false, tags: ["rickshaw", "rain", "evening"], alt: "A rickshaw travelling along a reflective street after rain", dominantColor: "#1b2b34",
  },
] satisfies Photo[];

