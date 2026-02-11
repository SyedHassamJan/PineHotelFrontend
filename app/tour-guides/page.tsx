"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { GuideCard } from "@/components/guide-card"
import { Input } from "@/components/ui/input"

export default function TourGuidesPage() {
  const [guides, setGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tour-guides`)
      
      if (response.ok) {
        const data = await response.json()
        const guidesData = Array.isArray(data) ? data : (data.data || [])
        // Filter only active guides
        setGuides(guidesData.filter((g: any) => g.isActive))
      }
    } catch (error) {
      console.error("Error fetching guides:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGuides = guides.filter(guide => 
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.languages?.some((lang: string) => lang.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#006951] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-extrabold mb-4">Our Expert Tour Guides</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Connect with local experts who bring destinations to life with deep knowledge and personal stories.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-card border rounded-xl shadow-xl p-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input
              placeholder="Search by name, city, or language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-7 text-lg rounded-lg border-2 focus:border-[#006951] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-[#006951]" />
            <p className="text-muted-foreground font-medium">Finding the best guides for you...</p>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No guides found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchTerm 
                ? `We couldn't find any guides matching "${searchTerm}". Try a different search term.` 
                : "There are no active guides available at the moment. Please check back later."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredGuides.map((guide) => {
              const imageUrl = guide.images && guide.images.length > 0 
                ? (guide.images[0].startsWith('http') ? guide.images[0] : `${normalizedBaseUrl}${guide.images[0]}`)
                : '/placeholder.svg'
              
              return (
                <GuideCard 
                  key={guide.id}
                  id={guide.id}
                  name={guide.name}
                  image={imageUrl}
                  languages={guide.languages}
                  experience={guide.experienceYears}
                  dailyRate={guide.pricePerDay}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
