"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { ShieldCheck, TrendingUp, Users, Building2, MapPin, DollarSign, Calendar, Activity, ArrowUp, ArrowDown } from "lucide-react"

export default function AnalyticsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const superadminAuth = localStorage.getItem("superadminAuth")
    if (!superadminAuth) {
      router.push("/superadmin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Analytics Dashboard</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <select className="px-4 py-2 border rounded-lg hover:bg-accent">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">23%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold">$2.4M</h3>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">12%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold">12,458</h3>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">18%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold">8,942</h3>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <ArrowDown className="w-4 h-4" />
                  <span className="text-sm font-medium">5%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold">4.2%</h3>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 45, 78, 52, 88, 42, 95, 68, 75, 55, 82, 70].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Growth */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">User Growth</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {[50, 55, 60, 58, 65, 70, 68, 75, 80, 78, 85, 90].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Top Hotels */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Top Performing Hotels</h2>
              <div className="space-y-3">
                {[
                  { name: "Grand Plaza Hotel", bookings: 245, revenue: "$73,500" },
                  { name: "Beach Resort Paradise", bookings: 198, revenue: "$59,400" },
                  { name: "Mountain View Lodge", bookings: 167, revenue: "$50,100" },
                  { name: "Luxury Suites & Spa", bookings: 142, revenue: "$42,600" },
                ].map((hotel, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{hotel.name}</p>
                        <p className="text-xs text-muted-foreground">{hotel.bookings} bookings</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{hotel.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Tours */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Top Performing Tours</h2>
              <div className="space-y-3">
                {[
                  { name: "Mountain Adventure", bookings: 312, revenue: "$93,600" },
                  { name: "Cultural Heritage Tour", bookings: 278, revenue: "$83,400" },
                  { name: "Safari Experience", bookings: 234, revenue: "$70,200" },
                  { name: "Tropical Paradise", bookings: 189, revenue: "$56,700" },
                ].map((tour, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tour.name}</p>
                        <p className="text-xs text-muted-foreground">{tour.bookings} bookings</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{tour.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Sources */}
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Booking Sources</h2>
              <div className="space-y-4">
                {[
                  { source: "Direct Website", percentage: 45, color: "bg-primary" },
                  { source: "Mobile App", percentage: 30, color: "bg-blue-500" },
                  { source: "Partner Sites", percentage: 15, color: "bg-green-500" },
                  { source: "Social Media", percentage: 10, color: "bg-orange-500" },
                ].map((source, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{source.source}</span>
                      <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${source.color} rounded-full`}
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { action: "New booking", detail: "Mountain Adventure Package - $2,499", time: "2 min ago", icon: Activity },
                { action: "User registered", detail: "john.doe@example.com", time: "15 min ago", icon: Users },
                { action: "Hotel approved", detail: "Grand Plaza Hotel", time: "1 hour ago", icon: Building2 },
                { action: "Tour submission", detail: "Desert Safari Experience", time: "2 hours ago", icon: MapPin },
                { action: "Payment received", detail: "$5,400 from booking #12345", time: "3 hours ago", icon: DollarSign },
              ].map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start gap-3 p-3 border-b last:border-0">
                    <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
