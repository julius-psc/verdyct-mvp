"use client"

import { useState, useCallback } from "react"

import { StatsRow } from "@/components/dashboard/stats-row"
import { RecentShipments, type ShipmentRow } from "@/components/dashboard/recent-shipments"
import { ActivityFeed, type ActivityItem } from "@/components/dashboard/activity-feed"
import { Greeting } from "@/components/dashboard/greeting"
import { UploadButton } from "@/components/dashboard/upload-modal"

export default function DashboardPage() {
  const [newActivity, setNewActivity] = useState<ActivityItem | null>(null)
  const [newShipment, setNewShipment] = useState<ShipmentRow | null>(null)

  const handleUploadSuccess = useCallback(
    (activity: ActivityItem, shipment: ShipmentRow) => {
      setNewActivity(activity)
      setNewShipment(shipment)
    },
    []
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Greeting />
        <UploadButton onSuccess={handleUploadSuccess} />
      </div>

      <StatsRow />
      <RecentShipments extraRow={newShipment ?? undefined} />
      <ActivityFeed extraItems={newActivity ? [newActivity] : []} />
    </div>
  )
}
