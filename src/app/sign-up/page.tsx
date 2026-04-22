"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound, Mail, LockKeyhole, ShieldCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
const inputClasses =
  "h-11 rounded-2xl border border-[hsl(var(--border))/0.35] bg-[hsl(var(--card-bg,var(--card)))/0.55] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground))/0.55] transition-all focus:border-transparent focus:bg-[hsl(var(--card-bg,var(--card)))/0.75] focus:ring-2 focus:ring-[hsl(var(--accent))] disabled:opacity-50";

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

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isRtl } = useLanguage();
  const hasSocialAuth = Boolean(config.googleAuthUrl || config.facebookAuthUrl);
  const [focusedField, setFocusedField] = useState<keyof SignUpValues | null>(
    null
  );
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
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

  const passwordValue = useWatch({ control, name: "password" }) || "";

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

  const handleFocus = (field: keyof SignUpValues) => () =>
    setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

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
                src="/logo/logo.png"
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
            <div className="space-y-2">
              <Tooltip content={t("tooltipSignUpFullName")} side="right">
                <label
                  className="text-sm font-medium text-[hsl(var(--foreground))/0.85]"
                  htmlFor="fullName"
                >
                  {t("fullName")}
                </label>
              </Tooltip>
              <div className="group relative">
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-[hsl(var(--accent))/0.16] opacity-0 blur-xl"
                  initial={false}
                  animate={{ opacity: focusedField === "fullName" ? 0.7 : 0 }}
                  transition={{ duration: 0.25 }}
                />
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground))/0.55] transition-colors group-focus-within:text-[hsl(var(--accent))]">
                  <UserRound className="size-4" />
                </span>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={t("signUpPlaceholderFullName")}
                  autoComplete="name"
                  {...register("fullName")}
                  onFocus={handleFocus("fullName")}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.fullName}
                  className={cn(
                    inputClasses,
                    "relative z-10 pl-12",
                    errors.fullName && "ring-2 ring-red-500/70"
                  )}
                />
                <FieldMessages
                  fieldError={errors.fullName?.message}
                  touched={touchedFields.fullName || dirtyFields.fullName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Tooltip content={t("tooltipSignUpEmail")} side="right">
                <label
                  className="text-sm font-medium text-[hsl(var(--foreground))/0.85]"
                  htmlFor="email"
                >
                  {t("emailAddress")}
                </label>
              </Tooltip>
              <div className="group relative">
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-[hsl(var(--accent))/0.16] opacity-0 blur-xl"
                  initial={false}
                  animate={{ opacity: focusedField === "email" ? 0.7 : 0 }}
                  transition={{ duration: 0.25 }}
                />
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground))/0.55] transition-colors group-focus-within:text-[hsl(var(--accent))]">
                  <Mail className="size-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  {...register("email")}
                  onFocus={handleFocus("email")}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.email}
                  className={cn(
                    inputClasses,
                    "relative z-10 pl-12",
                    errors.email && "ring-2 ring-red-500/70"
                  )}
                />
                <FieldMessages
                  fieldError={errors.email?.message}
                  touched={touchedFields.email || dirtyFields.email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Tooltip content={t("tooltipSignUpPhone")} side="right">
                <label
                  className="text-sm font-medium text-[hsl(var(--foreground))/0.85]"
                  htmlFor="phone"
                >
                  {t("phoneOptional")}
                </label>
              </Tooltip>
              <div className="group relative">
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-[hsl(var(--accent))/0.16] opacity-0 blur-xl"
                  initial={false}
                  animate={{ opacity: focusedField === "phone" ? 0.7 : 0 }}
                  transition={{ duration: 0.25 }}
                />
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground))/0.55] transition-colors group-focus-within:text-[hsl(var(--accent))]">
                  <Phone className="size-4" />
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("signUpPlaceholderPhone")}
                  autoComplete="tel"
                  {...register("phone")}
                  onFocus={handleFocus("phone")}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.phone}
                  className={cn(
                    inputClasses,
                    "relative z-10 pl-12",
                    errors.phone && "ring-2 ring-red-500/70"
                  )}
                />
                <FieldMessages
                  fieldError={errors.phone?.message}
                  touched={touchedFields.phone || dirtyFields.phone}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Tooltip content={t("tooltipSignUpPassword")} side="right">
                  <label
                    className="text-sm font-medium text-[hsl(var(--foreground))/0.85]"
                    htmlFor="password"
                  >
                    {t("password")}
                  </label>
                </Tooltip>
                <div className="group relative">
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-[hsl(var(--accent))/0.16] opacity-0 blur-xl"
                    initial={false}
                    animate={{ opacity: focusedField === "password" ? 0.7 : 0 }}
                    transition={{ duration: 0.25 }}
                  />
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground))/0.55] transition-colors group-focus-within:text-[hsl(var(--accent))]">
                    <LockKeyhole className="size-4" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("password")}
                    onFocus={handleFocus("password")}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.password}
                    className={cn(
                      inputClasses,
                      "relative z-10 pl-12",
                      errors.password && "ring-2 ring-red-500/70"
                    )}
                  />
                  <PasswordStrength score={passwordScore} />
                  <FieldMessages
                    fieldError={errors.password?.message}
                    touched={touchedFields.password || dirtyFields.password}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Tooltip content={t("tooltipSignUpConfirmPassword")} side="right">
                  <label
                    className="text-sm font-medium text-[hsl(var(--foreground))/0.85]"
                    htmlFor="confirmPassword"
                  >
                    {t("confirmPassword")}
                  </label>
                </Tooltip>
                <div className="group relative">
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-[hsl(var(--accent))/0.16] opacity-0 blur-xl"
                    initial={false}
                    animate={{
                      opacity: focusedField === "confirmPassword" ? 0.7 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                  />
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--foreground))/0.55] transition-colors group-focus-within:text-[hsl(var(--accent))]">
                    <ShieldCheck className="size-4" />
                  </span>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    onFocus={handleFocus("confirmPassword")}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.confirmPassword}
                    className={cn(
                      inputClasses,
                      "relative z-10 pl-12",
                      errors.confirmPassword && "ring-2 ring-red-500/70"
                    )}
                  />
                  <FieldMessages
                    fieldError={errors.confirmPassword?.message}
                    touched={
                      touchedFields.confirmPassword ||
                      dirtyFields.confirmPassword
                    }
                  />
                </div>
              </div>
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

// Field error / helper messages with subtle animation
function FieldMessages({
  fieldError,
  touched,
}: {
  fieldError?: string;
  touched?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <AnimatePresence initial={false} mode="wait">
      {fieldError && touched ? (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="mt-1 text-xs font-medium text-red-400"
        >
          {typeof fieldError === "string"
            ? (t as any)(fieldError) || fieldError
            : fieldError}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PasswordStrength({ score }: { score: number }) {
  // Use dynamic import of language hook to avoid prop drilling
  // reuse the already imported hook from top-level of this module
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
