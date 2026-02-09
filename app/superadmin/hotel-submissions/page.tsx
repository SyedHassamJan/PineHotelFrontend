"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { ShieldCheck, Building2, CheckCircle, XCircle, Clock, MapPin, Mail, Phone, User, ChevronLeft, ChevronRight, X as CloseIcon } from "lucide-react"

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
  createdAt: string
}

export default function HotelSubmissionsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHotelImages, setSelectedHotelImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showCarousel, setShowCarousel] = useState(false)

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
        setHotels(data)
      }
    } catch (error) {
      console.error('Failed to fetch hotels:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (hotelId: string) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels/${hotelId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      })
      
      if (response.ok) {
        setHotels(hotels.map(h => h.id === hotelId ? { ...h, status: 'approved' } : h))
      }
    } catch (error) {
      console.error('Failed to approve hotel:', error)
    }
  }

  const handleDecline = async (hotelId: string) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels/${hotelId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      })
      
      if (response.ok) {
        setHotels(hotels.map(h => h.id === hotelId ? { ...h, status: 'rejected' } : h))
      }
    } catch (error) {
      console.error('Failed to decline hotel:', error)
    }
  }

  const pendingCount = hotels.filter(h => h.status === 'pending').length
  const approvedCount = hotels.filter(h => h.status === 'approved').length
  const rejectedCount = hotels.filter(h => h.status === 'rejected').length

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

  if (!isAuthenticated || isLoading) {
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
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Hotel Submissions</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                  <h3 className="text-2xl font-bold mt-1">{hotels.length}</h3>
                </div>
                <Building2 className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <h3 className="text-2xl font-bold mt-1">{pendingCount}</h3>
                </div>
                <Clock className="w-10 h-10 text-orange-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <h3 className="text-2xl font-bold mt-1">{approvedCount}</h3>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <h3 className="text-2xl font-bold mt-1">{rejectedCount}</h3>
                </div>
                <XCircle className="w-10 h-10 text-red-500/20" />
              </div>
            </div>
          </div>

          {/* Submissions Grid */}
          <div className="grid grid-cols-1 gap-6">
            {hotels.length === 0 ? (
              <div className="bg-white dark:bg-gray-950 rounded-lg border p-12 text-center">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hotel submissions yet</p>
              </div>
            ) : (
              hotels.map((hotel) => (
                <div key={hotel.id} className="bg-white dark:bg-gray-950 rounded-lg border p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Hotel Images */}
                    <div className="w-full md:w-48">
                      {hotel.images && hotel.images.length > 0 ? (
                        <div 
                          className="relative rounded-lg overflow-hidden cursor-pointer group"
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
                          <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
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
                        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                          hotel.status === "pending" ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400" :
                          hotel.status === "approved" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                          "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        }`}>
                          {hotel.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{hotel.description}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Address</p>
                          <p className="text-sm font-medium">{hotel.address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Submitted</p>
                          <p className="text-sm font-medium">{new Date(hotel.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Hotel ID</p>
                          <p className="text-sm font-medium">#{hotel.id.substring(0, 8)}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        {hotel.status === "pending" && (
                          <>
                            <button 
                              onClick={() => handleApprove(hotel.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button 
                              onClick={() => handleDecline(hotel.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              <XCircle className="w-4 h-4" />
                              Decline
                            </button>
                          </>
                        )}
                        {hotel.status === "approved" && (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Hotel Approved</span>
                            </div>
                            <button 
                              onClick={() => handleDecline(hotel.id)}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              <XCircle className="w-4 h-4" />
                              Change to Rejected
                            </button>
                          </div>
                        )}
                        {hotel.status === "rejected" && (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                              <XCircle className="w-5 h-5" />
                              <span className="font-medium">Hotel Rejected</span>
                            </div>
                            <button 
                              onClick={() => handleApprove(hotel.id)}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Change to Approved
                            </button>
                          </div>
                        )}
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
