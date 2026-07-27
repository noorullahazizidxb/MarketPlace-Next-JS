"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command as CommandPrimitive } from "cmdk";
import {
  Search,
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
  User,
  Bell,
  Link2,
  Palette,
} from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "../atoms/shadcn/dialog";
import { cn } from "../lib/cn";
import type { SidebarNavGroup } from "../organisms/app-sidebar";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-xl bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Input
    ref={ref}
    className={cn(
      "flex min-h-[var(--ctrl-h)] w-full border-none bg-transparent px-4 py-3 text-[17px] outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 mb-4",
      className,
    )}
    {...props}
  />
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-[400px] overflow-y-auto overflow-x-hidden pb-2",
      className,
    )}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="flex min-h-[var(--ctrl-h)] items-center justify-center admin-text-body text-zinc-500 dark:text-zinc-400"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden px-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:admin-text-caption [&_[cmdk-group-heading]]:admin-text-label [&_[cmdk-group-heading]]:text-zinc-500 dark:[&_[cmdk-group-heading]]:text-zinc-400 [&:not(:first-child)]:mt-2",
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex min-h-[var(--ctrl-h)] cursor-pointer select-none items-center gap-2 rounded-lg px-4 admin-text-body text-zinc-700 dark:text-zinc-300 outline-none transition-colors data-[disabled=true]:pointer-events-none data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-900 dark:data-[selected=true]:text-zinc-100 data-[disabled=true]:opacity-50 [&+[cmdk-item]]:mt-1",
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

