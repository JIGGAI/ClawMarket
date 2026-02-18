"use client";

import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";
import { useSession } from "next-auth/react";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const s = session as unknown as { emailVerified?: string | null } | null;
  const showBanner = status === "authenticated" && !s?.emailVerified;

  return (
    <div className="w-full">
      {/* Only render the banner container when the banner is actually shown.
          Otherwise this leaves a thin colored bar at the top of marketplace pages. */}
      {showBanner ? (
        <section className="px-6 pt-6 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <EmailVerificationBanner />
          </div>
        </section>
      ) : null}

      {children}
    </div>
  );
}
