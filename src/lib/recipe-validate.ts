import { sanitizePlainText } from "@/lib/sanitize";

export function validateRecipeMarkdown(input: unknown): { ok: true; value: string } | { ok: false; error: string } {
  const md = sanitizePlainText(input, { maxLen: 200_000 });
  if (!md.trim()) return { ok: false, error: "body is required" };

  // Minimal "valid recipe" check: must have YAML frontmatter and an id.
  // We deliberately do NOT fully parse YAML here to avoid dependency bloat.
  if (!md.startsWith("---")) {
    return { ok: false, error: "Recipe must start with YAML frontmatter (---)" };
  }

  const end = md.indexOf("\n---", 3);
  if (end === -1) {
    return { ok: false, error: "Recipe frontmatter must end with ---" };
  }

  const fm = md.slice(3, end).trim();
  const idLine = fm
    .split("\n")
    .map((l) => l.trim())
    .find((l) => /^id\s*:\s*\S+/.test(l));

  if (!idLine) {
    return { ok: false, error: "Recipe frontmatter must include a non-empty 'id:'" };
  }

  return { ok: true, value: md };
}
