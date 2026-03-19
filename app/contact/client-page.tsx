import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import AssessmentRequestForm from "@/components/assessment-request-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactPageClient() {
  return (
    <div className="min-h-screen bg-stone-50">
      <section className="relative overflow-hidden border-b border-stone-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(167,243,208,0.14),_transparent_28%)]" />
        <div className="container relative mx-auto px-4 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="section-kicker">Talk to Ombaa</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 md:text-5xl">
              A direct route for solar park teams and grazing partners
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Use the assessment form if you want Ombaa to review a solar park. If you are a shepherd or grazing
              contractor, register your interest so we can contact you about suitable opportunities.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-stone-50">
        <div className="container mx-auto grid gap-4 px-4 py-20 md:grid-cols-3">
          <Card className="surface-card">
            <CardContent className="p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-900">Email</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                For direct questions, email{" "}
                <a href="mailto:info@ombaa.eu" className="font-medium text-emerald-800 hover:text-emerald-700">
                  info@ombaa.eu
                </a>
                .
              </p>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardContent className="p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-900">Location</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Amsterdam, The Netherlands.</p>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardContent className="p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Grazing partners</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Shepherds and grazing contractors can register interest directly.
              </p>
              <Button asChild className="mt-6 rounded-full bg-emerald-800 px-6 text-white hover:bg-emerald-700">
                <Link href="/register/shepherd">Register as grazing partner</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#efe8d6]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(167,243,208,0.16),_transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.3),transparent_45%)]" />
        <div className="container relative mx-auto grid gap-10 px-4 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="section-kicker text-emerald-800">Assessment request</p>
            <h2 className="section-title">
              Request a grazing assessment
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              This is the best next step if you operate a solar park and want to discuss vegetation management through
              sheep grazing.
            </p>
          </div>

          <AssessmentRequestForm submitLabel="Send assessment request" />
        </div>
      </section>
    </div>
  )
}
