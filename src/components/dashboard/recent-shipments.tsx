import {
  IconCircleCheck,
  IconCircleDotted,
  IconAlertHexagon,
  IconTruck,
} from "@tabler/icons-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Shipment = {
  id: string
  document: string
  client: string
  status: string
  date: string
}

const SHIPMENTS: Shipment[] = [
  {
    id: "SHP-001",
    document: "Invoice #2024-0091",
    client: "Airbus SE",
    status: "Cleared",
    date: "Mar 28, 2026",
  },
  {
    id: "SHP-002",
    document: "B/L 887-TXL-09",
    client: "BASF Group",
    status: "Pending Review",
    date: "Mar 27, 2026",
  },
  {
    id: "SHP-003",
    document: "Invoice #2024-0088",
    client: "Thyssenkrupp",
    status: "CBAM Flagged",
    date: "Mar 26, 2026",
  },
  {
    id: "SHP-004",
    document: "AWB 724-19220541",
    client: "Siemens AG",
    status: "In Transit",
    date: "Mar 25, 2026",
  },
  {
    id: "SHP-005",
    document: "Invoice #2024-0085",
    client: "LVMH Group",
    status: "Cleared",
    date: "Mar 24, 2026",
  },
  {
    id: "SHP-006",
    document: "B/L 902-CDG-44",
    client: "Schneider Electric",
    status: "CBAM Flagged",
    date: "Mar 22, 2026",
  },
  {
    id: "SHP-007",
    document: "Invoice #2024-0082",
    client: "ArcelorMittal",
    status: "Pending Review",
    date: "Mar 21, 2026",
  },
]

type StatusConfig = {
  icon: React.ComponentType<{ size?: number; stroke?: number }>
  color: string
  bg: string
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  Cleared: {
    icon: IconCircleCheck,
    color: "#34d39980",
    bg: "#34d3990d",
  },
  "Pending Review": {
    icon: IconCircleDotted,
    color: "#fbbf2480",
    bg: "#fbbf240d",
  },
  "CBAM Flagged": {
    icon: IconAlertHexagon,
    color: "#FF70B580",
    bg: "#FF70B50d",
  },
  "In Transit": {
    icon: IconTruck,
    color: "#60a5fa80",
    bg: "#60a5fa0d",
  },
}

function StatusCell({ status }: { status: string }) {
  const config = STATUS_CONFIG[status]
  if (!config) return <span className="text-xs text-muted-foreground">{status}</span>
  const Icon = config.icon

  return (
    <span
      className="inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      <Icon size={11} stroke={2} />
      {status}
    </span>
  )
}

export type ShipmentRow = Shipment

export function RecentShipments({ extraRow }: { extraRow?: Shipment }) {
  const rows = extraRow ? [extraRow, ...SHIPMENTS] : SHIPMENTS
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Recent Shipments
        </h2>
        <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
          View all
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl ring-1 ring-foreground/10 sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="h-8 px-4 text-xs font-medium text-muted-foreground">
                Document
              </TableHead>
              <TableHead className="h-8 px-4 text-xs font-medium text-muted-foreground">
                Client
              </TableHead>
              <TableHead className="h-8 px-4 text-xs font-medium text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="h-8 px-4 text-right text-xs font-medium text-muted-foreground">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="px-4 py-2.5 text-xs font-medium text-foreground">
                  {shipment.document}
                </TableCell>
                <TableCell className="px-4 py-2.5 text-xs text-muted-foreground">
                  {shipment.client}
                </TableCell>
                <TableCell className="pl-2 pr-4 py-2.5">
                  <StatusCell status={shipment.status} />
                </TableCell>
                <TableCell className="px-4 py-2.5 text-right text-xs tabular-nums text-muted-foreground">
                  {shipment.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl ring-1 ring-foreground/10 sm:hidden">
        {rows.map((shipment) => (
          <div key={shipment.id} className="flex items-center justify-between gap-3 px-3.5 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{shipment.document}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{shipment.client} · {shipment.date}</p>
            </div>
            <StatusCell status={shipment.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
