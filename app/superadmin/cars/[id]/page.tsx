"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, ArrowLeft, DollarSign, User, Phone, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

interface Car {
  id: string
  name: string
  model: string
  city: string
  images: string[]
  hasDriver: boolean
  driverInfo?: {
    name: string
    email: string
    phone: string
    images: string[]
    pricePerDay?: number
  }
  pricePerDay: number
  pricePlaceToPlace: number
  description: string
  createdAt: string
}

export default function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const carId = unwrappedParams.id
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [car, setCar] = useState<Car | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    city: "",
    hasDriver: false,
    pricePerDay: "",
    pricePlaceToPlace: "",
    description: "",
    driverName: "",
    driverEmail: "",
    driverPhone: "",
    driverPricePerDay: "",
  })

  // File Inputs
  const [carImages, setCarImages] = useState<FileList | null>(null)
  const [driverImages, setDriverImages] = useState<FileList | null>(null)

  useEffect(() => {
    fetchCarDetails()
  }, [carId])

  const fetchCarDetails = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const response = await fetch(`${normalizedBaseUrl}api/cars/${carId}`)
      if (response.ok) {
        const data: Car = await response.json()
        setCar(data)
        
        // Populate form
        setFormData({
          name: data.name || "",
          model: data.model || "",
          city: data.city || "",
          hasDriver: data.hasDriver || false,
          pricePerDay: data.pricePerDay?.toString() || "",
          pricePlaceToPlace: data.pricePlaceToPlace?.toString() || "",
          description: data.description || "",
          driverName: data.driverInfo?.name || "",
          driverEmail: data.driverInfo?.email || "",
          driverPhone: data.driverInfo?.phone || "",
          driverPricePerDay: data.driverInfo?.pricePerDay?.toString() || "",
        })
      } else {
        toast.error("Failed to load car details")
        router.push("/superadmin/cars")
      }
    } catch (error) {
      console.error("Error fetching car:", error)
      toast.error("Error loading car details")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
       const checked = (e.target as HTMLInputElement).checked
       setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
       setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value === 'true' }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'car' | 'driver') => {
    if (e.target.files && e.target.files.length > 0) {
      if (type === 'car') {
        setCarImages(e.target.files)
      } else {
        setDriverImages(e.target.files)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const payload = new FormData()
      
      // Update fields
      payload.append('name', formData.name)
      payload.append('model', formData.model)
      payload.append('city', formData.city)
      payload.append('hasDriver', String(formData.hasDriver)) // Must be string 'true' or 'false'
      payload.append('pricePerDay', formData.pricePerDay)
      payload.append('pricePlaceToPlace', formData.pricePlaceToPlace)
      payload.append('description', formData.description)

      if (formData.hasDriver) {
        payload.append('driverName', formData.driverName)
        payload.append('driverEmail', formData.driverEmail)
        payload.append('driverPhone', formData.driverPhone)
        payload.append('driverPricePerDay', formData.driverPricePerDay)
        
        // Only append driver images if new ones are selected
        if (driverImages) {
          for (let i = 0; i < driverImages.length; i++) {
            payload.append('driverImages', driverImages[i])
          }
        }
      }

      // Only append car images if new ones are selected
      if (carImages) {
        for (let i = 0; i < carImages.length; i++) {
          payload.append('images', carImages[i])
        }
      }

      console.log("Submitting PATCH request to:", `${normalizedBaseUrl}api/cars/${carId}`)

      const response = await fetch(`${normalizedBaseUrl}api/cars/${carId}`, {
        method: 'PATCH',
        body: payload, // Do NOT set Content-Type header manually for FormData
      })

      if (response.ok) {
        toast.success("Car updated successfully")
        router.push("/superadmin/cars")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to update car")
      }

    } catch (error) {
      console.error("Error updating car:", error)
      toast.error("An error occurred while updating the car")
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

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => router.back()}>
               <ArrowLeft className="w-4 h-4" />
             </Button>
             <div>
               <h1 className="text-3xl font-bold tracking-tight">Edit Car</h1>
               <p className="text-muted-foreground">Update details for {car?.name}</p>
             </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>Make changes to your car listing here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="edit-car-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Car Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Toyota Corolla" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model Year</Label>
                    <Input id="model" name="model" placeholder="e.g. 2023" value={formData.model} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" placeholder="e.g. Lahore" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hasDriver">Driver Included?</Label>
                    <select 
                      id="hasDriver" 
                      name="hasDriver" 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={String(formData.hasDriver)}
                      onChange={(e) => handleSelectChange('hasDriver', e.target.value)}
                    >
                      <option value="false">No (Self Drive)</option>
                      <option value="true">Yes (With Driver)</option>
                    </select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="pricePerDay">Price Per Day</Label>
                     <div className="relative">
                       <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input id="pricePerDay" name="pricePerDay" type="number" className="pl-8" placeholder="0.00" value={formData.pricePerDay} onChange={handleInputChange} required />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="pricePlaceToPlace">Price Place to Place</Label>
                     <div className="relative">
                       <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input id="pricePlaceToPlace" name="pricePlaceToPlace" type="number" className="pl-8" placeholder="0.00" value={formData.pricePlaceToPlace} onChange={handleInputChange} required />
                     </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="description">Description</Label>
                   <Textarea id="description" name="description" placeholder="Describe the car features, condition, etc." value={formData.description} onChange={handleInputChange} rows={3} required />
                </div>

                {/* Car Images */}
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="space-y-2">
                    <Label htmlFor="carImages">Update Car Images</Label>
                    <Input id="carImages" type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'car')} />
                    <p className="text-xs text-muted-foreground">Select new images to add to the existing ones.</p>
                  </div>
                  
                  {car?.images && car?.images.length > 0 && (
                    <div className="space-y-2">
                      <Label>Current Images</Label>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {car.images.map((img, idx) => (
                           <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 border">
                              <img src={img} alt={`Car ${idx}`} className="w-full h-full object-cover" />
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Conditional Driver Fields */}
                {formData.hasDriver && (
                  <div className="border rounded-lg p-4 bg-muted/30 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Driver Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="driverName">Driver Name</Label>
                        <Input id="driverName" name="driverName" placeholder="Full Name" value={formData.driverName} onChange={handleInputChange} required={formData.hasDriver} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="driverPhone">Phone Number</Label>
                        <Input id="driverPhone" name="driverPhone" placeholder="+92..." value={formData.driverPhone} onChange={handleInputChange} required={formData.hasDriver} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="driverEmail">Email Address</Label>
                        <Input id="driverEmail" name="driverEmail" type="email" placeholder="driver@example.com" value={formData.driverEmail} onChange={handleInputChange} required={formData.hasDriver} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="driverPricePerDay">Driver Price Per Day</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="driverPricePerDay" 
                            name="driverPricePerDay" 
                            type="number" 
                            className="pl-8" 
                            placeholder="0.00" 
                            value={formData.driverPricePerDay} 
                            onChange={handleInputChange} 
                            required={formData.hasDriver} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <Label htmlFor="driverImages">Update Driver Images</Label>
                       <Input id="driverImages" type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'driver')} />
                       <p className="text-xs text-muted-foreground">Optional: Upload new driver images.</p>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" form="edit-car-form" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
