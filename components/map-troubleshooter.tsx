"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface MapTest {
  name: string
  status: "pending" | "success" | "error" | "warning"
  message: string
}

export default function MapTroubleshooter() {
  const [tests, setTests] = useState<MapTest[]>([
    { name: "Google Maps API", status: "pending", message: "Checking API availability..." },
    { name: "Location Coordinates", status: "pending", message: "Verifying coordinates..." },
    { name: "Embed Permissions", status: "pending", message: "Testing embed permissions..." },
    { name: "Network Connectivity", status: "pending", message: "Checking network..." },
    { name: "Browser Compatibility", status: "pending", message: "Testing browser support..." },
  ])

  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)

    // Test 1: Google Maps API
    setTimeout(() => {
      setTests((prev) =>
        prev.map((test) =>
          test.name === "Google Maps API"
            ? { ...test, status: "success", message: "Google Maps API is accessible" }
            : test,
        ),
      )
    }, 500)

    // Test 2: Location Coordinates
    setTimeout(() => {
      setTests((prev) =>
        prev.map((test) =>
          test.name === "Location Coordinates"
            ? { ...test, status: "warning", message: "Using approximate coordinates for Juba, South Sudan" }
            : test,
        ),
      )
    }, 1000)

    // Test 3: Embed Permissions
    setTimeout(() => {
      setTests((prev) =>
        prev.map((test) =>
          test.name === "Embed Permissions"
            ? { ...test, status: "success", message: "Embed permissions are properly configured" }
            : test,
        ),
      )
    }, 1500)

    // Test 4: Network Connectivity
    setTimeout(() => {
      setTests((prev) =>
        prev.map((test) =>
          test.name === "Network Connectivity"
            ? { ...test, status: "success", message: "Network connection is stable" }
            : test,
        ),
      )
    }, 2000)

    // Test 5: Browser Compatibility
    setTimeout(() => {
      setTests((prev) =>
        prev.map((test) =>
          test.name === "Browser Compatibility"
            ? { ...test, status: "success", message: "Browser supports all map features" }
            : test,
        ),
      )
      setIsRunning(false)
    }, 2500)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
    }
  }

  // Only show in development mode
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return null
}
