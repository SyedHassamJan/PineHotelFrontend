"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  Building2, 
  Home, 
  Calendar, 
  Settings,
  LogOut,
  BedDouble,
  ArrowLeft,
  Plus,
  X
} from "lucide-react"
import Link from "next/link"

interface Room {
  id: string
  roomType: string
  description: string
  maxGuests: number
  quantity: number
  bedType: string
  roomFloor: string
  amenities: string[]
  images: string[]
}

export default function EditRoomPage() {
  const router = useRouter()
  const params = useParams()
  const roomId = params.id as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ownerEmail, setOwnerEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchingRoom, setFetchingRoom] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Original room data
  const [originalRoom, setOriginalRoom] = useState<Room | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    roomType: "",
    description: "",
    maxGuests: "",
    quantity: "",
    bedType: "",
    roomFloor: "",
    amenities: [] as string[],
    images: [] as string[]
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")

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

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      if (!userId || !roomId) return

      try {
        setFetchingRoom(true)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
        const response = await fetch(`${baseUrl}api/rooms/hotels/${userId}/rooms`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch room')
        }

        const rooms = await response.json()
        const room = Array.isArray(rooms) ? rooms.find((r: Room) => r.id === roomId) : null
        
        if (room) {
          // Store original data
          setOriginalRoom(room)
          
          // Pre-fill form with existing data
          const amenitiesList = room.amenities.map((a: any) => 
            typeof a === 'string' ? a : a.name
          )
          
          setFormData({
            roomType: room.roomType || "",
            description: room.description || "",
            maxGuests: room.maxGuests?.toString() || "",
            quantity: room.quantity?.toString() || "",
            bedType: room.bedType || "",
            roomFloor: room.roomFloor || "",
            amenities: amenitiesList || [],
            images: room.images || []
          })
        } else {
          setError("Room not found")
        }
      } catch (err) {
        console.error("Error fetching room:", err)
        setError("Failed to load room data")
      } finally {
        setFetchingRoom(false)
      }
    }

    if (userId && roomId) {
      fetchRoom()
    }
  }, [userId, roomId])

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

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl("")
    }
  }

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId || !roomId || !originalRoom) {
      setError("Missing required data. Please try again.")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      
      // Only include changed fields in the update
      const updateData: any = {}
      
      // Check each field and only include if changed and not empty
      if (formData.roomType?.trim() && formData.roomType !== originalRoom.roomType) {
        updateData.roomType = formData.roomType
      }
      
      if (formData.description?.trim() && formData.description !== originalRoom.description) {
        updateData.description = formData.description
      }
      
      if (formData.maxGuests) {
        const maxGuests = parseInt(formData.maxGuests)
        if (maxGuests !== originalRoom.maxGuests) {
          updateData.maxGuests = maxGuests
        }
      }
      
      if (formData.quantity) {
        const quantity = parseInt(formData.quantity)
        if (quantity !== originalRoom.quantity) {
          updateData.quantity = quantity
        }
      }
      
      if (formData.bedType?.trim() && formData.bedType !== originalRoom.bedType) {
        updateData.bedType = formData.bedType
      }
      
      if (formData.roomFloor?.trim() && formData.roomFloor !== originalRoom.roomFloor) {
        updateData.roomFloor = formData.roomFloor
      }
      
      // Check if amenities changed
      const originalAmenities = originalRoom.amenities.map((a: any) => 
        typeof a === 'string' ? a : a.name
      )
      if (JSON.stringify(formData.amenities.sort()) !== JSON.stringify(originalAmenities.sort())) {
        updateData.amenities = formData.amenities
      }
      
      // Check if images changed
      if (JSON.stringify(formData.images) !== JSON.stringify(originalRoom.images)) {
        updateData.images = formData.images
      }

      // If no changes were made
      if (Object.keys(updateData).length === 0) {
        setError("No changes detected")
        setLoading(false)
        return
      }

      const response = await fetch(`${baseUrl}api/rooms/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const responseData = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to update room (Status: ${response.status})`)
      }

      setSuccess(true)
      setError(`Room updated successfully! (Status: ${response.status})`)

      // Redirect to rooms page after a short delay
      setTimeout(() => {
        router.push("/admin/rooms")
      }, 2000)

    } catch (err) {
      console.error("Error updating room:", err)
      setError(err instanceof Error ? err.message : "Failed to update room. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || fetchingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">
            {fetchingRoom ? "Loading room data..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    )
  }

  if (error && !originalRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/admin/rooms"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Back to Rooms
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-950 border-r flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Building2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Hotel Admin</span>
          </div>

          <nav className="space-y-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/admin/rooms" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent text-accent-foreground">
              <BedDouble className="w-5 h-5" />
              Rooms
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              <Calendar className="w-5 h-5" />
              Bookings
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            {/* <div className="p-3 bg-accent rounded-lg mb-3">
              <p className="text-sm font-medium truncate">{ownerEmail}</p>
              <p className="text-xs text-muted-foreground">Hotel Owner</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
              <LogOut className="w-4 h-4" />
              Logout
            </button> */}
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
                href="/admin/rooms" 
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Edit Room</h1>
                <p className="text-sm text-muted-foreground mt-1">Update room information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-w-3xl">
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">Room updated successfully! Redirecting...</p>
            </div>
          )}

          {error && originalRoom && (
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
                    Room Type
                  </label>
                  <input
                    type="text"
                    id="roomType"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    placeholder="e.g., Deluxe Suite, Standard Room, Ocean View"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current value</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current value</p>
                </div>

                {/* Max Guests */}
                <div>
                  <label htmlFor="maxGuests" className="block text-sm font-medium mb-2">
                    Maximum Guests
                  </label>
                  <input
                    type="number"
                    id="maxGuests"
                    name="maxGuests"
                    min="1"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current value</p>
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                    Quantity (Number of Rooms)
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current value</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current value</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current value</p>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image URLs
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addImage()
                        }
                      }}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      {formData.images.map((image, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 p-2 border rounded-lg bg-accent/50"
                        >
                          <img 
                            src={image} 
                            alt={`Preview ${index + 1}`} 
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'
                            }}
                          />
                          <span className="flex-1 text-sm truncate">{image}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(image)}
                            className="p-2 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Current images will be replaced if you modify this field</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Current amenities will be replaced if you modify this field</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Updating Room..." : "Update Room"}
              </button>
              <Link
                href="/admin/rooms"
                className="px-6 py-3 border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
