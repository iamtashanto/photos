type RuntimeEnv = {
  mongodbUri?: string;
  mongodbDb: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  adminPassword?: string;
  adminSecret?: string;
};

function optional(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export const env: RuntimeEnv = {
  mongodbUri: optional("MONGODB_URI"),
  mongodbDb: optional("MONGODB_DB") || "tashanto-photography",
  cloudinaryCloudName: optional("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: optional("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: optional("CLOUDINARY_API_SECRET"),
  adminPassword: optional("ADMIN_PASSWORD"),
  adminSecret: optional("ADMIN_SECRET"),
};

export function requireAdminConfig() {
  if (!env.adminPassword || !env.adminSecret) {
    throw new Error("ADMIN_PASSWORD and ADMIN_SECRET must be configured.");
  }
}

export function isCloudinaryConfigured() {
  return Boolean(env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret);
}
