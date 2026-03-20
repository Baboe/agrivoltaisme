import Link from "next/link"

const footerLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/equipment", label: "Equipment" },
  { href: "/agrivoltaics", label: "Agrivoltaics" },
  { href: "/solar-grazing", label: "Solar Grazing" },
  { href: "/find-solar-grazing-partner", label: "Find Partner" },
  { href: "/find-land-for-solar", label: "Find Land for Solar" },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Ombaa</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
            Practical insights and lead matching for agrivoltaics, solar grazing, and land use with sheep.
          </p>
          <p className="mt-4 text-sm text-slate-600">info@ombaa.com</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Navigation</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-slate-700 hover:text-emerald-800">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-stone-200 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Ombaa
      </div>
    </footer>
  )
}
