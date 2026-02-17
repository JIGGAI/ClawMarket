import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require";
import { prisma } from "@/lib/prisma";
import { validateHttpUrlNoPrivateIps } from "@/lib/ssrf";

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
    zipUrl?: string;
  };

  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const authorDisplayName = String(body.authorDisplayName ?? "").trim();
  const contactEmail = String(body.contactEmail ?? "").trim();
  const license = typeof body.license === "string" ? body.license.trim() : undefined;
  const tags = Array.isArray(body.tags) ? body.tags.map((t) => String(t).trim()).filter(Boolean) : [];

  const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl.trim() : "";
  const zipUrl = typeof body.zipUrl === "string" ? body.zipUrl.trim() : "";

  if (!title) return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });
  if (!description) return NextResponse.json({ ok: false, error: "description is required" }, { status: 400 });
  if (!authorDisplayName) return NextResponse.json({ ok: false, error: "authorDisplayName is required" }, { status: 400 });
  if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return NextResponse.json({ ok: false, error: "contactEmail must be a valid email" }, { status: 400 });
  }

  if (!sourceUrl && !zipUrl) {
    return NextResponse.json({ ok: false, error: "Provide either sourceUrl or zipUrl" }, { status: 400 });
  }

  let sourceType: "url" | "upload" = "url";
  let validatedSourceUrl: string | null = null;
  let validatedZipUrl: string | null = null;

  if (sourceUrl) {
    const v = await validateHttpUrlNoPrivateIps(sourceUrl);
    if (!v.ok) return NextResponse.json({ ok: false, error: `sourceUrl: ${v.error}` }, { status: 400 });
    validatedSourceUrl = v.url.toString();
  }

  if (zipUrl) {
    const v = await validateHttpUrlNoPrivateIps(zipUrl, { requireZip: true });
    if (!v.ok) return NextResponse.json({ ok: false, error: `zipUrl: ${v.error}` }, { status: 400 });
    validatedZipUrl = v.url.toString();
    sourceType = "upload"; // placeholder classification; currently URL to zip
  }

  const submitIp = getClientIp(req);
  const submitUserAgent = req.headers.get("user-agent");

  const sub = await prisma.submission.create({
    data: {
      createdBy: userId,
      status: "submitted",
      sourceType,
      title,
      description,
      tagsCsv: tags.join(","),
      authorDisplayName,
      contactEmail,
      license,
      sourceUrl: validatedSourceUrl,
      zipUrl: validatedZipUrl,
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
