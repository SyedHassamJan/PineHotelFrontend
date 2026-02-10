"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  Building2, 
  Home, 
  Calendar, 
  Settings,
  LogOut,
  BedDouble,
  ArrowLeft,
  Users,
  DollarSign,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X as CloseIcon,
  Bed,
  Hash,
  Info,
  Image as ImageIcon
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
  amenities: (string | { id: string; name: string })[]
  images?: string[]
  createdAt?: string
  updatedAt?: string
}

export default function RoomDetailPage() {
  const router = useRouter()
  const params = useParams()
  const roomId = params.id as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCarousel, setShowCarousel] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const hotelOwnerAuth = localStorage.getItem("hotelOwnerAuth")
    const userStr = localStorage.getItem("user")
    
    if (!hotelOwnerAuth) {
      router.push("/admin/login")
    } else {
      const auth = JSON.parse(hotelOwnerAuth)
      setOwnerEmail(auth.email)
      
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

  useEffect(() => {
    if (userId && roomId) {
      fetchRoomDetails()
    }
  }, [userId, roomId])

  const fetchRoomDetails = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const response = await fetch(`${baseUrl}api/rooms/hotels/${userId}/rooms`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch room')
      }

      const data = await response.json()
      const rooms = Array.isArray(data) ? data : []
      const foundRoom = rooms.find((r: Room) => r.id === roomId)
      
      if (foundRoom) {
        setRoom(foundRoom)
        setError("")
      } else {
        setError("Room not found")
      }
    } catch (err) {
      console.error("Error fetching room:", err)
      setError("Failed to load room details")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/admin/login")
  }

  const openCarousel = (index: number = 0) => {
    setCurrentImageIndex(index)
    setShowCarousel(true)
  }

  const closeCarousel = () => {
    setShowCarousel(false)
  }

  const nextImage = () => {
    if (room?.images && room.images.length > 0) {
      const images = room.images
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (room?.images && room.images.length > 0) {
      const images = room.images
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

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
  }, [showCarousel, room?.images])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
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
          </div>
        </aside>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BedDouble className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading room details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-background flex">
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
          </div>
        </aside>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Link 
              href="/admin/rooms" 
              className="text-primary hover:underline"
            >
              Back to Rooms
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
        {/* Header */}
        <div className="bg-white dark:bg-gray-950 border-b px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/rooms" 
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{room.roomType}</h1>
                <p className="text-sm text-muted-foreground mt-1">Room Details & Information</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/rooms/edit/${room.id}`}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Room
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Image Gallery */}
          {room.images && room.images.length > 0 ? (
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-4">
                <div 
                  className="col-span-4 md:col-span-2 row-span-2 aspect-video md:aspect-auto md:h-96 bg-muted rounded-xl overflow-hidden cursor-pointer group relative"
                  onClick={() => openCarousel(0)}
                >
                  <img
                    src={room.images[0]}
                    alt={room.roomType}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                {room.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-muted rounded-xl overflow-hidden cursor-pointer group relative"
                    onClick={() => openCarousel(index + 1)}
                  >
                    <img
                      src={image}
                      alt={`${room.roomType} - ${index + 2}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    {index === 3 && room.images && room.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">+{room.images.length - 5} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-24 h-24 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No images available</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Description
                </h2>
                {room.description ? (
                  <p className="text-muted-foreground leading-relaxed">{room.description}</p>
                ) : (
                  <p className="text-muted-foreground italic">No description provided</p>
                )}
              </div>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="bg-white dark:bg-gray-950 rounded-xl border p-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities & Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.amenities.map((amenity, idx) => {
                      const amenityName = typeof amenity === 'string' ? amenity : amenity.name
                      return (
                        <div 
                          key={idx} 
                          className="flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/10 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm font-medium">{amenityName}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {(room.createdAt || room.updatedAt) && (
                <div className="bg-white dark:bg-gray-950 rounded-xl border p-6">
                  <h2 className="text-xl font-semibold mb-4">Timestamps</h2>
                  <div className="space-y-2 text-sm">
                    {room.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">{new Date(room.createdAt).toLocaleString()}</span>
                      </div>
                    )}
                    {room.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-medium">{new Date(room.updatedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Price per Night</span>
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                {room.price ? (
                  <p className="text-4xl font-bold text-primary">${Number(room.price).toFixed(2)}</p>
                ) : (
                  <p className="text-2xl font-semibold text-muted-foreground italic">Not set</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border p-6">
                <h3 className="text-lg font-semibold mb-4">Room Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max Guests</p>
                        <p className="text-lg font-semibold">{room.maxGuests}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Hash className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="text-lg font-semibold">{room.quantity} rooms</p>
                      </div>
                    </div>
                  </div>

                  {room.bedType && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                          <Bed className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Bed Type</p>
                          <p className="text-lg font-semibold">{room.bedType}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {room.roomFloor && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Room Floor</p>
                          <p className="text-lg font-semibold">{room.roomFloor}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Room ID */}
              <div className="bg-white dark:bg-gray-950 rounded-xl border p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Room ID</h3>
                <p className="text-sm font-mono bg-muted px-3 py-2 rounded break-all">{room.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel Modal */}
      {showCarousel && room.images && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeCarousel}
        >
          <button
            onClick={closeCarousel}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
          >
            <CloseIcon className="w-6 h-6" />
          </button>

          {room.images.length > 1 && (
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
            className="max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={room.images[currentImageIndex]}
              alt={`${room.roomType} - ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
            {currentImageIndex + 1} / {room.images.length}
          </div>
        </div>
      )}
    </div>
  )
}
