"use client"

import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { useCallback, useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "@repo/hooks/motion"
import { cn } from "../lib/cn"

import {
  Collapsible,
  CollapsibleTrigger,
} from "../atoms/shadcn/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../atoms/shadcn/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubContent,
  SidebarMenuSubItem,
  useSidebar,
} from "../atoms/shadcn/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../atoms/shadcn/tooltip"

type MotionDivProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode
  variants?: Record<string, unknown>
  initial?: string | false
  animate?: string
  exit?: string
}

const MotionDiv = motion.div as unknown as (props: MotionDivProps) => ReactNode

export function NavMain({
  label,
  items,
  direction = "ltr",
  forceExpanded,
}: {
  label: string
  items: {
    title: string
    url: string
    icon?: React.ComponentType<{ className?: string }>
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive?: boolean
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  direction?: "ltr" | "rtl"
  /** Force the expanded (inline submenu) UI even when the sidebar is collapsed (icon mode). */
  forceExpanded?: boolean
}) {
  const pathname = usePathname()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const isCollapsed = !forceExpanded && state === "collapsed"
  const [openFlyoutTitle, setOpenFlyoutTitle] = useState<string | null>(null)
  const flyoutSide = direction === "rtl" ? "left" : "right"
  const flyoutOffset = direction === "rtl" ? 8 : -8

  // Determine if an item's route or its children are active
  const shouldBeOpen = useCallback(
    (item: typeof items[0]) => {
      if (item.isActive) return true
      return item.items?.some((subItem) => pathname === subItem.url) || false
    },
    [pathname],
  )

  // Controlled open/closed state per item for smooth animated collapsibles
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  // Sync openItems whenever items change: initialise missing entries so every
  // collapsible has a defined (controlled) value from the start.  This handles
  // items that arrive asynchronously (e.g. Application Menu loaded from API).
  useEffect(() => {
    setOpenItems((prev) => {
      const next = { ...prev }
      let changed = false
      for (const item of items) {
        if (item.items?.length && !(item.title in prev)) {
          // Seed: open if the current path is inside this group, else closed.
          next[item.title] = shouldBeOpen(item)
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [items, shouldBeOpen])

  // Re-open a group when navigating into one of its children
  useEffect(() => {
    setOpenItems((prev) => {
      const next = { ...prev }
      let changed = false
      for (const item of items) {
        if (item.items?.length && shouldBeOpen(item) && !prev[item.title]) {
          next[item.title] = true
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [pathname, items, shouldBeOpen])

  const toggleItem = useCallback((title: string) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }))
  }, [])

  const setItemOpen = useCallback((title: string, open: boolean) => {
    setOpenItems((prev) => ({ ...prev, [title]: open }))
  }, [])

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false)
  }

  useEffect(() => {
    if (!isCollapsed) {
      setOpenFlyoutTitle(null)
    }
  }, [isCollapsed])

  const flyoutVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.96,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.03,
        delayChildren: 0.04,
      },
    },
    exit: {
      opacity: 0,
      y: -6,
      scale: 0.98,
      filter: "blur(2px)",
      transition: {
        duration: 0.12,
        ease: [0.4, 0, 1, 1],
      },
    },
  }

  const flyoutItemVariants = {
    hidden: {
      opacity: 0,
      x: flyoutOffset,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.16,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      x: direction === "rtl" ? 4 : -4,
      transition: {
        duration: 0.08,
      },
    },
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={item.items?.length ? !!openItems[item.title] : undefined}
            onOpenChange={
              item.items?.length
                ? (open) => setItemOpen(item.title, open)
                : undefined
            }
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                isCollapsed ? (
                  // Icon mode: dropdown flyout with all subitems + tooltip on trigger
                  <DropdownMenu
                    open={openFlyoutTitle === item.title}
                    onOpenChange={(open) => {
                      setOpenFlyoutTitle(open ? item.title : null)
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton className="cursor-pointer">
                            {item.icon ? <item.icon className="app-icon-sm" /> : null}
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side={flyoutSide} align="center">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent
                      forceMount
                      side={flyoutSide}
                      align="start"
                      sideOffset={10}
                      className="!animate-none !border-0 !bg-transparent !p-0 !shadow-none !overflow-visible"
                    >
                      <AnimatePresence initial={false} mode="wait">
                        {openFlyoutTitle === item.title ? (
                          <MotionDiv
                            key={item.title}
                            variants={flyoutVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="min-w-52 rounded-xl border border-border/70 bg-popover p-2 shadow-xl shadow-black/5 backdrop-blur-sm"
                          >
                            <div className="mb-1 px-2 pt-1 app-typo-eyebrow uppercase tracking-[0.2em] text-muted-foreground">
                              {item.title}
                            </div>
                            <div className="mb-1 h-px bg-border/60" />
                            <div className="flex flex-col gap-0.5">
                              {item.items?.map((subItem) => (
                                <MotionDiv
                                  key={subItem.title}
                                  variants={flyoutItemVariants}
                                >
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <DropdownMenuItem
                                        asChild
                                        className={
                                          pathname === subItem.url
                                            ? "app-text-heading-sm text-primary focus:text-primary"
                                            : ""
                                        }
                                      >
                                        <Link href={subItem.url} onClick={closeMobileSidebar}>
                                          {subItem.icon ? <subItem.icon className="me-2 app-icon-xs" /> : null}
                                          {subItem.title}
                                        </Link>
                                      </DropdownMenuItem>
                                    </TooltipTrigger>
                                    <TooltipContent side={flyoutSide}>
                                      {subItem.title}
                                    </TooltipContent>
                                  </Tooltip>
                                </MotionDiv>
                              ))}
                            </div>
                          </MotionDiv>
                        ) : null}
                      </AnimatePresence>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Expanded mode: collapsible inline submenu with Framer Motion animation
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="cursor-pointer"
                      >
                        {item.icon ? <item.icon className="app-icon-sm" /> : null}
                        <span>{item.title}</span>
                        <ChevronRight
                          className={cn(
                            "ms-auto transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            openItems[item.title]
                              ? "rotate-90"
                              : direction === "rtl"
                                ? "rotate-180"
                                : "rotate-0",
                          )}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <SidebarMenuSubContent isOpen={!!openItems[item.title]}>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  className="cursor-pointer font-normal hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent data-[active=true]:app-text-heading-sm data-[active=true]:text-primary"
                                  isActive={pathname === subItem.url}
                                >
                                  <Link
                                    href={subItem.url}
                                    onClick={closeMobileSidebar}
                                    target={
                                      item.title === "Auth Pages" || item.title === "Errors"
                                        ? "_blank"
                                        : undefined
                                    }
                                    rel={
                                      item.title === "Auth Pages" || item.title === "Errors"
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                  >
                                    {subItem.icon ? (
                                      <subItem.icon className="app-icon-xs" />
                                    ) : null}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                    </SidebarMenuSubContent>
                  </>
                )
              ) : (
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="cursor-pointer"
                  isActive={pathname === item.url}
                >
                  <Link href={item.url} onClick={closeMobileSidebar}>
                    {item.icon ? <item.icon className="app-icon-sm" /> : null}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
