"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User2,
  Mail,
  Phone,
  MapPin,
  Globe2,
  Edit3,
  X,
  Save,
  Image as ImageIcon,
  Linkedin,
  Facebook,
  Instagram,
  ShieldCheck,
} from "lucide-react";
import { Check } from "lucide-react";
import { useApiMutation, useApiGet } from "@/lib/api-hooks";
import { useAuthStore } from "@/store/auth.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { asset } from "@/lib/assets";

import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";
import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";

// ---------------- Schema ----------------
const schema = z
  .object({
    firstName: z.string().min(1, "required"),
    lastName: z.string().min(1, "required"),
    fullName: z.string().min(2, "tooShort"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(5, "Too short").optional().or(z.literal("")),
    whatsapp: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    country: z.string().optional().or(z.literal("")),
    street: z.string().optional().or(z.literal("")),
    bio: z
      .string()
      .max(260, "profileValidationBioMax")
      .optional()
      .or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    password: z.string().optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .superRefine((val, ctx) => {
    const pw = val.password && String(val.password).trim();
    const cpw = val.confirmPassword && String(val.confirmPassword).trim();
    if (pw) {
      if (pw.length < 8)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "profileValidationPasswordMin",
        });
      if (!/[A-Z]/.test(pw))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "profileValidationPasswordUpper",
        });
      if (!/[0-9]/.test(pw))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "profileValidationPasswordNumber",
        });
      if (!/[^A-Za-z0-9]/.test(pw))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "profileValidationPasswordSymbol",
        });
      if (!cpw)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "profileValidationPasswordConfirmRequired",
        });
      if (cpw && pw !== cpw)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "profileValidationPasswordsMismatch",
        });
    } else if (cpw) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Enter a password",
      });
    }
  });
type FormData = z.infer<typeof schema>;

// Add password strength helper
function passwordStrength(pw: string) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score; // 0..4
}

// ---------------- Helper UI Primitives (inline for now) ----------------
function FieldLabel({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-2xs font-medium tracking-wide uppercase text-[hsl(var(--muted-foreground))]">
      <Icon className="size-3.5" /> {label}
    </span>
  );
}

