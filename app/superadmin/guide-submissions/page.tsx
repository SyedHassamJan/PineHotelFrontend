"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { ShieldCheck, UserCheck, Search, CheckCircle, XCircle, Clock, Eye, MapPin, Languages, Award, Star } from "lucide-react"

export default function GuideSubmissionsPage() {
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

  const submissions = [
    { id: 1, name: "Alex Rodriguez", email: "alex@guides.com", specialization: "Mountain Trekking", location: "Colorado, USA", experience: "8 years", languages: "English, Spanish", rating: 4.9, submitted: "1 day ago", status: "pending" },
    { id: 2, name: "Maria Santos", email: "maria@tours.com", specialization: "Cultural Tours", location: "Barcelona, Spain", experience: "5 years", languages: "Spanish, English, French", rating: 4.7, submitted: "2 days ago", status: "pending" },
    { id: 3, name: "James Chen", email: "james@adventures.com", specialization: "Wildlife Safari", location: "Kenya", experience: "12 years", languages: "English, Swahili", rating: 5.0, submitted: "3 days ago", status: "approved" },
    { id: 4, name: "Sophie Laurent", email: "sophie@guides.com", specialization: "City Tours", location: "Paris, France", experience: "3 years", languages: "French, English", rating: 4.5, submitted: "4 days ago", status: "rejected" },
    { id: 5, name: "Mohammed Ali", email: "mohammed@desert.com", specialization: "Desert Expeditions", location: "Dubai, UAE", experience: "10 years", languages: "Arabic, English", rating: 4.8, submitted: "5 days ago", status: "pending" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Guide Submissions</h1>
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
                  <p className="text-sm text-muted-foreground">Total Submissions</p>
                  <h3 className="text-2xl font-bold mt-1">892</h3>
                </div>
                <UserCheck className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <h3 className="text-2xl font-bold mt-1">23</h3>
                </div>
                <Clock className="w-10 h-10 text-orange-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <h3 className="text-2xl font-bold mt-1">845</h3>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500/20" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <h3 className="text-2xl font-bold mt-1">24</h3>
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
                  <input
                    type="text"
                    placeholder="Search guides..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <select className="px-4 py-2 border rounded-lg hover:bg-accent">
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
              <select className="px-4 py-2 border rounded-lg hover:bg-accent">
                <option>All Specializations</option>
                <option>Mountain Trekking</option>
                <option>Cultural Tours</option>
                <option>Wildlife Safari</option>
                <option>City Tours</option>
              </select>
            </div>
          </div>

          {/* Submissions Grid */}
          <div className="grid grid-cols-1 gap-6">
            {submissions.map((guide) => (
              <div key={guide.id} className="bg-white dark:bg-gray-950 rounded-lg border p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Guide Photo Placeholder */}
                  <div className="w-full md:w-48 h-48 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-16 h-16 text-muted-foreground" />
                  </div>

                  {/* Guide Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{guide.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            <span>{guide.specialization}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{guide.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Languages className="w-4 h-4" />
                            <span>{guide.languages}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.floor(guide.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{guide.rating}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        guide.status === "pending" ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400" :
                        guide.status === "approved" ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                        "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      }`}>
                        {guide.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{guide.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Experience</p>
                        <p className="text-sm font-medium">{guide.experience}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                        <p className="text-sm font-medium">{guide.submitted}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Submission ID</p>
                        <p className="text-sm font-medium">#{guide.id}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      {guide.status === "pending" && (
                        <>
                          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
