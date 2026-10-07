import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, verifyPassword } from "@/lib/admin";
import { errorResponse, HttpError, jsonBody } from "@/lib/http";
import { getMongoose } from "@/lib/db";
import { UserModel } from "@/models/user.model";

export async function POST(request: Request) {
  try {
    const body = await jsonBody(request) as { email?: unknown; password?: unknown };
    if (typeof body.email !== "string" || !body.email || typeof body.password !== "string" || !body.password) throw new HttpError(400, "Email and password are required.");
    const email = body.email.trim().toLowerCase();
    await getMongoose();
    const user = await UserModel.findOne({ email, role: "admin", isActive: true }).select("+passwordHash");
    if (!user || !verifyPassword(body.password, user.passwordHash)) throw new HttpError(401, "Invalid email or password.");
    user.lastLoginAt = new Date();
    await user.save();
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
