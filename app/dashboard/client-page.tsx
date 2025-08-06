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
        <h2 className="text-xl font-bold mb-2">Get Started with Ombaa</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          {user.role === "solar_farm"
            ? "List your first solar farm property to start connecting with shepherds for eco-friendly grazing."
            : "Complete your shepherd profile and start browsing available grazing opportunities at solar farms."}
        </p>
        <Button className="bg-green-600 hover:bg-green-700">
          {user.role === "solar_farm" ? "Add Your First Property" : "Browse Opportunities"}
        </Button>
      </div>
    </div>
  )
}
