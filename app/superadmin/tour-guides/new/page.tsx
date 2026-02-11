"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Upload, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function NewTourGuidePage() {
  const router = useRouter()
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
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([""])

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
      if (files.length + images.length > 10) {
        toast.error("You can only upload a maximum of 10 images")
        return
      }
      setImages(prev => [...prev, ...files])
      
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
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
      images.forEach(image => {
        data.append('images', image)
      })

      languages.forEach(lang => {
        if (lang.trim()) data.append('languages', lang.trim())
      })

      if (formData.experienceYears) data.append('experienceYears', formData.experienceYears)
      if (formData.pricePerDay) data.append('pricePerDay', formData.pricePerDay)
      if (formData.description) data.append('description', formData.description)
      data.append('isActive', String(formData.isActive))

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const response = await fetch(`${normalizedBaseUrl}api/tour-guides`, {
        method: 'POST',
        body: data,
      })

      if (response.ok) {
        toast.success("Tour guide created successfully")
        router.push('/superadmin/tour-guides')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to create tour guide")
      }
    } catch (error) {
      console.error("Error creating guide:", error)
      toast.error("Error creating tour guide")
    } finally {
      setIsSubmitting(false)
    }
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
              <h1 className="text-3xl font-bold tracking-tight">Add New Tour Guide</h1>
              <p className="text-muted-foreground">Create a new expert tour guide profile.</p>
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
                <CardDescription>Upload professional photos of the guide.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('images')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      {images.length} file(s) selected (Max 10)
                    </span>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
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
                Create Guide
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
