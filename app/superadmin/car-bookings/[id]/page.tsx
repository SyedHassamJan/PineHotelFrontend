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
import { Label } from "@/components/ui/label"
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
            <Card className="border-2">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-900 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                           <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">Pickup Location</p>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">{booking.pickupCity}</h3>
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium bg-white dark:bg-blue-950/50 p-2 rounded-lg">
                         <Calendar className="h-4 w-4" />
                         <span className="text-sm">{format(new Date(booking.pickupDate), "PPP")}</span>
                      </div>
                   </div>

                   <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-green-600 rounded-lg">
                           <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs text-green-700 dark:text-green-300 font-bold uppercase tracking-wider">Dropoff Location</p>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">{booking.dropoffCity}</h3>
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium bg-white dark:bg-green-950/50 p-2 rounded-lg">
                         <Calendar className="h-4 w-4" />
                         <span className="text-sm">{format(new Date(booking.dropoffDate), "PPP")}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="border-l-4 border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 pl-4 py-3 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-1">
                         <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                         <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Booking Type</Label>
                      </div>
                      <p className="font-bold text-lg text-foreground">{booking.bookingType.replace('_', ' ')}</p>
                   </div>
                   <div className="border-l-4 border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 pl-4 py-3 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-1">
                         <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                         <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Driver Option</Label>
                      </div>
                      <p className="font-bold text-lg text-foreground">{booking.withDriver ? "With Driver" : "Self Drive"}</p>
                   </div>
                   <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                          <p className="font-bold text-emerald-800 dark:text-emerald-400 text-2xl">${Number(booking.priceFinal).toLocaleString()}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Car Information */}
            <Card className="border-2">
               <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
                  <CardTitle className="flex items-center gap-2">
                     <div className="p-2 bg-primary/10 rounded-lg">
                       <Car className="h-5 w-5 text-primary" />
                     </div>
                     Vehicle Information
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden bg-muted border-2 shadow-md">
                        {booking.car.images && booking.car.images.length > 0 ? (
                           <img src={booking.car.images[0]} alt={booking.car.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                             <Car className="w-12 h-12" />
                           </div>
                        )}
                     </div>
                     <div className="flex-1 space-y-4">
                        <div className="pb-3 border-b">
                           <h3 className="text-2xl font-bold text-foreground">{booking.car.name}</h3>
                           <div className="flex items-center gap-2 mt-1">
                             <Badge variant="outline" className="font-semibold">{booking.car.model}</Badge>
                             <span className="text-muted-foreground flex items-center gap-1">
                               <MapPin className="w-3 h-3" />
                               {booking.car.city}
                             </span>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 pl-3 py-2 rounded-r-lg">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Daily Rate</Label>
                              <p className="font-bold text-lg">${booking.car.pricePerDay}</p>
                           </div>
                           <div className="border-l-4 border-green-500 bg-green-50/50 dark:bg-green-950/20 pl-3 py-2 rounded-r-lg">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Point to Point</Label>
                              <p className="font-bold text-lg">${booking.car.pricePlaceToPlace}</p>
                           </div>
                        </div>
                        {booking.withDriver && booking.car.driverInfo && (
                           <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                 <div className="p-1.5 bg-amber-600 rounded-md">
                                   <User className="h-3.5 w-3.5 text-white" />
                                 </div>
                                 <p className="font-bold text-sm text-amber-900 dark:text-amber-100">Assigned Driver</p>
                              </div>
                              <div className="space-y-1.5">
                                <p className="font-semibold text-foreground">{booking.car.driverInfo.name}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  <span>{booking.car.driverInfo.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span className="text-xs">{booking.car.driverInfo.email}</span>
                                </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Right Column: Customer Info */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{booking.userName}</h4>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Booking Customer</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 pl-3 py-3 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
                    </div>
                    <span className="text-sm font-semibold text-foreground break-all">{booking.userEmail}</span>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50/50 dark:bg-green-950/20 pl-3 py-3 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</Label>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{booking.userPhone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 bg-muted/30 p-4 border-t">
                 <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:${booking.userEmail}`)}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                 </Button>
                 <Button variant="secondary" className="w-full" onClick={() => window.open(`tel:${booking.userPhone}`)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                 </Button>
              </CardFooter>
            </Card>

            <Card className="border-2">
               <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                     <Clock className="w-4 h-4 text-primary" />
                     System Information
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3 pt-4">
                  <div className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 pl-3 py-2 rounded-r-lg">
                     <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-0.5">Created At</Label>
                     <span className="text-sm font-semibold text-foreground">{format(new Date(booking.createdAt), "PP p")}</span>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50/50 dark:bg-green-950/20 pl-3 py-2 rounded-r-lg">
                     <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-0.5">Last Updated</Label>
                     <span className="text-sm font-semibold text-foreground">{format(new Date(booking.updatedAt), "PP p")}</span>
                  </div>
                  <div className="border-l-4 border-slate-500 bg-slate-50/50 dark:bg-slate-950/20 pl-3 py-2 rounded-r-lg">
                     <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-0.5">Booking ID</Label>
                     <span className="text-xs font-mono font-semibold text-foreground break-all">{booking.id}</span>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
