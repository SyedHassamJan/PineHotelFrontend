"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Users, Globe, Award, Heart, Target, Compass, Sparkles, TrendingUp, Shield, Zap } from "lucide-react"

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const values = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting travelers and providers across 150+ countries worldwide",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a trusted community of travelers and local experts",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Rigorous vetting process for all properties, guides, and experiences",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Heart,
      title: "Sustainability",
      description: "Promoting responsible travel that benefits local communities",
      color: "from-green-500 to-emerald-500"
    },
  ]

  const stats = [
    { value: "2.5M+", label: "Travelers Served", icon: Users },
    { value: "50K+", label: "Properties Listed", icon: Globe },
    { value: "10K+", label: "Expert Guides", icon: Compass },
    { value: "150+", label: "Countries", icon: Target },
  ]

  const features = [
    {
      icon: Shield,
      title: "Trusted Platform",
      description: "Secure bookings and verified listings"
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Quick and seamless reservation process"
    },
    {
      icon: TrendingUp,
      title: "Best Value",
      description: "Competitive pricing and exclusive deals"
    },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* <Navbar />   */}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite]"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-[float_25s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute bottom-40 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-[float_30s_ease-in-out_infinite]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 border-b border-border py-24 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 animate-[shimmer_8s_ease-in-out_infinite]"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-[slideDown_0.6s_ease-out]">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">Established 2020</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-6 animate-[fadeInUp_0.8s_ease-out]">
            About TravelHub
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            Transforming the way people discover, book, and experience travel globally
          </p>
          
          {/* Decorative elements */}
          <div className="flex justify-center gap-4 mt-12 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
            {features.map((feature, index) => (
              <div key={feature.title} className="hidden md:flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-full shadow-lg" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 animate-[slideInLeft_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Our Journey</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Crafting Unforgettable <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Travel Experiences</span>
            </h2>
            
            <div className="space-y-5">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2020, TravelHub was born from a simple yet powerful belief: <span className="font-semibold text-foreground">everyone deserves amazing travel experiences</span>. Our founders traveled extensively and realized there was a gap in the market for a platform that seamlessly connects quality accommodations, curated experiences, and expert local guides.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we're proud to serve <span className="font-semibold text-primary">millions of travelers</span> and have partnered with thousands of properties and guides across the globe. Our mission remains unchanged: to inspire and enable travel that creates meaningful memories.
              </p>
              
              <div className="flex gap-4 pt-4">
                <div className="flex-1 bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary mb-1">4.9/5</p>
                  <p className="text-sm text-muted-foreground">Customer Rating</p>
                </div>
                <div className="flex-1 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                  <p className="text-2xl font-bold text-green-600 mb-1">98%</p>
                  <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 animate-[slideInRight_0.8s_ease-out]">
            <div className="relative group">
              {/* Main image container - Travel Collage */}
              <div className="relative rounded-2xl h-[500px] overflow-hidden shadow-2xl">
                {/* Grid of travel images */}
                <div className="grid grid-cols-2 gap-3 h-full p-3 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm">
                  {/* Top Left - Hotel */}
                  <div className="relative rounded-xl overflow-hidden group/img">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent z-10"></div>
                    <img 
                      src="/luxury-5-star-hotel.jpg" 
                      alt="Luxury Hotels"
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-3 left-3 z-20">
                      <div className="bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                        <p className="text-xs font-bold text-primary">Premium Hotels</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Top Right - Tours */}
                  <div className="relative rounded-xl overflow-hidden group/img">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-transparent z-10"></div>
                    <img 
                      src="/adventure-tour-mountains.jpg" 
                      alt="Adventure Tours"
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-3 left-3 z-20">
                      <div className="bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                        <p className="text-xs font-bold text-purple-500">Curated Tours</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Left - Guides */}
                  <div className="relative rounded-xl overflow-hidden group/img">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent z-10"></div>
                    <img 
                      src="/male-tour-guide-professional-portrait.jpg" 
                      alt="Expert Guides"
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-3 left-3 z-20">
                      <div className="bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                        <p className="text-xs font-bold text-blue-500">Expert Guides</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Right - Destinations */}
                  <div className="relative rounded-xl overflow-hidden group/img">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-transparent z-10"></div>
                    <img 
                      src="/hunza-valley-mountains-pakistan.jpg" 
                      alt="Destinations"
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-3 left-3 z-20">
                      <div className="bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
                        <p className="text-xs font-bold text-orange-500">150+ Countries</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Center badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="bg-card/95 backdrop-blur-md border-2 border-primary/50 rounded-2xl p-6 shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                    <div className="text-center">
                      <Globe className="w-12 h-12 text-primary mx-auto mb-2 animate-pulse" />
                      <p className="text-sm font-bold text-foreground">Worldwide</p>
                      <p className="text-xs text-muted-foreground">Coverage</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating stats */}
                <div className="absolute top-6 right-6 bg-card/90 backdrop-blur-md border border-border rounded-xl p-4 shadow-xl animate-[float_3s_ease-in-out_infinite] z-20">
                  <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                  <p className="text-xl font-bold text-primary">2.5M+</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-[fadeInUp_0.6s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-primary animate-bounce" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Growing Strong</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-4">Milestones That Matter</h2>
          <p className="text-lg text-muted-foreground">Join our thriving community of travelers and partners worldwide</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="group relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border hover:border-primary/50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 animate-[scaleIn_0.6s_ease-out_both]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-500"></div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                
                <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="relative bg-gradient-to-b from-muted/30 to-transparent py-20 border-y border-border overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:64px_64px] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-[fadeInUp_0.6s_ease-out]">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Heart className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">What We Stand For</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, description, color }, index) => (
              <div 
                key={title} 
                className="group relative bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border hover:border-primary/50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 animate-[fadeInUp_0.6s_ease-out_both]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                <div className="relative">
                  <div className="flex justify-center mb-6">
                    <div className={`relative bg-gradient-to-br ${color} p-1 rounded-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                      <div className="bg-card p-4 rounded-xl">
                        <Icon className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-300 rounded-tr-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="relative group animate-[slideInLeft_0.8s_ease-out]">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-card to-card/80 border border-border rounded-2xl p-10 shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To empower travelers worldwide with seamless access to authentic experiences, quality accommodations, and expert local guidance, making every journey memorable and hassle-free.
              </p>
            </div>
          </div>

          <div className="relative group animate-[slideInRight_0.8s_ease-out]">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-card to-card/80 border border-border rounded-2xl p-10 shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mb-6">
                <Compass className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To become the world's most trusted travel platform, connecting cultures and communities while promoting sustainable tourism that benefits both travelers and local economies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
