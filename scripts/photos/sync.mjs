import fs from "node:fs/promises";
import path from "node:path";
import { allPhotos, categories, dataRoot, inspectPhoto, loadMetadata, scanPhotoFiles, slugify, titleFromSlug, toPublicSrc } from "./shared.mjs";

const byFile = await loadMetadata();
for (const directory of Object.keys(categories)) if (!byFile.has(`${directory}.json`)) byFile.set(`${directory}.json`, []);
const existingPhotos = allPhotos(byFile);
const bySrc = new Map(existingPhotos.map((photo) => [photo.src, photo]));
const usedSlugs = new Set(existingPhotos.map((photo) => photo.slug));
const files = await scanPhotoFiles();
let added = 0;
let updated = 0;

function uniqueSlug(base, directory) {
  let candidate = base;
  if (usedSlugs.has(candidate)) candidate = `${base}-${directory}`;
  let number = 2;
  while (usedSlugs.has(candidate)) candidate = `${base}-${directory}-${number++}`;
  usedSlugs.add(candidate);
  return candidate;
}

for (const { directory, filePath } of files) {
  const src = toPublicSrc(filePath);
  const existing = bySrc.get(src);
  const technical = await inspectPhoto(filePath, directory, existing);
  const now = new Date().toISOString();
  if (existing) {
    const changed = Object.entries(technical).some(([key, value]) => existing[key] !== value);
    Object.assign(existing, technical, changed ? { updatedAt: now } : {});
    if (changed) updated++;
    continue;
  }
  const base = slugify(path.basename(filePath, path.extname(filePath))) || "untitled-photograph";
  const slug = uniqueSlug(base, directory);
  const stat = await fs.stat(filePath);
  const dateAdded = stat.birthtime.toISOString().slice(0, 10);
  const photo = {
    id: `${directory}-${slug}`, slug, title: titleFromSlug(base), ...technical,
    dateAdded, featured: false, homepageFeatured: false, tags: [],
    alt: `${titleFromSlug(base)} photograph`, altNeedsReview: true,
    copyright: "© TA Shanto", createdAt: now, updatedAt: now,
  };
  byFile.get(`${directory}.json`).push(photo);
  bySrc.set(src, photo);
  added++;
  console.log(`+ Added ${src}`);
}

for (const [file, photos] of byFile) {
  photos.sort((a, b) => a.slug.localeCompare(b.slug));
  const target = path.join(dataRoot, file);
  const next = `${JSON.stringify(photos, null, 2)}\n`;
  let previous = "";
  try { previous = await fs.readFile(target, "utf8"); } catch {}
  if (previous !== next) await fs.writeFile(target, next, "utf8");
}

const scanned = new Set(files.map(({ filePath }) => toPublicSrc(filePath)));
for (const photo of allPhotos(byFile)) if (!scanned.has(photo.src)) console.warn(`⚠ Metadata references missing image: ${photo.src}`);
console.log(`\nPhoto sync complete: ${added} added, ${updated} refreshed, ${files.length} files scanned.`);
