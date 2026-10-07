import type { Photo } from "@/types/photography";

export const naturePhotos = [
  {
    id: "nature-001", slug: "first-light-srimangal", title: "Tea Valley",
    description: "Rows of tea follow the shape of a Sylhet valley, held between deep green shade and a bright open sky.",
    src: "/photos/nature/sylhet-tea-valley.jpg", width: 3000, height: 1496, orientation: "panorama", category: "Nature",
    location: "Sylhet", country: "Bangladesh", date: "2024-01-28", camera: "Not recorded", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: true, tags: ["tea garden", "valley", "green"], alt: "A lush green tea garden valley surrounded by trees in Sylhet", dominantColor: "#53653d",
    credit: "Mosharraf Hossain / Unsplash", sourceUrl: "https://unsplash.com/photos/i3W2OJRKsL0",
  },
] satisfies Photo[];

