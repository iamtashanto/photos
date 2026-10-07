import { NextResponse } from "next/server";
import { createCollectionAction, deleteCollectionAction, listCollectionsAction, updateCollectionAction } from "@/action/collections";
import { errorResponse, HttpError, jsonBody } from "@/lib/http";

export async function GET() {
  try { return NextResponse.json(await listCollectionsAction()); } catch (error) { return errorResponse(error, "Could not load collections."); }
}

export async function POST(request: Request) {
  try { return NextResponse.json(await createCollectionAction(await jsonBody(request)), { status: 201 }); } catch (error) { return errorResponse(error, "Could not create collection."); }
}

export async function PATCH(request: Request) {
  try {
    const body = await jsonBody(request) as { slug?: string; updates?: Record<string, unknown> };
    if (!body.slug || !body.updates) throw new HttpError(400, "Slug and updates are required.");
    await updateCollectionAction(body.slug, body.updates);
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error, "Could not update collection."); }
}

export async function DELETE(request: Request) {
  try {
    const body = await jsonBody(request) as { slug?: string };
    if (!body.slug) throw new HttpError(400, "Slug is required.");
    await deleteCollectionAction(body.slug);
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error, "Could not delete collection."); }
}
