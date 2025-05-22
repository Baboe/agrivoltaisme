import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, Globe, TrendingUp, Leaf } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Ombaa</h1>
            <p className="text-xl opacity-90">
              Europe's first one-click marketplace that swaps costly mowing for eco-friendly sheep, matched and
              monitored in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-8">
              At Ombaa, we're on a mission to transform vegetation management at solar farms across Europe by connecting
              solar farm operators with local shepherds. We believe that sustainable solutions can be both economically
              viable and environmentally beneficial.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Our platform facilitates partnerships that replace costly mechanical mowing with eco-friendly sheep
              grazing, creating a win-win situation for all parties involved while promoting biodiversity and reducing
              carbon emissions.
            </p>
            <div className="bg-green-50 p-6 rounded-lg border border-green-100 mb-8">
              <h3 className="text-xl font-semibold mb-3 text-green-800">Our Vision</h3>
              <p className="text-gray-700">
                We envision a future where every solar farm in Europe integrates sustainable grazing practices, creating
                a harmonious relationship between renewable energy production and traditional agriculture while
                maximizing economic and environmental benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem We're Solving */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">The Problem We're Solving</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">For Solar Farms</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>High maintenance costs for mechanical mowing</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Increased fire risks from dry vegetation</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Environmental impact of mechanical mowing</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Difficulty finding reliable grazing partners</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">For Shepherds</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Limited access to grazing land</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Challenges in finding consistent income sources</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Complex contract negotiations</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span>Difficulty connecting with solar farm operators</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">European Focus</h3>
                <p className="text-gray-700">
                  We're building a pan-European network of solar farms and shepherds, starting with key markets in
                  France, Germany, and the Netherlands, with plans to expand across the continent.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Data-Driven Matching</h3>
                <p className="text-gray-700">
                  Our platform uses advanced algorithms to match solar farms with the most suitable shepherds based on
                  location, flock size, availability, and specific site requirements.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Building</h3>
                <p className="text-gray-700">
                  We're creating a community of solar farm operators and shepherds who share knowledge, best practices,
                  and success stories to advance the adoption of solar grazing.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sustainability Impact</h3>
                <p className="text-gray-700">
                  We measure and report on the environmental benefits of solar grazing, including reduced carbon
                  emissions, increased biodiversity, and improved soil health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Ombaa was founded by a team of renewable energy experts, agricultural specialists, and technology
              innovators who share a passion for sustainable solutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Team member"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Emma Bergman</h3>
                <p className="text-gray-600 text-sm">Co-Founder & CEO</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Team member"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Thomas Visser</h3>
                <p className="text-gray-600 text-sm">Co-Founder & CTO</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Team member"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Sophie Laurent</h3>
                <p className="text-gray-600 text-sm">Head of Partnerships</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join the Solar Grazing Revolution</h2>
            <p className="text-xl opacity-90 mb-8">
              Whether you're a solar farm operator looking to reduce costs and improve sustainability, or a shepherd
              seeking new grazing opportunities, Ombaa is here to connect you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-700 hover:bg-gray-100">
                <Link href="/directory">Browse Directory</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-green-500">
                <Link href="/#waitlist">Join Waitlist</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
