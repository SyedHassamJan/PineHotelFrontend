"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, ArrowLeft, Loader2, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Car {
  id: string
  name: string
  model: string
  city: string
  images: string[]
  hasDriver: boolean
  pricePerDay: number
  pricePlaceToPlace: number
  description: string
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/cars`)
      if (response.ok) {
        const data = await response.json()
        setCars(data)
      }
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b py-8">
         <div className="container mx-auto px-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
               <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Our Premium Fleet</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
               Choose from our wide range of luxury and comfort vehicles for your perfect journey.
            </p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-12">
         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="space-y-4">
                     <Skeleton className="h-48 w-full rounded-xl" />
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                     </div>
                  </div>
               ))}
            </div>
         ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {cars.map((car) => (
                  <div key={car.id} className="group h-full rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-lg transition-all flex flex-col">
                     {/* Car Image Area */}
                     <div className="h-48 relative bg-muted overflow-hidden">
                        <img 
                           src={car.images && car.images.length > 0 ? car.images[0] : "/placeholder.svg"} 
                           alt={car.name}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                           <Badge variant={car.hasDriver ? "secondary" : "outline"} className="bg-background/80 backdrop-blur-sm shadow-sm">
                              {car.hasDriver ? "Driver Optional" : "Self Drive"}
                           </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                           <h3 className="text-white font-bold text-lg drop-shadow-sm">{car.name}</h3>
                        </div>
                     </div>

                     {/* Content */}
                     <div className="p-4 flex flex-col flex-1 space-y-4">
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                           <MapPin className="w-4 h-4" /> {car.city}
                           <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                           <span>{car.model}</span>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                           {car.description}
                        </p>

                        <div className="pt-4 border-t flex items-center justify-between mt-auto">
                           <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Daily Rate</p>
                              <div className="flex items-baseline gap-1">
                                 <DollarSign className="w-4 h-4 text-primary self-center" />
                                 <span className="text-xl font-bold text-foreground">{car.pricePerDay}</span>
                              </div>
                           </div>
                           <Link href={`/cars/${car.id}`}>
                              <Button>Book Now</Button>
                           </Link>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-20">
               <h3 className="text-xl font-semibold mb-2">No cars available</h3>
               <p className="text-muted-foreground">Please check back later for new additions to our fleet.</p>
            </div>
         )}
      </div>
    </div>
  )
}
