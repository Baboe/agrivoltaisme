import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface SolarFarmCardProps {
  name: string
  location: string
  size: number
  vegetationType: string
  description: string
}

export default function SolarFarmCard({ name, location, size, vegetationType, description }: SolarFarmCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:border-green-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1" /> {location}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-medium text-gray-700">Size</p>
              <p>{size} hectares</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Vegetation</p>
              <p>{vegetationType}</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm">{description}</p>

          <Button className="w-full bg-green-600 hover:bg-green-700">Contact</Button>
        </div>
      </CardContent>
    </Card>
  )
}
