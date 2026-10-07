import mongoose, { type Model } from "mongoose";

export type ViewDocument = {
  photoId: mongoose.Types.ObjectId;
  visitorId: string;
  createdAt: Date;
};

const schema = new mongoose.Schema<ViewDocument>({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: "Photo", required: true, index: true },
  visitorId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false, collection: "photo_views" });

schema.index({ photoId: 1, visitorId: 1 }, { unique: true });

export const ViewModel: Model<ViewDocument> =
  (mongoose.models.PhotoView as Model<ViewDocument>) ||
  mongoose.model<ViewDocument>("PhotoView", schema);
