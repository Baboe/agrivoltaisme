import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ArticleTemplate from "@/components/content/article-template"
import { getArticle } from "@/lib/content"

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle("agrivoltaics", params.slug)
  if (!article) return {}
  return { title: `${article.title} | Ombaa`, description: article.description }
}

export default function AgrivoltaicsArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle("agrivoltaics", params.slug)
  if (!article) notFound()

  return (
    <ArticleTemplate
      title={article.title}
      intro={article.intro}
      sections={article.sections}
      internalLinks={[
        { href: "/agrivoltaic-income-estimate", label: "Request income estimate" },
        { href: "/find-land-for-solar", label: "Submit land for solar" },
        { href: "/guides", label: "Read practical guides" },
      ]}
    />
  )
}
