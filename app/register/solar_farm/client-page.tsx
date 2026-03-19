"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { AlertCircle } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SolarFarmRegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    company_name: "",
    contact_person: "",
    phone: "",
    address: "",
  })
  const [error, setError] = useState("")
  const { register, isLoading } = useAuth()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        role: "solar_farm",
        company_name: formData.company_name,
        contact_person: formData.contact_person,
        phone: formData.phone,
        address: formData.address,
      })
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Registration failed. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f1e4] px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-xl border-emerald-950/10 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)]">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-semibold tracking-tight text-slate-950">Create operator account</CardTitle>
          <CardDescription className="text-base leading-7 text-slate-600">
            Create an Ombaa account for your solar park team. If you only want to start a grazing review, use the
            assessment form instead.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company or operator</Label>
              <Input id="company_name" name="company_name" type="text" value={formData.company_name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_person">Primary contact</Label>
              <Input id="contact_person" name="contact_person" type="text" value={formData.contact_person} onChange={handleChange} required />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Site location</Label>
                <Input id="address" name="address" type="text" value={formData.address} onChange={handleChange} required />
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              The fastest way to start a site review is still the{" "}
              <Link href="/#request-assessment" className="font-medium text-emerald-700 hover:text-emerald-800">
                grazing assessment form
              </Link>
              .
            </p>

            <Button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account and continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/register" className="text-sm font-medium text-slate-600 hover:text-slate-800">
            Back to role selection
          </Link>
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
