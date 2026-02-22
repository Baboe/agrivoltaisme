import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Sun, ArrowRight, Clock } from "lucide-react";
import { getCountryStats } from "@/lib/stats-service";

export const metadata: Metadata = {
  title: "Solar Grazing in France | Solar Parks & Sheep Farms Directory",
  description: "Discover solar parks and sheep farms in France. Find shepherds for vegetation management and solar grazing partnerships across French regions.",
  alternates: {
    canonical: "https://ombaa.com/france",
  },
  openGraph: {
    title: "Solar Grazing in France | Ombaa Directory",
    description: "Discover solar parks and sheep farms in France. Find shepherds for vegetation management and solar grazing partnerships across French regions.",
    url: "https://ombaa.com/france",
    siteName: "Ombaa",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Solar Grazing in France | Ombaa Directory",
    description: "Discover solar parks and sheep farms in France. Find shepherds for vegetation management and solar grazing partnerships across French regions.",
  },
};

export default function FrancePage() {
  // Get real stats from data files (server component)
  const stats = getCountryStats('france');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🇫🇷</span>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">Solar Grazing in France</h1>
                {!stats.isMvp && (
                  <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-400">
                    <Clock className="h-3 w-3 mr-1" />
                    Coming Soon
                  </Badge>
                )}
              </div>
              <p className="text-xl text-green-100">Connecting solar parks with sheep farmers across French regions</p>
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
                <p className="text-green-100">Solar parks identified</p>
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
                <p className="text-green-100">Sheep farms identified</p>
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
                <p className="text-green-100">In our database</p>
              </CardContent>
            </Card>
          </div>

          {!stats.isMvp && (
            <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-100">
                <strong>Coming Soon:</strong> France directory is currently being verified. 
                Join our waitlist to be notified when French listings go live.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Regional Overview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Region</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: "Provence-Alpes-Côte d'Azur", 
                cities: "Marseille, Nice, Toulon, Avignon", 
                description: "Mediterranean climate ideal for solar energy"
              },
              { 
                name: "Occitanie", 
                cities: "Toulouse, Montpellier, Nîmes, Perpignan", 
                description: "Leading region in renewable energy adoption"
              },
              { 
                name: "Nouvelle-Aquitaine", 
                cities: "Bordeaux, Limoges, Poitiers, La Rochelle", 
                description: "Major agricultural region with solar expansion"
              },
              { 
                name: "Auvergne-Rhône-Alpes", 
                cities: "Lyon, Grenoble, Clermont-Ferrand", 
                description: "Industrial heartland embracing solar grazing"
              },
              { 
                name: "Grand Est", 
                cities: "Strasbourg, Metz, Nancy, Reims", 
                description: "Eastern France focusing on sustainable agriculture"
              },
              { 
                name: "Hauts-de-France", 
                cities: "Lille, Amiens, Roubaix, Tourcoing", 
                description: "Northern region with growing renewable sector"
              },
            ].map((region) => (
              <Card key={region.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{region.name}</CardTitle>
                  <p className="text-sm text-gray-600">{region.description}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{region.cities}</p>
                  <Button variant="outline" size="sm" asChild disabled={!stats.isMvp}>
                    <Link href={stats.isMvp ? `/directory?country=france&region=${encodeURIComponent(region.name)}` : "#"}>
                      {stats.isMvp ? `Explore ${region.name}` : 'Coming Soon'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist CTA for non-MVP countries */}
      {!stats.isMvp && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Get Notified When France Launches</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              We're verifying {stats.total} listings in France. Join our waitlist to be the first to access the French solar grazing directory.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/#waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore Available Regions</h2>
          <p className="text-xl mb-8 text-green-100">
            While France is coming soon, browse our verified listings in the Netherlands and Belgium
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100" asChild>
              <Link href="/netherlands">Browse Netherlands</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/belgium">Browse Belgium</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/directory">Full Directory</Link>
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
            "name": "Solar Grazing in France",
            "description": "Discover solar parks and sheep farms in France. Find shepherds for vegetation management and solar grazing partnerships across French regions.",
            "url": "https://ombaa.com/france",
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
