import type { Photo } from "@/types/photography";

export const travelPhotos = [
  {
    id: "travel-001", slug: "hills-before-breakfast", title: "The Shipyard",
    description: "A vessel rests on the edge of Keraniganj, where the scale of industry meets the daily life of the river.",
    src: "/photos/travel/keraniganj-shipyard.jpg", width: 3000, height: 4046, orientation: "portrait", category: "Travel",
    location: "Keraniganj Shipyard, Dhaka", country: "Bangladesh", date: "2022-09-20", camera: "Xiaomi M2007J20CI", lens: "Built-in lens", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["travel", "shipyard", "waterfront"], alt: "A large vessel resting at Keraniganj Shipyard in Dhaka", dominantColor: "#77786f",
    credit: "Farhana Nidra / Unsplash", sourceUrl: "https://unsplash.com/photos/loBrxtoECjw",
  },
] satisfies Photo[];

