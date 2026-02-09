"use client"

import { useState } from "react"
import { Clock, MapPin, CheckCircle, CloverIcon as CloseIcon, Calendar } from "lucide-react"

export default function TourDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("itinerary")

  const tour = {
    id: params.id,
    name: "Alpine Adventure 7 Days",
    destination: "Switzerland",
    image: "/alpine-mountains-hiking-adventure.jpg",
    duration: 7,
    price: 1299,
    originalPrice: 1599,
    discount: 18,
    rating: 4.8,
    reviews: 342,
    description:
      "Experience the majesty of the Swiss Alps on this unforgettable 7-day adventure. Hike through pristine valleys, stay in charming mountain villages, and witness some of Europe's most spectacular landscapes.",
    groupSize: "12-20 travelers",
    difficulty: "Moderate",
    bestTime: "June - September",
  }

  const itinerary = [
    {
      day: 1,
      title: "Arrival in Zurich & Valley Exploration",
      description:
        "Arrive in Zurich and transfer to your hotel in the beautiful Interlaken valley. Enjoy an orientation dinner with your guide.",
      activities: ["Welcome dinner", "Hotel orientation", "Rest and acclimatize"],
      meals: ["Dinner"],
    },
    {
      day: 2,
      title: "Jungfraujoch - Top of Europe",
      description: "Visit the highest railway station in Europe with breathtaking views of the Aletsch Glacier.",
      activities: ["Train to Jungfraujoch", "Guided mountain walk", "Ice palace visit"],
      meals: ["Breakfast", "Lunch", "Dinner"],
    },
    {
      day: 3,
      title: "Grindelwald & First Mountain",
      description: "Hike from First down to Bachalpsee, offering stunning reflections of the mountain peaks.",
      activities: ["Cable car to First", "Scenic hiking", "Alpine lake visit"],
      meals: ["Breakfast", "Lunch", "Dinner"],
    },
    {
      day: 4,
      title: "Schilthorn & Piz Gloria",
      description: "Journey to the famous Schilthorn peak known for its panoramic views and James Bond connections.",
      activities: ["Scenic cable car", "Summit exploration", "Revolving restaurant"],
      meals: ["Breakfast", "Lunch", "Dinner"],
    },
  ]

  const inclusions = [
    "6 nights accommodation in 4-star hotels",
    "Daily breakfast and dinner",
    "All mountain transportation",
    "Professional English-speaking guide",
    "Insurance and emergency coverage",
    "Welcome & farewell dinners",
  ]

  const exclusions = [
    "International flights",
    "Travel insurance (optional)",
    "Personal expenses",
    "Tips and gratuities",
  ]

  const gallery = ["/alpine-mountains-hiking-adventure.jpg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]

  return (
    <div className="w-full bg-background">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img src={tour.image || "/placeholder.svg"} alt={tour.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent flex items-end p-8">
          <div className="text-primary-foreground">
            <h1 className="text-4xl font-bold mb-2">{tour.name}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{tour.duration} Days</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{tour.destination}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Info & Booking */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">About This Tour</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">{tour.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Group Size</p>
                  <p className="font-semibold text-foreground">{tour.groupSize}</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="font-semibold text-foreground">{tour.difficulty}</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Best Time</p>
                  <p className="font-semibold text-foreground">{tour.bestTime}</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Price per Person</p>
                  <p className="font-semibold text-primary">${tour.price}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-8">
              <div className="flex gap-8">
                {["itinerary", "gallery", "inclusions", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 font-semibold capitalize transition ${
                      activeTab === tab
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "itinerary" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground mb-6">Day-by-Day Itinerary</h3>
                {itinerary.map((item) => (
                  <div key={item.day} className="border border-border rounded-lg p-6">
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      Day {item.day}: {item.title}
                    </h4>
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Activities</p>
                        <ul className="space-y-1">
                          {item.activities.map((activity, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Meals Included</p>
                        <ul className="space-y-1">
                          {item.meals.map((meal, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              ✓ {meal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((image, idx) => (
                  <div key={idx} className="h-48 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "inclusions" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Included
                  </h4>
                  <ul className="space-y-3">
                    {inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <CloseIcon className="w-5 h-5 text-destructive" />
                    Not Included
                  </h4>
                  <ul className="space-y-3">
                    {exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CloseIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="bg-muted rounded-lg p-6">
                  <p className="text-sm text-muted-foreground mb-1">Overall Rating</p>
                  <div className="flex items-end gap-3">
                    <p className="text-4xl font-bold text-primary">{tour.rating}</p>
                    <p className="text-muted-foreground pb-1">Based on {tour.reviews} reviews</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">From</p>
                <div className="flex items-center gap-2">
                  <p className="text-4xl font-bold text-primary">${tour.price}</p>
                  {tour.originalPrice && (
                    <p className="text-lg text-muted-foreground line-through">${tour.originalPrice}</p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">per person</p>
                {tour.discount && (
                  <div className="mt-2 bg-destructive/10 text-destructive px-3 py-1 rounded text-sm font-semibold">
                    Save {tour.discount}%
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Start Date</label>
                  <input type="date" className="w-full border border-border rounded-lg px-3 py-2 text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Number of People</label>
                  <select className="w-full border border-border rounded-lg px-3 py-2 text-foreground">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Person" : "People"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2 mb-4">
                <Calendar className="w-5 h-5" />
                Book Tour
              </button>

              <button className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
