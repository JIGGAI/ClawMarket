import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

function baseUrl(req: Request) {
  const envBase = process.env.NEXTAUTH_URL || process.env.AUTH_URL;
  if (envBase) return envBase.replace(/\/$/, "");

  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!host) return "";
  return `${proto}://${host}`.replace(/\/$/, "");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string; name?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
      },
      select: { id: true, email: true, emailVerified: true },
    });

    // Create verification token + send email (best-effort)
    try {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

      await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

      const url = `${baseUrl(req)}/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
      await sendEmail({
        to: email,
        subject: "Verify your email",
        text: `Verify your email to finish setting up your account:\n\n${url}\n\nThis link expires in 24 hours.`,
      });
    } catch (e) {
      console.error("/api/auth/signup verification email failed", e);
      // do not fail signup
    }

    return NextResponse.json({ ok: true, user });
  } catch (e) {
    console.error("/api/auth/signup failed", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
