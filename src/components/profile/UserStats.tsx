"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users, Grid3X3, BadgeCheck } from "lucide-react";
import AnimatedNumber from "@/components/ui/animated-number";

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
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <motion.div key={it.label} whileHover={{ y: -2 }}>
            <Card className="rounded-2xl p-5 bg-[hsl(var(--card))] border-[hsl(var(--border))]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="text-sm subtle">{it.label}</div>
              </div>
              <div className="mt-2 text-3xl font-extrabold tracking-tight">
                <AnimatedNumber value={it.value} />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
