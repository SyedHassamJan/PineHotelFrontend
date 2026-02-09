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
  BedDouble
} from "lucide-react"
import Link from "next/link"

export default function BookingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")

  useEffect(() => {
    const hotelOwnerAuth = localStorage.getItem("hotelOwnerAuth")
    if (!hotelOwnerAuth) {
      router.push("/admin/login")
    } else {
      const auth = JSON.parse(hotelOwnerAuth)
      setOwnerEmail(auth.email)
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/admin/login")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const bookings = [
    { id: 1, bookingId: "BK-001", hotel: "Grand Plaza Hotel", room: "Deluxe Suite", guest: "John Doe", email: "john@example.com", checkIn: "Jan 25, 2026", checkOut: "Jan 28, 2026", nights: 3, guests: 2, amount: "$897", status: "confirmed" },
    { id: 2, bookingId: "BK-002", hotel: "Beach Resort Paradise", room: "Ocean View", guest: "Sarah Smith", email: "sarah@example.com", checkIn: "Jan 26, 2026", checkOut: "Jan 31, 2026", nights: 5, guests: 4, amount: "$945", status: "pending" },
    { id: 3, bookingId: "BK-003", hotel: "Grand Plaza Hotel", room: "Standard Room", guest: "Mike Johnson", email: "mike@example.com", checkIn: "Jan 27, 2026", checkOut: "Jan 29, 2026", nights: 2, guests: 1, amount: "$598", status: "confirmed" },
    { id: 4, bookingId: "BK-004", hotel: "Beach Resort Paradise", room: "Family Suite", guest: "Emily Davis", email: "emily@example.com", checkIn: "Feb 1, 2026", checkOut: "Feb 5, 2026", nights: 4, guests: 3, amount: "$1,120", status: "cancelled" },
  ]

  return (
    <div className="min-h-screen bg-background flex">
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
                  <h3 className="text-2xl font-bold mt-1">77</h3>
                </div>
                <Calendar className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <h3 className="text-2xl font-bold mt-1">65</h3>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <h3 className="text-2xl font-bold mt-1">8</h3>
                </div>
                <Clock className="w-10 h-10 text-orange-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                  <h3 className="text-2xl font-bold mt-1">4</h3>
                </div>
                <XCircle className="w-10 h-10 text-red-500/20" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Search bookings..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
              </div>
              <select className="px-4 py-2 border rounded-lg">
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
              <select className="px-4 py-2 border rounded-lg">
                <option>All Hotels</option>
                <option>Grand Plaza Hotel</option>
                <option>Beach Resort Paradise</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-accent/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Booking ID</th>
                    <th className="text-left p-4 font-semibold">Guest</th>
                    <th className="text-left p-4 font-semibold">Hotel & Room</th>
                    <th className="text-left p-4 font-semibold">Check-in</th>
                    <th className="text-left p-4 font-semibold">Check-out</th>
                    <th className="text-left p-4 font-semibold">Details</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="p-4">
                        <span className="font-mono text-sm font-medium">{booking.bookingId}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{booking.guest}</p>
                          <p className="text-xs text-muted-foreground">{booking.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{booking.hotel}</p>
                          <p className="text-xs text-muted-foreground">{booking.room}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{booking.checkIn}</td>
                      <td className="p-4 text-sm">{booking.checkOut}</td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>{booking.nights} nights</p>
                          <p className="text-muted-foreground">{booking.guests} guests</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium">{booking.amount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          booking.status === "confirmed" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                          booking.status === "pending" ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400" :
                          "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="p-2 hover:bg-accent rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
