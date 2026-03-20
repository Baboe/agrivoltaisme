import Link from "next/link"
import CtaBlock from "@/components/cta-block"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const featuredGuides = [
  {
    href: "/guides/solar-grazing-income-europe",
    title: "How much can you earn with solar grazing in Europe?",
    category: "Income guide",
  },
  {
    href: "/equipment/best-fencing-for-sheep-under-solar-panels",
    title: "Best fencing for sheep under solar panels",
    category: "Equipment",
  },
  {
    href: "/solar-grazing/solar-grazing-contracts-explained",
    title: "Solar grazing contracts explained",
    category: "How to",
  },
]

export default function HomeClient() {
  return (
    <div className="bg-white">
      <section className="border-b border-stone-200 bg-stone-50">
        <div className="container mx-auto px-4 py-20 md:py-24">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            Solar grazing and agrivoltaics in Europe
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            For solar park owners, farmers, and landowners. Get practical guidance, partner matching support, and land
            use opportunities for sheep and solar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-emerald-800 hover:bg-emerald-700">
              <Link href="/find-solar-grazing-partner">Find a solar grazing partner</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#how-it-works">Learn how it works</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-semibold text-slate-900">Who it is for</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Solar park owners", "Reduce vegetation management costs and improve site planning."],
              ["Farmers", "Find new grazing land and long-term contract opportunities."],
              ["Landowners", "Generate income through agrivoltaic and land-use partnerships."],
            ].map(([title, text]) => (
              <Card key={title}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-stone-200 bg-stone-50 scroll-mt-24">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-semibold text-slate-900">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["1. Submit your situation", "Share your location, profile, and project needs in a short form."],
              ["2. We match or provide insights", "We review your case and share practical next steps."],
              ["3. You connect and proceed", "Connect with relevant partners and move forward with a clear plan."],
            ].map(([title, text]) => (
              <Card key={title}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-3xl font-semibold text-slate-900">Featured guides</h2>
            <Link href="/guides" className="text-sm font-medium text-emerald-800 hover:underline">
              View all guides
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featuredGuides.map((guide) => (
              <Card key={guide.href}>
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-wider text-emerald-700">{guide.category}</p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{guide.title}</h3>
                  <Link href={guide.href} className="mt-4 inline-block text-sm font-medium text-emerald-800 hover:underline">
                    Read article
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <CtaBlock
          title="Get a solar grazing match"
          description="Tell us about your site, flock, or land. We will review fit and send the next steps by email."
          primaryLabel="Request agrivoltaic opportunity"
          primaryHref="/find-solar-grazing-partner"
          secondaryLabel="Request feasibility estimate"
          secondaryHref="/agrivoltaic-income-estimate"
        />
      </section>
    </div>
  )
}
