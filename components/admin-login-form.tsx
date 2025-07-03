"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { AuthManager } from "@/lib/auth-manager"

interface LoginFormProps {
  onLoginSuccess: () => void
}

export default function AdminLoginForm({ onLoginSuccess }: LoginFormProps) {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const authManager = AuthManager.getInstance()

  // Check if already authenticated on mount
  useEffect(() => {
    const session = authManager.getCurrentSession()
    if (session) {
      onLoginSuccess()
    }
  }, [onLoginSuccess])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setShowSuccess(false)

    // Simulate API call delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const result = authManager.authenticate(credentials.username, credentials.password, rememberMe)

      if (result.success && result.session) {
        setShowSuccess(true)
        setError("")

        // Brief success display before redirect
        setTimeout(() => {
          onLoginSuccess()
        }, 1000)
      } else {
        setError(result.error || "Authentication failed. Please try again.")
        setShowSuccess(false)
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      setShowSuccess(false)
    }

    setIsLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Authentication Successful!</h3>
              <p className="text-sm text-green-700 mt-1">Redirecting to admin panel...</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Administrator Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter administrator username"
              required
              disabled={isLoading || showSuccess}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter password"
              required
              disabled={isLoading || showSuccess}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading || showSuccess}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            disabled={isLoading || showSuccess}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Keep me signed in for 7 days
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading || showSuccess}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Authenticating...</span>
            </div>
          ) : showSuccess ? (
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Success! Redirecting...</span>
            </div>
          ) : (
            "Access Admin Panel"
          )}
        </button>
      </form>

      {/* Credentials Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Admin Access Information</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <strong>Username:</strong> parisboutique_admin
          </p>
          <p>
            <strong>Password:</strong> PB2024@Secure!Admin
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-800 text-sm text-center">
          🔒 Authorized personnel only. Access is logged for security purposes.
        </p>
      </div>
    </div>
  )
}
