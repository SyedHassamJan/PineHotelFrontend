"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, Search, Edit, Trash, MapPin, DollarSign, Calendar, Eye, Loader2, ArrowLeft, ArrowRight, X } from "lucide-react"
import { toast } from "sonner"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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

interface Tour {
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
  status: string // 'DRAFT' | 'PUBLISHED'
  createdAt: string
  updatedAt: string
}

function ToursContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    pricePerPerson: "",
    locations: "",
    description: "",
    duration: "",
    cardImages: [] as File[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTours = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      if (searchTerm) params.append('search', searchTerm) // Assuming backend supports search

      const response = await fetch(`${normalizedBaseUrl}api/tours?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setTours(Array.isArray(data) ? data : (data.data || []))
      } else {
        toast.error("Failed to fetch tours")
      }
    } catch (error) {
      console.error("Error fetching tours:", error)
      toast.error("Error loading tours")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
  }, [page, searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, cardImages: Array.from(e.target.files || []) }))
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      pricePerPerson: "",
      locations: "",
      description: "",
      duration: "",
      cardImages: []
    })
    setSelectedTour(null)
  }

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const data = new FormData()
      data.append('title', formData.title)
      data.append('pricePerPerson', formData.pricePerPerson)
      data.append('description', formData.description)
      // data.append('duration', formData.duration) // Add if backend supports
      
      // Handle locations
      const locationsArray = formData.locations.split(',').map(l => l.trim()).filter(l => l)
      if (locationsArray.length > 0) {
          data.append('locations', locationsArray.join(','))
      }

      formData.cardImages.forEach(file => {
        data.append('cardImages', file)
      })

      const response = await fetch(`${normalizedBaseUrl}api/tours`, {
        method: 'POST',
        body: data
      })

      if (response.ok) {
        toast.success("Tour created successfully")
        setIsAddModalOpen(false)
        resetForm()
        fetchTours()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to create tour")
      }
    } catch (error) {
      console.error("Error creating tour:", error)
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTour = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTour) return
    setIsSubmitting(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const data = new FormData()
      if (formData.title !== selectedTour.title) data.append('title', formData.title)
      if (Number(formData.pricePerPerson) !== selectedTour.pricePerPerson) data.append('pricePerPerson', formData.pricePerPerson)
      if (formData.description !== selectedTour.description) data.append('description', formData.description)
      
      // Locations logic
      const locationsArray = formData.locations.split(',').map(l => l.trim()).filter(l => l)
      const originalLocations = selectedTour.locations || []
      // Simple check if changed (naïve) - better to just send if touched. For now sending always if not empty
      if (formData.locations) {
          // Backend note: "Append Arrays if tourData.locations"
           // If backend expects 'locations' as comma separated string or array?
           // The prompt said: `if (tourData.locations) formData.append('locations', tourData.locations.join(','));`
           data.append('locations', locationsArray.join(','))
      }

      if (formData.cardImages.length > 0) {
        formData.cardImages.forEach(file => {
          data.append('cardImages', file)
        })
      }

      const response = await fetch(`${normalizedBaseUrl}api/tours/${selectedTour.id}`, {
        method: 'PATCH',
        body: data
      })

      if (response.ok) {
        toast.success("Tour updated successfully")
        setIsEditModalOpen(false)
        resetForm()
        fetchTours()
      } else {
        toast.error("Failed to update tour")
      }
    } catch (error) {
      console.error("Error updating tour:", error)
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTour = async () => {
    if (!selectedTour) return
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const response = await fetch(`${normalizedBaseUrl}api/tours/${selectedTour.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("Tour deleted successfully")
        setIsDeleteAlertOpen(false)
        setSelectedTour(null)
        fetchTours()
      } else {
        toast.error("Failed to delete tour")
      }
    } catch (error) {
       console.error("Error deleting tour:", error)
       toast.error("An error occurred")
    }
  }

  const openEditModal = (tour: Tour) => {
    setSelectedTour(tour)
    setFormData({
      title: tour.title,
      pricePerPerson: tour.pricePerPerson.toString(),
      locations: tour.locations ? tour.locations.join(', ') : "",
      description: tour.description || "",
      duration: tour.duration || "",
      cardImages: []
    })
    setIsEditModalOpen(true)
  }

  const openDeleteAlert = (tour: Tour) => {
    setSelectedTour(tour)
    setIsDeleteAlertOpen(true)
  }
  
  const openViewModal = (tour: Tour) => {
     setSelectedTour(tour)
     setIsViewModalOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tours Management</h1>
            <p className="text-muted-foreground mt-2">Create, edit, and manage travel tours.</p>
          </div>
          <Button onClick={() => router.push("/superadmin/tours/new")} className="gap-2">
            <Plus className="h-4 w-4" /> Add New Tour
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tours..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tours Grid/List */}
        {loading ? (
           <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : tours.length === 0 ? (
           <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No tours found. Create your first tour!</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden group h-full flex flex-col">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {tour.cardImages && tour.cardImages.length > 0 ? (
                    <img
                      src={(() => {
                        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
                        const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
                        return tour.cardImages[0].startsWith('http') ? tour.cardImages[0] : `${normalizedBaseUrl}${tour.cardImages[0]}`
                      })()}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {tour.status === 'PUBLISHED' && (
                     <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">Published</Badge>
                  )}
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start gap-2">
                     <CardTitle className="text-lg line-clamp-1" title={tour.title}>{tour.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">{tour.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow text-sm space-y-2">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span className="truncate">{tour.locations ? tour.locations.join(', ') : 'No location'}</span>
                  </div>
                  <div className="flex items-center font-medium">
                    <DollarSign className="h-4 w-4 mr-2 text-primary" />
                    ${tour.pricePerPerson} / person
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 gap-2 border-t bg-muted/10 mt-auto p-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/superadmin/tours/${tour.id}`)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/superadmin/tours/${tour.id}/edit`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteAlert(tour)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        {/* View Tour Modal - Read Only */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
           <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                 <DialogTitle className="text-2xl">{selectedTour?.title}</DialogTitle>
                 {selectedTour?.status && (
                    <Badge className={selectedTour.status === 'PUBLISHED' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}>
                       {selectedTour.status}
                    </Badge>
                 )}
              </DialogHeader>
              <div className="space-y-6">
                 {/* Images */}
                 {selectedTour?.cardImages && selectedTour.cardImages.length > 0 && (
                    <div>
                       <h3 className="font-semibold text-primary mb-3">Tour Images</h3>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedTour.cardImages.map((img, idx) => {
                             const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
                             const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
                             const imageUrl = img.startsWith('http') ? img : `${normalizedBaseUrl}${img}`
                             return (
                                <img 
                                   key={idx} 
                                   src={imageUrl} 
                                   alt={`${selectedTour.title} - Image ${idx + 1}`} 
                                   className="rounded-lg w-full h-40 object-cover border shadow-sm hover:shadow-md transition"
                                />
                             )
                          })}
                       </div>
                    </div>
                 )}
                 
                 {/* Short Description */}
                 {selectedTour?.shortDescription && (
                    <div>
                       <span className="font-semibold block text-primary mb-1">Short Description</span>
                       <p className="text-muted-foreground">{selectedTour.shortDescription}</p>
                    </div>
                 )}

                 {/* Full Description */}
                 <div>
                    <span className="font-semibold block text-primary mb-1">Full Description</span>
                    <p className="text-muted-foreground whitespace-pre-line">{selectedTour?.description}</p>
                 </div>

                 {/* Pricing & Duration */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-muted/50 p-3 rounded-lg">
                       <span className="font-semibold block text-primary mb-1">Price Per Person</span>
                       <span className="text-xl font-bold">${selectedTour?.pricePerPerson}</span>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                       <span className="font-semibold block text-primary mb-1">Duration (Days)</span>
                       <span className="text-xl font-bold">{selectedTour?.durationDays || 'N/A'}</span>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                       <span className="font-semibold block text-primary mb-1">Duration (Nights)</span>
                       <span className="text-xl font-bold">{selectedTour?.durationNights || 'N/A'}</span>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                       <span className="font-semibold block text-primary mb-1">City</span>
                       <span className="text-lg font-semibold">{selectedTour?.city || 'N/A'}</span>
                    </div>
                 </div>

                 {/* Locations */}
                 {selectedTour?.locations && selectedTour.locations.length > 0 && (
                    <div>
                       <span className="font-semibold block text-primary mb-2">Locations Covered</span>
                       <div className="flex flex-wrap gap-2">
                          {selectedTour.locations.map((loc, idx) => (
                             <Badge key={idx} variant="outline" className="text-sm">{loc}</Badge>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* Includes */}
                 {selectedTour?.includes && selectedTour.includes.length > 0 && (
                    <div>
                       <span className="font-semibold block text-primary mb-2">What's Included</span>
                       <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {selectedTour.includes.map((item, idx) => (
                             <li key={idx}>{item}</li>
                          ))}
                       </ul>
                    </div>
                 )}

                 {/* Excludes */}
                 {selectedTour?.excludes && selectedTour.excludes.length > 0 && (
                    <div>
                       <span className="font-semibold block text-primary mb-2">What's Excluded</span>
                       <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {selectedTour.excludes.map((item, idx) => (
                             <li key={idx}>{item}</li>
                          ))}
                       </ul>
                    </div>
                 )}

                 {/* Metadata */}
                 <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground border-t pt-4">
                    <div>
                       <span className="font-semibold">Created:</span> {selectedTour?.createdAt ? new Date(selectedTour.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div>
                       <span className="font-semibold">Updated:</span> {selectedTour?.updatedAt ? new Date(selectedTour.updatedAt).toLocaleDateString() : 'N/A'}
                    </div>
                 </div>
              </div>
              <DialogFooter>
                 <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>

        {/* Delete Alert */}
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the tour
                Current tour: <span className="font-bold">{selectedTour?.title}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTour} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  )
}

export default function SuperAdminToursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
       <ToursContent />
    </Suspense>
  )
}
