"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { useForm, useWatch } from "react-hook-form";
import { TextInputField } from "@/components/ui/atoms/shadcn/TextInputField";
import { Checkbox } from "@/components/ui/atoms/shadcn/checkbox";
import { useAuth } from "@/lib/use-auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { setCachedToken } from "@/lib/axiosClient";
import { useApiMutation, useLocalMutation } from "@/lib/api-hooks";
import { useNotificationsStore } from "@/store/notifications.store";
import { useListingsStore } from "@/store/listings.store";
import { config } from "@/lib/config";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip";
import { AmbientCanvas } from "@/components/ui/atoms/ambient-canvas";
import { useRecaptchaV3 } from "@/hooks/use-recaptcha-v3";
import { ShieldCheck } from "lucide-react";

type FormData = { email: string; password: string };

export default function SignInPage() {
  const { t, isRtl } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { executeRecaptcha } = useRecaptchaV3();
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: { email: "", password: "" },
  });
  const [email = "", password = ""] = useWatch({
    control,
    name: ["email", "password"],
  });
  const { user } = useAuth();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const setNotifications = useNotificationsStore((s) => s.set);
  const setListings = useListingsStore((s) => s.set);
  const loginMutation = useApiMutation<{ token: string; user: any }>(
    "post",
    "/auth/login"
  );
  const setServerSession = useLocalMutation("post", "/api/login-session");
  const hasSocialAuth = Boolean(config.googleAuthUrl || config.facebookAuthUrl);

  // If already signed in, redirect to /listings
  useEffect(() => {
    if (user) {
      router.replace("/listings");
    }
  }, [user, router]);

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const recaptchaToken = await executeRecaptcha("login");
      // 1) Call backend login via api-hooks middleware and unwrap envelope
      const res = await loginMutation.mutateAsync({ ...data, recaptchaToken });
      const token = res.token;
      const userObj = res.user;
      if (!token || !userObj) throw new Error("Invalid login response");

      // 2) Persist on client store immediately for snappy UI
      setSession({ token, user: userObj });
      // make axios send Authorization header right away
      setCachedToken(token);

      // 2b) Confirm store contains session (read directly from zustand)
      const stored = useAuthStore.getState().session;
      if (!stored || stored.token !== token) {
        throw new Error("Failed to persist session locally");
      }

      // 3) Hydrate local stores from returned user payload (notifications, listings)
      try {
        const u = userObj || {};
        if (Array.isArray(u.notifications) && u.notifications.length) {
          setNotifications(
            u.notifications.map((it: any) => ({
              id: it.id ?? String(Math.random()),
              title: it.title ?? it.type ?? "Notification",
              read: !!it.read,
              createdAt: it.createdAt,
            }))
          );
        }
        if (Array.isArray(u.listings) && u.listings.length) {
          setListings(u.listings);
        }
      } catch { }

      // 4) Inform Next.js server to set HttpOnly session cookies (so SSR/api routes work)
      await setServerSession
        .mutateAsync({ token, user: userObj })
        .catch(() => null);

      // 5) Go to the listings dashboard
      router.replace("/listings");
    } catch (e: any) {
      setError(e?.message || "Sign in failed");
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      data-app-page="sign-in"
      className="min-h-screen flex items-center justify-center p-[var(--space-card)] sm:p-[var(--space-card)] bg-background relative overflow-hidden"
    >
      <AmbientCanvas variant="ribbons" intensity={0.32} className="-z-10" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="relative w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 backdrop-blur-2xl shadow-xl p-[var(--space-card)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          {/* Logo + heading */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            <div className="mx-auto mb-4 w-fit overflow-hidden rounded-2xl bg-background/90 px-5 py-3 shadow-[0_4px_24px_color-mix(in oklab, var(--primary) 25%, transparent)] ring-1 ring-[var(--primary)]/20 dark:bg-background/95">
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
            <h1 className="app-text-h2 font-semibold tracking-tight text-[var(--foreground)]">
              {t("signInTitle")}
            </h1>
            <p className="mt-1.5 app-text-body text-[var(--muted-foreground)]">
              {t("signInSubtitle")}
            </p>
          </motion.div>

          {/* Social auth */}
          {hasSocialAuth && (
            <motion.div
              className="mb-6 space-y-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.4 }}
            >
              <SocialAuthButtons
                googleUrl={config.googleAuthUrl}
                facebookUrl={config.facebookAuthUrl}
              />
              <div className="relative text-center app-text-caption text-[var(--muted-foreground)]">
                <span className="relative z-10 bg-[var(--card)]/90 px-3">
                  {t("orContinueWithEmail")}
                </span>
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--border)]" />
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-[var(--space-section)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Tooltip content={t("tooltipSignInEmail")} side="right">
              <div>
                <TextInputField
                  id="sign-in-email"
                  label={t("email")}
                  icon={<Mail className="size-4" />}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(v) => setValue("email", v, { shouldDirty: true })}
                />
              </div>
            </Tooltip>

            <Tooltip content={t("tooltipSignInPassword")} side="right">
              <div>
                <TextInputField
                  id="sign-in-password"
                  label={t("password")}
                  icon={<Lock className="size-4" />}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(v) =>
                    setValue("password", v, { shouldDirty: true })
                  }
                  suffix={
                    <Tooltip
                      content={
                        showPassword
                          ? t("tooltipHidePassword")
                          : t("tooltipShowPassword")
                      }
                      side="left"
                    >
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </Tooltip>
                  }
                />
              </div>
            </Tooltip>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 app-text-body text-destructive"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Remember me + forgot */}
            <div className="flex items-center justify-between">
              <Tooltip content={t("tooltipRememberMe")} side="top">
                <label className="inline-flex items-center gap-2 app-text-body cursor-pointer select-none">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                    aria-label={t("rememberMe")}
                  />
                  <span>{t("rememberMe")}</span>
                </label>
              </Tooltip>
              <Tooltip content={t("tooltipForgotPassword")} side="top">
                <Link
                  href="#"
                  className="app-text-body text-[var(--accent)] hover:underline underline-offset-2 transition-colors"
                >
                  {t("forgot")}
                </Link>
              </Tooltip>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <Tooltip content={t("tooltipSignInBtn")} side="top">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                  loading={loginMutation.isPending}
                >
                  <LogIn className="size-4" />
                  {t("signIn")}
                </Button>
              </Tooltip>
              <Tooltip content={t("tooltipGoToSignUp")} side="top">
                <Button asChild variant="ghost">
                  <Link href="/sign-up" className="flex items-center gap-2">
                    <UserPlus className="size-4" />
                    <span>{t("createAccount")}</span>
                  </Link>
                </Button>
              </Tooltip>
            </div>

            {/* reCAPTCHA v3 badge */}
            <p className="flex items-center justify-center gap-1.5 app-text-caption text-[var(--muted-foreground)] opacity-70 pt-1">
              <ShieldCheck className="size-3.5 text-success" aria-hidden />
              Protected by reCAPTCHA
            </p>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
