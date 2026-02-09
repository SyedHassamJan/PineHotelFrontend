"use client"

import { GuideCard } from "@/components/guide-card"
import { Search } from "lucide-react"
import { useState } from "react"

const ALL_GUIDES = [
  {
    id: "1",
    name: "Marco Rossi",
    image: "/male-tour-guide-professional-portrait.jpg",
    languages: ["Italian", "English", "French"],
    experience: 12,
    hourlyRate: 45,
    dailyRate: 280,
    rating: 4.9,
    reviews: 87,
  },
  {
    id: "2",
    name: "Amira Hassan",
    image: "/female-tour-guide-professional-portrait.jpg",
    languages: ["Arabic", "English", "German"],
    experience: 8,
    hourlyRate: 50,
    dailyRate: 300,
    rating: 4.8,
    reviews: 62,
  },
  {
    id: "3",
    name: "Yuki Tanaka",
    image: "/asian-tour-guide-professional-portrait.jpg",
    languages: ["Japanese", "English", "Mandarin"],
    experience: 10,
    hourlyRate: 55,
    dailyRate: 320,
    rating: 4.9,
    reviews: 78,
  },
  {
    id: "4",
    name: "Sophie Martin",
    image: "/european-tour-guide-professional-portrait.jpg",
    languages: ["French", "English", "Spanish"],
    experience: 7,
    hourlyRate: 40,
    dailyRate: 260,
    rating: 4.7,
    reviews: 54,
  },
  {
    id: "5",
    name: "James Wilson",
    image: "/male-tour-guide-professional-portrait.jpg",
    languages: ["English", "Spanish", "Portuguese"],
    experience: 9,
    hourlyRate: 48,
    dailyRate: 290,
    rating: 4.8,
    reviews: 71,
  },
  {
    id: "6",
    name: "Elena Rossi",
    image: "/female-tour-guide-professional-portrait.jpg",
    languages: ["Italian", "English", "German"],
    experience: 6,
    hourlyRate: 42,
    dailyRate: 270,
    rating: 4.6,
    reviews: 45,
  },
  {
    id: "7",
    name: "Chen Wei",
    image: "/asian-tour-guide-professional-portrait.jpg",
    languages: ["Mandarin", "English", "Cantonese"],
    experience: 11,
    hourlyRate: 52,
    dailyRate: 310,
    rating: 4.9,
    reviews: 95,
  },
  {
    id: "8",
    name: "Isabella Santos",
    image: "/female-tour-guide-professional-portrait.jpg",
    languages: ["Portuguese", "English", "Spanish"],
    experience: 5,
    hourlyRate: 38,
    dailyRate: 250,
    rating: 4.5,
    reviews: 38,
  },
]

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  const languages = ["English", "Spanish", "French", "Italian", "German", "Mandarin", "Japanese", "Arabic"]

  const filteredGuides = ALL_GUIDES.filter((guide) => {
    const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = !selectedLanguage || guide.languages.includes(selectedLanguage)
    return matchesSearch && matchesLanguage
  })

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <section className="bg-primary/5 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Meet Our Expert Guides</h1>
          <p className="text-lg text-muted-foreground">
            Connect with experienced local guides who know their destinations inside and out
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search guides by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-4">Filter by Language</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLanguage(null)}
              className={`px-4 py-2 rounded-full transition ${
                selectedLanguage === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              All Languages
            </button>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedLanguage === lang
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <p className="text-muted-foreground">Showing {filteredGuides.length} guides</p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="flex-shrink-0 w-80">
              <GuideCard {...guide} />
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No guides found matching your criteria.</p>
            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </div>
        )}
      </section>
    </div>
  )
}
