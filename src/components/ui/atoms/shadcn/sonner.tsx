"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { useTheme } from "@repo/hooks"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const [resolvedTheme, setResolvedTheme] =
    useState<ToasterProps["theme"]>("light")

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => {
      if (theme === "light" || theme === "dark") {
        setResolvedTheme(theme)
        return
      }

      setResolvedTheme(root.classList.contains("dark") ? "dark" : "light")
    }

    syncTheme()

    const observer = new MutationObserver(syncTheme)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    })

    return () => observer.disconnect()
  }, [theme])

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
