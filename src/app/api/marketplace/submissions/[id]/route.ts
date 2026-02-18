import { NextResponse } from "next/server";
import { requireRole, requireVerified } from "@/lib/require";
import { prisma } from "@/lib/prisma";
import { validateHttpUrlNoPrivateIps } from "@/lib/ssrf";
import { sanitizePlainText, sanitizeTag } from "@/lib/sanitize";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const r = await requireVerified();
  if (!r.ok) return r.res;

  const userId = r.session.userId;
  const role = r.session.role;
  const { id } = await ctx.params;

  const row = await prisma.submission.findFirst({
    where: role === "admin" || role === "moderator" ? { id } : { id, createdBy: userId },
  });

  if (!row) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true, submission: row });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  // Allow the submission owner (verified) to edit drafts/needs_changes.
  // Allow moderator/admin to edit any non-published submission.
  const owner = await requireVerified();
  const mod = await requireRole("moderator");

  const canModerate = mod.ok;
  const r = owner.ok ? owner : mod;
  if (!r.ok) return r.res;

  const userId = r.session.userId;
  const { id } = await ctx.params;

  const existing = await prisma.submission.findFirst({
    where: canModerate ? { id } : { id, createdBy: userId },
  });
  if (!existing) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const status = String(existing.status);
  if (canModerate) {
    if (status === "published") {
      return NextResponse.json({ ok: false, error: "Published submissions are not editable" }, { status: 409 });
    }
  } else {
    const editable = new Set(["draft", "submitted", "needs_changes"]);
    if (!editable.has(status)) {
      return NextResponse.json({ ok: false, error: `Submission is not editable in status ${existing.status}` }, { status: 409 });
    }
  }

  const body = (await req.json()) as {
    title?: string;
    description?: string;
    tags?: string[];
    authorDisplayName?: string;
    contactEmail?: string;
    license?: string;
    sourceUrl?: string;
    body?: string;
    draft?: boolean;
  };

  const title = sanitizePlainText(body.title, { maxLen: 160 });
  const description = sanitizePlainText(body.description, { maxLen: 2000 });
  const authorDisplayName = sanitizePlainText(body.authorDisplayName, { maxLen: 120 });
  const contactEmail = sanitizePlainText(body.contactEmail, { maxLen: 254 });
  const license = typeof body.license === "string" ? sanitizePlainText(body.license, { maxLen: 120 }) : undefined;
  const tags = Array.isArray(body.tags) ? body.tags.map(sanitizeTag).filter(Boolean).slice(0, 20) : [];

  const sourceUrl = typeof body.sourceUrl === "string" ? sanitizePlainText(body.sourceUrl, { maxLen: 2000 }) : "";
  const recipeBodyText = typeof body.body === "string" ? sanitizePlainText(body.body, { maxLen: 200_000 }) : "";

  if (!title) return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });

  let validatedSourceUrl: string | null = null;
  let validatedBodyMd: string | null = null;

  if (sourceUrl) {
    const v = await validateHttpUrlNoPrivateIps(sourceUrl);
    if (!v.ok) return NextResponse.json({ ok: false, error: `sourceUrl: ${v.error}` }, { status: 400 });
    validatedSourceUrl = v.url.toString();
  }

  if (recipeBodyText) {
    const hasFrontmatter = /^---\s*\n[\s\S]*?\n---\s*\n/m.test(recipeBodyText);
    const hasId = hasFrontmatter && /\n\s*id:\s*\S+/m.test(recipeBodyText);
    if (!hasFrontmatter || !hasId) {
      return NextResponse.json({ ok: false, error: "body must be a Markdown recipe with YAML frontmatter including id:" }, { status: 400 });
    }
    validatedBodyMd = recipeBodyText;
  }

  const wantsDraft = body.draft === true;
  const nextStatus = wantsDraft ? "draft" : "submitted";

  const next = await prisma.submission.update({
    where: { id },
    data: {
      title,
      description,
      tagsCsv: tags.join(","),
      authorDisplayName,
      contactEmail,
      license,
      sourceUrl: validatedSourceUrl,
      bodyMd: validatedBodyMd,
      // If user/admin edits a pending/submitted item, treat it as an updated submission.
      // This also allows a user to keep work in draft by clicking "Save draft".
      status: nextStatus,
      moderationReason: null,
      moderatedAt: null,
      moderatedByUserId: null,
    },
    select: { id: true, slug: true, status: true },
  });

  return NextResponse.json({ ok: true, submission: next });
}
