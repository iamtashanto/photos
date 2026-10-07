import mongoose from "mongoose";
import { env } from "@/lib/env";

const globalForMongo = globalThis as unknown as { mongoosePromise?: Promise<typeof mongoose> };

export function isDatabaseConfigured() {
  return Boolean(env.mongodbUri);
}

export function getMongoose() {
  if (!env.mongodbUri) throw new Error("MONGODB_URI is not configured.");
  if (!globalForMongo.mongoosePromise) {
    globalForMongo.mongoosePromise = mongoose.connect(env.mongodbUri, {
      dbName: env.mongodbDb,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
  }
  return globalForMongo.mongoosePromise;
}

export async function getDatabase() {
  await getMongoose();
  return mongoose.connection;
}
