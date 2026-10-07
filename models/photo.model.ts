import mongoose, { type HydratedDocument, type Model } from "mongoose";
import type { PhotoDocument } from "@/models/photo";

const photoSchema = new mongoose.Schema<PhotoDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, maxlength: 2000 },
    story: { type: String, maxlength: 5000 },
    src: { type: String, required: true },
    thumbnailSrc: String,
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    aspectRatio: { type: Number, required: true, min: 0 },
    orientation: {
      type: String,
      enum: ["portrait", "landscape", "square", "panorama"],
      required: true,
    },
    category: { type: String, required: true, index: true },
    collection: { type: String, index: true },
    location: String,
    city: String,
    country: String,
    dateCaptured: String,
    dateAdded: { type: String, required: true, index: true },
    camera: String,
    lens: String,
    focalLength: String,
    aperture: String,
    shutterSpeed: String,
    iso: Number,
    featured: { type: Boolean, default: false, index: true },
    homepageFeatured: { type: Boolean, default: false, index: true },
    featuredOrder: Number,
    sortOrder: Number,
    tags: { type: [String], default: [] },
    alt: { type: String, required: true, maxlength: 300 },
    altNeedsReview: Boolean,
    blurDataURL: String,
    dominantColor: String,
    copyright: String,
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    fileSize: Number,
    sourceModifiedAt: String,
    credit: String,
    sourceUrl: String,
    cloudinaryPublicId: String,
    published: { type: Boolean, default: true, index: true },
    migratedAt: String,
  },
  {
    timestamps: false,
    versionKey: false,
    collection: "photos",
    suppressReservedKeysWarning: true,
  },
);

photoSchema.index({ published: 1, category: 1, sortOrder: 1, dateAdded: -1 });
photoSchema.index({ published: 1, homepageFeatured: 1, featuredOrder: 1 });

export type PhotoModelDocument = HydratedDocument<PhotoDocument>;
export const PhotoModel: Model<PhotoDocument> =
  (mongoose.models.Photo as Model<PhotoDocument>) ||
  mongoose.model<PhotoDocument>("Photo", photoSchema);
