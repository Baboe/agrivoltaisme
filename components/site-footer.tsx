import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail, MapPin } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ombaa</h3>
            <p className="mb-4 text-gray-300">
              Europe's first one-click marketplace that swaps costly mowing for eco-friendly sheep, matched and
              monitored in real time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-white hover:text-green-400 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-green-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-gray-300 hover:text-green-400 transition-colors">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Regions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/regions/france" className="text-gray-300 hover:text-green-400 transition-colors">
                  France
                </Link>
              </li>
              <li>
                <Link href="/regions/germany" className="text-gray-300 hover:text-green-400 transition-colors">
                  Germany
                </Link>
              </li>
              <li>
                <Link href="/regions/spain" className="text-gray-300 hover:text-green-400 transition-colors">
                  Spain
                </Link>
              </li>
              <li>
                <Link href="/regions/italy" className="text-gray-300 hover:text-green-400 transition-colors">
                  Italy
                </Link>
              </li>
              <li>
                <Link href="/regions/netherlands" className="text-gray-300 hover:text-green-400 transition-colors">
                  Netherlands
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-green-400 mr-2 mt-0.5 shrink-0" />
                <span className="text-gray-300">info@ombaa.eu</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-400 mr-2 mt-0.5 shrink-0" />
                <span className="text-gray-300">Brussels, Belgium</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Ombaa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
