import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions, Session } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";
import EmailProvider from "next-auth/providers/email";

function parseAdminEmails() {
  return String(process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

function isConfigured(name: string, keys: string[]) {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[auth] ${name} disabled; missing env: ${missing.join(", ")}`);
    }
    return false;
  }
  return true;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Accept either AUTH_* or NEXTAUTH_* env names.
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "database" },
  providers: [
    isConfigured("Google", ["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET"])
      ? GoogleProvider({ clientId: process.env.AUTH_GOOGLE_ID!, clientSecret: process.env.AUTH_GOOGLE_SECRET! })
      : null,
    isConfigured("GitHub", ["AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET"])
      ? GitHubProvider({ clientId: process.env.AUTH_GITHUB_ID!, clientSecret: process.env.AUTH_GITHUB_SECRET! })
      : null,
    isConfigured("Discord", ["AUTH_DISCORD_ID", "AUTH_DISCORD_SECRET"])
      ? DiscordProvider({ clientId: process.env.AUTH_DISCORD_ID!, clientSecret: process.env.AUTH_DISCORD_SECRET! })
      : null,
    // X/Twitter OAuth — no extra verification required beyond social login.
    isConfigured("X", ["AUTH_TWITTER_ID", "AUTH_TWITTER_SECRET"])
      ? TwitterProvider({ clientId: process.env.AUTH_TWITTER_ID!, clientSecret: process.env.AUTH_TWITTER_SECRET! })
      : null,
    // Email magic link (passwordless).
    isConfigured("Email", ["AUTH_EMAIL_SERVER", "AUTH_EMAIL_FROM"])
      ? EmailProvider({ server: process.env.AUTH_EMAIL_SERVER!, from: process.env.AUTH_EMAIL_FROM! })
      : null,
  ].filter(Boolean) as NonNullable<NextAuthOptions["providers"]>,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: async ({ session, user }) => {
      // Stable identity and role for server-side enforcement.
      const s = session as Session & { userId?: string; role?: "user" | "moderator" | "admin" };
      s.userId = user.id;
      s.role = (user as unknown as { role?: "user" | "moderator" | "admin" }).role;
      return s;
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
