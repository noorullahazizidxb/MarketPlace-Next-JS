"use client";

import { useMemo } from "react";
import { Home, Info, Megaphone, Phone, Search, User2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { BottomNavDescriptor, NavAuthContext } from "./types";

type BuildArgs = NavAuthContext & {
  overrideItems?: BottomNavDescriptor[];
  onSearch: () => void;
  onYou: () => void;
};

export function useBottomNavItems({
  isAdmin,
  overrideItems,
  onSearch,
  onYou,
}: BuildArgs) {
  const { t } = useLanguage();

  return useMemo<BottomNavDescriptor[]>(() => {
    if (overrideItems?.length) return overrideItems;

    const searchItem: BottomNavDescriptor = {
      key: "search",
      label: t("search"),
      icon: Search,
      onClick: onSearch,
    };
    const youItem: BottomNavDescriptor = {
      key: "user",
      label: t("you"),
      icon: User2,
      onClick: onYou,
    };

    const core: BottomNavDescriptor[] = isAdmin
      ? [
          { key: "home", label: t("home"), href: "/listings", icon: Home },
          { key: "about", label: t("about"), href: "/about", icon: Info },
          { key: "contact", label: t("contact"), href: "/contact", icon: Phone },
        ]
      : [
          { key: "home", label: t("home"), href: "/listings", icon: Home },
          { key: "blogs", label: t("blogs"), href: "/blogs", icon: Megaphone },
          { key: "about", label: t("about"), href: "/about", icon: Info },
          { key: "contact", label: t("contact"), href: "/contact", icon: Phone },
        ];

    return [...core, searchItem, youItem];
  }, [isAdmin, t, overrideItems, onSearch, onYou]);
}
