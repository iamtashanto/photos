import { allPhotos, fileExists, loadMetadata } from "./shared.mjs";

const warningBytes = Number(process.env.PHOTO_WARN_MB || 4) * 1024 * 1024;
const criticalBytes = Number(process.env.PHOTO_CRITICAL_MB || 8) * 1024 * 1024;
const photos = allPhotos(await loadMetadata());
let warnings = 0;

for (const photo of photos) {
  const missing = [];
  if (!photo.title?.trim()) missing.push("title");
  if (!photo.alt?.trim()) missing.push("alt");
  if (!photo.category) missing.push("category");
  if (missing.length) { warnings++; console.warn(`⚠ ${photo.src}\n  Missing: ${missing.join(", ")}`); }
  if (photo.altNeedsReview) { warnings++; console.warn(`⚠ ${photo.src}\n  Alt text is generated and needs human review.`); }
  if (!(await fileExists(photo.src))) { warnings++; console.warn(`⚠ ${photo.src}\n  Referenced image is missing.`); }
  if ((photo.fileSize || 0) >= criticalBytes) { warnings++; console.warn(`✖ ${photo.src}\n  Critical size: ${(photo.fileSize / 1024 / 1024).toFixed(1)} MB`); }
  else if ((photo.fileSize || 0) >= warningBytes) { warnings++; console.warn(`⚠ ${photo.src}\n  Large file: ${(photo.fileSize / 1024 / 1024).toFixed(1)} MB`); }
}

console.log(`\nPhoto audit complete: ${photos.length} photographs, ${warnings} items to review.`);
