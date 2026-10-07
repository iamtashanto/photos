import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import exifr from "exifr";

export const projectRoot = process.cwd();
export const photoRoot = path.resolve(process.env.PHOTO_ROOT || path.join(projectRoot, "public/photos"));
export const dataRoot = path.resolve(process.env.PHOTO_DATA_ROOT || path.join(projectRoot, "data/photos"));
export const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
export const categories = {
  street: "Street", nature: "Nature", landscape: "Landscape", travel: "Travel",
  portrait: "Portrait", architecture: "Architecture", wildlife: "Wildlife",
  macro: "Macro", food: "Food", night: "Night", "black-and-white": "Black & White",
  documentary: "Documentary", "still-life": "Still Life", miscellaneous: "Miscellaneous",
};

export const machineFields = [
  "src", "width", "height", "aspectRatio", "orientation", "category", "collection",
  "blurDataURL", "dominantColor", "fileSize", "sourceModifiedAt",
];

export function slugify(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function titleFromSlug(slug) {
  return slug.split("-").filter(Boolean).map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}

export function getOrientation(width, height) {
  const ratio = width / height;
  if (ratio >= 0.95 && ratio <= 1.05) return "square";
  if (ratio > 2) return "panorama";
  return ratio < 1 ? "portrait" : "landscape";
}

export function toPublicSrc(filePath) {
  return `/${path.relative(path.join(projectRoot, "public"), filePath).split(path.sep).join("/")}`;
}

export async function loadMetadata() {
  await fs.mkdir(dataRoot, { recursive: true });
  const files = (await fs.readdir(dataRoot)).filter((file) => file.endsWith(".json")).sort();
  const byFile = new Map();
  for (const file of files) {
    const parsed = JSON.parse(await fs.readFile(path.join(dataRoot, file), "utf8"));
    if (!Array.isArray(parsed)) throw new Error(`${file} must contain a JSON array.`);
    byFile.set(file, parsed);
  }
  return byFile;
}

export async function scanPhotoFiles() {
  const found = [];
  for (const directory of Object.keys(categories)) {
    const directoryPath = path.join(photoRoot, directory);
    let entries = [];
    try { entries = await fs.readdir(directoryPath, { withFileTypes: true }); } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    for (const entry of entries) {
      if (entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())) found.push({ directory, filePath: path.join(directoryPath, entry.name) });
    }
  }
  return found.sort((a, b) => a.filePath.localeCompare(b.filePath));
}

function hex(value) { return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0"); }
function isoDate(value) { const date = value instanceof Date ? value : new Date(value); return Number.isNaN(date.valueOf()) ? undefined : date.toISOString().slice(0, 10); }
function exposure(value) {
  if (!value || !Number.isFinite(Number(value))) return undefined;
  const seconds = Number(value);
  return seconds < 1 ? `1/${Math.round(1 / seconds)}s` : `${Number(seconds.toFixed(2))}s`;
}

async function safeExif(filePath) {
  if (![".jpg", ".jpeg"].includes(path.extname(filePath).toLowerCase())) return {};
  try {
    const data = await exifr.parse(filePath, { tiff: true, exif: true, gps: false, interop: false, ifd1: false, makerNote: false, userComment: false });
    if (!data) return {};
    const make = String(data.Make || "").trim();
    const model = String(data.Model || "").trim();
    const camera = [make, model].filter((part, index, values) => part && !values.slice(0, index).some((previous) => part.toLowerCase().includes(previous.toLowerCase()))).join(" ") || undefined;
    return {
      ...(isoDate(data.DateTimeOriginal || data.CreateDate) && { dateCaptured: isoDate(data.DateTimeOriginal || data.CreateDate) }),
      ...(camera && { camera }),
      ...(data.LensModel && { lens: String(data.LensModel) }),
      ...(data.FocalLength && { focalLength: `${Number(data.FocalLength.toFixed?.(1) ?? data.FocalLength)}mm` }),
      ...(data.FNumber && { aperture: `f/${Number(data.FNumber.toFixed?.(1) ?? data.FNumber)}` }),
      ...(exposure(data.ExposureTime) && { shutterSpeed: exposure(data.ExposureTime) }),
      ...(data.ISO && { iso: Number(data.ISO) }),
    };
  } catch { return {}; }
}

export async function inspectPhoto(filePath, directory, existing) {
  const stat = await fs.stat(filePath);
  const sourceModifiedAt = stat.mtime.toISOString();
  const unchanged = existing?.fileSize === stat.size && existing?.sourceModifiedAt === sourceModifiedAt && existing?.blurDataURL;
  if (unchanged) return Object.fromEntries([...machineFields, "dateCaptured", "camera", "lens", "focalLength", "aperture", "shutterSpeed", "iso"].filter((key) => existing[key] !== undefined).map((key) => [key, existing[key]]));

  const image = sharp(filePath, { failOn: "warning" });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Could not read dimensions: ${filePath}`);
  const rotated = metadata.orientation && metadata.orientation >= 5 && metadata.orientation <= 8;
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;
  const [placeholder, stats, exif] = await Promise.all([
    sharp(filePath).rotate().resize({ width: 20, withoutEnlargement: true }).jpeg({ quality: 35 }).toBuffer(),
    sharp(filePath).rotate().stats(),
    safeExif(filePath),
  ]);
  const { r, g, b } = stats.dominant;
  return {
    src: toPublicSrc(filePath), width, height, aspectRatio: Number((width / height).toFixed(6)),
    orientation: getOrientation(width, height), category: categories[directory], collection: directory,
    blurDataURL: `data:image/jpeg;base64,${placeholder.toString("base64")}`,
    dominantColor: `#${hex(r)}${hex(g)}${hex(b)}`, fileSize: stat.size, sourceModifiedAt, ...exif,
  };
}

export async function fileExists(publicSrc) {
  try { await fs.access(path.join(projectRoot, "public", publicSrc.replace(/^\//, ""))); return true; } catch { return false; }
}

export function allPhotos(byFile) { return [...byFile.values()].flat(); }
