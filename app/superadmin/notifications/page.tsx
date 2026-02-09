"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { ShieldCheck, Bell, Check, X, AlertCircle, Info, CheckCircle, XCircle, Clock } from "lucide-react"

export default function NotificationsPage() {
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

  const notifications = [
    { id: 1, type: "success", title: "Hotel Approved", message: "Grand Plaza Hotel has been approved and is now live", time: "5 min ago", read: false },
    { id: 2, type: "warning", title: "Pending Review", message: "3 new hotel submissions are waiting for review", time: "15 min ago", read: false },
    { id: 3, type: "info", title: "New User Registration", message: "50 new users registered in the last hour", time: "1 hour ago", read: false },
    { id: 4, type: "error", title: "Payment Failed", message: "Payment processing failed for booking #12345", time: "2 hours ago", read: true },
    { id: 5, type: "success", title: "Tour Approved", message: "Mountain Adventure Package has been approved", time: "3 hours ago", read: true },
    { id: 6, type: "warning", title: "Low Inventory", message: "Beach Resort Paradise has only 2 rooms available", time: "5 hours ago", read: true },
    { id: 7, type: "info", title: "System Update", message: "Scheduled maintenance on Jan 25, 2026 at 2:00 AM", time: "1 day ago", read: true },
    { id: 8, type: "success", title: "Guide Verified", message: "Alex Rodriguez profile has been verified", time: "2 days ago", read: true },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Notifications</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <button className="px-4 py-2 border rounded-lg hover:bg-accent">
                Mark All as Read
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <h3 className="text-2xl font-bold mt-1">248</h3>
                </div>
                <Bell className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <h3 className="text-2xl font-bold mt-1">23</h3>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <h3 className="text-2xl font-bold mt-1">12</h3>
                </div>
                <Clock className="w-10 h-10 text-blue-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Important</p>
                  <h3 className="text-2xl font-bold mt-1">5</h3>
                </div>
                <AlertCircle className="w-10 h-10 text-red-500/20" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                All
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-accent">
                Unread
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-accent">
                Success
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-accent">
                Warnings
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-accent">
                Errors
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-accent">
                Info
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => {
              const getIcon = () => {
                switch (notification.type) {
                  case "success":
                    return <CheckCircle className="w-5 h-5 text-green-500" />
                  case "error":
                    return <XCircle className="w-5 h-5 text-red-500" />
                  case "warning":
                    return <AlertCircle className="w-5 h-5 text-orange-500" />
                  case "info":
                    return <Info className="w-5 h-5 text-blue-500" />
                  default:
                    return <Bell className="w-5 h-5 text-gray-500" />
                }
              }

              const getBgColor = () => {
                if (!notification.read) return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
                return "bg-white dark:bg-gray-950"
              }

              return (
                <div
                  key={notification.id}
                  className={`${getBgColor()} rounded-lg border p-4 transition-colors hover:shadow-sm`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon()}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.time}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button className="flex items-center gap-1 px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90">
                            <Check className="w-3 h-3" />
                            Mark as Read
                          </button>
                        )}
                        <button className="flex items-center gap-1 px-3 py-1 text-xs border rounded hover:bg-accent">
                          View Details
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 text-xs border rounded hover:bg-accent text-red-600">
                          <X className="w-3 h-3" />
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button className="px-3 py-1 border rounded hover:bg-accent">Previous</button>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-accent">2</button>
            <button className="px-3 py-1 border rounded hover:bg-accent">3</button>
            <button className="px-3 py-1 border rounded hover:bg-accent">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
