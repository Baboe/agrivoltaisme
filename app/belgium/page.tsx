import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Sun, ArrowRight } from "lucide-react";
import { getCountryStats } from "@/lib/stats-service";
import { getFeaturedSolarParks, getFeaturedSheepFarms, hasEnoughForFeatured } from "@/lib/featured-service";

export const metadata: Metadata = {
  title: "Solar Grazing in Belgium | Solar Parks & Sheep Farms Directory",
  description: "Discover solar parks and sheep farms in Belgium. Find shepherds for vegetation management and solar grazing partnerships across Belgian regions.",
  alternates: {
    canonical: "https://ombaa.com/belgium",
  },
  openGraph: {
    title: "Solar Grazing in Belgium | Ombaa Directory",
    description: "Discover solar parks and sheep farms in Belgium. Find shepherds for vegetation management and solar grazing partnerships across Belgian regions.",
    url: "https://ombaa.com/belgium",
    siteName: "Ombaa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Solar Grazing in Belgium | Ombaa Directory",
    description: "Discover solar parks and sheep farms in Belgium. Find shepherds for vegetation management and solar grazing partnerships across Belgian regions.",
  },
};

export default function BelgiumPage() {
  // Get real stats from data files (server component)
  const stats = getCountryStats('belgium');
  
  // Get real featured listings from data
  const featuredSolarParks = getFeaturedSolarParks('belgium', 3);
  const featuredSheepFarms = getFeaturedSheepFarms('belgium', 3);
  const showFeaturedSolar = hasEnoughForFeatured('belgium', 'solar');
  const showFeaturedSheep = hasEnoughForFeatured('belgium', 'sheep');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🇧🇪</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Solar Grazing in Belgium</h1>
              <p className="text-xl text-green-100">Connecting solar parks with sheep farmers across Belgian regions</p>
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
                <p className="text-2xl font-bold">{stats.solarParks}</p>
                <p className="text-green-100">Solar parks in directory</p>
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
                <p className="text-2xl font-bold">{stats.sheepFarms}</p>
                <p className="text-green-100">Sheep farms in directory</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  Total Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-green-100">Verified listings</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Regional Overview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Region</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                name: "Flanders (Vlaanderen)", 
                cities: "Antwerp, Ghent, Bruges, Leuven", 
                description: "Major industrial and agricultural region"
              },
              { 
                name: "Wallonia (Wallonie)", 
                cities: "Liège, Charleroi, Namur, Mons", 
                description: "Industrial heritage with growing renewable energy"
              },
              { 
                name: "Brussels-Capital", 
                cities: "Brussels, Schaerbeek, Anderlecht", 
                description: "Urban center with innovative sustainability projects"
              },
            ].map((region) => (
              <Card key={region.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{region.name}</CardTitle>
                  <p className="text-sm text-gray-600">{region.description}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{region.cities}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/directory?country=belgium&region=${encodeURIComponent(region.name)}`}>
                      Explore {region.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Solar Parks - Only show if enough listings */}
      {showFeaturedSolar && featuredSolarParks.length > 0 ? (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Solar Parks in Belgium</h2>
              <Button asChild variant="outline">
                <Link href="/directory?country=belgium&listingType=solar-farm">
                  View All Solar Parks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSolarParks.map((park) => (
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
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{park.region}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" asChild>
                      <Link href={`/solarparks/belgium/${park.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Solar Parks in Belgium</h2>
            <p className="text-gray-600 mb-6">Explore our directory of solar parks seeking grazing partnerships.</p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/directory?country=belgium&listingType=solar-farm">
                Browse All Solar Parks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Featured Sheep Farms - Only show if enough listings, otherwise show CTA */}
      {showFeaturedSheep && featuredSheepFarms.length > 0 ? (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Sheep Farms in Belgium</h2>
              <Button asChild variant="outline">
                <Link href="/directory?country=belgium&listingType=shepherd">
                  View All Sheep Farms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSheepFarms.map((farm) => (
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
                        <span className="font-medium">{farm.flockSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Breed:</span>
                        <span className="font-medium">{farm.breed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{farm.region}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" asChild>
                      <Link href={`/sheepfarms/belgium/${farm.slug}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Sheep Farms in Belgium</h2>
            <p className="text-gray-600 mb-6">
              We're growing our network of sheep farms in Belgium. 
              Browse our current listings or check back soon for more.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/directory?country=belgium&listingType=shepherd">
                Browse All Listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Solar Grazing Partnership?</h2>
          <p className="text-xl mb-8 text-green-100">
            Browse our verified directory of solar parks and sheep farms in Belgium
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100" asChild>
              <Link href="/directory?country=belgium">Browse Belgium Listings</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/directory?country=belgium&listingType=solar-farm">Find Solar Parks</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/directory?country=belgium&listingType=shepherd">Find Sheep Farms</Link>
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
            "name": "Solar Grazing in Belgium",
            "description": "Discover solar parks and sheep farms in Belgium. Find shepherds for vegetation management and solar grazing partnerships across Belgian regions.",
            "url": "https://www.ombaa.com/belgium",
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
