import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ArticleTemplate from "@/components/content/article-template"
import { getArticle } from "@/lib/content"

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle("solar-grazing", params.slug)
  if (!article) return {}
  return { title: `${article.title} | Ombaa`, description: article.description }
}

export default function SolarGrazingArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle("solar-grazing", params.slug)
  if (!article) notFound()

  return (
    <ArticleTemplate
      title={article.title}
      intro={article.intro}
      sections={article.sections}
      internalLinks={[
        { href: "/find-solar-grazing-partner", label: "Find solar grazing partner" },
        { href: "/agrivoltaic-income-estimate", label: "Get feasibility estimate" },
        { href: "/equipment", label: "View equipment articles" },
      ]}
    />
  )
}
