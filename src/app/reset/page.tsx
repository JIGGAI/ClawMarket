import Link from "next/link";
import ResetForm from "./resetForm";

export const metadata = {
  title: "Set new password – ClawMarket",
};

export default function ResetPage({ searchParams }: { searchParams?: { token?: string } }) {
  const token = typeof searchParams?.token === "string" ? searchParams.token : "";

  return (
    <main className="px-6 py-16 lg:px-16">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-[var(--text)]">Set a new password</h1>
        <p className="mt-3 text-[var(--muted)]">Choose a new password for your account.</p>

        <ResetForm token={token} />

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link className="text-[color:var(--coral-bright)] underline" href="/login">
            Back to login
          </Link>
          <Link className="text-[var(--muted)] underline" href="/marketplace">
            Back to marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
