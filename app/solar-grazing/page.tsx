import type { Metadata } from "next"
import Link from "next/link"
import { getCategoryArticles } from "@/lib/content"

export const metadata: Metadata = {
  title: "Solar grazing articles | Ombaa",
  description: "Solar grazing how-to content for contracts, operations, and partner matching.",
}

export default function SolarGrazingPage() {
  const articles = getCategoryArticles("solar-grazing")

  return (
    <div className="container mx-auto px-4 py-14">
      <h1 className="text-4xl font-semibold text-slate-950">Solar Grazing</h1>
      <p className="mt-4 text-slate-600">How-to content for practical sheep grazing deployment.</p>
      <div className="mt-8 grid gap-4">
        {articles.map((article) => (
          <Link key={article.slug} href={`/solar-grazing/${article.slug}`} className="rounded-2xl border border-stone-200 p-6 hover:border-emerald-200">
            <h2 className="text-xl font-semibold text-slate-900">{article.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{article.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
