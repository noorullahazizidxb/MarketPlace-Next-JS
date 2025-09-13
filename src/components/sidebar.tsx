"use client";
import Link from "next/link";
import { LayoutDashboard, Settings, Layers3 } from "lucide-react";

export function Sidebar() {
  const items = [
    { href: "/", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/listings", label: "Listings", Icon: Layers3 },
    { href: "/settings", label: "Settings", Icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col gap-2 p-4 border-r border-white/10 sticky top-0 h-screen">
      <div className="glass rounded-2xl p-4">
        <p className="text-sm text-foreground/70">Navigation</p>
      </div>
      <nav className="space-y-2">
        {items.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 h-11 rounded-xl glass hover:translate-x-0.5 transition-transform"
          >
            <Icon className="size-4" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
