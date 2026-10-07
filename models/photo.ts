import type { Photo, PhotoCategory } from "@/types/photography";

export type PhotoDocument = Photo & {
  cloudinaryPublicId?: string;
  published: boolean;
  migratedAt?: string;
  likes?: number;
  views?: number;
};

export const photoCategories: readonly PhotoCategory[] = [
  "Street", "Nature", "Landscape", "Travel", "Portrait", "Architecture",
  "Wildlife", "Macro", "Food", "Night", "Black & White", "Documentary",
  "Still Life", "Miscellaneous",
];

export type PhotoMetadataInput = {
  slug: string;
  title: string;
  category: PhotoCategory;
  collection?: string;
  alt?: string;
  description?: string;
  story?: string;
  location?: string;
  city?: string;
  country?: string;
  dateCaptured?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  copyright?: string;
  credit?: string;
  sourceUrl?: string;
  tags?: string[];
  featured?: boolean;
  homepageFeatured?: boolean;
  published?: boolean;
  sortOrder?: number;
  featuredOrder?: number;
};

export type PhotoUpdateInput = Partial<PhotoMetadataInput> & {
  collection?: string;
  published?: boolean;
  sortOrder?: number;
  featuredOrder?: number;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(value: unknown, field: string, maxLength: number, required = false) {
  if (value === undefined || value === null || value === "") {
    if (required) throw new Error(`${field} is required.`);
    return undefined;
  }
  if (typeof value !== "string" || value.trim().length > maxLength) {
    throw new Error(`${field} must be a string with at most ${maxLength} characters.`);
  }
  return value.trim();
}

function booleanValue(value: unknown, field: string) {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") throw new Error(`${field} must be a boolean.`);
  return value;
}

export function parsePhotoMetadata(input: unknown): PhotoMetadataInput {
  if (!input || typeof input !== "object") throw new Error("Photo metadata must be an object.");
  const value = input as Record<string, unknown>;
  const slug = text(value.slug, "Slug", 120, true)!;
  const title = text(value.title, "Title", 160, true)!;
  const category = text(value.category, "Category", 40, true)! as PhotoCategory;
  if (!slugPattern.test(slug)) throw new Error("Slug must use lowercase letters, numbers, and hyphens only.");
  if (!category || category.length < 2) throw new Error("Category is invalid.");
  if (value.iso !== undefined && value.iso !== "" && (!Number.isInteger(Number(value.iso)) || Number(value.iso) < 0)) throw new Error("ISO must be a valid non-negative number.");
  for (const field of ["sortOrder", "featuredOrder"] as const) {
    if (value[field] !== undefined && (!Number.isInteger(Number(value[field])) || Number(value[field]) < 0)) throw new Error(`${field} must be a non-negative integer.`);
  }
  const tags = value.tags === undefined ? [] : value.tags;
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string" || tag.length > 50)) {
    throw new Error("Tags must be an array of short strings.");
  }
  return {
    slug, title, category,
    alt: text(value.alt, "Alt text", 300),
    description: text(value.description, "Description", 2000),
    story: text(value.story, "Story", 5000),
    location: text(value.location, "Location", 160),
    city: text(value.city, "City", 100),
    country: text(value.country, "Country", 100),
    dateCaptured: text(value.dateCaptured, "Capture date", 30),
    collection: text(value.collection, "Collection", 160),
    camera: text(value.camera, "Camera", 160),
    lens: text(value.lens, "Lens", 160),
    focalLength: text(value.focalLength, "Focal length", 50),
    aperture: text(value.aperture, "Aperture", 50),
    shutterSpeed: text(value.shutterSpeed, "Shutter speed", 50),
    iso: value.iso === undefined || value.iso === "" ? undefined : Number(value.iso),
    copyright: text(value.copyright, "Copyright", 200),
    credit: text(value.credit, "Credit", 200),
    sourceUrl: text(value.sourceUrl, "Source URL", 500),
    tags: [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))],
    featured: booleanValue(value.featured, "Featured"),
    homepageFeatured: booleanValue(value.homepageFeatured, "Homepage featured"),
    published: booleanValue(value.published, "Published"),
    sortOrder: value.sortOrder === undefined ? undefined : Number(value.sortOrder),
    featuredOrder: value.featuredOrder === undefined ? undefined : Number(value.featuredOrder),
  };
}

export function parsePhotoUpdates(input: unknown): PhotoUpdateInput {
  if (!input || typeof input !== "object") throw new Error("Photo updates must be an object.");
  const source = input as Record<string, unknown>;
  const updates: PhotoUpdateInput = {};
  for (const field of ["slug", "title", "category", "collection", "alt", "description", "story", "location", "city", "country", "dateCaptured", "camera", "lens", "focalLength", "aperture", "shutterSpeed", "copyright", "credit", "sourceUrl"] as const) {
    if (source[field] !== undefined) {
      const required = field === "slug" || field === "title" || field === "category" || field === "alt";
      const maxLength = field === "description" ? 2000 : field === "story" ? 5000 : field === "sourceUrl" ? 500 : field === "alt" ? 300 : 160;
      const value = text(source[field], field, maxLength, required);
      if (field === "category" && (!value || value.length < 2)) throw new Error("Category is invalid.");
      if (field === "slug" && !slugPattern.test(value!)) throw new Error("Slug must use lowercase letters, numbers, and hyphens only.");
      updates[field] = value as never;
    }
  }
  if (source.iso !== undefined && source.iso !== "") {
    const iso = Number(source.iso);
    if (!Number.isInteger(iso) || iso < 0 || iso > 1000000) throw new Error("ISO must be a valid non-negative number.");
    updates.iso = iso;
  }
  if (source.tags !== undefined) {
    if (!Array.isArray(source.tags) || source.tags.some((tag) => typeof tag !== "string" || tag.length > 50)) throw new Error("Tags must be an array of short strings.");
    updates.tags = [...new Set(source.tags.map((tag) => tag.trim()).filter(Boolean))];
  }
  for (const field of ["featured", "homepageFeatured", "published"] as const) {
    if (source[field] !== undefined) updates[field] = booleanValue(source[field], field);
  }
  for (const field of ["sortOrder", "featuredOrder"] as const) {
    if (source[field] !== undefined) {
      if (!Number.isInteger(source[field]) || Number(source[field]) < 0) throw new Error(`${field} must be a non-negative integer.`);
      updates[field] = Number(source[field]);
    }
  }
  return updates;
}

export function buildPhotoDocument(
  metadata: PhotoMetadataInput,
  image: { secureUrl: string; publicId: string; width: number; height: number },
  now = new Date().toISOString(),
): PhotoDocument {
  const width = image.width || 1;
  const height = image.height || 1;
  return {
    ...metadata,
    id: metadata.slug,
    src: image.secureUrl,
    width,
    height,
    aspectRatio: width / height,
    orientation: width / height < 1 ? "portrait" : "landscape",
    dateAdded: now.slice(0, 10),
    tags: metadata.tags || [],
    alt: metadata.alt || `${metadata.title} photograph`,
    featured: metadata.featured || false,
    homepageFeatured: metadata.homepageFeatured || false,
    createdAt: now,
    updatedAt: now,
    cloudinaryPublicId: image.publicId,
    published: metadata.published ?? true,
  };
}
