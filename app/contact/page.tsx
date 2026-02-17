"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Send, Loader, MessageCircle, Clock, CheckCircle2, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setShowSuccess(true)
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <div className="relative overflow-hidden">
      {/* <Navbar />  */}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite]"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-[float_25s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-[float_30s_ease-in-out_infinite]"></div>
      </div>

      {/* Hero Section with Gradient */}
      <section className="relative bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 border-b border-border py-20 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 animate-[shimmer_8s_ease-in-out_infinite]"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-[slideDown_0.6s_ease-out]">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">We're here to help</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-6 animate-[fadeInUp_0.8s_ease-out]">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            Have a question or ready to start your next adventure? We'd love to hear from you. Our team responds within 24 hours.
          </p>
          
          {/* Floating icons */}
          <div className="flex justify-center gap-8 mt-10">
            <div className="animate-[float_3s_ease-in-out_infinite]">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="animate-[float_3s_ease-in-out_infinite_0.5s]">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                <Mail className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="animate-[float_3s_ease-in-out_infinite_1s]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <Phone className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email Card */}
            <div className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border hover:border-primary/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-[slideInLeft_0.6s_ease-out]">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Mail className="w-7 h-7 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">Email Us</h3>
                  <p className="text-muted-foreground text-sm mb-2">Our support team is ready to help</p>
                  <a href="mailto:support@travelhub.com" className="text-primary font-semibold hover:underline">
                    support@travelhub.com
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border hover:border-purple-500/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-[slideInLeft_0.6s_ease-out_0.1s_both]">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-purple-500 transition-colors">Call Us</h3>
                  <p className="text-muted-foreground text-sm mb-2">Mon-Fri from 8am to 6pm</p>
                  <a href="tel:+15551234567" className="text-purple-500 font-semibold hover:underline">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="group bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border hover:border-blue-500/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-[slideInLeft_0.6s_ease-out_0.2s_both]">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-blue-500 transition-colors">Visit Us</h3>
                  <p className="text-muted-foreground text-sm mb-2">Come say hello at our office</p>
                  <p className="text-blue-500 font-semibold">123 Travel Street, City, Country</p>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 animate-[slideInLeft_0.6s_ease-out_0.3s_both]">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">Quick Response</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                We typically respond within <span className="font-bold text-primary">24 hours</span> on business days.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 relative animate-[slideInRight_0.6s_ease-out]">
            {/* Success Message */}
            {showSuccess && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm rounded-2xl animate-[scaleIn_0.5s_ease-out]">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 animate-[scaleIn_0.8s_ease-out]">
                    <CheckCircle2 className="w-10 h-10 text-green-500 animate-[scaleIn_0.8s_ease-out_0.2s_both]" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">Message Sent!</h3>
                  <p className="text-muted-foreground animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
                    We'll get back to you soon.
                  </p>
                </div>
              </div>
            )}

            <div className="relative bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Send us a Message</h2>
                  <p className="text-muted-foreground">Fill out the form below and we'll get back to you shortly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-bold text-foreground mb-3">
                        Your Name <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-5 py-3.5 border-2 border-border rounded-xl bg-background/50 text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all duration-300 placeholder:text-muted-foreground/50"
                          placeholder="John Doe"
                        />
                        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 ${focusedField === 'name' ? 'w-full' : 'w-0'}`}></div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-foreground mb-3">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-5 py-3.5 border-2 border-border rounded-xl bg-background/50 text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all duration-300 placeholder:text-muted-foreground/50"
                          placeholder="john@example.com"
                        />
                        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 ${focusedField === 'email' ? 'w-full' : 'w-0'}`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-bold text-foreground mb-3">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-5 py-3.5 border-2 border-border rounded-xl bg-background/50 text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all duration-300 placeholder:text-muted-foreground/50"
                          placeholder="+1 (555) 000-0000"
                        />
                        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 ${focusedField === 'phone' ? 'w-full' : 'w-0'}`}></div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-foreground mb-3">
                        Subject <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('subject')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-5 py-3.5 border-2 border-border rounded-xl bg-background/50 text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all duration-300 placeholder:text-muted-foreground/50"
                          placeholder="How can we help?"
                        />
                        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 ${focusedField === 'subject' ? 'w-full' : 'w-0'}`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-foreground mb-3">
                      Your Message <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        rows={6}
                        className="w-full px-5 py-3.5 border-2 border-border rounded-xl bg-background/50 text-foreground focus:outline-none focus:border-primary focus:bg-background transition-all duration-300 resize-none placeholder:text-muted-foreground/50"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 ${focusedField === 'message' ? 'w-full' : 'w-0'}`}></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full bg-gradient-to-r from-primary via-primary to-purple-600 text-primary-foreground py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-primary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <span className="relative flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <Loader className="w-6 h-6 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          Send Message
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section with Modern Design */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10"></div>
          <div className="relative bg-gradient-to-br from-muted/50 to-muted h-96 md:h-[500px] flex flex-col items-center justify-center backdrop-blur-sm border border-border">
            <MapPin className="w-16 h-16 text-primary mb-4 animate-bounce" />
            <p className="text-xl font-semibold text-foreground mb-2">Interactive Map</p>
            <p className="text-muted-foreground">Location view would be displayed here</p>
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
            transform: scale(0.8);
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
