"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  Home, 
  Calendar, 
  Settings,
  LogOut,
  BedDouble,
  ArrowLeft,
  Plus,
  X,
  Upload,
  Image as ImageIcon
} from "lucide-react"
import Link from "next/link"

export default function AddRoomPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    roomType: "",
    description: "",
    maxGuests: "",
    quantity: "",
    bedType: "",
    roomFloor: "",
    amenities: [] as string[]
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  useEffect(() => {
    const hotelOwnerAuth = localStorage.getItem("hotelOwnerAuth")
    const userStr = localStorage.getItem("user")
    
    if (!hotelOwnerAuth) {
      router.push("/admin/login")
    } else {
      const auth = JSON.parse(hotelOwnerAuth)
      setOwnerEmail(auth.email)
      
      // Get user ID from user object
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setUserId(user.id || user._id || "")
        } catch (error) {
          console.error("Error parsing user data", error)
        }
      }
      
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/admin/login")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }))
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      
      // Validate file types and sizes
      const validFiles: File[] = []
      const invalidFiles: string[] = []
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      fileArray.forEach(file => {
        if (!file.type.startsWith('image/')) {
          invalidFiles.push(`${file.name} (not an image)`)
        } else if (file.size > maxSize) {
          invalidFiles.push(`${file.name} (exceeds 10MB)`)
        } else {
          validFiles.push(file)
        }
      })
      
      if (invalidFiles.length > 0) {
        setError(`Invalid files: ${invalidFiles.join(', ')}`)
        setTimeout(() => setError(""), 5000)
      }
      
      if (validFiles.length === 0) return
      
      const totalFiles = selectedFiles.length + validFiles.length
      
      // Limit to 5 images max
      if (totalFiles > 5) {
        const remainingSlots = 5 - selectedFiles.length
        if (remainingSlots > 0) {
          setError(`You can only upload up to 5 images. Adding ${remainingSlots} more image(s).`)
          const limitedFiles = validFiles.slice(0, remainingSlots)
          setSelectedFiles(prev => [...prev, ...limitedFiles])
          
          limitedFiles.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
              setPreviewUrls(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
          })
        } else {
          setError("Maximum of 5 images reached. Please remove some images first.")
        }
        setTimeout(() => setError(""), 3000)
      } else {
        setSelectedFiles(prev => [...prev, ...validFiles])
        
        // Create preview URLs
        validFiles.forEach(file => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setPreviewUrls(prev => [...prev, reader.result as string])
          }
          reader.readAsDataURL(file)
        })
      }
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) {
      setError("User ID not found. Please log in again.")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData()
      
      // Append text fields
      formDataToSend.append('roomType', formData.roomType)
      if (formData.description.trim()) {
        formDataToSend.append('description', formData.description)
      }
      formDataToSend.append('maxGuests', formData.maxGuests)
      formDataToSend.append('quantity', formData.quantity)
      if (formData.bedType.trim()) {
        formDataToSend.append('bedType', formData.bedType)
      }
      if (formData.roomFloor.trim()) {
        formDataToSend.append('roomFloor', formData.roomFloor)
      }
      
      // Append amenities as JSON stringified array
      if (formData.amenities.length > 0) {
        formDataToSend.append('amenities', JSON.stringify(formData.amenities))
      }
      
      // Append image files (max 5)
      const filesToUpload = selectedFiles.slice(0, 5)
      filesToUpload.forEach((file) => {
        formDataToSend.append('images', file)
      })
      
      // Note: Browser will automatically set Content-Type with boundary for FormData
      const response = await fetch(`${baseUrl}api/rooms/hotels/${userId}/rooms`, {
        method: 'POST',
        body: formDataToSend
      })

      const responseData = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to create room (Status: ${response.status})`)
      }

      setSuccess(true)
      
      // Show success message with room details
      const roomType = responseData.roomType || formData.roomType
      setError(`✓ Room "${roomType}" created successfully! Redirecting...`)
      
      // Reset form
      setFormData({
        roomType: "",
        description: "",
        maxGuests: "",
        quantity: "",
        bedType: "",
        roomFloor: "",
        amenities: []
      })
      setSelectedFiles([])
      setPreviewUrls([])
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 2000)

    } catch (err) {
      console.error("Error creating room:", err)
      setError(err instanceof Error ? err.message : "Failed to create room. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r min-h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Hotel Owner</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/admin/my-hotels" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Building2 className="w-5 h-5" />
              My Hotels
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Calendar className="w-5 h-5" />
              Bookings
            </Link>
            <Link href="/admin/rooms" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
              <BedDouble className="w-5 h-5" />
              Rooms
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-3 bg-accent rounded-lg mb-3">
              <p className="text-sm font-medium truncate">{ownerEmail}</p>
              <p className="text-xs text-muted-foreground">Hotel Owner</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-950 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/dashboard" 
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Add New Room</h1>
                <p className="text-sm text-muted-foreground mt-1">Create a new room for your hotel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-w-3xl">
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">Room created successfully! Redirecting...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-gray-950 rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Room Details</h2>
              
              <div className="space-y-4">
                {/* Room Type */}
                <div>
                  <label htmlFor="roomType" className="block text-sm font-medium mb-2">
                    Room Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="roomType"
                    name="roomType"
                    required
                    value={formData.roomType}
                    onChange={handleInputChange}
                    placeholder="e.g., Deluxe Suite, Standard Room, Ocean View"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the room features, view, and special characteristics..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Max Guests */}
                <div>
                  <label htmlFor="maxGuests" className="block text-sm font-medium mb-2">
                    Maximum Guests <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="maxGuests"
                    name="maxGuests"
                    required
                    min="1"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                    Quantity (Number of Rooms) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Bed Type */}
                <div>
                  <label htmlFor="bedType" className="block text-sm font-medium mb-2">
                    Bed Type
                  </label>
                  <input
                    type="text"
                    id="bedType"
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 King Bed, 2 Queen Beds"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Room Floor */}
                <div>
                  <label htmlFor="roomFloor" className="block text-sm font-medium mb-2">
                    Room Floor
                  </label>
                  <input
                    type="text"
                    id="roomFloor"
                    name="roomFloor"
                    value={formData.roomFloor}
                    onChange={handleInputChange}
                    placeholder="e.g., 3rd Floor, Ground Floor, Floor 5"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Room Images <span className="text-xs text-muted-foreground font-normal">(Max 5 images)</span>
                  </label>
                  
                  {/* File Upload Option */}
                  <div className="mb-4">
                    <label 
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center gap-3 w-full px-4 py-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          Click to upload room images
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, WEBP up to 10MB each
                        </p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 ? (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">
                          Selected Images ({selectedFiles.length}/5)
                        </p>
                        {selectedFiles.length === 5 && (
                          <span className="text-xs text-orange-600 dark:text-orange-400">
                            Maximum reached
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {selectedFiles.map((file, index) => (
                          <div 
                            key={index} 
                            className="relative group border rounded-lg overflow-hidden bg-accent/50 hover:border-primary transition-colors"
                          >
                            <img 
                              src={previewUrls[index]} 
                              alt={file.name} 
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-2 bg-background/95">
                              <p className="text-xs truncate" title={file.name}>{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-6 border rounded-lg bg-muted/30 text-center">
                      <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No images selected yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click the upload area above to add room images
                      </p>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amenities
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addAmenity()
                        }
                      }}
                      placeholder="Add amenity (e.g., WiFi, TV, Mini Bar)"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={addAmenity}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenity, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-sm"
                        >
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Room...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Room</span>
                  </>
                )}
              </button>
              <Link
                href="/admin/dashboard"
                className="px-6 py-3 border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </Link>
              {selectedFiles.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} ready to upload
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
