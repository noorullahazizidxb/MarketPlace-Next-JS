"use client";
import React, { useRef, useState } from "react";
import {
  FormProvider,
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Plus,
  Trash2,
  UserPlus,
  ImagePlus,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useApiMutation } from "@/lib/api-hooks";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/cn";
import { CreateUserFormValues, RoleOption, emptyRepProvince } from "./types";

const useFormContextSafe = () => useFormContext();

const TextField: React.FC<{
  name:
  | keyof CreateUserFormValues
  | `representativeInfo.${number}.${string}`
  | string;
  label: string;
  type?: string;
  required?: boolean;
  small?: boolean;
  rules?: any;
}> = ({ name, label, type = "text", required, small, rules }) => {
  const {
    register,
    formState: { errors },
  } = useFormContextSafe();
  const err: any = errors as any;
  return (
    <label className={cn("flex flex-col gap-1", small && "text-xs")}>
      <span className={cn("text-xs font-medium", small && "text-[11px]")}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        placeholder={label}
        {...register(name as any, {
          ...(required ? { required: `${label} is required` } : {}),
          ...(rules || {}),
        })}
        className={cn(
          "h-11 w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all placeholder:text-[hsl(var(--foreground))]/30",
          small && "h-9"
        )}
      />
      {err?.[name as any] && (
        <span className="text-2xs text-red-500">
          {String(err?.[name as any]?.message)}
        </span>
      )}
    </label>
  );
};

const PasswordPair: React.FC = () => {
  // useWatch for reactive updates and to drive the strength UI
  const {
    register,
    formState: { errors },
  } = useFormContextSafe();
  const password = useWatch({ name: "password" });
  const confirmPassword = useWatch({ name: "confirmPassword" });
  const err: any = errors;

  // strength scoring
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    if (password.length >= 12) s += 1;
    return s; // 0-5
  })();

  const strengthPct = Math.round((score / 5) * 100);
  const strengthLabel =
    score <= 1
      ? "Very weak"
      : score === 2
        ? "Weak"
        : score === 3
          ? "Fair"
          : score === 4
            ? "Strong"
            : "Very strong";
  const barColor =
    score <= 1
      ? "bg-red-500"
      : score === 2
        ? "bg-orange-400"
        : score === 3
          ? "bg-yellow-400"
          : score === 4
            ? "bg-emerald-400"
            : "bg-green-500";
  // Map score to tailwind width classes (discrete steps)
  const widthClass =
    score === 0
      ? "w-0"
      : score === 1
        ? "w-1/6"
        : score === 2
          ? "w-2/6"
          : score === 3
            ? "w-3/6"
            : score === 4
              ? "w-4/6"
              : "w-full";

  return (
    <div className="md:col-span-2 grid md:grid-cols-2 gap-5">
      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium">Password *</span>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
            })}
            placeholder="Create a secure password"
            className="h-11 w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 transition-all placeholder:text-[hsl(var(--foreground))]/30"
          />
        </label>

        {/* strength meter */}
        <div className="mt-1">
          <div className="flex items-center justify-between text-2xs mb-1">
            <div className="flex items-center gap-2">
              <div className="text-2xs font-medium">Strength</div>
              <div className="text-2xs subtle">{strengthLabel}</div>
            </div>
            <div className="text-2xs subtle">{strengthPct}%</div>
          </div>
          <div className="w-full h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
            <div
              className={
                "h-2 rounded-full transition-all " + barColor + " " + widthClass
              }
            />
          </div>
          <div className="flex gap-2 mt-3 text-2xs">
            <div className="flex items-center gap-2">
              <span
                className={
                  score >= 1 ? "text-emerald-400" : "text-foreground/40"
                }
              >
                <Check className="size-3" />
              </span>
              <span className="subtle">Min 8 chars</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  /[A-Z]/.test(password || "")
                    ? "text-emerald-400"
                    : "text-foreground/40"
                }
              >
                <Check className="size-3" />
              </span>
              <span className="subtle">Uppercase</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  /[0-9]/.test(password || "")
                    ? "text-emerald-400"
                    : "text-foreground/40"
                }
              >
                <Check className="size-3" />
              </span>
              <span className="subtle">Number</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  /[^A-Za-z0-9]/.test(password || "")
                    ? "text-emerald-400"
                    : "text-foreground/40"
                }
              >
                <Check className="size-3" />
              </span>
              <span className="subtle">Symbol</span>
            </div>
          </div>

          {err?.password && (
            <div className="text-2xs text-red-500 mt-2">
              {String(err.password.message)}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium">Confirm Password *</span>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password",
              validate: (v: string) =>
                v === (password || "") || "Passwords do not match",
            })}
            placeholder="Repeat your password"
            className="h-11 w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 transition-all placeholder:text-[hsl(var(--foreground))]/30"
          />
        </label>

        <div className="mt-3 flex items-center gap-3">
          {confirmPassword && confirmPassword === password ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="size-4" />{" "}
              <span className="text-2xs">Passwords match</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400">
              <X className="size-4" />{" "}
              <span className="text-2xs">Not matching</span>
            </div>
          )}
        </div>

        {err?.confirmPassword && (
          <div className="text-2xs text-red-500 mt-2">
            {String(err.confirmPassword.message)}
          </div>
        )}
      </div>
    </div>
  );
};

