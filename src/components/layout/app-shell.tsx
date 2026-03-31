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

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: HomeSimple },
  { label: "Shipments", href: "/shipments", icon: Package },
  { label: "HS Classifier", href: "/hs-classifier", icon: Hashtag },
  { label: "CBAM Check", href: "/cbam-check", icon: ShieldCheck },
]

const BOTTOM_NAV_ITEMS = [
  { label: "Settings", href: "/settings", icon: Settings },
]

function NavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs transition-colors",
        active
          ? "bg-white/8 text-foreground font-medium"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex w-52 shrink-0 flex-col border-r border-border bg-sidebar">
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
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 pb-4">
          {BOTTOM_NAV_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
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
