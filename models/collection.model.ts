import mongoose, { type Model } from "mongoose";
import type { Collection } from "@/types/photography";

export type CollectionDocument = Collection & {
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

const schema = new mongoose.Schema<CollectionDocument>({
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 500 },
  coverPhotoSlug: String,
  isPublished: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, { versionKey: false, collection: "collections" });

export const CollectionModel: Model<CollectionDocument> = (mongoose.models.Collection as Model<CollectionDocument>) ||
  mongoose.model<CollectionDocument>("Collection", schema);
