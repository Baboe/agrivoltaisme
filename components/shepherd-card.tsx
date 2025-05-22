import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin } from "lucide-react"

interface ShepherdCardProps {
  name: string
  location: string
  flockSize: number
  breed: string
  experience: number
  description: string
  verified: boolean
}

export default function ShepherdCard({
  name,
  location,
  flockSize,
  breed,
  experience,
  description,
  verified,
}: ShepherdCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:border-green-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{name}</CardTitle>
          {verified && (
            <Badge className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-3 w-3 mr-1" /> Verified
            </Badge>
          )}
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1" /> {location}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="font-medium text-gray-700">Flock Size</p>
              <p>{flockSize} sheep</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Breed</p>
              <p>{breed}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Experience</p>
              <p>{experience} years</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm">{description}</p>

          <Button className="w-full bg-green-600 hover:bg-green-700">Contact</Button>
        </div>
      </CardContent>
    </Card>
  )
}
