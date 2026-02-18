import nodemailer from "nodemailer";

function getTransport() {
  const server = process.env.AUTH_EMAIL_SERVER;
  if (!server) return null;
  return nodemailer.createTransport(server);
}

export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  const from = process.env.AUTH_EMAIL_FROM;
  const transport = getTransport();

  if (!from || !transport) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[mailer] Email not sent (missing AUTH_EMAIL_SERVER/AUTH_EMAIL_FROM)", { to, subject, text });
    }
    return { ok: false as const, error: "Email is not configured." };
  }

  await transport.sendMail({ from, to, subject, text });
  return { ok: true as const };
}
