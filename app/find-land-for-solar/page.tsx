import type { Metadata } from "next"
import LeadForm from "@/components/lead-form"

export const metadata: Metadata = {
  title: "Find land for solar projects | Ombaa",
  description: "Farmers and landowners can submit land details for agrivoltaic and solar grazing opportunities.",
}

export default function FindLandForSolarPage() {
  return (
    <div className="container mx-auto grid gap-8 px-4 py-14 lg:grid-cols-2 lg:items-start">
      <div>
        <h1 className="text-4xl font-semibold text-slate-950">Find land for solar</h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          Submit your farmer profile to get land opportunities and partnership leads linked to sheep grazing operations.
        </p>
      </div>
      <LeadForm type="farmer" />
    </div>
  )
}
