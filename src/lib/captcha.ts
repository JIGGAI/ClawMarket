type VerifyResult = { ok: true } | { ok: false; error: string };

export async function verifyCaptchaV2(opts: {
  token: string;
  remoteIp?: string | null;
}): Promise<VerifyResult> {
  const secret = process.env.CAPTCHA_SECRET;
  if (!secret) {
    // Allow local/dev execution without captcha configured.
    // In prod, this should be set.
    return { ok: true };
  }

  const token = String(opts.token ?? "").trim();
  if (!token) return { ok: false, error: "Missing captcha token" };

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (opts.remoteIp) form.set("remoteip", opts.remoteIp);

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const json = (await res.json().catch(() => null)) as null | { success?: boolean; "error-codes"?: string[] };

    if (!res.ok || !json) {
      return { ok: false, error: `Captcha verify failed (${res.status})` };
    }

    if (!json.success) {
      return {
        ok: false,
        error: `Captcha failed: ${(json["error-codes"] || []).join(",") || "unknown"}`,
      };
    }

    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
