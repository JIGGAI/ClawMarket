import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours (Remember me: OFF)
const REMEMBER_ME_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getRememberMeCookie(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)rememberMe=([^;]+)/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

function handler(req: Request) {
  const rememberMe = getRememberMeCookie(req);
  const maxAge = rememberMe === "1" ? REMEMBER_ME_MAX_AGE_SECONDS : DEFAULT_MAX_AGE_SECONDS;

  const nextAuthHandler = NextAuth({
    ...authOptions,
    session: {
      ...(authOptions.session ?? {}),
      // Database sessions honor maxAge by setting session.expires.
      maxAge,
    },
  });

  return nextAuthHandler(req).then((res: Response) => {
    // Clear the short-lived helper cookie so it doesn't affect unrelated requests.
    // (We only need it for the credential sign-in callback.)
    if (rememberMe !== null) {
      res.headers.append("set-cookie", "rememberMe=; Path=/; Max-Age=0; SameSite=Lax");
    }
    return res;
  });
}

export { handler as GET, handler as POST };
