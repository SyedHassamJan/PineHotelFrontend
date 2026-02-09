"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { ShieldCheck, FileText, Download, Eye, Filter, Calendar, Users, Building2, MapPin } from "lucide-react"

export default function ReportsPage() {
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

  const reports = [
    { id: 1, name: "Monthly Revenue Report", type: "Financial", period: "January 2026", generated: "Jan 20, 2026", size: "2.4 MB", format: "PDF" },
    { id: 2, name: "User Activity Report", type: "Analytics", period: "Last 30 Days", generated: "Jan 19, 2026", size: "1.8 MB", format: "Excel" },
    { id: 3, name: "Hotel Performance Report", type: "Business", period: "Q4 2025", generated: "Jan 15, 2026", size: "3.2 MB", format: "PDF" },
    { id: 4, name: "Tour Bookings Summary", type: "Business", period: "December 2025", generated: "Jan 10, 2026", size: "1.5 MB", format: "Excel" },
    { id: 5, name: "Customer Feedback Report", type: "Analytics", period: "Last Quarter", generated: "Jan 5, 2026", size: "2.1 MB", format: "PDF" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Reports</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Generate New Report
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <h3 className="text-2xl font-bold mt-1">248</h3>
                </div>
                <FileText className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <h3 className="text-2xl font-bold mt-1">42</h3>
                </div>
                <Calendar className="w-10 h-10 text-blue-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Financial</p>
                  <h3 className="text-2xl font-bold mt-1">89</h3>
                </div>
                <FileText className="w-10 h-10 text-green-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Analytics</p>
                  <h3 className="text-2xl font-bold mt-1">159</h3>
                </div>
                <FileText className="w-10 h-10 text-orange-500/20" />
              </div>
            </div>
          </div>

          {/* Report Templates */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Generate Custom Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">User Report</p>
                <p className="text-xs text-muted-foreground mt-1">Activity & statistics</p>
              </button>
              <button className="p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Hotel Report</p>
                <p className="text-xs text-muted-foreground mt-1">Performance & bookings</p>
              </button>
              <button className="p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Tour Report</p>
                <p className="text-xs text-muted-foreground mt-1">Bookings & revenue</p>
              </button>
              <button className="p-6 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Custom Report</p>
                <p className="text-xs text-muted-foreground mt-1">Build your own</p>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border rounded-lg hover:bg-accent">
                <option>All Types</option>
                <option>Financial</option>
                <option>Analytics</option>
                <option>Business</option>
              </select>
              <select className="px-4 py-2 border rounded-lg hover:bg-accent">
                <option>All Formats</option>
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
              <select className="px-4 py-2 border rounded-lg hover:bg-accent">
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white dark:bg-gray-950 rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Report Name</th>
                    <th className="text-left p-4 font-semibold">Type</th>
                    <th className="text-left p-4 font-semibold">Period</th>
                    <th className="text-left p-4 font-semibold">Generated</th>
                    <th className="text-left p-4 font-semibold">Size</th>
                    <th className="text-left p-4 font-semibold">Format</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="font-medium">{report.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                          {report.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{report.period}</td>
                      <td className="p-4 text-sm text-muted-foreground">{report.generated}</td>
                      <td className="p-4 text-sm">{report.size}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          report.format === "PDF" 
                            ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                            : "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        }`}>
                          {report.format}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-accent rounded-lg" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-accent rounded-lg" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">Showing 1 to 5 of 248 reports</p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded hover:bg-accent">Previous</button>
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded">1</button>
                <button className="px-3 py-1 border rounded hover:bg-accent">2</button>
                <button className="px-3 py-1 border rounded hover:bg-accent">3</button>
                <button className="px-3 py-1 border rounded hover:bg-accent">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
