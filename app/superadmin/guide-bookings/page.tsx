"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, Loader2, Calendar, User, Mail, Phone, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
    images: string[]
  }
}

export default function GuideBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<GuideBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tour-guide-bookings`)
      
      if (response.ok) {
        const data = await response.json()
        setBookings(Array.isArray(data) ? data : (data.data || []))
      } else {
        toast.error("Failed to fetch guide bookings")
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Error loading guide bookings")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tour-guide-bookings/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("Booking deleted successfully")
        setBookings(bookings.filter(b => b.id !== id))
      } else {
        toast.error("Failed to delete booking")
      }
    } catch (error) {
      console.error("Error deleting booking:", error)
      toast.error("An error occurred")
    }
  }

  const filteredBookings = bookings.filter(booking => 
    booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.tourGuide?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-500 hover:bg-green-600'
      case 'PENDING':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'CANCELLED':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#006951]">Tour Guide Bookings</h1>
            <p className="text-muted-foreground mt-2">Manage and view all guide booking requests.</p>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Input 
                  placeholder="Search by name, email, or guide..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4"
                />
              </div>
              <Button variant="outline" onClick={fetchBookings}>Refresh</Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#006951]" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No bookings found.
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guide</TableHead>
                      <TableHead>User Details</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border shrink-0">
                               <img 
                                  src={booking.tourGuide?.images && booking.tourGuide.images.length > 0 ? booking.tourGuide.images[0] : "/placeholder.svg"} 
                                  alt={booking.tourGuide?.name} 
                                  className="w-full h-full object-cover"
                               />
                            </div>
                            <span>{booking.tourGuide?.name || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{booking.userName}</span>
                            <span className="text-xs text-muted-foreground">{booking.userEmail}</span>
                            <span className="text-xs text-muted-foreground">{booking.userPhone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> 
                              {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(booking.status)} text-white`}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => router.push(`/superadmin/guide-bookings/${booking.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the booking.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(booking.id)} className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
