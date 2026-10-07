import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://photos.tashanto.com/sitemap.xml", host: "https://photos.tashanto.com" }; }
