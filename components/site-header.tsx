"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Ombaa
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
            About
          </Link>
          <div className="relative group">
            <Link href="/directory" className="text-gray-700 hover:text-green-600 transition-colors">
              Directory
            </Link>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2">
                <Link href="/directory" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">
                  All Listings
                </Link>
                <Link href="/netherlands" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">
                  Netherlands
                </Link>
                <Link href="/belgium" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">
                  Belgium
                </Link>
                <Link href="/france" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">
                  France
                </Link>
                <Link href="/germany" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">
                  Germany
                </Link>
                <Link href="/directory?listingType=solar-farm" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">
                  Solar Parks
                </Link>
                <Link href="/directory?listingType=shepherd" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded">
                  Sheep Farms
                </Link>
              </div>
            </div>
          </div>
          <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <Link href="#waitlist">Join Waitlist</Link>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-900">Directory</span>
                  <div className="pl-4 space-y-2">
                    <Link
                      href="/directory"
                      className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      All Listings
                    </Link>
                    <Link
                      href="/netherlands"
                      className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Netherlands
                    </Link>
                    <Link
                      href="/belgium"
                      className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Belgium
                    </Link>
                    <Link
                      href="/france"
                      className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      France
                    </Link>
                    <Link
                      href="/germany"
                      className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Germany
                    </Link>
                    <Link
                      href="/directory?listingType=solar-farm"
                      className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Solar Parks
                    </Link>
                    <Link
                      href="/directory?listingType=shepherd"
                      className="block text-sm text-gray-600 hover:text-green-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sheep Farms
                    </Link>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                <Button asChild className="mt-4 w-full">
                  <Link href="#waitlist" onClick={() => setIsOpen(false)}>
                    Join Waitlist
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
