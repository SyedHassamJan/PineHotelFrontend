import { Star, MapPin, Heart } from "lucide-react"
import Link from "next/link"

interface HotelCardProps {
  id: string
  name: string
  image: string
  location: string
  price: number
  rating: number
  reviews: number
  isFeatured?: boolean
}

export function HotelCard({ id, name, image, location, price, rating, reviews, isFeatured }: HotelCardProps) {
  return (
    <Link href={`/hotels/${id}`}>
      <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer animate-fadeInUp">
        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {isFeatured && (
            <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}
          <button className="absolute top-4 left-4 bg-background/90 hover:bg-primary hover:text-primary-foreground p-2 rounded-lg transition">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">{name}</h3>

          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground text-sm">({reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-2xl font-bold text-primary">${price}</p>
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition text-sm font-semibold">
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
