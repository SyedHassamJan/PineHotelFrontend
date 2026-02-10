"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Search, Loader2 } from "lucide-react"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
}

export default function ToursPage() {
  const router = useRouter()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tours`)
      
      if (response.ok) {
        const data = await response.json()
        const toursData = Array.isArray(data) ? data : (data.data || [])
        // Filter only published tours
        setTours(toursData.filter((tour: Tour) => tour.status === 'PUBLISHED'))
      }
    } catch (error) {
      console.error("Error fetching tours:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTours = tours.filter(tour => 
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.locations?.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Explore Our Tours</h1>
          <p className="text-lg opacity-90">Discover amazing destinations and unforgettable experiences</p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-card border rounded-lg shadow-lg p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tours by name, city, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              {searchTerm ? "No tours found matching your search." : "No tours available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTours.map((tour) => {
              const imageUrl = tour.cardImages && tour.cardImages.length > 0 
                ? (tour.cardImages[0].startsWith('http') ? tour.cardImages[0] : `${normalizedBaseUrl}${tour.cardImages[0]}`)
                : '/placeholder.svg'
              
              return (
                <div key={tour.id} className="group border rounded-lg overflow-hidden hover:shadow-xl transition-all bg-card">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-xl line-clamp-1">{tour.title}</h3>
                    {tour.shortDescription && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{tour.shortDescription}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-1">{tour.city || tour.locations?.[0] || 'Multiple Locations'}</span>
                    </div>
                    {tour.durationDays > 0 && (
                      <div className="text-sm font-medium text-muted-foreground">
                        {tour.durationDays} Days / {tour.durationNights} Nights
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <span className="text-xs text-muted-foreground block">From</span>
                        <div className="text-2xl font-bold text-primary">${tour.pricePerPerson}</div>
                        <span className="text-xs text-muted-foreground">per person</span>
                      </div>
                      <Link
                        href={`/tours/${tour.id}`}
                        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition text-sm font-semibold"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
