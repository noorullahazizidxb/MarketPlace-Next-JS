"use client"

import {
  CreditCard,
  EllipsisVertical,
  LogOut,
  BellDot,
  CircleUser,
} from "lucide-react"
import Link from "next/link"

import { Logo } from "../atoms/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../atoms/shadcn/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../atoms/shadcn/sidebar"

export function NavUser({
  user,
  onLogout,
  labels,
  direction = "ltr",
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  onLogout?: () => void | Promise<void>
  labels?: {
    account: string
    billing: string
    notifications: string
    signOutSecurely: string
    logOut: string
  }
  direction?: "ltr" | "rtl"
}) {
  const { isMobile } = useSidebar()
  const resolvedLabels = labels ?? {
    account: "Account",
    billing: "Billing",
    notifications: "Notifications",
    signOutSecurely: "Sign out securely",
    logOut: "Log out",
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="flex min-h-[var(--ctrl-h-sm)] min-w-[var(--ctrl-h-sm)] items-center justify-center rounded-lg">
                < Logo size={28} />
              </div>
              <div className="grid flex-1 text-start app-text-body leading-tight">
                <span className="truncate app-text-label">{user.name}</span>
                <span className="text-muted-foreground truncate app-text-caption">
                  {user.email}
                </span>
              </div>
              <EllipsisVertical className="ms-auto app-icon-sm" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : direction === "rtl" ? "left" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start app-text-body">
                <div className="min-h-[var(--ctrl-h-sm)] w-8 rounded-lg">
                  < Logo size={28} />
                </div>
                <div className="grid flex-1 text-start app-text-body leading-tight">
                  <span className="truncate app-text-label">{user.name}</span>
                  <span className="text-muted-foreground truncate app-text-caption">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings/account">
                  <CircleUser />
                  {resolvedLabels.account}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings/billing">
                  <CreditCard />
                  {resolvedLabels.billing}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings/notifications">
                  <BellDot />
                  {resolvedLabels.notifications}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {onLogout ? (
              <DropdownMenuItem
                className="cursor-pointer"
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault()
                  void onLogout()
                }}
              >
                <LogOut />
                {resolvedLabels.signOutSecurely}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/sign-in">
                  <LogOut />
                  {resolvedLabels.logOut}
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
