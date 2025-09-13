"use client";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export function Navbar() {
  const [drawer, setDrawer] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b border-[hsl(var(--border))]">
        <div className="container-padded h-16 flex items-center justify-between">
          <div className="group flex items-center gap-3">
            <button
              className="sm:hidden glass size-8 rounded-xl flex items-center justify-center font-bold transition-transform hover:-translate-y-0.5"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="size-8 rounded-xl glass hidden sm:flex items-center justify-center font-bold transition-transform group-hover:-translate-y-0.5">
              M
            </div>
            <span className="font-semibold">Marketplace</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 glass rounded-2xl px-3 h-10 transition-colors hover:bg-white/15">
              <Search className="size-4 text-foreground/60" />
              <input
                className="bg-transparent outline-none text-sm"
                placeholder="Search"
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <Sidebar
        isOpen={drawer}
        onClose={() => setDrawer(false)}
        showDesktop={false}
      />
    </>
  );
}
