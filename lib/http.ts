import { NextResponse } from "next/server";

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export function errorResponse(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export function jsonBody(request: Request) {
  return request.json().catch(() => {
    throw new HttpError(400, "Request body must be valid JSON.");
  });
}
