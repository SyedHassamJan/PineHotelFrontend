"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Car, Plus, Trash2, Edit, Loader2, Image as ImageIcon, User, Phone, Mail, MapPin, DollarSign, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Image from "next/image"

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

import { SuperAdminSidebar } from "@/components/superadmin-sidebar"

export default function CarsPage() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // View State
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  const handleViewClick = (car: Car) => {
    setSelectedCar(car)
    setIsViewOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setCarToDelete(id)
    setIsDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!carToDelete) return
    setIsDeleting(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/cars/${carToDelete}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success("Car deleted successfully")
        setCars(prev => prev.filter(c => c.id !== carToDelete))
        setIsDeleteOpen(false)
        fetchCars() // Refresh to ensure sync
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to delete car")
      }
    } catch (error) {
      console.error("Error deleting car:", error)
      toast.error("An error occurred while deleting")
    } finally {
      setIsDeleting(false)
      setCarToDelete(null)
    }
  }

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    city: "",
    hasDriver: false, // Default to false
    pricePerDay: "",
    pricePlaceToPlace: "",
    description: "",
    driverName: "",
    driverEmail: "",
    driverPhone: "",
    driverPricePerDay: "",
  })

  // File Inputs
  const [carImages, setCarImages] = useState<File[]>([])
  const [driverImages, setDriverImages] = useState<File[]>([])

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const response = await fetch(`${normalizedBaseUrl}api/cars`)
      if (response.ok) {
        const data = await response.json()
        setCars(data)
      } else {
        console.error("Failed to fetch cars")
      }
    } catch (error) {
      console.error("Error fetching cars:", error)
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
      const newFiles = Array.from(e.target.files)
      if (type === 'car') {
        setCarImages(prev => [...prev, ...newFiles])
      } else {
        setDriverImages(prev => [...prev, ...newFiles])
      }
      e.target.value = "" // Reset input value to allow selecting same file again
    }
  }

  const removeImage = (index: number, type: 'car' | 'driver') => {
    if (type === 'car') {
      setCarImages(prev => prev.filter((_, i) => i !== index))
    } else {
      setDriverImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const resetForm = () => {
    setFormData({
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
    setCarImages([])
    setDriverImages([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('model', formData.model)
      payload.append('city', formData.city)
      payload.append('hasDriver', String(formData.hasDriver)) // Convert boolean to string
      payload.append('pricePerDay', formData.pricePerDay)
      payload.append('pricePlaceToPlace', formData.pricePlaceToPlace)
      payload.append('description', formData.description)

      if (formData.hasDriver) {
        payload.append('driverName', formData.driverName)
        payload.append('driverEmail', formData.driverEmail)
        payload.append('driverPhone', formData.driverPhone)
        payload.append('driverPricePerDay', formData.driverPricePerDay)
        
        if (driverImages.length > 0) {
          driverImages.forEach(file => {
            payload.append('driverImages', file)
          })
        }
      }

      if (carImages.length > 0) {
        carImages.forEach(file => {
          payload.append('images', file)
        })
      }

      const response = await fetch(`${normalizedBaseUrl}api/cars`, {
        method: 'POST',
        body: payload, 
      })

      if (response.ok) {
        toast.success("Car created successfully")
        resetForm()
        setIsAddOpen(false)
        fetchCars()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to create car")
      }

    } catch (error) {
      console.error("Error creating car:", error)
      toast.error("An error occurred while creating the car")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cars Management</h1>
            <p className="text-muted-foreground mt-2">Add and manage your fleet of cars.</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Car
          </Button>
        </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
           <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
           <h3 className="text-lg font-medium">No cars found</h3>
           <p className="text-muted-foreground mb-4">Get started by adding your first car.</p>
           <Button onClick={() => setIsAddOpen(true)} variant="outline">
             Add Car
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                {car.images && car.images.length > 0 ? (
                  <img 
                    src={car.images[0]} 
                    alt={car.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                {car.hasDriver && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <User className="w-3 h-3" /> With Driver
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{car.name}</CardTitle>
                    <CardDescription>{car.model} • {car.city}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col p-2 bg-muted/50 rounded-md">
                     <span className="text-xs text-muted-foreground">Per Day</span>
                     <span className="font-semibold">${car.pricePerDay}</span>
                  </div>
                  <div className="flex flex-col p-2 bg-muted/50 rounded-md">
                     <span className="text-xs text-muted-foreground">Place to Place</span>
                     <span className="font-semibold">${car.pricePlaceToPlace}</span>
                  </div>
                </div>

                {car.hasDriver && car.driverInfo && (
                  <div className="pt-2 border-t mt-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Driver Info</p>
                    <div className="space-y-1 text-sm">
                       <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{car.driverInfo.name}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{car.driverInfo.phone}</span>
                       </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2 border-t">
                 <Button variant="outline" size="sm" onClick={() => handleViewClick(car)}>
                    <Eye className="w-4 h-4 mr-2" /> View
                 </Button>
                 <Button variant="outline" size="sm" onClick={() => router.push(`/superadmin/cars/${car.id}`)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                 </Button>
                 <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(car.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Car Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Car</DialogTitle>
            <DialogDescription>
              Create a new car listing. Fill in all the details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="carImages">Car Images</Label>
                <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/70 transition-colors">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <Input 
                    id="carImages" 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileChange(e, 'car')} 
                    required={carImages.length === 0} 
                  />
                  <Label htmlFor="carImages" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                    Click to upload images
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {carImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {carImages.map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border bg-background group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Preview ${index}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'car')}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
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
                  <div className="space-y-2">
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

                <div className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="driverImages">Driver Images</Label>
                     <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/70 transition-colors">
                       <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                       <Input 
                         id="driverImages" 
                         type="file" 
                         multiple 
                         accept="image/*" 
                         className="hidden" 
                         onChange={(e) => handleFileChange(e, 'driver')} 
                       />
                       <Label htmlFor="driverImages" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                         Click to upload driver images
                       </Label>
                       <p className="text-xs text-muted-foreground mt-1">Optional: Profile/License</p>
                     </div>
                   </div>

                   {driverImages.length > 0 && (
                     <div className="grid grid-cols-4 gap-4">
                       {driverImages.map((file, index) => (
                         <div key={index} className="relative aspect-square rounded-md overflow-hidden border bg-background group">
                           <img 
                             src={URL.createObjectURL(file)} 
                             alt={`Preview ${index}`} 
                             className="w-full h-full object-cover"
                           />
                           <button
                             type="button"
                             onClick={() => removeImage(index, 'driver')}
                             className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                           >
                             <Trash2 className="w-3 h-3" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            )}

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t mt-4">
               <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
               <Button type="submit" disabled={isSubmitting}>
                 {isSubmitting ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                   </>
                 ) : (
                   "Create Car"
                 )}
               </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={(open) => { if (!isDeleting) setIsDeleteOpen(open) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Car</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this car? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Car Details</DialogTitle>
             <DialogDescription>Full information about the vehicle.</DialogDescription>
          </DialogHeader>
          
          {selectedCar && (
            <div className="space-y-6 py-4">
              {/* Images Carousel/Grid */}
              {selectedCar.images && selectedCar.images.length > 0 && (
                <div className="space-y-2">
                   <Label className="text-muted-foreground">Car Images</Label>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                     {selectedCar.images.map((img, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                           <img 
                             src={img} 
                             alt={`${selectedCar.name} ${index + 1}`} 
                             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                           />
                        </div>
                     ))}
                   </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-semibold text-lg">{selectedCar.name}</p>
                 </div>
                 <div>
                    <Label className="text-muted-foreground">Model</Label>
                    <p className="font-semibold">{selectedCar.model}</p>
                 </div>
                 <div>
                    <Label className="text-muted-foreground">City</Label>
                    <p className="font-semibold">{selectedCar.city}</p>
                 </div>
                 <div>
                    <Label className="text-muted-foreground">Driver Option</Label>
                    <p className="font-semibold">{selectedCar.hasDriver ? "Included" : "Self Drive"}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                 <div>
                    <Label className="text-muted-foreground text-xs">Price Per Day</Label>
                    <p className="font-bold text-primary text-xl">${selectedCar.pricePerDay}</p>
                 </div>
                 <div>
                    <Label className="text-muted-foreground text-xs">Place to Place</Label>
                    <p className="font-bold text-primary text-xl">${selectedCar.pricePlaceToPlace}</p>
                 </div>
              </div>

               <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm mt-1 text-foreground/80">{selectedCar.description}</p>
               </div>

               {selectedCar.hasDriver && selectedCar.driverInfo && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                     <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <User className="w-5 h-5 text-primary" /> Driver Information
                     </h3>
                     
                     <div className="flex flex-col gap-4">
                        <div className="space-y-2 pl-1">
                           <p className="font-bold text-xl">{selectedCar.driverInfo.name}</p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-2 rounded">
                                 <Phone className="w-4 h-4 text-primary" /> {selectedCar.driverInfo.phone}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-2 rounded">
                                 <Mail className="w-4 h-4 text-primary" /> {selectedCar.driverInfo.email}
                              </div>
                           </div>
                           
                           {selectedCar.driverInfo.pricePerDay && (
                             <div className="flex items-center gap-2 text-sm font-semibold text-primary mt-2 bg-primary/10 p-2 rounded w-fit">
                                <DollarSign className="w-4 h-4" /> ${selectedCar.driverInfo.pricePerDay} / day (Driver Fee)
                             </div>
                           )}
                        </div>

                        {selectedCar.driverInfo.images && selectedCar.driverInfo.images.length > 0 ? (
                           <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Driver Documents / Images</Label>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                 {selectedCar.driverInfo.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border bg-muted group cursor-pointer">
                                       <img src={img} alt={`Driver Doc ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ) : (
                           <div className="flex items-center gap-2 text-muted-foreground text-sm italic bg-muted/30 p-3 rounded">
                              <User className="w-4 h-4" /> No driver images provided
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>
          )}
          
          <DialogFooter>
             <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}


