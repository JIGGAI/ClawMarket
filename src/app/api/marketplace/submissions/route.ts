import { NextResponse } from "next/server";
// (no prisma types needed here)
import { requireAuth } from "@/lib/require";
import { prisma } from "@/lib/prisma";
import { validateHttpUrlNoPrivateIps } from "@/lib/ssrf";
import { randomSuffix, slugify } from "@/lib/slug";
import { sanitizePlainText, sanitizeTag } from "@/lib/sanitize";

async function canSubmit(userId: string) {
  // Social logins can submit immediately.
  // Email magic link users are considered verified if emailVerified is set.
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { emailVerified: true } });
  if (user?.emailVerified) return true;

  const accounts = await prisma.account.findMany({ where: { userId }, select: { provider: true } });
  const hasSocial = accounts.some((a) => a.provider !== "email");
  return hasSocial;
}

function getClientIp(req: Request) {
  const xfwd = req.headers.get("x-forwarded-for");
  if (!xfwd) return null;
  return xfwd.split(",")[0]?.trim() || null;
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "recipe";

  // Keep it reasonably short for URLs.
  const maxBaseLen = 48;
  const trimmedBase = base.slice(0, maxBaseLen).replace(/-$/g, "");

  for (let i = 0; i < 8; i++) {
    const candidate = `${trimmedBase}-${randomSuffix(6)}`;
    const exists = await prisma.submission.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!exists) return candidate;
  }

  // Extremely unlikely; last-resort unique-ish slug.
  return `${trimmedBase}-${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  const r = await requireAuth();
  if (!r.ok) return r.res;

  const userId = r.session.userId;
  if (!userId) return NextResponse.json({ ok: false, error: "Missing userId in session" }, { status: 500 });

  const allowed = await canSubmit(userId);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "Account not verified for submissions. Use a social login or sign in via email magic link." },
      { status: 403 },
    );
  }

  const body = (await req.json()) as {
    title?: string;
    description?: string;
    tags?: string[];
    authorDisplayName?: string;
    contactEmail?: string;
    license?: string;
    sourceUrl?: string;
    // zipUrl deprecated
    zipUrl?: string;
    body?: string; // recipe markdown
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
  const isDraft = body.draft === true;

  // zipUrl no longer accepted.

  if (!isDraft) {
    if (!title) return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });
    if (!description) return NextResponse.json({ ok: false, error: "description is required" }, { status: 400 });
    if (!authorDisplayName) return NextResponse.json({ ok: false, error: "authorDisplayName is required" }, { status: 400 });
    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ ok: false, error: "contactEmail must be a valid email" }, { status: 400 });
    }
  } else {
    // drafts: keep minimal requirements
    if (!title) return NextResponse.json({ ok: false, error: "title is required for drafts" }, { status: 400 });
  }

  if (!isDraft && (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))) {
    return NextResponse.json({ ok: false, error: "contactEmail must be a valid email" }, { status: 400 });
  }

  if (!sourceUrl && !recipeBodyText && !isDraft) {
    return NextResponse.json({ ok: false, error: "Provide either sourceUrl or body" }, { status: 400 });
  }

  const sourceType: "url" | "upload" = "url";
  let validatedSourceUrl: string | null = null;
  const validatedZipUrl: string | null = null;
  let validatedBodyMd: string | null = null;

  if (sourceUrl) {
    const v = await validateHttpUrlNoPrivateIps(sourceUrl);
    if (!v.ok) return NextResponse.json({ ok: false, error: `sourceUrl: ${v.error}` }, { status: 400 });
    validatedSourceUrl = v.url.toString();
  }

  // zipUrl submissions are deprecated.

  if (recipeBodyText) {
    const { validateRecipeMarkdown } = await import("@/lib/recipe-validate");
    const v = validateRecipeMarkdown(recipeBodyText);
    if (!v.ok) return NextResponse.json({ ok: false, error: `body: ${v.error}` }, { status: 400 });
    validatedBodyMd = v.value;
  }

  const submitIp = getClientIp(req);
  const submitUserAgent = req.headers.get("user-agent");

  const sub = await prisma.submission.create({
    data: {
      createdBy: userId,
      slug: await generateUniqueSlug(title || "draft"),
      status: isDraft ? "draft" : "submitted",
      sourceType,
      title: title || "(draft)",
      description,
      tagsCsv: tags.join(","),
      authorDisplayName,
      contactEmail,
      license,
      sourceUrl: validatedSourceUrl,
      zipUrl: validatedZipUrl,
      bodyMd: validatedBodyMd,
      submitIp,
      submitUserAgent,
    },
  });

  return NextResponse.json({ ok: true, submission: sub });
}

export async function GET() {
  const r = await requireAuth();
  if (!r.ok) return r.res;

  const userId = r.session.userId;
  if (!userId) return NextResponse.json({ ok: false, error: "Missing userId in session" }, { status: 500 });

  const rows = await prisma.submission.findMany({ where: { createdBy: userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, count: rows.length, submissions: rows });
}
