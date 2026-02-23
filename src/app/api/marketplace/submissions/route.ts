import { NextResponse } from "next/server";
import { requireVerified } from "@/lib/require";
import { prisma } from "@/lib/prisma";
import { validateHttpUrlNoPrivateIps } from "@/lib/ssrf";
import { verifyRecaptchaV2Token } from "@/lib/captcha";
import { randomSuffix, slugify } from "@/lib/slug";
import { sanitizePlainText, sanitizeTag } from "@/lib/sanitize";

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
  const r = await requireVerified();
  if (!r.ok) return r.res;

  const userId = r.session.userId;
  if (!userId) return NextResponse.json({ ok: false, error: "Missing userId in session" }, { status: 500 });

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
    captchaToken?: string;
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

  if (!isDraft) {
    const captcha = await verifyRecaptchaV2Token(String(body.captchaToken ?? ""));
    if (!captcha.ok) return NextResponse.json({ ok: false, error: captcha.error }, { status: 400 });
  }

  if (!isDraft) {
    if (!title) return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });
    if (!description) return NextResponse.json({ ok: false, error: "description is required" }, { status: 400 });
    if (!authorDisplayName) return NextResponse.json({ ok: false, error: "authorDisplayName is required" }, { status: 400 });
    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ ok: false, error: "contactEmail must be a valid email" }, { status: 400 });
    }
  } else {
    if (!title) return NextResponse.json({ ok: false, error: "title is required for drafts" }, { status: 400 });
  }

  if (!sourceUrl && !recipeBodyText && !isDraft) {
    return NextResponse.json({ ok: false, error: "Provide either sourceUrl or body" }, { status: 400 });
  }

  let validatedSourceUrl: string | null = null;
  let validatedBodyMd: string | null = null;

  if (sourceUrl) {
    const v = await validateHttpUrlNoPrivateIps(sourceUrl);
    if (!v.ok) return NextResponse.json({ ok: false, error: `sourceUrl: ${v.error}` }, { status: 400 });
    validatedSourceUrl = v.url.toString();
  }

  if (recipeBodyText) {
    // Very light validation: must include YAML frontmatter with an id
    const hasFrontmatter = /^---\s*\n[\s\S]*?\n---\s*\n/m.test(recipeBodyText);
    const hasId = /^---\s*\n[\s\S]*?\n---\s*\n/m.test(recipeBodyText) && /\n\s*id:\s*\S+/m.test(recipeBodyText);
    if (!hasFrontmatter || !hasId) {
      return NextResponse.json({ ok: false, error: "body must be a Markdown recipe with YAML frontmatter including id:" }, { status: 400 });
    }
    validatedBodyMd = recipeBodyText;
  }

  const slug = await generateUniqueSlug(title);

  const submission = await prisma.submission.create({
    data: {
      createdBy: userId,
      status: isDraft ? "draft" : "submitted",
      sourceType: "url",
      slug,
      title,
      description,
      tagsCsv: tags.join(","),
      authorDisplayName,
      contactEmail,
      license,
      sourceUrl: validatedSourceUrl,
      zipUrl: null,
      bodyMd: validatedBodyMd,
      submitIp: getClientIp(req),
      submitUserAgent: req.headers.get("user-agent"),
    },
    select: { id: true, slug: true, status: true },
  });

  return NextResponse.json({ ok: true, submission });
}
