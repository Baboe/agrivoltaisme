import type { Metadata } from "next"
import Link from "next/link"
import { getCategoryArticles } from "@/lib/content"

export const metadata: Metadata = {
  title: "Agrivoltaics articles | Ombaa",
  description: "Agrivoltaics planning and income articles for landowners and project teams.",
}

export default function AgrivoltaicsPage() {
  const articles = getCategoryArticles("agrivoltaics")

  return (
    <div className="container mx-auto px-4 py-14">
      <h1 className="text-4xl font-semibold text-slate-950">Agrivoltaics</h1>
      <p className="mt-4 text-slate-600">Planning, economics, and land use insights.</p>
      <div className="mt-8 grid gap-4">
        {articles.map((article) => (
          <Link key={article.slug} href={`/agrivoltaics/${article.slug}`} className="rounded-2xl border border-stone-200 p-6 hover:border-emerald-200">
            <h2 className="text-xl font-semibold text-slate-900">{article.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{article.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
