"use client"

import { useState, useEffect } from "react"
import { HotelCard } from "@/components/hotel-card"
import { FilterSidebar } from "@/components/filter-sidebar"

interface Room {
  id: string
  name: string
  price: number | string
  capacity: number
  images?: string[]
}

interface Hotel {
  id: string
  name: string
  email: string
  phone: string
  city: string
  country: string
  address: string
  description?: string
  status: string
  images?: string[]
  rooms?: Room[]
}

interface HotelCardProps {
  id: string
  name: string
  image: string
  location: string
  price: number
  rating?: number
  reviews?: number
}



export default function HotelsPage() {
  const [filters, setFilters] = useState({})
  const [hotels, setHotels] = useState<HotelCardProps[]>([])
  const [loadingHotels, setLoadingHotels] = useState(true)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      setLoadingHotels(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const response = await fetch(`${baseUrl}api/hotels`)
      if (!response.ok) throw new Error('Failed to fetch hotels')
      const data: Hotel[] = await response.json()
      
      const approvedHotels = data.filter(hotel => hotel.status === 'approved')
      
      // Fetch rooms for each hotel to get pricing
      const hotelsWithPricing = await Promise.all(
        approvedHotels.map(async (hotel) => {
          try {
            const roomsResponse = await fetch(`${baseUrl}api/rooms/hotels/${hotel.id}/rooms`)
            let avgPrice = 0
            
            if (roomsResponse.ok) {
              const rooms = await roomsResponse.json()
              if (rooms && rooms.length > 0) {
                const prices = rooms.map((r: any) => Number(r.price) || 0).filter((p: number) => p > 0)
                if (prices.length > 0) {
                  avgPrice = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length
                }
              }
            }
            
            return {
              id: hotel.id,
              name: hotel.name,
              image: hotel.images?.[0] || '/placeholder-hotel.jpg',
              location: `${hotel.city}, ${hotel.country}`,
              price: Math.round(avgPrice),
              rating: 4.5 + Math.random() * 0.4,
              reviews: Math.floor(Math.random() * 300) + 50,
            }
          } catch (error) {
            console.error(`Error fetching rooms for hotel ${hotel.id}:`, error)
            return {
              id: hotel.id,
              name: hotel.name,
              image: hotel.images?.[0] || '/placeholder-hotel.jpg',
              location: `${hotel.city}, ${hotel.country}`,
              price: 0,
              rating: 4.5 + Math.random() * 0.4,
              reviews: Math.floor(Math.random() * 300) + 50,
            }
          }
        })
      )
      
      setHotels(hotelsWithPricing)
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoadingHotels(false)
    }
  }

  return (
    <div className="w-full bg-background">
      <section className="bg-primary/5 border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">Find Your Perfect Hotel</h1>
          <p className="text-muted-foreground mt-2">Browse and book from thousands of accommodations worldwide</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Hotels Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-muted-foreground">
                {loadingHotels ? 'Loading hotels...' : `Showing ${hotels.length} hotels`}
              </p>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {loadingHotels ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-96 h-96 bg-muted/50 rounded-lg animate-pulse" />
                ))
              ) : hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <div key={hotel.id} className="flex-shrink-0 w-96">
                    <HotelCard {...hotel} />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No hotels available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
