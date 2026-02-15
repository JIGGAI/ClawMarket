import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import Twitter from "next-auth/providers/twitter";
import Email from "next-auth/providers/nodemailer";
import { prisma } from "@/lib/prisma";

function parseAdminEmails() {
  return String(process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

function isConfigured(name: string, keys: string[]) {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    // Avoid noisy logs in production builds; only warn at runtime.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[auth] ${name} disabled; missing env: ${missing.join(", ")}`);
    }
    return false;
  }
  return true;
}

const providers: NextAuthConfig["providers"] = [];

if (isConfigured("Google", ["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET"])) {
  providers.push(Google({ clientId: process.env.AUTH_GOOGLE_ID!, clientSecret: process.env.AUTH_GOOGLE_SECRET! }));
}

if (isConfigured("GitHub", ["AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET"])) {
  providers.push(GitHub({ clientId: process.env.AUTH_GITHUB_ID!, clientSecret: process.env.AUTH_GITHUB_SECRET! }));
}

if (isConfigured("Discord", ["AUTH_DISCORD_ID", "AUTH_DISCORD_SECRET"])) {
  providers.push(Discord({ clientId: process.env.AUTH_DISCORD_ID!, clientSecret: process.env.AUTH_DISCORD_SECRET! }));
}

// X/Twitter OAuth — no extra verification required beyond social login.
if (isConfigured("X", ["AUTH_TWITTER_ID", "AUTH_TWITTER_SECRET"])) {
  providers.push(Twitter({ clientId: process.env.AUTH_TWITTER_ID!, clientSecret: process.env.AUTH_TWITTER_SECRET! }));
}

// Email magic link (passwordless).
if (isConfigured("Email", ["AUTH_EMAIL_SERVER", "AUTH_EMAIL_FROM"])) {
  providers.push(
    Email({
      server: process.env.AUTH_EMAIL_SERVER,
      from: process.env.AUTH_EMAIL_FROM,
    }),
  );
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: async ({ session, user }) => {
      // Add stable identity and role for server-side enforcement.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).userId = user.id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).role = (user as any).role;
      return session;
    },
  },
  events: {
    signIn: async ({ user }) => {
      const admins = parseAdminEmails();
      const email = String(user.email ?? "").toLowerCase();
      if (!email) return;
      if (admins.includes(email)) {
        await prisma.user.update({ where: { id: user.id }, data: { role: "admin" } });
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
