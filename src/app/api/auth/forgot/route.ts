import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

function appBaseUrl() {
  return process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email) return NextResponse.json({ ok: true });

    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond ok to avoid email enumeration.
    if (!user) return NextResponse.json({ ok: true });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const base = appBaseUrl();
    const url = base ? `${base.replace(/\/$/, "")}/reset?token=${encodeURIComponent(token)}` : `/reset?token=${encodeURIComponent(token)}`;

    await sendEmail({
      to: email,
      subject: "Reset your password",
      text: `Reset your password using this link (valid for 30 minutes):\n\n${url}\n\nIf you didn’t request this, you can ignore this email.`,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("/api/auth/forgot failed", e);
    // Still return ok to avoid enumeration.
    return NextResponse.json({ ok: true });
  }
}
