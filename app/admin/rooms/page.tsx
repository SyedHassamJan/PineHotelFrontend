"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  Home, 
  Calendar, 
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  BedDouble,
  Users,
  DollarSign,
  Wifi,
  Tv,
  Coffee,
  ChevronLeft,
  ChevronRight,
  X as CloseIcon,
  Info
} from "lucide-react"
import Link from "next/link"

interface Room {
  id: string
  roomType: string
  description?: string
  maxGuests: number
  quantity: number
  bedType?: string
  roomFloor?: string
  price?: number | string | null
  amenities: (string | { id: string; name: string; hotelId?: string; createdAt?: string; updatedAt?: string })[]
  images?: string[]
}

export default function RoomsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")
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
      
      // Get user ID from user object
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setUserId(user.id || user._id || "")
        } catch (error) {
          console.error("Error parsing user data", error)
        }
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

  // Calculate stats from rooms data
  const totalRooms = rooms.reduce((sum, r) => sum + r.quantity, 0)
  const roomTypes = rooms.length
  const avgGuests = rooms.length > 0 
    ? Math.round(rooms.reduce((sum, r) => sum + r.maxGuests, 0) / rooms.length) 
    : 0
  const roomsWithPrice = rooms.filter(r => r.price && r.price > 0)
  const avgPrice = roomsWithPrice.length > 0
    ? roomsWithPrice.reduce((sum, r) => sum + (r.price || 0), 0) / roomsWithPrice.length
    : 0

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r min-h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Hotel Owner</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/admin/my-hotels" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Building2 className="w-5 h-5" />
              My Hotels
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Calendar className="w-5 h-5" />
              Bookings
            </Link>
            <Link href="/admin/rooms" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
              <BedDouble className="w-5 h-5" />
              Rooms
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-3 bg-accent rounded-lg mb-3">
              <p className="text-sm font-medium truncate">{ownerEmail}</p>
              <p className="text-xs text-muted-foreground">Hotel Owner</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Rooms Management</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage all your hotel rooms</p>
            </div>
            <Link 
              href="/admin/rooms/add" 
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Room
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rooms</p>
                  <h3 className="text-2xl font-bold mt-1">{loading ? "..." : totalRooms}</h3>
                </div>
                <BedDouble className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Room Types</p>
                  <h3 className="text-2xl font-bold mt-1">{loading ? "..." : roomTypes}</h3>
                </div>
                <Building2 className="w-10 h-10 text-green-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Guests</p>
                  <h3 className="text-2xl font-bold mt-1">{loading ? "..." : avgGuests > 0 ? avgGuests : "N/A"}</h3>
                </div>
                <Users className="w-10 h-10 text-blue-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Price</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {loading ? "..." : avgPrice > 0 ? `$${avgPrice.toFixed(2)}` : "Not set"}
                  </h3>
                  {!loading && avgPrice > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {roomsWithPrice.length}/{rooms.length} priced
                    </p>
                  )}
                </div>
                <DollarSign className="w-10 h-10 text-orange-500/20" />
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
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
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-12 text-center">
              <BedDouble className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
              <p className="text-muted-foreground mb-6">Get started by adding your first room</p>
              <Link 
                href="/admin/rooms/add" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Room
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white dark:bg-gray-950 rounded-lg border p-6 hover:border-primary/50 transition-colors">
                  <div className="flex gap-6">
                    {/* Room Image */}
                    <Link
                      href={`/admin/rooms/${room.id}`}
                      className="relative w-40 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden cursor-pointer group"
                    >
                      {room.images && room.images.length > 0 ? (
                        <>
                          <img src={room.images[0]} alt={room.roomType} className="w-full h-full object-cover" />
                          {room.images.length > 1 && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm font-medium">View Details</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <BedDouble className="w-12 h-12 text-primary" />
                      )}
                    </Link>

                    {/* Room Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link href={`/admin/rooms/${room.id}`}>
                            <h3 className="text-lg font-bold hover:text-primary transition-colors cursor-pointer">{room.roomType}</h3>
                          </Link>
                          {room.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{room.description}</p>
                          )}
                        </div>
                        <div className="flex gap-4">
                          {/* Price Section - Read Only */}
                          <div className="text-right min-w-[140px]">
                            <p className="text-sm text-muted-foreground mb-1">Price per Night</p>
                            <div>
                              {room.price ? (
                                <p className="text-lg font-bold text-primary">${Number(room.price).toFixed(2)}</p>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">Not set</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Quantity Section */}
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Quantity</p>
                            <p className="text-lg font-bold text-primary">{room.quantity}</p>
                            <p className="text-xs text-muted-foreground">rooms available</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Max Guests</p>
                          <p className="text-sm font-medium">{room.maxGuests} Guests</p>
                        </div>
                        {room.bedType && (
                          <div>
                            <p className="text-xs text-muted-foreground">Bed Type</p>
                            <p className="text-sm font-medium">{room.bedType}</p>
                          </div>
                        )}
                        {room.roomFloor && (
                          <div>
                            <p className="text-xs text-muted-foreground">Floor</p>
                            <p className="text-sm font-medium">{room.roomFloor}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">Images</p>
                          <p className="text-sm font-medium">
                            {room.images && room.images.length > 0 ? `${room.images.length} photo(s)` : 'No images'}
                          </p>
                        </div>
                      </div>

                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {room.amenities.map((amenity, idx) => {
                            const amenityName = typeof amenity === 'string' ? amenity : amenity.name
                            return (
                              <span key={idx} className="px-2 py-1 text-xs bg-accent rounded">
                                {amenityName}
                              </span>
                            )
                          })}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Link 
                          href={`/admin/rooms/${room.id}`}
                          className="px-3 py-1.5 text-sm border rounded-lg hover:bg-primary/10 hover:border-primary/50 transition-colors"
                        >
                          <Info className="w-4 h-4 inline mr-1" />
                          View Details
                        </Link>
                        <Link 
                          href={`/admin/rooms/edit/${room.id}`}
                          className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent"
                        >
                          <Edit className="w-4 h-4 inline mr-1" />
                          Edit
                        </Link>
                        <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
