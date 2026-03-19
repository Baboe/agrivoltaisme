import Link from "next/link"

const footerLinks = [
  { href: "/#request-assessment", label: "Request Assessment" },
  { href: "/directory", label: "Coverage" },
  { href: "/register/shepherd", label: "Register as Grazing Partner" },
  { href: "/contact", label: "Contact" },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-emerald-950/10 bg-[#163128] text-stone-50">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr]">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">Ombaa</h2>
          <p className="mt-4 text-sm leading-7 text-emerald-50/80">
            Practical grazing support for solar parks. Ombaa helps operators assess site fit, find grazing partners,
            and move toward workable vegetation management arrangements.
          </p>
          <p className="mt-6 text-sm text-emerald-100/80">
            Contact:{" "}
            <a href="mailto:info@ombaa.eu" className="font-medium text-white hover:text-emerald-200">
              info@ombaa.eu
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Navigation</h3>
          <div className="mt-5 grid gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-emerald-50/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 text-sm text-emerald-50/60">
          &copy; {new Date().getFullYear()} Ombaa. Vegetation management support for solar parks.
        </div>
      </div>
    </footer>
  )
}
