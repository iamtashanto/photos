import mongoose, { type Model } from "mongoose";

export type UserRole = "admin" | "editor";
export type UserDocument = {
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
};

const schema = new mongoose.Schema<UserDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  name: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin", "editor"], default: "editor" },
  isActive: { type: Boolean, default: true, index: true },
  lastLoginAt: Date,
}, { timestamps: true, versionKey: false, collection: "users" });

export const UserModel: Model<UserDocument> = (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", schema);
