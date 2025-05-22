import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CountryCardProps {
  country: string
  imageUrl: string
  description: string
}

export default function CountryCard({ country, imageUrl, description }: CountryCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`Solar grazing in ${country}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{country === "Holland" ? "Netherlands" : country}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6">
        <Link
          href={`/regions/${country.toLowerCase()}`}
          className="text-green-600 font-medium flex items-center hover:underline"
        >
          View Region <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}
