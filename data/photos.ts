import type { Photo } from "@/types/photography";

// SAMPLE CONTENT — replace these local files and records with your own photographs.
export const photos: Photo[] = [
  {
    id: "street-001", slug: "after-the-monsoon", title: "After the Monsoon",
    description: "Rain briefly rearranges the city. Light gathers on the road and an ordinary journey becomes a small piece of theatre.",
    src: "/photos/street/after-the-monsoon.png", width: 1536, height: 1024, orientation: "landscape", category: "Street",
    location: "Old Dhaka", country: "Bangladesh", date: "2026-07-14", camera: "Sony α7 IV", lens: "35mm F1.4 GM", focalLength: "35mm", aperture: "f/2.0", shutterSpeed: "1/160s", iso: 800,
    featured: true, tags: ["monsoon", "street", "blue hour"], alt: "A rickshaw crossing a rain-soaked street in Old Dhaka at blue hour", dominantColor: "#182a37",
  },
  {
    id: "nature-001", slug: "first-light-srimangal", title: "First Light",
    description: "A quiet path through the tea gardens before the working day begins, when the hills appear one layer at a time.",
    src: "/photos/nature/first-light.png", width: 1536, height: 1024, orientation: "landscape", category: "Nature",
    location: "Srimangal", country: "Bangladesh", date: "2026-02-08", camera: "Sony α7 IV", lens: "24–70mm F2.8 GM II", focalLength: "42mm", aperture: "f/5.6", shutterSpeed: "1/320s", iso: 200,
    featured: true, tags: ["mist", "tea garden", "dawn"], alt: "Misty tea gardens in Srimangal at sunrise with a lone worker on a path", dominantColor: "#526252",
  },
  {
    id: "portrait-001", slug: "window-light", title: "Window Light",
    description: "A portrait made in the pause between conversation—soft daylight, worn walls and a moment of inward attention.",
    src: "/photos/portrait/window-light.png", width: 1024, height: 1536, orientation: "portrait", category: "Portrait",
    location: "Dhaka", country: "Bangladesh", date: "2026-04-21", camera: "Sony α7 IV", lens: "85mm F1.8", focalLength: "85mm", aperture: "f/2.2", shutterSpeed: "1/250s", iso: 400,
    featured: true, tags: ["portrait", "monochrome", "window"], alt: "Black and white portrait of a young man sitting beside an old window", dominantColor: "#353535",
  },
  {
    id: "travel-001", slug: "hills-before-breakfast", title: "Hills Before Breakfast",
    description: "Dawn lifting over the tea country, seen from a road taken without a plan.",
    src: "/photos/travel/hills-before-breakfast.png", width: 1536, height: 1024, orientation: "panorama", category: "Travel",
    location: "Sylhet Division", country: "Bangladesh", date: "2025-12-18", camera: "Sony α7 IV", lens: "24–70mm F2.8 GM II", focalLength: "28mm", aperture: "f/8", shutterSpeed: "1/200s", iso: 100,
    featured: false, tags: ["travel", "hills", "morning"], alt: "Layered green hills and tea gardens emerging through dawn mist", dominantColor: "#69766d",
  },
  {
    id: "architecture-001", slug: "city-of-thresholds", title: "City of Thresholds",
    description: "Old facades hold the city’s memory while daily life passes through them without ceremony.",
    src: "/photos/architecture/city-of-thresholds.png", width: 1536, height: 1024, orientation: "landscape", category: "Architecture",
    location: "Old Dhaka", country: "Bangladesh", date: "2025-11-02", camera: "Sony α7 IV", lens: "35mm F1.4 GM", focalLength: "35mm", aperture: "f/4", shutterSpeed: "1/125s", iso: 640,
    featured: true, tags: ["architecture", "heritage", "night"], alt: "Historic architecture and glowing shopfronts on a wet Old Dhaka street", dominantColor: "#32251d",
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
    id: "misc-001", slug: "green-silence", title: "Green Silence",
    description: "A field study in repetition, distance and the softness of morning light.",
    src: "/photos/miscellaneous/green-silence.png", width: 1536, height: 1024, orientation: "square", category: "Miscellaneous",
    location: "Srimangal", country: "Bangladesh", date: "2025-06-04", camera: "Sony α7 IV", lens: "24–70mm F2.8 GM II", focalLength: "50mm", aperture: "f/6.3", shutterSpeed: "1/250s", iso: 160,
    featured: false, tags: ["study", "green", "quiet"], alt: "Sunrise and mist over rows of tea plants", dominantColor: "#53644f",
  },
];
