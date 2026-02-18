import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function baseUrl(req: Request) {
  const envBase = process.env.NEXTAUTH_URL || process.env.AUTH_URL;
  if (envBase) return envBase.replace(/\/$/, "");

  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) return "";
  return `${proto}://${host}`.replace(/\/$/, "");
}

export async function POST(req: Request) {
  // Resend verification email
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ ok: false, error: "email is required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerified: true } });
  if (!user) return NextResponse.json({ ok: true }); // don't leak
  if (user.emailVerified) return NextResponse.json({ ok: true });

  // Create a new verification token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

  const { sendEmail } = await import("@/lib/mailer");
  const url = `${baseUrl(req)}/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  await sendEmail({
    to: email,
    subject: "Verify your email",
    text: `Verify your email to finish setting up your account:\n\n${url}\n\nThis link expires in 24 hours.`,
  });

  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();

  if (!token || !email) {
    return NextResponse.redirect(`${baseUrl(req)}/login?verify=missing`);
  }

  const row = await prisma.verificationToken.findUnique({ where: { token }, select: { identifier: true, expires: true } });
  if (!row || row.identifier !== email || row.expires.getTime() < Date.now()) {
    return NextResponse.redirect(`${baseUrl(req)}/login?verify=invalid`);
  }

  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { emailVerified: new Date() } }),
    prisma.verificationToken.delete({ where: { token } }),
  ]);

  return NextResponse.redirect(`${baseUrl(req)}/marketplace?verified=1`);
}
