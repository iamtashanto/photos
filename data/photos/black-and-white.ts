import type { Photo } from "@/types/photography";

export const blackAndWhitePhotos = [
  {
    id: "black-and-white-001", slug: "chicago-in-monochrome", title: "Chicago in Monochrome",
    description: "Hard lines, winter light and a solitary figure reduce the city to rhythm and tone.",
    src: "/photos/black-and-white/chicago-lines.jpg", width: 3000, height: 4500, orientation: "portrait", category: "Black & White",
    location: "Chicago, Illinois", country: "United States", date: "2020-11-09", camera: "Canon EOS 6D", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["black and white", "urban", "geometry"], alt: "Monochrome urban architecture and a lone figure in Chicago", dominantColor: "#686868",
    credit: "Josh Hild / Unsplash", sourceUrl: "https://unsplash.com/photos/6IbaeeMr0Wo",
  },
] satisfies Photo[];

