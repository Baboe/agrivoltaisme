"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Leaf, SunMedium, WheatIcon as Sheep, ArrowRight } from "lucide-react"
import Image from "next/image"
import WaitlistForm from "@/components/waitlist-form"
import TestimonialCard from "@/components/testimonial-card"
import CountryCard from "@/components/country-card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-700 text-white pb-32">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <Badge className="bg-white text-green-700 hover:bg-gray-100 px-3 py-1 text-sm">
                Europe's First Solar Grazing Marketplace
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Swap Costly Mowing for Eco-Friendly Sheep Grazing
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Connect solar farms with shepherds for sustainable vegetation management. Save costs, reduce fire risks,
                and promote biodiversity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-3 bg-white text-green-700 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Join Waitlist
                </button>
                <button
                  onClick={() => (window.location.href = "/directory")}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md font-medium hover:bg-white/20 transition-colors"
                >
                  Browse Directory
                </button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="rounded-xl overflow-hidden shadow-2xl h-[400px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250521_0731_Sheep%20Grazing%20Under%20Solar_simple_compose_01jvrn3cmte66b17yng8ra2w2v-GioDYK5MT7MYIn6tQpoqyse1dOzJQH.png"
                  alt="Sheep grazing under solar panels at a solar farm"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                  priority
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Save €300-€700</p>
                    <p className="text-gray-500 text-sm">per hectare annually</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave SVG moved to after the content */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Benefits for Everyone</h2>
            <p className="text-gray-600 text-lg">
              Our platform creates value for solar farms, shepherds, and the environment through sustainable
              partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <SunMedium className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>For Solar Farms</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Save €300-€700 per hectare annually on mowing costs</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Reduce fire risks with natural vegetation management</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Improve ESG metrics with sustainable land management</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Standardized contracts and verified shepherds</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Sheep className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>For Shepherds</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Access new grazing land for your flock</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Generate additional income from your sheep</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Secure long-term grazing contracts</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Simple digital contracts and reliable payments</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>For the Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Reduce CO₂ emissions from mechanical mowing</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Promote biodiversity in solar farm ecosystems</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Support sustainable agricultural practices</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span>Reduce noise pollution in rural areas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">
              Our platform makes it easy to connect solar farms with shepherds through a simple process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">List Your Property or Flock</h3>
              <p className="text-gray-600">
                Solar farms list their available hectares and dates. Shepherds register their flock details and
                availability.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Get Matched</h3>
              <p className="text-gray-600">
                Our algorithm suggests verified shepherds based on location, availability, and capacity for optimal
                matches.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Connect and Collaborate</h3>
              <p className="text-gray-600">
                Connect directly with potential partners, discuss details, and establish grazing arrangements.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/how-it-works">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Directory Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Find Partners Across Europe</h2>
            <p className="text-gray-600 text-lg">
              Browse our directory of verified shepherds and solar farms to find the perfect match for your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <CountryCard
              country="Netherlands"
              imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250521_1201_Solar%20Grazing%20Sheep_simple_compose_01jvs4jh70frcv4dag8zfsgzqy-ACRvlKzoKTGUJuelKSoMCTK0q8NyeF.png"
              description="Our most active market. 119 listings across Dutch provinces with verified shepherds and solar parks."
              featured={true}
            />
            <CountryCard
              country="Germany"
              imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250521_1159_Solar%20Grazing%20Sheep_simple_compose_01jvs4eg1df00rt57p2xkhv2d5-BTgi8ic1BRVijZs1TmgyTurdkIVc67.png"
              description="Explore Bavaria, Brandenburg, and other German regions with active solar grazing."
            />
            <CountryCard
              country="France"
              imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250521_1151_Sheep%20Graze%20Under%20Solar%20Panels_simple_compose_01jvs40pmyfk98xmnm3jj57fz4-B9McXKWoZZnP6IT95qkfglMPgO5gdb.png"
              description="Discover solar grazing opportunities across France, from Provence to Normandy."
            />
          </div>

          <div className="text-center">
            <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <Link href="/directory">
                View Full Directory <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">What People Are Saying</h2>
            <p className="text-gray-600 text-lg">
              Hear from solar farms and shepherds who have already benefited from our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard
              name="Jean Dupont"
              role="Solar Farm Manager, Provence"
              quote="We've reduced our maintenance costs by over 40% since switching to sheep grazing. The process was simple, and the shepherds are reliable and professional."
            />
            <TestimonialCard
              name="Klaus Schmidt"
              role="Shepherd, Bavaria"
              quote="Finding grazing land for my flock has always been challenging. This platform has opened up new opportunities and provided a steady income stream for my sheep farming business."
            />
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Our Waitlist</h2>
            <p className="text-xl opacity-90">
              Be the first to know when Ombaa launches in your region. Whether you're a solar farm owner or a shepherd,
              we'll connect you with the right partners.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  )
}
