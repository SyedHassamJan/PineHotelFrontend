"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import {
  ShieldCheck,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Building2,
  BedDouble,
  Users,
  Mail,
  Phone,
  Eye,
  MapPin
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Booking {
  id: string
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  roomsBooked: number
  userName: string
  userEmail: string
  userPhone: string
  status: string
  createdAt: string
  hotel: {
    id: string
    name: string
    address: string
    city: string
    phone: string
    email: string
    description: string
    images: string[]
  }
  room: {
    id: string
    roomType: string
    price: string
    description: string
    bedType: string
    maxGuests: number
    roomFloor: string
    images: string[]
    amenities: { name: string }[]
  }
}

export default function SuperAdminBookingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const superadminAuth = localStorage.getItem("superadminAuth")
      if (!superadminAuth) {
        router.push("/superadmin/login")
        return
      }
      setIsAuthenticated(true)
      fetchBookings()
    }
    checkAuth()
  }, [router])

  const fetchBookings = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const response = await fetch(`${normalizedBaseUrl}api/bookings`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
      toast.error("Failed to load bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const response = await fetch(`${normalizedBaseUrl}api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Booking ${newStatus.toLowerCase()} successfully`)
        fetchBookings() // Refresh list
        if (selectedBooking?.id === bookingId) {
            setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null)
        }
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update booking status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailOpen(true)
  }

  const filteredBookings = bookings.filter(booking => 
    booking.hotel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      {isUpdating && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="font-medium text-lg">Updating booking status...</p>
          </div>
        </div>
      )}

      <SuperAdminSidebar />
      
      <div className="flex-1">
        <div className="border-b bg-white dark:bg-gray-950 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Calendar className="w-6 h-6 text-primary" />
             <h1 className="text-xl font-bold">All Bookings</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white dark:bg-gray-950 rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Hotel Info</th>
                    <th className="text-left p-4 font-semibold text-sm">Room Details</th>
                    <th className="text-left p-4 font-semibold text-sm">Guest Info</th>
                    <th className="text-left p-4 font-semibold text-sm">Dates & Status</th>
                    <th className="text-right p-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-accent/50 transition-colors">
                        <td className="p-4 align-top w-1/4">
                          <div className="flex gap-3">
                            {booking.hotel?.images?.[0] ? (
                              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                  src={booking.hotel.images[0]} 
                                  alt={booking.hotel.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-8 h-8 opacity-20" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-sm line-clamp-1">{booking.hotel?.name || 'Unknown Hotel'}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{booking.hotel?.address}</p>
                              <p className="text-xs text-muted-foreground">{booking.hotel?.city}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4 align-top w-1/4">
                           <div className="space-y-1">
                              <p className="font-medium text-sm flex items-center gap-2">
                                <BedDouble className="w-3 h-3 text-primary" />
                                {booking.room?.roomType || 'Unknown Room'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {booking.roomsBooked} room(s) booked
                              </p>
                              <p className="font-bold text-sm text-primary">
                                ${booking.room?.price} <span className="text-[10px] font-normal text-muted-foreground">/ night</span>
                              </p>
                           </div>
                        </td>

                        <td className="p-4 align-top w-1/4">
                          <div className="space-y-1">
                            <p className="font-medium text-sm flex items-center gap-2">
                              <Users className="w-3 h-3 text-muted-foreground" />
                              {booking.userName}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {booking.userEmail}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {booking.userPhone}
                            </p>
                          </div>
                        </td>

                        <td className="p-4 align-top">
                          <div className="space-y-2">
                            <div className="text-xs">
                              <p><span className="text-muted-foreground">In:</span> {booking.checkIn}</p>
                              <p><span className="text-muted-foreground">Out:</span> {booking.checkOut}</p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              booking.status === "confirmed" || booking.status === "CONFIRMED" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                              booking.status === "pending" || booking.status === "PENDING" ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400" :
                              "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 align-top text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetail(booking)} title="View Details">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}>
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  Confirm Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}>
                                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No bookings found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center justify-between">
              <span>Booking Details</span>
              {selectedBooking && (
                <span className={`text-sm px-4 py-1.5 rounded-full font-medium ${
                  selectedBooking.status === "confirmed" || selectedBooking.status === "CONFIRMED" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                  selectedBooking.status === "pending" || selectedBooking.status === "PENDING" ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400" :
                  "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                }`}>
                  {selectedBooking.status || 'PENDING'}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6 py-6">
              {/* Hotel Information */}
              <div className="bg-muted/20 p-6 rounded-xl border">
                <div className="flex flex-col md:flex-row gap-6">
                   {selectedBooking.hotel?.images?.[0] && (
                      <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                         <img 
                            src={selectedBooking.hotel.images[0]} 
                            alt={selectedBooking.hotel.name}
                            className="w-full h-full object-cover"
                         />
                      </div>
                   )}
                   <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold">{selectedBooking.hotel.name}</h3>
                        <div className="flex flex-col items-end gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(selectedBooking.id, "CONFIRMED")}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(selectedBooking.id, "CANCELLED")}
                          >
                             <XCircle className="w-4 h-4" />
                             Cancel
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <MapPin className="w-4 h-4" />
                         {selectedBooking.hotel.address}, {selectedBooking.hotel.city}
                      </div>
                      <div className="flex items-center gap-4 text-sm pt-2">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          {selectedBooking.hotel.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          {selectedBooking.hotel.email}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {selectedBooking.hotel.description}
                      </p>
                   </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="grid md:grid-cols-3 gap-6">
                 <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <BedDouble className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">Room Details</h3>
                    </div>
                    
                    <div className="border rounded-xl p-5 bg-card">
                       <div className="flex gap-4">
                          {selectedBooking.room?.images?.[0] && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                               <img 
                                  src={selectedBooking.room.images[0]} 
                                  alt={selectedBooking.room.roomType}
                                  className="w-full h-full object-cover"
                               />
                            </div>
                          )}
                          <div>
                             <h4 className="font-bold text-lg">{selectedBooking.room.roomType}</h4>
                             <p className="text-sm text-muted-foreground mb-2">{selectedBooking.room.description}</p>
                             <div className="flex flex-wrap gap-2">
                                <span className="text-xs px-2 py-1 bg-primary/10 rounded flex items-center gap-1">
                                   <BedDouble className="w-3 h-3" /> {selectedBooking.room.bedType}
                                </span>
                                <span className="text-xs px-2 py-1 bg-primary/10 rounded flex items-center gap-1">
                                   <Users className="w-3 h-3" /> Max {selectedBooking.room.maxGuests} guests
                                </span>
                                {selectedBooking.room.roomFloor && (
                                  <span className="text-xs px-2 py-1 bg-primary/10 rounded flex items-center gap-1">
                                     <Building2 className="w-3 h-3" /> {selectedBooking.room.roomFloor}
                                  </span>
                                )}
                             </div>
                          </div>
                       </div>
                       
                       {selectedBooking.room.amenities && selectedBooking.room.amenities.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                             <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Amenities</p>
                             <div className="flex flex-wrap gap-2">
                                {selectedBooking.room.amenities.map((amenity, idx) => (
                                   <span key={idx} className="text-xs px-2 py-1 border rounded-full bg-background">
                                      {amenity.name}
                                   </span>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">Guest</h3>
                    </div>
                    <div className="bg-muted/10 border rounded-xl p-5 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                             {selectedBooking.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <p className="font-bold">{selectedBooking.userName}</p>
                             <p className="text-xs text-muted-foreground">Guest</p>
                          </div>
                       </div>
                       <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                             <Mail className="w-4 h-4 text-muted-foreground" />
                             <span className="truncate">{selectedBooking.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Phone className="w-4 h-4 text-muted-foreground" />
                             {selectedBooking.userPhone}
                          </div>
                       </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 space-y-3">
                       <p className="text-xs font-bold text-muted-foreground uppercase">Payment Summary</p>
                       <div className="flex justify-between text-sm">
                          <span>Price/Night</span>
                          <span>${selectedBooking.room.price}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span>Rooms</span>
                          <span>x {selectedBooking.roomsBooked}</span>
                       </div>
                       <div className="pt-2 border-t border-primary/10 flex justify-between font-bold text-lg text-primary">
                          <span>Total</span>
                          <span>${(Number(selectedBooking.room.price) * selectedBooking.roomsBooked).toFixed(2)}</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
