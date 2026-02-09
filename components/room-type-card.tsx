import { Users, Maximize2, Check } from "lucide-react"

interface RoomTypeCardProps {
  type: string
  description: string
  capacity: number
  size: number
  amenities: string[]
  price: number
  image: string
  available: boolean
}

export function RoomTypeCard({
  type,
  description,
  capacity,
  size,
  amenities,
  price,
  image,
  available,
}: RoomTypeCardProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img src={image || "/placeholder.svg"} alt={type} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">{type}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Capacity</p>
              <p className="font-semibold text-foreground">{capacity} Guests</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Size</p>
              <p className="font-semibold text-foreground">{size} m²</p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <p className="font-semibold text-foreground mb-3">Amenities</p>
          <div className="space-y-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price & Booking */}
        <div className="border-t border-border pt-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-3xl font-bold text-primary">${price}</p>
              <p className="text-xs text-muted-foreground">per night</p>
            </div>
          </div>
          <button
            disabled={!available}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              available
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {available ? "Book Now" : "Not Available"}
          </button>
        </div>
      </div>
    </div>
  )
}
