"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  Home, 
  Calendar, 
  Settings,
  LogOut,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  BedDouble,
  Loader2,
  Mail,
  Phone
} from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function BookingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0
  })

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.id) {
      router.push("/admin/login")
      return
    }
    
    setOwnerEmail(user.name) // or user.email if available
    setIsAuthenticated(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      // Fetch Bookings using user.id
      const bookingsResponse = await fetch(`${normalizedBaseUrl}api/bookings/hotel/${user.id}`)
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)
          
          // Calculate Stats
          const newStats = bookingsData.reduce((acc: any, booking: any) => {
            acc.total++
            const status = booking.status?.toLowerCase() || 'pending'
            if (status === 'confirmed') acc.confirmed++
            else if (status === 'pending') acc.pending++
            else if (status === 'cancelled') acc.cancelled++
            return acc
          }, { total: 0, confirmed: 0, pending: 0, cancelled: 0 })
          
          setStats(newStats)
        }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/admin/login")
  }

  const handleViewDetail = (booking: any) => {
    setSelectedBooking(booking)
    setIsDetailOpen(true)
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
        // toast.success(`Booking ${newStatus.toLowerCase()} successfully`)
        fetchData() // Refresh list
        if (selectedBooking?.id === bookingId) {
            setSelectedBooking((prev: any) => prev ? { ...prev, status: newStatus } : null)
        }
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error("Error updating status:", error)
      // toast.error("Failed to update booking status")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isAuthenticated) return null // Already handled in useEffect or show loader

  if (loading) {
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
    <div className="min-h-screen bg-background flex relative">
      {isUpdating && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="font-medium text-lg">Updating booking status...</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r min-h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Hotel Owner</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/admin/my-hotels" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Building2 className="w-5 h-5" />
              My Hotels
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
              <Calendar className="w-5 h-5" />
              Bookings
            </Link>
            <Link href="/admin/rooms" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <BedDouble className="w-5 h-5" />
              Rooms
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-3 bg-accent rounded-lg mb-3">
              <p className="text-sm font-medium truncate">{ownerEmail}</p>
              <p className="text-xs text-muted-foreground">Hotel Owner</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                </div>
                <Calendar className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.confirmed}</h3>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.pending}</h3>
                </div>
                <Clock className="w-10 h-10 text-orange-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.cancelled}</h3>
                </div>
                <XCircle className="w-10 h-10 text-red-500/20" />
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border overflow-hidden">
            <div className="p-4 border-b">
               <h3 className="text-lg font-semibold">Latest Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-accent/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Guest</th>
                    <th className="text-left p-4 font-semibold">Room Type</th>
                    <th className="text-left p-4 font-semibold">Check In</th>
                    <th className="text-left p-4 font-semibold">Check Out</th>
                    <th className="text-left p-4 font-semibold">Rooms</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{booking.userName}</p>
                          <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        {booking.room?.roomType || 'N/A'}
                      </td>
                      <td className="p-4 text-sm">{booking.checkIn}</td>
                      <td className="p-4 text-sm">{booking.checkOut}</td>
                      <td className="p-4 text-sm">{booking.roomsBooked}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          booking.status === "confirmed" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                          booking.status === "pending" || booking.status === "PENDING" ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400" :
                          "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        }`}>
                          {booking.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetail(booking)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        {/* Simple quick actions in table */}
                        {booking.status !== 'confirmed' && (
                           <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                              title="Confirm"
                            >
                              <CheckCircle className="w-4 h-4" />
                           </Button>
                        )}
                         {booking.status !== 'cancelled' && (
                           <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                              title="Cancel"
                           >
                              <XCircle className="w-4 h-4" />
                           </Button>
                        )}
                      </td>
                    </tr>
                  ))}
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
              <div className="flex items-center gap-3">
                 {selectedBooking && (
                    <>
                    <span className={`text-sm px-4 py-1.5 rounded-full font-medium ${
                      selectedBooking.status === "confirmed" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                      selectedBooking.status === "pending" || selectedBooking.status === "PENDING" ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400" :
                      "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    }`}>
                      {selectedBooking.status || 'PENDING'}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full"
                        onClick={() => handleStatusUpdate(selectedBooking.id, "confirmed")}
                        title="Confirm Booking"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                        onClick={() => handleStatusUpdate(selectedBooking.id, "cancelled")}
                        title="Cancel Booking"
                      >
                         <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    </>
                 )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && selectedBooking.room && (
            <div className="space-y-8 py-6">
              {/* Room Details - Top Section */}
              <div className="bg-muted/30 p-6 rounded-xl border">
                  <div className="flex flex-col md:flex-row gap-8">
                    {selectedBooking.room.images?.[0] ? (
                      <div className="w-full md:w-72 h-48 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        <img 
                          src={selectedBooking.room.images[0]} 
                          alt={selectedBooking.room.roomType}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full md:w-72 h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                        <BedDouble className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-primary">{selectedBooking.room.roomType}</h3>
                            <p className="text-muted-foreground mt-1 text-base">{selectedBooking.room.description}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-bold">${selectedBooking.room.price}</p>
                             <p className="text-sm text-muted-foreground">per night</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4 border-t border-b">
                        <div className="flex items-center gap-3">
                          <BedDouble className="w-5 h-5 text-primary" />
                          <span className="text-base">{selectedBooking.room.bedType}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Users className="w-5 h-5 text-primary" />
                           <span className="text-base">Max {selectedBooking.room.maxGuests} guests</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Building2 className="w-5 h-5 text-primary" />
                           <span className="text-base">{selectedBooking.room.roomFloor || 'Standard Floor'}</span>
                        </div>
                      </div>

                      {selectedBooking.room.amenities && selectedBooking.room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedBooking.room.amenities.map((amenity: any, idx: number) => (
                            <span key={idx} className="bg-background border text-foreground text-xs px-3 py-1 rounded-full font-medium">
                              {amenity.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Guest Information - Left Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-xl">Guest Details</h3>
                  </div>
                  <div className="bg-muted/10 p-6 rounded-xl border border-border/50 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                        {selectedBooking.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Guest Name</p>
                        <p className="font-bold text-xl">{selectedBooking.userName}</p>
                      </div>
                    <div className="grid gap-4 pl-2">
                        <div className="flex items-center gap-4 p-3 bg-background rounded-lg border">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                             <p className="text-xs text-muted-foreground">Email</p>
                             <p className="font-medium text-sm">{selectedBooking.userEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-background rounded-lg border">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <div>
                             <p className="text-xs text-muted-foreground">Phone</p>
                             <p className="font-medium text-sm">{selectedBooking.userPhone}</p>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Booking Summary - Right Column */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 pb-2 border-b">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-xl">Reservation Summary</h3>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-background rounded-lg border shadow-sm">
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Check In</p>
                          <p className="font-bold text-lg text-primary">{selectedBooking.checkIn}</p>
                        </div>
                        <div className="p-4 bg-background rounded-lg border shadow-sm">
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Check Out</p>
                          <p className="font-bold text-lg text-primary">{selectedBooking.checkOut}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-sm p-2 hover:bg-background/50 rounded transition-colors">
                            <span className="text-muted-foreground">Total Rooms</span>
                            <span className="font-semibold">{selectedBooking.roomsBooked}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm p-2 hover:bg-background/50 rounded transition-colors">
                            <span className="text-muted-foreground">Nights</span>
                            <span className="font-semibold">
                              {Math.ceil((new Date(selectedBooking.checkOut).getTime() - new Date(selectedBooking.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                            </span>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-primary/10">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                            <p className="text-xs text-muted-foreground">{selectedBooking.roomsBooked} rooms</p>
                          </div>
                          <p className="text-3xl font-bold text-primary">
                            ${(Number(selectedBooking.room.price || 0) * Number(selectedBooking.roomsBooked)).toFixed(2)}
                          </p>
                        </div>
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
