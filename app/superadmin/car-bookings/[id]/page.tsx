"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Calendar, User, MapPin, DollarSign, Car, CheckCircle, XCircle, Clock, Mail, Phone, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

interface DriverInfo {
  name: string
  email: string
  phone: string
  images: string[]
  pricePerDay?: number
}

interface CarDetails {
  id: string
  name: string
  model: string
  city: string
  images: string[]
  hasDriver: boolean
  driverInfo: DriverInfo | null
  pricePerDay: string
  pricePlaceToPlace: string
  description: string
  createdAt: string
  updatedAt: string
}

interface BookingDetails {
  id: string
  carId: string
  pickupDate: string
  dropoffDate: string
  bookingType: string
  withDriver: boolean
  pickupCity: string
  dropoffCity: string
  priceFinal: string
  userName: string
  userEmail: string
  userPhone: string
  status: string
  createdAt: string
  updatedAt: string
  car: CarDetails
}

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
        const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
        const response = await fetch(`${normalizedBaseUrl}api/car-bookings/${id}`)
        if (response.ok) {
          const data = await response.json()
          setBooking(data)
        } else {
          toast.error("Failed to fetch booking details")
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
        toast.error("Error loading booking details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBooking()
    }
  }, [id])

  const updateStatus = async (newStatus: string) => {
    if (!booking) return
    try {
      setUpdating(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const response = await fetch(`${normalizedBaseUrl}api/car-bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success(`Booking status updated to ${newStatus}`)
        setBooking(prev => prev ? ({ ...prev, status: newStatus }) : null)
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("An error occurred while updating status")
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <SuperAdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen bg-background">
        <SuperAdminSidebar />
        <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-semibold">Booking not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                Booking #{booking.id.substring(0, 8)}
                <Badge variant="outline" className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Created on {format(new Date(booking.createdAt), "PPP p")}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
             {booking.status === 'PENDING' && (
                <>
                   <Button variant="outline" onClick={() => updateStatus("CANCELLED")} disabled={updating} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Cancel Request
                   </Button>
                   <Button onClick={() => updateStatus("CONFIRMED")} disabled={updating} className="bg-green-600 hover:bg-green-700 text-white">
                      Confirm Booking
                   </Button>
                </>
             )}
             {booking.status === 'CONFIRMED' && (
                <Button onClick={() => updateStatus("COMPLETED")} disabled={updating}>
                   Mark Completed
                </Button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                   {/* Decorative line for route */}
                   <div className="hidden md:block absolute top-3 left-[20%] right-[20%] h-0.5 bg-muted-foreground/20 border-t border-dashed border-muted-foreground/50 z-0"></div>
                   
                   <div className="relative z-10 space-y-1">
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Pickup</p>
                      <h3 className="text-xl font-bold">{booking.pickupCity}</h3>
                      <div className="flex items-center gap-2 text-primary font-medium mt-1">
                         <Calendar className="h-4 w-4" />
                         {format(new Date(booking.pickupDate), "PPP")}
                      </div>
                   </div>

                   <div className="relative z-10 space-y-1 md:text-right">
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Dropoff</p>
                      <h3 className="text-xl font-bold">{booking.dropoffCity}</h3>
                      <div className="flex items-center gap-2 text-primary font-medium mt-1 md:justify-end">
                         <Calendar className="h-4 w-4" />
                         {format(new Date(booking.dropoffDate), "PPP")}
                      </div>
                   </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Booking Type</p>
                      <p className="font-semibold">{booking.bookingType.replace('_', ' ')}</p>
                   </div>
                   <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Driver Option</p>
                      <p className="font-semibold">{booking.withDriver ? "With Driver" : "Self Drive"}</p>
                   </div>
                   <div className="bg-green-50 p-3 rounded-md border border-green-100">
                      <p className="text-xs text-green-700 mb-1">Total Amount</p>
                      <p className="font-bold text-green-800 text-lg">${Number(booking.priceFinal).toLocaleString()}</p>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Car Information */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Car className="h-5 w-5 text-primary" /> Vehicle Information
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden bg-muted border">
                        {booking.car.images && booking.car.images.length > 0 ? (
                           <img src={booking.car.images[0]} alt={booking.car.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                        )}
                     </div>
                     <div className="flex-1 space-y-4">
                        <div>
                           <h3 className="text-2xl font-bold">{booking.car.name}</h3>
                           <p className="text-muted-foreground">{booking.car.model} • {booking.car.city}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                           <div>
                              <span className="text-muted-foreground">Price Per Day:</span>
                              <span className="font-medium ml-2">${booking.car.pricePerDay}</span>
                           </div>
                           <div>
                              <span className="text-muted-foreground">Place to Place:</span>
                              <span className="font-medium ml-2">${booking.car.pricePlaceToPlace}</span>
                           </div>
                        </div>
                        {booking.withDriver && booking.car.driverInfo && (
                           <div className="bg-muted/50 p-3 rounded-md text-sm border">
                              <p className="font-semibold mb-1 flex items-center gap-2"><User className="h-3 w-3" /> Assigned Driver</p>
                              <p>{booking.car.driverInfo.name} ({booking.car.driverInfo.phone})</p>
                              <p className="text-xs text-muted-foreground">{booking.car.driverInfo.email}</p>
                           </div>
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Right Column: Customer Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{booking.userName}</h4>
                    <p className="text-xs text-muted-foreground">Customer</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.userEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.userPhone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 bg-muted/20 p-4">
                 <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:${booking.userEmail}`)}>
                    Send Email
                 </Button>
                 <Button variant="secondary" className="w-full" onClick={() => window.open(`tel:${booking.userPhone}`)}>
                    Call Customer
                 </Button>
              </CardFooter>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle className="text-sm font-medium">System Info</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                     <span>Created At</span>
                     <span>{format(new Date(booking.createdAt), "PP p")}</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Last Updated</span>
                     <span>{format(new Date(booking.updatedAt), "PP p")}</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Booking ID</span>
                     <span className="font-mono">{booking.id}</span>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