// ---------------- Profile Page ----------------
export default function ProfilePage() {
  const { t } = useLanguage();
  const user = useAuthStore((s) => s.session?.user || (s as any).user);
  const updateProfile = useApiMutation("put", "/users/me");
  const updateAvatar = useApiMutation("post", "/users/me/photo");
  const setUser = useAuthStore((s) => s.setUser);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Centralized GET with SWR; renders skeleton while loading
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    mutate: refetchProfile,
  } = useApiGet<any>(["auth", "profile"], "/auth/profile");

  // Map fetched profile to store when available (keeps local user in sync)
  useEffect(() => {
    if (profile) {
      const body = (profile as any)?.data ?? profile;
      const fetchedUser = body?.data ?? body?.user ?? body?.data?.user ?? body;
      if (fetchedUser) setUser(fetchedUser);
    }
  }, [profile, setUser]);

  const defaultValues: Partial<FormData> = useMemo(
    () => ({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      fullName:
        user?.fullName ||
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      email: user?.email || "",
      phone: user?.phone || user?.contacts?.phone || "",
      whatsapp: user?.contacts?.whatsapp || "",
      city: user?.address?.city || user?.representative?.region || "",
      country: user?.address?.country || "",
      street: user?.address?.street || "",
      // social links live inside `contacts` on the API; handle both casing variants
      website: user?.contacts?.website || (user as any)?.website || "",
      linkedin:
        user?.contacts?.linkedIn ||
        user?.contacts?.linkedin ||
        (user as any)?.linkedin ||
        "",
      facebook: user?.contacts?.facebook || (user as any)?.facebook || "",
      instagram: user?.contacts?.instagram || (user as any)?.instagram || "",
      // bio is stored in metadata.bio
      bio: (user as any)?.metadata?.bio || (user as any)?.bio || "",
    }),
    [user]
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues,
  });

  const firstNameValue = useWatch({ control, name: "firstName" }) || "";
  const lastNameValue = useWatch({ control, name: "lastName" }) || "";
  const emailValue = useWatch({ control, name: "email" }) || "";
  const phoneValue = useWatch({ control, name: "phone" }) || "";
  const whatsappValue = useWatch({ control, name: "whatsapp" }) || "";
  const cityValue = useWatch({ control, name: "city" }) || "";
  const countryValue = useWatch({ control, name: "country" }) || "";
  const streetValue = useWatch({ control, name: "street" }) || "";
  const websiteValue = useWatch({ control, name: "website" }) || "";
  const linkedinValue = useWatch({ control, name: "linkedin" }) || "";
  const facebookValue = useWatch({ control, name: "facebook" }) || "";
  const instagramValue = useWatch({ control, name: "instagram" }) || "";
  const bioValue = useWatch({ control, name: "bio" }) || "";
  const passwordValue = useWatch({ control, name: "password" }) || "";
  const confirmPasswordValue =
    useWatch({ control, name: "confirmPassword" }) || "";

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const avatarUrl = avatarPreview || asset(user?.photo) || "/favicon.svg";

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      // Construct payload matching server Joi schema (updateUserSchema)
      const payload: any = {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        fullName: data.fullName || undefined,
        email: data.email || undefined,
        photo: undefined, // optional; avatar handled separately
        contacts: {
          phone: data.phone || undefined,
          whatsapp: data.whatsapp || undefined,
          email: data.email || undefined,
          linkedIn: data.linkedin || undefined,
          facebook: data.facebook || undefined,
          instagram: data.instagram || undefined,
          website: data.website || undefined,
        },
        address: {
          street: data.street || undefined,
          city: data.city || undefined,
          country: data.country || undefined,
        },
        metadata: { bio: data.bio || undefined },
      };

      // Include password fields only when a password was provided
      if (data.password && String(data.password).trim() !== "") {
        // Some APIs expect only `password`; including confirmPassword is harmless if server expects it
        payload.password = data.password;
        if (
          data.confirmPassword &&
          String(data.confirmPassword).trim() !== ""
        ) {
          payload.confirmPassword = data.confirmPassword;
        }
      }

      await updateProfile.mutateAsync(payload as any);

      // revalidate profile and update store
      try {
        const r = await refetchProfile();
        const body = (r as any)?.data ?? r;
        const fetchedUser =
          body?.data ?? body?.user ?? body?.data?.user ?? body;
        setUser(fetchedUser || null);
      } catch (e) {
        console.warn("Failed to refresh profile after update", e);
      }

      setEditing(false);
    } catch (e: any) {
      setError(e?.message || "Failed to update profile");
    }
  };

  const onAvatarPick = useCallback(
    async (file: File) => {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      const fd = new FormData();
      fd.append("photo", file);
      try {
        await updateAvatar.mutateAsync(fd as any);
        // revalidate profile so avatar update is reflected
        try {
          const r = await refetchProfile();
          const body = (r as any)?.data ?? r;
          const fetchedUser =
            body?.data ?? body?.user ?? body?.data?.user ?? body;
          setUser(fetchedUser || null);
        } catch (e) {
          console.warn("Failed to refresh profile after avatar upload", e);
        }
      } catch (e) {
        console.warn("Avatar upload failed", e);
      }
    },
    [updateAvatar, refetchProfile, setUser]
  );

  const openFile = () => fileRef.current?.click();

  // Derived counts / stats mock (replace with real if available)
  const stats = [
    { label: t("listings"), value: (user?.listings?.length ?? 0).toString() },
    { label: t("feedbacks"), value: (user?.feedbacks?.length ?? 0).toString() },
    { label: t("roles"), value: (user?.roles?.length ?? 0).toString() },
  ];

  if (profileLoading && !user) {
    return <ProfileSkeleton />;
  }
  // non-blocking: if error, render page with any store user and a subtle notice
  return (
    <div className="relative min-h-screen pb-24">
      {profileError && (
        <div className="container-padded mt-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-2 text-sm">
            {t("profileLoadFailedCached")}
          </div>
        </div>
      )}
      {/* Ambient gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-fuchsia-500/20 via-amber-400/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-400/10 to-transparent blur-3xl" />
      </div>

      <header className="relative mx-auto max-w-6xl mt-16 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 backdrop-blur-xl shadow-[0_8px_40px_-4px_rgba(0,0,0,0.25)] overflow-hidden"
        >
          {/* Banner */}
          <div className="h-40 sm:h-56 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--accent))]/30 via-fuchsia-500/20 to-emerald-500/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_70%)] mix-blend-overlay" />
          </div>
          {/* Avatar & primary info */}
          <div className="relative px-6 pb-6 -mt-16 flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="relative group w-28 h-28 sm:w-36 sm:h-36">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={t("profileAvatarAlt")}
                className="w-full h-full object-cover rounded-2xl border-4 border-[hsl(var(--background))] shadow-xl group-hover:shadow-2xl transition-shadow"
              />
              <button
                type="button"
                aria-label={t("profileAvatarChange")}
                onClick={openFile}
                className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium backdrop-blur-sm transition-opacity"
              >
                <ImageIcon className="size-5 mr-1" /> {t("profileAvatarChange")}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-label="Upload avatar image"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onAvatarPick(f);
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
                {user?.fullName || user?.firstName || t("profileNameAnonymous")}
                {user?.roles?.some((r: any) => r.role === "REPRESENTATIVE") && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-2xs border border-emerald-500/30">
                    <ShieldCheck className="size-3" />{" "}
                    {t("profileRepresentativeBadge")}
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm subtle line-clamp-2 max-w-xl">
                {bioValue || t("shortBioPlaceholder")}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="px-4 py-2 rounded-xl bg-[hsl(var(--muted))]/60 border border-[hsl(var(--border))] text-center min-w-[110px] backdrop-blur"
                  >
                    <div className="text-lg font-semibold tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-2xs uppercase subtle mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 self-start sm:self-end">
              <Button
                type="button"
                variant={editing ? "secondary" : "primary"}
                onClick={() => setEditing((v) => !v)}
                className="rounded-xl px-5 shadow-sm bg-gradient-to-r from-[hsl(var(--accent))] to-fuchsia-500 text-white border-none hover:shadow-lg"
              >
                {editing ? (
                  <X className="size-4" />
                ) : (
                  <Edit3 className="size-4" />
                )}
                <span className="ml-2 text-sm font-medium">
                  {editing ? t("cancel") : t("edit")}
                </span>
              </Button>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid gap-6 lg:grid-cols-3">
        {/* Left column: contact & address */}
        <section className="space-y-6 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-xl p-6 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.15)]"
          >
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <User2 className="size-4" /> Profile Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <DetailField
                label="First Name"
                value={firstNameValue}
                icon={User2}
              />
              <DetailField
                label="Last Name"
                value={lastNameValue}
                icon={User2}
              />
              <DetailField
                label="Email"
                value={emailValue || "—"}
                icon={Mail}
              />
              <DetailField
                label="Phone"
                value={phoneValue || "—"}
                icon={Phone}
              />
              <DetailField
                label="WhatsApp"
                value={whatsappValue || "—"}
                icon={Phone}
              />
              <DetailField
                label="Website"
                value={websiteValue || "—"}
                icon={Globe2}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-xl p-6 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.15)]"
          >
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <MapPin className="size-4" /> Address
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <DetailField
                label="City"
                value={cityValue || "—"}
                icon={MapPin}
              />
              <DetailField
                label="Country"
                value={countryValue || "—"}
                icon={MapPin}
              />
              <DetailField
                label="Street"
                value={streetValue || "—"}
                icon={MapPin}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-xl p-6 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.15)]"
          >
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Globe2 className="size-4" /> Social
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <DetailField
                label="LinkedIn"
                value={linkedinValue || "—"}
                icon={Linkedin}
              />
              <DetailField
                label="Facebook"
                value={facebookValue || "—"}
                icon={Facebook}
              />
              <DetailField
                label="Instagram"
                value={instagramValue || "—"}
                icon={Instagram}
              />
            </div>
          </motion.div>
        </section>

        {/* Right column: bio edit & actions */}
        <aside className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-xl p-6 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.15)] flex flex-col"
          >
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Edit3 className="size-4" /> Quick Bio
            </h2>
            <textarea
              {...register("bio")}
              rows={6}
              placeholder="Tell people a little about yourself, your experience or interests..."
              className="rounded-xl w-full resize-y min-h-[140px] p-3 border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40 text-sm leading-relaxed placeholder:text-[hsl(var(--muted-foreground))]"
            />
            <p className="mt-2 text-2xs subtle text-right">
              {bioValue.length || 0}/260
            </p>
            <Button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-4 rounded-xl bg-gradient-to-r from-[hsl(var(--accent))] to-fuchsia-500 text-white hover:shadow-lg"
            >
              {t("openFullEditor")}
            </Button>
          </motion.div>
        </aside>
      </main>

      {/* Edit Modal (Dialog) */}
      <Dialog open={editing} onOpenChange={(o: boolean) => setEditing(o)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {t("saveChanges") ? t("saveChanges") : t("profile")}
            </h2>
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="p-2 rounded-full hover:bg-[hsl(var(--muted))]"
              >
                <X className="size-5" />
              </button>
            </DialogClose>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <TextField
              label="First Name"
              error={errors.firstName?.message}
              {...register("firstName")}
              icon={User2}
            />
            <TextField
              label="Last Name"
              error={errors.lastName?.message}
              {...register("lastName")}
              icon={User2}
            />
            <TextField
              label="Full Name"
              error={errors.fullName?.message}
              {...register("fullName")}
              icon={User2}
            />
            <TextField
              label="Email"
              error={errors.email?.message}
              {...register("email")}
              icon={Mail}
            />
            <TextField
              label="Phone"
              error={errors.phone?.message}
              {...register("phone")}
              icon={Phone}
            />
            <TextField
              label="WhatsApp"
              error={errors.whatsapp?.message}
              {...register("whatsapp")}
              icon={Phone}
            />
            <TextField
              label="City"
              error={errors.city?.message}
              {...register("city")}
              icon={MapPin}
            />
            <TextField
              label="Country"
              error={errors.country?.message}
              {...register("country")}
              icon={MapPin}
            />
            <TextField
              label="Street"
              error={errors.street?.message}
              {...register("street")}
              icon={MapPin}
            />
            <TextField
              label="Website"
              error={errors.website?.message}
              {...register("website")}
              icon={Globe2}
            />
            <TextField
              label="LinkedIn"
              error={errors.linkedin?.message}
              {...register("linkedin")}
              icon={Linkedin}
            />
            <TextField
              label="Facebook"
              error={errors.facebook?.message}
              {...register("facebook")}
              icon={Facebook}
            />
            <TextField
              label="Instagram"
              error={errors.instagram?.message}
              {...register("instagram")}
              icon={Instagram}
            />
            {/* Password fields */}
            <div className="sm:col-span-2">
              <FieldLabel icon={ShieldCheck} label="Password" />
              <PasswordField
                register={register}
                error={errors.password?.message as any}
                watchPassword={passwordValue}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel
                icon={ShieldCheck}
                label={t("confirmPassword") || "Confirm Password"}
              />
              <ConfirmPasswordField
                register={register}
                error={errors.confirmPassword?.message as any}
                passwordValue={passwordValue}
                confirmValue={confirmPasswordValue}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel icon={Edit3} label="Bio" />
              <textarea
                {...register("bio")}
                rows={4}
                maxLength={260}
                className="mt-1 w-full rounded-xl border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 text-sm focus:ring-2 ring-[hsl(var(--accent))]/40 resize-y placeholder:text-[hsl(var(--muted-foreground))]"
                placeholder="Short bio (max 260 chars)"
              />
              <p className="mt-1 text-2xs text-right subtle">
                {bioValue.length || 0}/260
              </p>
            </div>
            {error && (
              <p className="text-red-500 text-sm sm:col-span-2">{error}</p>
            )}
            <div className="flex gap-3 sm:col-span-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  reset(defaultValues);
                  setEditing(false);
                }}
                className="rounded-xl"
              >
                <X className="size-4" /> {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || updateProfile.isPending}
                className="rounded-xl bg-gradient-to-r from-[hsl(var(--accent))] to-fuchsia-500 text-white hover:shadow-lg flex items-center gap-2"
              >
                <Save className="size-4" /> {t("saveChanges")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------- Reusable Components (inline; suggest splitting later) ----------------
function DetailField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon: any;
}) {
  const { t } = useLanguage();
  return (
    <div className="group">
      <FieldLabel icon={Icon} label={label} />
      <div className="mt-1 text-sm font-medium text-[hsl(var(--foreground))] bg-[hsl(var(--muted))]/40 rounded-lg px-3 py-2 border border-[hsl(var(--border))] group-hover:border-[hsl(var(--accent))]/50 transition-colors">
        {value && String(value).trim() !== "" ? (
          value
        ) : (
          <span className="opacity-50">{t("notSet")}</span>
        )}
      </div>
    </div>
  );
}

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: any;
};
const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon: Icon, ...rest }, ref) => (
    <div>
      <FieldLabel icon={Icon || User2} label={label} />
      <div className="relative mt-1">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[hsl(var(--muted-foreground))]" />
        )}
        <Input
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          ref={ref}
          className="pl-10 h-11 rounded-xl border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40 text-sm"
        />
      </div>
      {error && <p className="mt-1 text-2xs text-red-500">{error}</p>}
    </div>
  )
);
TextField.displayName = "TextField";

