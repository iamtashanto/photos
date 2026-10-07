import type { Photo } from "@/types/photography";

export const foodPhotos = [
  {
    id: "food-001", slug: "biryani-at-home", title: "Biryani at Home",
    description: "A generous plate of biryani turns a familiar meal into a study of colour, texture and comfort.",
    src: "/photos/food/bangladeshi-biryani.jpg", width: 3000, height: 2000, orientation: "landscape", category: "Food",
    location: "Dhaka", country: "Bangladesh", date: "2026-03-02", camera: "Nikon D3300", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["food", "biryani", "Bangladesh"], alt: "A colourful plate of Bangladeshi biryani served with accompaniments", dominantColor: "#9a633c",
    credit: "Mohammad Fahim / Unsplash", sourceUrl: "https://unsplash.com/photos/cLJa_074rcA",
  },
] satisfies Photo[];

