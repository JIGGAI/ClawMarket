import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const secret = process.env.CAPTCHA_SECRET;
  const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;

  if (!secret || !siteKey) {
    return NextResponse.json(
      { ok: false, error: "reCAPTCHA is not configured (missing CAPTCHA_SECRET or NEXT_PUBLIC_CAPTCHA_SITE_KEY)." },
      { status: 400 }
    );
  }

  let token: string | undefined;
  try {
    const body = (await req.json()) as { token?: string };
    token = body.token;
  } catch {
    // ignore
  }

  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing captcha token." }, { status: 400 });
  }

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);

  // Best-effort IP binding (optional)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) form.set("remoteip", ip);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: `Captcha verify failed (${res.status})` }, { status: 502 });
  }

  const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
  if (!data.success) {
    return NextResponse.json(
      { ok: false, error: "Captcha check failed.", codes: data["error-codes"] ?? [] },
      { status: 403 }
    );
  }

  // Short-lived proof for NextAuth signIn callback.
  const store = await cookies();
  store.set({
    name: "oc_captcha_ok",
    value: String(Date.now()),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 5,
  });

  return NextResponse.json({ ok: true });
}