const RoleSelect: React.FC = () => {
  const { register } = useFormContextSafe();
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium">Role *</span>
      <select
        {...register("role", { required: "Role is required" })}
        className="h-11 w-full rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/70 backdrop-blur-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/50 transition-all"
      >
        <option value="">Select role</option>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
        <option value="REPRESENTATIVE">REPRESENTATIVE</option>
      </select>
    </label>
  );
};

const PhotoUpload: React.FC<{ preview?: string }> = ({ preview }) => {
  const { setValue } = useFormContextSafe();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="md:col-span-2 flex flex-col gap-2">
      <span className="text-xs font-medium">Photo</span>
      <div className="flex items-center gap-4">
        <div className="relative size-20 rounded-xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.4] grid place-items-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <ImagePlus className="size-6 opacity-60" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 px-4 rounded-xl border border-[hsl(var(--border))]/50 text-xs font-medium hover:bg-[hsl(var(--muted))]/20 transition-colors"
          >
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Upload photo"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue("photoFile", file, { shouldValidate: false });
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Tag input component (simple chip editor)
const TagsInput: React.FC<{
  name: keyof CreateUserFormValues | `metadata.tags`;
}> = () => {
  const { setValue, getValues } = useFormContextSafe();
  const tags: string[] = getValues("metadata.tags") || [];
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v) return;
    if (tags.includes(v)) return setInput("");
    setValue("metadata.tags", [...tags, v]);
    setInput("");
  };
  const remove = (idx: number) => {
    const clone = [...tags];
    clone.splice(idx, 1);
    setValue("metadata.tags", clone);
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium">Tags</label>
      <div className="flex flex-wrap gap-2 rounded-xl border p-2 bg-[hsl(var(--card))] min-h-[52px]">
        {tags.map((t, i) => (
          <button
            type="button"
            key={t}
            onClick={() => remove(i)}
            className="group px-2 py-1 rounded-full bg-[hsl(var(--muted))/0.4] border border-[hsl(var(--border))] text-2xs inline-flex items-center gap-1 hover:bg-red-500/10 hover:border-red-400 transition-colors"
          >
            {t}
            <X className="size-3 opacity-50 group-hover:opacity-90" />
          </button>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !input && tags.length) {
              remove(tags.length - 1);
            }
          }}
          placeholder={tags.length ? "Add tag" : "Add tags (Enter)"}
          className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-2xs px-1"
        />
      </div>
      <p className="text-2xs subtle">
        Press Enter to add, click a tag to remove.
      </p>
    </div>
  );
};

