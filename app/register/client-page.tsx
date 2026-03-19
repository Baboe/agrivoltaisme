"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, SunMedium, WheatIcon as Sheep } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<"solar_farm" | "shepherd" | null>(null)
  const [error, setError] = useState("")
  const { isLoading } = useAuth()
  const router = useRouter()

  const handleRoleSelect = (role: "solar_farm" | "shepherd") => {
    setSelectedRole(role)
    router.push(`/register/${role}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f1e4] px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl border-emerald-950/10 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-semibold tracking-tight text-slate-950">Work with Ombaa</CardTitle>
          <CardDescription className="mx-auto max-w-xl text-base leading-7 text-slate-600">
            Choose the path that fits your role. The main operator intake happens through the assessment form. These
            account routes are for teams that want an Ombaa login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className={`h-auto flex-col items-start gap-4 rounded-3xl border px-6 py-6 text-left ${
                selectedRole === "solar_farm" ? "border-emerald-600 bg-emerald-50" : "border-slate-200"
              }`}
              onClick={() => handleRoleSelect("solar_farm")}
              disabled={isLoading}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <SunMedium className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Create operator account</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  For owners, operators, asset managers, and land managers who want an Ombaa account after the initial
                  assessment process.
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className={`h-auto flex-col items-start gap-4 rounded-3xl border px-6 py-6 text-left ${
                selectedRole === "shepherd" ? "border-emerald-600 bg-emerald-50" : "border-slate-200"
              }`}
              onClick={() => handleRoleSelect("shepherd")}
              disabled={isLoading}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Sheep className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Register as a grazing partner</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  For shepherds and grazing operators who want to be considered for solar park grazing opportunities.
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-emerald-700 hover:text-emerald-800">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
