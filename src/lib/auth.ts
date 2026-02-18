import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions, Session } from "next-auth";

import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";

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
  // NOTE: dev/prod Vercel serverless was minting JWT-style session cookies.
  // Using JWT strategy explicitly avoids DB-session adapter quirks and makes sessions robust.
  session: { strategy: "jwt" },
  providers: [
    // Email + password (Credentials)
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          if (process.env.NODE_ENV !== "production") console.warn("[auth][credentials] no user for email", email);
          return null;
        }
        if (!user.passwordHash) {
          // Likely an OAuth-created account or legacy row.
          if (process.env.NODE_ENV !== "production") console.warn("[auth][credentials] missing passwordHash for", email);
          return null;
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
          if (process.env.NODE_ENV !== "production") console.warn("[auth][credentials] bad password for", email);
          return null;
        }

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),

    // Optional social logins (still allowed; not passwordless magic-link)
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
  ].filter(Boolean) as NonNullable<NextAuthOptions["providers"]>,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Per policy: do not require CAPTCHA for normal returning-user login.
    // CAPTCHA is enforced only on explicitly gated, abusable actions (e.g. submissions, signup).
    signIn: async () => true,

    // Persist key user fields onto the JWT so session reads do not depend on DB sessions.
    jwt: async ({ token, user }) => {
      type TokenWithApp = typeof token & {
        userId?: string;
        role?: "user" | "moderator" | "admin";
        emailVerified?: string | null;
      };
      const t = token as TokenWithApp;

      if (user?.id) {
        t.userId = user.id;
      }

      // Best-effort: hydrate role + emailVerified from DB (needed for server-side gating).
      const userId = t.userId ?? t.sub;
      if (userId) {
        try {
          const u = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, emailVerified: true, email: true },
          });
          if (u) {
            t.role = u.role;
            t.emailVerified = u.emailVerified ? u.emailVerified.toISOString() : null;

            // Admin seeding (best-effort)
            const admins = parseAdminEmails();
            const email = String(u.email ?? "").toLowerCase();
            if (email && admins.includes(email) && u.role !== "admin") {
              await prisma.user.update({ where: { id: userId }, data: { role: "admin" } });
              t.role = "admin";
            }
          }
        } catch {
          // ignore
        }
      }

      return t;
    },

    session: async ({ session, token }) => {
      type TokenWithApp = typeof token & {
        userId?: string;
        role?: "user" | "moderator" | "admin";
        emailVerified?: string | null;
      };
      const t = token as TokenWithApp;

      const s = session as Session & {
        userId?: string;
        role?: "user" | "moderator" | "admin";
        emailVerified?: string | null;
      };

      s.userId = t.userId ?? t.sub ?? undefined;
      s.role = t.role ?? undefined;
      s.emailVerified = t.emailVerified ?? null;

      return s;
    },
  },
  events: {
    signIn: async ({ user, account }) => {
      // Treat social/OAuth logins as verified (provider already verified email ownership).
      // Keep credentials signups gated by explicit email verification link.
      if (account?.type === "oauth") {
        try {
          await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
        } catch {
          // best-effort
        }
      }

      const admins = parseAdminEmails();
      const email = String(user.email ?? "").toLowerCase();
      if (!email) return;
      if (admins.includes(email)) {
        await prisma.user.update({ where: { id: user.id }, data: { role: "admin" } });
      }
    },
  },
};
