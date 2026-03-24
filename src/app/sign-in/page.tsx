"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, LogIn } from "lucide-react";
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
import { motion } from "framer-motion";

type FormData = { email: string; password: string };

export default function SignInPage() {
  const { t, isRtl } = useLanguage();
  const [error, setError] = useState<string | null>(null);
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
      className="min-h-screen grid place-items-center p-6 bg-[hsl(var(--background))]"
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="w-full max-w-xl rounded-3xl border border-[hsl(var(--border))] backdrop-blur bg-[hsl(var(--card))]/60 p-8 shadow-2xl"
      >
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="hidden md:flex flex-col justify-center items-start gap-4">
            <div className="size-14 rounded-3xl bg-gradient-to-br from-primary/80 to-fuchsia-500/60 text-background grid place-items-center font-extrabold text-2xl w-20 h-20">
              M
            </div>
            <div>
              <h2 className="heading-xl">{t("welcomeBack")}</h2>
              <p className="subtle mt-1">{t("signInHeroSubtitle")}</p>
            </div>
            <p className="text-sm subtle">{t("signInHeroDescription")}</p>
          </div>

          <div>
            <h1 className="heading-lg mb-2">{t("signInTitle")}</h1>
            <p className="subtle text-sm mb-6">{t("signInSubtitle")}</p>

            {hasSocialAuth && (
              <div className="mb-6 space-y-3">
                <SocialAuthButtons
                  googleUrl={config.googleAuthUrl}
                  facebookUrl={config.facebookAuthUrl}
                />
                <div className="relative text-center text-xs text-[hsl(var(--foreground))/0.6]">
                  <span className="relative z-10 bg-[hsl(var(--card))]/95 px-3">
                    {t("orContinueWithEmail")}
                  </span>
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[hsl(var(--border))]" />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <label className="block text-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="size-4 text-foreground/70" />
                  <span className="text-sm">{t("email")}</span>
                </div>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="h-11"
                />
              </label>

              <label className="block text-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="size-4 text-foreground/70" />
                  <span className="text-sm">{t("password")}</span>
                </div>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  className="h-11"
                />
              </label>

              {error && <p className="text-rose-500 text-sm">{error}</p>}

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded-md" />
                  {t("rememberMe")}
                </label>
                <Link
                  href="#"
                  className="text-sm text-[hsl(var(--accent))] hover:underline"
                >
                  {t("forgot")}
                </Link>
              </div>

              <div className="flex gap-3 items-center">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <LogIn className="size-4" />
                  {t("signIn")}
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="hidden md:inline-flex"
                >
                  <Link href="/sign-up" className="flex items-center gap-2">
                    {t("createAccount")}
                  </Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
