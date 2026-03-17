"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import FollowButton from "./FollowButton";
import type { PublicUser, Follower } from "../../types/user";
import { asset } from "@/lib/assets";
import { useAuth } from "@/lib/use-auth";
import { BadgeCheck, Mail, Phone } from "lucide-react";

export default function UserHeader({ user }: { user: PublicUser }) {
  const { user: me } = useAuth();
  const name =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "User";
  const roles = ((user.roles || []) as Array<{ role: string } | string>)
    .map((r) => (typeof r === "object" && "role" in r ? r.role : String(r)))
    .join(" · ");
  console.log("UserHeader user:", user.roles);
  const isMeFollower = (user.followers || []).some(
    (f) => String(f.id) === String(me?.id)
  );
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,hsl(var(--primary)/0.18),transparent_60%),_linear-gradient(to_bottom_right,hsl(var(--card)),hsl(var(--card))/85)]" />
      {/* animated accent blob */}
      <motion.div
        aria-hidden
        className="absolute -z-10 right-[-10%] top-[-20%] h-72 w-72 rounded-full bg-[hsl(var(--primary))/0.15] blur-3xl"
        initial={{ opacity: 0.3, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2 }}
      />
      <div className="p-6 sm:p-8 md:p-10 grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="size-24 sm:size-28 rounded-3xl overflow-hidden border border-white/10 bg-[hsl(var(--muted))/0.2] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.2)]">
            {user.photo ? (
              <Image
                src={asset(user.photo)}
                alt={name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-2xl font-bold">
                {(name || "U").slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            {name}
            {roles?.toLowerCase().includes("admin") && (
              <BadgeCheck className="size-5 text-primary" />
            )}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {((user.roles || []) as Array<{ role: string } | string>).map(
              (r, idx) => {
                const role =
                  typeof r === "object" && "role" in r ? r.role : String(r);
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.2] px-3 py-1 text-xs font-medium text-foreground/80"
                  >
                    {role}
                  </span>
                );
              }
            )}
          </div>
          {user.address && (
            <div className="mt-1 text-sm text-foreground/80">
              {typeof user.address === "string"
                ? user.address
                : [
                    user.address?.street,
                    user.address?.city,
                    user.address?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
            </div>
          )}
          {(user.email || user.phone) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {user.email && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-background/60 px-2.5 py-1 text-xs">
                  <Mail className="size-3.5" /> {user.email}
                </span>
              )}
              {user.phone && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-background/60 px-2.5 py-1 text-xs">
                  <Phone className="size-3.5" /> {user.phone}
                </span>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center -space-x-2">
            {(user.followers || []).slice(0, 3).map((f: Follower) => (
              <div
                key={f.id}
                className="size-8 rounded-full overflow-hidden border border-white/10 bg-[hsl(var(--muted))/0.2]"
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
                  <div className="w-full h-full grid place-items-center text-xs font-semibold">
                    {(f.fullName || "").slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            <div className="ml-3 text-sm text-foreground/80">
              {(user.followers || []).length} followers
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="justify-self-end"
        >
          <FollowButton targetId={user.id} initialFollowing={isMeFollower} />
        </motion.div>
      </div>
    </section>
  );
}
