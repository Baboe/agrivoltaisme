import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import Link from "next/link"

interface SolarFarmCardProps {
  name: string
  location: string
  size: number
  vegetationType: string
  description: string
  grazingStatus: string
  country: string
}

const grazingStatusLabels: Record<string, string> = {
  grazing_ready: "Grazing ready",
  actively_grazed: "Actively grazed",
  potentially_compatible: "Potentially compatible",
  not_compatible: "Not compatible",
  proven_case_study: "Proven case",
}

const grazingStatusClasses: Record<string, string> = {
  grazing_ready: "border-emerald-200 bg-emerald-50 text-emerald-900",
  actively_grazed: "border-sky-200 bg-sky-50 text-sky-900",
  potentially_compatible: "border-amber-200 bg-amber-50 text-amber-900",
  not_compatible: "border-rose-200 bg-rose-50 text-rose-900",
  proven_case_study: "border-lime-200 bg-lime-50 text-lime-900",
}

export default function SolarFarmCard({
  name,
  location,
  size,
  vegetationType,
  description,
  grazingStatus,
  country,
}: SolarFarmCardProps) {
  const statusLabel = grazingStatusLabels[grazingStatus] || "Status under review"
  const statusClassName =
    grazingStatusClasses[grazingStatus] || "border-stone-200 bg-stone-50 text-slate-700"

  return (
    <Card className="surface-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200">
      <CardHeader className="p-7 pb-3">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex w-fit rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Solar park
          </span>
          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${statusClassName}`}
          >
            {statusLabel}
          </span>
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="flex items-center text-sm text-slate-500">
          <MapPin className="h-4 w-4 mr-1" /> {location}
        </div>
      </CardHeader>
      <CardContent className="p-7 pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-stone-50 p-3">
              <p className="font-medium text-slate-700">Size</p>
              <p>{size} hectares</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-3">
              <p className="font-medium text-slate-700">Vegetation</p>
              <p>{vegetationType}</p>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-600">{description}</p>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Public directory record</p>

          <Button className="w-full rounded-full bg-emerald-800 text-white hover:bg-emerald-700" asChild>
            <Link href={`/solarparks/${country.toLowerCase()}/${encodeURIComponent(name)}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
