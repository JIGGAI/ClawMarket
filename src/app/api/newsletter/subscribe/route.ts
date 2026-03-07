import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }

    const to = process.env.NEWSLETTER_TO || process.env.AUTH_EMAIL_FROM;
    if (!to) {
      return NextResponse.json({ ok: false, error: "Newsletter destination is not configured." }, { status: 500 });
    }

    const r = await sendEmail({
      to,
      subject: "Newsletter signup",
      text: `New newsletter signup: ${email}`,
    });

    if (!r.ok) {
      return NextResponse.json({ ok: false, error: r.error || "Unable to subscribe right now." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
