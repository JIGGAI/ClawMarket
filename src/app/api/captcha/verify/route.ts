import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secret = process.env.CAPTCHA_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CAPTCHA_SECRET is not configured" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as { token?: string };
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
  }

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const json = (await res.json().catch(() => null)) as null | { success?: boolean; "error-codes"?: string[] };

    if (!res.ok || !json) {
      return NextResponse.json({ ok: false, error: `Captcha verify failed (${res.status})` }, { status: 502 });
    }

    if (!json.success) {
      return NextResponse.json({ ok: false, error: `Captcha failed: ${(json["error-codes"] || []).join(",") || "unknown"}` }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
