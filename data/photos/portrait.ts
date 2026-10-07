import type { Photo } from "@/types/photography";

export const portraitPhotos = [
  {
    id: "portrait-001", slug: "window-light", title: "Rafee",
    description: "A close portrait made in Dhaka during Ramadan, direct in its gaze and quietly generous in its presence.",
    src: "/photos/portrait/rafee-dhaka.jpg", width: 3000, height: 2122, orientation: "landscape", category: "Portrait",
    location: "Dhaka", country: "Bangladesh", date: "2017-11-11", camera: "Not recorded", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: true, tags: ["portrait", "Ramadan", "Dhaka"], alt: "Close portrait of Rafee wearing a floral shirt in Dhaka", dominantColor: "#594f45",
    credit: "Adrien Taylor / Unsplash", sourceUrl: "https://unsplash.com/photos/PmbPqyfqgA0",
  },
  {
    id: "portrait-002", slug: "a-quiet-hour", title: "A Quiet Hour",
    description: "The old room seemed to absorb every sound. The portrait found its own stillness there.",
    src: "/photos/portrait/a-quiet-hour.png", width: 1024, height: 1536, orientation: "portrait", category: "Portrait",
    location: "Narayanganj", country: "Bangladesh", date: "2025-08-10", camera: "iPhone 15", lens: "Main camera · 2× crop", focalLength: "52mm equivalent", aperture: "f/1.6", shutterSpeed: "1/320s", iso: 320,
    featured: false, tags: ["portrait", "available light"], alt: "A contemplative black and white portrait in window light", dominantColor: "#2f2f2f",
  },
] satisfies Photo[];

