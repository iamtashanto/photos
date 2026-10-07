import { allPhotos, categories, fileExists, getOrientation, loadMetadata, slugify } from "./shared.mjs";

const photos = allPhotos(await loadMetadata());
const errors = [];
const warnings = [];
const seen = { id: new Map(), slug: new Map(), src: new Map() };
const datePattern = /^\d{4}-\d{2}-\d{2}(?:T.*)?$/;
const validDate = (value) => datePattern.test(value) && !Number.isNaN(new Date(value.length === 10 ? `${value}T00:00:00Z` : value).valueOf());

for (const photo of photos) {
  for (const key of ["id", "slug", "src"]) {
    if (!photo[key]) errors.push(`Missing ${key} in ${photo.src || photo.title || "unknown entry"}`);
    else if (seen[key].has(photo[key])) errors.push(`Duplicate photo ${key} detected: ${photo[key]}\n  Used by: ${seen[key].get(photo[key])}\n           ${photo.src}`);
    else seen[key].set(photo[key], photo.src);
  }
  if (!photo.title?.trim()) warnings.push(`${photo.src}: missing title`);
  if (!photo.alt?.trim()) warnings.push(`${photo.src}: missing alt text`);
  if (photo.altNeedsReview) warnings.push(`${photo.src}: generated alt text needs human review`);
  if (!Object.values(categories).includes(photo.category)) errors.push(`${photo.src}: unknown category “${photo.category}”`);
  if (!/^\/[a-z0-9/_-]+\.(?:jpe?g|png|webp|avif)$/i.test(photo.src)) errors.push(`${photo.src}: src must be a supported root-relative image path`);
  if (photo.slug && slugify(photo.slug) !== photo.slug) errors.push(`${photo.src}: slug must be URL-safe (“${slugify(photo.slug)}” suggested)`);
  if (!(photo.width > 0 && photo.height > 0)) errors.push(`${photo.src}: width and height must be positive numbers`);
  if (photo.width > 0 && photo.height > 0 && photo.orientation !== getOrientation(photo.width, photo.height)) errors.push(`${photo.src}: orientation should be ${getOrientation(photo.width, photo.height)}`);
  if (photo.dateCaptured && !validDate(photo.dateCaptured)) errors.push(`${photo.src}: invalid dateCaptured “${photo.dateCaptured}”`);
  if (!photo.dateAdded || !validDate(photo.dateAdded)) errors.push(`${photo.src}: dateAdded must use a valid YYYY-MM-DD or ISO date`);
  if (!(await fileExists(photo.src))) errors.push(`Metadata references missing image: ${photo.src}`);
  for (const optional of ["location", "dateCaptured", "camera"]) if (!photo[optional]) warnings.push(`${photo.src}: optional ${optional} is not set`);
}

for (const warning of warnings) console.warn(`⚠ ${warning}`);
for (const error of errors) console.error(`✖ ${error}`);
console.log(`\nValidated ${photos.length} photographs: ${errors.length} errors, ${warnings.length} warnings.`);
if (errors.length) process.exitCode = 1;
