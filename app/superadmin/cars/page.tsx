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
            <Card key={car.id} className="overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 group border-2">
              <div className="relative h-56 bg-muted overflow-hidden">
                {car.images && car.images.length > 0 ? (
                  <img 
                    src={car.images[0]} 
                    alt={car.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0" />
                {car.hasDriver && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                    <User className="w-3.5 h-3.5" /> Driver Available
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 pb-1">
                  <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg line-clamp-1">{car.name}</h3>
                  <div className="flex items-center gap-2.5 text-white/95 text-sm flex-wrap">
                    <span className="bg-white/25 backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">{car.model}</span>
                    <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <MapPin className="w-3.5 h-3.5" />
                      {car.city}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-5 pb-4 px-5 space-y-5">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed px-1">{car.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 pl-4 py-3 rounded-r-lg">
                     <span className="text-xs text-muted-foreground font-medium block mb-1">Daily Rate</span>
                     <span className="font-bold text-lg text-foreground">${car.pricePerDay}</span>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50/50 dark:bg-green-950/20 pl-4 py-3 rounded-r-lg">
                     <span className="text-xs text-muted-foreground font-medium block mb-1">Point to Point</span>
                     <span className="font-bold text-lg text-foreground">${car.pricePlaceToPlace}</span>
                  </div>
                </div>

                {car.hasDriver && car.driverInfo && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Driver Details
                    </p>
                    <div className="space-y-2 text-sm">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span className="font-medium">{car.driverInfo.name}</span>
                       </div>
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{car.driverInfo.phone}</span>
                       </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-4 pb-4 px-5 border-t bg-muted/30">
                 <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewClick(car)}>
                    <Eye className="w-4 h-4 mr-1.5" /> View
                 </Button>
                 <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/superadmin/cars/${car.id}`)}>
                    <Edit className="w-4 h-4 mr-1.5" /> Edit
                 </Button>
                 <Button variant="destructive" size="sm" className="px-3" onClick={() => handleDeleteClick(car.id)}>
                    <Trash2 className="w-4 h-4" />
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
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Car className="w-6 h-6 text-primary" />
              {selectedCar?.name}
            </DialogTitle>
            <DialogDescription>Complete vehicle information and specifications</DialogDescription>
          </DialogHeader>
          
          {selectedCar && (
            <div className="space-y-6 py-4">
              {/* Images Carousel/Grid */}
              {selectedCar.images && selectedCar.images.length > 0 && (
                <div className="space-y-3">
                   <div className="flex items-center gap-2">
                     <ImageIcon className="w-4 h-4 text-primary" />
                     <Label className="font-semibold text-base">Vehicle Gallery</Label>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {selectedCar.images.map((img, index) => (
                        <div key={index} className="relative aspect-video rounded-xl overflow-hidden border-2 border-border/50 shadow-sm bg-muted group">
                           <img 
                             src={img} 
                             alt={`${selectedCar.name} ${index + 1}`} 
                             className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                           />
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                     ))}
                   </div>
                </div>
              )}

              {/* Vehicle Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 pl-4 py-3 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vehicle Name</Label>
                    </div>
                    <p className="font-bold text-lg text-foreground">{selectedCar.name}</p>
                 </div>
                 <div className="border-l-4 border-green-500 bg-green-50/50 dark:bg-green-950/20 pl-4 py-3 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Model Year</Label>
                    </div>
                    <p className="font-bold text-lg text-foreground">{selectedCar.model}</p>
                 </div>
                 <div className="border-l-4 border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 pl-4 py-3 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</Label>
                    </div>
                    <p className="font-bold text-lg text-foreground">{selectedCar.city}</p>
                 </div>
                 <div className="border-l-4 border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 pl-4 py-3 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Service Type</Label>
                    </div>
                    <p className="font-bold text-lg text-foreground">{selectedCar.hasDriver ? "With Driver" : "Self Drive"}</p>
                 </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-5">
                 <div className="flex items-center gap-2 mb-4">
                   <DollarSign className="w-5 h-5 text-primary" />
                   <h3 className="font-bold text-lg">Pricing Information</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                     <div className="flex items-baseline justify-between">
                       <div>
                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Daily Rate</p>
                         <p className="text-3xl font-bold text-primary">${selectedCar.pricePerDay}</p>
                       </div>
                       <div className="text-right">
                         <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2 py-1 rounded-full">per day</div>
                       </div>
                     </div>
                   </div>
                   <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                     <div className="flex items-baseline justify-between">
                       <div>
                         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Point to Point</p>
                         <p className="text-3xl font-bold text-primary">${selectedCar.pricePlaceToPlace}</p>
                       </div>
                       <div className="text-right">
                         <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded-full">fixed</div>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>

               {/* Description Section */}
               <div className="border rounded-lg p-4 bg-muted/30">
                  <Label className="font-semibold text-base mb-2 block">Vehicle Description</Label>
                  <p className="text-sm leading-relaxed text-foreground/80">{selectedCar.description}</p>
               </div>

               {/* Driver Information Section */}
               {selectedCar.hasDriver && selectedCar.driverInfo && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                     <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg">Driver Information</h3>
                     </div>
                     
                     <div className="space-y-4">
                        {/* Driver Name */}
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                           <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Driver Name</Label>
                           <p className="font-bold text-xl text-foreground">{selectedCar.driverInfo.name}</p>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           <div className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 pl-4 py-3 rounded-r-lg">
                              <div className="flex items-center gap-2 mb-1">
                                 <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                 <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</Label>
                              </div>
                              <p className="font-semibold text-foreground">{selectedCar.driverInfo.phone}</p>
                           </div>
                           <div className="border-l-4 border-green-500 bg-green-50/50 dark:bg-green-950/20 pl-4 py-3 rounded-r-lg">
                              <div className="flex items-center gap-2 mb-1">
                                 <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                                 <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
                              </div>
                              <p className="font-semibold text-foreground text-sm">{selectedCar.driverInfo.email}</p>
                           </div>
                        </div>
                        
                        {/* Driver Fee */}
                        {selectedCar.driverInfo.pricePerDay && (
                          <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-lg p-4">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                                   <DollarSign className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                                 </div>
                                 <div>
                                   <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Driver Fee</p>
                                   <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">${selectedCar.driverInfo.pricePerDay}</p>
                                 </div>
                               </div>
                               <div className="bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-semibold px-3 py-1 rounded-full">per day</div>
                             </div>
                          </div>
                        )}

                        {/* Driver Documents/Images */}
                        {selectedCar.driverInfo.images && selectedCar.driverInfo.images.length > 0 ? (
                           <div className="space-y-3">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Driver Documents & Photos
                              </Label>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                 {selectedCar.driverInfo.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-border shadow-sm bg-muted group cursor-pointer hover:border-primary transition-all">
                                       <img src={img} alt={`Driver Doc ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ) : (
                           <div className="flex items-center gap-3 text-muted-foreground text-sm bg-muted/50 border border-dashed p-4 rounded-lg">
                              <ImageIcon className="w-5 h-5" />
                              <span>No driver documents uploaded</span>
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


