import type { Photo } from "@/types/photography";

export const wildlifePhotos = [
  {
    id: "wildlife-001", slug: "black-kite-in-flight", title: "Black Kite",
    description: "A dark-winged kite turns through clear air, its gaze fixed beyond the frame.",
    src: "/photos/wildlife/black-kite.jpg", width: 3000, height: 3750, orientation: "portrait", category: "Wildlife",
    location: "Arvidsjaur", country: "Sweden", date: "2024-08-20", camera: "Sony α7R IV", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["wildlife", "bird", "flight"], alt: "A black kite flying against a softly blurred natural background", dominantColor: "#84908a",
    credit: "Christoph Nolte / Unsplash", sourceUrl: "https://unsplash.com/photos/2yJklGFqlug",
  },
] satisfies Photo[];

