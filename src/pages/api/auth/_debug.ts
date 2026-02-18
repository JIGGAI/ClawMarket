import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

function shortHash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 12);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const nextauthSecret = process.env.NEXTAUTH_SECRET ?? "";
  const authSecret = process.env.AUTH_SECRET ?? "";

  res.setHeader("cache-control", "no-store");
  res.status(200).json({
    ok: true,
    method: req.method,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    vercelUrl: process.env.VERCEL_URL ?? null,
    vercelRegion: process.env.VERCEL_REGION ?? null,
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,

    // Presence checks
    hasNEXTAUTH_SECRET: Boolean(nextauthSecret),
    hasAUTH_SECRET: Boolean(authSecret),

    // Fingerprints (safe-ish; no raw secrets)
    nextauthSecretHash: nextauthSecret ? shortHash(nextauthSecret) : null,
    authSecretHash: authSecret ? shortHash(authSecret) : null,

    // Useful to detect multi-instance secret skew
    pid: process.pid,
    nodeEnv: process.env.NODE_ENV ?? null,
  });
}
