import type { Photo } from "@/types/photography";

export const stillLifePhotos = [
  {
    id: "still-life-001", slug: "fruit-and-book", title: "Fruit and Book",
    description: "Fruit, paper and soft window light form a contemporary still life with an old-world calm.",
    src: "/photos/still-life/fruit-and-book.jpg", width: 3000, height: 2000, orientation: "landscape", category: "Still Life",
    location: "Studio", country: "Unspecified", date: "2025-09-27", camera: "Fujifilm X-T20", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["still life", "fruit", "book"], alt: "Fruit arranged beside an open book in soft natural light", dominantColor: "#765c43",
    credit: "Andrey Metelev / Unsplash", sourceUrl: "https://unsplash.com/photos/BgvI8PmuO_Q",
  },
] satisfies Photo[];

