import { NextResponse } from "next/server";
import { LikeModel } from "@/models/like.model";
import { PhotoModel } from "@/models/photo.model";
import { getMongoose } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  await getMongoose();
  const { slug } = await params;
  const photo = await PhotoModel.findOne({ slug, published: true }).select("_id").lean();
  if (!photo) return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  return NextResponse.json({ likes: await LikeModel.countDocuments({ photoId: photo._id }) });
}
