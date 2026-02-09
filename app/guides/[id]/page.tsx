"use client"

import { useState } from "react"
import { Star, Globe, Calendar, Heart, MessageCircle } from "lucide-react"

export default function GuideDetailPage({ params }: { params: { id: string } }) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const guide = {
    id: params.id,
    name: "Marco Rossi",
    image: "/male-tour-guide-professional-portrait.jpg",
    title: "Expert European Guide & Cultural Historian",
    location: "Rome, Italy",
    languages: ["Italian", "English", "French"],
    experience: 12,
    hourlyRate: 45,
    dailyRate: 280,
    rating: 4.9,
    reviews: 87,
    specialties: ["Historical tours", "Food experiences", "Art & museums", "Local culture"],
    bio: "With over 12 years of experience guiding travelers across Europe, Marco is passionate about sharing the rich history and culture of his homeland. His deep knowledge of Italian art, architecture, and local cuisine makes every tour an unforgettable experience.",
    availability: {
      "2025-01-15": true,
      "2025-01-20": true,
      "2025-01-25": false,
    },
  }

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Marco was absolutely incredible! His knowledge of Rome's history was amazing, and he made history come alive. Highly recommend!",
      date: "2 weeks ago",
    },
    {
      name: "Michael Chen",
      rating: 4.5,
      text: "Great guide with excellent English. Very knowledgeable about the city. A bit rushed on our itinerary but overall excellent.",
      date: "1 month ago",
    },
    {
      name: "Emma Wilson",
      rating: 5,
      text: "One of the best travel experiences! Marco's passion for his city is infectious. Can't wait to return and hire him again.",
      date: "2 months ago",
    },
  ]

  return (
    <div className="w-full bg-background">
      {/* Header Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Photo */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <div className="relative rounded-lg overflow-hidden h-80 mb-6">
                <img src={guide.image || "/placeholder.svg"} alt={guide.name} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full mb-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Guide
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-foreground mb-2">{guide.name}</h1>
            <p className="text-xl text-primary font-semibold mb-2">{guide.title}</p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-secondary text-secondary" />
                  <span className="font-bold text-lg text-foreground">{guide.rating}</span>
                </div>
                <span className="text-muted-foreground">({guide.reviews} reviews)</span>
              </div>
              <div className="text-muted-foreground text-sm">Based in {guide.location}</div>
            </div>

            {/* Bio */}
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">{guide.bio}</p>

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Experience</p>
                <p className="text-2xl font-bold text-primary">{guide.experience} years</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Tours Completed</p>
                <p className="text-2xl font-bold text-primary">{guide.reviews}+</p>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {guide.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-8">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {guide.languages.map((lang) => (
                  <span key={lang} className="bg-muted text-foreground px-3 py-1 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4 bg-card border border-border rounded-lg p-6">
              <div>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="text-3xl font-bold text-primary">${guide.hourlyRate}</p>
                <p className="text-xs text-muted-foreground">per hour</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Rate</p>
                <p className="text-3xl font-bold text-primary">${guide.dailyRate}</p>
                <p className="text-xs text-muted-foreground">per day</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="bg-muted/30 border-y border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Schedule a Tour</h2>
          <div className="bg-card border border-border rounded-lg p-8 max-w-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Tour Type</label>
                <select className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground">
                  <option>Hourly Tour</option>
                  <option>Full Day Tour</option>
                  <option>Multi-Day Tour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Number of People</label>
                <select className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Person" : "People"}
                    </option>
                  ))}
                </select>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Request Booking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-8">Traveler Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                <span className="text-xs text-muted-foreground">{testimonial.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(testimonial.rating) ? "fill-secondary text-secondary" : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-sm">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
