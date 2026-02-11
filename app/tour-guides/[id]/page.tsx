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
  Loader2,
  Calendar,
  CheckCircle2
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GuideBookingModal } from "@/components/guide-booking-modal"

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

export default function PublicTourGuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
        router.push('/tour-guides')
      }
    } catch (error) {
      console.error("Error fetching guide:", error)
      toast.error("Error loading tour guide details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-[#006951]" />
      </div>
    )
  }

  if (!guide) {
    return null
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="bg-[#006951] text-white pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10 mb-8 pl-0">
             <ArrowLeft className="h-4 w-4 mr-2" />
             Back to Guides
           </Button>
           <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
              <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-muted shrink-0">
                 <img 
                    src={guide.images && guide.images.length > 0 
                      ? (guide.images[0].startsWith('http') ? guide.images[0] : `${normalizedBaseUrl}${guide.images[0]}`)
                      : '/placeholder.svg'} 
                    alt={guide.name}
                    className="w-full h-full object-cover"
                 />
              </div>
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3">
                    <h1 className="text-4xl md:text-5xl font-extrabold">{guide.name}</h1>
                    <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-3 py-1">
                       Professional Guide
                    </Badge>
                 </div>
                 <div className="flex flex-wrap items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                       <MapPin className="h-5 w-5 opacity-70" />
                       <span className="font-medium text-lg">{guide.city || 'Global'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock className="h-5 w-5 opacity-70" />
                       <span className="font-medium text-lg">{guide.experienceYears || 0} Years Experience</span>
                    </div>
                 </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-w-[240px]">
                 <div className="text-sm opacity-80 mb-1 font-medium">Daily Rate Starts From</div>
                 <div className="text-4xl font-extrabold flex items-baseline gap-1">
                    ${guide.pricePerDay}
                    <span className="text-base font-normal opacity-70">/day</span>
                 </div>
                 <GuideBookingModal 
                    guideId={guide.id} 
                    guideName={guide.name}
                    trigger={
                      <Button className="w-full bg-white text-[#006951] hover:bg-white/90 mt-4 h-12 text-lg font-bold shadow-lg">
                         Book Now
                      </Button>
                    }
                 />
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-xl border-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">About Me</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                  {guide.description || "No biography provided. This guide is an expert in their field and ready to show you the best of their city."}
                </p>
                
                <Separator />
                
                <div>
                   <h4 className="font-bold text-lg mb-4">Languages Spoken</h4>
                   <div className="flex flex-wrap gap-3">
                      {guide.languages && guide.languages.length > 0 ? (
                        guide.languages.map((lang, idx) => (
                           <div key={idx} className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full font-medium">
                              <Globe className="h-4 w-4 text-[#006951]" />
                              {lang}
                           </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic">No languages specified</span>
                      )}
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            {guide.images && guide.images.length > 0 && (
               <Card className="shadow-xl border-none">
                  <CardHeader>
                     <CardTitle className="text-2xl font-bold">Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {guide.images.map((img, idx) => (
                           <div key={idx} className="aspect-square rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer border">
                              <img 
                                 src={img.startsWith('http') ? img : `${normalizedBaseUrl}${img}`} 
                                 alt={`${guide.name} photo ${idx + 1}`} 
                                 className="w-full h-full object-cover" 
                              />
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="shadow-xl border-none sticky top-8">
               <CardHeader>
                  <CardTitle className="text-xl font-bold">Trip Highlights</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-4">
                     {[
                        "Customized Itineraries",
                        "Local Food Tours",
                        "Cultural Photography",
                        "Hidden Gems Discovery"
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="h-6 w-6 rounded-full bg-[#006951]/10 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-4 w-4 text-[#006951]" />
                           </div>
                           <span className="font-medium">{item}</span>
                        </div>
                     ))}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                           <Mail className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email Response</p>
                           <p className="font-bold">Under 2 hours</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                           <Phone className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Available for calls</p>
                           <p className="font-bold">Mon - Sun, 9am - 9pm</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-muted p-6 rounded-2xl mt-4">
                     <p className="text-sm font-semibold mb-2">Notice:</p>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        Booking does not require immediate payment. The guide will contact you within 24 hours to discuss the details.
                     </p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
