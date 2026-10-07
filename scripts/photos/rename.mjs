import fs from "node:fs/promises";
import path from "node:path";
import { allPhotos, dataRoot, loadMetadata, photoRoot, supportedExtensions, toPublicSrc } from "./shared.mjs";

const args = process.argv.slice(2);
const value = (name) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
const from = value("--from");
const to = value("--to");
const apply = args.includes("--apply");

if (!from || !to) {
  console.error("Usage: npm run photos:rename -- --from street/IMG_1234.jpg --to street/rainy-old-dhaka.jpg [--apply]");
  process.exit(1);
}

const source = path.resolve(photoRoot, from);
const target = path.resolve(photoRoot, to);
for (const candidate of [source, target]) if (!candidate.startsWith(`${photoRoot}${path.sep}`)) throw new Error("Rename paths must stay inside public/photos/.");
if (!supportedExtensions.has(path.extname(target).toLowerCase())) throw new Error("The target must use a supported image extension.");
if (!/^[a-z0-9][a-z0-9-]*\.(?:jpe?g|png|webp|avif)$/i.test(path.basename(target))) throw new Error("Use a descriptive filename containing letters, numbers, and hyphens.");
await fs.access(source);
try { await fs.access(target); throw new Error(`Target already exists: ${to}`); } catch (error) { if (error.code !== "ENOENT") throw error; }

console.log(`${apply ? "Renaming" : "Dry run"}: ${from} → ${to}`);
if (!apply) {
  console.log("No files changed. Add --apply to confirm, then run npm run photos:sync.");
  process.exit(0);
}

await fs.mkdir(path.dirname(target), { recursive: true });
await fs.rename(source, target);
const byFile = await loadMetadata();
const oldSrc = toPublicSrc(source);
const newSrc = toPublicSrc(target);
const photo = allPhotos(byFile).find((item) => item.src === oldSrc);
if (photo) photo.src = newSrc;
for (const [file, entries] of byFile) await fs.writeFile(path.join(dataRoot, file), `${JSON.stringify(entries, null, 2)}\n`, "utf8");
console.log("Rename complete. Run npm run photos:sync to refresh technical metadata.");
