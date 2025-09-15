"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import { Search, X, LogIn } from "lucide-react";

export type MobileMenuItem = {
  href: string;
  label: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function MobileMenu({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: MobileMenuItem[];
}) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-modal
          role="dialog"
        >
          <motion.div
            aria-hidden
            role="presentation"
            className="absolute inset-0 bg-black/50 z-[9999]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            className="fixed left-0 right-0 bottom-0 z-[10000] rounded-t-2xl glass border border-[hsl(var(--border))] shadow-2xl p-4 pb-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/20" />
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Menu</div>
              <button
                className="glass size-8 rounded-xl grid place-items-center"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 glass rounded-2xl px-3 h-11 mb-3">
              <Search className="size-4 text-foreground/60" />
              <input
                className="bg-transparent outline-none text-sm flex-1"
                placeholder="Search"
              />
            </div>

            <nav className="max-h-[50vh] overflow-y-auto pr-1 space-y-1">
              {items.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 h-11 rounded-xl glass transition-colors hover:bg-white/10 border border-[hsl(var(--border))]"
                >
                  {Icon ? <Icon className="size-4" /> : null}
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex items-center justify-between gap-3">
              <ThemeToggle />
              {user ? null : (
                <Button
                  asChild
                  variant="ghost"
                  className="glass rounded-xl size-9"
                >
                  <Link
                    href="/sign-in"
                    onClick={onClose}
                    className="flex items-center gap-2 px-3"
                  >
                    <LogIn className="size-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
