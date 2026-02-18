import nodemailer from "nodemailer";

type SendEmailInput = { to: string; subject: string; text: string };

function getSmtpTransport() {
  const server = process.env.AUTH_EMAIL_SERVER;
  if (!server) return null;
  return nodemailer.createTransport(server);
}

async function sendViaMailgunApi({ to, subject, text }: SendEmailInput) {
  const apiKey = process.env.MAILGUN_API_KEY || process.env.MAILGUN_SENDING_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const from = process.env.AUTH_EMAIL_FROM || process.env.MAILGUN_FROM;
  const url = process.env.MAILGUN_URL || "https://api.mailgun.net";

  if (!apiKey || !domain || !from) {
    return { ok: false as const, error: "Mailgun API is not configured." };
  }

  // mailgun.js requires FormData
  const FormData = (await import("form-data")).default;
  const Mailgun = (await import("mailgun.js")).default;

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({ username: "api", key: apiKey, url });

  try {
    await mg.messages.create(domain, {
      from,
      to: [to],
      subject,
      text,
    });
    return { ok: true as const };
  } catch (e) {
    console.error("[mailer] Mailgun send failed", e);
    return { ok: false as const, error: "Mailgun send failed." };
  }
}

export async function sendEmail({ to, subject, text }: SendEmailInput) {
  // Prefer Mailgun API when configured (more predictable on serverless).
  if ((process.env.MAILGUN_API_KEY || process.env.MAILGUN_SENDING_KEY) && process.env.MAILGUN_DOMAIN) {
    const r = await sendViaMailgunApi({ to, subject, text });
    if (r.ok) return r;
    // fall through to SMTP if present
  }

  const from = process.env.AUTH_EMAIL_FROM;
  const transport = getSmtpTransport();

  if (!from || !transport) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[mailer] Email not sent (missing Mailgun config and AUTH_EMAIL_SERVER/AUTH_EMAIL_FROM)", {
        to,
        subject,
        text,
      });
    }
    return { ok: false as const, error: "Email is not configured." };
  }

  await transport.sendMail({ from, to, subject, text });
  return { ok: true as const };
}
