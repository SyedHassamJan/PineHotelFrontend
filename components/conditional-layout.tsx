"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isSuperAdmin = pathname?.startsWith("/superadmin")
  const isAdmin = pathname?.startsWith("/admin")

  if (isSuperAdmin || isAdmin) {
    return (
      <>
        {children}
        <Toaster richColors position="top-right" />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </>
  )
}
