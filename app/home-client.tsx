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
    cardClassName: "bg-white",
    iconClassName: "bg-emerald-100 text-emerald-800",
  },
  {
    icon: Flame,
    title: "Lower vegetation and fire load",
    description:
      "Keeping grass growth under control can help reduce dry fuel build-up between and beneath panel rows.",
    cardClassName: "bg-stone-50",
    iconClassName: "bg-amber-100 text-amber-800",
  },
  {
    icon: ShieldCheck,
    title: "Add a safer maintenance rhythm",
    description:
      "A structured grazing arrangement can complement O&M planning with less machinery movement on site.",
    cardClassName: "bg-white",
    iconClassName: "bg-sky-100 text-sky-800",
  },
  {
    icon: Sprout,
    title: "Support biodiversity goals",
    description:
      "When managed well, grazing can support habitat value and reduce the disturbance of repeated mowing passes.",
    cardClassName: "bg-stone-50",
    iconClassName: "bg-lime-100 text-lime-800",
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

export default function HomeClient({ markets, solarParks, sheepFarms, total, countryCount }: HomePageProps) {
  const heroHighlights = [
    `${countryCount} public markets`,
    `${total} public coverage records`,
    "Managed review before matching",
  ]

  return (
    <div className="bg-stone-50">
      <section className="relative overflow-hidden border-b border-emerald-950/10 bg-[#163128] text-stone-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(166,230,187,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(254,240,138,0.08),_transparent_26%)]" />
        <div className="absolute inset-0 opacity-25 soft-grid" />
        <div className="container relative mx-auto grid gap-14 px-4 py-20 md:py-28 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-50 backdrop-blur-sm">
              Vegetation management support for solar parks
            </div>
            <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
              Reduce solar park vegetation costs with sheep grazing
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-emerald-50/90 md:text-xl">
              Ombaa helps solar park operators and land managers assess site fit, source grazing partners, and structure
              a workable arrangement. The focus is practical vegetation control, not marketplace hype.
            </p>

            <ul className="mt-9 space-y-3.5 text-sm text-emerald-50/90 sm:text-base">
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

            <div className="mt-11 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-6 text-emerald-950 shadow-[0_20px_45px_-24px_rgba(255,255,255,0.55)] hover:bg-stone-100"
              >
                <Link href="/#request-assessment">
                  Request a grazing assessment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/25 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/directory">View coverage and directory data</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {heroHighlights.map((item) => (
                <span key={item} className="metric-pill">
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-7 text-sm leading-6 text-emerald-100/85">
              Best suited to solar park owners, asset managers, O&amp;M teams, and land managers who need a more
              cost-conscious way to manage vegetation.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/10 shadow-[0_36px_120px_-40px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/sheep-solar-grazing.png"
                  alt="Sheep grazing beneath solar panels on a utility-scale solar park"
                  width={1400}
                  height={1050}
                  className="h-full w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f211b]/75 via-[#0f211b]/10 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-[#143126]/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 backdrop-blur-sm">
                  Service-led introduction
                </div>
                <div className="absolute bottom-5 left-5 right-5 rounded-[26px] border border-white/10 bg-[#143126]/75 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">Public solar grazing coverage</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/80">
                    Ombaa uses directory coverage to identify where introductions may be feasible across Netherlands,
                    Belgium, France, and Germany.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-3">
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold text-white">{solarParks}</p>
                  <p className="mt-1 text-sm leading-6 text-emerald-100/80">Solar park records on public country pages</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold text-white">{sheepFarms}</p>
                  <p className="mt-1 text-sm leading-6 text-emerald-100/80">Grazing partner records supporting coverage proof</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold text-white">{total}</p>
                  <p className="mt-1 text-sm leading-6 text-emerald-100/80">Records currently surfaced on public country pages</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-7 -left-6 hidden max-w-xs rounded-[30px] border border-emerald-200/90 bg-white/96 p-5 text-slate-900 shadow-[0_28px_70px_-34px_rgba(15,23,42,0.36)] md:block">
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
        <div className="container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="section-kicker">A clearer operating case</p>
            <h2 className="section-title">
              Built around an operational problem, not a vague platform idea
            </h2>
            <p className="section-copy">
              Vegetation management is a recurring cost and a recurring site risk. Ombaa is positioning itself as a
              managed matching service first. The goal is to see whether grazing is practical on your site and, if it
              is, help move the arrangement forward.
            </p>

            <div className="surface-card-soft mt-9 p-7">
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
            <Card className="surface-card overflow-hidden">
              <CardContent className="p-7">
                <div className="mb-5 h-1.5 w-14 rounded-full bg-emerald-700" />
                <h3 className="text-lg font-semibold text-slate-900">Recurring mowing cycles</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Many sites face repeated mowing spend across the growing season, especially on larger footprints.
                </p>
              </CardContent>
            </Card>
            <Card className="surface-card overflow-hidden">
              <CardContent className="p-7">
                <div className="mb-5 h-1.5 w-14 rounded-full bg-amber-600" />
                <h3 className="text-lg font-semibold text-slate-900">Fire and access risk</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Vegetation control affects site safety, access, and day-to-day maintenance planning.
                </p>
              </CardContent>
            </Card>
            <Card className="surface-card overflow-hidden">
              <CardContent className="p-7">
                <div className="mb-5 h-1.5 w-14 rounded-full bg-sky-700" />
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
        <div className="container mx-auto px-4 py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="section-kicker">How it works</p>
            <h2 className="section-title">
              A simple three-step process for solar park teams
            </h2>
            <p className="section-copy">
              The first job is to understand whether grazing fits the site. Ombaa handles that as a managed process
              before anyone expects you to operate like a platform power user.
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 lg:grid-cols-3 lg:before:absolute lg:before:left-[16.666%] lg:before:right-[16.666%] lg:before:top-11 lg:before:h-px lg:before:bg-stone-300">
            {howItWorksSteps.map((step, index) => (
              <Card key={step.title} className="surface-card relative bg-white">
                <CardContent className="p-7">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-[20px] bg-emerald-900 text-lg font-semibold text-white shadow-[0_18px_40px_-24px_rgba(6,78,59,0.7)]">
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
        <div className="container mx-auto px-4 py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="section-kicker">Why sheep grazing</p>
            <h2 className="section-title">
              Practical reasons solar parks look at grazing
            </h2>
            <p className="section-copy">
              Grazing is not a fit for every site. Where it does fit, operators often look at it for cost control,
              vegetation management, lower disturbance, and biodiversity value.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefitCards.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card key={benefit.title} className={`surface-card ${benefit.cardClassName}`}>
                  <CardContent className="p-7">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${benefit.iconClassName}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-9 rounded-[30px] border border-amber-200 bg-amber-50 px-7 py-6 text-sm leading-7 text-amber-900 shadow-[0_18px_50px_-40px_rgba(180,83,9,0.42)]">
            Suitability still needs to be checked site by site. Panel height, electrical layout, fencing, water, access,
            and grazing objectives all matter before a partnership should move ahead.
          </div>
        </div>
      </section>

      <section id="coverage" className="border-b border-stone-200 bg-stone-50 scroll-mt-24">
        <div className="container mx-auto px-4 py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="section-kicker">Coverage proof</p>
              <h2 className="section-title">
                Directory coverage supports the service. It is not the service.
              </h2>
              <p className="section-copy">
                Ombaa already has working coverage data across multiple countries. That helps show where solar parks and
                grazing partners exist and where a managed introduction may be possible.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Solar park records", value: solarParks },
                  { label: "Grazing partner records", value: sheepFarms },
                  { label: "Public market records", value: total },
                ].map((item) => (
                  <div key={item.label} className="surface-card p-6">
                    <p className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card overflow-hidden p-4 sm:p-6">
              <div className="grid gap-4">
                {markets.map((market) => (
                  <Link
                    key={market.country}
                    href={`/directory?country=${market.country.toLowerCase()}`}
                    className="rounded-[28px] border border-stone-200 bg-stone-50 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-slate-900">
                          <MapPinned className="h-4 w-4 text-emerald-700" />
                          <span className="text-lg font-semibold">{market.country}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                          <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5">
                            {market.solarParks} solar parks
                          </span>
                          <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5">
                            {market.sheepFarms} grazing partners
                          </span>
                        </div>
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

      <section id="request-assessment" className="relative overflow-hidden bg-[#efe8d6] scroll-mt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(167,243,208,0.16),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.3),transparent_45%)]" />
        <div className="container relative mx-auto grid gap-10 px-4 py-20 md:py-24 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <div>
            <p className="section-kicker text-emerald-800">Primary next step</p>
            <h2 className="section-title">
              Request a grazing assessment for your solar park
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
              Share the basics and Ombaa will review whether grazing looks viable for the site, whether partner coverage
              exists nearby, and what the next conversation should be.
            </p>

            <div className="surface-card mt-9 bg-white/75 p-7 backdrop-blur-sm">
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
        <div className="container mx-auto px-4 py-16">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-6 py-10 shadow-[0_30px_80px_-46px_rgba(0,0,0,0.55)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(167,243,208,0.12),_transparent_30%)]" />
            <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">For grazing partners</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
              Are you a shepherd or grazing contractor?
            </h2>
            <p className="mt-4 text-base leading-8 text-emerald-50/85">
              Register your interest so Ombaa can contact you when solar park opportunities fit your flock, location,
              and operating model.
            </p>
            </div>

          <div className="relative z-10 mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0">
            <Button asChild size="lg" className="rounded-full bg-white px-6 text-emerald-950 hover:bg-stone-100">
              <Link href="/register/shepherd">Register as a grazing partner</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/25 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/directory?listingType=shepherd">Browse partner coverage</Link>
            </Button>
          </div>
          </div>
        </div>
      </section>
    </div>
  )
}
