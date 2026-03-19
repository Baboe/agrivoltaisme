"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const initialFormState = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  siteLocation: "",
  approximateHectares: "",
  currentVegetationMethod: "",
  notes: "",
}

type AssessmentFormState = typeof initialFormState

interface AssessmentRequestFormProps {
  className?: string
  submitLabel?: string
}

export default function AssessmentRequestForm({
  className,
  submitLabel = "Request a grazing assessment",
}: AssessmentRequestFormProps) {
  const [formState, setFormState] = useState<AssessmentFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/assessment-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || "Could not send your request. Please try again.")
      }

      setIsSubmitted(true)
      setFormState(initialFormState)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not send your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-emerald-200 bg-white p-8 shadow-[0_24px_60px_-32px_rgba(20,83,45,0.45)]",
          className,
        )}
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-900">Request received</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ombaa has your site details. We will review the basics and follow up about suitability, coverage, and next
          steps.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 border-emerald-300 text-emerald-900 hover:bg-emerald-50"
          onClick={() => setIsSubmitted(false)}
        >
          Submit another site
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] sm:p-8",
        className,
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium text-slate-700">
            Company or asset owner
          </label>
          <Input
            id="companyName"
            name="companyName"
            value={formState.companyName}
            onChange={handleChange}
            placeholder="Your company"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contactName" className="text-sm font-medium text-slate-700">
            Contact name
          </label>
          <Input
            id="contactName"
            name="contactName"
            value={formState.contactName}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Work email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formState.phone}
            onChange={handleChange}
            placeholder="+31 ..."
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="siteLocation" className="text-sm font-medium text-slate-700">
            Site location
          </label>
          <Input
            id="siteLocation"
            name="siteLocation"
            value={formState.siteLocation}
            onChange={handleChange}
            placeholder="Region, municipality, or address"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="approximateHectares" className="text-sm font-medium text-slate-700">
            Approximate hectares
          </label>
          <Input
            id="approximateHectares"
            name="approximateHectares"
            type="number"
            min="0"
            step="0.1"
            value={formState.approximateHectares}
            onChange={handleChange}
            placeholder="20"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="currentVegetationMethod" className="text-sm font-medium text-slate-700">
          Current vegetation management
        </label>
        <Input
          id="currentVegetationMethod"
          name="currentVegetationMethod"
          value={formState.currentVegetationMethod}
          onChange={handleChange}
          placeholder="Mowing, mixed maintenance, existing grazing, other"
        />
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700">
          Notes
        </label>
        <Textarea
          id="notes"
          name="notes"
          value={formState.notes}
          onChange={handleChange}
          placeholder="Share any site constraints, grazing goals, or timing requirements."
          rows={5}
        />
      </div>

      {submitError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {submitError}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm leading-6 text-slate-500">
          This goes to Ombaa for manual review. No marketplace account is required to start the conversation.
        </p>
        <Button type="submit" size="lg" className="bg-emerald-800 text-white hover:bg-emerald-700" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
