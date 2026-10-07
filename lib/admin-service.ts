import { revalidateTag } from "next/cache";
import { getMongoose } from "@/lib/db";
import { PhotoModel } from "@/models/photo.model";
import { uploadPhoto, deletePhoto } from "@/lib/cloudinary";
import { buildPhotoDocument, parsePhotoMetadata, parsePhotoUpdates } from "@/models/photo";
import { HttpError } from "@/lib/http";

function invalidatePhotos() {
  revalidateTag("photos", "max");
}

export async function listAdminPhotos() {
  await getMongoose();
  return PhotoModel.find().sort({ dateAdded: -1, createdAt: -1 }).lean();
}

export async function createAdminPhoto(file: File, rawMetadata: unknown) {
  if (!file.type.startsWith("image/")) throw new HttpError(415, "Only image files are allowed.");
  if (file.size === 0 || file.size > 15 * 1024 * 1024) throw new HttpError(413, "Image must be between 1 byte and 15 MB.");
  const metadata = parsePhotoMetadata(rawMetadata);
  const uploaded = await uploadPhoto(Buffer.from(await file.arrayBuffer()), metadata.slug);
  const document = buildPhotoDocument(metadata, {
    secureUrl: uploaded.secure_url,
    publicId: uploaded.public_id,
    width: uploaded.width || 1,
    height: uploaded.height || 1,
  });
  try {
    await getMongoose();
    await PhotoModel.create(document);
  } catch (error) {
    await deletePhoto(uploaded.public_id).catch((cleanupError) => console.error(cleanupError));
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      throw new HttpError(409, "A photo with this slug already exists.");
    }
    throw error;
  }
  invalidatePhotos();
  return document;
}

export async function updateAdminPhoto(slug: string, rawUpdates: unknown) {
  const updates = parsePhotoUpdates(rawUpdates);
  delete (updates as Record<string, unknown>).slug;
  await getMongoose();
  const result = await PhotoModel.updateOne(
    { slug },
    { $set: { ...updates, updatedAt: new Date().toISOString() } },
  );
  if (!result.matchedCount) throw new HttpError(404, "Photo not found.");
  invalidatePhotos();
}

export async function removeAdminPhoto(slug: string) {
  await getMongoose();
  const photo = await PhotoModel.findOne({ slug }).lean();
  if (!photo) throw new HttpError(404, "Photo not found.");
  const result = await PhotoModel.deleteOne({ slug });
  if (!result.deletedCount) throw new HttpError(404, "Photo not found.");
  if (photo.cloudinaryPublicId) await deletePhoto(photo.cloudinaryPublicId);
  invalidatePhotos();
}
