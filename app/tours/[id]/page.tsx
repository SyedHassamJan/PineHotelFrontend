"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Users, Check, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TourData {
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
  status: string
  createdAt: string
  updatedAt: string
}

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [tour, setTour] = useState<TourData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [bookingData, setBookingData] = useState({
    startDate: "",
    peopleCount: "",
    userName: "",
    userEmail: "",
    userPhone: "",
    notes: ""
  })

  useEffect(() => {
    if (id) {
      fetchTour()
    }
  }, [id])

  const fetchTour = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tours/${id}`)
      
      if (response.ok) {
        const data: TourData = await response.json()
        setTour(data)
      } else {
        router.push('/tours')
      }
    } catch (error) {
      console.error("Error fetching tour:", error)
      router.push('/tours')
    } finally {
      setLoading(false)
    }
  }

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBookingData(prev => ({ ...prev, [name]: value }))
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const payload = {
        tourId: id,
        startDate: bookingData.startDate,
        peopleCount: parseInt(bookingData.peopleCount),
        userName: bookingData.userName,
        userEmail: bookingData.userEmail,
        userPhone: bookingData.userPhone,
        notes: bookingData.notes
      }

      const response = await fetch(`${normalizedBaseUrl}api/tour-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success("Booking request submitted successfully!")
        setIsBookingModalOpen(false)
        setBookingData({
          startDate: "",
          peopleCount: "",
          userName: "",
          userEmail: "",
          userPhone: "",
          notes: ""
        })
      } else {
        try {
          const errorData = await response.json()
          toast.error(errorData.message || errorData.error || "Failed to submit booking")
        } catch (parseError) {
          toast.error("Failed to submit booking. Please try again.")
        }
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast.error("An error occurred while submitting your booking")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!tour) {
    return null
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{tour.title}</h1>
              {tour.shortDescription && (
                <p className="text-lg text-muted-foreground">{tour.shortDescription}</p>
              )}
            </div>
            <Badge variant={tour.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {tour.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            {tour.cardImages && tour.cardImages.length > 0 && (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={tour.cardImages[selectedImage]?.startsWith('http') 
                      ? tour.cardImages[selectedImage] 
                      : `${normalizedBaseUrl}${tour.cardImages[selectedImage]}`}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {tour.cardImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {tour.cardImages.map((img, index) => {
                      const imageUrl = img.startsWith('http') ? img : `${normalizedBaseUrl}${img}`
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-video rounded-lg overflow-hidden border-2 transition ${
                            selectedImage === index ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
                          }`}
                        >
                          <img src={imageUrl} alt={`${tour.title} ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{tour.description}</p>
            </div>

            {/* Locations */}
            {tour.locations && tour.locations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Locations Covered</h2>
                <div className="flex flex-wrap gap-2">
                  {tour.locations.map((location, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1.5 px-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Includes & Excludes */}
            <div className="grid md:grid-cols-2 gap-6">
              {tour.includes && tour.includes.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-500">What's Included</h3>
                  <ul className="space-y-2">
                    {tour.includes.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.excludes && tour.excludes.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-500">What's Not Included</h3>
                  <ul className="space-y-2">
                    {tour.excludes.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 border rounded-lg p-6 bg-card space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Price per person</div>
                <div className="text-4xl font-bold text-primary">${tour.pricePerPerson}</div>
              </div>

              <Separator />

              <div className="space-y-4">
                {tour.durationDays > 0 && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-sm text-muted-foreground">
                        {tour.durationDays} Days / {tour.durationNights} Nights
                      </div>
                    </div>
                  </div>
                )}

                {tour.city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Main City</div>
                      <div className="text-sm text-muted-foreground">{tour.city}</div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <Button className="w-full" size="lg" onClick={() => setIsBookingModalOpen(true)}>
                Book Now
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Contact us for group bookings and custom packages
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book This Tour</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={bookingData.startDate}
                onChange={handleBookingInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="peopleCount">Number of People <span className="text-red-500">*</span></Label>
              <Input
                id="peopleCount"
                name="peopleCount"
                type="number"
                min="1"
                value={bookingData.peopleCount}
                onChange={handleBookingInputChange}
                required
                placeholder="e.g. 4"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userName">Your Name <span className="text-red-500">*</span></Label>
              <Input
                id="userName"
                name="userName"
                value={bookingData.userName}
                onChange={handleBookingInputChange}
                required
                placeholder="Ali Khan"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userEmail">Email <span className="text-red-500">*</span></Label>
              <Input
                id="userEmail"
                name="userEmail"
                type="email"
                value={bookingData.userEmail}
                onChange={handleBookingInputChange}
                required
                placeholder="ali@email.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userPhone">Phone Number <span className="text-red-500">*</span></Label>
              <Input
                id="userPhone"
                name="userPhone"
                type="tel"
                value={bookingData.userPhone}
                onChange={handleBookingInputChange}
                required
                placeholder="+923001234567"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={bookingData.notes}
                onChange={handleBookingInputChange}
                rows={3}
                placeholder="Pickup from airport, special requests, etc."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Booking
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
