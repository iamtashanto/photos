import fs from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

const root = process.cwd();
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required.");
const dbName = process.env.MONGODB_DB || "tashanto-photography";
const upload = process.argv.includes("--upload");
const dataDir = path.join(root, "data/photos");
const publicDir = path.join(root, "public");
const categories = {
  street: "Street", nature: "Nature", landscape: "Landscape", travel: "Travel", portrait: "Portrait",
  architecture: "Architecture", wildlife: "Wildlife", macro: "Macro", food: "Food", night: "Night",
  "black-and-white": "Black & White", documentary: "Documentary", "still-life": "Still Life", miscellaneous: "Miscellaneous",
};

if (upload) {
  for (const key of ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]) {
    if (!process.env[key]) throw new Error(`${key} is required when using --upload.`);
  }
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
}

const client = await new MongoClient(uri).connect();
const db = client.db(dbName);
const photos = db.collection("photos");
const collections = db.collection("collections");
let imported = 0;

for (const [slug, name] of Object.entries(categories)) {
  const file = path.join(dataDir, `${slug}.json`);
  const entries = JSON.parse(await fs.readFile(file, "utf8"));
  for (const photo of entries) {
    const next = { ...photo, published: true, migratedAt: new Date().toISOString() };
    if (upload && photo.src.startsWith("/")) {
      const filePath = path.join(publicDir, photo.src.slice(1));
      const result = await cloudinary.uploader.upload(filePath, { folder: "tashanto-photography", public_id: photo.slug, resource_type: "image", overwrite: true });
      next.src = result.secure_url;
      next.cloudinaryPublicId = result.public_id;
      next.width = result.width || photo.width;
      next.height = result.height || photo.height;
    }
    await photos.replaceOne({ slug: photo.slug }, next, { upsert: true });
    imported++;
  }
  await collections.updateOne({ slug }, { $setOnInsert: { slug, name, description: `${name} photography by TA Shanto.`, coverPhotoSlug: entries[0]?.slug } }, { upsert: true });
}

await photos.createIndex({ slug: 1 }, { unique: true });
await photos.createIndex({ category: 1, sortOrder: 1, dateAdded: -1 });
await photos.createIndex({ homepageFeatured: 1, featuredOrder: 1 });
await collections.createIndex({ slug: 1 }, { unique: true });
console.log(`Migrated ${imported} photographs to ${dbName}${upload ? " and uploaded images to Cloudinary" : ""}.`);
await client.close();
