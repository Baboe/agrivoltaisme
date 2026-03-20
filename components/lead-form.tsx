"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type LeadType = "solarPark" | "farmer" | "landowner"

interface LeadFormProps {
  type: LeadType
  title?: string
  description?: string
  className?: string
}

type LeadFormState = {
  location: string
  sizeHectares: string
  vegetationType: string
  email: string
  flockSize: string
  mobility: string
  interest: string
}

const initialFormState: LeadFormState = {
  location: "",
  sizeHectares: "",
  vegetationType: "",
  email: "",
  flockSize: "",
  mobility: "",
  interest: "",
}

const labels: Record<LeadType, { title: string; description: string; submitLabel: string }> = {
  solarPark: {
    title: "Solar park intake",
    description: "Share a few details and we will review partner fit for your site.",
    submitLabel: "Request solar grazing partner",
  },
  farmer: {
    title: "Farmer intake",
    description: "Tell us your flock profile and where you can operate.",
    submitLabel: "Request grazing opportunities",
  },
  landowner: {
    title: "Landowner intake",
    description: "Share your land details and the type of project interest.",
    submitLabel: "Request land opportunity review",
  },
}

export default function LeadForm({ type, title, description, className }: LeadFormProps) {
  const [formState, setFormState] = useState<LeadFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...formState }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || "Could not submit your request.")
      }

      setSubmitted(true)
      setFormState(initialFormState)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not submit your request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={cn("rounded-3xl border border-emerald-200 bg-white p-8", className)}>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-slate-900">Request received</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Thanks for sharing your details. We will review your request and follow up by email.
        </p>
        <Button type="button" variant="outline" className="mt-5" onClick={() => setSubmitted(false)}>
          Submit another request
        </Button>
      </div>
    )
  }

  const heading = title || labels[type].title
  const body = description || labels[type].description

  return (
    <form onSubmit={handleSubmit} className={cn("rounded-3xl border border-stone-200 bg-white p-6 sm:p-8", className)}>
      <h3 className="text-xl font-semibold text-slate-900">{heading}</h3>
      <p className="mt-2 text-sm text-slate-600">{body}</p>

      <div className="mt-6 grid gap-4">
        <div>
          <label htmlFor="location" className="text-sm font-medium text-slate-700">Location</label>
          <Input id="location" name="location" value={formState.location} onChange={handleChange} required className="mt-2" />
        </div>

        {type === "solarPark" ? (
          <>
            <div>
              <label htmlFor="sizeHectares" className="text-sm font-medium text-slate-700">Size (hectares)</label>
              <Input id="sizeHectares" name="sizeHectares" value={formState.sizeHectares} onChange={handleChange} required className="mt-2" />
            </div>
            <div>
              <label htmlFor="vegetationType" className="text-sm font-medium text-slate-700">Vegetation type</label>
              <Input id="vegetationType" name="vegetationType" value={formState.vegetationType} onChange={handleChange} required className="mt-2" />
            </div>
          </>
        ) : null}

        {type === "farmer" ? (
          <>
            <div>
              <label htmlFor="flockSize" className="text-sm font-medium text-slate-700">Flock size</label>
              <Input id="flockSize" name="flockSize" value={formState.flockSize} onChange={handleChange} required className="mt-2" />
            </div>
            <div>
              <label htmlFor="mobility" className="text-sm font-medium text-slate-700">Mobility</label>
              <Input id="mobility" name="mobility" value={formState.mobility} onChange={handleChange} required className="mt-2" placeholder="Own trailer, local only, regional" />
            </div>
          </>
        ) : null}

        {type === "landowner" ? (
          <>
            <div>
              <label htmlFor="sizeHectares" className="text-sm font-medium text-slate-700">Land size</label>
              <Input id="sizeHectares" name="sizeHectares" value={formState.sizeHectares} onChange={handleChange} required className="mt-2" />
            </div>
            <div>
              <label htmlFor="interest" className="text-sm font-medium text-slate-700">Interest</label>
              <Input id="interest" name="interest" value={formState.interest} onChange={handleChange} required className="mt-2" placeholder="Lease for solar, grazing partnerships, both" />
            </div>
          </>
        ) : null}

        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Contact email</label>
          <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required className="mt-2" />
        </div>
      </div>

      {error ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <Button type="submit" className="mt-6 w-full bg-emerald-800 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          labels[type].submitLabel
        )}
      </Button>
    </form>
  )
}
