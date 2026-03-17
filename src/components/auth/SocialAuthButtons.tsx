"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";

type Props = {
  googleUrl?: string;
  facebookUrl?: string;
  compact?: boolean;
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.46a5.53 5.53 0 0 1-2.4 3.63v3.01h3.88c2.27-2.09 3.55-5.18 3.55-8.67Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.88-3.01c-1.08.72-2.46 1.14-4.06 1.14-3.12 0-5.77-2.11-6.71-4.96H1.28v3.11A11.99 11.99 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.26A7.19 7.19 0 0 1 4.91 12c0-.78.13-1.54.38-2.26V6.63H1.28A11.99 11.99 0 0 0 0 12c0 1.93.46 3.75 1.28 5.37l4.01-3.11Z" />
      <path fill="#EA4335" d="M12 4.77c1.77 0 3.36.61 4.61 1.8l3.46-3.46C17.94 1.08 15.24 0 12 0 7.31 0 3.27 2.69 1.28 6.63l4.01 3.11c.94-2.85 3.59-4.97 6.71-4.97Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07Z" />
    </svg>
  );
}

export function SocialAuthButtons({ googleUrl, facebookUrl, compact = false }: Props) {
  const { t } = useLanguage();

  if (!googleUrl && !facebookUrl) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        {googleUrl ? (
          <Button
            asChild
            variant="ghost"
            className="group size-14 rounded-full border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--accent)/0.15)] hover:border-[hsl(var(--accent))] hover:shadow-[0_4px_12px_hsl(var(--accent)/0.2)] transition-all duration-300"
          >
            <Link href={googleUrl} aria-label={t("continueWithGoogle")}>
              <GoogleIcon />
              <span className="sr-only">{t("continueWithGoogle")}</span>
            </Link>
          </Button>
        ) : null}

        {facebookUrl ? (
          <Button
            asChild
            variant="ghost"
            className="group size-14 rounded-full border-[hsl(var(--border))] bg-transparent hover:bg-[#1877F2]/10 hover:border-[#1877F2] hover:shadow-[0_4px_12px_rgba(24,119,242,0.2)] transition-all duration-300"
          >
            <Link href={facebookUrl} aria-label={t("continueWithFacebook")}>
              <span className="text-[#1877F2]">
                <FacebookIcon />
              </span>
              <span className="sr-only">{t("continueWithFacebook")}</span>
            </Link>
          </Button>
        ) : null}
      </div>

      <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
        {t("socialAuthPrompt")}
      </p>
    </div>
  );
}

export default SocialAuthButtons;