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
  description?: string;
  story?: string;
  src: string;
  thumbnailSrc?: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: PhotoOrientation;
  category: PhotoCategory;
  collection?: string;
  location?: string;
  city?: string;
  country?: string;
  dateCaptured?: string;
  dateAdded: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  featured: boolean;
  homepageFeatured: boolean;
  featuredOrder?: number;
  sortOrder?: number;
  tags: string[];
  alt: string;
  altNeedsReview?: boolean;
  blurDataURL?: string;
  dominantColor?: string;
  copyright?: string;
  createdAt: string;
  updatedAt: string;
  fileSize?: number;
  sourceModifiedAt?: string;
  credit?: string;
  sourceUrl?: string;
}

export interface Collection {
  slug: string;
  name: PhotoCategory;
  description: string;
  coverPhotoSlug?: string;
}
