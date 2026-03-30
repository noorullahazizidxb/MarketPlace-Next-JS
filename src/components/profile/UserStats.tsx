"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users, Grid3X3, BadgeCheck } from "lucide-react";
import AnimatedNumber from "@/components/ui/animated-number";

const accent: Record<string, { icon: string; bg: string; glow: string }> = {
  "Total Listings": {
    icon: "text-[hsl(var(--primary))]",
    bg: "bg-[hsl(var(--primary))]/12",
    glow: "shadow-[0_0_24px_rgba(var(--primary-raw,99,102,241),0.18)]",
  },
  Followers: {
    icon: "text-emerald-500",
    bg: "bg-emerald-500/12",
    glow: "shadow-[0_0_24px_rgba(16,185,129,0.14)]",
  },
  Representatives: {
    icon: "text-amber-500",
    bg: "bg-amber-500/12",
    glow: "shadow-[0_0_24px_rgba(245,158,11,0.14)]",
  },
};

export default function UserStats({
  listingsCount,
  followersCount,
  repsCount,
}: {
  listingsCount: number;
  followersCount: number;
  repsCount: number;
}) {
  const items = [
    { label: "Total Listings", value: listingsCount, icon: Grid3X3 },
    { label: "Followers", value: followersCount, icon: Users },
    { label: "Representatives", value: repsCount, icon: BadgeCheck },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((it, i) => {
        const Icon = it.icon;
        const a = accent[it.label] || accent["Total Listings"];
        return (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <Card className={`p-5 ${a.glow}`}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]/50">
                    {it.label}
                  </p>
                  <p className="text-3xl font-extrabold tracking-tight tabular-nums">
                    <AnimatedNumber value={it.value} />
                  </p>
                </div>
                <div className={`size-12 rounded-2xl grid place-items-center ${a.bg}`}>
                  <Icon className={`size-6 ${a.icon}`} />
                </div>
              </div>
              {/* subtle progress indicator */}
              <div className="mt-4 h-1 rounded-full bg-[hsl(var(--border))]/40 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${a.bg.replace("/12", "")}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(100, (it.value / Math.max(it.value, 50)) * 100)}%` }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
