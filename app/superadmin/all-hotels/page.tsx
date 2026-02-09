"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { ShieldCheck, Building2, CheckCircle, MapPin, Mail, Phone, ChevronLeft, ChevronRight, X as CloseIcon, Plus, Bed } from "lucide-react"
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
  createdAt: string
}

export default function AllHotelsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHotelImages, setSelectedHotelImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showCarousel, setShowCarousel] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'superadmin' | 'others'>('all')
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const superadminAuth = localStorage.getItem("superadminAuth")
    if (!superadminAuth) {
      router.push("/superadmin/login")
    } else {
      setIsAuthenticated(true)
      fetchHotels()
    }
  }, [router])

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        // Filter only approved hotels
        const approvedHotels = data.filter((hotel: Hotel) => hotel.status === 'approved')
        setHotels(approvedHotels)
        // Fetch room counts for each hotel
        fetchRoomCounts(approvedHotels, token)
      }
    } catch (error) {
      console.error('Failed to fetch hotels:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRoomCounts = async (hotels: Hotel[], token: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/"
    const counts: Record<string, number> = {}
    
    await Promise.all(
      hotels.map(async (hotel) => {
        try {
          const response = await fetch(`${BASE_URL}api/rooms/hotels/${hotel.id}/rooms`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            counts[hotel.id] = Array.isArray(data) ? data.length : 0
          } else {
            counts[hotel.id] = 0
          }
        } catch (error) {
          console.error(`Failed to fetch rooms for hotel ${hotel.id}:`, error)
          counts[hotel.id] = 0
        }
      })
    )
    
    setRoomCounts(counts)
  }

  const superadminHotels = hotels.filter(h => h.role === 'superadmin')
  const otherHotels = hotels.filter(h => h.role !== 'superadmin')

  const filteredHotels = filterType === 'all' 
    ? hotels 
    : filterType === 'superadmin' 
    ? superadminHotels 
    : otherHotels

  const openCarousel = (images: string[], index: number = 0) => {
    setSelectedHotelImages(images)
    setCurrentImageIndex(index)
    setShowCarousel(true)
  }

  const closeCarousel = () => {
    setShowCarousel(false)
    setSelectedHotelImages([])
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedHotelImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedHotelImages.length) % selectedHotelImages.length)
  }

  if (!isAuthenticated ||isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{isLoading ? 'Loading hotels...' : 'Checking authentication...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="flex h-16 items-center px-6 justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">All Hotels</h1>
            </div>
            <Link 
              href="/superadmin/add-hotel"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Hotel
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filter Tags */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white dark:bg-gray-950 border hover:bg-accent'
              }`}
            >
              All Hotels ({hotels.length})
            </button>
            <button
              onClick={() => setFilterType('superadmin')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'superadmin'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white dark:bg-gray-950 border hover:bg-accent'
              }`}
            >
              By Superadmin ({superadminHotels.length})
            </button>
            <button
              onClick={() => setFilterType('others')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === 'others'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white dark:bg-gray-950 border hover:bg-accent'
              }`}
            >
              By Others ({otherHotels.length})
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Approved Hotels</p>
                  <h3 className="text-2xl font-bold mt-1">{hotels.length}</h3>
                </div>
                <Building2 className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">By Superadmin</p>
                  <h3 className="text-2xl font-bold mt-1">{superadminHotels.length}</h3>
                </div>
                <CheckCircle className="w-10 h-10 text-purple-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">By Others</p>
                  <h3 className="text-2xl font-bold mt-1">{otherHotels.length}</h3>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500/20" />
              </div>
            </div>
          </div>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredHotels.length === 0 ? (
              <div className="bg-white dark:bg-gray-950 rounded-lg border p-12 text-center">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hotels found</p>
              </div>
            ) : (
              filteredHotels.map((hotel) => (
                <div key={hotel.id} className="bg-white dark:bg-gray-950 rounded-lg border p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Hotel Images */}
                    <div className="w-full md:w-48">
                      {hotel.images && hotel.images.length > 0 ? (
                        <div 
                          className={`relative rounded-lg overflow-hidden ${hotel.images.length > 1 ? 'cursor-pointer' : ''} group`}
                          onClick={() => hotel.images.length > 1 ? openCarousel(hotel.images) : null}
                        >
                          <div className="aspect-square">
                            <img
                              src={hotel.images[0]}
                              alt={`${hotel.name}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          {hotel.images.length > 1 && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="bg-black/70 text-white px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Show More ({hotel.images.length} images)
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold">{hotel.name}</h3>
                            {hotel.role === 'superadmin' && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                                Superadmin
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{hotel.city}, {hotel.country}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{hotel.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{hotel.phone}</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-full capitalize bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                          {hotel.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Address</p>
                          <p className="text-sm font-medium">{hotel.address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Registered</p>
                          <p className="text-sm font-medium">{new Date(hotel.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Hotel ID</p>
                          <p className="text-sm font-medium">#{hotel.id.substring(0, 8)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Bed className="w-3 h-3" />
                            Rooms
                          </p>
                          <p className="text-sm font-medium">
                            {roomCounts[hotel.id] !== undefined ? roomCounts[hotel.id] : '...'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/superadmin/all-hotels/${hotel.id}`}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Image Carousel Modal */}
      {showCarousel && selectedHotelImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeCarousel}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close carousel"
          >
            <CloseIcon className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-5xl">
            {/* Main Image */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <img
                src={selectedHotelImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* Navigation Arrows */}
              {selectedHotelImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {selectedHotelImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            {selectedHotelImages.length > 1 && (
              <div className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2">
                {selectedHotelImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-white scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
