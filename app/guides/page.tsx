import type { Metadata } from "next"
import Link from "next/link"
import { getCategoryArticles } from "@/lib/content"

export const metadata: Metadata = {
  title: "Solar grazing guides | Ombaa",
  description: "Guides for farmers, landowners, and solar park owners working in agrivoltaics and solar grazing.",
}

export default function GuidesPage() {
  const articles = getCategoryArticles("guides")

  return (
    <div className="container mx-auto px-4 py-14">
      <h1 className="text-4xl font-semibold text-slate-950">Guides</h1>
      <p className="mt-4 text-slate-600">Practical articles focused on income, contracts, and operations.</p>
      <div className="mt-8 grid gap-4">
        {articles.map((article) => (
          <Link key={article.slug} href={`/guides/${article.slug}`} className="rounded-2xl border border-stone-200 p-6 hover:border-emerald-200">
            <h2 className="text-xl font-semibold text-slate-900">{article.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{article.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
