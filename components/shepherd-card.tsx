import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import Link from "next/link"

interface ShepherdCardProps {
  name: string
  location: string
  flockSize: number
  breed: string
  grazingType: string
  description: string
  country: string
}

export default function ShepherdCard({ name, location, flockSize, breed, grazingType, description, country }: ShepherdCardProps) {
  return (
    <Card className="surface-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200">
      <CardHeader className="p-7 pb-3">
        <span className="inline-flex w-fit rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Grazing partner
        </span>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="flex items-center text-sm text-slate-500">
          <MapPin className="h-4 w-4 mr-1" /> {location}
        </div>
      </CardHeader>
      <CardContent className="p-7 pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl bg-stone-50 p-3">
              <p className="font-medium text-slate-700">Flock Size</p>
              <p>{flockSize} sheep</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-3">
              <p className="font-medium text-slate-700">Breed</p>
              <p>{breed}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-3">
              <p className="font-medium text-slate-700">Grazing Type</p>
              <p>{grazingType}</p>
            </div>
          </div>

          <p className="text-sm leading-7 text-slate-600">{description}</p>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Public directory record</p>

          <Button className="w-full rounded-full bg-emerald-800 text-white hover:bg-emerald-700" asChild>
            <Link href={`/sheepfarms/${country.toLowerCase()}/${encodeURIComponent(name)}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
