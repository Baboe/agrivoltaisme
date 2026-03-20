import type { Metadata } from "next"
import LeadForm from "@/components/lead-form"

export const metadata: Metadata = {
  title: "Find a solar grazing partner | Ombaa",
  description: "Submit your solar park details and get matched with suitable sheep grazing partners.",
}

export default function FindSolarGrazingPartnerPage() {
  return (
    <div className="container mx-auto grid gap-8 px-4 py-14 lg:grid-cols-2 lg:items-start">
      <div>
        <h1 className="text-4xl font-semibold text-slate-950">Find a solar grazing partner</h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          Share your site profile and we will review grazing fit based on location, size, and vegetation conditions.
        </p>
      </div>
      <LeadForm type="solarPark" />
    </div>
  )
}
