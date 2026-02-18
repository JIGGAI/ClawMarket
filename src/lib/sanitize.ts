// Simple, dependency-free sanitizers for user-provided text.
// Goal: prevent stored XSS / weird control characters, keep payload sizes reasonable.

export function sanitizePlainText(input: unknown, opts?: { maxLen?: number }): string {
  const maxLen = opts?.maxLen ?? 5000;
  const s = String(input ?? "");

  // Remove NUL and other control chars (keep \n and \t).
  const noCtl = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

  // Collapse CRLF to LF and trim.
  const normalized = noCtl.replace(/\r\n?/g, "\n").trim();

  if (normalized.length <= maxLen) return normalized;
  return normalized.slice(0, maxLen);
}

export function sanitizeTag(input: unknown): string {
  // tags are used in search/filter; keep them predictable.
  const s = sanitizePlainText(input, { maxLen: 64 }).toLowerCase();
  return s.replace(/[^a-z0-9\-_.\s]/g, "").trim();
}

export function safeJsonParse(input: string, opts?: { maxChars?: number }): { ok: true; value: unknown } | { ok: false; error: string } {
  const maxChars = opts?.maxChars ?? 200_000; // 200KB
  if (input.length > maxChars) return { ok: false, error: `JSON too large (>${maxChars} chars)` };

  try {
    const value = JSON.parse(input);
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function validateRecipeJson(value: unknown): { ok: true } | { ok: false; error: string } {
  // Minimal schema check (can tighten later once we finalize the canonical recipe JSON schema).
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "Recipe JSON must be a JSON object" };
  }

  const v = value as Record<string, unknown>;
  const id = typeof v.id === "string" ? v.id.trim() : "";
  const name = typeof v.name === "string" ? v.name.trim() : "";

  if (!id && !name) {
    return { ok: false, error: "Recipe JSON must include at least an 'id' or 'name' field" };
  }

  // Prevent prototype pollution payloads.
  if (Object.prototype.hasOwnProperty.call(v, "__proto__") || Object.prototype.hasOwnProperty.call(v, "constructor") || Object.prototype.hasOwnProperty.call(v, "prototype")) {
    return { ok: false, error: "Invalid recipe JSON (reserved keys present)" };
  }

  return { ok: true };
}
