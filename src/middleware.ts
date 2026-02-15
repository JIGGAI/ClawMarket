import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = Boolean(req.auth);
  const path = req.nextUrl.pathname;

  // Protect future submission/admin flows.
  if (path.startsWith("/submit") || path.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = new URL("/login", req.nextUrl.origin);
      url.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return Response.redirect(url);
    }
  }

  return undefined;
});

export const config = {
  matcher: ["/submit/:path*", "/admin/:path*"],
};
