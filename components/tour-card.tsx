import { MapPin, Calendar, TrendingDown } from "lucide-react"
import Link from "next/link"

interface TourCardProps {
  id: string
  name: string
  image: string
  duration: number
  price: number
  originalPrice?: number
  discount?: number
  destination: string
}

export function TourCard({ id, name, image, duration, price, originalPrice, discount, destination }: TourCardProps) {
  return (
    <Link href={`/tours/${id}`}>
      <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer animate-fadeInUp">
        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {discount && (
            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">{name}</h3>

          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{destination}</span>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{duration} days</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-primary">${price}</p>
                {originalPrice && <p className="text-sm text-muted-foreground line-through">${originalPrice}</p>}
              </div>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition text-sm font-semibold">
              Explore
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
