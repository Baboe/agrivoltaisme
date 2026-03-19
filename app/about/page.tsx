import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, FileSearch, Handshake, MapPinned } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getPublicMarketStats } from "@/lib/public-market-stats"

export const metadata: Metadata = {
  title: "About Ombaa",
  description:
    "Learn how Ombaa helps solar park operators assess site fit, find grazing partners, and structure practical grazing arrangements.",
  alternates: { canonical: "https://ombaa.com/about" },
  openGraph: {
    title: "About Ombaa",
    description:
      "Learn how Ombaa helps solar park operators assess site fit, find grazing partners, and structure practical grazing arrangements.",
    url: "https://ombaa.com/about",
    siteName: "Ombaa",
  },
  twitter: {
    card: "summary",
    title: "About Ombaa",
    description:
      "Learn how Ombaa helps solar park operators assess site fit, find grazing partners, and structure practical grazing arrangements.",
  },
}

export default function AboutPage() {
  const coverage = getPublicMarketStats()

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">About Ombaa</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
              A practical grazing service for solar parks
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Ombaa is repositioning around a simple commercial job: helping solar park operators and land managers
              reduce vegetation management costs through sheep grazing where it is a practical fit.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-stone-50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="rounded-3xl border-stone-200 bg-white">
              <CardContent className="p-6">
                <FileSearch className="h-7 w-7 text-emerald-700" />
                <h2 className="mt-5 text-xl font-semibold text-slate-900">Site assessment first</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Ombaa starts with the operating realities of the site, not with a broad marketplace promise.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-stone-200 bg-white">
              <CardContent className="p-6">
                <MapPinned className="h-7 w-7 text-emerald-700" />
                <h2 className="mt-5 text-xl font-semibold text-slate-900">Coverage informed by data</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Directory data helps Ombaa understand where solar parks and grazing partners already exist across
                  markets.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-stone-200 bg-white">
              <CardContent className="p-6">
                <Handshake className="h-7 w-7 text-emerald-700" />
                <h2 className="mt-5 text-xl font-semibold text-slate-900">Managed arrangement support</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  If the fit looks good, Ombaa helps move from initial match to a workable grazing arrangement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">What Ombaa checks</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              The decision is operational before it is commercial
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Sheep grazing can be useful, but only if the site supports it. Ombaa screens for the practical details
              that shape whether an introduction is worth making.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Site constraints",
                description: "Panel clearance, electrical layout, fencing, water, and physical access.",
              },
              {
                title: "Vegetation goals",
                description: "How the operator wants to manage growth, maintenance cycles, and fire load.",
              },
              {
                title: "Partner coverage",
                description: "Whether relevant grazing partner coverage exists within a practical operating radius.",
              },
            ].map((item) => (
              <Card key={item.title} className="rounded-3xl border-stone-200 bg-stone-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-stone-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Current coverage</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              Public country coverage already visible on the site
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { label: "Solar park records", value: coverage.solarParks },
              { label: "Grazing partner records", value: coverage.sheepFarms },
              { label: "Public country pages", value: coverage.countryCount },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-stone-200 bg-white p-6">
                <p className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#163128] text-stone-50">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
              Ready to review a site or register as a grazing partner?
            </h2>
            <p className="mt-4 text-base leading-8 text-emerald-50/85">
              The clearest next step is to submit a site for review or register grazing partner interest.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-emerald-950 hover:bg-stone-100">
              <Link href="/#request-assessment">
                Request assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/register/shepherd">Register as grazing partner</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
