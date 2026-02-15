import { FooterIcons } from "@/components/FooterIcons";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white/70">
      <div className="mx-auto max-w-7xl px-6 py-10 text-center lg:px-16">
        <p className="text-sm text-[var(--muted)]">© {new Date().getFullYear()} ClawRecipes</p>
        <FooterIcons />
      </div>
    </footer>
  );
}
