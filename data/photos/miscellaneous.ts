import type { Photo } from "@/types/photography";

export const miscellaneousPhotos = [
  {
    id: "misc-001", slug: "green-silence", title: "River Geometry",
    description: "A boat and fishing net draw spare lines across the quiet surface of a river in Naogaon.",
    src: "/photos/miscellaneous/naogaon-river.jpg", width: 3000, height: 2000, orientation: "landscape", category: "Miscellaneous",
    location: "Chuar Para, Naogaon", country: "Bangladesh", date: "2022-08-22", camera: "Canon EOS 70D", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["river", "boat", "fishing"], alt: "A small boat and fishing net on a quiet river in Naogaon", dominantColor: "#777a79",
    credit: "Neha Maheen Mahfin / Unsplash", sourceUrl: "https://unsplash.com/photos/wIjsVouZAzY",
  },
] satisfies Photo[];

