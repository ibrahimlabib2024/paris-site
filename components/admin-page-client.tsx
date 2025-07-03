"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import AdminPanel from "@/components/admin-panel"
import { AuthManager } from "@/lib/auth-manager"

export default function AdminPageClient() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const authManager = AuthManager.getInstance()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const session = authManager.getCurrentSession()

        if (session) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <AdminAuthWrapper>
      <AdminPanel />
    </AdminAuthWrapper>
  )
}
