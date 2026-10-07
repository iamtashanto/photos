import mongoose, { type Model } from "mongoose";

export type LikeDocument = {
  photoId: mongoose.Types.ObjectId;
  visitorId: string;
  createdAt: Date;
};

const schema = new mongoose.Schema<LikeDocument>({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: "Photo", required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false, collection: "photo_likes" });

schema.index({ photoId: 1, visitorId: 1 }, { unique: true });
export const LikeModel: Model<LikeDocument> = (mongoose.models.PhotoLike as Model<LikeDocument>) ||
  mongoose.model<LikeDocument>("PhotoLike", schema);
