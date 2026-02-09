"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import {
  ShieldCheck,
  Users,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  UserCheck,
  Clock
} from "lucide-react"

interface Hotel {
  id: string
  name: string
  email: string
  phone: string
  city: string
  country: string
  address: string
  description: string
  status: string
  images: string[]
  role: string
  createdAt: string
}

export default function SuperAdminDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")

  // Check authentication
  useEffect(() => {
    const superadminAuth = localStorage.getItem("superadminAuth")
    const userStr = localStorage.getItem("user")
    
    if (!superadminAuth) {
      router.push("/superadmin/login")
    } else {
      setIsAuthenticated(true)
      
      // Get user name from user object
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setUserName(user.name || user.email || "SuperAdmin")
        } catch (error) {
          console.error("Error parsing user data", error)
          const auth = JSON.parse(superadminAuth)
          setUserName(auth.email || "SuperAdmin")
        }
      } else {
        const auth = JSON.parse(superadminAuth)
        setUserName(auth.email || "SuperAdmin")
      }
      
      fetchHotels()
    }
  }, [router])

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/hotels`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setHotels(data)
      }
    } catch (error) {
      console.error('Failed to fetch hotels:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{isLoading ? 'Loading dashboard...' : 'Checking authentication...'}</p>
        </div>
      </div>
    )
  }

  // Calculate stats from fetched data
  const totalUsers = hotels.length // Hotels are tied to users
  const approvedHotels = hotels.filter(h => h.status === 'approved')
  const pendingHotels = hotels.filter(h => h.status === 'pending')

  const stats = [
    { label: "Total Users", value: totalUsers.toString(), icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Total Hotels", value: approvedHotels.length.toString(), icon: Building2, color: "bg-secondary/10 text-secondary" },
    { label: "Pending Approvals", value: pendingHotels.length.toString(), icon: Clock, color: "bg-orange-500/10 text-orange-500" },
    { label: "Total Revenue", value: "$2.4M", icon: DollarSign, color: "bg-green-500/10 text-green-500" },
  ]

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  const recentActivities = [
    { type: "approval", message: "Approved hotel submission: Grand Plaza", user: "Admin", time: "10 min ago" },
    { type: "user", message: "New user registration: Emily Johnson", user: "System", time: "25 min ago" },
    { type: "booking", message: "New booking: Mountain Resort Package", user: "Customer", time: "1 hour ago" },
    { type: "rejection", message: "Rejected tour: Budget City Tour", user: "Admin", time: "2 hours ago" },
    { type: "payment", message: "Payment received: $1,250", user: "System", time: "3 hours ago" },
  ]

  const adminUsers = [
    { name: "John Doe", email: "admin1@travelhub.com", role: "Admin", status: "active", lastActive: "Online" },
    { name: "Sarah Smith", email: "admin2@travelhub.com", role: "Admin", status: "active", lastActive: "2 hours ago" },
    { name: "Mike Johnson", email: "admin3@travelhub.com", role: "Moderator", status: "inactive", lastActive: "1 day ago" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="flex h-16 items-center px-6 justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">SuperAdmin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Logged in as {userName}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">SuperAdmin</p>
              </div>
              <button 
                onClick={() => {
                  localStorage.clear()
                  router.push("/superadmin/login")
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white dark:bg-gray-950 rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Approvals */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Pending Approvals</h2>
              <div className="space-y-3">
                {pendingHotels.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No pending approvals</p>
                  </div>
                ) : (
                  pendingHotels.slice(0, 5).map((hotel) => (
                    <div key={hotel.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded">
                            Hotel
                          </span>
                          <span className="font-medium">{hotel.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          By {hotel.email} • {formatTimeAgo(hotel.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => router.push('/superadmin/hotel-submissions')}
                          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => router.push('/superadmin/users')}
                  className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors"
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Manage Users
                </button>
                <button 
                  onClick={() => router.push('/superadmin/all-hotels')}
                  className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors"
                >
                  <Building2 className="w-4 h-4 inline mr-2" />
                  View Hotels
                </button>
                <button className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  View Tours
                </button>
                <button 
                  onClick={() => router.push('/superadmin/analytics')}
                  className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors"
                >
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity & Admin Users */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border-b last:border-0">
                    <Clock className="w-4 h-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Users */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Admin Users</h2>
              <div className="space-y-3">
                {adminUsers.map((admin, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        admin.status === "active" 
                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" 
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      }`}>
                        {admin.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{admin.lastActive}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
