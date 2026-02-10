"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, MapPin, DollarSign, User, Phone,  Check, Info, Car as CarIcon, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Car {
  id: string
  name: string
  model: string
  city: string
  images: string[]
  hasDriver: boolean
  driverInfo?: {
    name: string
    email: string
    phone: string
    images: string[]
    pricePerDay?: number
  }
  pricePerDay: number
  pricePlaceToPlace: number
  description: string
  createdAt: string
}

export default function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingData, setBookingData] = useState({
    pickupDate: "",
    dropoffDate: "",
    bookingType: "PER_DAY",
    withDriver: false,
    pickupCity: "",
    dropoffCity: "",
    userName: "",
    userEmail: "",
    userPhone: "",
  })

  // Initialize dates
  useEffect(() => {
     const today = new Date()
     const tomorrow = new Date(today)
     tomorrow.setDate(tomorrow.getDate() + 1)
     const dayAfter = new Date(today)
     dayAfter.setDate(dayAfter.getDate() + 3)

     setBookingData(prev => ({ 
        ...prev, 
        pickupDate: tomorrow.toISOString().split('T')[0], 
        dropoffDate: dayAfter.toISOString().split('T')[0] 
     }))
  }, [])

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const payload = {
        carId: id,
        ...bookingData
      }
      
      const response = await fetch(`${normalizedBaseUrl}api/car-bookings`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(payload)
      })
      
      if (response.ok) {
         toast.success("Booking request sent successfully!")
         setShowBookingModal(false)
         // Reset user fields but keep dates often convenient
         setBookingData(prev => ({ ...prev, userName: "", userEmail: "", userPhone: "", pickupCity: "", dropoffCity: "" }))
      } else {
         const error = await response.json()
         toast.error(error.message || "Failed to submit booking")
      }
    } catch (error) {
       console.error("Booking error:", error)
       toast.error("An error occurred. Please try again.")
    } finally {
       setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
     const { name, value } = e.target
     setBookingData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
        const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
        const response = await fetch(`${normalizedBaseUrl}api/cars/${id}`)
        if (response.ok) {
          const data = await response.json()
          setCar(data)
        } else {
          console.error("Failed to fetch car details")
          // router.push("/cars") // Could redirect if not found
        }
      } catch (error) {
        console.error("Error fetching car:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCar()
    }
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Skeleton className="h-[400px] w-full rounded-xl" />
           <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
           </div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Car not found</h1>
        <Button onClick={() => router.push("/cars")}>View All Cars</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header / Nav could be global layout, adding brief back nav */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Link href="/cars" className="text-sm font-medium hover:underline text-primary">
              View All Cars
            </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Images & Title */}
           <div className="lg:col-span-2 space-y-6">
              
              {/* Main Image Gallery */}
              <div className="space-y-4">
                 <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted relative group">
                    <img 
                      src={car.images[0] || "/placeholder.svg"} 
                      alt={car.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className="absolute top-4 right-4 bg-background/90 text-foreground backdrop-blur-md shadow-sm">
                      {car.model}
                    </Badge>
                 </div>
                 
                 {car.images.length > 1 && (
                   <div className="grid grid-cols-4 gap-4">
                      {car.images.map((img, idx) => (
                        <div key={idx} className="aspect-video rounded-lg overflow-hidden border bg-muted cursor-pointer hover:opacity-80 transition-opacity">
                           <img src={img} alt={`${car.name} view ${idx+1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              {/* Description & Features */}
              <div className="space-y-6">
                 <div>
                    <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                       <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {car.city}</span>
                       <span className="flex items-center gap-1"><CarIcon className="w-4 h-4" /> {car.model}</span>
                       <span className="flex items-center gap-1">
                          {car.hasDriver ? (
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Driver Available</Badge>
                          ) : (
                            <Badge variant="outline">Self Drive Only</Badge>
                          )}
                       </span>
                    </div>
                 </div>

                 <Separator />

                 <div className="prose max-w-none text-muted-foreground">
                    <h3 className="text-foreground font-semibold mb-2">Description</h3>
                    <p>{car.description}</p>
                 </div>

                 {/* Driver Details Section */}
                 {car.hasDriver && car.driverInfo && (
                   <Card className="bg-muted/30 border-primary/20">
                      <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="w-5 h-5 text-primary" /> Professional Driver Included
                         </CardTitle>
                         <CardDescription>
                            This car comes with a dedicated driver option.
                         </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                         <div className="flex items-start gap-6">
                            {car.driverInfo.images && car.driverInfo.images.length > 0 ? (
                               <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-background shadow-sm flex-shrink-0">
                                  <img src={car.driverInfo.images[0]} alt="Driver" className="w-full h-full object-cover" />
                               </div>
                            ) : (
                               <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                  <User className="w-8 h-8 text-muted-foreground" />
                               </div>
                            )}
                            
                            <div className="space-y-2">
                               <h4 className="font-bold text-lg">{car.driverInfo.name}</h4>
                               <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Verified Contact</span>
                                  <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Professional License</span>
                               </div>
                               {car.driverInfo.pricePerDay && (
                                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mt-2">
                                    <DollarSign className="w-3 h-3" /> Driver Fee: ${car.driverInfo.pricePerDay}/day
                                 </div>
                               )}
                            </div>
                         </div>
                         
                         {car.driverInfo.images && car.driverInfo.images.length > 1 && (
                            <div>
                               <Label className="text-xs text-muted-foreground uppercase mb-2 block">Driver Documentation</Label>
                               <div className="flex gap-2 overflow-x-auto pb-2">
                                  {car.driverInfo.images.slice(1).map((img, i) => (
                                     <div key={i} className="w-20 h-20 rounded-md overflow-hidden border bg-background flex-shrink-0">
                                        <img src={img} alt="Doc" className="w-full h-full object-cover" />
                                     </div>
                                  ))}
                                  {/* Also show the first one if preferred, logic above slices. 
                                      The user wants to see multiple images. 
                                  */}
                               </div>
                            </div>
                         )}
                      </CardContent>
                   </Card>
                 )}
              </div>
           </div>

           {/* Right Column: Booking Card */}
           <div className="lg:col-span-1">
              <div className="sticky top-24">
                 <Card className="shadow-lg border-primary/10">
                    <CardHeader>
                       <CardTitle>Booking Summary</CardTitle>
                       <CardDescription>Competitive rates for top quality service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                             <span className="text-muted-foreground">Daily Rate</span>
                             <span className="font-bold text-xl">${car.pricePerDay}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                             <span className="text-muted-foreground">Place to Place</span>
                             <span className="font-bold text-xl">${car.pricePlaceToPlace}</span>
                          </div>
                          
                          {car.hasDriver && car.driverInfo?.pricePerDay && (
                             <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                                <span className="text-muted-foreground">Driver Fee</span>
                                <span className="font-bold text-primary">+${car.driverInfo.pricePerDay}<span className="text-xs font-normal">/day</span></span>
                             </div>
                          )}
                       </div>

                       <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                          <DialogTrigger asChild>
                             <Button className="w-full h-12 text-lg font-semibold" size="lg">
                                Book Now
                             </Button>
                          </DialogTrigger>
                          <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Book {car.name}</DialogTitle>
                                <DialogDescription>
                                   Fill in your details to request a booking for this vehicle.
                                </DialogDescription>
                             </DialogHeader>
                             <form onSubmit={handleBookingSubmit} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label htmlFor="pickupCity">Pickup City</Label>
                                      <Input id="pickupCity" name="pickupCity" placeholder="e.g. New York" value={bookingData.pickupCity} onChange={handleInputChange} required />
                                   </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="dropoffCity">Dropoff City</Label>
                                      <Input id="dropoffCity" name="dropoffCity" placeholder="e.g. Boston" value={bookingData.dropoffCity} onChange={handleInputChange} required />
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label htmlFor="pickupDate">Pickup Date</Label>
                                      <Input id="pickupDate" name="pickupDate" type="date" value={bookingData.pickupDate} onChange={handleInputChange} required />
                                   </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="dropoffDate">Dropoff Date</Label>
                                      <Input id="dropoffDate" name="dropoffDate" type="date" value={bookingData.dropoffDate} onChange={handleInputChange} required />
                                   </div>
                                </div>
                                
                                {car.hasDriver && (
                                   <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
                                      <input 
                                        type="checkbox" 
                                        id="withDriver" 
                                        checked={bookingData.withDriver} 
                                        onChange={(e) => setBookingData(prev => ({ ...prev, withDriver: e.target.checked }))}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                                      />
                                      <Label htmlFor="withDriver" className="cursor-pointer flex-1 font-medium">
                                         Include Driver 
                                         {car.driverInfo?.pricePerDay && <span className="text-primary ml-1">(+${car.driverInfo.pricePerDay}/day)</span>}
                                      </Label>
                                   </div>
                                )}

                                <div className="space-y-2">
                                   <Label htmlFor="userName">Full Name</Label>
                                   <Input id="userName" name="userName" placeholder="John Doe" value={bookingData.userName} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label htmlFor="userEmail">Email</Label>
                                      <Input id="userEmail" name="userEmail" type="email" placeholder="john@example.com" value={bookingData.userEmail} onChange={handleInputChange} required />
                                   </div>
                                   <div className="space-y-2">
                                      <Label htmlFor="userPhone">Phone Number</Label>
                                      <Input id="userPhone" name="userPhone" placeholder="+1 234..." value={bookingData.userPhone} onChange={handleInputChange} required />
                                   </div>
                                </div>
                                
                                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                                   {isSubmitting ? (
                                      <>
                                         <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                                      </>
                                   ) : (
                                      "Confirm Booking"
                                   )}
                                </Button>
                             </form>
                          </DialogContent>
                       </Dialog>

                       <div className="text-xs text-muted-foreground text-center space-y-2">
                          <p className="flex items-center justify-center gap-1">
                             <Info className="w-3 h-3" /> Free cancellation up to 24 hours before
                          </p>
                          <p>No credit card required for inquiry</p>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
