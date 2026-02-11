"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)






  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: Logo on left, List Your Hotel on right */}
        <div className="flex items-center justify-between py-3">
          {/* Logo Section - Top Left */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">Pine Travel</span>
          </Link>

          {/* CTA Button & Mobile Toggle - Top Right */}
          <div className="flex items-center gap-4">
            <Link
              href="/list-hotel"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition font-semibold text-sm whitespace-nowrap"
            >
              Register Your Hotel
            </Link>
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center gap-6 py-3 mb-2">
          <Link href="/" className="text-foreground hover:text-primary transition text-sm font-medium">
            Home
          </Link>

          <Link href="/hotels" className="text-foreground hover:text-primary transition text-sm font-medium">
            Hotels
          </Link>

          <Link href="/tours" className="text-foreground hover:text-primary transition text-sm font-medium">
            Tours
          </Link>

          <Link href="/cars" className="text-foreground hover:text-primary transition text-sm font-medium">
            Cars
          </Link>

          <Link href="/tour-guides" className="text-foreground hover:text-primary transition text-sm font-medium">
            Guides
          </Link>

          <Link href="/about" className="text-foreground hover:text-primary transition text-sm font-medium">
            About
          </Link>

          <Link href="/contact" className="text-foreground hover:text-primary transition text-sm font-medium">
            Contact
          </Link>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border animate-slideInDown">
            <Link href="/" className="block py-2 text-foreground hover:text-primary text-sm">
              Home
            </Link>
            <Link href="/hotels" className="block py-2 text-foreground hover:text-primary text-sm">
              Hotels
            </Link>
            <Link href="/tours" className="block py-2 text-foreground hover:text-primary text-sm">
              Tours
            </Link>
            <Link href="/tour-guides" className="block py-2 text-foreground hover:text-primary text-sm">
              Guides
            </Link>
            <Link href="/about" className="block py-2 text-foreground hover:text-primary text-sm">
              About
            </Link>
            <Link href="/cars" className="block py-2 text-foreground hover:text-primary text-sm">
              Cars
            </Link>
            <Link href="/contact" className="block py-2 text-foreground hover:text-primary text-sm">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
