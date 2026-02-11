"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash, Loader2, MapPin, DollarSign, Calendar, Clock } from "lucide-react"
import { toast } from "sonner"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TourDetails {
  id: string
  title: string
  slug: string | null
  shortDescription: string
  description: string
  durationDays: number
  durationNights: number
  city: string
  locations: string[]
  pricePerPerson: number
  includes: string[]
  excludes: string[]
  cardImages: string[]
  createdAt: string
  updatedAt: string
  tourStartDate?: string
  tourEndDate?: string
}

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [tour, setTour] = useState<TourDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
        const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
        const response = await fetch(`${normalizedBaseUrl}api/tours/${id}`)
        
        if (response.ok) {
          const data = await response.json()
          setTour(data)
        } else {
          toast.error("Failed to load tour details")
          router.push('/superadmin/tours')
        }
      } catch (error) {
        console.error("Error fetching tour:", error)
        toast.error("Error loading tour")
        router.push('/superadmin/tours')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTour()
    }
  }, [id, router])

  const handleDelete = async () => {
    if (!tour) return
    setIsDeleting(true)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const response = await fetch(`${normalizedBaseUrl}api/tours/${tour.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("Tour deleted successfully")
        router.push('/superadmin/tours')
      } else {
        toast.error("Failed to delete tour")
      }
    } catch (error) {
      console.error("Error deleting tour:", error)
      toast.error("An error occurred")
    } finally {
      setIsDeleting(false)
      setIsDeleteAlertOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <SuperAdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="flex min-h-screen bg-background">
        <SuperAdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Tour not found</p>
        </div>
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{tour.title}</h1>
              <p className="text-muted-foreground mt-1">Tour Details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push(`/superadmin/tours/${tour.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteAlertOpen(true)}>
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        <Separator />

        {/* Images Gallery */}
        {tour.cardImages && tour.cardImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tour Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tour.cardImages.map((img, idx) => {
                  const imageUrl = img.startsWith('http') ? img : `${normalizedBaseUrl}${img}`
                  return (
                    <div key={idx} className="aspect-video rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition">
                      <img 
                        src={imageUrl} 
                        alt={`${tour.title} - Image ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tour.shortDescription && (
                <div>
                  <span className="text-sm font-semibold text-primary">Short Description</span>
                  <p className="text-muted-foreground mt-1">{tour.shortDescription}</p>
                </div>
              )}
              
              <div>
                <span className="text-sm font-semibold text-primary">Full Description</span>
                <p className="text-muted-foreground mt-1 whitespace-pre-line">{tour.description}</p>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">City:</span> {tour.city}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-semibold">Price Per Person</span>
                  </div>
                  <p className="text-2xl font-bold">${tour.pricePerPerson}</p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-semibold">Duration</span>
                  </div>
                  <p className="text-lg font-bold">{tour.durationDays}D / {tour.durationNights}N</p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-semibold">Start Date</span>
                  </div>
                  <p className="text-lg font-bold">{tour.tourStartDate ? new Date(tour.tourStartDate).toLocaleDateString() : 'N/A'}</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-semibold">End Date</span>
                  </div>
                  <p className="text-lg font-bold">{tour.tourEndDate ? new Date(tour.tourEndDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-semibold text-primary block mb-2">Locations Covered</span>
                <div className="flex flex-wrap gap-2">
                  {tour.locations && tour.locations.length > 0 ? (
                    tour.locations.map((loc, idx) => (
                      <Badge key={idx} variant="outline">{loc}</Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">No locations specified</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Includes & Excludes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              {tour.includes && tour.includes.length > 0 ? (
                <ul className="space-y-2">
                  {tour.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No inclusions specified</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">What's Excluded</CardTitle>
            </CardHeader>
            <CardContent>
              {tour.excludes && tour.excludes.length > 0 ? (
                <ul className="space-y-2">
                  {tour.excludes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No exclusions specified</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold text-primary">Tour ID</span>
                <p className="text-muted-foreground font-mono text-xs mt-1">{tour.id}</p>
              </div>
              {tour.slug && (
                <div>
                  <span className="font-semibold text-primary">Slug</span>
                  <p className="text-muted-foreground mt-1">{tour.slug}</p>
                </div>
              )}
              <div>
                <span className="font-semibold text-primary">Created</span>
                <p className="text-muted-foreground mt-1">{new Date(tour.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-semibold text-primary">Last Updated</span>
                <p className="text-muted-foreground mt-1">{new Date(tour.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Alert */}
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the tour
                <span className="font-bold block mt-2">"{tour.title}"</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
