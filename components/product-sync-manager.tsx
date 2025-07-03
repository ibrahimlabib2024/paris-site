"use client"

import { useEffect, useState } from "react"
import { initializeProducts, forceRefreshProducts, getAllProducts } from "@/lib/product-initializer"
import { RefreshCw, CheckCircle, AlertTriangle, Package, Database, Shield } from "lucide-react"

export default function ProductSyncManager() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [productCount, setProductCount] = useState(0)
  const [lastSync, setLastSync] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"success" | "warning" | "error">("success")
  const [statusMessage, setStatusMessage] = useState("")

  const syncProducts = () => {
    try {
      console.log("🔄 Starting product sync...")
      const products = initializeProducts()

      if (!Array.isArray(products)) {
        throw new Error("Products is not an array")
      }

      setProductCount(products.length)
      setLastSync(new Date().toLocaleTimeString())

      // Determine sync status based on product count
      if (products.length >= 70) {
        setIsInitialized(true)
        setSyncStatus("success")
        setStatusMessage("All products loaded successfully")
      } else if (products.length >= 50) {
        setIsInitialized(true)
        setSyncStatus("warning")
        setStatusMessage(`${products.length} products loaded (expected 70+)`)
      } else {
        setIsInitialized(false)
        setSyncStatus("error")
        setStatusMessage(`Only ${products.length} products loaded - data may be corrupted`)
      }

      console.log("✅ Products synchronized:", products.length)
    } catch (error) {
      console.error("❌ Sync error:", error)
      setIsInitialized(false)
      setSyncStatus("error")
      setStatusMessage(`Sync failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setProductCount(0)
    }
  }

  const forceSync = () => {
    try {
      console.log("🔄 Starting force sync...")
      const products = forceRefreshProducts()

      if (!Array.isArray(products)) {
        throw new Error("Force refresh returned invalid data")
      }

      setProductCount(products.length)
      setLastSync(new Date().toLocaleTimeString())
      setIsInitialized(true)
      setSyncStatus("success")
      setStatusMessage(`Force sync completed - ${products.length} products restored`)

      console.log("✅ Products force synchronized:", products.length)
    } catch (error) {
      console.error("❌ Force sync error:", error)
      setIsInitialized(false)
      setSyncStatus("error")
      setStatusMessage(`Force sync failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const checkDataIntegrity = () => {
    try {
      const products = getAllProducts()
      const adminProducts =
        typeof window !== "undefined" ? JSON.parse(localStorage.getItem("admin-products") || "[]") : []

      console.log("🔍 Data Integrity Check:")
      console.log("- getAllProducts():", products.length)
      console.log("- localStorage admin-products:", adminProducts.length)

      if (products.length !== adminProducts.length) {
        setSyncStatus("warning")
        setStatusMessage(`Data mismatch detected: ${products.length} vs ${adminProducts.length}`)
      }
    } catch (error) {
      console.error("❌ Data integrity check failed:", error)
    }
  }

  useEffect(() => {
    // Initialize products on component mount
    syncProducts()

    // Check product count periodically
    const interval = setInterval(() => {
      try {
        const products = getAllProducts()
        if (Array.isArray(products)) {
          setProductCount(products.length)

          // Auto-detect data loss
          if (products.length < 50 && syncStatus === "success") {
            setSyncStatus("error")
            setStatusMessage("Data loss detected - product count dropped significantly")
          }
        }
      } catch (error) {
        console.error("❌ Periodic check error:", error)
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (syncStatus) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Package className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (syncStatus) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-20 right-4 p-3 rounded-full shadow-lg hover:shadow-xl z-50 transition-all duration-200 ${
          syncStatus === "error"
            ? "bg-red-600 hover:bg-red-700 animate-pulse"
            : syncStatus === "warning"
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-green-600 hover:bg-green-700"
        } text-white`}
        title={`Product Sync Manager - ${statusMessage}`}
      >
        <Package className="w-5 h-5" />
        {syncStatus === "error" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        )}
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
          <Database className="w-4 h-4" />
          <span>Product Sync Manager</span>
        </h4>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
          ×
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <span className={getStatusColor()}>
              {syncStatus === "success" ? "Synced" : syncStatus === "warning" ? "Warning" : "Error"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span>Products:</span>
          <span
            className={`font-medium ${productCount >= 70 ? "text-green-600" : productCount >= 50 ? "text-yellow-600" : "text-red-600"}`}
          >
            {productCount}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Expected:</span>
          <span className="font-medium text-gray-600">70+</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Last Sync:</span>
          <span className="font-medium text-xs">{lastSync || "Never"}</span>
        </div>

        {statusMessage && (
          <div
            className={`text-xs p-2 rounded ${
              syncStatus === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : syncStatus === "warning"
                  ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={syncProducts}
          className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync</span>
        </button>
        <button
          onClick={forceSync}
          className="flex-1 flex items-center justify-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
        >
          <Shield className="w-4 h-4" />
          <span>Restore</span>
        </button>
      </div>

      <button
        onClick={checkDataIntegrity}
        className="w-full mt-2 flex items-center justify-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors"
      >
        <Database className="w-3 h-3" />
        <span>Check Integrity</span>
      </button>

      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <p>
          • <strong>Sync:</strong> Reload existing products
        </p>
        <p>
          • <strong>Restore:</strong> Reset to full catalog (70+ products)
        </p>
        <p>
          • <strong>Check:</strong> Verify data consistency
        </p>
      </div>
    </div>
  )
}
