"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, User, Mail, Phone, MapPin, Car, CheckCircle, XCircle, Search, Filter, Loader2, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

export default function CarBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/car-bookings`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        toast.error("Failed to fetch car bookings")
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Error loading bookings")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdating(id)
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
        fetchBookings() // Refresh list
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("An error occurred while updating status")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBookings = bookings.filter(booking => 
    booking.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.pickupCity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.car?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id?.includes(searchQuery)
  )

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Car Bookings</h1>
            <p className="text-muted-foreground">Manage ongoing and past car rental requests.</p>
          </div>
          <Button variant="outline" onClick={fetchBookings} disabled={loading}>
             <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
               View and manage all car rental bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="mb-4 flex items-center gap-2">
               <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Search bookings..."
                   className="pl-8"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
             </div>

             {loading ? (
               <div className="flex items-center justify-center p-8">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
               </div>
             ) : filteredBookings.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                  No bookings found matching your search.
               </div>
             ) : (
               <div className="rounded-md border">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Booking ID</TableHead>
                       <TableHead>Customer</TableHead>
                       <TableHead>Car</TableHead>
                       <TableHead>Details</TableHead>
                       <TableHead>Dates</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {filteredBookings.map((booking) => (
                       <TableRow key={booking.id}>
                         <TableCell className="font-medium text-xs text-muted-foreground">
                           {booking.id.substring(0, 8)}...
                         </TableCell>
                         <TableCell>
                           <div className="flex flex-col">
                             <span className="font-medium">{booking.userName}</span>
                             <span className="text-xs text-muted-foreground">{booking.userEmail}</span>
                             <span className="text-xs text-muted-foreground">{booking.userPhone}</span>
                           </div>
                         </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-2">
                               {booking.car?.images && booking.car.images[0] && (
                                  <img src={booking.car.images[0]} alt="Car" className="w-10 h-10 rounded object-cover bg-muted" />
                               )}
                               <span className="font-medium">{booking.car?.name || "Unknown Car"}</span>
                            </div>
                         </TableCell>
                         <TableCell>
                            <div className="text-sm space-y-1">
                               <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="w-3 h-3" /> {booking.pickupCity} → {booking.dropoffCity}
                               </div>
                               {booking.withDriver && (
                                  <Badge variant="outline" className="text-xs">With Driver</Badge>
                               )}
                            </div>
                         </TableCell>
                         <TableCell>
                            <div className="text-sm">
                               <div>From: {format(new Date(booking.pickupDate), "MMM d, yyyy")}</div>
                               <div>To: {format(new Date(booking.dropoffDate), "MMM d, yyyy")}</div>
                            </div>
                         </TableCell>
                         <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                               {booking.status}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-right">
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0" disabled={updating === booking.id}>
                                     <span className="sr-only">Open menu</span>
                                     {updating === booking.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                     ) : (
                                        <span className="text-lg font-bold">...</span>
                                     )}
                                  </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => router.push(`/superadmin/car-bookings/${booking.id}`)}>
                                     View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => updateStatus(booking.id, "PENDING")}>
                                     Mark Pending
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus(booking.id, "CONFIRMED")}>
                                     <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Confirm
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus(booking.id, "COMPLETED")}>
                                     Mark Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => updateStatus(booking.id, "CANCELLED")} className="text-red-600 focus:text-red-600">
                                     <XCircle className="mr-2 h-4 w-4" /> Cancel
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
