"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, Loader2, Calendar, User, Mail, Phone, Hash, DollarSign } from "lucide-react"
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

interface TourBooking {
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
  }
}

export default function TourBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<TourBooking[]>([])
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
      const response = await fetch(`${normalizedBaseUrl}api/tour-bookings`)
      
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        toast.error("Failed to fetch tour bookings")
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Error loading tour bookings")
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking => 
    booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.tour.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold tracking-tight">Tour Bookings</h1>
            <p className="text-muted-foreground mt-2">Manage and view all tour booking requests.</p>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Input 
                  placeholder="Search by name, email, or tour..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                      <TableHead>Tour</TableHead>
                      <TableHead>User Details</TableHead>
                      <TableHead>People</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium max-w-[200px] truncate" title={booking.tour.title}>
                          {booking.tour.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{booking.userName}</span>
                            <span className="text-xs text-muted-foreground">{booking.userEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            {booking.peopleCount}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${booking.totalPrice}
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => router.push(`/superadmin/tour-bookings/${booking.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
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

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
