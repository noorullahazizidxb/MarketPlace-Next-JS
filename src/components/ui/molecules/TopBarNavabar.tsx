'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "../lib/cn";


type Currency = "af" | "usd";

const CURRENCIES: Record<Currency, { label: string; flag: string }> = {
    af: { label: "افغانی", flag: "af" },
    usd: { label: "دالر", flag: "us" },
  };
function useCurrency() {
    const [currency, setCurrency] = useState<Currency>("af");
  
    const toggleCurrency = useCallback(() => {
      setCurrency((prev) => (prev === "af" ? "usd" : "af"));
    }, []);
  
    return { currency, toggleCurrency, currencyInfo: CURRENCIES[currency] };
  }
// Currency Selector Component
function CurrencySelector() {
    const { currency, toggleCurrency, currencyInfo } = useCurrency();
    const otherCurrency = currency === "af" ? "usd" : "af";
  
    return (
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-1 sm:gap-1.5",
              "app-text-caption sm:app-text-body text-primary-foreground",
              "hover:text-muted-foreground transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring/30 rounded"
            )}
          >
            <ChevronDown className="app-icon-xs sm:w-4 sm:h-4" />
            <span>{currencyInfo.label}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[100px]">
            <DropdownMenuItem
              onClick={toggleCurrency}
              className="cursor-pointer app-text-body"
            >
              {CURRENCIES[otherCurrency].label}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <WorldFlag
          code={currencyInfo.flag}
          className="w-5 h-4 sm:w-6 sm:h-5 rounded-sm object-cover"
        /> */}
      </div>
    );
  }

// Top Bar Navbar
export function TopBarNavbar() {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          "w-full min-h-[var(--ctrl-h)] sm:h-14 md:h-[58px]",
          "bg-[#383A40] text-primary-foreground",
          "px-3 sm:px-4"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between",
            "w-full max-w-[1240px]",
            "gap-2"
          )}
        >
          {/* Welcome Message */}
          <p className="app-text-caption xs:app-text-caption sm:app-text-body md:app-text-body truncate">
          Welcome to the leading ticketing and travel platform in Afghanistan.          </p>
  
          {/* Currency Selector */}
          <CurrencySelector />
        </div>
      </div>
    );
  }