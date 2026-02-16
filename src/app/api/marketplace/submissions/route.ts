import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require";
import { prisma } from "@/lib/prisma";

async function canSubmit(userId: string) {
  // Social logins can submit immediately.
  // Email magic link users are considered verified if emailVerified is set.
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { emailVerified: true } });
  if (user?.emailVerified) return true;

  const accounts = await prisma.account.findMany({ where: { userId }, select: { provider: true } });
  const hasSocial = accounts.some((a) => a.provider !== "email");
  return hasSocial;
}

function isPrivateIpv4(ip: string) {
  const parts = ip.split(".").map((x) => Number(x));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

function isPrivateIpv6(host: string) {
  const h = host.toLowerCase();
  return h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80");
}

function validateSourceUrl(raw: string) {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { ok: false as const, error: "Invalid URL" };
  }

  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { ok: false as const, error: "URL must be http(s)" };
  }

  const host = u.hostname.toLowerCase();
  if (!host) return { ok: false as const, error: "URL host is required" };

  // Block obvious localhost-ish hostnames.
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".localhost")) {
    return { ok: false as const, error: "URL host must not be localhost" };
  }

  // Block IP literals that are private/link-local/loopback.
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) && isPrivateIpv4(host)) {
    return { ok: false as const, error: "URL host must not be a private IP" };
  }
  if (host.includes(":")) {
    // IPv6 literal (URL() strips brackets)
    if (isPrivateIpv6(host)) return { ok: false as const, error: "URL host must not be a private IP" };
  }

  return { ok: true as const, url: u };
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
    const v = validateSourceUrl(sourceUrl);
    if (!v.ok) return NextResponse.json({ ok: false, error: `sourceUrl: ${v.error}` }, { status: 400 });
    validatedSourceUrl = v.url.toString();
  }

  if (zipUrl) {
    const v = validateSourceUrl(zipUrl);
    if (!v.ok) return NextResponse.json({ ok: false, error: `zipUrl: ${v.error}` }, { status: 400 });
    if (!v.url.pathname.toLowerCase().endsWith(".zip")) {
      return NextResponse.json({ ok: false, error: "zipUrl must end with .zip" }, { status: 400 });
    }
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
