"use client"

import { useState, useEffect } from "react"
import { HotelCard } from "@/components/hotel-card"
import { MapPin, Star, Bed } from "lucide-react"
import Link from "next/link"

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
  hotelRank?: number
  numberOfRooms?: number
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
  hotelRank?: number
  numberOfRooms?: number
}



export default function HotelsPage() {
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
              hotelRank: hotel.hotelRank,
              numberOfRooms: hotel.numberOfRooms,
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
              hotelRank: hotel.hotelRank,
              numberOfRooms: hotel.numberOfRooms,
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background border-b border-border py-16">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fadeInUp">Find Your Perfect Hotel</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.1s'}}>Browse and book from our curated collection of luxury accommodations worldwide</p>
        </div>
      </section>

      {/* Hotels Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <p className="text-base text-muted-foreground">
            {loadingHotels ? 'Loading hotels...' : `Showing ${hotels.length} ${hotels.length === 1 ? 'hotel' : 'hotels'}`}
          </p>
        </div>
        
        {loadingHotels ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-96 bg-muted/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.map((hotel, index) => (
              <div key={hotel.id} className="animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                <Link href={`/hotels/${hotel.id}`} className="block group">
                  <div className="h-full rounded-2xl overflow-hidden border border-border hover:border-primary/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-2 hover:scale-[1.02]">
                    {/* Hotel Image */}
                    <div className="h-56 relative bg-muted overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img 
                        src={hotel.image} 
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-hotel.jpg'
                        }}
                      />
                      {hotel.hotelRank && (
                        <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-lg z-20 transform group-hover:scale-110 transition-transform duration-300">
                          {'⭐'.repeat(hotel.hotelRank)} Hotel
                        </div>
                      )}
                    </div>
                    
                    {/* Hotel Details */}
                    <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-card to-card/50">
                      <div className="mb-3">
                        <h3 className="font-bold text-xl line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-300">{hotel.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
                          <MapPin className="w-4 h-4 text-primary" /> {hotel.location}
                        </p>
                        {hotel.numberOfRooms && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-primary" /> {hotel.numberOfRooms} Rooms Available
                          </p>
                        )}
                      </div>
                      
                      {/* Rating */}
                      {hotel.rating && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="text-sm font-bold text-foreground">{hotel.rating.toFixed(1)}</span>
                          </div>
                          {hotel.reviews && (
                            <span className="text-xs text-muted-foreground">({hotel.reviews} reviews)</span>
                          )}
                        </div>
                      )}
                      
                      {/* Price */}
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                          <p className="font-bold text-primary text-2xl">${hotel.price}</p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                        <div className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg group-hover:bg-primary/90 transition-all duration-300 shadow-md group-hover:shadow-xl transform group-hover:scale-110">
                          View
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/10">
            <Bed className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No hotels available at the moment</p>
          </div>
        )}
      </section>
    </div>
  )
}
