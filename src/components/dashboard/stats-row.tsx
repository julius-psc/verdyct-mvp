import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const STATS = [
  {
    label: "Total Shipments",
    value: "1,284",
    delta: "+12 this month",
  },
  {
    label: "Pending Review",
    value: "23",
    delta: "4 require action",
  },
  {
    label: "CBAM Flagged",
    value: "7",
    delta: "2 new this week",
  },
]

export function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {STATS.map(({ label, value, delta }) => (
        <Card key={label} size="sm" className="shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight text-[#FF70B5]">
              {value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{delta}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
