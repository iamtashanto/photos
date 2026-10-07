import type { Photo } from "@/types/photography";

// SAMPLE CONTENT — replace these local files and records with your own photographs.
export const photos: Photo[] = [
  {
    id: "street-001", slug: "after-the-monsoon", title: "Monsoon Crossing",
    description: "Umbrellas move through the restless rhythm of a Dhaka street, turning an ordinary crossing into a layered city scene.",
    src: "/photos/street/dhaka-umbrellas.jpg", width: 3000, height: 2000, orientation: "landscape", category: "Street",
    location: "Dhaka", country: "Bangladesh", date: "2024-03-01", camera: "Fujifilm X-T30", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: true, tags: ["street", "umbrellas", "Dhaka"], alt: "People walking beneath umbrellas on a busy street in Dhaka", dominantColor: "#3a4141",
    credit: "Austin Curtis / Unsplash", sourceUrl: "https://unsplash.com/photos/kK199azc-5o",
  },
  {
    id: "nature-001", slug: "first-light-srimangal", title: "Tea Valley",
    description: "Rows of tea follow the shape of a Sylhet valley, held between deep green shade and a bright open sky.",
    src: "/photos/nature/sylhet-tea-valley.jpg", width: 3000, height: 1496, orientation: "panorama", category: "Nature",
    location: "Sylhet", country: "Bangladesh", date: "2024-01-28", camera: "Not recorded", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: true, tags: ["tea garden", "valley", "green"], alt: "A lush green tea garden valley surrounded by trees in Sylhet", dominantColor: "#53653d",
    credit: "Mosharraf Hossain / Unsplash", sourceUrl: "https://unsplash.com/photos/i3W2OJRKsL0",
  },
  {
    id: "portrait-001", slug: "window-light", title: "Rafee",
    description: "A close portrait made in Dhaka during Ramadan, direct in its gaze and quietly generous in its presence.",
    src: "/photos/portrait/rafee-dhaka.jpg", width: 3000, height: 2122, orientation: "landscape", category: "Portrait",
    location: "Dhaka", country: "Bangladesh", date: "2017-11-11", camera: "Not recorded", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: true, tags: ["portrait", "Ramadan", "Dhaka"], alt: "Close portrait of Rafee wearing a floral shirt in Dhaka", dominantColor: "#594f45",
    credit: "Adrien Taylor / Unsplash", sourceUrl: "https://unsplash.com/photos/PmbPqyfqgA0",
  },
  {
    id: "travel-001", slug: "hills-before-breakfast", title: "The Shipyard",
    description: "A vessel rests on the edge of Keraniganj, where the scale of industry meets the daily life of the river.",
    src: "/photos/travel/keraniganj-shipyard.jpg", width: 3000, height: 4046, orientation: "portrait", category: "Travel",
    location: "Keraniganj Shipyard, Dhaka", country: "Bangladesh", date: "2022-09-20", camera: "Xiaomi M2007J20CI", lens: "Built-in lens", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["travel", "shipyard", "waterfront"], alt: "A large vessel resting at Keraniganj Shipyard in Dhaka", dominantColor: "#77786f",
    credit: "Farhana Nidra / Unsplash", sourceUrl: "https://unsplash.com/photos/loBrxtoECjw",
  },
  {
    id: "architecture-001", slug: "city-of-thresholds", title: "Dhaka in Detail",
    description: "Sunlight catches the ornament and texture of a classical facade, revealing the patient craft held in the city’s architecture.",
    src: "/photos/architecture/classical-dhaka.jpg", width: 3456, height: 5184, orientation: "portrait", category: "Architecture",
    location: "Dhaka", country: "Bangladesh", date: "2026-01-21", camera: "Canon EOS 60D", lens: "50mm", focalLength: "50mm", aperture: "f/1.8", shutterSpeed: "1/2500s", iso: 160,
    featured: true, tags: ["architecture", "classical", "heritage"], alt: "Classical architectural details illuminated by sunlight in Dhaka", dominantColor: "#856e54",
    credit: "Tanha Tamanna Syed / Pexels", sourceUrl: "https://www.pexels.com/photo/36089157/",
  },
  {
    id: "street-002", slug: "the-long-way-home", title: "The Long Way Home",
    description: "Evening traffic, wet stone and one last fare through the old city.",
    src: "/photos/street/the-long-way-home.png", width: 1536, height: 1024, orientation: "landscape", category: "Street",
    location: "Chawkbazar, Dhaka", country: "Bangladesh", date: "2025-09-29", camera: "Sony α7 IV", lens: "35mm F1.4 GM", focalLength: "35mm", aperture: "f/1.8", shutterSpeed: "1/200s", iso: 1000,
    featured: false, tags: ["rickshaw", "rain", "evening"], alt: "A rickshaw travelling along a reflective street after rain", dominantColor: "#1b2b34",
  },
  {
    id: "portrait-002", slug: "a-quiet-hour", title: "A Quiet Hour",
    description: "The old room seemed to absorb every sound. The portrait found its own stillness there.",
    src: "/photos/portrait/a-quiet-hour.png", width: 1024, height: 1536, orientation: "portrait", category: "Portrait",
    location: "Narayanganj", country: "Bangladesh", date: "2025-08-10", camera: "Sony α7 IV", lens: "85mm F1.8", focalLength: "85mm", aperture: "f/2", shutterSpeed: "1/320s", iso: 320,
    featured: false, tags: ["portrait", "available light"], alt: "A contemplative black and white portrait in window light", dominantColor: "#2f2f2f",
  },
  {
    id: "misc-001", slug: "green-silence", title: "River Geometry",
    description: "A boat and fishing net draw spare lines across the quiet surface of a river in Naogaon.",
    src: "/photos/miscellaneous/naogaon-river.jpg", width: 3000, height: 2000, orientation: "landscape", category: "Miscellaneous",
    location: "Chuar Para, Naogaon", country: "Bangladesh", date: "2022-08-22", camera: "Canon EOS 70D", lens: "Not recorded", focalLength: "Not recorded", aperture: "Not recorded", shutterSpeed: "Not recorded", iso: 0,
    featured: false, tags: ["river", "boat", "fishing"], alt: "A small boat and fishing net on a quiet river in Naogaon", dominantColor: "#777a79",
    credit: "Neha Maheen Mahfin / Unsplash", sourceUrl: "https://unsplash.com/photos/wIjsVouZAzY",
  },
];
