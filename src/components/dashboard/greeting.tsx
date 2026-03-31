"use client"

import { useEffect, useState } from "react"

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function Greeting() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
  }, [])

  if (!now) return null

  return (
    <div>
      <h1 className="text-base font-semibold text-foreground">
        {getGreeting(now.getHours())}, Julius
      </h1>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {formatDate(now)}
      </p>
    </div>
  )
}
