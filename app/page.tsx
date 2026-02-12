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
  const [currentVideo, setCurrentVideo] = useState(0)
  const videos = ["/vids/hero1.mp4"]
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null)

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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        {videos.map((video, index) => (
          <video
            key={video}
            autoPlay
            muted
            loop
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentVideo === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ pointerEvents: currentVideo === index ? "auto" : "none" }}
          >
            <source src={video} type="video/mp4" />
          </video>
        ))}

        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

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

      {/* Our Services & Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">Why Choose Us</h2>
          <p className="text-base text-muted-foreground">Discover what makes us your perfect travel partner</p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
          {/* Premium Hotels Card */}
          <div className="group relative h-72 rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-500 cursor-pointer flex-shrink-0 w-80 snap-center">
            <img
              src="/luxury-5-star-hotel.jpg"
              alt="Premium Hotels"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-end h-full p-6">
              <div className="mb-3">
                <div className="w-12 h-12 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border border-primary/30">
                  <Bed className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium Hotels</h3>
                <p className="text-white/90 text-sm leading-relaxed">Experience luxury with our curated collection of 5-star hotels and boutique accommodations.</p>
              </div>
            </div>
          </div>

          {/* Curated Tours Card */}
          <div className="group relative h-72 rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-500 cursor-pointer flex-shrink-0 w-80 snap-center">
            <img
              src="/adventure-tour-mountains.jpg"
              alt="Curated Tours"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-end h-full p-6">
              <div className="mb-3">
                <div className="w-12 h-12 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border border-primary/30">
                  <Plane className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Curated Tours</h3>
                <p className="text-white/90 text-sm leading-relaxed">Explore breathtaking destinations with expertly designed tour packages.</p>
              </div>
            </div>
          </div>

          {/* Expert Guides Card */}
          <div className="group relative h-72 rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-500 cursor-pointer flex-shrink-0 w-80 snap-center">
            <img
              src="/male-tour-guide-professional-portrait.jpg"
              alt="Expert Guides"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-end h-full p-6">
              <div className="mb-3">
                <div className="w-12 h-12 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border border-primary/30">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Expert Guides</h3>
                <p className="text-white/90 text-sm leading-relaxed">Connect with professional local guides who bring destinations to life.</p>
              </div>
            </div>
          </div>

          {/* Premium Fleet Card */}
          <div className="group relative h-72 rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-500 cursor-pointer flex-shrink-0 w-80 snap-center">
            <img
              src="/luxury-resort-vacation.jpg"
              alt="Premium Fleet"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-end h-full p-6">
              <div className="mb-3">
                <div className="w-12 h-12 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border border-primary/30">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Premium Fleet</h3>
                <p className="text-white/90 text-sm leading-relaxed">Travel in comfort with our diverse fleet of well-maintained vehicles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-transparent to-muted/30">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3 animate-fadeInUp">Featured Cars</h2>
          <p className="text-base text-muted-foreground animate-fadeInUp" style={{animationDelay: '0.1s'}}>Travel in style with our premium fleet</p>
        </div>
        
        {loadingCars ? (
            <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 h-96 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
        ) : cars.length > 0 ? (
          <>
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {cars.slice(0, 4).map((car, index) => (
                <div key={car.id} className="flex-shrink-0 w-80 group snap-center animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                   <div className="h-full rounded-2xl overflow-hidden border border-border hover:border-primary/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-2 hover:scale-[1.02]">
                      <div className="h-52 relative bg-muted overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                        <img 
                          src={car.images && car.images.length > 0 ? car.images[0] : "/placeholder.svg"} 
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                        />
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg z-20 transform group-hover:scale-110 transition-transform duration-300">
                           {car.hasDriver ? "Driver Optional" : "Self Drive"}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-card to-card/50">
                         <div className="mb-3">
                            <h3 className="font-bold text-xl line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-300">{car.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-primary" /> {car.city}
                            </p>
                         </div>
                         <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed">
                            {car.description}
                         </p>
                         <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                            <div>
                               <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
                               <p className="font-bold text-primary text-2xl">${car.pricePerDay}</p>
                            </div>
                            <Link href={`/cars/${car.id}`} className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-110">
                               Book Now
                            </Link>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
            {cars.length > 4 && (
              <div className="flex justify-center mt-8 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <Link
                  href="/cars"
                  className="px-8 py-2.5 w-full sm:w-auto text-center border border-primary/30 bg-background hover:bg-primary hover:text-primary-foreground text-sm font-semibold rounded-md transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
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
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3 animate-fadeInUp">Featured Tours</h2>
          <p className="text-base text-muted-foreground animate-fadeInUp" style={{animationDelay: '0.1s'}}>Discover amazing tour packages</p>
        </div>
        {loadingTours ? (
           <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
           </div>
        ) : tours.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {tours.slice(0, 4).map((tour, index) => {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
                const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
                const imageUrl = tour.cardImages && tour.cardImages.length > 0 
                  ? (tour.cardImages[0].startsWith('http') ? tour.cardImages[0] : `${normalizedBaseUrl}${tour.cardImages[0]}`)
                  : '/placeholder.svg'
                
                return (
                  <div key={tour.id} className="group border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl transition-all duration-500 bg-card transform hover:-translate-y-2 hover:scale-[1.02] animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img
                        src={imageUrl}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg z-20">
                        {tour.durationDays}D / {tour.durationNights}N
                      </div>
                    </div>
                    <div className="p-5 space-y-3 bg-gradient-to-b from-card to-card/50">
                      <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300">{tour.title}</h3>
                      {tour.shortDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{tour.shortDescription}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="line-clamp-1">{tour.city || tour.locations?.[0] || 'Multiple Locations'}</span>
                      </div>
                      {(tour.tourStartDate || tour.tourEndDate) && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                          <Calendar className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {tour.tourStartDate ? new Date(tour.tourStartDate).toLocaleDateString() : 'N/A'} 
                            {' - '} 
                            {tour.tourEndDate ? new Date(tour.tourEndDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-xs text-muted-foreground">From</span>
                          <div className="text-xl font-bold text-primary">${tour.pricePerPerson}</div>
                          <span className="text-xs text-muted-foreground">per person</span>
                        </div>
                        <Link
                          href={`/tours/${tour.id}`}
                          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 text-sm font-bold shadow-md hover:shadow-xl transform hover:scale-110"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center mt-8 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <Link
                href="/tours"
                className="px-8 py-3 w-full sm:w-auto text-center border border-primary/30 bg-background hover:bg-primary hover:text-primary-foreground text-sm font-semibold rounded-md transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
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
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10">
          {DESTINATIONS.map((destination) => (
            <div
              key={destination.name}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                hoveredDestination === destination.name ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                className="w-full h-full object-cover scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/50"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Popular Destinations
            </h2>
            <p className="text-base text-muted-foreground">Explore Pakistan's most breathtaking locations</p>
          </div>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">
              {DESTINATIONS.map((destination, index) => (
                <div
                  key={destination.name}
                  onMouseEnter={() => setHoveredDestination(destination.name)}
                  onMouseLeave={() => setHoveredDestination(null)}
                  className="group relative h-64 rounded-xl overflow-hidden border border-border hover:border-primary/50 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex-shrink-0 w-56 snap-center transform hover:-translate-y-2 hover:scale-105"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                  }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="mb-2">
                        <MapPin className="w-4 h-4 text-primary mb-1" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">
                        {destination.name}
                      </h3>
                      <p className="text-white/90 text-xs font-medium">{destination.country}</p>
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <button className="px-3 py-1 bg-primary/90 hover:bg-primary text-white rounded-md font-semibold text-xs backdrop-blur-sm border border-primary/30 transform hover:scale-105 transition-all duration-300">
                          Explore Now →
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Decorative corner accent */}
                  <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-primary/40 group-hover:border-primary transition-colors duration-500"></div>
                </div>
              ))}
            </div>
            {/* Scroll indicators */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-24 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-0 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3 animate-fadeInUp">Featured Hotels</h2>
          <p className="text-base text-muted-foreground animate-fadeInUp" style={{animationDelay: '0.1s'}}>Curated luxury accommodations for your perfect stay</p>
        </div>
        
        {loadingHotels ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 h-96 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : hotels.length > 0 ? (
          <>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {hotels.slice(0, 4).map((hotel, index) => {
                // Calculate average price from rooms if available
                const avgPrice = hotel.rooms && hotel.rooms.length > 0
                  ? hotel.rooms.reduce((sum: number, room: any) => sum + (Number(room.price) || 0), 0) / hotel.rooms.length
                  : 0

                return (
                  <div key={hotel.id} className="flex-shrink-0 w-80 snap-center animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="h-full rounded-2xl overflow-hidden border border-border hover:border-primary/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group">
                      <div className="h-56 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                        <img 
                          src={hotel.images[0] || "/placeholder.svg"}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                        />
                        {hotel.hotelRank && (
                          <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg z-20 transform group-hover:scale-110 transition-transform duration-300">
                            {hotel.hotelRank} Star
                          </div>
                        )}
                      </div>
                      <div className="p-5 bg-gradient-to-b from-card to-card/50">
                        <h3 className="font-bold text-xl line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-300">{hotel.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-primary" /> {`${hotel.city}, ${hotel.country}`}
                        </p>
                        {hotel.numberOfRooms && (
                          <p className="text-xs text-muted-foreground mb-4">{hotel.numberOfRooms} Rooms Available</p>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <span className="text-xs text-muted-foreground mb-1 block">Starting from</span>
                            <span className="text-2xl font-bold text-primary">${Math.round(avgPrice)}</span>
                            <span className="text-xs text-muted-foreground">/night</span>
                          </div>
                          <Link
                            href={`/hotels/${hotel.id}`}
                            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-xl transform hover:scale-110"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {hotels.length > 4 && (
              <div className="flex justify-center mt-8 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <Link
                  href="/hotels"
                  className="px-8 py-2.5 w-full sm:w-auto text-center border border-primary/30 bg-background hover:bg-primary hover:text-primary-foreground text-sm font-semibold rounded-md transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
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
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3 animate-fadeInUp">Top-Rated Guides</h2>
          <p className="text-base text-muted-foreground animate-fadeInUp" style={{animationDelay: '0.1s'}}>Connect with expert local guides for unforgettable experiences</p>
        </div>
        {loadingGuides ? (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 h-[500px] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : guides.length > 0 ? (
          <>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {guides.slice(0, 4).map((guide, index) => {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
                const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
                const imageUrl = guide.images && guide.images.length > 0 
                  ? (guide.images[0].startsWith('http') ? guide.images[0] : `${normalizedBaseUrl}${guide.images[0]}`)
                  : '/placeholder.svg'

                return (
                  <div key={guide.id} className="flex-shrink-0 w-80 snap-center animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="h-full rounded-2xl overflow-hidden border border-border hover:border-primary/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group">
                      <div className="h-64 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                        <img 
                          src={imageUrl}
                          alt={guide.name}
                          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                        />
                        <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg z-20 transform group-hover:scale-110 transition-transform duration-300">
                          {guide.experienceYears}+ Years
                        </div>
                      </div>
                      <div className="p-5 bg-gradient-to-b from-card to-card/50">
                        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300">{guide.name}</h3>
                        {guide.languages && guide.languages.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {guide.languages.slice(0, 3).map((lang: string) => (
                              <span key={lang} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                                {lang}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <span className="text-xs text-muted-foreground mb-1 block">Daily Rate</span>
                            <span className="text-2xl font-bold text-primary">${guide.pricePerDay}</span>
                          </div>
                          <Link
                            href={`/tour-guides/${guide.id}`}
                            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-xl transform hover:scale-110"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/tour-guides"
                className="px-8 py-2.5 w-full sm:w-auto text-center border border-primary/30 bg-background hover:bg-primary hover:text-primary-foreground text-sm font-semibold rounded-md transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
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
      <section className="relative bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground py-16 my-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Next Adventure?</h2>
          <p className="text-base text-primary-foreground/95 mb-8 max-w-3xl mx-auto leading-relaxed">
            Browse thousands of hotels, tours, and expert guides to plan your perfect journey. Your dream destination awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hotels" className="bg-background text-foreground px-8 py-2.5 rounded-md font-semibold hover:bg-background/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Explore Hotels
            </Link>
            <Link href="/tours" className="border-2 border-primary-foreground bg-transparent text-primary-foreground px-8 py-2.5 rounded-md font-semibold hover:bg-primary-foreground hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              View Tours
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Create Your Tour */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-10">
        <div className="relative bg-gradient-to-br from-secondary/20 via-primary/10 to-primary/20 rounded-xl border border-primary/20 p-12 text-center overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Create Your Custom Tour</h2>
            <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Can't find your perfect itinerary? Build a custom tour tailored to your interests, budget, and travel style with our expert team.
            </p>
            <Link href="/create-tour" className="inline-block bg-primary text-primary-foreground px-8 py-2.5 rounded-md font-semibold hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
              Start Building Your Dream Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
