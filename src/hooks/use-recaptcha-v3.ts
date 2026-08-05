"use client";
/**
 * useRecaptchaV3 — loads Google reCAPTCHA v3 on demand and exposes
 * `executeRecaptcha(action)` to get a one-time token before form submit.
 *
 * Usage:
 *   const { executeRecaptcha, ready } = useRecaptchaV3();
 *   const token = await executeRecaptcha("login");
 */

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        grecaptcha: {
            ready(cb: () => void): void;
            execute(siteKey: string, opts: { action: string }): Promise<string>;
        };
        __recaptchaLoading?: boolean;
    }
}

const SITE_KEY =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export function useRecaptchaV3() {
    const [ready, setReady] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        if (!SITE_KEY) return; // no key configured → skip silently
        if (ready) return;

        const loadScript = () => {
            if (window.grecaptcha) {
                window.grecaptcha.ready(() => {
                    if (mountedRef.current) setReady(true);
                });
                return;
            }
            if (window.__recaptchaLoading) return;
            window.__recaptchaLoading = true;

            const script = document.createElement("script");
            script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                window.grecaptcha?.ready(() => {
                    if (mountedRef.current) setReady(true);
                });
            };
            document.head.appendChild(script);
        };

        loadScript();
        return () => {
            mountedRef.current = false;
        };
    }, [ready]);

    const executeRecaptcha = useCallback(
        async (action: string): Promise<string | null> => {
            if (!SITE_KEY) return null;
            if (!window.grecaptcha) return null;
            try {
                return await window.grecaptcha.execute(SITE_KEY, { action });
            } catch {
                return null;
            }
        },
        [],
    );

    return { ready: ready || !SITE_KEY, executeRecaptcha };
}
