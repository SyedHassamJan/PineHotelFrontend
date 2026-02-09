"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  Home, 
  Calendar, 
  Settings,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Star,
  DollarSign,
  Users,
  BedDouble
} from "lucide-react"
import Link from "next/link"

export default function MyHotelsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

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

  const myHotels = [
    { 
      id: 1, 
      name: "Grand Plaza Hotel", 
      location: "New York, USA", 
      category: "5-Star",
      rooms: 150, 
      bookings: 45, 
      status: "active", 
      revenue: "$12,500",
      rating: 4.8,
      price: "$299/night"
    },
    { 
      id: 2, 
      name: "Beach Resort Paradise", 
      location: "Miami, USA", 
      category: "4-Star",
      rooms: 80, 
      bookings: 32, 
      status: "active", 
      revenue: "$8,900",
      rating: 4.6,
      price: "$189/night"
    },
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
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/my-hotels"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
            >
              <Building2 className="w-5 h-5" />
              My Hotels
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <Calendar className="w-5 h-5" />
              Bookings
            </Link>
            <Link
              href="/admin/rooms"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <BedDouble className="w-5 h-5" />
              Rooms
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-3 bg-accent rounded-lg mb-3">
              <p className="text-sm font-medium truncate">{ownerEmail}</p>
              <p className="text-xs text-muted-foreground">Hotel Owner</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-6">
          {/* Hotels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {myHotels.map((hotel) => (
              <div key={hotel.id} className="bg-white dark:bg-gray-950 rounded-lg border p-6">
                <div className="flex gap-4">
                  {/* Hotel Image */}
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-12 h-12 text-primary" />
                  </div>

                  {/* Hotel Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{hotel.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{hotel.location}</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">
                        {hotel.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                      <span className="text-xs text-muted-foreground">({hotel.category})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <BedDouble className="w-4 h-4 text-muted-foreground" />
                        <span>{hotel.rooms} Rooms</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{hotel.bookings} Bookings</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>Status: {hotel.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{hotel.revenue}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-accent">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-accent">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Hotel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-950 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Add New Hotel</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-accent rounded-lg">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hotel Name *</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter hotel name" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hotel Images *</label>
                  <input type="file" multiple accept="image/*" className="w-full px-4 py-2 border rounded-lg" />
                  <p className="text-xs text-muted-foreground mt-1">Upload multiple images of your hotel</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select className="w-full px-4 py-2 border rounded-lg">
                      <option>5-Star</option>
                      <option>4-Star</option>
                      <option>3-Star</option>
                      <option>2-Star</option>
                      <option>1-Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="City, Country" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Full address" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea rows={4} className="w-full px-4 py-2 border rounded-lg" placeholder="Describe your hotel..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Rooms *</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="Number of rooms" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Phone *</label>
                    <input type="tel" className="w-full px-4 py-2 border rounded-lg" placeholder="+1 234 567 8900" />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    ℹ️ <strong>Note:</strong> Pricing will be set by SuperAdmin after hotel approval.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Submit for Approval
                  </button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-accent">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
