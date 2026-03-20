import type { Metadata } from "next"
import LeadForm from "@/components/lead-form"

export const metadata: Metadata = {
  title: "Agrivoltaic income estimate request | Ombaa",
  description: "Request an agrivoltaic income estimate and project feasibility review.",
}

export default function AgrivoltaicIncomeEstimatePage() {
  return (
    <div className="container mx-auto grid gap-8 px-4 py-14 lg:grid-cols-2 lg:items-start">
      <div>
        <h1 className="text-4xl font-semibold text-slate-950">Request an agrivoltaic income estimate</h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          We provide a practical estimate framework based on land profile and intended land use strategy.
        </p>
      </div>
      <LeadForm
        type="landowner"
        title="Feasibility estimate intake"
        description="Share your land profile and interest. We will follow up with a practical next-step estimate."
      />
    </div>
  )
}
