import Link from "next/link"

interface ArticleTemplateProps {
  title: string
  intro: string
  sections: Array<{ heading: string; content: string }>
  internalLinks: Array<{ href: string; label: string }>
  affiliateTitle?: string
  affiliateItems?: string[]
}

export default function ArticleTemplate({
  title,
  intro,
  sections,
  internalLinks,
  affiliateTitle,
  affiliateItems,
}: ArticleTemplateProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-5 text-base leading-8 text-slate-700">{intro}</p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold text-slate-900">{section.heading}</h2>
            <p className="mt-3 text-base leading-8 text-slate-700">{section.content}</p>
          </section>
        ))}
      </div>

      {affiliateTitle && affiliateItems?.length ? (
        <section className="mt-12 rounded-2xl border border-stone-200 bg-stone-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">{affiliateTitle}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {affiliateItems.map((item) => (
              <li key={item}>{item} (affiliate placeholder)</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12 rounded-2xl border border-stone-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Related pages</h2>
        <ul className="mt-4 space-y-2 text-sm text-emerald-800">
          {internalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
