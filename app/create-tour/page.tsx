"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, Car, Truck, Zap, MapPin, Calendar } from "lucide-react"

export default function CreateTourPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    destination: "",
    days: 3,
    hotel: "",
    roomType: "",
    transport: "car",
    guide: false,
  })

  const destinations = ["Paris", "Tokyo", "Dubai", "New York", "Barcelona", "Bangkok", "Rome", "Barcelona"]
  const hotelOptions = ["Budget", "Comfort", "Luxury", "Premium"]
  const roomTypes = ["Standard", "Deluxe", "Suite", "Family Room"]
  const transportOptions = [
    { id: "car", name: "Car", icon: Car, price: 50 },
    { id: "van", name: "Van (7 seats)", icon: Truck, price: 80 },
    { id: "jeep", name: "Jeep", icon: Zap, price: 70 },
  ]

  // Pricing calculation
  const baseHotelPrices: { [key: string]: number } = {
    Budget: 100,
    Comfort: 180,
    Luxury: 350,
    Premium: 500,
  }

  const roomTypeMultipliers: { [key: string]: number } = {
    Standard: 1,
    Deluxe: 1.3,
    Suite: 1.7,
    "Family Room": 2.0,
  }

  const hotelPrice = baseHotelPrices[formData.hotel] || 0
  const roomMultiplier = roomTypeMultipliers[formData.roomType] || 1
  const transportPrice = transportOptions.find((t) => t.id === formData.transport)?.price || 50
  const guidePriceDaily = formData.guide ? 150 : 0

  const dailyHotelCost = Math.round(hotelPrice * roomMultiplier)
  const totalHotelCost = dailyHotelCost * (formData.days - 1)
  const totalTransportCost = transportPrice * formData.days
  const totalGuideCost = guidePriceDaily * formData.days
  const totalCost = totalHotelCost + totalTransportCost + totalGuideCost
  const costPerPerson = Math.round(totalCost / 2)

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <section className="bg-primary/5 border-b border-border py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Your Custom Tour</h1>
          <p className="text-lg text-muted-foreground">
            Build your perfect itinerary step by step and see the cost breakdown in real-time
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-8">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition ${
                        step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div
                    className={`h-1 bg-primary transition-all`}
                    style={{ width: `${(currentStep - 1) * 25}%` }}
                  ></div>
                  <div className="flex-1 h-1 bg-muted"></div>
                </div>
              </div>

              {/* Step 1: Destination */}
              {currentStep === 1 && (
                <div className="animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Select Your Destination</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {destinations.map((dest) => (
                      <button
                        key={dest}
                        onClick={() => setFormData({ ...formData, destination: dest })}
                        className={`p-4 rounded-lg border-2 transition ${
                          formData.destination === dest
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <MapPin className="w-5 h-5 mx-auto mb-2 text-primary" />
                        <p className="font-semibold text-foreground text-sm">{dest}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Duration */}
              {currentStep === 2 && (
                <div className="animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-foreground mb-6">How Many Days?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[3, 4, 5, 7, 10].map((days) => (
                      <button
                        key={days}
                        onClick={() => setFormData({ ...formData, days })}
                        className={`p-4 rounded-lg border-2 transition ${
                          formData.days === days
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
                        <p className="font-bold text-foreground">{days}</p>
                        <p className="text-xs text-muted-foreground">days</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Hotel */}
              {currentStep === 3 && (
                <div className="animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Select Hotel & Room Type</h2>
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-foreground mb-3">Hotel Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {hotelOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setFormData({ ...formData, hotel: option })}
                          className={`p-4 rounded-lg border-2 transition ${
                            formData.hotel === option
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <p className="font-semibold text-foreground">{option}</p>
                          <p className="text-xs text-muted-foreground mt-1">${baseHotelPrices[option]}/night</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">Room Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {roomTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, roomType: type })}
                          className={`p-4 rounded-lg border-2 transition ${
                            formData.roomType === type
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <p className="font-semibold text-foreground text-sm">{type}</p>
                          <p className="text-xs text-muted-foreground mt-1">x{roomTypeMultipliers[type]}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Transport */}
              {currentStep === 4 && (
                <div className="animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Choose Transportation</h2>
                  <div className="space-y-3">
                    {transportOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.id}
                          onClick={() => setFormData({ ...formData, transport: option.id })}
                          className={`w-full p-6 rounded-lg border-2 transition flex items-start gap-4 ${
                            formData.transport === option.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                          <div className="flex-1 text-left">
                            <p className="font-bold text-foreground">{option.name}</p>
                            <p className="text-sm text-muted-foreground">${option.price} per day</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total:</p>
                            <p className="font-bold text-primary">${option.price * formData.days}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Guide */}
              {currentStep === 5 && (
                <div className="animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Add a Guide (Optional)</h2>
                  <div className="space-y-4">
                    <label className="flex items-center p-6 border-2 border-border rounded-lg hover:border-primary/50 transition cursor-pointer">
                      <input
                        type="checkbox"
                        name="guide"
                        checked={formData.guide}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-foreground">Hire a Professional Tour Guide</p>
                        <p className="text-sm text-muted-foreground">
                          $150/day - Expert local knowledge & cultural insights
                        </p>
                      </div>
                      <p className="font-bold text-primary">${guidePriceDaily * formData.days}</p>
                    </label>

                    {formData.guide && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">
                          Our guides are hand-picked professionals with years of experience. They'll provide insights,
                          handle logistics, and make your journey unforgettable.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                    currentStep === 1 ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:bg-primary/10"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                {currentStep < 5 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition">
                    Submit Tour Request
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cost Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold text-foreground mb-6">Cost Summary</h3>

              {/* Destination & Duration */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-semibold text-foreground">{formData.destination || "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold text-foreground">{formData.days} days</span>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accommodation</span>
                  <span className="text-foreground">${totalHotelCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transportation</span>
                  <span className="text-foreground">${totalTransportCost}</span>
                </div>
                {formData.guide && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tour Guide</span>
                    <span className="text-foreground">${totalGuideCost}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-foreground">Total Cost</span>
                  <span className="text-3xl font-bold text-primary">${totalCost}</span>
                </div>
                <p className="text-xs text-muted-foreground">${costPerPerson} per person (2 people)</p>
              </div>

              {/* Info Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm text-muted-foreground mb-6">
                <p>
                  <span className="font-semibold text-foreground">Note:</span> Prices shown are estimates. Final pricing
                  depends on specific choices and market rates.
                </p>
              </div>

              {/* Selected Options */}
              <div className="space-y-2 text-sm">
                {formData.hotel && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-muted-foreground">{formData.hotel} Hotel</span>
                  </div>
                )}
                {formData.roomType && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-muted-foreground">{formData.roomType} Room</span>
                  </div>
                )}
                {formData.transport && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-muted-foreground">
                      {transportOptions.find((t) => t.id === formData.transport)?.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Preview (at bottom for desktop, visible on summary step) */}
      {currentStep === 5 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-muted/30 border-t border-border mt-12">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8">Your Generated Itinerary Preview</h2>
            <div className="space-y-4">
              {[...Array(formData.days)].map((_, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-2">Day {idx + 1}</h3>
                  <p className="text-muted-foreground text-sm">
                    {idx === 0
                      ? "Arrival & orientation"
                      : idx === formData.days - 1
                        ? "Departure & farewell"
                        : `Explore attractions & local experiences`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
