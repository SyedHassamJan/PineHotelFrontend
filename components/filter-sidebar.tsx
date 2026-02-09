"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["price"])
  const [filters, setFilters] = useState({
    location: "",
    priceMin: 0,
    priceMax: 500,
    rating: 0,
    roomType: "",
  })

  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters })
    onFilterChange({ ...filters, ...newFilters })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
      <h2 className="text-xl font-bold text-foreground mb-6">Filters</h2>

      {/* Location */}
      <div className="mb-6 border-b border-border pb-6">
        <button className="flex items-center justify-between w-full mb-3" onClick={() => toggleFilter("location")}>
          <h3 className="font-semibold text-foreground">Location</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedFilters.includes("location") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedFilters.includes("location") && (
          <div className="space-y-2">
            {["Paris", "Tokyo", "Dubai", "New York", "Barcelona"].map((location) => (
              <label key={location} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  onChange={(e) => handleFilterChange({ location: e.target.checked ? location : "" })}
                />
                <span className="text-muted-foreground">{location}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6 border-b border-border pb-6">
        <button className="flex items-center justify-between w-full mb-3" onClick={() => toggleFilter("price")}>
          <h3 className="font-semibold text-foreground">Price Range</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedFilters.includes("price") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedFilters.includes("price") && (
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="500"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange({ priceMax: Number.parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.priceMin}</span>
              <span>${filters.priceMax}</span>
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6 border-b border-border pb-6">
        <button className="flex items-center justify-between w-full mb-3" onClick={() => toggleFilter("rating")}>
          <h3 className="font-semibold text-foreground">Rating</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedFilters.includes("rating") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedFilters.includes("rating") && (
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => handleFilterChange({ rating: e.target.checked ? rating : 0 })}
                />
                <span className="text-muted-foreground">{rating}+ ⭐</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Room Type */}
      <div>
        <button className="flex items-center justify-between w-full mb-3" onClick={() => toggleFilter("roomType")}>
          <h3 className="font-semibold text-foreground">Room Type</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedFilters.includes("roomType") ? "rotate-180" : ""}`}
          />
        </button>
        {expandedFilters.includes("roomType") && (
          <div className="space-y-2">
            {["Deluxe", "Standard", "Family Suite", "Studio"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => handleFilterChange({ roomType: e.target.checked ? type : "" })}
                />
                <span className="text-muted-foreground">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
