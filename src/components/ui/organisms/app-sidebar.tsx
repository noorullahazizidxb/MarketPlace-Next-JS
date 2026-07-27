"use client";

import * as React from "react";
import {
  LayoutPanelLeft,
  LayoutDashboard,
  Mail,
  CheckSquare,
  MessageCircle,
  Calendar,
  Shield,
  AlertTriangle,
  Settings,
  HelpCircle,
  CreditCard,
  LayoutTemplate,
  Users,
  Network,
} from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "../atoms/shadcn/brand-logo";
import { SidebarNotification } from "../molecules/sidebar-notification";

import { NavMain } from "../molecules/nav-main";
import { NavUser } from "../molecules/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../atoms/shadcn/sidebar";
// import image from "../lib/media/OTA-Tickets.png"; // Commented out to use public path

export interface SidebarNavSubItem {
  title: string;
  url: string;
  isActive?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface SidebarNavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  target?: string;
  isActive?: boolean;
  items?: SidebarNavSubItem[];
}

export interface SidebarNavGroup {
  label: string;
  items: SidebarNavItem[];
}

const defaultSidebarData: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navGroups: SidebarNavGroup[];
} = {
  user: {
    name: "OTA Tickets",
    email: "store@example.com",
    avatar: "",
  },
  navGroups: [
    {
      label: "Dashboards",
      items: [
        {
          title: "Home Page",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Dashboard",
          url: "/dashboard-2",
          icon: LayoutPanelLeft,
        },
      ],
    },
    {
      label: "Apps",
      items: [
        {
          title: "Mail",
          url: "/mail",
          icon: Mail,
        },
        {
          title: "Contracts",
          url: "/contracts",
          icon: CheckSquare,
        },
        {
          title: "Chat",
          url: "/chat",
          icon: MessageCircle,
        },
        {
          title: "Calendar & Events",
          url: "/calendar",
          icon: Calendar,
        },
        {
          title: "B2B Accounts",
          url: "/users",
          icon: Users,
        },
        {
          title: "Subsystems",
          url: "/sub_systemlist",
          icon: Network,
        },
      ],
    },
    {
      label: "Pages",
      items: [
        {
          title: "Landing Page",
          url: "/landing",
          target: "_blank",
          icon: LayoutTemplate,
        },
        {
          title: "Auth Pages",
          url: "#",
          icon: Shield,
          items: [
            {
              title: "Sign In 1",
              url: "/sign-in",
            },
            {
              title: "Sign In 2",
              url: "/sign-in-2",
            },
            {
              title: "Sign In 3",
              url: "/sign-in-3",
            },
            {
              title: "Sign Up 1",
              url: "/sign-up",
            },
            {
              title: "Sign Up 2",
              url: "/sign-up-2",
            },
            {
              title: "Sign Up 3",
              url: "/sign-up-3",
            },
            {
              title: "Forgot Password 1",
              url: "/forgot-password",
            },
            {
              title: "Forgot Password 2",
              url: "/forgot-password-2",
            },
            {
              title: "Forgot Password 3",
              url: "/forgot-password-3",
            },
            {
              title: "Verify Two Factor",
              url: "/verify-two-factor",
            },
          ],
        },
        {
          title: "Errors",
          url: "#",
          icon: AlertTriangle,
          items: [
            {
              title: "Unauthorized",
              url: "/errors/unauthorized",
            },
            {
              title: "Forbidden",
              url: "/errors/forbidden",
            },
            {
              title: "Not Found",
              url: "/errors/not-found",
            },
            {
              title: "Internal Server Error",
              url: "/errors/internal-server-error",
            },
            {
              title: "Under Maintenance",
              url: "/errors/under-maintenance",
            },
          ],
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings,
          items: [
            {
              title: "User Settings",
              url: "/settings/user",
            },
            {
              title: "Account Settings",
              url: "/settings/account",
            },
            {
              title: "Plans & Billing",
              url: "/settings/billing",
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
            },
            {
              title: "Connections",
              url: "/settings/connections",
            },
          ],
        },
        {
          title: "FAQs",
          url: "/faqs",
          icon: HelpCircle,
        },
        {
          title: "Pricing",
          url: "/pricing",
          icon: CreditCard,
        },
      ],
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  navGroups?: SidebarNavGroup[];
  onLogout?: () => void | Promise<void>;
  homeUrl?: string;
  brandSubtitle?: string;
  userMenuLabels?: React.ComponentProps<typeof NavUser>["labels"];
  direction?: "ltr" | "rtl";
}

export function AppSidebar({
  user = defaultSidebarData.user,
  navGroups = defaultSidebarData.navGroups,
  onLogout,
  homeUrl = "/",
  brandSubtitle = "Admin Dashboard",
  userMenuLabels,
  direction = "ltr",
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={homeUrl}>
                {/* Use explicit sizing classes so the image always has layout space */}
                <div className="flex min-h-[var(--ctrl-h)] min-w-[var(--ctrl-h)] items-center justify-center rounded-lg">
                  {/*
                    Compute a base-aware logo path at runtime so the image resolves when the
                    app is mounted under a base path (for example: /admin/ota-tickets.png).
                  */}
                  <BrandLogo
                    size={100}
                    className="text-current"
                    src={(() => {
                      try {
                        if (typeof window === "undefined") return "/ota-tickets.png";
                        const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
                        // If there's a top-level path (e.g. 'admin'), prefer that prefix
                        return firstSegment ? `/${firstSegment}/ota-tickets.png` : "/ota-tickets.png";
                      } catch {
                        return "/ota-tickets.png";
                      }
                    })()}
                  />
                </div>
                <div className="grid flex-1 text-start admin-text-body leading-tight">
                  <span className="truncate admin-text-label">{user.name}</span>
                  <span className="truncate admin-text-caption">{brandSubtitle}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavMain
            key={group.label}
            label={group.label}
            items={group.items}
            direction={direction}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* <SidebarNotification /> */}
        <NavUser
          user={user}
          onLogout={onLogout}
          labels={userMenuLabels}
          direction={direction}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
