"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useApiGet } from "@/lib/api-hooks";
import { motion } from "framer-motion";
import UserHeader from "@/components/profile/UserHeader";
import UserStats from "@/components/profile/UserStats";
import ListingsGrid from "@/components/profile/ListingsGrid";
import { PublicUserSchema, type PublicUser } from "../../../types/user";

const base =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "";

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useApiGet(
    id ? ["users", id] : null,
    id ? `/users/${id}` : ""
  );

  // validate shape with zod when data arrives
  const parsed = React.useMemo(() => {
    if (!data) return null;
    try {
      return PublicUserSchema.parse(data) as PublicUser;
    } catch {
      return null;
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="container-padded space-y-6">
        <div className="h-48 rounded-3xl bg-[hsl(var(--muted))]/10 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-[hsl(var(--muted))]/10 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-[hsl(var(--muted))]/10 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !parsed) {
    return (
      <div className="container-padded py-10">
        <div className="rounded-3xl border border-[hsl(var(--border))] p-10 text-center">
          <h2 className="text-xl font-semibold">Profile not found</h2>
          <p className="subtle mt-1">
            The user you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const user = parsed as PublicUser;
  const listingsCount = user.listings?.length || 0;
  const followersCount = user.followers?.length || 0;
  const repsCount = Array.isArray(user.representatives)
    ? user.representatives.length
    : 0;

  return (
    <div className="container-padded space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <UserHeader user={user} />
      </motion.div>
      {/* About section if we have metadata/contacts */}
      {(user.contacts || user.metadata) && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
        >
          <h3 className="text-base font-semibold">About</h3>
          <div className="mt-2 text-sm text-foreground/80 space-y-1">
            {typeof user.metadata === "string" && <p>{user.metadata}</p>}
            {typeof user.contacts === "string" && <p>{user.contacts}</p>}
          </div>
        </motion.section>
      )}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <UserStats
          listingsCount={listingsCount}
          followersCount={followersCount}
          repsCount={repsCount}
        />
      </motion.div>
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Listings
            <span className="text-xs px-2 py-0.5 rounded-full border border-[hsl(var(--border))] bg-background/60">
              {listingsCount}
            </span>
          </h2>
        </div>
        <ListingsGrid listings={user.listings || []} />
      </section>
    </div>
  );
}
