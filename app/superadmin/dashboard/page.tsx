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
  Clock,
  Compass,
  Car,
  CalendarCheck
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'

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

interface SummaryStats {
  totalHotels: number;
  totalTours: number;
  totalGuides: number;
  totalCars: number;
}

interface MonthlyBreakdown {
  month: string;
  hotelRevenue: number;
  hotelBookings: number;
  tourRevenue: number;
  tourBookings: number;
  guideRevenue: number;
  guideBookings: number;
  carRevenue: number;
  carBookings: number;
  totalRevenue: number;
}

interface SummaryResponse {
  stats: SummaryStats;
  monthlyBreakdown: MonthlyBreakdown[];
}

export default function SuperAdminDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
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
      
      fetchAllData()
    }
  }, [router])

  const fetchAllData = async () => {
    setIsLoading(true)
    await Promise.all([
      fetchHotels(),
      fetchSummary()
    ])
    setIsLoading(false)
  }

  const fetchSummary = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/summary`)
      if (response.ok) {
        const data = await response.json()
        setSummary(data)
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error)
    }
  }

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
    }
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">{isLoading ? 'Loading dashboard...' : 'Checking authentication...'}</p>
        </div>
      </div>
    )
  }

  // Calculate stats from fetched data
  const totalUsers = hotels.length // Hotels are tied to users
  const approvedHotels = hotels.filter(h => h.status === 'approved')
  const pendingHotels = hotels.filter(h => h.status === 'pending')

  const totalRevenue = summary?.monthlyBreakdown.reduce((sum, m) => sum + m.totalRevenue, 0) || 0
  const totalHotelRevenue = summary?.monthlyBreakdown.reduce((sum, m) => sum + m.hotelRevenue, 0) || 0
  const totalTourRevenue = summary?.monthlyBreakdown.reduce((sum, m) => sum + m.tourRevenue, 0) || 0
  const totalGuideRevenue = summary?.monthlyBreakdown.reduce((sum, m) => sum + m.guideRevenue, 0) || 0
  const totalCarRevenue = summary?.monthlyBreakdown.reduce((sum, m) => sum + m.carRevenue, 0) || 0

  const statsCards = [
    { 
      label: "Hotels", 
      count: summary?.stats.totalHotels || 0, 
      revenue: totalHotelRevenue, 
      icon: Building2, 
      color: "bg-teal-500/10 text-teal-600" 
    },
    { 
      label: "Tours", 
      count: summary?.stats.totalTours || 0, 
      revenue: totalTourRevenue, 
      icon: Compass, 
      color: "bg-blue-500/10 text-blue-600" 
    },
    { 
      label: "Guides", 
      count: summary?.stats.totalGuides || 0, 
      revenue: totalGuideRevenue, 
      icon: Users, 
      color: "bg-purple-500/10 text-purple-600" 
    },
    { 
      label: "Cars", 
      count: summary?.stats.totalCars || 0, 
      revenue: totalCarRevenue, 
      icon: Car, 
      color: "bg-orange-500/10 text-orange-600" 
    },
  ]

  const COLORS = ['#0f766e', '#3b82f6', '#a855f7', '#f97316'];
  
  const pieData = [
    { name: 'Hotels', value: summary?.stats.totalHotels || 0 },
    { name: 'Tours', value: summary?.stats.totalTours || 0 },
    { name: 'Guides', value: summary?.stats.totalGuides || 0 },
    { name: 'Cars', value: summary?.stats.totalCars || 0 },
  ]

  const revenueData = summary?.monthlyBreakdown.map(m => ({
    month: m.month,
    revenue: m.totalRevenue,
    hotels: m.hotelRevenue,
    tours: m.tourRevenue,
    guides: m.guideRevenue,
    cars: m.carRevenue
  })) || []

  const bookingData = summary?.monthlyBreakdown.map(m => ({
    month: m.month,
    hotels: m.hotelBookings,
    tours: m.tourBookings,
    guides: m.guideBookings,
    cars: m.carBookings
  })) || []

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="border-b-2 border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center px-6 justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
                <p className="text-xs text-gray-600">Logged in as {userName}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-700">{userName}</p>
                <p className="text-xs text-emerald-600">SuperAdmin</p>
              </div>
              <button 
                onClick={() => {
                  localStorage.clear()
                  router.push("/superadmin/login")
                }}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-gray-200 hover:border-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Main Revenue Card */}
          <div className="bg-emerald-600 rounded-xl p-8 mb-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider">Total Platform Revenue</span>
            </div>
            <h2 className="text-5xl font-bold mb-6">
              ${totalRevenue.toLocaleString()}
            </h2>
            <div className="flex items-center gap-8 mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-emerald-300" />
                <span className="font-medium">Platform Active</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-700 px-4 py-2 rounded-lg">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">+12% Growth</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <h3 className="text-3xl font-bold text-gray-900">{stat.count}</h3>
                    <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider mt-1 block">{stat.label}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">Revenue</span>
                    <span className="font-bold text-emerald-600 text-base">${stat.revenue.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Revenue and Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Revenue Trends</h2>
                  <p className="text-sm text-muted-foreground">Monthly growth across all sectors</p>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="hotels" name="Hotels" fill="#0f766e" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="tours" name="Tours" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="guides" name="Guides" fill="#a855f7" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="cars" name="Cars" fill="#f97316" radius={[4, 4, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribution Pie Chart */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-6">Business Distribution</h2>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{summary?.stats.totalHotels! + summary?.stats.totalTours! + summary?.stats.totalGuides! + summary?.stats.totalCars!}</p>
                    <p className="text-xs text-muted-foreground">Entries</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bookings Trend */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Bookings Breakdown</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="month" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hotels" name="Hotels" fill="#0f766e" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="tours" name="Tours" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="guides" name="Guides" fill="#a855f7" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="cars" name="Cars" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
