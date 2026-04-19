"use client"

import { SunLight, HalfMoon } from "iconoir-react"
import { useTheme } from "./theme-provider"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs transition-colors",
        "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <SunLight className="size-3.5 shrink-0" />
      ) : (
        <HalfMoon className="size-3.5 shrink-0" />
      )}
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  )
}
