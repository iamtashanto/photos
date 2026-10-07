import type { Photo } from "@/types/photography";

export const macroPhotos = [
  {
    id: "macro-001", slug: "coneflower-study", title: "Coneflower Study",
    description: "The geometry of a coneflower fills the frame, revealing detail usually passed at a glance.",
    src: "/photos/macro/coneflower-detail.jpg", width: 3000, height: 2000, orientation: "landscape", category: "Macro",
    location: "Huber Heights, Ohio", country: "United States", date: "2018-09-09", camera: "Canon EOS 77D", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["macro", "flower", "texture"], alt: "Close macro view of the textured centre and petals of a coneflower", dominantColor: "#a75b55",
    credit: "Jace Abshire / Unsplash", sourceUrl: "https://unsplash.com/photos/_vyDa3STjPg",
  },
] satisfies Photo[];

