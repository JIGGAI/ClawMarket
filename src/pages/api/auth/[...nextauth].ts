import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours (Remember me: OFF)
const REMEMBER_ME_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Debug header to ensure all auth endpoints are served by the same deployed build.
  // Safe to keep; contains only the Vercel commit SHA.
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    res.setHeader("x-auth-debug-sha", process.env.VERCEL_GIT_COMMIT_SHA);
  }

  const rememberMe = req.cookies?.rememberMe;
  const maxAge = rememberMe === "1" ? REMEMBER_ME_MAX_AGE_SECONDS : DEFAULT_MAX_AGE_SECONDS;

  // Clear helper cookie so it doesn't affect unrelated requests.
  if (rememberMe) {
    res.setHeader(
      "Set-Cookie",
      "rememberMe=; Path=/; Max-Age=0; SameSite=Lax" + (process.env.NODE_ENV === "production" ? "; Secure" : "")
    );
  }

  return await NextAuth(req, res, {
    ...authOptions,
    session: {
      ...(authOptions.session ?? {}),
      maxAge,
    },
  });
}
