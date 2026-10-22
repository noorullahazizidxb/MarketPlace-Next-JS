"use client";

import { useEffect } from "react";

const GA_ID = "G-W3Y1DVMEPR";

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

/** Loads GA4 only after first interaction or browser idle, and only on the production host. */
export function IdleGoogleAnalytics() {
  useEffect(() => {
    if (window.location.hostname !== "marketplace.devminds.net") return;
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      const w = window as GtagWindow;
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag() {
        w.dataLayer!.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", GA_ID);
    };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 5000 })
      : window.setTimeout(load, 3500);
    return () => {
      events.forEach((e) => window.removeEventListener(e, load));
      if (window.cancelIdleCallback && typeof idle === "number") window.cancelIdleCallback(idle);
    };
  }, []);
  return null;
}
