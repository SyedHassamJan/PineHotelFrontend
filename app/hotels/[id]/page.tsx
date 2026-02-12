"use client"

import { useState, useEffect, use } from "react"
import { Star, MapPin, Phone, Mail, Calendar, Bed, Users, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import Image from "next/image"

interface Amenity {
  id: string
  hotelId: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Room {
  id: string
  hotelId: string
  roomType: string
  description: string
  maxGuests: number
  quantity: number
  bedType: string
  roomFloor?: string
  price: string
  images: string[]
  amenities: Amenity[]
  createdAt: string
  updatedAt: string
}

interface Hotel {
  id: string
  name: string
  email: string
  phone: string
  city: string
  country: string
  address: string
  description?: string
  status: string
  images?: string[]
  hotelRank?: number
  numberOfRooms?: number
}

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const hotelId = unwrappedParams.id
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("photos")
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  // Booking State
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    checkIn: "",
    checkOut: "",
    roomsBooked: 1
  })

  const handleBookClick = (room: Room) => {
    setSelectedRoom(room)
    setBookingData(prev => ({ ...prev, roomsBooked: 1 }))
    setIsBookingOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBookingSubmit = async () => {
    if (!selectedRoom || !hotel) return

    // Validate all fields are filled
    if (
      !bookingData.userName || 
      !bookingData.userEmail || 
      !bookingData.userPhone || 
      !bookingData.checkIn || 
      !bookingData.checkOut || 
      !bookingData.roomsBooked
    ) {
      toast.error("Validation Error", {
        description: "All fields are required. Please fill in all details.",
      })
      return
    }

    setBookingLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      const url = `${normalizedBaseUrl}api/bookings`

      const payload = {
        hotelId: hotel.id,
        roomId: selectedRoom.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        roomsBooked: Number(bookingData.roomsBooked),
        userName: bookingData.userName,
        userEmail: bookingData.userEmail,
        userPhone: bookingData.userPhone
      }

      console.log("Submitting booking:", payload)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Booking successful!", {
          description: "Your room has been booked successfully.",
        })
        setIsBookingOpen(false)
        // Reset form
        setBookingData({
          userName: "",
          userEmail: "",
          userPhone: "",
          checkIn: "",
          checkOut: "",
          roomsBooked: 1
        })
      } else {
        toast.error("Booking failed", {
          description: data.message || "Could not complete your booking.",
        })
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast.error("Network error", {
        description: "Failed to connect to server.",
      })
    } finally {
      setBookingLoading(false)
    }
  }

  useEffect(() => {
    fetchHotelData()
    fetchRooms()
  }, [hotelId])

  const fetchHotelData = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const response = await fetch(`${baseUrl}api/hotels`)
      if (!response.ok) throw new Error('Failed to fetch hotels')
      const data: Hotel[] = await response.json()
      const hotelData = data.find(h => h.id === hotelId)
      if (hotelData) {
        setHotel(hotelData)
      }
    } catch (error) {
      console.error('Error fetching hotel:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const response = await fetch(`${baseUrl}api/rooms/hotels/${hotelId}/rooms`)
      if (!response.ok) throw new Error('Failed to fetch rooms')
      const data: Room[] = await response.json()
      setRooms(data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoadingRooms(false)
    }
  }

  const getLowestPrice = () => {
    if (!rooms || rooms.length === 0) return 0
    const prices = rooms
      .map(r => Number(r.price))
      .filter(p => !isNaN(p) && p > 0)
    if (prices.length === 0) return 0
    return Math.min(...prices)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-96 bg-muted/50 rounded-lg animate-pulse mb-8" />
          <div className="grid gap-6">
            <div className="h-48 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-48 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Hotel Not Found</h1>
          <p className="text-muted-foreground mb-8">The hotel you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/hotels')}>Back to Hotels</Button>
        </div>
      </div>
    )
  }

  const hotelImages = hotel.images && hotel.images.length > 0 ? hotel.images : ['/placeholder-hotel.jpg']
  const lowestPrice = getLowestPrice()

  return (
    <div className="w-full bg-background">
      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fadeInUp">
          {/* Main Image */}
          <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-border hover:border-primary/50 transition-all duration-500">
            <Image
              src={hotelImages[selectedImage] || '/placeholder-hotel.jpg'}
              alt={hotel.name}
              width={800}
              height={600}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder-hotel.jpg'
              }}
            />
          </div>
          
          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 gap-4">
            {hotelImages.slice(0, 4).map((image, idx) => (
              <div 
                key={idx} 
                className={`h-44 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border-2 shadow-lg hover:shadow-2xl transform hover:scale-105 ${
                  selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'
                }`}
                onClick={() => setSelectedImage(idx)}
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <Image
                  src={image || '/placeholder-hotel.jpg'}
                  alt={`Gallery ${idx}`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-hotel.jpg'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hotel Info */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">{hotel.name}</h1>
              <Badge variant={hotel.status === 'approved' ? 'default' : 'secondary'}>
                {hotel.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-5 h-5" />
              <span>{hotel.address}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{hotel.city}, {hotel.country}</span>
            </div>
          </div>
          
          {/* Price Card */}
          <Card className="w-full lg:w-80 shadow-2xl border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-primary/10">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
              <CardTitle className="text-lg">Starting From</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">${lowestPrice.toFixed(2)}</span>
                <span className="text-muted-foreground">/night</span>
              </div>
              <Button className="w-full shadow-lg hover:shadow-xl" disabled={lowestPrice === 0}>
                <Calendar className="w-4 h-4 mr-2" />
                Check Availability
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
          <div className="flex gap-8">
            {["photos", "details", "rooms"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold capitalize transition-all duration-300 ${
                  activeTab === tab
                    ? "border-b-2 border-primary text-foreground scale-105"
                    : "text-muted-foreground hover:text-foreground hover:scale-105"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "photos" && (
          <div className="mb-16 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-foreground mb-8">Hotel Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hotelImages.map((image, idx) => (
                <div 
                  key={idx} 
                  className="h-56 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 border border-border hover:border-primary/50 transform hover:scale-105 animate-fadeInUp"
                  onClick={() => setSelectedImage(idx)}
                  style={{animationDelay: `${idx * 0.05}s`}}
                >
                  <Image
                    src={image || '/placeholder-hotel.jpg'}
                    alt={`Photo ${idx + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-125 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-hotel.jpg'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="mb-16 animate-fadeInUp">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg hover:shadow-2xl transition-all duration-500 border-border hover:border-primary/30 transform hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardTitle className="text-xl">About This Hotel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {hotel.description || 'No description available for this hotel.'}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-2xl transition-all duration-500 border-border hover:border-primary/30 transform hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{hotel.phone}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground break-all">{hotel.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {hotel.address}<br />
                        {hotel.city}, {hotel.country}
                      </p>
                    </div>
                  </div>
                  {hotel.hotelRank && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Star className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Hotel Rank</p>
                          <p className="text-sm text-muted-foreground">{'⭐'.repeat(hotel.hotelRank)}</p>
                        </div>
                      </div>
                    </>
                  )}
                  {hotel.numberOfRooms && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Bed className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Total Rooms</p>
                          <p className="text-sm text-muted-foreground">{hotel.numberOfRooms}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="mb-16 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-foreground mb-8">Available Rooms</h2>
            {loadingRooms ? (
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid gap-6">
                {rooms.map((room, index) => (
                  <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-border hover:border-primary/30 transform hover:-translate-y-2 animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Room Image */}
                      <div className="relative h-48 md:h-full overflow-hidden group/img">
                        <Image
                          src={room.images?.[0] || '/placeholder-room.jpg'}
                          alt={room.roomType}
                          fill
                          className="object-cover group-hover/img:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder-room.jpg'
                          }}
                        />
                      </div>
                      
                      {/* Room Details */}
                      <div className="md:col-span-2 p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold">{room.roomType}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {room.description || 'Comfortable and well-equipped room'}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-primary">
                              ${(Number(room.price) || 0).toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">per night</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{room.maxGuests} guests</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Bed className="h-4 w-4" />
                            <span>{room.bedType}</span>
                          </div>
                          {room.roomFloor && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>Floor {room.roomFloor}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>{room.quantity} rooms available</span>
                          </div>
                        </div>

                        {room.amenities && room.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {room.amenities.map((amenity) => (
                              <Badge key={amenity.id} variant="outline">
                                {amenity.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Button 
                          className="w-full md:w-auto shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                          disabled={!room.price || Number(room.price) === 0}
                          onClick={() => handleBookClick(room)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No rooms available at this hotel yet.
              </p>
            )}
          </div>
        )}
      </section>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book {selectedRoom?.roomType}</DialogTitle>
            <DialogDescription>
              Enter your details to confirm your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userName">Full Name</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={bookingData.userName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  value={bookingData.userEmail}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="userPhone">Phone Number</Label>
              <Input
                id="userPhone"
                name="userPhone"
                value={bookingData.userPhone}
                onChange={handleInputChange}
                placeholder="+1234567890"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="checkIn">Check In</Label>
                <Input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  value={bookingData.checkIn}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkOut">Check Out</Label>
                <Input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  value={bookingData.checkOut}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="roomsBooked">Number of Rooms</Label>
              <Input
                id="roomsBooked"
                name="roomsBooked"
                type="number"
                min="1"
                max={selectedRoom?.quantity || 5}
                value={bookingData.roomsBooked}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookingSubmit} disabled={bookingLoading}>
              {bookingLoading ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
