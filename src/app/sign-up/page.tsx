"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound, Mail, LockKeyhole, ShieldCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInputField } from "@/components/ui/atoms/shadcn/TextInputField";
import { cn } from "@/lib/cn";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApiMutation } from "@/lib/api-hooks";
import { useLanguage } from "@/components/providers/language-provider";
import { config } from "@/lib/config";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { Tooltip } from "@/components/ui/tooltip";

const gradientBgClass = "gradient-bg";

// Validation Schema
const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "signUpValidationFullNameMin")
      .max(80, "signUpValidationFullNameMax"),
    email: z.string().email("signUpValidationEmailInvalid"),
    phone: z
      .string()
      .optional()
      .refine(
        (v) => !v || /^\+?[0-9]{8,15}$/.test(v.replace(/\s+/g, "")),
        "signUpValidationPhoneInvalid"
      ),
    password: z
      .string()
      .min(8, "signUpValidationPasswordMin")
      .regex(/[A-Z]/, "signUpValidationPasswordUpper")
      .regex(/[a-z]/, "signUpValidationPasswordLower")
      .regex(/[0-9]/, "signUpValidationPasswordNumber")
      .regex(/[^A-Za-z0-9]/, "signUpValidationPasswordSymbol"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "signUpValidationPasswordsMismatch",
  });

type SignUpValues = z.infer<typeof signUpSchema>;

