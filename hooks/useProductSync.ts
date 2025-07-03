"use client"

// React hook for product synchronization

import { useState, useEffect, useCallback, useRef } from "react"
import { productSyncEngine, type Product, type ProductUpdate } from "@/lib/product-sync-engine"

interface UseProductSyncOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  enableRealTimeUpdates?: boolean
}

interface UseProductSyncReturn {
  products: Product[]
  isLoading: boolean
  error: Error | null
  lastUpdate: Date | null
  syncStats: any
  refreshProducts: () => void
  addProduct: (product: Omit<Product, "addedTimestamp" | "isRecentlyAdded">) => boolean
  updateProduct: (product: Product) => boolean
  deleteProduct: (productId: number) => boolean
  restoreDefaults: () => boolean
}

export function useProductSync(options: UseProductSyncOptions = {}): UseProductSyncReturn {
  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
    enableRealTimeUpdates = true,
  } = options

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [syncStats, setSyncStats] = useState<any>(null)

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Load products function
  const loadProducts = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)

      const loadedProducts = productSyncEngine.loadProducts()
      setProducts(loadedProducts)
      setLastUpdate(new Date())
      setSyncStats(productSyncEngine.getSyncStats())

      console.log("✅ useProductSync: Loaded", loadedProducts.length, "products")
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to load products")
      setError(error)
      console.error("❌ useProductSync: Error loading products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh products function
  const refreshProducts = useCallback(() => {
    console.log("🔄 useProductSync: Refreshing products...")
    loadProducts()
  }, [loadProducts])

  // Add product function
  const addProduct = useCallback(
    (product: Omit<Product, "addedTimestamp" | "isRecentlyAdded">) => {
      try {
        const success = productSyncEngine.addProduct(product)
        if (success) {
          // Immediately reload products to show the new product
          setTimeout(() => loadProducts(), 50)
        }
        return success
      } catch (err) {
        console.error("❌ useProductSync: Error adding product:", err)
        return false
      }
    },
    [loadProducts],
  )

  // Update product function
  const updateProduct = useCallback(
    (product: Product) => {
      try {
        const success = productSyncEngine.updateProduct(product)
        if (success) {
          // Immediately reload products to show the updated product
          setTimeout(() => loadProducts(), 50)
        }
        return success
      } catch (err) {
        console.error("❌ useProductSync: Error updating product:", err)
        return false
      }
    },
    [loadProducts],
  )

  // Delete product function
  const deleteProduct = useCallback(
    (productId: number) => {
      try {
        const success = productSyncEngine.deleteProduct(productId)
        if (success) {
          // Immediately reload products to remove the deleted product
          setTimeout(() => loadProducts(), 50)
        }
        return success
      } catch (err) {
        console.error("❌ useProductSync: Error deleting product:", err)
        return false
      }
    },
    [loadProducts],
  )

  // Restore defaults function
  const restoreDefaults = useCallback(() => {
    try {
      const success = productSyncEngine.restoreDefaults()
      if (success) {
        // Immediately reload products to show the restored defaults
        setTimeout(() => loadProducts(), 50)
      }
      return success
    } catch (err) {
      console.error("❌ useProductSync: Error restoring defaults:", err)
      return false
    }
  }, [loadProducts])

  // Handle product updates from sync engine
  const handleProductUpdate = useCallback(
    (update: ProductUpdate) => {
      console.log("📡 useProductSync: Received update:", update.type)

      // Always reload products when we receive an update
      setTimeout(() => loadProducts(), 50)
      setSyncStats(productSyncEngine.getSyncStats())
    },
    [loadProducts],
  )

  // Initialize and set up subscriptions
  useEffect(() => {
    // Initial load
    loadProducts()

    // Subscribe to real-time updates if enabled
    if (enableRealTimeUpdates) {
      unsubscribeRef.current = productSyncEngine.subscribe(handleProductUpdate)
      console.log("📡 useProductSync: Subscribed to real-time updates")
    }

    // Set up auto-refresh if enabled
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        console.log("⏰ useProductSync: Auto-refreshing products...")
        loadProducts()
      }, refreshInterval)
    }

    // Listen for storage events (for cross-tab synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "admin-products" || event.key === "admin-products-sync-timestamp") {
        console.log("💾 useProductSync: Storage changed, reloading products")
        setTimeout(() => loadProducts(), 100)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Listen for custom events
    const handleCustomEvent = (event: CustomEvent) => {
      console.log("🎯 useProductSync: Custom event received:", event.type)
      setTimeout(() => loadProducts(), 100)
    }

    window.addEventListener("productsUpdated", handleCustomEvent as EventListener)
    window.addEventListener("adminProductsUpdated", handleCustomEvent as EventListener)

    // Cleanup function
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("productsUpdated", handleCustomEvent as EventListener)
      window.removeEventListener("adminProductsUpdated", handleCustomEvent as EventListener)
    }
  }, [autoRefresh, refreshInterval, enableRealTimeUpdates, loadProducts, handleProductUpdate])

  return {
    products,
    isLoading,
    error,
    lastUpdate,
    syncStats,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    restoreDefaults,
  }
}
