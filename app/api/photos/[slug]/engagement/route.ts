import { NextResponse } from "next/server";
import { getMongoose } from "@/lib/db";
import { errorResponse, HttpError } from "@/lib/http";
import { LikeModel } from "@/models/like.model";
import { PhotoModel } from "@/models/photo.model";
import { ViewModel } from "@/models/view.model";

function getVisitorId(request: Request) {
  const value = request.headers.get("x-visitor-id")?.trim();
  if (!value || value.length > 128) throw new HttpError(400, "A valid visitor id is required.");
  return value;
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const visitorId = getVisitorId(request);
    await getMongoose();
    const photo = await PhotoModel.findOne({ slug, published: true }).select("_id").lean();
    if (!photo) throw new HttpError(404, "Photo not found.");

    await ViewModel.updateOne(
      { photoId: photo._id, visitorId },
      { $setOnInsert: { photoId: photo._id, visitorId, createdAt: new Date() } },
      { upsert: true },
    );
    const [views, likes, liked] = await Promise.all([
      ViewModel.countDocuments({ photoId: photo._id }),
      LikeModel.countDocuments({ photoId: photo._id }),
      LikeModel.exists({ photoId: photo._id, visitorId }),
    ]);
    return NextResponse.json({ views, likes, liked: Boolean(liked) });
  } catch (error) {
    return errorResponse(error, "Could not record photo engagement.");
  }
}
