import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
}

export default function TestimonialCard({ name, role, quote }: TestimonialCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 rounded-full p-2 mr-4">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-bold">{name}</h4>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
        <p className="italic text-gray-700">"{quote}"</p>
      </CardContent>
    </Card>
  )
}
