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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function EditTourGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    experienceYears: "",
    pricePerDay: "",
    description: "",
    isActive: true,
  })
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([""])

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
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          experienceYears: data.experienceYears?.toString() || "",
          pricePerDay: data.pricePerDay?.toString() || "",
          description: data.description || "",
          isActive: data.isActive ?? true,
        })
        setLanguages(Array.isArray(data.languages) && data.languages.length > 0 ? data.languages : [""])
        setCurrentImages(data.images || [])
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (val: boolean) => {
    setFormData(prev => ({ ...prev, isActive: val }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (files.length + newImages.length + currentImages.length > 10) {
        toast.error("You can only have a maximum of 10 images in total")
        return
      }
      setNewImages(prev => [...prev, ...files])
      
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeCurrentImage = (index: number) => {
    // In a real scenario, you might want to call an API to delete the image immediately or track deleted images to send with the update
    // For now, we'll just update the local state. The API logic would differ based on backend implementation.
    // Assuming the backend replaces the images array or handles deletion separately.
    // If the backend expects a list of retained image URLs, this works.
    setCurrentImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      if (formData.email) data.append('email', formData.email)
      if (formData.phone) data.append('phone', formData.phone)
      if (formData.city) data.append('city', formData.city)
      
      languages.forEach(lang => {
        if (lang.trim()) data.append('languages', lang.trim())
      })
      if (formData.experienceYears) data.append('experienceYears', formData.experienceYears)
      if (formData.pricePerDay) data.append('pricePerDay', formData.pricePerDay)
      if (formData.description) data.append('description', formData.description)
      data.append('isActive', String(formData.isActive))
      
      // Handle images:
      // Since FormData is flat, we might need a strategy for existing vs new images.
      // Often APIs want separate fields or handle mixed content differently.
      // If the API supports appending new images to existing ones via multipart:
      newImages.forEach(image => {
        data.append('images', image)
      })
      
      // If the backend expects a list of EXISTING image URLs to kep them, we need to send them.
      // Check backend API spec. Assuming it might replace or append.
      // If the backend logic is "replace all with provided", we can't easily re-upload existing URLs as files.
      // Usually, there's a separate field for 'existingImages' or similar, OR the 'images' field creates new ones 
      // and we need another way to say "keep these old ones".
      // Assuming a standard "update fields and append new files" approach for now.
      // If we need to delete images, that might be a separate API call or a specific field.
      // Let's send existing images as text fields if the API supports it, otherwise creating a workaround.
      // *Workaround*: Many simple uploaders just add new files. Deleting old ones might require a DELETE /images endpoint or sending a list of "kept" URLs.
      // Let's add existing images as a JSON string or separate fields if needed.
      // For this specific request, I will append them as 'existingImages' just in case the backend handles it.
      currentImages.forEach(img => data.append('existingImages', img))


      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      // Using PATCH as is common for updates
      const response = await fetch(`${normalizedBaseUrl}api/tour-guides/${id}`, {
        method: 'PATCH', 
        body: data,
      })

      if (response.ok) {
        toast.success("Tour guide updated successfully")
        router.push('/superadmin/tour-guides')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to update tour guide")
      }
    } catch (error) {
      console.error("Error updating guide:", error)
      toast.error("Error updating tour guide")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-background">
           <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
     )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Tour Guide</h1>
              <p className="text-muted-foreground">Update tour guide profile details.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Personal details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Ali Khan" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="ali@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+923001234567" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Hunza" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Languages</Label>
                    <div className="space-y-2">
                      {languages.map((lang, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={lang}
                            onChange={(e) => {
                              const newLanguages = [...languages]
                              newLanguages[index] = e.target.value
                              setLanguages(newLanguages)
                            }}
                            placeholder="e.g. English"
                          />
                          {languages.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newLanguages = languages.filter((_, i) => i !== index)
                                setLanguages(newLanguages)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setLanguages([...languages, ""])}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Language
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>Experience, pricing, and bio.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="experienceYears">Experience (Years)</Label>
                    <Input id="experienceYears" name="experienceYears" type="number" min="0" value={formData.experienceYears} onChange={handleInputChange} placeholder="5" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pricePerDay">Price Per Day</Label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                       <Input id="pricePerDay" name="pricePerDay" type="number" min="0" className="pl-7" value={formData.pricePerDay} onChange={handleInputChange} placeholder="50.00" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Bio / Description</Label>
                  <Textarea id="description" name="description" rows={5} value={formData.description} onChange={handleInputChange} placeholder="Describe the guide's expertise, specialties, and background..." />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Set whether this guide is currently available for bookings.
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Manage photos of the guide.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                   {/* Existing Images */}
                   {currentImages.length > 0 && (
                      <div className="space-y-2">
                         <Label>Current Images</Label>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {currentImages.map((img, index) => (
                               <div key={index} className="relative aspect-square group">
                                  <img 
                                     src={img} 
                                     alt={`Current ${index}`} 
                                     className="w-full h-full object-cover rounded-lg border" 
                                  />
                                  <button
                                     type="button"
                                     onClick={() => removeCurrentImage(index)}
                                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                     <Trash className="h-4 w-4" />
                                  </button>
                               </div>
                            ))}
                         </div>
                      </div>
                   )}

                  <div className="flex items-center gap-4 mt-4">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('new-images')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Images
                    </Button>
                    <input
                      id="new-images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      {newImages.length} new file(s) selected
                    </span>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square group">
                          <img
                            src={preview}
                            alt={`New Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Update Guide
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
