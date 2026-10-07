import type { Photo } from "@/types/photography";

export const architecturePhotos = [
  {
    id: "architecture-001", slug: "city-of-thresholds", title: "Dhaka in Detail",
    description: "Sunlight catches the ornament and texture of a classical facade, revealing the patient craft held in the city’s architecture.",
    src: "/photos/architecture/classical-dhaka.jpg", width: 3456, height: 5184, orientation: "portrait", category: "Architecture",
    location: "Dhaka", country: "Bangladesh", date: "2026-01-21", camera: "Canon EOS 60D", lens: "50mm", focalLength: "50mm", aperture: "f/1.8", shutterSpeed: "1/2500s", iso: 160,
    featured: true, tags: ["architecture", "classical", "heritage"], alt: "Classical architectural details illuminated by sunlight in Dhaka", dominantColor: "#856e54",
    credit: "Tanha Tamanna Syed / Pexels", sourceUrl: "https://www.pexels.com/photo/36089157/",
  },
] satisfies Photo[];

