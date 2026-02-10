"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Upload, Trash, X, Plus } from "lucide-react"
import { toast } from "sonner"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

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

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    durationDays: "",
    durationNights: "",
    city: "",
    pricePerPerson: "",
    status: "DRAFT"
  })
  
  const [locations, setLocations] = useState<string[]>([""])
  const [includes, setIncludes] = useState<string[]>([""])
  const [excludes, setExcludes] = useState<string[]>([""])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
        const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
        const response = await fetch(`${normalizedBaseUrl}api/tours/${id}`)
        
        if (response.ok) {
          const data: TourData = await response.json()
          setFormData({
            title: data.title,
            shortDescription: data.shortDescription || "",
            description: data.description || "",
            durationDays: data.durationDays?.toString() || "",
            durationNights: data.durationNights?.toString() || "",
            city: data.city || "",
            pricePerPerson: data.pricePerPerson?.toString() || "",
            status: data.status || "DRAFT"
          })
          setLocations(data.locations && data.locations.length > 0 ? data.locations : [""])
          setIncludes(data.includes && data.includes.length > 0 ? data.includes : [""])
          setExcludes(data.excludes && data.excludes.length > 0 ? data.excludes : [""])
          setExistingImages(data.cardImages || [])
        } else {
          toast.error("Failed to load tour")
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files))
    }
  }

  // Array field handlers
  const handleArrayChange = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => {
      const newArray = [...prev]
      newArray[index] = value
      return newArray
    })
  }

  const addArrayField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, ""])
  }

  const removeArrayField = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const data = new FormData()
      
      // Only append fields that have values
      if (formData.title) data.append('title', formData.title)
      if (formData.shortDescription) data.append('shortDescription', formData.shortDescription)
      if (formData.description) data.append('description', formData.description)
      if (formData.city) data.append('city', formData.city)
      if (formData.status) data.append('status', formData.status)
      if (formData.pricePerPerson) data.append('pricePerPerson', formData.pricePerPerson)
      if (formData.durationDays) data.append('durationDays', formData.durationDays)
      if (formData.durationNights) data.append('durationNights', formData.durationNights)

      // Arrays - filter out empty strings and join
      const locationsArray = locations.filter(item => item.trim())
      const includesArray = includes.filter(item => item.trim())
      const excludesArray = excludes.filter(item => item.trim())

      if (locationsArray.length > 0) data.append('locations', locationsArray.join(','))
      if (includesArray.length > 0) data.append('includes', includesArray.join(','))
      if (excludesArray.length > 0) data.append('excludes', excludesArray.join(','))

      // New files (will be added to existing images)
      newFiles.forEach(file => {
        data.append('cardImages', file)
      })

      const response = await fetch(`${normalizedBaseUrl}api/tours/${id}`, {
        method: 'PATCH',
        body: data
      })

      if (response.ok) {
        toast.success("Tour updated successfully")
        router.push(`/superadmin/tours/${id}`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to update tour")
      }
    } catch (error) {
      console.error("Error updating tour:", error)
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Tour</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the core details of the tour package.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Tour Title <span className="text-red-500">*</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} placeholder="Brief summary for listings..." />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={6} placeholder="Detailed itinerary and description..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="city">Main City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Swat" />
                </div>
                <div className="grid gap-2">
                   <Label htmlFor="status">Status</Label>
                   <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                      <SelectTrigger>
                         <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="DRAFT">Draft</SelectItem>
                         <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle>Pricing & Duration</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="grid gap-2">
                      <Label htmlFor="pricePerPerson">Price Per Person</Label>
                      <Input id="pricePerPerson" name="pricePerPerson" type="number" value={formData.pricePerPerson} onChange={handleInputChange} required />
                   </div>
                   <div className="grid gap-2">
                      <Label htmlFor="durationDays">Duration (Days)</Label>
                      <Input id="durationDays" name="durationDays" type="number" value={formData.durationDays} onChange={handleInputChange} />
                   </div>
                   <div className="grid gap-2">
                      <Label htmlFor="durationNights">Duration (Nights)</Label>
                      <Input id="durationNights" name="durationNights" type="number" value={formData.durationNights} onChange={handleInputChange} />
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle>Details & Features</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                {/* Locations */}
                <div className="grid gap-3">
                   <Label>Locations Covered</Label>
                   {locations.map((location, index) => (
                      <div key={index} className="flex gap-2">
                         <Input
                            value={location}
                            onChange={(e) => handleArrayChange(index, e.target.value, setLocations)}
                            placeholder="e.g. Hunza"
                            className="flex-1"
                         />
                         {locations.length > 1 && (
                            <Button
                               type="button"
                               variant="outline"
                               size="icon"
                               onClick={() => removeArrayField(index, setLocations)}
                            >
                               <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                         )}
                         {index === locations.length - 1 && (
                            <Button
                               type="button"
                               variant="outline"
                               size="icon"
                               onClick={() => addArrayField(setLocations)}
                            >
                               <Plus className="h-4 w-4" />
                            </Button>
                         )}
                      </div>
                   ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Includes */}
                   <div className="grid gap-3">
                      <Label>What's Included</Label>
                      {includes.map((include, index) => (
                         <div key={index} className="flex gap-2">
                            <Input
                               value={include}
                               onChange={(e) => handleArrayChange(index, e.target.value, setIncludes)}
                               placeholder="e.g. Hotel"
                               className="flex-1"
                            />
                            {includes.length > 1 && (
                               <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeArrayField(index, setIncludes)}
                               >
                                  <Trash className="h-4 w-4 text-red-500" />
                               </Button>
                            )}
                            {index === includes.length - 1 && (
                               <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => addArrayField(setIncludes)}
                               >
                                  <Plus className="h-4 w-4" />
                               </Button>
                            )}
                         </div>
                      ))}
                   </div>

                   {/* Excludes */}
                   <div className="grid gap-3">
                      <Label>What's Excluded</Label>
                      {excludes.map((exclude, index) => (
                         <div key={index} className="flex gap-2">
                            <Input
                               value={exclude}
                               onChange={(e) => handleArrayChange(index, e.target.value, setExcludes)}
                               placeholder="e.g. Personal expenses"
                               className="flex-1"
                            />
                            {excludes.length > 1 && (
                               <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeArrayField(index, setExcludes)}
                               >
                                  <Trash className="h-4 w-4 text-red-500" />
                               </Button>
                            )}
                            {index === excludes.length - 1 && (
                               <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => addArrayField(setExcludes)}
                               >
                                  <Plus className="h-4 w-4" />
                               </Button>
                            )}
                         </div>
                      ))}
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Existing images will be kept. Upload new images to add to the tour.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                   <div>
                      <Label className="mb-3 block">Current Images</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                         {existingImages.map((img, i) => {
                            const imageUrl = img.startsWith('http') ? img : `${normalizedBaseUrl}${img}`
                            return (
                               <div key={i} className="relative aspect-video bg-muted rounded overflow-hidden">
                                  <img src={imageUrl} alt={`Existing ${i + 1}`} className="w-full h-full object-cover" />
                               </div>
                            )
                         })}
                      </div>
                   </div>
                )}

                {/* New Images Upload */}
                <div className="grid gap-2">
                   <Label htmlFor="cardImages">Add New Images (Optional)</Label>
                   <div className="flex items-center justify-center w-full">
                      <label htmlFor="cardImages" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition bg-muted/20">
                         <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">New images will be added to existing ones</p>
                         </div>
                         <Input id="cardImages" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                   </div>
                   {newFiles.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                         {newFiles.map((file, i) => (
                            <div key={i} className="relative aspect-video bg-muted rounded overflow-hidden group">
                               <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                               <button 
                                 type="button"
                                 onClick={() => setNewFiles(newFiles.filter((_, index) => index !== i))}
                                 className="absolute top-1 right-1 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                               >
                                  <Trash className="w-3 h-3 text-red-500" />
                               </button>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
             <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
             <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Tour
             </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
