"use server";

import { requireAdminSession } from "@/lib/admin";
import { getMongoose } from "@/lib/db";
import { HttpError } from "@/lib/http";
import { CollectionModel } from "@/models/collection.model";

export async function listCollectionsAction() {
  await requireAdminSession();
  await getMongoose();
  return CollectionModel.find().sort({ sortOrder: 1, name: 1 }).lean();
}

export async function createCollectionAction(input: { slug: string; name: string; description: string }) {
  await requireAdminSession();
  const slug = input.slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new HttpError(400, "Collection slug is invalid.");
  if (!input.name.trim() || !input.description.trim()) throw new HttpError(400, "Name and description are required.");
  return CollectionModel.create({ ...input, slug, name: input.name.trim(), description: input.description.trim(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
}

export async function updateCollectionAction(slug: string, updates: Partial<{ name: string; description: string; coverPhotoSlug: string; isPublished: boolean; sortOrder: number }>) {
  await requireAdminSession();
  const result = await CollectionModel.updateOne({ slug }, { $set: { ...updates, updatedAt: new Date().toISOString() } });
  if (!result.matchedCount) throw new HttpError(404, "Collection not found.");
}

export async function deleteCollectionAction(slug: string) {
  await requireAdminSession();
  const result = await CollectionModel.deleteOne({ slug });
  if (!result.deletedCount) throw new HttpError(404, "Collection not found.");
}
