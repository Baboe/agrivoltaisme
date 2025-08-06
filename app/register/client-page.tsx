"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, SunMedium, WheatIcon as Sheep } from "lucide-react"

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<"solar_farm" | "shepherd" | null>(null)
  const [error, setError] = useState("")
  const { isLoading } = useAuth()
  const router = useRouter()

  const handleRoleSelect = (role: "solar_farm" | "shepherd") => {
    setSelectedRole(role)

    // Navigate to the specific registration form
    router.push(`/register/${role}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Choose your role to get started with Ombaa</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className={`h-auto py-6 flex flex-col items-center justify-center gap-3 ${
                selectedRole === "solar_farm" ? "border-green-600 bg-green-50" : ""
              }`}
              onClick={() => handleRoleSelect("solar_farm")}
              disabled={isLoading}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <SunMedium className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-medium">Solar Farm</h3>
                <p className="text-sm text-gray-500 mt-1">I own or manage solar installations</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className={`h-auto py-6 flex flex-col items-center justify-center gap-3 ${
                selectedRole === "shepherd" ? "border-green-600 bg-green-50" : ""
              }`}
              onClick={() => handleRoleSelect("shepherd")}
              disabled={isLoading}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Sheep className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-medium">Shepherd</h3>
                <p className="text-sm text-gray-500 mt-1">I have sheep and provide grazing services</p>
              </div>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
