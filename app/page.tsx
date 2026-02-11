"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, MapPin, Plane, Car, Search, Users, Bed, Calendar } from "lucide-react"
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
  hotelRank?: number
  numberOfRooms?: number
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
  hotelRank?: number
  numberOfRooms?: number
}

interface Tour {
  id: string
  title: string
  slug: string | null
  shortDescription: string
  description: string
  durationDays: number
  durationNights: number
  city: string
  locations: string[]
  pricePerPerson: number
  includes: string[]
  excludes: string[]
  cardImages: string[]
  status: string
  createdAt: string
  updatedAt: string
  tourStartDate?: string
  tourEndDate?: string
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
  const router = useRouter() // Import useRouter
  const [activeTab, setActiveTab] = useState("hotel")
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<string | null>(null)
  const [showTourSubMenu, setShowTourSubMenu] = useState<"destinations" | "calendar" | "persons" | null>(null)
  
  // Search State
  const [city, setCity] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState("")

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedPersonType, setSelectedPersonType] = useState<string | null>(null)
  const [carDropdownOpen, setCarDropdownOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<string | null>(null)
  const [carRentalOption, setCarRentalOption] = useState<string | null>(null)
  const [carDays, setCarDays] = useState(1)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loadingHotels, setLoadingHotels] = useState(true)
  const [cars, setCars] = useState<any[]>([])
  const [loadingCars, setLoadingCars] = useState(true)
  const [tours, setTours] = useState<Tour[]>([])
  const [loadingTours, setLoadingTours] = useState(true)
  const [guides, setGuides] = useState<any[]>([])
  const [loadingGuides, setLoadingGuides] = useState(true)

  useEffect(() => {
    // Set default dates
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 3)
    
    setCheckInDate(tomorrow.toISOString().split('T')[0])
    setCheckOutDate(dayAfter.toISOString().split('T')[0])
    setGuests("2")
    
    fetchHotels()
    fetchCars()
    fetchTours()
    fetchGuides()
  }, [])

  const handleSearch = () => {
    // Basic validation
    if (!city || !checkInDate || !checkOutDate) {
        // You would typically show a toast/alert here
        alert("Please fill in all required fields (City, Dates)")
        return
    }

    const params = new URLSearchParams()
    
    if (activeTab === "hotel") {
       params.append("city", city)
       params.append("checkIn", checkInDate)
       params.append("checkOut", checkOutDate)
       if (guests) params.append("guests", guests)
       router.push(`/search/hotels?${params.toString()}`)
    } else if (activeTab === "car") {
       params.append("pickupDate", checkInDate)
       params.append("dropoffDate", checkOutDate)
       params.append("city", city)
       router.push(`/search/cars?${params.toString()}`)
    }
  }

  const fetchCars = async () => {
    try {
      setLoadingCars(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/cars`)
      if (response.ok) {
        const data = await response.json()
        const carsData = Array.isArray(data) ? data : (data.data || [])
        setCars(carsData)
      }
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoadingCars(false)
    }
  }

  const fetchTours = async () => {
    try {
      setLoadingTours(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tours?limit=4`)
      if (response.ok) {
        const data = await response.json()
        const toursData = Array.isArray(data) ? data : (data.data || [])
        setTours(toursData)
      }
    } catch (error) {
      console.error("Error fetching tours:", error)
    } finally {
      setLoadingTours(false)
    }
  }

  const fetchHotels = async () => {
    try {
      setLoadingHotels(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/hotels`)
      
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

  const fetchGuides = async () => {
    try {
      setLoadingGuides(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tour-guides?limit=4`)
      if (response.ok) {
        const data = await response.json()
        const guidesData = Array.isArray(data) ? data : (data.data || [])
        setGuides(guidesData)
      }
    } catch (error) {
      console.error("Error fetching guides:", error)
    } finally {
      setLoadingGuides(false)
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
              <div className="flex flex-col gap-4">
                
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-2">
                   <button 
                      onClick={() => setActiveTab("hotel")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "hotel" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                   >
                      <Bed className="w-4 h-4" /> Hotels
                   </button>
                   <button 
                      onClick={() => setActiveTab("car")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "car" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                   >
                      <Car className="w-4 h-4" /> Cars
                   </button>
                </div>

                {/* Search Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* City Input */}
                  <div className="relative">
                     <div className="flex items-center bg-muted rounded-lg px-4 py-3 border border-transparent focus-within:border-primary transition h-full">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mr-2" />
                        <input 
                          type="text" 
                          placeholder={activeTab === "hotel" ? "Where to?" : "Pickup City"}
                          className="bg-transparent border-none outline-none text-foreground placeholder-muted-foreground w-full text-sm font-medium"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                     </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-2">
                     <div className="flex flex-col justify-center bg-muted rounded-lg px-3 py-1 border border-transparent focus-within:border-primary transition h-full">
                        <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{activeTab === "hotel" ? "Check In" : "Pickup Date"}</label>
                        <input 
                          type="date" 
                          className="bg-transparent border-none outline-none text-foreground text-xs font-semibold w-full p-0"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                        />
                     </div>
                     <div className="flex flex-col justify-center bg-muted rounded-lg px-3 py-1 border border-transparent focus-within:border-primary transition h-full">
                        <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{activeTab === "hotel" ? "Check Out" : "Dropoff Date"}</label>
                        <input 
                          type="date" 
                          className="bg-transparent border-none outline-none text-foreground text-xs font-semibold w-full p-0"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                        />
                     </div>
                  </div>

                  {/* Guests Input */}
                   <div className="relative">
                      {activeTab === "hotel" ? (
                         <div className="flex items-center bg-muted rounded-lg px-4 py-3 border border-transparent focus-within:border-primary transition h-full">
                            <Users className="w-5 h-5 text-primary flex-shrink-0 mr-2" />
                             <input 
                              type="number" 
                              min="1"
                              placeholder="Guests" 
                              className="bg-transparent border-none outline-none text-foreground placeholder-muted-foreground w-full text-sm font-medium"
                              value={guests}
                              onChange={(e) => setGuests(e.target.value)}
                            />
                         </div>
                      ) : (
                         <div className="hidden md:block"></div>
                      )}
                  </div>

                  {/* Search Button */}
                  <button 
                    onClick={handleSearch}
                    className="bg-primary text-primary-foreground rounded-lg px-4 py-3 font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
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

      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Featured Cars"
          subtitle="Travel in style with our premium fleet"
          centered
        />
        
        {loadingCars ? (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
        ) : cars.length > 0 ? (
          <>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {cars.slice(0, 4).map((car) => (
                <div key={car.id} className="flex-shrink-0 w-80 group">
                   <div className="h-full rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-lg transition-all flex flex-col">
                      <div className="h-48 relative bg-muted overflow-hidden">
                        <img 
                          src={car.images && car.images.length > 0 ? car.images[0] : "/placeholder.svg"} 
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                           {car.hasDriver ? "Driver Optional" : "Self Drive"}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                         <div className="mb-2">
                            <h3 className="font-bold text-lg line-clamp-1">{car.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {car.city}
                            </p>
                         </div>
                         <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                            {car.description}
                         </p>
                         <div className="mt-auto pt-4 flex items-center justify-between border-t bg-muted/20 -mx-4 -mb-4 p-4">
                            <div>
                               <p className="text-xs text-muted-foreground">Daily Rate</p>
                               <p className="font-bold text-primary text-lg">${car.pricePerDay}</p>
                            </div>
                            <Link href={`/cars/${car.id}`} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                               Book Now
                            </Link>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
            {cars.length > 4 && (
              <div className="flex justify-center mt-8">
                <Link
                  href="/cars"
                  className="px-8 py-3 w-full sm:w-auto text-center border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded-md transition-colors"
                >
                  View All Cars
                </Link>
              </div>
            )}
          </>
        ) : (
           <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">No cars available at the moment</div>
        )}
      </section>

      {/* Featured Tours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Featured Tours"
          subtitle="Discover amazing tour packages"
          centered
        />
        {loadingTours ? (
           <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
           </div>
        ) : tours.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {tours.slice(0, 4).map((tour) => {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
                const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
                const imageUrl = tour.cardImages && tour.cardImages.length > 0 
                  ? (tour.cardImages[0].startsWith('http') ? tour.cardImages[0] : `${normalizedBaseUrl}${tour.cardImages[0]}`)
                  : '/placeholder.svg'
                
                return (
                  <div key={tour.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all bg-card">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <img
                        src={imageUrl}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-lg line-clamp-1">{tour.title}</h3>
                      {tour.shortDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{tour.shortDescription}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{tour.city || tour.locations?.[0] || 'Multiple Locations'}</span>
                      </div>
                      {tour.durationDays > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {tour.durationDays} Days / {tour.durationNights} Nights
                        </div>
                      )}
                      {(tour.tourStartDate || tour.tourEndDate) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t mt-3">
                          <Calendar className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {tour.tourStartDate ? new Date(tour.tourStartDate).toLocaleDateString() : 'N/A'} 
                            {' - '} 
                            {tour.tourEndDate ? new Date(tour.tourEndDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <span className="text-xs text-muted-foreground">From</span>
                          <div className="text-lg font-bold text-primary">${tour.pricePerPerson}</div>
                          <span className="text-xs text-muted-foreground">per person</span>
                        </div>
                        <Link
                          href={`/tours/${tour.id}`}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition text-sm font-medium"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/tours"
                className="px-8 py-3 w-full sm:w-auto text-center border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded-md transition-colors"
              >
                View All Tours
              </Link>
            </div>
          </>
        ) : (
           <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">No tours available at the moment</div>
        )}
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
                      hotelRank={hotel.hotelRank}
                      numberOfRooms={hotel.numberOfRooms}
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Top-Rated Guides"
          subtitle="Connect with expert local guides for unforgettable experiences"
          centered
        />
        {loadingGuides ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 h-[500px] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : guides.length > 0 ? (
          <>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {guides.slice(0, 4).map((guide) => {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
                const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
                const imageUrl = guide.images && guide.images.length > 0 
                  ? (guide.images[0].startsWith('http') ? guide.images[0] : `${normalizedBaseUrl}${guide.images[0]}`)
                  : '/placeholder.svg'

                return (
                  <div key={guide.id} className="flex-shrink-0 w-80">
                    <GuideCard 
                      id={guide.id}
                      name={guide.name}
                      image={imageUrl}
                      languages={guide.languages}
                      experience={guide.experienceYears}
                      dailyRate={guide.pricePerDay}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/tour-guides"
                className="px-8 py-3 w-full sm:w-auto text-center border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded-md transition-colors"
              >
                View All Guides
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
            No guides available at the moment
          </div>
        )}
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
