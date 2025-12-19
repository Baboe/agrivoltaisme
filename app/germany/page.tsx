import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Sun, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Solar Grazing in Germany | Solar Parks & Sheep Farms Directory",
  description: "Discover solar parks and sheep farms in Germany. Find shepherds for vegetation management and solar grazing partnerships across German states.",
  alternates: {
    canonical: "https://ombaa.com/germany",
  },
  openGraph: {
    title: "Solar Grazing in Germany | Ombaa Directory",
    description: "Discover solar parks and sheep farms in Germany. Find shepherds for vegetation management and solar grazing partnerships across German states.",
    url: "https://ombaa.com/germany",
    siteName: "Ombaa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Solar Grazing in Germany | Ombaa Directory",
    description: "Discover solar parks and sheep farms in Germany. Find shepherds for vegetation management and solar grazing partnerships across German states.",
  },
};

export default function GermanyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🇩🇪</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Solar Grazing in Germany</h1>
              <p className="text-xl text-green-100">Connecting solar parks with sheep farmers across German states</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Sun className="h-5 w-5 mr-2" />
                  Solar Parks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">1,500+</p>
                <p className="text-green-100">Solar parks seeking shepherds</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2" />
                  Sheep Farms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">2,200+</p>
                <p className="text-green-100">Sheep farms available</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  States
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">16</p>
                <p className="text-green-100">German states covered</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Regional Overview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: "Bayern (Bavaria)", 
                cities: "Munich, Nuremberg, Augsburg, Regensburg", 
                count: "400+ listings",
                description: "Leading solar energy producer in Germany"
              },
              { 
                name: "Baden-Württemberg", 
                cities: "Stuttgart, Mannheim, Karlsruhe, Freiburg", 
                count: "350+ listings",
                description: "Innovation hub for renewable energy"
              },
              { 
                name: "Berlin", 
                cities: "Berlin, Potsdam, Cottbus, Eberswalde", 
                count: "200+ listings",
                description: "Urban center with solar park expansion"
              },
              { 
                name: "Nordrhein-Westfalen", 
                cities: "Cologne, Düsseldorf, Dortmund, Essen", 
                count: "280+ listings",
                description: "Industrial region embracing solar grazing"
              },
              { 
                name: "Niedersachsen", 
                cities: "Hanover, Bremen, Oldenburg, Braunschweig", 
                count: "220+ listings",
                description: "Agricultural state with solar potential"
              },
              { 
                name: "Sachsen", 
                cities: "Dresden, Leipzig, Chemnitz, Zwickau", 
                count: "150+ listings",
                description: "Eastern Germany renewable energy growth"
              },
            ].map((state) => (
              <Card key={state.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{state.name}</CardTitle>
                  <p className="text-sm text-gray-600">{state.description}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{state.cities}</p>
                  <p className="text-sm text-green-600 font-medium mb-4">{state.count}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/directory?country=germany&region=${encodeURIComponent(state.name)}`}>
                      Explore {state.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Solar Parks */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Solar Parks in Germany</h2>
            <Button asChild variant="outline">
              <Link href="/directory?country=germany&listingType=solar-farm">
                View All Solar Parks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Solar Park Weesow-Willmersdorf", size: "187 hectares", region: "Berlin" },
              { name: "Walddrehna Solar Park", size: "120 hectares", region: "Sachsen" },
              { name: "Solar Park Werneuchen Nord", size: "95 hectares", region: "Berlin" },
            ].map((park) => (
              <Card key={park.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{park.name}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Sun className="h-3 w-3 mr-1" />
                      Solar Park
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{park.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-medium">{park.region}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" asChild>
                    <Link href={`/solarparks/germany/${encodeURIComponent(park.name)}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sheep Farms */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Sheep Farms in Germany</h2>
            <Button asChild variant="outline">
              <Link href="/directory?country=germany&listingType=shepherd">
                View All Sheep Farms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Schafhof Werneck", flock: "500 sheep", breed: "Merinoland", region: "Bayern" },
              { name: "Schäferei Bärenbach", flock: "320 sheep", breed: "Rauhwolliges Pommersches", region: "Nordrhein-Westfalen" },
              { name: "Bio-Schafhof Wildberg", flock: "280 sheep", breed: "Schwarzbraunes Bergschaf", region: "Baden-Württemberg" },
            ].map((farm) => (
              <Card key={farm.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{farm.name}</CardTitle>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Users className="h-3 w-3 mr-1" />
                      Sheep Farm
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Flock Size:</span>
                      <span className="font-medium">{farm.flock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Breed:</span>
                      <span className="font-medium">{farm.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-medium">{farm.region}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" asChild>
                    <Link href={`/sheepfarms/germany/${encodeURIComponent(farm.name)}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Solar Grazing Partnership?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join hundreds of solar parks and sheep farms already connected through Ombaa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100" asChild>
              <Link href="/directory?country=germany">Browse Germany Listings</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/directory?country=germany&listingType=solar-farm">Find Solar Parks</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/directory?country=germany&listingType=shepherd">Find Sheep Farms</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Solar Grazing in Germany",
            "description": "Discover solar parks and sheep farms in Germany. Find shepherds for vegetation management and solar grazing partnerships across German states.",
            "url": "https://ombaa.eu/germany",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Ombaa Directory",
              "url": "https://ombaa.com"
            },
            "about": {
              "@type": "Thing",
              "name": "Solar Grazing",
              "description": "Sustainable agriculture practice combining solar energy generation with sheep grazing"
            }
          }),
        }}
      />
    </div>
  );
}