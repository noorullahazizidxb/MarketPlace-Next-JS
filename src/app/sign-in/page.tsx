"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/cn";

type FormData = { email: string; password: string };

export default function SignInPage() {
  const { t, isRtl } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();
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
      // 1) Call backend login via api-hooks middleware and unwrap envelope
      const res = await loginMutation.mutateAsync(data);
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
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[hsl(var(--background))] relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(135deg,_hsl(var(--primary))/0.1,_transparent_45%,_hsl(var(--secondary))/0.12)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
        />
        <motion.div
          className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[hsl(var(--primary))/0.15] blur-3xl"
          animate={{ y: [0, 14, -8, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[hsl(var(--accent))/0.15] blur-3xl"
          animate={{ y: [0, -12, 9, 0], x: [0, 8, -5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="relative w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--card))]/80 backdrop-blur-2xl shadow-[0_32px_70px_-40px_hsl(var(--primary)/0.4)] p-8">
          {/* Shimmer lines */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent))/0.5] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent))/0.3] to-transparent" />

          {/* Logo + heading */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            <div className="mx-auto mb-4 w-fit overflow-hidden rounded-2xl bg-white/90 px-5 py-3 shadow-[0_4px_24px_hsl(var(--primary)/0.25)] ring-1 ring-[hsl(var(--primary))]/20 dark:bg-white/95">
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
            <h1 className="text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
              {t("signInTitle")}
            </h1>
            <p className="mt-1.5 text-sm text-[hsl(var(--muted-foreground))]">
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
              <div className="relative text-center text-xs text-[hsl(var(--muted-foreground))]">
                <span className="relative z-10 bg-[hsl(var(--card))]/90 px-3">
                  {t("orContinueWithEmail")}
                </span>
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[hsl(var(--border))]" />
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {/* Email */}
            <div className="space-y-1.5">
              <Tooltip content={t("tooltipSignInEmail")} side="right">
                <label
                  htmlFor="sign-in-email"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))]/85 cursor-default"
                >
                  <Mail className="size-3.5 text-[hsl(var(--muted-foreground))]" />
                  {t("email")}
                </label>
              </Tooltip>
              <Input
                id="sign-in-email"
                {...register("email")}
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                className="h-11"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Tooltip content={t("tooltipSignInPassword")} side="right">
                <label
                  htmlFor="sign-in-password"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))]/85 cursor-default"
                >
                  <Lock className="size-3.5 text-[hsl(var(--muted-foreground))]" />
                  {t("password")}
                </label>
              </Tooltip>
              <div className="relative">
                <Input
                  id="sign-in-password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  autoComplete="current-password"
                  className={cn("h-11", isRtl ? "pl-10" : "pr-10")}
                />
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
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors",
                      isRtl ? "left-3" : "right-3"
                    )}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-500"
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
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input type="checkbox" className="rounded" />
                  <span>{t("rememberMe")}</span>
                </label>
              </Tooltip>
              <Tooltip content={t("tooltipForgotPassword")} side="top">
                <Link
                  href="#"
                  className="text-sm text-[hsl(var(--accent))] hover:underline underline-offset-2 transition-colors"
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
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
