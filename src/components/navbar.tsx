"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b border-white/10">
      <div className="container-padded h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl glass flex items-center justify-center font-bold">
            M
          </div>
          <span className="font-semibold">Marketplace</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 glass rounded-2xl px-3 h-10">
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
  );
}
