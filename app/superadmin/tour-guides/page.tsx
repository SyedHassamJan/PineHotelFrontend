"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Search, 
  Trash, 
  MapPin, 
  DollarSign, 
  Star, 
  Phone, 
  Mail, 
  Loader2,
  Eye,
  Edit 
} from "lucide-react"
import { toast } from "sonner"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

interface TourGuide {
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

export default function TourGuidesPage() {
  const router = useRouter()
  const [guides, setGuides] = useState<TourGuide[]>([])
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
        setGuides(Array.isArray(data) ? data : (data.data || []))
      } else {
        toast.error("Failed to fetch tour guides")
      }
    } catch (error) {
      console.error("Error fetching guides:", error)
      toast.error("Error loading tour guides")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guide?")) return

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/tour-guides/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Tour guide deleted successfully")
        setGuides(guides.filter(g => g.id !== id))
      } else {
        toast.error("Failed to delete tour guide")
      }
    } catch (error) {
      console.error("Error deleting guide:", error)
      toast.error("Error deleting tour guide")
    }
  }

  const filteredGuides = guides.filter(guide => 
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tour Guides</h1>
              <p className="text-muted-foreground mt-2">Manage expert tour guides for your platform.</p>
            </div>
            <Button onClick={() => router.push('/superadmin/tour-guides/new')}>
              <Plus className="h-4 w-4 mr-2" /> Add New Guide
            </Button>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, or city..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredGuides.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No tour guides found.
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Languages</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Price/Day</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuides.map((guide) => (
                      <TableRow key={guide.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                              {guide.images && guide.images.length > 0 ? (
                                <img 
                                  src={guide.images[0]} 
                                  alt={guide.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                                  No Img
                                </div>
                              )}
                            </div>
                            <span className="font-medium">{guide.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {guide.email || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {guide.phone || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {guide.city || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {guide.languages && guide.languages.length > 0 ? (
                              guide.languages.slice(0, 2).map((lang, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
                                  {lang}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                            {guide.languages && guide.languages.length > 2 && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0">+{guide.languages.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {guide.experienceYears ? `${guide.experienceYears} Years` : '-'}
                        </TableCell>
                        <TableCell className="font-medium text-primary">
                          {guide.pricePerDay ? `$${guide.pricePerDay}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={guide.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}>
                             {guide.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => router.push(`/superadmin/tour-guides/${guide.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                            onClick={() => router.push(`/superadmin/tour-guides/${guide.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(guide.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
