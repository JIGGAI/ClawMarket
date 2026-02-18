import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white">
      {/* Keep the banner styling the same, but ensure the surrounding background matches the marketplace theme. */}
      <div className="px-6 pt-6 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <EmailVerificationBanner />
        </div>
      </div>
      {children}
    </div>
  );
}
