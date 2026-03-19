import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import AssessmentRequestForm from "@/components/assessment-request-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactPageClient() {
  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Talk to Ombaa</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-5xl">
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
        <div className="container mx-auto grid gap-4 px-4 py-16 md:grid-cols-3">
          <Card className="rounded-3xl border-stone-200 bg-white">
            <CardContent className="p-6">
              <Mail className="h-6 w-6 text-emerald-700" />
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
          <Card className="rounded-3xl border-stone-200 bg-white">
            <CardContent className="p-6">
              <MapPin className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-5 text-xl font-semibold text-slate-900">Location</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Amsterdam, The Netherlands.</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-stone-200 bg-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-900">Grazing partners</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Shepherds and grazing contractors can register interest directly.
              </p>
              <Button asChild className="mt-6 bg-emerald-800 text-white hover:bg-emerald-700">
                <Link href="/register/shepherd">Register as grazing partner</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-[#efe8d6]">
        <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">Assessment request</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
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
