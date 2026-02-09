"use client"

import { useState } from "react"
import { TourCard } from "@/components/tour-card"

const TOUR_PACKAGES = [
  {
    id: "1",
    name: "Alpine Adventure 7 Days",
    image: "/alpine-mountains-hiking-adventure.jpg",
    destination: "Switzerland",
    duration: 7,
    price: 1299,
    originalPrice: 1599,
    discount: 18,
  },
  {
    id: "2",
    name: "Mediterranean Cruise",
    image: "/mediterranean-sea-cruise-luxury-yacht.jpg",
    destination: "Greece",
    duration: 10,
    price: 1899,
    originalPrice: 2299,
    discount: 17,
  },
  {
    id: "3",
    name: "Safari Expedition",
    image: "/african-safari-wildlife-animals.jpg",
    destination: "Kenya",
    duration: 5,
    price: 1599,
    discount: 15,
  },
  {
    id: "4",
    name: "Japanese Cultural Journey",
    image: "/japan-temple-culture-architecture.jpg",
    destination: "Japan",
    duration: 8,
    price: 1799,
  },
  {
    id: "5",
    name: "Paris City Explorer",
    image: "/eiffel-tower-paris-city.jpg",
    destination: "France",
    duration: 4,
    price: 899,
    originalPrice: 1099,
    discount: 18,
  },
  {
    id: "6",
    name: "Thai Island Retreat",
    image: "/placeholder.svg",
    destination: "Thailand",
    duration: 6,
    price: 1199,
  },
  {
    id: "7",
    name: "Egyptian Wonders",
    image: "/placeholder.svg",
    destination: "Egypt",
    duration: 5,
    price: 1399,
  },
  {
    id: "8",
    name: "Iceland Northern Lights",
    image: "/placeholder.svg",
    destination: "Iceland",
    duration: 4,
    price: 1599,
    discount: 10,
  },
]

export default function ToursPage() {
  const [activeTab, setActiveTab] = useState("packages")

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <section className="bg-primary/5 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Explore Our Tours</h1>
          <p className="text-lg text-muted-foreground">
            Discover expertly curated travel experiences designed for adventurers and culture enthusiasts
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-border">
        <div className="flex gap-8">
          {["packages", "custom"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-2 font-semibold capitalize transition ${
                activeTab === tab
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "packages" ? "Our Tour Packages" : "Create Your Own Tour"}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === "packages" && (
          <div>
            <div className="mb-8">
              <p className="text-muted-foreground">Showing {TOUR_PACKAGES.length} tour packages</p>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {TOUR_PACKAGES.map((tour) => (
                <div key={tour.id} className="flex-shrink-0 w-96">
                  <TourCard {...tour} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "custom" && (
          <div className="bg-card border border-border rounded-lg p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Build Your Custom Tour</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find the perfect itinerary? Let's create one together! Choose your destination, duration, and
              preferences.
            </p>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
              Start Building
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
