"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Don't apply auth check for login page
  const isLoginPage = pathname === "/superadmin/login"

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthorized(true)
      setIsLoading(false)
      return
    }

    // Check if user is authenticated
    const superadminAuth = localStorage.getItem("superadminAuth")
    const userStr = localStorage.getItem("user")

    if (!superadminAuth || !userStr) {
      router.push("/superadmin/login")
      return
    }

    try {
      const user = JSON.parse(userStr)
      
      // Check if user has superadmin role
      if (user.role !== "superadmin") {
        // Redirect to appropriate dashboard based on role
        if (user.role === "hotel_owner") {
          router.push("/admin/dashboard")
        } else {
          router.push("/login")
        }
        return
      }

      setIsAuthorized(true)
    } catch (error) {
      console.error("Invalid user data", error)
      router.push("/superadmin/login")
      return
    } finally {
      setIsLoading(false)
    }
  }, [pathname, router, isLoginPage])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <div className="min-h-screen">{children}</div>
}
