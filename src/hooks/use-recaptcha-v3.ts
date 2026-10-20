"use client";
/**
 * Loads standard reCAPTCHA v3 (score-based, invisible) and returns a token.
 *
 * The script must be https://www.google.com/recaptcha/api.js?render=<siteKey>.
 * Enterprise and v2 checkbox/invisible widgets reject the production v3 key
 * with "ERROR for site owner: Invalid key type".
 */

import { useCallback, useEffect, useState } from "react";

type RecaptchaV3Client = {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaV3Client;
  }
}

const SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
const SCRIPT_ATTR = "data-recaptcha-v3";

let clientPromise: Promise<RecaptchaV3Client> | null = null;

function scriptUrl(siteKey: string): string {
  return `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
}

function standardScript(): HTMLScriptElement | null {
  const script = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`);
  if (!script?.src.includes("/recaptcha/api.js")) return null;
  if (!script.src.includes("render=")) return null;
  if (script.src.includes("enterprise.js") || script.src.includes("render=explicit")) return null;
  return script;
}

function readyClient(client: RecaptchaV3Client): Promise<RecaptchaV3Client> {
  return new Promise((resolve) => {
    client.ready(() => resolve(client));
  });
}

function currentClient(): RecaptchaV3Client | null {
  if (!standardScript()) return null;
  const client = window.grecaptcha;
  if (!client?.ready || !client.execute) return null;
  return client;
}

function rejectLoad(error: Error): never {
  clientPromise = null;
  throw error;
}

function startLoad(siteKey: string): Promise<RecaptchaV3Client> {
  const existing = currentClient();
  if (existing) return readyClient(existing);

  return new Promise((resolve, reject) => {
    const previous = standardScript();
    const script = previous ?? document.createElement("script");
    script.setAttribute(SCRIPT_ATTR, "true");
    script.async = true;
    script.defer = true;
    script.src = scriptUrl(siteKey);

    const fail = () => reject(new Error("reCAPTCHA failed to load"));
    script.addEventListener("error", fail, { once: true });
    script.addEventListener(
      "load",
      () => {
        const client = window.grecaptcha;
        if (!client?.execute || !client.ready) {
          fail();
          return;
        }
        readyClient(client).then(resolve).catch(fail);
      },
      { once: true },
    );

    if (!previous) {
      delete window.grecaptcha;
      document.head.appendChild(script);
    }
  });
}

function loadRecaptcha(siteKey: string): Promise<RecaptchaV3Client> {
  if (!clientPromise) {
    clientPromise = startLoad(siteKey).catch((error: Error) => rejectLoad(error));
  }
  return clientPromise;
}

export function useRecaptchaV3() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return;
    let active = true;
    loadRecaptcha(SITE_KEY)
      .then(() => {
        if (active) setReady(true);
      })
      .catch(() => {
        if (active) setReady(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    if (!SITE_KEY) return null;
    const client = await loadRecaptcha(SITE_KEY);
    const token = await client.execute(SITE_KEY, { action });
    if (!token) throw new Error("reCAPTCHA did not return a token");
    return token;
  }, []);

  return { ready: ready || !SITE_KEY, executeRecaptcha };
}
