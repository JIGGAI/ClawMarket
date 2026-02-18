import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      {/* Match marketplace hero background behind the notification area, without changing the banner styling. */}
      <section className="bg-gradient-to-b from-slate-50 to-white px-6 pt-6 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <EmailVerificationBanner />
        </div>
      </section>
      {children}
    </div>
  );
}