interface SearchItem {
  id: string;
  title: string;
  url: string;
  group: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface CommandSearchLabels {
  dialogTitle: string;
  placeholder: string;
  empty: string;
  trigger: string;
  groups: {
    dashboards: string;
    apps: string;
    authPages: string;
    errors: string;
    settings: string;
    pages: string;
  };
  items: {
    dashboard1: string;
    dashboard2: string;
    mail: string;
    tasks: string;
    chat: string;
    calendar: string;
    signIn1: string;
    signIn2: string;
    signUp1: string;
    signUp2: string;
    forgotPassword1: string;
    forgotPassword2: string;
    unauthorized: string;
    forbidden: string;
    notFound: string;
    internalServerError: string;
    underMaintenance: string;
    userSettings: string;
    accountSettings: string;
    billing: string;
    appearance: string;
    notifications: string;
    connections: string;
    faqs: string;
    pricing: string;
  };
}

const defaultLabels: CommandSearchLabels = {
  dialogTitle: "Command Search",
  placeholder: "What do you need?",
  empty: "No results found.",
  trigger: "Search...",
  groups: {
    dashboards: "Dashboards",
    apps: "Apps",
    authPages: "Auth Pages",
    errors: "Errors",
    settings: "Settings",
    pages: "Pages",
  },
  items: {
    dashboard1: "Dashboard 1",
    dashboard2: "Dashboard 2",
    mail: "Mail",
    tasks: "Tasks",
    chat: "Chat",
    calendar: "Calendar",
    signIn1: "Sign In 1",
    signIn2: "Sign In 2",
    signUp1: "Sign Up 1",
    signUp2: "Sign Up 2",
    forgotPassword1: "Forgot Password 1",
    forgotPassword2: "Forgot Password 2",
    unauthorized: "Unauthorized",
    forbidden: "Forbidden",
    notFound: "Not Found",
    internalServerError: "Internal Server Error",
    underMaintenance: "Under Maintenance",
    userSettings: "User Settings",
    accountSettings: "Account Settings",
    billing: "Plans & Billing",
    appearance: "Appearance",
    notifications: "Notifications",
    connections: "Connections",
    faqs: "FAQs",
    pricing: "Pricing",
  },
};

function isNavigableUrl(url: string | undefined): url is string {
  const trimmed = url?.trim() ?? "";
  return Boolean(trimmed) && trimmed !== "#";
}

function flattenNavGroupsToSearchItems(
  navGroups: SidebarNavGroup[],
): SearchItem[] {
  const items: SearchItem[] = [];
  const seen = new Set<string>();

  for (const group of navGroups) {
    for (const item of group.items) {
      const children = item.items ?? [];
      if (children.length > 0) {
        for (const child of children) {
          if (!isNavigableUrl(child.url)) continue;
          const key = `${child.url}::${child.title}`;
          if (seen.has(key)) continue;
          seen.add(key);
          items.push({
            id: key,
            title: child.title,
            url: child.url,
            group: group.label,
            icon: child.icon ?? item.icon,
          });
        }
        continue;
      }

      if (!isNavigableUrl(item.url)) continue;
      const key = `${item.url}::${item.title}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        id: key,
        title: item.title,
        url: item.url,
        group: group.label,
        icon: item.icon,
      });
    }
  }

  return items;
}

function buildFallbackSearchItems(labels: CommandSearchLabels): SearchItem[] {
  return [
    {
      id: "dashboard1",
      title: labels.items.dashboard1,
      url: "/dashboard",
      group: labels.groups.dashboards,
      icon: LayoutDashboard,
    },
    {
      id: "dashboard2",
      title: labels.items.dashboard2,
      url: "/dashboard-2",
      group: labels.groups.dashboards,
      icon: LayoutPanelLeft,
    },
    { id: "mail", title: labels.items.mail, url: "/mail", group: labels.groups.apps, icon: Mail },
    { id: "tasks", title: labels.items.tasks, url: "/tasks", group: labels.groups.apps, icon: CheckSquare },
    { id: "chat", title: labels.items.chat, url: "/chat", group: labels.groups.apps, icon: MessageCircle },
    { id: "calendar", title: labels.items.calendar, url: "/calendar", group: labels.groups.apps, icon: Calendar },
    {
      id: "signIn1",
      title: labels.items.signIn1,
      url: "/auth/sign-in",
      group: labels.groups.authPages,
      icon: Shield,
    },
    {
      id: "signIn2",
      title: labels.items.signIn2,
      url: "/auth/sign-in-2",
      group: labels.groups.authPages,
      icon: Shield,
    },
    {
      id: "signUp1",
      title: labels.items.signUp1,
      url: "/auth/sign-up",
      group: labels.groups.authPages,
      icon: Shield,
    },
    {
      id: "signUp2",
      title: labels.items.signUp2,
      url: "/auth/sign-up-2",
      group: labels.groups.authPages,
      icon: Shield,
    },
    {
      id: "forgotPassword1",
      title: labels.items.forgotPassword1,
      url: "/auth/forgot-password",
      group: labels.groups.authPages,
      icon: Shield,
    },
    {
      id: "forgotPassword2",
      title: labels.items.forgotPassword2,
      url: "/auth/forgot-password-2",
      group: labels.groups.authPages,
      icon: Shield,
    },
    {
      id: "unauthorized",
      title: labels.items.unauthorized,
      url: "/errors/unauthorized",
      group: labels.groups.errors,
      icon: AlertTriangle,
    },
    {
      id: "forbidden",
      title: labels.items.forbidden,
      url: "/errors/forbidden",
      group: labels.groups.errors,
      icon: AlertTriangle,
    },
    {
      id: "notFound",
      title: labels.items.notFound,
      url: "/errors/not-found",
      group: labels.groups.errors,
      icon: AlertTriangle,
    },
    {
      id: "internalServerError",
      title: labels.items.internalServerError,
      url: "/errors/internal-server-error",
      group: labels.groups.errors,
      icon: AlertTriangle,
    },
    {
      id: "underMaintenance",
      title: labels.items.underMaintenance,
      url: "/errors/under-maintenance",
      group: labels.groups.errors,
      icon: AlertTriangle,
    },
    {
      id: "userSettings",
      title: labels.items.userSettings,
      url: "/settings/user",
      group: labels.groups.settings,
      icon: User,
    },
    {
      id: "accountSettings",
      title: labels.items.accountSettings,
      url: "/settings/account",
      group: labels.groups.settings,
      icon: Settings,
    },
    {
      id: "billing",
      title: labels.items.billing,
      url: "/settings/billing",
      group: labels.groups.settings,
      icon: CreditCard,
    },
    {
      id: "appearance",
      title: labels.items.appearance,
      url: "/settings/appearance",
      group: labels.groups.settings,
      icon: Palette,
    },
    {
      id: "notifications",
      title: labels.items.notifications,
      url: "/settings/notifications",
      group: labels.groups.settings,
      icon: Bell,
    },
    {
      id: "connections",
      title: labels.items.connections,
      url: "/settings/connections",
      group: labels.groups.settings,
      icon: Link2,
    },
    { id: "faqs", title: labels.items.faqs, url: "/faqs", group: labels.groups.pages, icon: HelpCircle },
    { id: "pricing", title: labels.items.pricing, url: "/pricing", group: labels.groups.pages, icon: CreditCard },
  ];
}

interface CommandSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels?: CommandSearchLabels;
  /** When provided, search lists only navigable links from the live sidebar. */
  navGroups?: SidebarNavGroup[];
}

export function CommandSearch({
  open,
  onOpenChange,
  labels = defaultLabels,
  navGroups,
}: CommandSearchProps) {
  const router = useRouter();
  const commandRef = React.useRef<HTMLDivElement | null>(null);

  const searchItems = React.useMemo(() => {
    if (navGroups && navGroups.length > 0) {
      return flattenNavGroupsToSearchItems(navGroups);
    }
    return buildFallbackSearchItems(labels);
  }, [navGroups, labels]);

  const groupedItems = searchItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group]!.push(item);
      return acc;
    },
    {} as Record<string, SearchItem[]>,
  );

  const handleSelect = (url: string) => {
    router.push(url);
    onOpenChange(false);
    // Bounce effect like Vercel
    if (commandRef.current) {
      commandRef.current.style.transform = "scale(0.96)";
      setTimeout(() => {
        if (commandRef.current) {
          commandRef.current.style.transform = "";
        }
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-[640px]">
        <DialogTitle className="sr-only">{labels.dialogTitle}</DialogTitle>
        <Command
          ref={commandRef as any}
          className="transition-transform duration-100 ease-out"
        >
          <CommandInput placeholder={labels.placeholder} autoFocus />
          <CommandList>
            <CommandEmpty>{labels.empty}</CommandEmpty>
            {Object.entries(groupedItems).map(([group, items]) => (
              <CommandGroup key={group} heading={group}>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.title} ${item.url}`}
                      onSelect={() => handleSelect(item.url)}
                    >
                      {Icon && <Icon className="mr-2 admin-icon-sm" />}
                      {item.title}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function SearchTrigger({
  onClick,
  label = defaultLabels.trigger,
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      data-slot="search-trigger"
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-md admin-text-body transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground min-h-[var(--ctrl-h-sm)] px-3 py-1 relative w-full justify-start text-muted-foreground sm:pr-12 md:w-36 lg:w-56"
    >
      <Search className="admin-icon-xs shrink-0" />
      <span className="hidden lg:inline-flex">{label}</span>
      <span className="inline-flex lg:hidden">{label}</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono admin-text-label opacity-100 sm:flex">
        <span className="admin-text-caption">⌘</span>K
      </kbd>
    </button>
  );
}
