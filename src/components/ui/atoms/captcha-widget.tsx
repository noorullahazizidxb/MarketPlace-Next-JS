"use client";

import { useComponentVariants } from "@/hooks/use-component-variants";
import { MathCaptcha, type CaptchaVariant } from "./math-captcha";

interface CaptchaWidgetProps {
  onVerified: (valid: boolean) => void;
  /** Override the variant from ui-context (e.g. for testing) */
  variantOverride?: CaptchaVariant;
  className?: string;
}

/**
 * Context-aware CAPTCHA widget.
 * Reads the active captchaVariant from the ComponentVariants store so the
 * style set in the Appearance settings page is applied site-wide.
 */
export function CaptchaWidget({
  onVerified,
  variantOverride,
  className,
}: CaptchaWidgetProps) {
  const { variants } = useComponentVariants();
  const variant: CaptchaVariant =
    variantOverride ?? (variants as any).captchaVariant ?? "classic";

  return (
    <MathCaptcha
      variant={variant}
      onVerified={onVerified}
      className={className}
    />
  );
}
