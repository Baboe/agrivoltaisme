"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#coverage", label: "Coverage" },
  { href: "/directory", label: "Directory" },
  { href: "/contact", label: "Contact" },
]

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container flex h-[74px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.04em] text-emerald-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-bold tracking-[0.08em] text-emerald-900">
            O
          </span>
          <span className="hidden sm:inline">Ombaa</span>
          <span className="hidden rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-slate-500 lg:inline-flex">
            Solar parks
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-sm font-medium text-slate-600 transition-colors hover:text-emerald-800 after:absolute after:left-0 after:top-full after:mt-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-emerald-700 after:transition-transform hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="ghost"
            className="rounded-full px-5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <Link href="/register/shepherd">Grazing Partners</Link>
          </Button>
          <Button asChild className="rounded-full bg-emerald-800 px-6 text-white shadow-[0_18px_40px_-24px_rgba(6,78,59,0.7)] hover:bg-emerald-700">
            <Link href="/#request-assessment">Request Assessment</Link>
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="rounded-2xl border-stone-300">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] border-stone-200 bg-white/95 backdrop-blur-xl">
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
              <Button asChild className="mt-4 rounded-full bg-emerald-800 text-white hover:bg-emerald-700">
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
