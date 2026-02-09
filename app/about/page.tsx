import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Users, Globe, Award, Heart } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting travelers and providers across 150+ countries worldwide",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a trusted community of travelers and local experts",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Rigorous vetting process for all properties, guides, and experiences",
    },
    {
      icon: Heart,
      title: "Sustainability",
      description: "Promoting responsible travel that benefits local communities",
    },
  ]

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="bg-primary/10 border-b border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">About TravelHub</h1>
          <p className="text-xl text-muted-foreground">
            Transforming the way people discover, book, and experience travel globally
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Founded in 2020, TravelHub was born from a simple belief: everyone deserves amazing travel experiences.
              Our founders traveled extensively and realized there was a gap in the market for a platform that
              seamlessly connects quality accommodations, curated experiences, and expert local guides.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we're proud to serve millions of travelers and have partnered with thousands of properties and
              guides across the globe. Our mission remains unchanged: to inspire and enable travel that creates
              meaningful memories.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg h-80"></div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-primary mb-2">2.5M+</p>
            <p className="text-muted-foreground">Travelers Served</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">50K+</p>
            <p className="text-muted-foreground">Properties Listed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">10K+</p>
            <p className="text-muted-foreground">Expert Guides</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">150+</p>
            <p className="text-muted-foreground">Countries</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
