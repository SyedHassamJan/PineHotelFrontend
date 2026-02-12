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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-lg bg-emerald-600 shadow-lg mb-4">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
          <p className="text-gray-700 font-semibold">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {isUpdating && (
        <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="font-semibold text-lg text-gray-900">Updating booking status...</p>
          </div>
        </div>
      )}

      <SuperAdminSidebar />
      
      <div className="flex-1">
        <div className="border-b-2 border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">All Bookings</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">Hotel Info</th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">Room Details</th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">Guest Info</th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">Dates & Status</th>
                    <th className="text-right p-4 font-semibold text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 align-top w-1/4">
                          <div className="flex gap-3">
                            {booking.hotel?.images?.[0] ? (
                              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 border-gray-200">
                                <img 
                                  src={booking.hotel.images[0]} 
                                  alt={booking.hotel.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border-2 border-gray-200">
                                <Building2 className="w-8 h-8 text-gray-300" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-sm line-clamp-1 text-gray-900">{booking.hotel?.name || 'Unknown Hotel'}</p>
                              <p className="text-xs text-gray-600 line-clamp-1">{booking.hotel?.address}</p>
                              <p className="text-xs text-gray-500">{booking.hotel?.city}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4 align-top w-1/4">
                           <div className="space-y-1">
                              <p className="font-medium text-sm flex items-center gap-2 text-gray-900">
                                <BedDouble className="w-3 h-3 text-emerald-600" />
                                {booking.room?.roomType || 'Unknown Room'}
                              </p>
                              <p className="text-xs text-gray-600">
                                {booking.roomsBooked} room(s) booked
                              </p>
                              <p className="font-bold text-sm text-emerald-600">
                                ${booking.room?.price} <span className="text-[10px] font-normal text-gray-500">/ night</span>
                              </p>
                           </div>
                        </td>

                        <td className="p-4 align-top w-1/4">
                          <div className="space-y-1">
                            <p className="font-medium text-sm flex items-center gap-2 text-gray-900">
                              <Users className="w-3 h-3 text-emerald-600" />
                              {booking.userName}
                            </p>
                            <p className="text-xs text-gray-600 flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {booking.userEmail}
                            </p>
                            <p className="text-xs text-gray-600 flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {booking.userPhone}
                            </p>
                          </div>
                        </td>

                        <td className="p-4 align-top">
                          <div className="space-y-2">
                            <div className="text-xs text-gray-700">
                              <p><span className="text-gray-500">In:</span> {booking.checkIn}</p>
                              <p><span className="text-gray-500">Out:</span> {booking.checkOut}</p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-lg ${
                              booking.status === "confirmed" || booking.status === "CONFIRMED" ? "bg-emerald-600 text-white" :
                              booking.status === "pending" || booking.status === "PENDING" ? "bg-orange-500 text-white" :
                              "bg-red-500 text-white"
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 align-top text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewDetail(booking)} 
                              title="View Details"
                              className="h-9 w-9 rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="border-2 border-gray-200">
                                <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")} className="cursor-pointer hover:bg-emerald-50">
                                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                                  Confirm Booking
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, "CANCELLED")} className="cursor-pointer hover:bg-red-50">
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
                      <td colSpan={5} className="p-8 text-center text-gray-600">
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
        <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto border-2 border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center justify-between">
              <span className="flex items-center gap-3 text-gray-900">
                <div className="p-2 rounded-lg bg-emerald-600">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Booking Details
              </span>
              {selectedBooking && (
                <span className={`text-sm px-4 py-1.5 rounded-lg font-semibold ${
                  selectedBooking.status === "confirmed" || selectedBooking.status === "CONFIRMED" ? "bg-emerald-600 text-white" :
                  selectedBooking.status === "pending" || selectedBooking.status === "PENDING" ? "bg-orange-500 text-white" :
                  "bg-red-500 text-white"
                }`}>
                  {selectedBooking.status || 'PENDING'}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6 py-6">
              {/* Hotel Information */}
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                <div className="flex flex-col md:flex-row gap-6">
                   {selectedBooking.hotel?.images?.[0] && (
                      <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 border-2 border-gray-200">
                         <img 
                            src={selectedBooking.hotel.images[0]} 
                            alt={selectedBooking.hotel.name}
                            className="w-full h-full object-cover"
                         />
                      </div>
                   )}
                   <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-900">{selectedBooking.hotel.name}</h3>
                        <div className="flex flex-col items-end gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 gap-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => handleStatusUpdate(selectedBooking.id, "CONFIRMED")}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleStatusUpdate(selectedBooking.id, "CANCELLED")}
                          >
                             <XCircle className="w-4 h-4" />
                             Cancel
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                         <MapPin className="w-4 h-4" />
                         {selectedBooking.hotel.address}, {selectedBooking.hotel.city}
                      </div>
                      <div className="flex items-center gap-4 text-sm pt-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          {selectedBooking.hotel.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-emerald-600" />
                          {selectedBooking.hotel.email}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {selectedBooking.hotel.description}
                      </p>
                   </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="grid md:grid-cols-3 gap-6">
                 <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                      <BedDouble className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-semibold text-lg text-gray-900">Room Details</h3>
                    </div>
                    
                    <div className="border-2 border-gray-200 rounded-xl p-5 bg-white">
                       <div className="flex gap-4">
                          {selectedBooking.room?.images?.[0] && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border-2 border-gray-200">
                               <img 
                                  src={selectedBooking.room.images[0]} 
                                  alt={selectedBooking.room.roomType}
                                  className="w-full h-full object-cover"
                               />
                            </div>
                          )}
                          <div>
                             <h4 className="font-bold text-lg text-gray-900">{selectedBooking.room.roomType}</h4>
                             <p className="text-sm text-gray-600 mb-2">{selectedBooking.room.description}</p>
                             <div className="flex flex-wrap gap-2">
                                <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center gap-1">
                                   <BedDouble className="w-3 h-3" /> {selectedBooking.room.bedType}
                                </span>
                                <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center gap-1">
                                   <Users className="w-3 h-3" /> Max {selectedBooking.room.maxGuests} guests
                                </span>
                                {selectedBooking.room.roomFloor && (
                                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center gap-1">
                                     <Building2 className="w-3 h-3" /> {selectedBooking.room.roomFloor}
                                  </span>
                                )}
                             </div>
                          </div>
                       </div>
                       
                       {selectedBooking.room.amenities && selectedBooking.room.amenities.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                             <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Amenities</p>
                             <div className="flex flex-wrap gap-2">
                                {selectedBooking.room.amenities.map((amenity, idx) => (
                                   <span key={idx} className="text-xs px-2 py-1 border border-gray-300 rounded-full bg-white text-gray-700">
                                      {amenity.name}
                                   </span>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-200">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-semibold text-lg text-gray-900">Guest</h3>
                    </div>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                             {selectedBooking.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <p className="font-bold text-gray-900">{selectedBooking.userName}</p>
                             <p className="text-xs text-gray-500">Guest</p>
                          </div>
                       </div>
                       <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                             <Mail className="w-4 h-4 text-emerald-600" />
                             <span className="truncate">{selectedBooking.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                             <Phone className="w-4 h-4 text-emerald-600" />
                             {selectedBooking.userPhone}
                          </div>
                       </div>
                    </div>

                    <div className="bg-emerald-50 border-2 border-emerald-600 rounded-xl p-5 space-y-3">
                       <p className="text-xs font-bold text-gray-600 uppercase">Payment Summary</p>
                       <div className="flex justify-between text-sm text-gray-700">
                          <span>Price/Night</span>
                          <span className="font-semibold">${selectedBooking.room.price}</span>
                       </div>
                       <div className="flex justify-between text-sm text-gray-700">
                          <span>Rooms</span>
                          <span className="font-semibold">x {selectedBooking.roomsBooked}</span>
                       </div>
                       <div className="pt-2 border-t-2 border-emerald-600 flex justify-between font-bold text-lg text-emerald-600">
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
