"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { Building2, ChevronLeft, ChevronRight, X as CloseIcon, MapPin, Mail, Phone, Users, Calendar, Bed, Info, Edit, DollarSign } from "lucide-react"
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
  role: string
  hotelRank?: number
  numberOfRooms?: number
  createdAt: string
}

interface Room {
  id: string
  roomType: string
  description: string
  maxGuests: number
  quantity: number
  bedType: string
  roomFloor?: string
  price?: number | string | null
  amenities: string[] | { id: string; name: string; hotelId: string; createdAt: string; updatedAt: string }[]
  images: string[]
}

export default function HotelDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const hotelId = params.id as string

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showCarousel, setShowCarousel] = useState(false)
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<string>("")
  const [updatingPrice, setUpdatingPrice] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const authData = localStorage.getItem("superadminAuth")
    if (!authData) {
      router.push("/superadmin/login")
      return
    }

    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/superadmin/login")
      return
    }

    fetchHotelDetails(token)
    fetchRooms(token)
  }, [router, hotelId])

  const fetchHotelDetails = async (token: string) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/"
      const response = await fetch(`${BASE_URL}api/hotels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch hotel")

      const data = await response.json()
      const hotelData = data.find((h: Hotel) => h.id === hotelId)
      
      if (hotelData) {
        setHotel(hotelData)
      }
    } catch (error) {
      console.error("Error fetching hotel:", error)
    }
  }

  const fetchRooms = async (token: string) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/"
      const response = await fetch(`${BASE_URL}api/rooms/hotels/${hotelId}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch rooms")

      const data = await response.json()
      setRooms(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching rooms:", error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("superadminAuth")
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    router.push("/superadmin/login")
  }

  const startEditPrice = (roomId: string, currentPrice?: number | string | null) => {
    setEditingPriceId(roomId)
    const priceValue = currentPrice ? Number(currentPrice) : 0
    setTempPrice(priceValue > 0 ? priceValue.toString() : "")
  }

  const cancelEditPrice = () => {
    setEditingPriceId(null)
    setTempPrice("")
  }

  const updatePrice = async (roomId: string, newPrice: string) => {
    if (!newPrice || isNaN(parseFloat(newPrice))) {
      setError("Please enter a valid price")
      setTimeout(() => setError(""), 3000)
      return
    }

    setUpdatingPrice(true)
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/"
      const token = localStorage.getItem("access_token")
      
      const response = await fetch(`${BASE_URL}api/rooms/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: parseFloat(newPrice) })
      })

      if (!response.ok) {
        throw new Error('Failed to update price')
      }

      const updatedRoom = await response.json()
      
      // Update local state
      setRooms(prevRooms => prevRooms.map(room => 
        room.id === roomId ? { ...room, price: updatedRoom.price } : room
      ))
      
      // Close edit mode
      setEditingPriceId(null)
      setTempPrice("")
      setError("")
    } catch (err) {
      console.error("Failed to update price", err)
      setError("Error updating price. Please try again.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setUpdatingPrice(false)
    }
  }

  const openCarousel = (images: string[], index: number = 0) => {
    setSelectedImages(images)
    setCurrentImageIndex(index)
    setShowCarousel(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    )
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showCarousel) return
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "Escape") setShowCarousel(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showCarousel, selectedImages])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <SuperAdminSidebar onLogout={handleLogout} />
        <div className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading hotel details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="flex min-h-screen bg-background">
        <SuperAdminSidebar onLogout={handleLogout} />
        <div className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Hotel not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/superadmin/all-hotels"
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Hotel Details</h1>
              <p className="text-muted-foreground">View complete hotel information and rooms</p>
            </div>
          </div>

          {/* Hotel Information Card */}
          <div className="bg-card rounded-lg border p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Hotel Information</h2>
            
            {/* Hotel Images */}
            {hotel.images && hotel.images.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hotel.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openCarousel(hotel.images, index)}
                    >
                      <img
                        src={image}
                        alt={`${hotel.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotel Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hotel Name</p>
                <p className="text-lg font-medium">{hotel.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  hotel.status === 'approved' 
                    ? 'bg-green-500/10 text-green-500' 
                    : hotel.status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  {hotel.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {hotel.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {hotel.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {hotel.city}, {hotel.country}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="text-lg font-medium">{hotel.address}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Registered</p>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {new Date(hotel.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Hotel ID</p>
                <p className="text-lg font-medium">#{hotel.id}</p>
              </div>

              {hotel.hotelRank && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Hotel Rank</p>
                  <p className="text-lg font-medium">{'⭐'.repeat(hotel.hotelRank)}</p>
                </div>
              )}

              {hotel.numberOfRooms && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Rooms</p>
                  <p className="text-lg font-medium">{hotel.numberOfRooms}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {hotel.description && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-base">{hotel.description}</p>
              </div>
            )}
          </div>

          {/* Rooms Section */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Rooms ({rooms.length})</h2>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

            {rooms.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No rooms available for this hotel</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-accent/50 rounded-lg border p-4">
                    {/* Room Image */}
                    {room.images && room.images.length > 0 ? (
                      <div
                        className="aspect-video bg-muted rounded-lg overflow-hidden mb-4 cursor-pointer hover:opacity-80 transition-opacity relative"
                        onClick={() => room.images.length > 0 && openCarousel(room.images)}
                      >
                        <img
                          src={room.images[0]}
                          alt={room.roomType}
                          className="w-full h-full object-cover"
                        />
                        {room.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            +{room.images.length - 1} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                        <Building2 className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}

                    {/* Room Details */}
                    <h3 className="text-lg font-semibold mb-2">{room.roomType}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{room.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>Max Guests: {room.maxGuests}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-muted-foreground" />
                        <span>Bed Type: {room.bedType}</span>
                      </div>
                      {room.roomFloor && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span>Floor: {room.roomFloor}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-muted-foreground" />
                        <span>Available: {room.quantity}</span>
                      </div>
                    </div>

                    {/* Price Section with Edit */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Price per Night</span>
                        </div>
                        
                        {editingPriceId === room.id ? (
                          <div className="flex items-center gap-1">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    updatePrice(room.id, tempPrice)
                                  } else if (e.key === 'Escape') {
                                    cancelEditPrice()
                                  }
                                }}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-24 pl-6 pr-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                                disabled={updatingPrice}
                              />
                            </div>
                            <button
                              onClick={() => updatePrice(room.id, tempPrice)}
                              disabled={updatingPrice}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded disabled:opacity-50"
                              title="Save"
                            >
                              {updatingPrice ? (
                                <div className="w-4 h-4 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={cancelEditPrice}
                              disabled={updatingPrice}
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                              title="Cancel"
                            >
                              <CloseIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {room.price ? (
                              <span className="text-lg font-bold text-primary">${Number(room.price).toFixed(2)}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground italic">Not set</span>
                            )}
                            <button
                              onClick={() => startEditPrice(room.id, room.price)}
                              className="p-1 hover:bg-accent rounded transition-colors"
                              title={room.price ? "Edit price" : "Set price"}
                            >
                              <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                            >
                              {typeof amenity === 'string' ? amenity : amenity.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Carousel Modal */}
      {showCarousel && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setShowCarousel(false)}
        >
          <button
            onClick={() => setShowCarousel(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <CloseIcon className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <div
            className="max-w-4xl max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImages[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded">
              {currentImageIndex + 1} / {selectedImages.length}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-12 h-12" />
          </button>
        </div>
      )}
    </div>
  )
}
