"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Star, MapPin, Calendar, Info, Car, User, Check, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { format } from "date-fns"

interface DriverInfo {
  name: string
  email: string
  phone: string
  images: string[]
  pricePerDay?: number
}

interface Car {
  id: string
  name: string
  model: string
  city: string
  images: string[]
  hasDriver: boolean
  driverInfo: DriverInfo | null
  pricePerDay: number
  pricePlaceToPlace: number
  description: string
  createdAt: string
  updatedAt: string
}

interface SearchResponse {
  total: number
  data: Car[]
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<Car[]>([])
  
  // Get search params
  const city = searchParams.get("city")
  const pickupDate = searchParams.get("pickupDate")
  const dropoffDate = searchParams.get("dropoffDate")

  useEffect(() => {
    if (city && pickupDate && dropoffDate) {
      fetchSearchResults()
    } else {
        // Handle case where params might be missing, or just fetch all
        fetchSearchResults()
    }
  }, [city, pickupDate, dropoffDate])

  const fetchSearchResults = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      let url = `${normalizedBaseUrl}api/search/cars?`
      const params = new URLSearchParams()
      if (city) params.append("city", city)
      if (pickupDate) params.append("pickupDate", pickupDate)
      if (dropoffDate) params.append("dropoffDate", dropoffDate)
      
      url += params.toString()

      const response = await fetch(url)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setSearchResults(data.data)
      } else {
        console.error("Search failed")
        toast.error("Failed to load cars")
      }
    } catch (error) {
      console.error("Error fetching search results:", error)
      toast.error("Error connecting to server")
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = (carId: string) => {
     // Navigate to car detail page which has the booking modal
     router.push(`/cars/${carId}`)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (searchResults.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No cars found</h2>
        <p className="text-muted-foreground mb-8">Try adjusting your search criteria.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Available Cars</h1>
          <p className="text-muted-foreground mt-2">
            Found {searchResults.length} cars {city ? `in ${city}` : ""}
            {pickupDate && dropoffDate && ` for ${pickupDate} to ${dropoffDate}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {searchResults.map((car) => (
          <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-all group border-border">
            <div className="relative h-48 overflow-hidden bg-muted">
               {car.images && car.images.length > 0 ? (
                 <img 
                   src={car.images[0]} 
                   alt={car.name} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
               ) : (
                 <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Car className="w-12 h-12" />
                 </div>
               )}
               {car.hasDriver && (
                  <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-md shadow-sm backdrop-blur-sm flex items-center gap-1">
                     <User className="w-3 h-3" /> With Driver
                  </div>
               )}
            </div>
            
            <CardHeader className="p-4 pb-2">
               <div className="flex justify-between items-start">
                  <div>
                     <CardTitle className="text-xl line-clamp-1">{car.name}</CardTitle>
                     <CardDescription>{car.model}</CardDescription>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                     <MapPin className="w-3 h-3 mr-1" />
                     {car.city}
                  </div>
               </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2 flex-grow">
               <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                  {car.description}
               </p>
               
               <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted/50 p-2 rounded border border-border/50 text-center">
                     <span className="block text-xs text-muted-foreground mb-1">Per Day</span>
                     <span className="font-bold text-primary">${car.pricePerDay}</span>
                  </div>
                  <div className="bg-muted/50 p-2 rounded border border-border/50 text-center">
                     <span className="block text-xs text-muted-foreground mb-1">Point to Point</span>
                     <span className="font-bold text-primary">${car.pricePlaceToPlace}</span>
                  </div>
               </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
               <Button className="w-full" onClick={() => handleBookNow(car.id)}>
                  Book Now
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Toaster />
    </div>
  )
}

export default function CarSearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
