import { NextResponse } from "next/server";
import { LikeModel } from "@/models/like.model";
import { PhotoModel } from "@/models/photo.model";
import { getMongoose } from "@/lib/db";
import { HttpError, errorResponse } from "@/lib/http";

function visitorId(request: Request) {
  const value = request.headers.get("x-visitor-id")?.trim();
  if (!value || value.length > 128) throw new HttpError(400, "A valid visitor id is required.");
  return value;
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const visitor = visitorId(request);
    await getMongoose();
    const photo = await PhotoModel.findOne({ slug, published: true }).select("_id").lean();
    if (!photo) throw new HttpError(404, "Photo not found.");
    await LikeModel.updateOne({ photoId: photo._id, visitorId: visitor }, { $setOnInsert: { photoId: photo._id, visitorId: visitor } }, { upsert: true });
    const likes = await LikeModel.countDocuments({ photoId: photo._id });
    return NextResponse.json({ liked: true, likes });
  } catch (error) {
    return errorResponse(error, "Could not like photo.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const visitor = visitorId(request);
    await getMongoose();
    const photo = await PhotoModel.findOne({ slug, published: true }).select("_id").lean();
    if (!photo) throw new HttpError(404, "Photo not found.");
    await LikeModel.deleteOne({ photoId: photo._id, visitorId: visitor });
    const likes = await LikeModel.countDocuments({ photoId: photo._id });
    return NextResponse.json({ liked: false, likes });
  } catch (error) {
    return errorResponse(error, "Could not unlike photo.");
  }
}
