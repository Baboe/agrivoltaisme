import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Flame,
  MapPinned,
  NotebookTabs,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react"
import AssessmentRequestForm from "@/components/assessment-request-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PublicMarketStat } from "@/lib/public-market-stats"

interface HomePageProps {
  markets: PublicMarketStat[]
  solarParks: number
  sheepFarms: number
  total: number
  countryCount: number
}

const suitabilityChecks = [
  "Location, acreage, and current vegetation pressure",
  "Basic fit factors such as access, panel clearance, fencing, and water",
  "Whether local grazing partner coverage already exists in Ombaa's working footprint",
]

const benefitCards = [
  {
    icon: CircleDollarSign,
    title: "Reduce recurring mowing spend",
    description:
      "Grazing can lower the frequency and cost of mechanical vegetation control where the site is a practical fit.",
  },
  {
    icon: Flame,
    title: "Lower vegetation and fire load",
    description:
      "Keeping grass growth under control can help reduce dry fuel build-up between and beneath panel rows.",
  },
  {
    icon: ShieldCheck,
    title: "Add a safer maintenance rhythm",
    description:
      "A structured grazing arrangement can complement O&M planning with less machinery movement on site.",
  },
  {
    icon: Sprout,
    title: "Support biodiversity goals",
    description:
      "When managed well, grazing can support habitat value and reduce the disturbance of repeated mowing passes.",
  },
]

const howItWorksSteps = [
  {
    title: "Submit your site",
    description: "Share location, hectares, and how you currently manage vegetation.",
  },
  {
    title: "We review the fit",
    description: "Ombaa screens practical constraints before recommending whether grazing is worth pursuing.",
  },
  {
    title: "We help structure the match",
    description: "If the site fits, Ombaa connects you with grazing partners and helps shape the arrangement.",
  },
]

const audienceGroups = [
  "Solar park owners and operators",
  "Asset managers and O&M teams",
  "Land managers responsible for vegetation control",
]

