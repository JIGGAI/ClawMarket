"use client";

import { useEffect, useRef, useState } from "react";

export function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { root: null, threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        [
          className,
          "transition-all duration-700 will-change-transform",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      {children}
    </div>
  );
}
