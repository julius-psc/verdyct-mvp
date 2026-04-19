"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "dark",
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored === "dark" || stored === "light") {
      setThemeState(stored)
    } else {
      setThemeState("system")
    }
  }, [])

  useEffect(() => {
    const applyTheme = (t: Theme) => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const isDark = t === "dark" || (t === "system" && systemDark)
      const resolved = isDark ? "dark" : "light"
      setResolvedTheme(resolved)
      document.documentElement.classList.toggle("dark", isDark)
    }

    applyTheme(theme)

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = () => applyTheme("system")
      mq.addEventListener("change", handler)
      return () => mq.removeEventListener("change", handler)
    }
  }, [theme])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    if (t === "system") {
      localStorage.removeItem("theme")
    } else {
      localStorage.setItem("theme", t)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
