"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { ShieldCheck, Database, RefreshCw, Download, Upload, Trash2, HardDrive, Activity } from "lucide-react"

export default function DatabasePage() {
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

  const tables = [
    { name: "users", records: 12458, size: "24.5 MB", lastUpdated: "2 min ago", status: "healthy" },
    { name: "hotels", records: 3421, size: "18.2 MB", lastUpdated: "5 min ago", status: "healthy" },
    { name: "tours", records: 5678, size: "32.1 MB", lastUpdated: "10 min ago", status: "healthy" },
    { name: "bookings", records: 8942, size: "45.8 MB", lastUpdated: "15 min ago", status: "healthy" },
    { name: "reviews", records: 15234, size: "12.4 MB", lastUpdated: "20 min ago", status: "healthy" },
    { name: "guides", records: 892, size: "5.2 MB", lastUpdated: "30 min ago", status: "healthy" },
  ]

  const backups = [
    { id: 1, name: "Daily Backup - Jan 21, 2026", size: "245 MB", created: "Today at 2:00 AM", status: "completed" },
    { id: 2, name: "Daily Backup - Jan 20, 2026", size: "243 MB", created: "Yesterday at 2:00 AM", status: "completed" },
    { id: 3, name: "Weekly Backup - Jan 18, 2026", size: "238 MB", created: "3 days ago", status: "completed" },
    { id: 4, name: "Daily Backup - Jan 19, 2026", size: "241 MB", created: "2 days ago", status: "completed" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Database Management</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <button className="px-4 py-2 border rounded-lg hover:bg-accent">
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Database Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                  <h3 className="text-2xl font-bold mt-1">245 MB</h3>
                </div>
                <HardDrive className="w-10 h-10 text-primary/20" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">12% of 2GB limit</p>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tables</p>
                  <h3 className="text-2xl font-bold mt-1">24</h3>
                </div>
                <Database className="w-10 h-10 text-blue-500/20" />
              </div>
              <p className="text-xs text-green-600 mt-2">All healthy</p>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <h3 className="text-2xl font-bold mt-1">46,625</h3>
                </div>
                <Activity className="w-10 h-10 text-green-500/20" />
              </div>
              <p className="text-xs text-green-600 mt-2">+234 today</p>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Backup</p>
                  <h3 className="text-2xl font-bold mt-1">2:00 AM</h3>
                </div>
                <Download className="w-10 h-10 text-orange-500/20" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Today</p>
            </div>
          </div>

          {/* Database Actions */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Database Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                <Download className="w-8 h-8 text-primary mb-2" />
                <p className="font-medium">Backup Database</p>
                <p className="text-xs text-muted-foreground mt-1">Create a full backup</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                <Upload className="w-8 h-8 text-blue-500 mb-2" />
                <p className="font-medium">Restore Backup</p>
                <p className="text-xs text-muted-foreground mt-1">Restore from backup</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                <RefreshCw className="w-8 h-8 text-green-500 mb-2" />
                <p className="font-medium">Optimize Tables</p>
                <p className="text-xs text-muted-foreground mt-1">Improve performance</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                <Trash2 className="w-8 h-8 text-red-500 mb-2" />
                <p className="font-medium">Clean Up</p>
                <p className="text-xs text-muted-foreground mt-1">Remove old data</p>
              </button>
            </div>
          </div>

          {/* Database Tables */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Database Tables</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Table Name</th>
                    <th className="text-left p-4 font-semibold">Records</th>
                    <th className="text-left p-4 font-semibold">Size</th>
                    <th className="text-left p-4 font-semibold">Last Updated</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-primary" />
                          <span className="font-mono font-medium">{table.name}</span>
                        </div>
                      </td>
                      <td className="p-4">{table.records.toLocaleString()}</td>
                      <td className="p-4">{table.size}</td>
                      <td className="p-4 text-sm text-muted-foreground">{table.lastUpdated}</td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                          {table.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-accent rounded-lg" title="Optimize">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-accent rounded-lg" title="Export">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Backup History */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Backup History</h2>
            <div className="space-y-3">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">{backup.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {backup.size} • Created {backup.created}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                      {backup.status}
                    </span>
                    <button className="p-2 hover:bg-accent rounded-lg" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg" title="Restore">
                      <Upload className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg text-red-600" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
