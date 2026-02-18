"use client";

import { useRouter } from "next/navigation";

export function BackButton({
  fallbackHref = "/",
  className,
  children,
}: {
  fallbackHref?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        try {
          // Prefer true history back when available
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
            return;
          }
        } catch {
          // ignore
        }
        router.push(fallbackHref);
      }}
    >
      {children}
    </button>
  );
}
