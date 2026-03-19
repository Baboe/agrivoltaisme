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
  country: string
}

export default function SolarFarmCard({ name, location, size, vegetationType, description, country }: SolarFarmCardProps) {
  return (
    <Card className="surface-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200">
      <CardHeader className="p-7 pb-3">
        <span className="inline-flex w-fit rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Solar park
        </span>
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

          <Button className="w-full rounded-full bg-emerald-800 text-white hover:bg-emerald-700" asChild>
            <Link href={`/solarparks/${country.toLowerCase()}/${encodeURIComponent(name)}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
