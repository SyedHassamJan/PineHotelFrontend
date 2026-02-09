"use client"

import Link from "next/link"
import { Building2, Users, MapPin, Settings } from "lucide-react"

export function QuickActions() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
      <div className="space-y-3">
        <Link
          href="/admin/hotel-submissions"
          className="w-full flex items-center gap-3 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          <Building2 className="w-5 h-5" />
          Review Hotels
        </Link>
        <button className="w-full flex items-center gap-3 border border-primary text-primary py-3 px-4 rounded-lg font-semibold hover:bg-primary/5 transition">
          <Users className="w-5 h-5" />
          Manage Users
        </button>
        <button className="w-full flex items-center gap-3 border border-border text-foreground py-3 px-4 rounded-lg font-semibold hover:bg-muted transition">
          <MapPin className="w-5 h-5" />
          Review Tours
        </button>
        <button className="w-full flex items-center gap-3 border border-border text-foreground py-3 px-4 rounded-lg font-semibold hover:bg-muted transition">
          <Settings className="w-5 h-5" />
          System Settings
        </button>
      </div>
    </div>
  )
}
