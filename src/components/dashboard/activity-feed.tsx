export type ActivityItem = {
  id: string
  type: "cleared" | "flagged" | "uploaded" | "review" | "transit" | "assigned"
  message: string
  detail: string
  time: string
}

const ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    type: "cleared",
    message: "Invoice #2024-0091 cleared",
    detail: "Airbus SE · SHP-001",
    time: "2h ago",
  },
  {
    id: "2",
    type: "flagged",
    message: "CBAM flag raised on B/L 887-TXL-09",
    detail: "BASF Group · SHP-002",
    time: "4h ago",
  },
  {
    id: "3",
    type: "uploaded",
    message: "AWB 724-19220541 uploaded",
    detail: "Siemens AG · SHP-004",
    time: "6h ago",
  },
  {
    id: "4",
    type: "review",
    message: "Invoice #2024-0088 sent for review",
    detail: "Thyssenkrupp · SHP-003",
    time: "Yesterday",
  },
  {
    id: "5",
    type: "cleared",
    message: "Invoice #2024-0085 cleared",
    detail: "LVMH Group · SHP-005",
    time: "Yesterday",
  },
  {
    id: "6",
    type: "flagged",
    message: "CBAM flag raised on B/L 902-CDG-44",
    detail: "Schneider Electric · SHP-006",
    time: "2 days ago",
  },
]

// Colours exactly match the status badge hex values used in the table
const DOT_CONFIG: Record<ActivityItem["type"], { color: string; label: string }> = {
  cleared:  { color: "#34d399", label: "Cleared" },
  flagged:  { color: "#FF70B5", label: "CBAM Flagged" },
  uploaded: { color: "#94a3b8", label: "Document uploaded" },
  review:   { color: "#fbbf24", label: "Pending Review" },
  transit:  { color: "#60a5fa", label: "In Transit" },
  assigned: { color: "#a78bfa", label: "Assigned" },
}

export function ActivityFeed({ extraItems = [] }: { extraItems?: ActivityItem[] }) {
  const items = [...extraItems, ...ACTIVITY]

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Activity
        </h2>
        <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
          View all
        </button>
      </div>

      <div className="flex flex-col">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const dot = DOT_CONFIG[item.type]
          return (
            <div key={item.id} className="flex gap-3">
              {/* Timeline column: dot + connector */}
              <div className="flex w-4 flex-col items-center">
                <div
                  title={dot.label}
                  style={{ backgroundColor: dot.color }}
                  className="mt-[13px] size-2 shrink-0 cursor-default rounded-full ring-2 ring-background"
                />
                {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>

              {/* Content */}
              <div className="flex min-w-0 flex-1 items-start justify-between gap-4 pb-4">
                <div className="min-w-0">
                  <p className="truncate text-xs text-foreground">{item.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {item.time}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
