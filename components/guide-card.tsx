import { Star, Globe } from "lucide-react"
import Link from "next/link"

interface GuideCardProps {
  id: string
  name: string
  image: string
  languages: string[]
  experience: number
  hourlyRate: number
  dailyRate: number
  rating: number
  reviews: number
}

export function GuideCard({
  id,
  name,
  image,
  languages,
  experience,
  hourlyRate,
  dailyRate,
  rating,
  reviews,
}: GuideCardProps) {
  return (
    <Link href={`/guides/${id}`}>
      <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer animate-fadeInUp">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">{name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-semibold text-sm text-foreground">{rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground text-sm">({reviews})</span>
          </div>

          {/* Languages */}
          <div className="flex items-start gap-2 mb-3">
            <Globe className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {languages.map((lang) => (
                <span key={lang} className="text-xs bg-muted text-foreground px-2 py-1 rounded">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-semibold text-foreground">{experience}</span> years experience
          </p>

          {/* Pricing */}
          <div className="space-y-2 mb-4 pb-4 border-b border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Hourly Rate</span>
              <span className="text-sm font-semibold text-foreground">${hourlyRate}/hr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Daily Rate</span>
              <span className="text-sm font-semibold text-foreground">${dailyRate}/day</span>
            </div>
          </div>

          <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition text-sm font-semibold">
            Book Guide
          </button>
        </div>
      </div>
    </Link>
  )
}
