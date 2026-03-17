"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { supportedLocales } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/cn";
import { useState } from "react";
import Image from "next/image";
import React from "react";

function Flag({
  country,
  className,
  alt,
}: {
  country?: string;
  className?: string;
  alt?: string;
}) {
  if (!country)
    return (
      <span
        className={cn(
          "inline-block w-5 h-4 rounded-sm bg-muted text-center text-xs",
          className
        )}
      >
        {alt?.slice(0, 2) ?? ""}
      </span>
    );
  const src = `https://flagcdn.com/w40/${country.toLowerCase()}.png`;
  return (
    <Image
      src={src}
      alt={alt || country}
      width={20}
      height={14}
      className={cn("rounded-sm object-cover", className)}
      priority={false}
    />
  );
}

const ForwardedMotionDiv = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof motion.div>
>((props, ref) => <motion.div ref={ref} {...props} />);
ForwardedMotionDiv.displayName = "ForwardedMotionDiv";

export const LanguageDropdown = React.forwardRef<
  HTMLButtonElement,
  { className?: string }
>(({ className }, ref) => {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = supportedLocales.find((l) => l.code === locale)!;

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          ref={ref}
          aria-haspopup="menu"
          aria-label="Change language"
          className={cn(
            "glass inline-flex items-center gap-2 h-9 px-3 rounded-xl text-sm font-medium transition-colors hover:ring-1 ring-white/20",
            className
          )}
        >
          <span className="text-base leading-none">
            <Flag country={current.country} alt={current.label} />
          </span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal forceMount>
        <AnimatePresence>
          {open && (
            <DropdownMenu.Content sideOffset={8} align="end" asChild>
              <ForwardedMotionDiv
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="z-[1000] w-18 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur-md shadow-xl p-1 focus:outline-none"
              >
                {supportedLocales.map((l) => {
                  const active = l.code === locale;
                  return (
                    <DropdownMenu.Item
                      key={l.code}
                      onSelect={() => {
                        setLocale(l.code);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex cursor-pointer select-none items-center gap-2 px-3 h-9 rounded-lg text-sm outline-none data-[highlighted]:bg-white/10",
                        active && "bg-white/10"
                      )}
                    >
                      <Flag country={l.country} alt={l.label} />
                    </DropdownMenu.Item>
                  );
                })}
              </ForwardedMotionDiv>
            </DropdownMenu.Content>
          )}
        </AnimatePresence>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});

LanguageDropdown.displayName = "LanguageDropdown";
