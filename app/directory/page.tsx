import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ShepherdCard from "@/components/shepherd-card"
import SolarFarmCard from "@/components/solar-farm-card"

export default function Directory() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Directory Header */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Solar Grazing Directory</h1>
          <p className="text-xl mb-8">Connect with shepherds and solar farms across Europe</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-gray-100">
              <a href="#shepherds">Find Shepherds</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <a href="#solar-farms">Find Solar Farms</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="py-6 bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="spain">Spain</SelectItem>
                  <SelectItem value="italy">Italy</SelectItem>
                  <SelectItem value="netherlands">Netherlands</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="provence">Provence</SelectItem>
                  <SelectItem value="bavaria">Bavaria</SelectItem>
                  <SelectItem value="andalusia">Andalusia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Listing Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="shepherd">Shepherds</SelectItem>
                  <SelectItem value="solar-farm">Solar Farms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Filter className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Shepherds Directory */}
      <section id="shepherds" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Shepherds Directory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ShepherdCard
              name="Jean Dupont"
              location="Provence, France"
              flockSize={120}
              breed="Merino"
              experience={15}
              description="Specializing in solar grazing since 2018. Available for contracts throughout Provence region."
              verified={true}
            />
            <ShepherdCard
              name="Klaus Schmidt"
              location="Bavaria, Germany"
              flockSize={200}
              breed="Suffolk"
              experience={8}
              description="Experienced in managing vegetation at solar farms. Available for seasonal contracts."
              verified={true}
            />
            <ShepherdCard
              name="Maria Garcia"
              location="Andalusia, Spain"
              flockSize={150}
              breed="Churra"
              experience={12}
              description="Family-run sheep farm with extensive experience in vegetation management. Available year-round."
              verified={true}
            />
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Load More
            </Button>
          </div>
        </div>
      </section>

      {/* Solar Farms Directory */}
      <section id="solar-farms" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Solar Farms Directory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SolarFarmCard
              name="SolarPark Provence"
              location="Aix-en-Provence, France"
              size={45}
              vegetationType="Mixed grass"
              description="Looking for shepherds for seasonal grazing from April to October. Multiple year contract possible."
            />
            <SolarFarmCard
              name="BavariaSolar GmbH"
              location="Munich Region, Germany"
              size={60}
              vegetationType="Native grasses"
              description="Three solar sites seeking grazing services. Year-round maintenance required with flexible scheduling."
            />
            <SolarFarmCard
              name="Energia Solar Andalucía"
              location="Seville, Spain"
              size={35}
              vegetationType="Dry Mediterranean"
              description="Seeking shepherds for vegetation management and fire prevention. Priority given to local flocks."
            />
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Load More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
