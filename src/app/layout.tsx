import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Clawcipes — OpenClaw Recipes",
  description:
    "Clawcipes is an OpenClaw recipes plugin for scaffolding teams and running a file-first workflow (backlog → in-progress → testing → done).",
  metadataBase: new URL("https://clawcipes.dev"),
  openGraph: {
    title: "Clawcipes — OpenClaw Recipes",
    description:
      "Scaffold teams, ship work, keep it file-first. Browse featured recipes and launch a shared workspace in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-black text-white antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
