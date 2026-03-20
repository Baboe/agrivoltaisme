import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ArticleTemplate from "@/components/content/article-template"
import { getArticle } from "@/lib/content"

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle("equipment", params.slug)
  if (!article) return {}
  return { title: `${article.title} | Ombaa`, description: article.description }
}

export default function EquipmentArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle("equipment", params.slug)
  if (!article) notFound()

  return (
    <ArticleTemplate
      title={article.title}
      intro={article.intro}
      sections={article.sections}
      affiliateTitle="Recommended fencing systems"
      affiliateItems={article.affiliateItems}
      internalLinks={[
        { href: "/find-solar-grazing-partner", label: "Request a grazing partner" },
        { href: "/guides", label: "Read more guides" },
        { href: "/find-land-for-solar", label: "Find land for solar projects" },
      ]}
    />
  )
}
