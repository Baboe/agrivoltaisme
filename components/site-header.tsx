"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/directory", label: "Coverage" },
  { href: "/contact", label: "Contact" },
]

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-semibold tracking-[-0.04em] text-emerald-900">
          Ombaa
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" className="text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">
            <Link href="/register/shepherd">Grazing Partners</Link>
          </Button>
          <Button asChild className="bg-emerald-800 text-white hover:bg-emerald-700">
            <Link href="/#request-assessment">Request Assessment</Link>
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="border-stone-300">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] border-stone-200 bg-white">
            <div className="mt-8 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-2xl px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/register/shepherd"
                className="rounded-2xl px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                onClick={() => setIsOpen(false)}
              >
                Grazing Partners
              </Link>
              <Button asChild className="mt-4 bg-emerald-800 text-white hover:bg-emerald-700">
                <Link href="/#request-assessment" onClick={() => setIsOpen(false)}>
                  Request Assessment
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
