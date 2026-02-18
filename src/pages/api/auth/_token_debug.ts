import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("cache-control", "no-store");

  try {
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret, secureCookie: true });

    // Never return the raw token (or claims that might be sensitive). Only return presence + keys.
    const keys = token ? Object.keys(token).sort() : [];

    res.status(200).json({
      ok: true,
      hasCookie: Boolean(req.cookies?.["__Secure-next-auth.session-token"] || req.cookies?.["next-auth.session-token"]),
      decoded: Boolean(token),
      tokenKeys: keys,
    });
  } catch (e) {
    res.status(200).json({
      ok: true,
      hasCookie: Boolean(req.cookies?.["__Secure-next-auth.session-token"] || req.cookies?.["next-auth.session-token"]),
      decoded: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
