import { Globe } from "lucide-react"
import Link from "next/link"
import { GuideBookingModal } from "./guide-booking-modal"

interface GuideCardProps {
  id: string
  name: string
  image: string
  languages: string[]
  experience: number | string
  dailyRate: number | string
}

export function GuideCard({
  id,
  name,
  image,
  languages = [],
  experience,
  dailyRate,
}: GuideCardProps) {
  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>


        {/* Languages */}
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1.5">
            {languages.slice(0, 3).map((lang, idx) => (
              <span key={idx} className="text-[11px] bg-secondary/50 text-secondary-foreground font-medium px-2 py-0.5 rounded">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <p className="text-sm text-muted-foreground mb-6">
          {experience || 0} years experience
        </p>

        {/* Pricing */}
        <div className="space-y-2 mb-6 mt-auto">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Daily Rate</span>
            <span className="font-bold text-foreground">
              {dailyRate ? `$${dailyRate}/day` : 'N/A'}
            </span>
          </div>
        </div>

        <GuideBookingModal 
          guideId={id} 
          guideName={name}
          trigger={
            <button className="w-full bg-[#006951] text-white py-3 rounded-lg hover:bg-[#005a46] transition-colors text-sm font-bold">
              Book Guide
            </button>
          }
        />
      </div>
    </div>
  )
}
