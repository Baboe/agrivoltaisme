"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/solar-grazing", label: "Solar Grazing" },
  { href: "/agrivoltaics", label: "Agrivoltaics" },
  { href: "/find-solar-grazing-partner", label: "Find Partner" },
  { href: "/contact", label: "Contact" },
]

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95">
      <div className="container flex h-[72px] items-center justify-between px-4">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-emerald-900">
          Ombaa
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-medium text-slate-700 hover:text-emerald-800">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild className="bg-emerald-800 hover:bg-emerald-700">
            <Link href="/find-solar-grazing-partner">Request match</Link>
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px]">
            <div className="mt-8 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
