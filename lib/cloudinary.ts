import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env, isCloudinaryConfigured as isConfigured } from "@/lib/env";

if (isConfigured()) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
}

export function isCloudinaryConfigured() {
  return isConfigured();
}

export function uploadPhoto(buffer: Buffer, publicId: string) {
  if (!isConfigured()) throw new Error("Cloudinary credentials are not configured.");
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "tashanto-photography", public_id: publicId, resource_type: "image", overwrite: true },
      (error, result) => error ? reject(error) : result ? resolve(result) : reject(new Error("Cloudinary returned no upload result.")),
    );
    stream.end(buffer);
  });
}

export function cloudinaryUrl(publicId: string) {
  if (!isConfigured()) throw new Error("Cloudinary credentials are not configured.");
  return cloudinary.url(`tashanto-photography/${publicId}`, {
    secure: true,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
}

export async function deletePhoto(publicId: string) {
  if (!isConfigured()) return;
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary could not delete ${publicId}.`);
  }
}
