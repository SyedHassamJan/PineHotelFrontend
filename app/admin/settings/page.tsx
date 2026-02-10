"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  Home, 
  Calendar, 
  Settings,
  LogOut,
  User,
  Lock,
  Bell,
  Mail,
  Save,
  BedDouble,
  Loader,
  Star
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [hotelData, setHotelData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    city: "",
    country: "",
    hotelRank: "",
    numberOfRooms: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const hotelOwnerAuth = localStorage.getItem("hotelOwnerAuth")
    if (!hotelOwnerAuth) {
      router.push("/admin/login")
    } else {
      const auth = JSON.parse(hotelOwnerAuth)
      setOwnerEmail(auth.email)
      
      // Try to get the correct user ID from multiple sources
      let id = auth.id || auth.userId || auth.user_id || auth.hotel_id
      
      // Fallback: check the 'user' localStorage item
      if (!id) {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          id = user.id || user.userId || user.user_id
          console.log('Got ID from user storage:', id)
        }
      }
      
      console.log('User auth data:', auth) // Debug log
      console.log('Extracted ID:', id) // Debug log
      
      if (!id) {
        setMessage({ type: "error", text: "User ID not found. Please login again." })
        setIsLoading(false)
        return
      }
      
      setUserId(id)
      setIsAuthenticated(true)
      fetchHotelData(id)
    }
  }, [router])

  const fetchHotelData = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels/${id}`)
      if (response.ok) {
        const data = await response.json()
        setHotelData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          description: data.description || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          hotelRank: data.hotelRank?.toString() || "",
          numberOfRooms: data.numberOfRooms?.toString() || "",
        })
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setHotelData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // Only include fields that have values
      const updatePayload: any = {
        role: "hotel_owner",
      }

      if (hotelData.name?.trim()) updatePayload.name = hotelData.name
      if (hotelData.email?.trim()) updatePayload.email = hotelData.email
      if (hotelData.phone?.trim()) updatePayload.phone = hotelData.phone
      if (hotelData.description?.trim()) updatePayload.description = hotelData.description
      if (hotelData.address?.trim()) updatePayload.address = hotelData.address
      if (hotelData.city?.trim()) updatePayload.city = hotelData.city
      if (hotelData.country?.trim()) updatePayload.country = hotelData.country
      if (hotelData.hotelRank) updatePayload.hotelRank = parseInt(hotelData.hotelRank)
      if (hotelData.numberOfRooms) updatePayload.numberOfRooms = parseInt(hotelData.numberOfRooms)

      console.log('Update payload:', updatePayload) // Debug log
      console.log('User ID:', userId) // Debug log

      if (!userId) {
        setMessage({ type: "error", text: "User ID not found. Please login again." })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" })
        // Update localStorage email if changed
        if (hotelData.email) {
          const auth = JSON.parse(localStorage.getItem("hotelOwnerAuth") || "{}")
          auth.email = hotelData.email
          localStorage.setItem("hotelOwnerAuth", JSON.stringify(auth))
          setOwnerEmail(hotelData.email)
        }
        // Refresh data
        await fetchHotelData(userId)
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.message || "Failed to update profile" })
      }
    } catch (error: any) {
      console.error('Update error:', error) // Debug log
      setMessage({ type: "error", text: error.message || "An error occurred while updating profile" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }

    if (!userId) {
      setMessage({ type: "error", text: "User ID not found. Please login again." })
      return
    }

    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: passwordData.newPassword,
          role: "hotel_owner",
        }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" })
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.message || "Failed to update password" })
      }
    } catch (error: any) {
      console.error('Password update error:', error) // Debug log
      setMessage({ type: "error", text: error.message || "An error occurred while updating password" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/admin/login")
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

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
            <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Calendar className="w-5 h-5" />
              Bookings
            </Link>
            <Link href="/admin/rooms" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <BedDouble className="w-5 h-5" />
              Rooms
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
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
        <div className="p-6 max-w-4xl">
          {/* Message Alert */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === "success" 
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200" 
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Hotel Information */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Hotel Information</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hotel Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={hotelData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={hotelData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={hotelData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={hotelData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    value={hotelData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={hotelData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Hotel Rating (Stars)
                  </label>
                  <input 
                    type="number" 
                    name="hotelRank"
                    value={hotelData.hotelRank}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">1 to 5 stars</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <BedDouble className="w-4 h-4 text-primary" />
                    Number of Rooms
                  </label>
                  <input 
                    type="number" 
                    name="numberOfRooms"
                    value={hotelData.numberOfRooms}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Total rooms available</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  rows={3} 
                  name="description"
                  value={hotelData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg bg-background" 
                />
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Security</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-lg bg-background" 
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Leave blank to keep current password. Minimum 6 characters.</p>
              <button 
                onClick={handleUpdatePassword}
                disabled={isSaving || !passwordData.newPassword}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
            </div>
            <div className="space-y-3">
              {[
                { title: "Email Notifications", description: "Receive email updates for new bookings" },
                { title: "Booking Alerts", description: "Get notified when a new booking is made" },
                { title: "Payment Confirmations", description: "Receive payment confirmation emails" },
                { title: "Weekly Reports", description: "Get weekly performance reports" },
                { title: "Cancellation Alerts", description: "Get notified about booking cancellations" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
