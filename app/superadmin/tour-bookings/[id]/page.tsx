"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Hash, 
  DollarSign, 
  User, 
  Loader2,
  Clock,
  Edit,
  Trash
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

interface TourBookingDetail {
  id: string
  tourId: string
  peopleCount: number
  totalPrice: string
  userName: string
  userEmail: string
  userPhone: string
  notes: string
  status: string
  createdAt: string
  updatedAt: string
  tour: {
    id: string
    title: string
    shortDescription: string
    description: string
    durationDays: number
    durationNights: number
    city: string
    locations: string[]
    tourStartDate: string
    tourEndDate: string
    pricePerPerson: string
    includes: string[]
    excludes: string[]
    cardImages: string[]
  }
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [booking, setBooking] = useState<TourBookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (id) {
      fetchBooking()
    }
  }, [id])

  const fetchBooking = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tour-bookings/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setBooking(data)
      } else {
        toast.error("Failed to fetch booking details")
        router.push('/superadmin/tour-bookings')
      }
    } catch (error) {
      console.error("Error fetching booking:", error)
      toast.error("Error loading booking details")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdatingStatus(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const response = await fetch(`${normalizedBaseUrl}api/tour-bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Booking status updated to ${newStatus}`)
        setBooking(prev => prev ? { ...prev, status: newStatus } : null)
      } else {
        toast.error("Failed to update booking status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Error updating booking status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'bg-green-500 hover:bg-green-600'
      case 'PENDING': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'CANCELLED': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!booking) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Booking Details</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span className="font-mono text-sm">{booking.id}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(booking.status)} text-white px-4 py-1.5 text-sm`}>
                {booking.status}
              </Badge>
              <div className="flex gap-2">
                 {booking.status !== 'CONFIRMED' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => handleStatusUpdate('CONFIRMED')}
                      disabled={updatingStatus}
                    >
                       Confirm
                    </Button>
                 )}
                 {booking.status !== 'CANCELLED' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleStatusUpdate('CANCELLED')}
                      disabled={updatingStatus}
                    >
                       Cancel
                    </Button>
                 )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground block">Full Name</span>
                  <span className="text-lg font-medium">{booking.userName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground block">Email Address</span>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.userEmail}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground block">Phone Number</span>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.userPhone}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground block">Booked On</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tour Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Tour Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">{booking.tour.title}</h3>
                  <p className="text-muted-foreground">{booking.tour.shortDescription}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">Duration</span>
                    <span className="font-medium">{booking.tour.durationDays} Days / {booking.tour.durationNights} Nights</span>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">City</span>
                    <span className="font-medium">{booking.tour.city}</span>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">Start Date</span>
                    <span className="font-medium">
                       {booking.tour.tourStartDate ? format(new Date(booking.tour.tourStartDate), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">End Date</span>
                    <span className="font-medium">
                       {booking.tour.tourEndDate ? format(new Date(booking.tour.tourEndDate), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                  </div>
                </div>

                {booking.tour.locations && booking.tour.locations.length > 0 && (
                   <div>
                      <span className="text-sm font-medium text-muted-foreground block mb-2">Locations</span>
                      <div className="flex flex-wrap gap-2">
                         {booking.tour.locations.map((loc, i) => (
                            <Badge key={i} variant="outline">{loc}</Badge>
                         ))}
                      </div>
                   </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {booking.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary" />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{booking.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <DollarSign className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Price per person</span>
                  <span className="font-medium">${booking.tour.pricePerPerson}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Number of people</span>
                  <span className="font-medium">x {booking.peopleCount}</span>
                </div>
                <Separator className="bg-primary/20" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total Amount</span>
                  <span className="font-bold text-xl text-primary">${booking.totalPrice}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