export default function HomeClient({ markets, solarParks, sheepFarms, countryCount }: HomePageProps) {
  const publicRecordCount = markets.reduce((sum, market) => sum + market.total, 0)

  return (
    <div className="bg-stone-50">
      <section className="relative overflow-hidden border-b border-emerald-950/10 bg-[#163128] text-stone-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(166,230,187,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(254,240,138,0.08),_transparent_26%)]" />
        <div className="container relative mx-auto grid gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-50">
              Vegetation management support for solar parks
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              Reduce solar park vegetation costs with sheep grazing
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/90 md:text-xl">
              Ombaa helps solar park operators and land managers assess site fit, source grazing partners, and structure
              a workable arrangement. The focus is practical vegetation control, not marketplace hype.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-emerald-50/90 sm:text-base">
              {[
                "Lower routine mowing pressure where grazing makes operational sense.",
                "Reduce vegetation build-up and support fire risk management.",
                "Start with a managed assessment instead of a self-serve listing flow.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-emerald-950 hover:bg-stone-100">
                <Link href="/#request-assessment">
                  Request a grazing assessment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/directory">View coverage and directory data</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm leading-6 text-emerald-100/85">
              Best suited to solar park owners, asset managers, O&amp;M teams, and land managers who need a more
              cost-conscious way to manage vegetation.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-[0_36px_120px_-40px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/sheep-solar-grazing.png"
                  alt="Sheep grazing beneath solar panels on a utility-scale solar park"
                  width={1400}
                  height={1050}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="grid gap-4 border-t border-white/10 p-6 sm:grid-cols-3">
                <div>
                  <p className="text-2xl font-semibold text-white">{solarParks}</p>
                  <p className="mt-1 text-sm text-emerald-100/80">Solar park records on public country pages</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">{sheepFarms}</p>
                  <p className="mt-1 text-sm text-emerald-100/80">Grazing partner records supporting coverage proof</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">{publicRecordCount}</p>
                  <p className="mt-1 text-sm text-emerald-100/80">Records currently surfaced on public country pages</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden max-w-xs rounded-3xl border border-emerald-200 bg-white p-5 text-slate-900 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.4)] md:block">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Service-led start</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ombaa begins with site screening and partner sourcing. The directory supports that work. It is not the
                whole product promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              A clearer operating case
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
              Built around an operational problem, not a vague platform idea
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Vegetation management is a recurring cost and a recurring site risk. Ombaa is positioning itself as a
              managed matching service first. The goal is to see whether grazing is practical on your site and, if it
              is, help move the arrangement forward.
            </p>

            <div className="mt-8 rounded-3xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Who this is for</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {audienceGroups.map((group) => (
                  <li key={group} className="flex items-start gap-3">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                    <span>{group}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-3xl border-stone-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">Recurring mowing cycles</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Many sites face repeated mowing spend across the growing season, especially on larger footprints.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-stone-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">Fire and access risk</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Vegetation control affects site safety, access, and day-to-day maintenance planning.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-stone-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">Fragmented partner search</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Finding suitable grazing partners and turning interest into a workable arrangement is still manual.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-stone-200 bg-stone-50 scroll-mt-24">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
              A simple three-step process for solar park teams
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              The first job is to understand whether grazing fits the site. Ombaa handles that as a managed process
              before anyone expects you to operate like a platform power user.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {howItWorksSteps.map((step, index) => (
              <Card key={step.title} className="rounded-3xl border-stone-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-900 text-lg font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Why sheep grazing</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
              Practical reasons solar parks look at grazing
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Grazing is not a fit for every site. Where it does fit, operators often look at it for cost control,
              vegetation management, lower disturbance, and biodiversity value.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefitCards.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card key={benefit.title} className="rounded-3xl border-stone-200 bg-stone-50">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm leading-7 text-amber-900">
            Suitability still needs to be checked site by site. Panel height, electrical layout, fencing, water, access,
            and grazing objectives all matter before a partnership should move ahead.
          </div>
        </div>
      </section>

      <section id="coverage" className="border-b border-stone-200 bg-stone-50 scroll-mt-24">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Coverage proof</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
                Directory coverage supports the service. It is not the service.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Ombaa already has working coverage data across multiple countries. That helps show where solar parks and
                grazing partners exist and where a managed introduction may be possible.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Solar park records", value: solarParks },
                  { label: "Grazing partner records", value: sheepFarms },
                  { label: "Public market records", value: publicRecordCount },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-stone-200 bg-white p-5">
                    <p className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-white p-4 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.18)] sm:p-6">
              <div className="grid gap-4">
                {markets.map((market) => (
                  <Link
                    key={market.country}
                    href={`/directory?country=${market.country.toLowerCase()}`}
                    className="rounded-3xl border border-stone-200 bg-stone-50 p-5 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-slate-900">
                          <MapPinned className="h-4 w-4 text-emerald-700" />
                          <span className="text-lg font-semibold">{market.country}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {market.solarParks} solar park records and {market.sheepFarms} grazing partner records
                        </p>
                      </div>
                      <span className="inline-flex items-center text-sm font-medium text-emerald-800">
                        View directory data
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-500">
                Public coverage on the site currently focuses on {countryCount} country markets: Netherlands, Belgium,
                France, and Germany.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="request-assessment" className="bg-[#efe8d6] scroll-mt-24">
        <div className="container mx-auto grid gap-10 px-4 py-16 md:py-20 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">Primary next step</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
              Request a grazing assessment for your solar park
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              Share the basics and Ombaa will review whether grazing looks viable for the site, whether partner coverage
              exists nearby, and what the next conversation should be.
            </p>

            <div className="mt-8 rounded-3xl border border-emerald-200 bg-white/70 p-6">
              <h3 className="text-lg font-semibold text-slate-900">What Ombaa looks at first</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {suitabilityChecks.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <NotebookTabs className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <AssessmentRequestForm />
        </div>
      </section>

      <section className="bg-[#183428] text-stone-50">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">For grazing partners</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
              Are you a shepherd or grazing contractor?
            </h2>
            <p className="mt-4 text-base leading-8 text-emerald-50/85">
              Register your interest so Ombaa can contact you when solar park opportunities fit your flock, location,
              and operating model.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-emerald-950 hover:bg-stone-100">
              <Link href="/register/shepherd">Register as a grazing partner</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/directory?listingType=shepherd">Browse partner coverage</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
