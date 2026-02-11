"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  MapPin
} from "lucide-react"
import { toast } from "sonner"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GuideBooking {
  id: string
  tourGuideId: string
  startDate: string
  endDate: string
  userName: string
  userEmail: string
  userPhone: string
  notes: string
  status: string
  createdAt: string
  updatedAt: string
  tourGuide?: {
    id: string
    name: string
    email: string
    phone: string
    city: string
    languages: string[]
    experienceYears: number
    pricePerDay: string
    images: string[]
  }
}

export default function GuideBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [booking, setBooking] = useState<GuideBooking | null>(null)
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
      const response = await fetch(`${normalizedBaseUrl}api/tour-guide-bookings/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setBooking(data)
      } else {
        toast.error("Failed to fetch booking details")
        router.push('/superadmin/guide-bookings')
      }
    } catch (error) {
      console.error("Error fetching booking:", error)
      toast.error("Error loading details")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdatingStatus(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tour-guide-bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Status updated to ${newStatus}`)
        fetchBooking()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("An error occurred")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return <Badge className="bg-green-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" /> CONFIRMED</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-500 text-white"><Clock className="w-3 h-3 mr-1" /> PENDING</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" /> CANCELLED</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">{status.toUpperCase()}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <SuperAdminSidebar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#006951]" />
        </div>
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SuperAdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="pl-0 hover:bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground mr-2">Update Status:</span>
              <Select defaultValue={booking.status} onValueChange={updateStatus} disabled={updatingStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-8">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/50 pb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-2xl font-bold mb-1">Booking Request</CardTitle>
                      <CardDescription>ID: {booking.id}</CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#006951]" />
                      <span className="font-semibold">
                        {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-[#006951]" />
                       <span>Applied on {format(new Date(booking.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 space-y-8">
                  <section>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-[#006951]" />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-xl border">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Full Name</p>
                        <p className="font-bold text-lg">{booking.userName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Email Address</p>
                        <p className="font-medium underline text-[#006951]">{booking.userEmail}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Phone Number</p>
                        <p className="font-medium">{booking.userPhone}</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[#006951]" />
                      Additional Notes
                    </h3>
                    <div className="bg-muted/30 p-6 rounded-xl border italic text-muted-foreground">
                      {booking.notes || "No additional notes provided by the user."}
                    </div>
                  </section>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar / Guide Info */}
            <div className="space-y-8">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Assigned Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {booking.tourGuide ? (
                    <>
                      <div className="text-center pb-2">
                        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#006951]/20">
                          <img 
                            src={booking.tourGuide.images && booking.tourGuide.images.length > 0 ? booking.tourGuide.images[0] : "/placeholder.svg"} 
                            alt={booking.tourGuide.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-bold text-lg">{booking.tourGuide.name}</h4>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>{booking.tourGuide.city}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{booking.tourGuide.experienceYears} Years Experience</p>
                      </div>
                      <Separator />
                      <div className="space-y-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 opacity-70 text-[#006951]" />
                          <span className="truncate">{booking.tourGuide.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 opacity-70 text-[#006951]" />
                          <span>{booking.tourGuide.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 opacity-70 text-[#006951]" />
                          <div className="flex flex-wrap gap-1">
                            {booking.tourGuide.languages?.map((lang, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] px-1 py-0">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-dashed">
                          <span className="text-xs text-muted-foreground">Daily Rate</span>
                          <span className="font-bold text-[#006951]">${booking.tourGuide.pricePerDay}</span>
                        </div>
                      </div>
                      <Button 
                        variant="secondary" 
                        className="w-full text-xs font-bold"
                        onClick={() => router.push(`/superadmin/tour-guides/${booking.tourGuide?.id}`)}
                      >
                        FULL PROFILE
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                       <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                       <p className="text-sm">Guide information not available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#006951] text-white border-none shadow-xl">
                 <CardContent className="p-6 space-y-4">
                    <h4 className="font-bold">Next Action</h4>
                    <p className="text-xs opacity-80 leading-relaxed">
                       Review the user's notes and check guide availability for the requested dates. Please communicate with both parties before approving.
                    </p>
                    <div className="pt-2">
                       <Button 
                        variant="outline" 
                        className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                        onClick={() => updateStatus('CONFIRMED')}
                        disabled={booking.status === 'CONFIRMED' || updatingStatus}
                       >
                         Quick Confirm
                       </Button>
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
