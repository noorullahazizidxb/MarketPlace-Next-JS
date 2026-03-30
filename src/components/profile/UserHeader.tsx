"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import FollowButton from "./FollowButton";
import type { PublicUser, Follower } from "../../types/user";
import { asset } from "@/lib/assets";
import { useAuth } from "@/lib/use-auth";
import { BadgeCheck, Mail, MapPin, Phone, Users } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export default function UserHeader({ user }: { user: PublicUser }) {
  const { user: me } = useAuth();
  const name =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "User";
  const roles = ((user.roles || []) as Array<{ role: string } | string>)
    .map((r) => (typeof r === "object" && "role" in r ? r.role : String(r)))
    .join(" · ");
  const isMeFollower = (user.followers || []).some(
    (f) => String(f.id) === String(me?.id)
  );
  const isAdmin = roles?.toLowerCase().includes("admin");

  const address =
    user.address
      ? typeof user.address === "string"
        ? user.address
        : [user.address?.street, user.address?.city, user.address?.country]
          .filter(Boolean)
          .join(", ")
      : null;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)]">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[hsl(var(--card))]/95 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,hsl(var(--primary)/0.18),transparent)]" />
      <motion.div
        aria-hidden
        className="absolute -z-10 right-[-8%] top-[-15%] h-80 w-80 rounded-full bg-[hsl(var(--primary))/0.12] blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -z-10 left-[-6%] bottom-[-10%] h-64 w-64 rounded-full bg-[hsl(var(--accent))/0.1] blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
      />

      {/* Top shimmer line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative p-6 sm:p-8 md:p-10">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative shrink-0"
          >
            <div className="size-24 sm:size-32 rounded-[1.5rem] overflow-hidden border border-white/10 bg-[hsl(var(--muted))/0.2] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.3)]">
              {user.photo ? (
                <Image
                  src={asset(user.photo)}
                  alt={name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center bg-gradient-to-br from-[hsl(var(--primary))/0.3] to-[hsl(var(--accent))/0.2] text-3xl font-black text-[hsl(var(--primary))]">
                  {(name || "U").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-1.5 right-1.5 size-3.5 rounded-full bg-emerald-400 border-2 border-[hsl(var(--card))] shadow-sm" />
          </motion.div>

          {/* Info block */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 min-w-0"
          >
            {/* Name + badge */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2 flex-wrap">
              {name}
              {isAdmin && (
                <BadgeCheck className="size-6 text-[hsl(var(--primary))] shrink-0" />
              )}
            </h1>

            {/* Role chips */}
            <div className="mt-2.5 flex flex-wrap gap-2">
              {((user.roles || []) as Array<{ role: string } | string>).map(
                (r, idx) => {
                  const role =
                    typeof r === "object" && "role" in r ? r.role : String(r);
                  const isAdminRole = role.toLowerCase().includes("admin");
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${isAdminRole
                          ? "border-[hsl(var(--primary))]/30 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                          : "border-[hsl(var(--border))]/60 bg-[hsl(var(--muted))]/20 text-[hsl(var(--foreground))]/70"
                        }`}
                    >
                      {role}
                    </span>
                  );
                }
              )}
            </div>

            {/* Address & contact */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {address && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))]/50 bg-[hsl(var(--background))]/50 backdrop-blur-sm px-3 py-1 text-xs text-[hsl(var(--foreground))]/70">
                  <MapPin className="size-3.5 text-[hsl(var(--primary))]" />
                  {address}
                </span>
              )}
              {user.email && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))]/50 bg-[hsl(var(--background))]/50 backdrop-blur-sm px-3 py-1 text-xs text-[hsl(var(--foreground))]/70">
                  <Mail className="size-3.5 text-[hsl(var(--primary))]" />
                  {user.email}
                </span>
              )}
              {user.phone && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))]/50 bg-[hsl(var(--background))]/50 backdrop-blur-sm px-3 py-1 text-xs text-[hsl(var(--foreground))]/70">
                  <Phone className="size-3.5 text-[hsl(var(--primary))]" />
                  {user.phone}
                </span>
              )}
            </div>

            {/* Followers avatars */}
            {(user.followers || []).length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  {(user.followers || []).slice(0, 5).map((f: Follower) => (
                    <Tooltip key={f.id} content={f.fullName || "Follower"} side="top">
                      <div
                        className="size-8 rounded-full overflow-hidden border-2 border-[hsl(var(--card))] bg-[hsl(var(--muted))/0.3] shadow-sm"
                      >
                        {f.photo ? (
                          <Image
                            src={asset(f.photo)}
                            alt={f.fullName || ""}
                            className="w-full h-full object-cover"
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-xs font-bold bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/20 text-[hsl(var(--primary))]">
                            {(f.fullName || "").slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--foreground))]/60 font-medium">
                  <Users className="size-3.5" />
                  {(user.followers || []).length} followers
                </span>
              </div>
            )}
          </motion.div>

          {/* Follow button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="sm:self-start"
          >
            <FollowButton targetId={user.id} initialFollowing={isMeFollower} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

