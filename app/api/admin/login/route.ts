import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, assertAdminPassword } from "@/lib/admin";
import { errorResponse, HttpError, jsonBody } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request) as { password?: unknown };
    if (typeof body.password !== "string" || !body.password) throw new HttpError(400, "Password is required.");
    if (!assertAdminPassword(body.password)) throw new HttpError(401, "Invalid password.");
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, adminToken(), {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      path: "/", maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    return errorResponse(error, "Could not sign in.");
  }
}
