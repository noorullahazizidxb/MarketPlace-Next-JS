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
import { AmbientCanvas } from "@/components/ui/atoms/ambient-canvas";

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
      data-app-page="sign-up"
      className={cn(
        gradientBgClass,
        "relative flex items-center justify-center p-4 sm:p-6 lg:p-10",
      )}
    >
      <AmbientCanvas variant="orbs" intensity={0.3} className="absolute inset-0" />
      <div className="absolute inset-0 -z-10 opacity-40">
        {/* Kept as soft wash; primary motion is AmbientCanvas */}
      </div>

      <motion.section
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-[var(--card-border,var(--border))/0.45] bg-[var(--card-bg,var(--card))/0.9] p-8 shadow-[0_32px_70px_-40px_color-mix(in oklab, var(--primary) 55%, transparent)] backdrop-blur-2xl",
            "text-[var(--card-fg,var(--foreground))]"
          )}
          animate={errors ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in oklab, var(--accent) 50%, transparent)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in oklab, var(--accent) 40%, transparent)] to-transparent" />
          <div className="mb-8 space-y-3 text-center">
            <div className="mx-auto w-fit overflow-hidden rounded-2xl bg-background/90 px-5 py-3 shadow-[0_4px_24px_color-mix(in oklab, var(--primary) 25%, transparent)] ring-1 ring-[var(--primary)]/20 dark:bg-background/95">
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
              className="app-text-h2 font-semibold tracking-tight text-[var(--foreground)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {t("createAccount")}
            </motion.h1>
            <motion.p
              className="app-text-body text-[color-mix(in oklab, var(--foreground) 70%, transparent)]"
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
              <div className="relative text-center app-text-caption text-[color-mix(in oklab, var(--foreground) 60%, transparent)]">
                <span className="relative z-10 bg-[var(--card-bg,var(--card))/0.95] px-3">
                  {t("orContinueWithEmail")}
                </span>
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--border)]" />
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
                  className="rounded-2xl border border-[color-mix(in oklab, var(--accent) 35%, transparent)] bg-[color-mix(in oklab, var(--accent) 12%, transparent)] px-3.5 py-2 app-text-body text-[var(--accent)]"
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
                className="relative flex h-12 w-full items-center justify-center rounded-2xl border-0 bg-[linear-gradient(135deg,_var(--btn-primary-bg,var(--primary))_0%,_var(--accent)_55%,_var(--secondary)_100%)] app-text-body font-semibold text-[var(--btn-primary-fg,var(--primary-foreground))] shadow-[0_18px_48px_-20px_color-mix(in oklab, var(--primary) 60%, transparent)] transition-all hover:shadow-[0_22px_60px_-18px_color-mix(in oklab, var(--secondary) 55%, transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card-bg,var(--card))] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <motion.span
                  animate={submitting ? { opacity: 0.6 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {submitting ? t("creatingAccount") : t("createAccountCta")}
                </motion.span>
                <motion.span
                  className="absolute inset-0 rounded-2xl bg-[var(--btn-primary-fg,var(--primary-foreground))/0.16]"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.25 }}
                  transition={{ duration: 0.25 }}
                  aria-hidden
                />
              </Button>
            </Tooltip>
          </motion.form>

          <motion.div
            className="mt-6 text-center app-text-body text-[color-mix(in oklab, var(--foreground) 70%, transparent)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            {t("alreadyHaveAccount")}{" "}
            <Tooltip content={t("tooltipGoToSignIn")} side="top">
              <Link
                href="/sign-in"
                className="font-semibold text-[var(--accent)] transition-colors hover:text-[color-mix(in oklab, var(--accent) 80%, transparent)]"
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
      ? "bg-[var(--accent)]"
      : score === 2
        ? "bg-[var(--primary)]"
        : score === 3
          ? "bg-[var(--secondary)]"
          : "bg-[var(--btn-primary-bg,var(--primary))]";
  return (
    <div className="mt-2 space-y-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in oklab, var(--border) 40%, transparent)]">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
        />
      </div>
      {score > 0 && (
        <div className="app-text-micro uppercase tracking-wide text-[color-mix(in oklab, var(--foreground) 55%, transparent)]">
          {labels[score - 1]}
        </div>
      )}
    </div>
  );
}
