import dns from "node:dns";
import net from "node:net";

export type ValidateUrlResult =
  | { ok: true; url: URL }
  | { ok: false; error: string };

function isPrivateIpv4(ip: string) {
  const parts = ip.split(".").map((x) => Number(x));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return false;
  const [a, b] = parts;

  // 0.0.0.0/8
  if (a === 0) return true;
  // 10.0.0.0/8
  if (a === 10) return true;
  // 127.0.0.0/8
  if (a === 127) return true;
  // 169.254.0.0/16 (link-local; includes AWS/GCP metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16
  if (a === 192 && b === 168) return true;
  // 100.64.0.0/10 (CGNAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  return false;
}

function isPrivateIpv6(ip: string) {
  const h = ip.toLowerCase();

  // IPv4-mapped
  if (h.startsWith("::ffff:")) {
    const v4 = h.slice("::ffff:".length);
    if (/^\d+\.\d+\.\d+\.\d+$/.test(v4)) return isPrivateIpv4(v4);
  }

  // ::/128, ::1/128
  if (h === "::" || h === "::1") return true;

  // fc00::/7 unique local
  if (h.startsWith("fc") || h.startsWith("fd")) return true;

  // fe80::/10 link-local
  if (h.startsWith("fe8") || h.startsWith("fe9") || h.startsWith("fea") || h.startsWith("feb")) return true;

  return false;
}

function isPrivateIp(ip: string) {
  const kind = net.isIP(ip);
  if (kind === 4) return isPrivateIpv4(ip);
  if (kind === 6) return isPrivateIpv6(ip);
  return false;
}

function withTimeout<T>(p: Promise<T>, ms: number, msg: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(msg)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

export async function validateHttpUrlNoPrivateIps(raw: string, opts?: { requireZip?: boolean }): Promise<ValidateUrlResult> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { ok: false, error: "Invalid URL" };
  }

  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { ok: false, error: "URL must be http(s)" };
  }

  const host = u.hostname.toLowerCase();
  if (!host) return { ok: false, error: "URL host is required" };

  // Block obvious localhost-ish hostnames.
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".localhost")) {
    return { ok: false, error: "URL host must not be localhost" };
  }

  // If it's an IP literal, block private/link-local/loopback.
  if (isPrivateIp(host)) {
    return { ok: false, error: "URL host must not be a private IP" };
  }

  // Disallow credentials in URLs (e.g., https://user:pass@example.com)
  if (u.username || u.password) {
    return { ok: false, error: "URL must not include credentials" };
  }

  // Restrict ports to the protocol defaults (reduces SSRF surface area).
  // - http  => 80
  // - https => 443
  if (u.port) {
    const allowed = u.protocol === "http:" ? u.port === "80" : u.port === "443";
    if (!allowed) return { ok: false, error: "URL must not specify a non-default port" };
  }

  // DNS resolve to prevent hostnames that resolve to private IPs.
  // Fail-closed: if we can't resolve, reject.
  try {
    const addrs = await withTimeout(dns.promises.lookup(host, { all: true, verbatim: true }), 1500, "DNS lookup timed out");
    if (!addrs.length) return { ok: false, error: "URL host could not be resolved" };
    for (const a of addrs) {
      if (isPrivateIp(a.address)) {
        return { ok: false, error: "URL host must not resolve to a private IP" };
      }
    }
  } catch {
    return { ok: false, error: "URL host could not be resolved" };
  }

  if (opts?.requireZip) {
    if (!u.pathname.toLowerCase().endsWith(".zip")) {
      return { ok: false, error: "URL must end with .zip" };
    }
  }

  return { ok: true, url: u };
}
