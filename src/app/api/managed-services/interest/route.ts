import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      company?: string;
      interest?: string;
      notes?: string;
      source?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const company = body.company?.trim() || "";
    const interest = body.interest?.trim();
    const notes = body.notes?.trim() || "";
    const source = body.source?.trim() || "managed-services-form";

    if (!name || !email || !interest) {
      return NextResponse.json({ ok: false, error: "Name, email, and interest are required." }, { status: 400 });
    }

    const to = process.env.MANAGED_SERVICES_TO || process.env.NEWSLETTER_TO || process.env.AUTH_EMAIL_FROM;
    if (!to) {
      return NextResponse.json({ ok: false, error: "Email is not configured." }, { status: 500 });
    }

    const subject = `Managed AI team interest: ${company || name}`;
    const text = [
      "New managed AI team interest submission",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "-"}`,
      `Interest: ${interest}`,
      `Source: ${source}`,
      "",
      "Notes:",
      notes || "-",
    ].join("\n");

    const r = await sendEmail({ to, subject, text });
    if (!r.ok) {
      return NextResponse.json({ ok: false, error: r.error || "Unable to submit right now." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Managed services interest error", error);
    return NextResponse.json({ ok: false, error: "Unable to submit right now." }, { status: 500 });
  }
}
