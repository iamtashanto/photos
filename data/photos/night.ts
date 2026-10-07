import type { Photo } from "@/types/photography";

export const nightPhotos = [
  {
    id: "night-001", slug: "city-after-dark", title: "City After Dark",
    description: "Streetlights and passing cars dissolve into a cinematic study of the city at night.",
    src: "/photos/night/city-after-dark.jpg", width: 3000, height: 2400, orientation: "landscape", category: "Night",
    location: "London", country: "United Kingdom", date: "2019-02-14", camera: "Nikon D600", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: true, tags: ["night", "city", "lights"], alt: "A cinematic city street illuminated by lights after dark", dominantColor: "#15171d",
    credit: "Victor Cudjoe / Unsplash", sourceUrl: "https://unsplash.com/photos/fd6cljL89EE",
  },
] satisfies Photo[];

