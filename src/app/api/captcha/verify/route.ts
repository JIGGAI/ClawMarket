import { NextResponse } from "next/server";
import { verifyRecaptchaV2Token } from "@/lib/captcha";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { token?: string };
  const token = typeof body.token === "string" ? body.token : "";

  const v = await verifyRecaptchaV2Token(token);
  if (!v.ok) {
    const status = v.error.includes("configured") ? 500 : v.error.startsWith("Captcha failed") ? 400 : 400;
    return NextResponse.json({ ok: false, error: v.error }, { status });
  }

  return NextResponse.json({ ok: true });
}
