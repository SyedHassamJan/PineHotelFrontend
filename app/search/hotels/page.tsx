"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Star, MapPin, Heart, Users, Bed, DollarSign, Calendar, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

interface Amenity {
  id: string
  hotelId: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Room {
  roomId: string
  roomType: string
  description: string
  maxGuests: number
  quantityTotal: number
  quantityAvailable: number
  bedType: string
  roomFloor: string
  price: number
  images: string[]
  amenities: Amenity[]
}

interface Hotel {
  hotelId: string
  name: string
  description: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  images: string[]
  hotelRank: number
  numberOfRooms: number
  rooms: Room[]
}

interface SearchResponse {
  total: number
  data: Hotel[]
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<Hotel[]>([])
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null)
  
  // Booking State
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  
  // Get search params
  const city = searchParams.get("city")
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const guests = searchParams.get("guests")

  const [bookingData, setBookingData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    checkIn: checkIn || "",
    checkOut: checkOut || "",
    roomsBooked: 1
  })

  useEffect(() => {
    if (city && checkIn && checkOut) {
      fetchSearchResults()
    }
  }, [city, checkIn, checkOut, guests])

  const fetchSearchResults = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      let url = `${normalizedBaseUrl}api/search/hotels?city=${city}&checkIn=${checkIn}&checkOut=${checkOut}`
      if (guests) url += `&guests=${guests}`

      const response = await fetch(url)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setSearchResults(data.data)
      } else {
        console.error("Search failed")
      }
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleHotelExpansion = (hotelId: string) => {
    if (expandedHotel === hotelId) {
      setExpandedHotel(null)
    } else {
      setExpandedHotel(hotelId)
    }
  }

  const handleBookClick = (hotel: Hotel, room: Room) => {
    setSelectedHotel(hotel)
    setSelectedRoom(room)
    setBookingData(prev => ({ 
      ...prev, 
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      roomsBooked: 1 
    }))
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
    if (!selectedRoom || !selectedHotel) return

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

      // Use the correct IDs from the search response structure
      // Note: search response uses 'hotelId' and 'roomId'
      const payload = {
        hotelId: selectedHotel.hotelId, 
        roomId: selectedRoom.roomId,
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
        // Reset form but keep dates
        setBookingData(prev => ({
          ...prev,
          userName: "",
          userEmail: "",
          userPhone: "",
          roomsBooked: 1
        }))
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (searchResults.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No hotels found</h2>
        <p className="text-muted-foreground mb-8">Try adjusting your search criteria.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-muted-foreground mt-2">
            Found {searchResults.length} hotels in {city} for {checkIn} to {checkOut}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {searchResults.map((hotel) => (
          <div key={hotel.hotelId} className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Hotel Image */}
              <div className="relative h-64 md:h-auto">
                <img
                  src={hotel.images?.[0] || "/placeholder-hotel.jpg"}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 left-4 bg-background/90 p-2 rounded-full hover:bg-primary hover:text-white transition">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Hotel Info */}
              <div className="md:col-span-2 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-2xl font-bold">{hotel.name}</h2>
                      <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
                        {"⭐".repeat(hotel.hotelRank)}
                        <span className="text-muted-foreground ml-2">({hotel.hotelRank} Star Hotel)</span>
                      </div>
                    </div>
                    {hotel.rooms && hotel.rooms.length > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="text-2xl font-bold text-primary">
                          ${Math.min(...hotel.rooms.map(r => r.price))}
                        </p>
                        <p className="text-xs text-muted-foreground">per night</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                  </div>

                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {hotel.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-foreground/80 mb-6">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{hotel.numberOfRooms} Rooms</span>
                    </div>
                    {Object.keys(hotel.rooms?.[0]?.amenities || []).length > 0 && (
                       <div className="flex items-center gap-1">
                        <Info className="w-4 h-4" />
                        <span>Amenities available</span>
                       </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button 
                    onClick={() => toggleHotelExpansion(hotel.hotelId)}
                    variant={expandedHotel === hotel.hotelId ? "secondary" : "default"}
                  >
                    {expandedHotel === hotel.hotelId ? "Hide Rooms" : "View Available Rooms"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded Rooms List */}
            {expandedHotel === hotel.hotelId && (
              <div className="border-t border-border bg-muted/30 p-6 animate-fadeIn">
                <h3 className="text-xl font-bold mb-4">Available Rooms</h3>
                {hotel.rooms && hotel.rooms.length > 0 ? (
                  <div className="grid gap-6">
                     {hotel.rooms.map((room) => (
                       <Card key={room.roomId} className="bg-background overflow-hidden border-border/50">
                         <div className="grid md:grid-cols-4 gap-4">
                           <div className="h-48 md:h-auto relative">
                             <img 
                               src={room.images?.[0] || "/placeholder-room.jpg"} 
                               alt={room.roomType}
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="md:col-span-3 p-4 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-lg font-bold">{room.roomType}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">${room.price}</p>
                                    <p className="text-xs text-muted-foreground">per night</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span>Max {room.maxGuests} Guests</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Bed className="w-4 h-4 text-muted-foreground" />
                                    <span>{room.bedType}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span>{room.roomFloor}</span>
                                  </div>
                                </div>

                                {room.amenities && room.amenities.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    {room.amenities.map(amenity => (
                                      <Badge key={amenity.id} variant="secondary" className="text-xs font-normal">
                                        {amenity.name}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-end mt-4 pt-4 border-t border-border/50">
                                <Button onClick={() => handleBookClick(hotel, room)}>
                                  Book Now
                                </Button>
                              </div>
                           </div>
                         </div>
                       </Card>
                     ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No rooms available matching your criteria.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              You are booking <span className="font-semibold text-primary">{selectedRoom?.roomType}</span> at <span className="font-semibold text-primary">{selectedHotel?.name}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
             {/* Summary Section */}
             <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Check-in</p>
                    <p className="font-semibold">{bookingData.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Check-out</p>
                    <p className="font-semibold">{bookingData.checkOut}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price per night</p>
                    <p className="font-semibold">${selectedRoom?.price}</p>
                  </div>
                  <div>
                     <p className="text-muted-foreground">Total (approx)</p>
                     <p className="font-semibold text-primary">
                       ${selectedRoom?.price ? selectedRoom.price * Number(bookingData.roomsBooked) : 0} 
                       <span className="text-xs text-muted-foreground font-normal ml-1">x {
                         checkIn && checkOut 
                           ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
                           : 1
                       } nights</span>
                     </p>
                  </div>
               </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="checkIn">Check In</Label>
                <Input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  value={bookingData.checkIn}
                  onChange={handleInputChange}
                  readOnly // Dates come from search
                  className="bg-muted"
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
                  readOnly // Dates come from search
                  className="bg-muted"
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
                max={selectedRoom?.quantityAvailable || 5}
                value={bookingData.roomsBooked}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Max available: {selectedRoom?.quantityAvailable}
              </p>
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

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
