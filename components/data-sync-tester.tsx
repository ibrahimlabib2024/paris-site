"use client"

import { useState, useEffect } from "react"
import { RefreshCw, CheckCircle, AlertCircle, Eye } from "lucide-react"

interface Product {
  id: number
  title: string
  price: string
  categoryId: string
  dateAdded: string
}

export default function DataSyncTester() {
  const [adminProducts, setAdminProducts] = useState<Product[]>([])
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")
  const [lastSync, setLastSync] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)

  const loadAdminProducts = () => {
    setSyncStatus("syncing")
    try {
      const savedProducts = localStorage.getItem("admin-products")
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        setAdminProducts(parsedProducts)
        setSyncStatus("success")
        setLastSync(new Date().toLocaleTimeString())
        console.log("🔄 Data sync test - Products loaded:", parsedProducts.length)
      } else {
        setAdminProducts([])
        setSyncStatus("success")
        setLastSync(new Date().toLocaleTimeString())
        console.log("🔄 Data sync test - No products found")
      }
    } catch (error) {
      console.error("❌ Data sync test error:", error)
      setSyncStatus("error")
    }
  }

  useEffect(() => {
    loadAdminProducts()

    // Listen for product updates
    const handleProductUpdate = () => {
      console.log("🔄 Data sync test - Received product update event")
      loadAdminProducts()
    }

    const events = ["productsUpdated", "adminProductsUpdated", "storage"]
    events.forEach((event) => {
      window.addEventListener(event, handleProductUpdate)
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleProductUpdate)
      })
    }
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
        title="Show Data Sync Tester"
      >
        <Eye className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">Data Sync Status</h4>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">
          ×
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Products Count:</span>
          <span className="font-medium">{adminProducts.length}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Last Sync:</span>
          <span className="font-medium">{lastSync || "Never"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Status:</span>
          <div className="flex items-center space-x-1">
            {syncStatus === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
            {syncStatus === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
            {syncStatus === "syncing" && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />}
            <span
              className={`capitalize ${
                syncStatus === "success" ? "text-green-600" : syncStatus === "error" ? "text-red-600" : "text-blue-600"
              }`}
            >
              {syncStatus}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={loadAdminProducts}
        disabled={syncStatus === "syncing"}
        className="w-full mt-3 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded text-sm transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
        <span>Refresh Data</span>
      </button>

      {adminProducts.length > 0 && (
        <div className="mt-3 max-h-32 overflow-y-auto">
          <div className="text-xs text-gray-600 mb-1">Recent Products:</div>
          {adminProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="text-xs text-gray-800 truncate">
              • {product.title} ({product.price})
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
