"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  Home, 
  Calendar, 
  DollarSign, 
  Users, 
  Settings,
  LogOut,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  Clock,
  CheckCircle,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  X as CloseIcon
} from "lucide-react"
import Link from "next/link"

interface Room {
  id: string
  roomType: string
  description?: string
  maxGuests: number
  quantity: number
  bedType?: string
  amenities: (string | { id: string; name: string; hotelId?: string; createdAt?: string; updatedAt?: string })[]
  images?: string[]
}

export default function HotelOwnerDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCarousel, setShowCarousel] = useState(false)
  const [carouselImages, setCarouselImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const hotelOwnerAuth = localStorage.getItem("hotelOwnerAuth")
    const userStr = localStorage.getItem("user")
    
    if (!hotelOwnerAuth) {
      router.push("/admin/login")
    } else {
      const auth = JSON.parse(hotelOwnerAuth)
      setOwnerEmail(auth.email)
      
      // Get user name and ID from user object
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setUserName(user.name || user.email || "Hotel Owner")
          setUserId(user.id || user._id || "")
        } catch (error) {
          console.error("Error parsing user data", error)
          setUserName(auth.email)
        }
      } else {
        setUserName(auth.email)
      }
      
      setIsAuthenticated(true)
    }
  }, [router])

  // Fetch rooms when userId is available
  useEffect(() => {
    const fetchRooms = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
        const response = await fetch(`${baseUrl}api/rooms/hotels/${userId}/rooms`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch rooms')
        }

        const data = await response.json()
        console.log("Fetched rooms data:", data)
        setRooms(Array.isArray(data) ? data : [])
        setError("")
      } catch (err) {
        console.error("Error fetching rooms:", err)
        setError("Failed to load rooms")
        setRooms([])
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [userId])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/admin/login")
  }

  const openCarousel = (images: string[], startIndex: number = 0) => {
    setCarouselImages(images)
    setCurrentImageIndex(startIndex)
    setShowCarousel(true)
  }

  const closeCarousel = () => {
    setShowCarousel(false)
    setCarouselImages([])
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showCarousel) return
      
      if (e.key === 'Escape') {
        closeCarousel()
      } else if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showCarousel, carouselImages.length])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const recentBookings = [
    { id: 1, hotel: "Grand Plaza Hotel", room: "Deluxe Suite", guest: "John Doe", checkIn: "Jan 25, 2026", nights: 3, amount: "$897" },
    { id: 2, hotel: "Beach Resort Paradise", room: "Ocean View", guest: "Sarah Smith", checkIn: "Jan 26, 2026", nights: 5, amount: "$945" },
    { id: 3, hotel: "Grand Plaza Hotel", room: "Standard Room", guest: "Mike Johnson", checkIn: "Jan 27, 2026", nights: 2, amount: "$598" },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r min-h-screen sticky top-0">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Hotel Owner</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/my-hotels"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <Building2 className="w-5 h-5" />
              My Hotels
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <Calendar className="w-5 h-5" />
              Bookings
            </Link>
            <Link
              href="/admin/rooms"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <BedDouble className="w-5 h-5" />
              Rooms
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          {/* User Info & Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-3 bg-accent rounded-lg mb-3">
              <p className="text-sm font-medium truncate">{ownerEmail}</p>
              <p className="text-xs text-muted-foreground">Hotel Owner</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar with User Info */}
        <div className="bg-white dark:bg-gray-950 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
              <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your hotels today.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{ownerEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-accent transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <BedDouble className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-xs text-green-600 font-medium">{loading ? "..." : "Active"}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {loading ? "..." : rooms.reduce((sum, r) => sum + r.quantity, 0)}
              </h3>
              <p className="text-sm text-muted-foreground">Total Rooms</p>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-xs text-green-600 font-medium">Types</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {loading ? "..." : rooms.length}
              </h3>
              <p className="text-sm text-muted-foreground">Room Types</p>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xs text-green-600 font-medium">+12%</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">77</h3>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-xs text-green-600 font-medium">+18%</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">$21,400</h3>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Rooms</h2>
              <div className="flex items-center gap-3">
                <Link 
                  href="/admin/rooms/add" 
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Room
                </Link>
                <Link href="/admin/rooms" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <BedDouble className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading rooms...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-12">
                <BedDouble className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No rooms found</p>
                <Link 
                  href="/admin/rooms/add" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Room
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.slice(0, 5).map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div 
                        className="relative w-16 h-16 bg-gradient-to-br from-orange-500/20 to-primary/20 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer group"
                        onClick={() => room.images && room.images.length > 0 && openCarousel(room.images)}
                      >
                        {room.images && room.images.length > 0 ? (
                          <>
                            <img src={room.images[0]} alt={room.roomType} className="w-full h-full object-cover" />
                            {room.images.length > 1 && (
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-medium">{room.images.length}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <BedDouble className="w-8 h-8 text-orange-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{room.roomType}</h3>
                        {room.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{room.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">Max {room.maxGuests} guests</span>
                          {room.bedType && (
                            <span className="text-xs text-muted-foreground">{room.bedType}</span>
                          )}
                          <span className="text-xs font-medium text-green-600">{room.quantity} rooms</span>
                          {room.amenities && room.amenities.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {room.amenities.slice(0, 2).map(a => typeof a === 'string' ? a : a.name).join(', ')}
                              {room.amenities.length > 2 ? ` +${room.amenities.length - 2}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-accent rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-accent rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Hotel</th>
                    <th className="text-left p-3 text-sm font-semibold">Room</th>
                    <th className="text-left p-3 text-sm font-semibold">Guest</th>
                    <th className="text-left p-3 text-sm font-semibold">Check-in</th>
                    <th className="text-left p-3 text-sm font-semibold">Nights</th>
                    <th className="text-left p-3 text-sm font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="p-3 text-sm">{booking.hotel}</td>
                      <td className="p-3 text-sm">{booking.room}</td>
                      <td className="p-3 text-sm">{booking.guest}</td>
                      <td className="p-3 text-sm">{booking.checkIn}</td>
                      <td className="p-3 text-sm">{booking.nights}</td>
                      <td className="p-3 text-sm font-medium">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel Modal */}
      {showCarousel && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeCarousel}
        >
          <button
            onClick={closeCarousel}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
          >
            <CloseIcon className="w-6 h-6" />
          </button>

          {carouselImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div 
            className="max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={carouselImages[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} / {carouselImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
