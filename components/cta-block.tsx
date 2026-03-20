import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CtaBlockProps {
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function CtaBlock({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CtaBlockProps) {
  return (
    <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 sm:p-10">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-emerald-800 hover:bg-emerald-700">
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
        {secondaryLabel && secondaryHref ? (
          <Button asChild variant="outline">
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  )
}
