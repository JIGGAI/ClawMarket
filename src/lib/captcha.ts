export type CaptchaVerifyResult = { ok: true } | { ok: false; error: string };

export async function verifyRecaptchaV2Token(token: string): Promise<CaptchaVerifyResult> {
  const secret = process.env.CAPTCHA_SECRET;
  if (!secret) return { ok: false, error: "CAPTCHA_SECRET is not configured" };

  const t = token.trim();
  if (!t) return { ok: false, error: "Missing captcha token" };

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", t);

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const json = (await res.json().catch(() => null)) as null | { success?: boolean; "error-codes"?: string[] };

    if (!res.ok || !json) return { ok: false, error: `Captcha verify failed (${res.status})` };
    if (!json.success) {
      return { ok: false, error: `Captcha failed: ${(json["error-codes"] || []).join(",") || "unknown"}` };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
