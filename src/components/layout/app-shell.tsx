"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeSimple,
  Package,
  Hashtag,
  ShieldCheck,
  Settings,
} from "iconoir-react"

import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: HomeSimple, disabled: false },
  { label: "Shipments", href: "/shipments", icon: Package, disabled: true },
  { label: "HS Classifier", href: "/hs-classifier", icon: Hashtag, disabled: true },
  { label: "CBAM Check", href: "/cbam-check", icon: ShieldCheck, disabled: true },
]

const BOTTOM_NAV_ITEMS = [
  { label: "Settings", href: "/settings", icon: Settings, disabled: true },
]

function NavItem({
  href,
  label,
  icon: Icon,
  disabled = false,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  disabled?: boolean
}) {
  const pathname = usePathname()
  const active = pathname === href

  if (disabled) {
    return (
      <span
        className="flex cursor-not-allowed items-center gap-2.5 rounded-md px-2.5 py-2 text-xs opacity-50 text-muted-foreground select-none"
      >
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
        {label}
      </span>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs transition-colors",
        active
          ? "bg-black/6 dark:bg-white/8 text-foreground font-medium"
          : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
      )}
    >
      <Icon
        className={cn(
          "size-3.5 shrink-0",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      />
      {label}
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background md:flex-row">
      {/* Mobile header — visible only on small screens */}
      <header className="flex shrink-0 items-center border-b border-border px-4 py-3 md:hidden">
        <Image
          src="/images/brand/verdyct-transparent-bg.svg"
          alt="Verdyct"
          width={26}
          height={26}
          priority
        />
      </header>

      {/* Sidebar — desktop only */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        {/* Logo */}
        <div className="flex items-center px-4 pt-5 pb-4">
          <Image
            src="/images/brand/verdyct-transparent-bg.svg"
            alt="Verdyct"
            width={32}
            height={32}
            priority
          />
        </div>

        {/* Primary nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} disabled={item.disabled} />
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 pb-4 flex flex-col gap-0.5">
          <ThemeToggle />
          {BOTTOM_NAV_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} disabled={item.disabled} />
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
