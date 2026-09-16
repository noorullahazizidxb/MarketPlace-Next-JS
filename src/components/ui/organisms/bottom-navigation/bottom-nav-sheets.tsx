"use client";

import React from "react";
import {
  Bell,
  Info,
  Layers,
  LayoutDashboard,
  List,
  Megaphone,
  PlusCircle,
  Settings,
  User,
  User2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { ThemeToggle } from "@/components/ui/molecules/theme-toggle";
import { SearchBox } from "@/components/ui/molecules/search-box";
import { BottomSheet } from "@/components/ui/organisms/bottom-sheet";
import { Button } from "@/components/ui/molecules/button";
import { useUIStore } from "@/store/ui.store";
import { ActionTile, LogoutRow, UserHeaderCard } from "./bottom-nav-parts";

type SheetsProps = {
  user: any;
  adminOpen: boolean;
  setAdminOpen: (open: boolean) => void;
  userOpen: boolean;
  setUserOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  onNavigate: (href?: string, override?: () => void) => void;
  onOpenNotifications: () => void;
};

function DensityControl() {
  const { t } = useLanguage();
  const density = useUIStore((s) => s.density);
  const toggleDensity = useUIStore((s) => s.toggleDensity);
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleDensity}
        className="size-10 p-0 app-text-micro"
      >
        {density === "comfort" ? "Co" : "Cm"}
      </Button>
      <span className="app-text-micro text-muted-foreground">{t("density")}</span>
    </div>
  );
}

function ThemeControl() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <ThemeToggle />
      <span className="app-text-micro text-muted-foreground">{t("theme")}</span>
    </div>
  );
}

export function BottomNavSheets({
  user,
  adminOpen,
  setAdminOpen,
  userOpen,
  setUserOpen,
  searchOpen,
  setSearchOpen,
  onNavigate,
  onOpenNotifications,
}: SheetsProps) {
  const { t } = useLanguage();

  return (
    <>
      <BottomSheet
        open={adminOpen}
        onOpenChange={setAdminOpen}
        title={t("adminHub")}
        snapPoints={[0.5, 0.8, 1]}
        initialSnap={0}
      >
        <div className="pb-4">
          <UserHeaderCard user={user} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <ActionTile
            icon={Bell}
            label={t("notifications")}
            onClick={onOpenNotifications}
          />
          <ActionTile
            icon={Megaphone}
            label={t("advertisements")}
            onClick={() => onNavigate("/admin/ads")}
          />
          <ActionTile
            icon={User}
            label={t("usersManagement")}
            onClick={() => onNavigate("/admin/users")}
          />
          <ActionTile
            icon={List}
            label={t("pendingLists")}
            onClick={() => onNavigate("/pendings")}
          />
          <ActionTile
            icon={PlusCircle}
            label={t("newListing")}
            onClick={() => onNavigate("/listings/create")}
          />
          <ActionTile
            icon={Settings}
            label={t("settings")}
            onClick={() => onNavigate("/settings")}
          />
          <ActionTile
            icon={Megaphone}
            label={t("stories")}
            onClick={() => onNavigate("/admin/stories")}
          />
          <ActionTile
            icon={Layers}
            label={t("themes")}
            onClick={() => onNavigate("/settings/appearance")}
          />
          <ActionTile
            icon={User2}
            label={t("profile")}
            onClick={() => onNavigate("/profile")}
          />
          <ThemeControl />
          <DensityControl />
        </div>
        <LogoutRow onDone={() => setAdminOpen(false)} />
      </BottomSheet>

      <BottomSheet
        open={userOpen}
        onOpenChange={setUserOpen}
        title={t("quickMenu")}
        snapPoints={[0.45, 0.75]}
      >
        <div className="pb-4">
          <UserHeaderCard user={user} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <ActionTile
            icon={Bell}
            label={t("notifications")}
            onClick={onOpenNotifications}
          />
          <ActionTile
            icon={User2}
            label={t("profile")}
            onClick={() => onNavigate("/profile")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label={t("myListings")}
            onClick={() => onNavigate("/my-listings")}
          />
          <ActionTile
            icon={LayoutDashboard}
            label={t("approvedShort")}
            onClick={() => onNavigate("/profile/approved-listings")}
          />
          <ActionTile
            icon={List}
            label={t("audit")}
            onClick={() => onNavigate("/profile/audit-logs")}
          />
          <ActionTile
            icon={Info}
            label={t("feedbacks")}
            onClick={() => onNavigate("/profile/feedbacks")}
          />
          <ThemeControl />
          <DensityControl />
        </div>
        <LogoutRow onDone={() => setUserOpen(false)} />
      </BottomSheet>

      <BottomSheet
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title={t("search")}
        snapPoints={[1]}
        initialSnap={0}
      >
        <div className="flex h-full flex-col">
          <SearchBox
            placeholder={t("searchListingsPlaceholder")}
            className="min-h-0 w-full flex-1"
            onSubmitClose={() => setSearchOpen(false)}
            mode="sheet"
          />
          <p className="app-text-caption mt-3 px-1 text-muted-foreground">
            {t("searchIntro")}
          </p>
        </div>
      </BottomSheet>
    </>
  );
}
