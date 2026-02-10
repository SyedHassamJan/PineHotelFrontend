"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  UserCheck,
  Settings,
  FileText,
  BarChart3,
  Shield,
  Bell,
  Calendar,
  Car
} from "lucide-react"

const menuItems = [
  {
    title: "Overview",
    href: "/superadmin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/superadmin/users",
    icon: Users,
  },
  {
    title: "Hotel Submissions",
    href: "/superadmin/hotel-submissions",
    icon: Building2,
  },
  {
    title: "All Hotels",
    href: "/superadmin/all-hotels",
    icon: Building2,
  },
  {
    title: "Bookings",
    href: "/superadmin/bookings",
    icon: Calendar,
  },
  {
    title: "Cars",
    href: "/superadmin/cars",
    icon: Car,
  },
 
  {
    title: "Car Bookings",
    href: "/superadmin/car-bookings",
    icon: Calendar,
  },
   {
    title: "Tours",
    href: "/superadmin/tours",
    icon: MapPin,
  },
  {
    title: "Tour Submissions",
    href: "/superadmin/tour-submissions",
    icon: MapPin,
  },
  {
    title: "Guide Submissions",
    href: "/superadmin/guide-submissions",
    icon: UserCheck,
  },
  {
    title: "Settings",
    href: "/superadmin/settings",
    icon: Settings,
  },
]

export function SuperAdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen sticky top-0 left-0">
      <div className="p-6">
        {/* Logo */}
        <Link href="/superadmin/dashboard" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">SuperAdmin</h2>
            <p className="text-xs text-muted-foreground">Control Panel</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
