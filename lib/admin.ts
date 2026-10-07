import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { env, requireAdminConfig } from "@/lib/env";
import { cookies } from "next/headers";
import { HttpError } from "@/lib/http";

export const ADMIN_COOKIE = "ta-admin";

function secret() {
  requireAdminConfig();
  return env.adminSecret!;
}

export function adminToken() {
  return createHmac("sha256", secret()).update("admin-session").digest("hex");
}

export function isValidAdminToken(value: string | undefined) {
  if (!value) return false;
  const expected = Buffer.from(adminToken());
  const actual = Buffer.from(value);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function assertAdminPassword(password: string) {
  requireAdminConfig();
  const expected = env.adminPassword!;
  return password.length === expected.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(expected));
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function requireAdminSession() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isValidAdminToken(value)) throw new HttpError(401, "Authentication required.");
}
