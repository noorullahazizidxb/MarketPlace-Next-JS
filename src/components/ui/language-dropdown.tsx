"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/shadcn/dropdown-menu";
import { supportedLocales } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/cn";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

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
          "inline-block w-5 h-4 rounded-sm bg-muted text-center app-text-caption",
          className,
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
      className={cn("h-auto w-auto rounded-sm object-cover", className)}
      priority={false}
    />
  );
}

export const LanguageDropdown = React.forwardRef<
  HTMLButtonElement,
  { className?: string }
>(({ className }, ref) => {
  const { locale, setLocale } = useLanguage();
  const current = supportedLocales.find((l) => l.code === locale)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          size="sm"
          aria-haspopup="menu"
          aria-label="Change language"
          className={cn(
            "glass inline-flex items-center gap-2 h-9 px-3 rounded-xl app-text-body font-medium",
            className,
          )}
        >
          <span className="app-text-body leading-none">
            <Flag country={current.country} alt={current.label} />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={8}
        align="end"
        className="z-[1000] min-w-[4.5rem] rounded-xl border border-border bg-background/95 backdrop-blur-md p-1"
      >
        {supportedLocales.map((l) => {
          const active = l.code === locale;
          return (
            <DropdownMenuItem
              key={l.code}
              onSelect={() => setLocale(l.code)}
              className={cn(
                "flex cursor-pointer select-none items-center gap-2 px-3 h-9 rounded-lg",
                active && "bg-accent/50",
              )}
            >
              <Flag country={l.country} alt={l.label} />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

LanguageDropdown.displayName = "LanguageDropdown";
