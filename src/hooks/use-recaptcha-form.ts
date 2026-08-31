"use client";
import { useCallback, useState } from "react";
import { useRecaptchaV3 } from "@/hooks/use-recaptcha-v3";

interface RecaptchaFormState {
  captchaToken: string | null;
  captchaValid: boolean;
  generateToken: (action: string) => Promise<string | null>;
  reset: () => void;
}

/**
 * Shared hook for forms that require reCAPTCHA v3.
 * Eliminates duplication between sign-in and sign-up pages.
 *
 * Usage:
 *   const { captchaToken, generateToken } = useRecaptchaForm();
 *   const token = await generateToken("login");
 *   // include token in form submission payload
 */
export function useRecaptchaForm(): RecaptchaFormState {
  const { executeRecaptcha } = useRecaptchaV3();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaValid, setCaptchaValid] = useState(false);

  const generateToken = useCallback(async (action: string): Promise<string | null> => {
    const token = await executeRecaptcha(action);
    setCaptchaToken(token);
    setCaptchaValid(!!token);
    return token;
  }, [executeRecaptcha]);

  const reset = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaValid(false);
  }, []);

  return { captchaToken, captchaValid, generateToken, reset };
}
