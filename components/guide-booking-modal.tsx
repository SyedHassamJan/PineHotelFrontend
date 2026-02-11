"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Loader2, User, Mail, Phone, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface GuideBookingModalProps {
  guideId: string
  guideName: string
  trigger?: React.ReactNode
}

export function GuideBookingModal({ guideId, guideName, trigger }: GuideBookingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    userName: "",
    userEmail: "",
    userPhone: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        tourGuideId: guideId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        notes: formData.notes,
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/'
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
      
      const response = await fetch(`${normalizedBaseUrl}api/tour-guide-bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Booking request sent successfully!")
        setIsOpen(false)
        setFormData({
            startDate: "",
            endDate: "",
            userName: "",
            userEmail: "",
            userPhone: "",
            notes: "",
        })
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to send booking request")
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-[#006951] text-white hover:bg-[#005a46]">
            Book Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#006951]">Book {guideName}</DialogTitle>
            <DialogDescription>
              Fill in your details below to request a booking with this guide.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    className="pl-10"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    required
                    className="pl-10"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="userName"
                  name="userName"
                  placeholder="Ali Khan"
                  required
                  className="pl-10"
                  value={formData.userName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userEmail"
                    name="userEmail"
                    type="email"
                    placeholder="ali@email.com"
                    required
                    className="pl-10"
                    value={formData.userEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userPhone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userPhone"
                    name="userPhone"
                    type="tel"
                    placeholder="+923001234567"
                    required
                    className="pl-10"
                    value={formData.userPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Tell the guide about your preferences..."
                  className="pl-10 min-h-[100px]"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#006951] text-white hover:bg-[#005a46] h-12 text-lg font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
