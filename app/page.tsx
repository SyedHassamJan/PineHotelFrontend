"use client"

import { useState, useEffect } from "react"
import { ChevronDown, MapPin, Plane, Car } from "lucide-react"
import { HotelCard } from "@/components/hotel-card"
import { TourCard } from "@/components/tour-card"
import { GuideCard } from "@/components/guide-card"
import { SectionHeader } from "@/components/section-header"
import Link from "next/link"

interface Hotel {
  id: string
  name: string
  email: string
  phone: string
  city: string
  country: string
  address: string
  description: string
  status: string
  images: string[]
  rooms?: any[]
}

interface HotelCardProps {
  id: string
  name: string
  image: string
  location: string
  price: number
  rating?: number
  reviews?: number
}

const POPULAR_TOURS = [
  {
    id: "1",
    name: "Alpine Adventure 7 Days",
    image: "/alpine-mountains-hiking-adventure.jpg",
    destination: "Switzerland",
    duration: 7,
    price: 1299,
    originalPrice: 1599,
    discount: 18,
  },
  {
    id: "2",
    name: "Mediterranean Cruise",
    image: "/mediterranean-sea-cruise-luxury-yacht.jpg",
    destination: "Greece",
    duration: 10,
    price: 1899,
    originalPrice: 2299,
    discount: 17,
  },
  {
    id: "3",
    name: "Safari Expedition",
    image: "/african-safari-wildlife-animals.jpg",
    destination: "Kenya",
    duration: 5,
    price: 1599,
    discount: 15,
  },
  {
    id: "4",
    name: "Japanese Cultural Journey",
    image: "/japan-temple-culture-architecture.jpg",
    destination: "Japan",
    duration: 8,
    price: 1799,
  },
]

const TOP_GUIDES = [
  {
    id: "1",
    name: "Marco Rossi",
    image: "/male-tour-guide-professional-portrait.jpg",
    languages: ["Italian", "English", "French"],
    experience: 12,
    hourlyRate: 45,
    dailyRate: 280,
    rating: 4.9,
    reviews: 87,
  },
  {
    id: "2",
    name: "Amira Hassan",
    image: "/female-tour-guide-professional-portrait.jpg",
    languages: ["Arabic", "English", "German"],
    experience: 8,
    hourlyRate: 50,
    dailyRate: 300,
    rating: 4.8,
    reviews: 62,
  },
  {
    id: "3",
    name: "Yuki Tanaka",
    image: "/asian-tour-guide-professional-portrait.jpg",
    languages: ["Japanese", "English", "Mandarin"],
    experience: 10,
    hourlyRate: 55,
    dailyRate: 320,
    rating: 4.9,
    reviews: 78,
  },
  {
    id: "4",
    name: "Sophie Martin",
    image: "/european-tour-guide-professional-portrait.jpg",
    languages: ["French", "English", "Spanish"],
    experience: 7,
    hourlyRate: 40,
    dailyRate: 260,
    rating: 4.7,
    reviews: 54,
  },
]

const DESTINATIONS = [
  {
    name: "Hunza Valley",
    country: "Pakistan",
    image: "/hunza-valley-mountains-pakistan.jpg",
  },
  {
    name: "Skardu",
    country: "Pakistan",
    image: "/skardu-lake-mountains-pakistan.jpg",
  },
  {
    name: "Fairy Meadows",
    country: "Pakistan",
    image: "/fairy-meadows-nanga-parbat-pakistan.jpg",
  },
  {
    name: "Naran",
    country: "Pakistan",
    image: "/naran-kaghan-valley-pakistan.jpg",
  },
  {
    name: "Kaghan Valley",
    country: "Pakistan",
    image: "/kaghan-valley-pakistan.jpg",
  },
  {
    name: "Swat Valley",
    country: "Pakistan",
    image: "/swat-valley-pakistan.jpg",
  },
  {
    name: "Kalam",
    country: "Pakistan",
    image: "/kalam-swat-pakistan.jpg",
  },
  {
    name: "Gilgit",
    country: "Pakistan",
    image: "/gilgit-mountains-pakistan.jpg",
  },
  {
    name: "Chitral",
    country: "Pakistan",
    image: "/chitral-valley-pakistan.jpg",
  },
  {
    name: "Shogran",
    country: "Pakistan",
    image: "/shogran-meadows-pakistan.jpg",
  },
  {
    name: "Neelum Valley",
    country: "Pakistan",
    image: "/neelum-valley-pakistan.jpg",
  },
  {
    name: "Deosai Plains",
    country: "Pakistan",
    image: "/deosai-plains-pakistan.jpg",
  },
  {
    name: "Khunjerab Pass",
    country: "Pakistan",
    image: "/khunjerab-pass-pakistan.jpg",
  },
  {
    name: "Murree",
    country: "Pakistan",
    image: "/murree-mountains-pakistan.jpg",
  },
  {
    name: "Ayubia",
    country: "Pakistan",
    image: "/ayubia-national-park-pakistan.jpg",
  },
  {
    name: "Ziarat",
    country: "Pakistan",
    image: "/placeholder.svg?height=250&width=300",
  },
]