const UserCreateWizard: React.FC<{
  onClose: () => void;
  onCreated?: () => void;
}> = ({ onClose, onCreated }) => {
  const methods = useForm<CreateUserFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      photoFile: null,
      role: "",
      representativeInfo: [emptyRepProvince()],
      contacts: { phone: "", email: "", whatsapp: "" },
      address: {
        street: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
      },
      metadata: { preferredLanguage: "en", company: "", tags: [] },
    },
  });
  const { handleSubmit, control } = methods;
  const role = (useWatch({ control, name: "role" }) as RoleOption | "") || "";
  const repInfoArray = useFieldArray({ control, name: "representativeInfo" });
  const [step, setStep] = useState(0);
  const isRepresentative = role === "REPRESENTATIVE";

  const registerUser = useApiMutation<any>("post", "/auth/user/register");
  const registerAdmin = useApiMutation<any>("post", "/auth/admin/register");
  const registerRep = useApiMutation<any>(
    "post",
    "/auth/representative/register"
  );

  // Steps: 0 Account, 1 Details (contacts/address/metadata), 2 Role, 3 Provinces (if representative)
  const stepsBase = ["Account", "Details", "Role"] as string[];
  const repStepsExtra = ["Provinces"];
  const steps = isRepresentative ? [...stepsBase, ...repStepsExtra] : stepsBase;

  // Reactive field subscriptions for validation (fix disabling bug)
  const firstName = useWatch({ control, name: "firstName" }) || "";
  const lastName = useWatch({ control, name: "lastName" }) || "";
  const emailVal = useWatch({ control, name: "email" }) || "";
  const pw = useWatch({ control, name: "password" }) || "";
  const cpw = useWatch({ control, name: "confirmPassword" }) || "";
  const contactsPhone = useWatch({ control, name: "contacts.phone" }) || "";
  const contactsEmail = useWatch({ control, name: "contacts.email" }) || "";
  const contactsWhatsapp =
    useWatch({ control, name: "contacts.whatsapp" }) || "";
  const addressCity = useWatch({ control, name: "address.city" }) || "";
  const addressCountry = useWatch({ control, name: "address.country" }) || "";

  const canNext = (() => {
    switch (step) {
      case 0:
        return !!firstName && !!lastName && !!emailVal && !!pw && pw === cpw;
      case 1:
        return (
          !!contactsPhone &&
          !!contactsEmail &&
          !!contactsWhatsapp &&
          !!addressCity &&
          !!addressCountry
        );
      case 2:
        return !!role;
      case 3:
        if (!isRepresentative) return true;
        // Enable if at least one fully complete row (region + whatsappNumber)
        return repInfoArray.fields.some((f) => f.region && f.whatsappNumber);
      default:
        return true;
    }
  })();

  // Missing criteria helper (for UX hints)
  const missingReasons = (() => {
    if (canNext) return [] as string[];
    if (step === 0) {
      const out: string[] = [];
      if (!firstName) out.push("First name");
      if (!lastName) out.push("Last name");
      if (!emailVal) out.push("Email");
      if (!pw) out.push("Password");
      if (pw && pw !== cpw) out.push("Passwords must match");
      return out;
    }
    if (step === 1) {
      const out: string[] = [];
      if (!contactsPhone) out.push("Contact phone");
      if (!contactsEmail) out.push("Contact email");
      if (!contactsWhatsapp) out.push("WhatsApp");
      if (!addressCity) out.push("City");
      if (!addressCountry) out.push("Country");
      return out;
    }
    if (step === 2 && !role) return ["Role"];
    if (step === 3 && isRepresentative) {
      if (!repInfoArray.fields.some((f) => f.region && f.whatsappNumber))
        return ["At least one complete province row required"];
    }
    return [] as string[];
  })();

  const next = () => {
    if (step < steps.length - 1 && canNext) setStep((s) => s + 1);
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("phone", values.phone);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append(
        "fullName",
        `${values.firstName} ${values.lastName}`.trim()
      );
      if (values.photoFile) formData.append("photo", values.photoFile);
      // contacts, address, metadata
      formData.append("contacts", JSON.stringify(values.contacts));
      formData.append("address", JSON.stringify(values.address));
      formData.append("metadata", JSON.stringify(values.metadata));

      if (values.role === "REPRESENTATIVE") {
        const repArray = values.representativeInfo
          .filter((p) => p.region && p.whatsappNumber) // keep only complete rows
          .map((p) => ({
            region: p.region,
            whatsappNumber: p.whatsappNumber,
            active: p.active,
          }));
        if (repArray.length === 0) {
          toastError("Add at least one representative province");
          return;
        }
        formData.append("representativeInfo", JSON.stringify(repArray));
        await registerRep.mutateAsync(formData as any);
      } else if (values.role === "ADMIN") {
        await registerAdmin.mutateAsync(formData as any);
      } else if (values.role === "USER") {
        await registerUser.mutateAsync(formData as any);
      } else {
        toastError("Select a role");
        return;
      }

      toastSuccess("User created successfully");
      try {
        onCreated?.();
      } catch { }
      onClose();
    } catch (e: any) {
      toastError(e?.message || "Creation failed");
    }
  };

  const photoFile = useWatch({ control, name: "photoFile" });
  const preview = photoFile ? URL.createObjectURL(photoFile) : undefined;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col h-full min-h-0 max-h-[calc(100vh-96px)] sm:max-h-none bg-[hsl(var(--card))]"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="px-6 pt-5 pb-4 border-b border-[hsl(var(--border))]/30 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                <UserPlus className="size-4.5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight">Create User</h2>
                <p className="text-[11px] text-[hsl(var(--foreground))]/40">Step {step + 1} of {steps.length} — {steps[step]}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {steps.map((s, i) => (
                <React.Fragment key={s}>
                  <motion.div
                    animate={{
                      backgroundColor: i < step ? "hsl(var(--primary))" : i === step ? "hsl(var(--primary))" : "hsl(var(--border))",
                      opacity: i > step ? 0.35 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "size-7 rounded-xl flex items-center justify-center text-[10px] font-bold",
                      i <= step ? "text-[hsl(var(--primary-foreground))]" : "text-[hsl(var(--muted-foreground))]"
                    )}
                  >
                    {i < step ? <Check className="size-3" /> : i + 1}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="relative w-5 h-0.5">
                      <div className="absolute inset-0 rounded-full bg-[hsl(var(--border))]/30" />
                      <motion.div className="absolute inset-0 rounded-full bg-[hsl(var(--primary))]" animate={{ scaleX: i < step ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.2 }} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="h-1 rounded-full bg-[hsl(var(--muted))]/20 overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: progress + "%" }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/60"
            />
          </div>
        </div>
        {/* Mobile action bar (top) */}
        <div className="px-4 pt-3 flex items-center gap-2 sm:hidden sticky top-0 z-20 bg-[hsl(var(--card))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--card))]/85 border-b border-[hsl(var(--border))]/30">
          {step > 0 && (
            <button
              type="button"
              onClick={prev}
              className="h-9 px-3 rounded-xl border border-[hsl(var(--border))]/50 text-xs font-medium flex items-center gap-1 hover:bg-[hsl(var(--muted))]/20 transition-colors"
            >
              <ArrowLeft className="size-3" /> Back
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              disabled={!canNext}
              onClick={next}
              className="h-9 px-4 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-semibold ml-auto flex items-center gap-1 disabled:opacity-40 transition-all"
            >
              Next <ArrowRight className="size-3" />
            </button>
          )}
          {step === steps.length - 1 && (
            <button
              type="submit"
              disabled={
                !canNext ||
                registerUser.isPending ||
                registerAdmin.isPending ||
                registerRep.isPending
              }
              className="h-9 px-4 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-semibold ml-auto flex items-center gap-1.5 disabled:opacity-40 transition-all"
            >
              {(registerUser.isPending || registerAdmin.isPending || registerRep.isPending) && (
                <Loader2 className="size-3 animate-spin" />
              )}
              Create
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto sm:overflow-visible p-6 min-h-0 pb-28 sm:pb-8 scroll-smooth overscroll-contain max-h-[calc(100vh-220px)] sm:max-h-none [@supports(height:100dvh)]:max-h-[calc(100dvh-220px)] sm:[@supports(height:100dvh)]:max-h-none">
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="grid md:grid-cols-2 gap-5"
                  >
                    <TextField name="firstName" label="First Name" required />
                    <TextField name="lastName" label="Last Name" required />
                    <TextField
                      name="email"
                      label="Email"
                      required
                      type="email"
                      rules={{
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email",
                        },
                      }}
                    />
                    <TextField
                      name="phone"
                      label="Phone"
                      rules={{
                        pattern: {
                          value: /^\+?[0-9]{7,15}$/,
                          message: "Invalid phone",
                        },
                      }}
                    />
                    <PasswordPair />
                    <PhotoUpload preview={preview} />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <h3 className="text-sm font-semibold">Details</h3>
                    <div className="grid md:grid-cols-3 gap-5">
                      <TextField
                        name={"contacts.phone" as any}
                        label="Contact Phone"
                        required
                        rules={{
                          pattern: {
                            value: /^\+?[0-9]{7,15}$/,
                            message: "Invalid phone",
                          },
                        }}
                      />
                      <TextField
                        name={"contacts.email" as any}
                        label="Contact Email"
                        required
                        type="email"
                        rules={{
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email",
                          },
                        }}
                      />
                      <TextField
                        name={"contacts.whatsapp" as any}
                        label="WhatsApp"
                        required
                        rules={{
                          pattern: {
                            value: /^\+?[0-9]{7,15}$/,
                            message: "Invalid number",
                          },
                        }}
                      />
                    </div>
                    <div className="rounded-xl border p-4 space-y-4 bg-[hsl(var(--muted))/0.3]">
                      <h4 className="text-xs font-semibold tracking-wide uppercase text-foreground/70">
                        Address
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <TextField
                          name={"address.street" as any}
                          label="Street"
                        />
                        <TextField
                          name={"address.city" as any}
                          label="City"
                          required
                        />
                        <TextField
                          name={"address.region" as any}
                          label="Region"
                          required
                        />
                        <TextField
                          name={"address.postalCode" as any}
                          label="Postal Code"
                        />
                        <TextField
                          name={"address.country" as any}
                          label="Country"
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <TextField
                          name={"metadata.company" as any}
                          label="Company"
                        />
                        <TagsInput name={"metadata.tags" as any} />
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step-2-role"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <RoleSelect />
                    <div className="rounded-xl border p-4 text-xs subtle space-y-2">
                      <p>Select a role for the user:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>USER:</strong> Standard account with listing
                          access.
                        </li>
                        <li>
                          <strong>ADMIN:</strong> Full administrative
                          privileges.
                        </li>
                        <li>
                          <strong>REPRESENTATIVE:</strong> Manages regional
                          listings & WhatsApp regions.
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
                {isRepresentative && step === 3 && (
                  <motion.div
                    key="step-3-provinces"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <h3 className="text-sm font-semibold">
                      Representative Provinces
                    </h3>
                    <div className="space-y-4">
                      {repInfoArray.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid md:grid-cols-4 gap-3 items-start rounded-xl border p-4 bg-[hsl(var(--muted))/0.4] relative"
                        >
                          <TextField
                            name={`representativeInfo.${index}.region` as any}
                            label="Region"
                            required
                            small
                          />
                          <TextField
                            name={
                              `representativeInfo.${index}.whatsappNumber` as any
                            }
                            label="WhatsApp"
                            required
                            small
                          />
                          <Controller
                            control={control}
                            name={`representativeInfo.${index}.active`}
                            render={({ field }) => (
                              <label className="flex items-center gap-2 text-xs font-medium mt-6">
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                  className="size-4 rounded border"
                                />
                                Active
                              </label>
                            )}
                          />
                          <div className="flex justify-end mt-6">
                            {repInfoArray.fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => repInfoArray.remove(index)}
                                className="size-8 rounded-xl flex items-center justify-center text-[hsl(var(--foreground))]/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => repInfoArray.append(emptyRepProvince())}
                        className="h-9 px-4 rounded-xl bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs font-semibold flex items-center gap-2 hover:bg-[hsl(var(--primary))]/20 transition-colors"
                      >
                        <Plus className="size-4" /> Add Province
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Live Summary Sidebar */}
            <aside className="hidden xl:block w-72 shrink-0 space-y-4 sticky top-4 self-start">
              <div className="rounded-2xl border border-[hsl(var(--border))]/40 p-4 space-y-3 bg-[hsl(var(--muted))]/10">
                <h4 className="text-xs font-semibold tracking-wide uppercase">
                  Summary
                </h4>
                <div className="text-2xs space-y-2">
                  <div>
                    <div className="font-medium mb-1">Account</div>
                    <ul className="space-y-0.5">
                      <li>
                        Name:{" "}
                        <span className="subtle">
                          {firstName || "—"} {lastName || ""}
                        </span>
                      </li>
                      <li>
                        Email:{" "}
                        <span className="subtle break-all">
                          {emailVal || "—"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Contacts</div>
                    <ul className="space-y-0.5">
                      <li>
                        Phone:{" "}
                        <span className="subtle">{contactsPhone || "—"}</span>
                      </li>
                      <li>
                        WhatsApp:{" "}
                        <span className="subtle">
                          {contactsWhatsapp || "—"}
                        </span>
                      </li>
                      <li>
                        Email:{" "}
                        <span className="subtle break-all">
                          {contactsEmail || "—"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Address</div>
                    <ul className="space-y-0.5">
                      <li>
                        City:{" "}
                        <span className="subtle">{addressCity || "—"}</span>
                      </li>

                      <li>
                        Country:{" "}
                        <span className="subtle">{addressCountry || "—"}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Role</div>
                    <div className="subtle">{role || "—"}</div>
                  </div>
                  {isRepresentative && (
                    <div>
                      <div className="font-medium mb-1">Rep Provinces</div>
                      <ul className="space-y-0.5 max-h-28 overflow-y-auto pr-1">
                        {repInfoArray.fields.map((f, i) => (
                          <li key={f.id} className="truncate">
                            {i + 1}. {f.region || "—"} (
                            {f.whatsappNumber || "—"})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-[hsl(var(--border))]/40 p-3 bg-[hsl(var(--muted))]/10">
                <div className="flex items-center justify-between text-2xs font-medium">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 mt-2 rounded-full bg-[hsl(var(--muted))/0.5] overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: progress + "%" }}
                    transition={{ type: "tween", duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-[hsl(var(--accent))] via-emerald-400 to-green-500"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
        <div className="hidden sm:flex sticky bottom-0 z-30 px-6 py-4 border-t border-[hsl(var(--border))]/30 bg-[hsl(var(--card))]/90 backdrop-blur-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-[env(safe-area-inset-bottom)]">
          <button type="button" onClick={onClose} className="h-9 px-3 rounded-xl text-sm text-[hsl(var(--foreground))]/50 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/20 transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button type="button" onClick={prev} className="h-10 px-4 rounded-2xl border border-[hsl(var(--border))]/50 text-sm font-medium flex items-center gap-1.5 hover:bg-[hsl(var(--muted))]/20 transition-colors">
                <ArrowLeft className="size-3.5" /> Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button type="button" disabled={!canNext} onClick={next} className="h-10 px-5 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-1.5 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all relative overflow-hidden">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                Next <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <button type="submit" disabled={registerUser.isPending || registerAdmin.isPending || registerRep.isPending || !canNext} className="h-10 px-6 rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold flex items-center gap-2 shadow-[0_2px_12px_-3px_hsl(var(--primary)/0.5)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                {(registerUser.isPending || registerAdmin.isPending || registerRep.isPending) ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                Create User
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default UserCreateWizard;
