import { NextResponse } from "next/server";
import { createPhotoAction, listPhotosAction, removePhotoAction, replacePhotoAction, updatePhotoAction } from "@/action/admin";
import { errorResponse, HttpError, jsonBody } from "@/lib/http";

export async function GET() {
  try {
    return NextResponse.json(await listPhotosAction());
  } catch (error) {
    return errorResponse(error, "Could not load photos.");
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const metadata = form.get("metadata");
    if (!(file instanceof File) || typeof metadata !== "string") {
      throw new HttpError(400, "Image and metadata are required.");
    }
    return NextResponse.json(await createPhotoAction(file, JSON.parse(metadata)), { status: 201 });
  } catch (error) {
    return errorResponse(error, "Could not create photo.");
  }
}

export async function PATCH(request: Request) {
  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      const slug = form.get("slug");
      const metadata = form.get("metadata");
      if (!(file instanceof File) || typeof slug !== "string" || typeof metadata !== "string") throw new HttpError(400, "Photo, slug and metadata are required.");
      await replacePhotoAction(slug, file, JSON.parse(metadata));
      return NextResponse.json({ ok: true });
    }
    const body = await jsonBody(request) as { slug?: string; updates?: unknown };
    if (!body.slug || !body.updates) throw new HttpError(400, "Slug and updates are required.");
    await updatePhotoAction(body.slug, body.updates);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "Could not update photo.");
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await jsonBody(request) as { slug?: string };
    if (!body.slug) throw new HttpError(400, "Slug is required.");
    await removePhotoAction(body.slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error, "Could not delete photo.");
  }
}
