import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

function getSiteUrl(): string {
  // Prefer an explicit canonical URL in production.
  // On Vercel, VERCEL_URL is set (without protocol), so we can infer a preview URL.
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://clawkitchen.ai";
}

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Clawcipes — OpenClaw Recipes",
  description:
    "Clawcipes is an OpenClaw recipes plugin for scaffolding teams and running a file-first workflow (backlog → in-progress → testing → done).",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Clawcipes — OpenClaw Recipes",
    description:
      "Scaffold teams, ship work, keep it file-first. Browse featured recipes and launch a shared workspace in minutes.",
    type: "website",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
