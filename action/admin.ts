"use server";

import { requireAdminSession } from "@/lib/admin";
import {
  createAdminPhoto,
  listAdminPhotos,
  removeAdminPhoto,
  updateAdminPhoto,
  replaceAdminPhoto,
} from "@/lib/admin-service";

export async function listPhotosAction() {
  await requireAdminSession();
  return listAdminPhotos();
}

export async function createPhotoAction(file: File, metadata: unknown) {
  await requireAdminSession();
  return createAdminPhoto(file, metadata);
}

export async function updatePhotoAction(slug: string, updates: unknown) {
  await requireAdminSession();
  return updateAdminPhoto(slug, updates);
}

export async function replacePhotoAction(slug: string, file: File, updates: unknown) {
  await requireAdminSession();
  return replaceAdminPhoto(slug, file, updates);
}

export async function removePhotoAction(slug: string) {
  await requireAdminSession();
  return removeAdminPhoto(slug);
}
