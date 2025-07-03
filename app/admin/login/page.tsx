"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLoginForm from "@/components/admin-login-form"
import { AuthManager } from "@/lib/auth-manager"
import Image from "next/image"

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const authManager = AuthManager.getInstance()

  useEffect(() => {
    // Check if already authenticated
    const session = authManager.getCurrentSession()
    if (session) {
      router.push("/admin")
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleLoginSuccess = () => {
    router.push("/admin")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image src="/images/eiffel-tower-icon.png" alt="Paris Boutique Logo" fill className="object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paris Boutique Admin</h1>
          <p className="text-gray-600">Secure access to store management</p>
        </div>

        {/* Login Form */}
        <AdminLoginForm onLoginSuccess={handleLoginSuccess} />

        {/* Back to Website */}
        <div className="text-center mt-6">
          <a href="/" className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
            ← Back to Paris Boutique Website
          </a>
        </div>
      </div>
    </div>
  )
}
