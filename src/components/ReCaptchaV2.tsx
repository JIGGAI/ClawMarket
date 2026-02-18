"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void }) => number;
      reset: (id: number) => void;
    };
  }
}

export function ReCaptchaV2({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey) return;

    const existing = document.querySelector('script[data-recaptcha="v2"]') as HTMLScriptElement | null;
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.setAttribute("data-recaptcha", "v2");
      document.head.appendChild(s);
    }

    const t = window.setInterval(() => {
      if (window.grecaptcha?.render) {
        window.clearInterval(t);
        setReady(true);
      }
    }, 50);

    return () => window.clearInterval(t);
  }, [siteKey]);

  useEffect(() => {
    if (!ready) return;
    if (!ref.current) return;
    if (widgetId.current != null) return;

    widgetId.current = window.grecaptcha!.render(ref.current, {
      sitekey: siteKey,
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(null),
    });
  }, [ready, onToken, siteKey]);

  return <div ref={ref} />;
}
