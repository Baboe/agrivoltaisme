"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SunMedium, WheatIcon as Sheep, Plus, ListFilter, Settings } from "lucide-react"

export default function DashboardPage() {
  const { user, profile, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user.role === "solar_farm" ? profile.company_name : profile.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === "solar_farm"
              ? "Manage your solar farm listings and shepherd matches"
              : "Find grazing opportunities and manage your contracts"}
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          {user.role === "solar_farm" ? (
            <>
              <Plus className="mr-2 h-4 w-4" /> Create New Listing
            </>
          ) : (
            <>
              <ListFilter className="mr-2 h-4 w-4" /> Browse Opportunities
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Listings</CardTitle>
            <CardDescription>
              {user.role === "solar_farm"
                ? "Your current grazing opportunities"
                : "Grazing contracts you're participating in"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">No active listings yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Matches</CardTitle>
            <CardDescription>
              {user.role === "solar_farm"
                ? "Shepherds interested in your listings"
                : "Your applications to grazing opportunities"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-gray-500 mt-1">No pending matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to improve matching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">70%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "70%" }}></div>
            </div>
            <Button variant="link" className="text-green-600 p-0 h-auto mt-2">
              <Settings className="h-4 w-4 mr-1" /> Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          {user.role === "solar_farm" ? (
            <SunMedium className="h-8 w-8 text-green-600" />
          ) : (
            <Sheep className="h-8 w-8 text-green-600" />
          )}
        </div>
        <h2 className="text-xl font-bold mb-2">Can we Get Started</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          To start counting visitors and page views, follow these steps.
        </p>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-left max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Next.js</h3>
          </div>
          <ol className="space-y-4 text-gray-700">
            <li>
              <p className="font-semibold">1. Install our package</p>
              <p className="text-sm text-gray-600 mt-1">
                Start by installing @vercel/analytics in your existing project.
              </p>
              <div className="mt-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-mono text-gray-800">
                npm i @vercel/analytics
              </div>
            </li>
            <li>
              <p className="font-semibold">2. Add the React component</p>
              <p className="text-sm text-gray-600 mt-1">
                Import and use the {"<Analytics />"} React component into your app&apos;s layout.
              </p>
              <div className="mt-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-mono text-gray-800">
                import {"{ Analytics }"} from &quot;@vercel/analytics/next&quot;
              </div>
              <p className="text-xs text-gray-500 mt-2">
                For full examples and further reference, please refer to our documentation.
              </p>
            </li>
            <li>
              <p className="font-semibold">3. Deploy &amp; Visit your Site</p>
              <p className="text-sm text-gray-600 mt-1">
                Deploy your changes and visit the deployment to collect your page views.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                If you don&apos;t see data after 30 seconds, please check for content blockers and try
                to navigate between pages on your site.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
