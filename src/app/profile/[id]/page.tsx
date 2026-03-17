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
      // Ensure the data matches the schema, but fallback to raw data if parsing fails
      return PublicUserSchema.parse(data) as PublicUser;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return data; // Fallback to raw data
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
          className="rounded-2xl border border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--card))/80] p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-[hsl(var(--accent))] mb-4">
            About
          </h3>
          <div className="space-y-4 text-sm text-foreground/80">
            {user.metadata && (
              <div className="p-4 bg-[hsl(var(--muted))/0.2] rounded-lg border border-[hsl(var(--border))]">
                <h4 className="font-semibold text-[hsl(var(--primary))] mb-2">
                  Metadata
                </h4>
                <p>{user.metadata}</p>
              </div>
            )}
            {user.contacts && (
              <div className="p-4 bg-[hsl(var(--muted))/0.2] rounded-lg border border-[hsl(var(--border))]">
                <h4 className="font-semibold text-[hsl(var(--primary))] mb-2">
                  Contacts
                </h4>
                <ul className="space-y-1">
                  {user.contacts.phone && (
                    <li>
                      <strong>Phone:</strong> {user.contacts.phone}
                    </li>
                  )}
                  {user.contacts.whatsapp && (
                    <li>
                      <strong>WhatsApp:</strong> {user.contacts.whatsapp}
                    </li>
                  )}
                </ul>
              </div>
            )}
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
