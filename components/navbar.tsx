"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [carRentalOption, setCarRentalOption] = useState<string | null>(null)

  const destinations = [
    "Hunza Valley",
    "Skardu",
    "Fairy Meadows",
    "Naran",
    "Kaghan Valley",
    "Swat Valley",
    "Kalam",
    "Gilgit",
    "Chitral",
    "Shogran",
    "Neelum Valley",
    "Astore Valley",
    "Deosai Plains",
    "Khunjerab Pass",
    "Phandar Valley",
    "Basho Valley",
    "Ratti Gali Lake",
    "Saif-ul-Malook Lake",
    "Attabad Lake",
    "Rama Meadows",
    "Murree",
    "Nathia Gali",
    "Ayubia",
    "Patriata (New Murree)",
    "Ziarat",
    "Malam Jabba",
  ]

  const cars = [
    "Honda BR-V",
    "Coaster Saloon (22 Seats)",
    "Toyota Corolla GLi",
    "Toyota Grand Cabin (13 Seater)",
    "Jeeps",
    "Toyota Revo",
    "Land Cruiser V8 ZX",
  ]

  const carRentalOptions = [
    {
      id: "per-day",
      label: "Per-Day Rental",
      description: "Select days and rent a car",
    },
    {
      id: "package",
      label: "Add Car to Package",
      description: "Auto-add to tour/hotel booking",
    },
  ]

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

          {/* Hotels Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("hotels")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-foreground hover:text-primary transition text-sm font-medium">
              Hotels <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === "hotels" && (
              <div className="absolute left-0 mt-0 w-48 bg-card border border-border rounded-lg shadow-lg animate-slideInDown">
                <Link href="/hotels" className="block px-4 py-2 hover:bg-muted text-foreground transition text-sm">
                  Browse Hotels
                </Link>
                <Link
                  href="/hotels/featured"
                  className="block px-4 py-2 hover:bg-muted text-foreground transition text-sm"
                >
                  Featured Hotels
                </Link>
              </div>
            )}
          </div>

          {/* Tours Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("tours")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-foreground hover:text-primary transition text-sm font-medium">
              Tours <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === "tours" && (
              <div className="absolute left-0 mt-0 w-48 bg-card border border-border rounded-lg shadow-lg animate-slideInDown">
                <Link href="/tours" className="block px-4 py-2 hover:bg-muted text-foreground transition text-sm">
                  Tour Packages
                </Link>
                <Link href="/create-tour" className="block px-4 py-2 hover:bg-muted text-foreground transition text-sm">
                  Create Your Tour
                </Link>
              </div>
            )}
          </div>

          {/* Destinations Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("destinations")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-foreground hover:text-primary transition text-sm font-medium">
              Destinations <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === "destinations" && (
              <div className="absolute left-0 mt-0 w-56 max-h-96 overflow-y-auto bg-card border border-border rounded-lg shadow-lg animate-slideInDown">
                {destinations.map((destination) => (
                  <Link
                    key={destination}
                    href={`/destinations/${destination.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block px-4 py-2 hover:bg-muted text-foreground transition text-sm"
                  >
                    {destination}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Cars Dropdown - CHANGED */}
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("cars")}
            onMouseLeave={() => {
              setActiveDropdown(null)
              setCarRentalOption(null)
            }}
          >
            <button className="flex items-center gap-1 text-foreground hover:text-primary transition text-sm font-medium">
              Cars <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === "cars" && (
              <div className="absolute left-0 mt-0 w-64 bg-card border border-border rounded-lg shadow-lg animate-slideInDown">
                {!carRentalOption ? (
                  <>
                    {carRentalOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setCarRentalOption(option.id)}
                        className="w-full text-left px-4 py-3 hover:bg-muted text-foreground transition border-b border-border last:border-b-0"
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setCarRentalOption(null)}
                      className="w-full text-left px-4 py-2 hover:bg-muted text-foreground transition text-sm border-b border-border font-medium"
                    >
                      ← Back
                    </button>
                    {cars.map((car) => (
                      <button
                        key={car}
                        onClick={() => {
                          setCarRentalOption(null)
                          setActiveDropdown(null)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-muted text-foreground transition text-sm"
                      >
                        {car}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <Link href="/guides" className="text-foreground hover:text-primary transition text-sm font-medium">
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
            <Link href="/guides" className="block py-2 text-foreground hover:text-primary text-sm">
              Guides
            </Link>
            <Link href="/about" className="block py-2 text-foreground hover:text-primary text-sm">
              About
            </Link>
            <Link href="/destinations" className="block py-2 text-foreground hover:text-primary text-sm">
              Destinations
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
