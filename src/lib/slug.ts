import crypto from "crypto";

export function slugify(input: string): string {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function randomSuffix(len = 6): string {
  // base32-ish, url-safe
  return crypto.randomBytes(Math.ceil(len)).toString("base64url").slice(0, len).toLowerCase();
}
