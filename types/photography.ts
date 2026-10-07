export const photoCategories = [
  "Street", "Nature", "Landscape", "Travel", "Portrait", "Architecture",
  "Wildlife", "Macro", "Food", "Night", "Black & White", "Documentary",
  "Still Life", "Miscellaneous",
] as const;

export type PhotoCategory = (typeof photoCategories)[number];
export type PhotoOrientation = "portrait" | "landscape" | "square" | "panorama";

export interface Photo {
  id: string;
  slug: string;
  title: string;
  description: string;
  src: string;
  width: number;
  height: number;
  orientation: PhotoOrientation;
  category: PhotoCategory;
  location: string;
  country: string;
  date: string;
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  featured: boolean;
  tags: string[];
  alt: string;
  dominantColor: string;
  credit?: string;
  sourceUrl?: string;
}

export interface Collection {
  slug: string;
  name: PhotoCategory;
  description: string;
  coverPhotoSlug: string;
}
