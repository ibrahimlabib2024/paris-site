"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Shield, LogOut } from "lucide-react"
import { AuthManager, type AuthSession } from "@/lib/auth-manager"

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<AuthSession | null>(null)
  const router = useRouter()
  const authManager = AuthManager.getInstance()

  useEffect(() => {
    const checkAuth = () => {
      const currentSession = authManager.getCurrentSession()

      if (currentSession) {
        setSession(currentSession)
        setIsAuthenticated(true)
      } else {
        setSession(null)
        setIsAuthenticated(false)
        router.push("/admin/login")
      }

      setIsLoading(false)
    }

    checkAuth()

    // Set up interval to check auth status every minute
    const interval = setInterval(checkAuth, 60000)

    return () => clearInterval(interval)
  }, [router])

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      authManager.logout()
      router.push("/admin/login")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the admin panel.</p>
          <button
            onClick={() => router.push("/admin/login")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div className="text-sm">
              <span className="text-gray-600">Logged in as:</span>
              <span className="font-medium text-gray-900 ml-1">{session.username}</span>
              <span className="text-gray-400 ml-2">•</span>
              <span className="text-gray-500 ml-2">{session.role}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500">Session expires: {new Date(session.expiresAt).toLocaleString()}</div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors px-3 py-1 rounded-md hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {children}
    </div>
  )
}