function PasswordField({
  register,
  error,
  watchPassword,
}: {
  register: any;
  error?: string | null;
  watchPassword?: string;
}) {
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(String(watchPassword || ""));
  const widthClass =
    ["w-0", "w-1/4", "w-1/2", "w-3/4", "w-full"][strength] || "w-0";
  const colorClass =
    strength <= 1
      ? "bg-red-400"
      : strength === 2
      ? "bg-yellow-400"
      : "bg-emerald-400";

  return (
    <div className="relative mt-1">
      <Input
        {...register("password")}
        type={visible ? "text" : "password"}
        className="h-11 rounded-xl border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40 text-sm pr-10"
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]
          hover:text-[hsl(var(--foreground))]"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${widthClass} ${colorClass}`}
          />
        </div>
        <div className="text-2xs subtle w-20 text-right">
          {watchPassword
            ? ["Very weak", "Weak", "Okay", "Good", "Strong"][strength]
            : ""}
        </div>
      </div>
      {error && <p className="mt-1 text-2xs text-red-500">{error}</p>}
    </div>
  );
}

function ConfirmPasswordField({
  register,
  error,
  passwordValue,
  confirmValue,
}: {
  register: any;
  error?: string | null;
  passwordValue?: string;
  confirmValue?: string;
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();
  const filled = Boolean(confirmValue && String(confirmValue).length > 0);
  const matches = filled && String(passwordValue) === String(confirmValue);

  return (
    <div className="relative mt-1">
      <Input
        {...register("confirmPassword")}
        type={visible ? "text" : "password"}
        className="h-11 rounded-xl border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 ring-[hsl(var(--accent))]/40 text-sm pr-28"
        aria-invalid={Boolean(error || (filled && !matches))}
        aria-describedby={error ? "confirm-error" : undefined}
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-medium transition-colors ${
              !filled
                ? "bg-white/5 text-[hsl(var(--muted-foreground))]"
                : matches
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
            aria-live="polite"
          >
            <Check className="size-3" />
            {filled ? (matches ? "Match" : "No match") : "—"}
          </span>
        </div>

        <button
          type="button"
          aria-label={
            visible
              ? t("hideConfirmPassword") || "Hide confirm password"
              : t("showConfirmPassword") || "Show confirm password"
          }
          onClick={() => setVisible((v) => !v)}
          className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] p-1"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {error && (
        <p id="confirm-error" className="mt-1 text-2xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------- Splitting Suggestion ----------------
// After confirming design, split into:
//  components/profile/header.tsx (banner + avatar + stats + edit button)
//  components/profile/detail-field.tsx
//  components/profile/edit-modal.tsx
//  components/profile/profile-page.tsx (container + layout)
//  hooks/use-profile-form.ts for form logic & schema
//  components/profile/avatar-uploader.tsx for avatar upload logic