const TOUR_DESTINATIONS = [
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

const PERSON_TYPES = ["Family Tour", "Honeymoon Tour", "Group Tour", "Adventure Tour", "Solo Tour"]

const CAR_TYPES = [
  "Honda BR-V",
  "Coaster Saloon (22 Seats)",
  "Toyota Corolla GLi",
  "Toyota Grand Cabin (13 Seater)",
  "Jeeps",
  "Toyota Revo",
  "Land Cruiser V8 ZX",
]

export default function Home() {
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<string | null>(null)
  const [showTourSubMenu, setShowTourSubMenu] = useState<"destinations" | "calendar" | "persons" | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedPersonType, setSelectedPersonType] = useState<string | null>(null)
  const [carDropdownOpen, setCarDropdownOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<string | null>(null)
  const [carRentalOption, setCarRentalOption] = useState<string | null>(null)
  const [carDays, setCarDays] = useState(1)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loadingHotels, setLoadingHotels] = useState(true)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      setLoadingHotels(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const response = await fetch(`${baseUrl}api/hotels`)
      
      if (response.ok) {
        const data = await response.json()
        // Filter only approved hotels
        const approvedHotels = data.filter((hotel: Hotel) => hotel.status === 'approved')
        
        // Fetch rooms for each hotel to get pricing
        const hotelsWithRooms = await Promise.all(
          approvedHotels.map(async (hotel: Hotel) => {
            try {
              const roomsResponse = await fetch(`${baseUrl}api/rooms/hotels/${hotel.id}/rooms`)
              if (roomsResponse.ok) {
                const rooms = await roomsResponse.json()
                return { ...hotel, rooms }
              }
              return { ...hotel, rooms: [] }
            } catch (error) {
              console.error(`Error fetching rooms for hotel ${hotel.id}:`, error)
              return { ...hotel, rooms: [] }
            }
          })
        )
        
        setHotels(hotelsWithRooms)
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoadingHotels(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Select Date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const carRentalOptions = [
    {
      id: "per-day",
      label: "Per-Day Rental",
      description: "Select number of days",
    },
    {
      id: "package",
      label: "Add Car to Package",
      description: "Matches tour/hotel duration",
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-visible">
        <picture>
          <source media="(min-width: 768px)" srcSet="" />
          <img
            src="/luxury-travel-destination.jpg"
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover md:hidden"
          />
        </picture>

        {/* Video for desktop screens */}
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          poster="/luxury-travel-destination.jpg"
        >
          <source src="https://videos.pexels.com/video-files/3195386/3195386-sd_640_360_25fps.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-foreground/40" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12 animate-fadeInUp">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 text-balance">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl sm:text-2xl text-primary-foreground mb-8 max-w-3xl mx-auto text-balance">
              Explore breathtaking destinations, book luxury hotels, and connect with expert local guides. Your perfect
              journey starts here.
            </p>
          </div>

          {/* Search Bar - Fixed positioning with proper z-index */}
          <div className="relative z-40">
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg animate-slideInDown">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <button
                    onClick={() => {
                      setToursDropdownOpen(!toursDropdownOpen)
                      setShowTourSubMenu(null)
                    }}
                    className="w-full flex items-center justify-between bg-muted rounded-lg px-4 py-3 text-foreground hover:bg-muted/80 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Plane className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="hidden sm:inline truncate">Tours</span>
                      <span className="sm:hidden text-sm">Tours</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition flex-shrink-0 ${toursDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {toursDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-max bg-card border border-border rounded-lg shadow-xl z-50">
                      <div className="flex flex-col sm:flex-row gap-2 p-4">
                        {/* Destination Button */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowTourSubMenu(showTourSubMenu === "destinations" ? null : "destinations")
                            }
                            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground transition flex items-center gap-2 whitespace-nowrap text-sm"
                          >
                            <span>{selectedTour || "Destination"}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition ${showTourSubMenu === "destinations" ? "rotate-180" : ""}`}
                            />
                          </button>

                          {showTourSubMenu === "destinations" && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                              {TOUR_DESTINATIONS.map((dest) => (
                                <button
                                  key={dest}
                                  onClick={() => {
                                    setSelectedTour(dest)
                                    setShowTourSubMenu(null)
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-primary/20 text-foreground transition text-sm"
                                >
                                  {dest}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Calendar Button */}
                        <div className="relative">
                          <button
                            onClick={() => setShowTourSubMenu(showTourSubMenu === "calendar" ? null : "calendar")}
                            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground transition flex items-center gap-2 whitespace-nowrap text-sm"
                          >
                            <span>{formatDate(selectedDate)}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition ${showTourSubMenu === "calendar" ? "rotate-180" : ""}`}
                            />
                          </button>

                          {showTourSubMenu === "calendar" && (
                            <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 p-3">
                              <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                  setSelectedDate(e.target.value)
                                  setShowTourSubMenu(null)
                                }}
                                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm"
                              />
                            </div>
                          )}
                        </div>

                        {/* Tour Type Button */}
                        <div className="relative">
                          <button
                            onClick={() => setShowTourSubMenu(showTourSubMenu === "persons" ? null : "persons")}
                            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground transition flex items-center gap-2 whitespace-nowrap text-sm"
                          >
                            <span>{selectedPersonType || "Tour Type"}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition ${showTourSubMenu === "persons" ? "rotate-180" : ""}`}
                            />
                          </button>

                          {showTourSubMenu === "persons" && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                              {PERSON_TYPES.map((type) => (
                                <button
                                  key={type}
                                  onClick={() => {
                                    setSelectedPersonType(type)
                                    setShowTourSubMenu(null)
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-primary/20 text-foreground transition text-sm"
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hotels Button */}
                <button className="flex items-center justify-between bg-muted rounded-lg px-4 py-3 text-foreground hover:bg-muted/80 transition">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="hidden sm:inline">Hotels</span>
                    <span className="sm:hidden text-sm">Hotels</span>
                  </span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </button>

                {/* Rent a Car Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setCarDropdownOpen(!carDropdownOpen)}
                    className="w-full flex items-center justify-between bg-muted rounded-lg px-4 py-3 text-foreground hover:bg-muted/80 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="hidden sm:inline truncate">
                        {carRentalOption
                          ? carRentalOption === "per-day"
                            ? `Per-Day (${carDays} days)`
                            : "Add to Package"
                          : "Rent a Car"}
                      </span>
                      <span className="sm:hidden text-sm">{carRentalOption ? "Car" : "Car"}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition flex-shrink-0 ${carDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {carDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-card border border-border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
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
                      ) : carRentalOption === "per-day" ? (
                        <>
                          <button
                            onClick={() => {
                              setCarRentalOption(null)
                              setSelectedCar(null)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-muted text-foreground transition text-sm border-b border-border font-medium"
                          >
                            ← Back to Options
                          </button>
                          <div className="px-4 py-3 border-b border-border">
                            <label className="block text-sm font-medium text-foreground mb-2">Number of Days:</label>
                            <input
                              type="number"
                              min="1"
                              max="30"
                              value={carDays}
                              onChange={(e) => setCarDays(Math.max(1, Number.parseInt(e.target.value) || 1))}
                              className="w-full px-2 py-1 border border-border rounded text-sm text-foreground bg-background"
                            />
                          </div>
                          {CAR_TYPES.map((car) => (
                            <button
                              key={car}
                              onClick={() => {
                                setSelectedCar(car)
                                setCarDropdownOpen(false)
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-muted text-foreground transition text-sm"
                            >
                              {car}
                            </button>
                          ))}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setCarRentalOption(null)
                              setSelectedCar(null)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-muted text-foreground transition text-sm border-b border-border font-medium"
                          >
                            ← Back to Options
                          </button>
                          <div className="px-4 py-3 bg-muted border-b border-border text-sm text-foreground">
                            <p className="font-medium mb-1">Car days will match your package duration</p>
                            <p className="text-xs text-muted-foreground">Price will be added to your total</p>
                          </div>
                          {CAR_TYPES.map((car) => (
                            <button
                              key={car}
                              onClick={() => {
                                setSelectedCar(car)
                                setCarDropdownOpen(false)
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

                {/* Search Button */}
                <button className="bg-primary text-primary-foreground rounded-lg px-4 py-3 font-semibold hover:bg-primary/90 transition">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discount Offers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Discount Offers</h2>
          <p className="text-lg text-muted-foreground">Exclusive deals tailored just for you</p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          <div className="group relative h-40 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all cursor-pointer p-6 flex-shrink-0 w-80">
            <img
              src="/family-vacation-discount-beach.jpg"
              alt="Family Discounts"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Family Discounts</h3>
                <p className="text-white/90">Save up to 40% on family packages</p>
              </div>
              <button className="text-white font-semibold hover:underline text-sm">Learn More →</button>
            </div>
          </div>

          <div className="group relative h-40 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all cursor-pointer p-6 flex-shrink-0 w-80">
            <img
              src="/luxury-5-star-hotel.jpg"
              alt="Hotel Deals"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Hotel Deals</h3>
                <p className="text-white/90">Exclusive rates at 5-star properties</p>
              </div>
              <button className="text-white font-semibold hover:underline text-sm">Explore Deals →</button>
            </div>
          </div>

          <div className="group relative h-40 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all cursor-pointer p-6 flex-shrink-0 w-80">
            <img
              src="/adventure-tour-mountains.jpg"
              alt="Tour Packages"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Tour Packages</h3>
                <p className="text-white/90">All-inclusive adventures at best prices</p>
              </div>
              <button className="text-white font-semibold hover:underline text-sm">View Packages →</button>
            </div>
          </div>

          <div className="group relative h-40 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all cursor-pointer p-6 flex-shrink-0 w-80">
            <img
              src="/luxury-resort-vacation.jpg"
              alt="Luxury Getaways"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Luxury Getaways</h3>
                <p className="text-white/90">Premium experiences with special offers</p>
              </div>
              <button className="text-white font-semibold hover:underline text-sm">Discover Luxury →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tour Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Popular Tour Packages"
          subtitle="Expertly curated experiences with incredible value"
          centered
        />
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {POPULAR_TOURS.map((tour) => (
            <div key={tour.id} className="flex-shrink-0 w-80">
              <TourCard {...tour} />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Popular Destinations"
          subtitle="Explore the world's most sought-after locations"
          centered
        />
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {DESTINATIONS.map((destination) => (
            <div
              key={destination.name}
              className="group relative h-64 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all cursor-pointer animate-fadeInUp flex-shrink-0 w-80"
            >
              <img
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-primary-foreground">{destination.name}</h3>
                  <p className="text-primary-foreground/80">{destination.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-0">
        <SectionHeader
          title="Featured Hotels"
          subtitle="Curated luxury accommodations for your perfect stay"
          centered
        />
        
        {loadingHotels ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : hotels.length > 0 ? (
          <>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {hotels.slice(0, 4).map((hotel) => {
                // Calculate average price from rooms if available
                const avgPrice = hotel.rooms && hotel.rooms.length > 0
                  ? hotel.rooms.reduce((sum: number, room: any) => sum + (Number(room.price) || 0), 0) / hotel.rooms.length
                  : 0

                return (
                  <div key={hotel.id} className="flex-shrink-0 w-80">
                    <HotelCard
                      id={hotel.id}
                      name={hotel.name}
                      image={hotel.images[0] || "/placeholder.svg"}
                      location={`${hotel.city}, ${hotel.country}`}
                      price={Math.round(avgPrice)}
                      rating={4.5}
                      reviews={0}
                    />
                  </div>
                )
              })}
            </div>
            
            {hotels.length > 4 && (
              <div className="flex justify-center mt-8">
                <Link
                  href="/hotels"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  View More Hotels
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No hotels available at the moment
          </div>
        )}
      </section>

      {/* Top Tour Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Top-Rated Guides"
          subtitle="Connect with expert local guides for unforgettable experiences"
          centered
        />
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {TOP_GUIDES.map((guide) => (
            <div key={guide.id} className="flex-shrink-0 w-80">
              <GuideCard {...guide} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Book Now */}
      <section className="bg-primary text-primary-foreground py-16 my-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Book Your Next Trip?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Browse thousands of hotels, tours, and expert guides to plan your perfect journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/90 transition">
              Explore Hotels
            </button>
            <button className="border-2 border-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/20 transition">
              View Tours
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section - Create Your Tour */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-border p-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Create Your Custom Tour</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Can't find your perfect itinerary? Build a custom tour tailored to your interests, budget, and travel style.
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
            Start Building
          </button>
        </div>
      </section>
    </div>
  )
}