function translateError(
  t: (key: string) => string,
  message?: string
): string | undefined {
  if (!message) return undefined;
  return (t as any)(message) || message;
}

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isRtl } = useLanguage();
  const hasSocialAuth = Boolean(config.googleAuthUrl || config.facebookAuthUrl);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isSubmitting, touchedFields, dirtyFields },
    setError,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const fullName = useWatch({ control, name: "fullName" }) || "";
  const email = useWatch({ control, name: "email" }) || "";
  const phone = useWatch({ control, name: "phone" }) || "";
  const passwordValue = useWatch({ control, name: "password" }) || "";
  const confirmPassword =
    useWatch({ control, name: "confirmPassword" }) || "";

  // Simple password strength scoring (0-5)
  const passwordScore = (() => {
    const pw = passwordValue || "";
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  })();

  // Mutation for registration
  const registerMutation = useApiMutation<any>(
    "post",
    "/auth/user/register",
    undefined,
    {
      onError: (err: any) => {
        setGlobalError(err?.message || "Registration failed");
      },
      onSuccess: () => {
        router.push("/sign-in?registered=1");
      },
    }
  );

  const onSubmit = async (data: SignUpValues) => {
    setGlobalError(null);
    try {
      const parts = data.fullName.trim().split(/\s+/);
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ") || parts[0];
      const payload = {
        email: data.email.trim(),
        password: data.password,
        phone: data.phone?.trim() || undefined,
        firstName,
        lastName,
        fullName: data.fullName.trim(),
      };
      await registerMutation.mutateAsync(payload);
    } catch (e: any) {
      const msg = e?.message || "Unexpected error";
      setGlobalError(msg);
      setError("root", { message: msg });
    }
  };

  const submitting = isSubmitting || registerMutation.isPending;

  const fieldError = (
    name: keyof SignUpValues,
    touched?: boolean,
    dirty?: boolean
  ) => {
    if (!(touched || dirty)) return undefined;
    return translateError(t, errors[name]?.message as string | undefined);
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        gradientBgClass,
        "flex items-center justify-center p-4 sm:p-6 lg:p-10"
      )}
    >
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(135deg,_hsl(var(--primary))/0.12,_transparent_40%,_hsl(var(--secondary))/0.16)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute top-24 -left-16 h-56 w-56 rounded-full bg-[hsl(var(--primary))/0.2] blur-3xl"
          animate={{ y: [0, 12, -6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-24 -right-12 h-64 w-64 rounded-full bg-[hsl(var(--secondary))/0.22] blur-3xl"
          animate={{ y: [0, -10, 8, 0], x: [0, 6, -4, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.section
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-[hsl(var(--card-border,var(--border)))/0.45] bg-[hsl(var(--card-bg,var(--card)))/0.9] p-8 shadow-[0_32px_70px_-40px_hsl(var(--primary)/0.55)] backdrop-blur-2xl",
            "text-[hsl(var(--card-fg,var(--foreground)))]"
          )}
          animate={errors ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent))/0.5] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent))/0.4] to-transparent" />
          <div className="mb-8 space-y-3 text-center">
            <div className="mx-auto w-fit overflow-hidden rounded-2xl bg-white/90 px-5 py-3 shadow-[0_4px_24px_hsl(var(--primary)/0.25)] ring-1 ring-[hsl(var(--primary))]/20 dark:bg-white/95">
              <Image
                src="/brand/devminds-logo.png"
                alt="DevMinds"
                width={156}
                height={108}
                priority
                className="h-14 w-auto object-contain"
                draggable={false}
              />
            </div>
            <motion.h1
              className="text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {t("createAccount")}
            </motion.h1>
            <motion.p
              className="text-sm text-[hsl(var(--foreground))/0.7]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
            >
              {t("joinCommunityText")}
            </motion.p>
          </div>

          {hasSocialAuth && (
            <div className="mb-6 space-y-3">
              <SocialAuthButtons
                googleUrl={config.googleAuthUrl}
                facebookUrl={config.facebookAuthUrl}
              />
              <div className="relative text-center text-xs text-[hsl(var(--foreground))/0.6]">
                <span className="relative z-10 bg-[hsl(var(--card-bg,var(--card)))/0.95] px-3">
                  {t("orContinueWithEmail")}
                </span>
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[hsl(var(--border))]" />
              </div>
            </div>
          )}

          <motion.form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            initial={false}
            noValidate
          >
            <Tooltip content={t("tooltipSignUpFullName")} side="right">
              <div>
                <TextInputField
                  id="fullName"
                  label={t("fullName")}
                  icon={<UserRound className="size-4" />}
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(v) =>
                    setValue("fullName", v, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                  error={fieldError(
                    "fullName",
                    touchedFields.fullName,
                    dirtyFields.fullName
                  )}
                />
              </div>
            </Tooltip>

            <Tooltip content={t("tooltipSignUpEmail")} side="right">
              <div>
                <TextInputField
                  id="email"
                  label={t("emailAddress")}
                  icon={<Mail className="size-4" />}
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(v) =>
                    setValue("email", v, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                  error={fieldError(
                    "email",
                    touchedFields.email,
                    dirtyFields.email
                  )}
                />
              </div>
            </Tooltip>

            <Tooltip content={t("tooltipSignUpPhone")} side="right">
              <div>
                <TextInputField
                  id="phone"
                  label={t("phoneOptional")}
                  icon={<Phone className="size-4" />}
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(v) =>
                    setValue("phone", v, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }
                  error={fieldError(
                    "phone",
                    touchedFields.phone,
                    dirtyFields.phone
                  )}
                />
              </div>
            </Tooltip>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Tooltip content={t("tooltipSignUpPassword")} side="right">
                  <div>
                    <TextInputField
                      id="password"
                      label={t("password")}
                      icon={<LockKeyhole className="size-4" />}
                      type="password"
                      autoComplete="new-password"
                      required
                      value={passwordValue}
                      onChange={(v) =>
                        setValue("password", v, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        })
                      }
                      error={fieldError(
                        "password",
                        touchedFields.password,
                        dirtyFields.password
                      )}
                    />
                  </div>
                </Tooltip>
                <PasswordStrength score={passwordScore} />
              </div>
              <Tooltip content={t("tooltipSignUpConfirmPassword")} side="right">
                <div>
                  <TextInputField
                    id="confirmPassword"
                    label={t("confirmPassword")}
                    icon={<ShieldCheck className="size-4" />}
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(v) =>
                      setValue("confirmPassword", v, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }
                    error={fieldError(
                      "confirmPassword",
                      touchedFields.confirmPassword,
                      dirtyFields.confirmPassword
                    )}
                  />
                </div>
              </Tooltip>
            </div>

            <AnimatePresence>
              {(globalError || errors.root?.message) && (
                <motion.p
                  className="rounded-2xl border border-[hsl(var(--accent))/0.35] bg-[hsl(var(--accent))/0.12] px-3.5 py-2 text-sm text-[hsl(var(--accent))]"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {errors.root?.message || globalError}
                </motion.p>
              )}
            </AnimatePresence>

            <Tooltip content={t("tooltipCreateAccountBtn")} side="top">
              <Button
                type="submit"
                disabled={submitting || !isValid}
                className="relative flex h-12 w-full items-center justify-center rounded-2xl border-0 bg-[linear-gradient(135deg,_hsl(var(--btn-primary-bg,var(--primary)))_0%,_hsl(var(--accent))_55%,_hsl(var(--secondary))_100%)] text-base font-semibold text-[hsl(var(--btn-primary-fg,var(--primary-foreground)))] shadow-[0_18px_48px_-20px_hsl(var(--primary)/0.6)] transition-all hover:shadow-[0_22px_60px_-18px_hsl(var(--secondary)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--card-bg,var(--card)))] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <motion.span
                  animate={submitting ? { opacity: 0.6 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {submitting ? t("creatingAccount") : t("createAccountCta")}
                </motion.span>
                <motion.span
                  className="absolute inset-0 rounded-2xl bg-[hsl(var(--btn-primary-fg,var(--primary-foreground)))/0.16]"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.25 }}
                  transition={{ duration: 0.25 }}
                  aria-hidden
                />
              </Button>
            </Tooltip>
          </motion.form>

          <motion.div
            className="mt-6 text-center text-sm text-[hsl(var(--foreground))/0.7]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            {t("alreadyHaveAccount")}{" "}
            <Tooltip content={t("tooltipGoToSignIn")} side="top">
              <Link
                href="/sign-in"
                className="font-semibold text-[hsl(var(--accent))] transition-colors hover:text-[hsl(var(--accent))/0.8]"
              >
                {t("logIn")}
              </Link>
            </Tooltip>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}

function PasswordStrength({ score }: { score: number }) {
  const { t } = useLanguage();
  const labels = [t("tooWeak"), t("weak"), t("fair"), t("good"), t("strong")];
  const pct = (score / 5) * 100;
  const colorClass =
    score <= 1
      ? "bg-[hsl(var(--accent))]"
      : score === 2
        ? "bg-[hsl(var(--primary))]"
        : score === 3
          ? "bg-[hsl(var(--secondary))]"
          : "bg-[hsl(var(--btn-primary-bg,var(--primary)))]";
  return (
    <div className="mt-2 space-y-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--border))/0.4]">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
        />
      </div>
      {score > 0 && (
        <div className="text-[10px] uppercase tracking-wide text-[hsl(var(--foreground))/0.55]">
          {labels[score - 1]}
        </div>
      )}
    </div>
  );
}
