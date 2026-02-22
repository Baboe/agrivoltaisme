import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CountryCardProps {
  country: string
  imageUrl: string
  description: string
  featured?: boolean
}

export default function CountryCard({ country, imageUrl, description, featured = false }: CountryCardProps) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md group ${featured ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}>
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`Solar grazing in ${country}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-600 text-white hover:bg-green-700">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Most Active
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{country === "Holland" ? "Netherlands" : country}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6">
        <Link
          href={`/${country.toLowerCase()}`}
          className="text-green-600 font-medium flex items-center hover:underline"
        >
          View {country} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}
