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
  hotelRank?: number
  numberOfRooms?: number
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-lg bg-emerald-600 shadow-lg mb-4">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">{isLoading ? 'Loading hotels...' : 'Checking authentication...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SuperAdminSidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="border-b-2 border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center px-6 justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">All Hotels</h1>
            </div>
            <Link 
              href="/superadmin/add-hotel"
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold shadow-sm"
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
              className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-emerald-400'
              }`}
            >
              All Hotels ({hotels.length})
            </button>
            <button
              onClick={() => setFilterType('superadmin')}
              className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                filterType === 'superadmin'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-emerald-400'
              }`}
            >
              By Superadmin ({superadminHotels.length})
            </button>
            <button
              onClick={() => setFilterType('others')}
              className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                filterType === 'others'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-emerald-400'
              }`}
            >
              By Others ({otherHotels.length})
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Total Approved Hotels</p>
                  <h3 className="text-3xl font-bold text-gray-900">{hotels.length}</h3>
                </div>
                <div className="p-3 rounded-lg bg-emerald-100">
                  <Building2 className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">By Superadmin</p>
                  <h3 className="text-3xl font-bold text-gray-900">{superadminHotels.length}</h3>
                </div>
                <div className="p-3 rounded-lg bg-blue-100">
                  <CheckCircle className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">By Others</p>
                  <h3 className="text-3xl font-bold text-gray-900">{otherHotels.length}</h3>
                </div>
                <div className="p-3 rounded-lg bg-teal-100">
                  <CheckCircle className="w-7 h-7 text-teal-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 gap-5">
            {filteredHotels.length === 0 ? (
              <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold text-lg">No hotels found</p>
              </div>
            ) : (
              filteredHotels.map((hotel) => (
                <div key={hotel.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Hotel Images */}
                    <div className="w-full md:w-48">
                      {hotel.images && hotel.images.length > 0 ? (
                        <div 
                          className={`relative rounded-lg overflow-hidden shadow-md ${hotel.images.length > 1 ? 'cursor-pointer' : ''} border-2 border-gray-200`}
                          onClick={() => hotel.images.length > 1 ? openCarousel(hotel.images) : null}
                        >
                          <div className="aspect-square">
                            <img
                              src={hotel.images[0]}
                              alt={`${hotel.name}`}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                          </div>
                          {hotel.images.length > 1 && (
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                              <div className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold opacity-0 hover:opacity-100 transition-opacity shadow-lg">
                                View All ({hotel.images.length})
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200 shadow-md">
                          <Building2 className="w-14 h-14 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                            {hotel.role === 'superadmin' && (
                              <span className="px-2 py-1 text-xs font-bold rounded bg-emerald-600 text-white">
                                SUPERADMIN
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 font-medium">
                            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                              <span>{hotel.city}, {hotel.country}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <span>{hotel.email}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded">
                              <Phone className="w-4 h-4 text-teal-600" />
                              <span>{hotel.phone}</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded capitalize bg-emerald-600 text-white">
                          {hotel.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-600 font-normal leading-relaxed line-clamp-2">{hotel.description}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
                          <p className="text-sm font-semibold text-gray-700 truncate">{hotel.address}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 font-medium mb-1">Registered</p>
                          <p className="text-sm font-semibold text-gray-700">{new Date(hotel.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 font-medium mb-1">Hotel ID</p>
                          <p className="text-sm font-semibold text-gray-700">#{hotel.id.substring(0, 8)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">
                            <Bed className="w-3 h-3" />
                            Rooms
                          </p>
                          <p className="text-sm font-semibold text-gray-700">
                            {roomCounts[hotel.id] !== undefined ? roomCounts[hotel.id] : '...'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Link
                          href={`/superadmin/all-hotels/${hotel.id}`}
                          className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold shadow-sm"
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
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10 bg-black/30 rounded-full p-3 hover:bg-black/50"
            aria-label="Close carousel"
          >
            <CloseIcon className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-6xl">
            {/* Main Image */}
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 transition-all shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 transition-all shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg">
                {currentImageIndex + 1} / {selectedHotelImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            {selectedHotelImages.length > 1 && (
              <div className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2 px-4">
                {selectedHotelImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-emerald-500 scale-110 shadow-lg"
                        : "border-transparent opacity-60 hover:opacity-100 hover:border-emerald-400"
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
