"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  DollarSign, 
  Calendar,
  Loader2,
  Edit,
  Trash
} from "lucide-react"
import { toast } from "sonner"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TourGuideDetail {
  id: string
  name: string
  email: string
  phone: string
  city: string
  languages: string[]
  experienceYears: number
  pricePerDay: number
  description: string
  isActive: boolean
  images: string[]
  createdAt: string
  updatedAt: string
}

export default function TourGuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [guide, setGuide] = useState<TourGuideDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchGuide()
    }
  }, [id])

  const fetchGuide = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tour-guides/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setGuide(data)
      } else {
        toast.error("Failed to fetch tour guide details")
        router.push('/superadmin/tour-guides')
      }
    } catch (error) {
      console.error("Error fetching guide:", error)
      toast.error("Error loading tour guide details")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this guide?")) return

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tour-guides/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Tour guide deleted successfully")
        router.push('/superadmin/tour-guides')
      } else {
        toast.error("Failed to delete tour guide")
      }
    } catch (error) {
      console.error("Error deleting guide:", error)
      toast.error("Error deleting tour guide")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!guide) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Guides
            </Button>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{guide.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{guide.city || 'Location N/A'}</span>
                  <span className="mx-2">•</span>
                  <Badge variant="outline" className={guide.isActive ? "text-green-600 border-green-200 bg-green-50" : "text-gray-500"}>
                    {guide.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => router.push(`/superadmin/tour-guides/${id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              {guide.images && guide.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {guide.images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden border bg-muted">
                         <img src={img} alt={`${guide.name} ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                   ))}
                </div>
              )}

              {/* Bio */}
              <Card>
                 <CardHeader>
                    <CardTitle>About</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                       {guide.description || "No description provided."}
                    </p>
                 </CardContent>
              </Card>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Card>
                    <CardHeader className="pb-2">
                       <CardTitle className="text-base font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" /> Languages
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="flex flex-wrap gap-2">
                          {guide.languages && guide.languages.length > 0 ? (
                             guide.languages.map((lang, i) => (
                                <Badge key={i} variant="secondary">{lang}</Badge>
                             ))
                          ) : (
                             <span className="text-muted-foreground text-sm">Not specified</span>
                          )}
                       </div>
                    </CardContent>
                 </Card>

                 <Card>
                    <CardHeader className="pb-2">
                       <CardTitle className="text-base font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" /> Experience
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <span className="text-2xl font-bold">{guide.experienceYears || 0}</span>
                       <span className="text-muted-foreground ml-2">Years</span>
                    </CardContent>
                 </Card>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <Mail className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-xs text-muted-foreground">Email</p>
                       <p className="text-sm font-medium truncate" title={guide.email}>{guide.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <Phone className="h-4 w-4" />
                    </div>
                    <div>
                       <p className="text-xs text-muted-foreground">Phone</p>
                       <p className="text-sm font-medium">{guide.phone || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                 <CardContent>
                    <div className="flex items-end gap-1">
                       <span className="text-3xl font-bold text-primary">${guide.pricePerDay}</span>
                       <span className="text-muted-foreground mb-1">/ day</span>
                    </div>
                 </CardContent>
              </Card>

              <div className="text-xs text-center text-muted-foreground">
                 Profile Created: {new Date(guide.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
