import { isAllowedRecaptchaHostname } from "@/lib/recaptcha-hostname";

const SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MINIMUM_SCORE = 0.5;

export class RecaptchaVerificationError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "RecaptchaVerificationError";
    this.status = status;
  }
}

type SiteverifyResponse = {
  success?: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

function requiredMinScore(): number {
  const configured = Number(process.env.RECAPTCHA_MIN_SCORE ?? MINIMUM_SCORE);
  const parsed = Number.isFinite(configured) ? configured : MINIMUM_SCORE;
  return Math.max(MINIMUM_SCORE, parsed);
}

function assertVerified(data: SiteverifyResponse, expectedAction: string): void {
  if (data.success !== true) {
    throw new RecaptchaVerificationError("reCAPTCHA verification failed");
  }
  if (!data.action || data.action !== expectedAction) {
    throw new RecaptchaVerificationError("reCAPTCHA action mismatch");
  }
  if (typeof data.score !== "number" || data.score < requiredMinScore()) {
    throw new RecaptchaVerificationError("reCAPTCHA score too low");
  }
  if (!isAllowedRecaptchaHostname(data.hostname)) {
    throw new RecaptchaVerificationError("reCAPTCHA hostname is not allowed");
  }
}

/**
 * Verifies a reCAPTCHA v3 token with Google siteverify.
 * Login and register tokens are single-use and are verified by the API
 * (MarketPlace-Back-End-Node-Parisma). Do not call this for those tokens.
 */
export async function verifyRecaptchaToken(
  token: unknown,
  expectedAction: string,
  remoteIp?: string,
): Promise<void> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim() ?? "";
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new RecaptchaVerificationError("reCAPTCHA is not configured", 503);
    }
    return;
  }
  if (typeof token !== "string" || token.trim() === "") {
    throw new RecaptchaVerificationError("reCAPTCHA token is required");
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token.trim());
  if (remoteIp) body.set("remoteip", remoteIp);

  const response = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await response.json().catch(() => null)) as SiteverifyResponse | null;
  if (!data) {
    throw new RecaptchaVerificationError("reCAPTCHA verification failed");
  }
  assertVerified(data, expectedAction);
}
