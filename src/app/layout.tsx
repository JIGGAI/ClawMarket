import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SessionProvider } from "@/components/SessionProvider";
import { ModalGalleryProvider } from "@/components/ModalGalleryProvider";

function getSiteUrl(): string {
  // Prefer an explicit canonical URL in production.
  // On Vercel, VERCEL_URL is set (without protocol), so we can infer a preview URL.
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://clawkitchen.ai";
}

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "ClawRecipes — OpenClaw Recipes",
  description:
    "ClawRecipes is an OpenClaw recipes plugin for scaffolding teams and running a file-first workflow (backlog → in-progress → testing → done).",
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.webmanifest",
  icons: {
    // Prefer .ico + explicit PNG sizes for broad browser compatibility.
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "ClawRecipes — OpenClaw Recipes",
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
        <SessionProvider>
          <ModalGalleryProvider>
            <Nav />
            {children}
            <SiteFooter />
          </ModalGalleryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
