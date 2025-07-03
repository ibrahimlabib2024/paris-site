// Simplified and reliable product synchronization engine

import { defaultProducts } from "./product-initializer"

export interface Product {
  id: number
  title: string
  description: string
  price: string
  originalPrice?: string
  image: string
  alt: string
  rating: number
  reviews: number
  inStock: boolean
  isPopular: boolean
  isNew: boolean
  categoryId: string
  features: string[]
  benefits: string[]
  category: string
  dateAdded: string
  lastModified?: string
  addedTimestamp?: number
  isRecentlyAdded?: boolean
}

export interface ProductUpdate {
  type: "PRODUCT_ADDED" | "PRODUCT_UPDATED" | "PRODUCT_DELETED" | "PRODUCTS_REORDERED" | "PRODUCTS_INITIALIZED"
  product?: Product
  products?: Product[]
  timestamp: number
  source: "admin" | "system" | "initialization"
}

class ProductSyncEngine {
  private listeners: Set<(update: ProductUpdate) => void> = new Set()
  private isInitialized = false

  // Subscribe to product updates
  subscribe(callback: (update: ProductUpdate) => void) {
    this.listeners.add(callback)
    console.log("📡 ProductSyncEngine: New listener subscribed, total:", this.listeners.size)
    return () => {
      this.listeners.delete(callback)
      console.log("📡 ProductSyncEngine: Listener unsubscribed, total:", this.listeners.size)
    }
  }

  // Notify all listeners
  private notify(update: ProductUpdate) {
    console.log("🔔 ProductSyncEngine: Notifying", this.listeners.size, "listeners of", update.type)
    this.listeners.forEach((callback) => {
      try {
        callback(update)
      } catch (error) {
        console.error("❌ Error in product sync listener:", error)
      }
    })
  }

  // Initialize products with complete catalog
  initializeProducts(): Product[] {
    if (typeof window === "undefined") {
      return [...defaultProducts]
    }

    try {
      console.log("🔄 ProductSyncEngine: Initializing products...")

      // Always start with complete default catalog
      const completeProducts = [...defaultProducts]

      // Check for existing admin products
      const adminProducts = localStorage.getItem("admin-products")
      let finalProducts = completeProducts

      if (adminProducts) {
        try {
          const parsedAdminProducts = JSON.parse(adminProducts)
          if (Array.isArray(parsedAdminProducts) && parsedAdminProducts.length >= 70) {
            finalProducts = parsedAdminProducts
            console.log("✅ Using existing admin products:", finalProducts.length)
          } else {
            console.log("⚠️ Admin products insufficient, using defaults")
            this.saveProductsToStorage(completeProducts)
            finalProducts = completeProducts
          }
        } catch (error) {
          console.error("❌ Error parsing admin products, using defaults:", error)
          this.saveProductsToStorage(completeProducts)
          finalProducts = completeProducts
        }
      } else {
        console.log("🆕 No admin products found, saving defaults")
        this.saveProductsToStorage(completeProducts)
        finalProducts = completeProducts
      }

      // Mark as initialized
      if (!this.isInitialized) {
        this.isInitialized = true
        this.notify({
          type: "PRODUCTS_INITIALIZED",
          products: finalProducts,
          timestamp: Date.now(),
          source: "initialization",
        })
      }

      console.log("✅ ProductSyncEngine: Initialized with", finalProducts.length, "products")
      return this.orderProducts(finalProducts)
    } catch (error) {
      console.error("❌ ProductSyncEngine: Error initializing:", error)
      return [...defaultProducts]
    }
  }

  // Load products from storage
  loadProducts(): Product[] {
    if (typeof window === "undefined") {
      return [...defaultProducts]
    }

    try {
      const savedProducts = localStorage.getItem("admin-products")
      if (!savedProducts) {
        console.log("🔄 No saved products, initializing...")
        return this.initializeProducts()
      }

      const products = JSON.parse(savedProducts) as Product[]
      if (!Array.isArray(products) || products.length < 70) {
        console.log("⚠️ Invalid products data, reinitializing...")
        return this.initializeProducts()
      }

      console.log("✅ ProductSyncEngine: Loaded", products.length, "products from storage")
      return this.orderProducts(products)
    } catch (error) {
      console.error("❌ ProductSyncEngine: Error loading products:", error)
      return this.initializeProducts()
    }
  }

  // Save products to storage with multiple backups
  private saveProductsToStorage(products: Product[]): boolean {
    if (typeof window === "undefined") return false

    try {
      if (!Array.isArray(products) || products.length < 70) {
        console.error("❌ Refusing to save insufficient products:", products.length)
        return false
      }

      const now = Date.now()
      const enhancedProducts = products.map((product) => ({
        ...product,
        lastModified: new Date().toISOString(),
        addedTimestamp: product.addedTimestamp || now,
      }))

      const productsData = JSON.stringify(enhancedProducts)

      // Create backup before saving
      const existingProducts = localStorage.getItem("admin-products")
      if (existingProducts) {
        localStorage.setItem("admin-products-backup", existingProducts)
        localStorage.setItem("admin-products-backup-timestamp", new Date().toISOString())
      }

      // Save to multiple locations
      localStorage.setItem("admin-products", productsData)
      localStorage.setItem("products", productsData)
      localStorage.setItem("products-backup", productsData)

      // Save metadata
      localStorage.setItem(
        "admin-products-meta",
        JSON.stringify({
          count: enhancedProducts.length,
          lastUpdated: new Date().toISOString(),
          version: now,
          source: "sync-engine",
        }),
      )

      console.log("✅ ProductSyncEngine: Saved", enhancedProducts.length, "products to storage")
      return true
    } catch (error) {
      console.error("❌ ProductSyncEngine: Error saving products:", error)
      return false
    }
  }

  // Order products with smart sorting
  private orderProducts(products: Product[]): Product[] {
    const now = Date.now()
    const RECENT_THRESHOLD = 5 * 60 * 1000 // 5 minutes

    return products
      .map((product) => ({
        ...product,
        addedTimestamp: product.addedTimestamp || new Date(product.dateAdded || product.lastModified || now).getTime(),
        isRecentlyAdded: product.addedTimestamp ? now - product.addedTimestamp < RECENT_THRESHOLD : false,
      }))
      .sort((a, b) => {
        // Recently added first
        if (a.isRecentlyAdded && !b.isRecentlyAdded) return -1
        if (!a.isRecentlyAdded && b.isRecentlyAdded) return 1

        // New products second
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1

        // Popular products third
        if (a.isPopular && !b.isPopular) return -1
        if (!a.isPopular && b.isPopular) return 1

        // By timestamp (newest first)
        return (b.addedTimestamp || 0) - (a.addedTimestamp || 0)
      })
  }

  // Add new product
  addProduct(product: Omit<Product, "addedTimestamp" | "isRecentlyAdded">): boolean {
    try {
      console.log("🔄 ProductSyncEngine: Adding product:", product.title)

      const now = Date.now()
      const enhancedProduct: Product = {
        ...product,
        id: product.id || now,
        addedTimestamp: now,
        isRecentlyAdded: true,
        lastModified: new Date().toISOString(),
        isNew: true,
      }

      const existingProducts = this.loadProducts()
      const updatedProducts = [enhancedProduct, ...existingProducts.filter((p) => p.id !== enhancedProduct.id)]

      if (this.saveProductsToStorage(updatedProducts)) {
        this.notify({
          type: "PRODUCT_ADDED",
          product: enhancedProduct,
          timestamp: now,
          source: "admin",
        })

        // Trigger cross-tab sync
        this.triggerCrossTabSync()

        console.log("✅ ProductSyncEngine: Product added successfully")
        return true
      }

      return false
    } catch (error) {
      console.error("❌ ProductSyncEngine: Error adding product:", error)
      return false
    }
  }

  // Update existing product
  updateProduct(updatedProduct: Product): boolean {
    try {
      console.log("🔄 ProductSyncEngine: Updating product:", updatedProduct.title)

      const existingProducts = this.loadProducts()
      const productIndex = existingProducts.findIndex((p) => p.id === updatedProduct.id)

      if (productIndex === -1) {
        console.error("❌ Product not found for update:", updatedProduct.id)
        return false
      }

      const now = Date.now()
      const enhancedProduct: Product = {
        ...updatedProduct,
        lastModified: new Date().toISOString(),
        addedTimestamp: existingProducts[productIndex].addedTimestamp || now,
      }

      const updatedProducts = [...existingProducts]
      updatedProducts[productIndex] = enhancedProduct

      if (this.saveProductsToStorage(updatedProducts)) {
        this.notify({
          type: "PRODUCT_UPDATED",
          product: enhancedProduct,
          timestamp: now,
          source: "admin",
        })

        // Trigger cross-tab sync
        this.triggerCrossTabSync()

        console.log("✅ ProductSyncEngine: Product updated successfully")
        return true
      }

      return false
    } catch (error) {
      console.error("❌ ProductSyncEngine: Error updating product:", error)
      return false
    }
  }

  // Delete product
  deleteProduct(productId: number): boolean {
    try {
      console.log("🔄 ProductSyncEngine: Deleting product:", productId)

      const existingProducts = this.loadProducts()
      const updatedProducts = existingProducts.filter((p) => p.id !== productId)

      if (updatedProducts.length < 70) {
        console.error("❌ Cannot delete product: would result in insufficient products")
        return false
      }

      if (this.saveProductsToStorage(updatedProducts)) {
        this.notify({
          type: "PRODUCT_DELETED",
          timestamp: Date.now(),
          source: "admin",
        })

        // Trigger cross-tab sync
        this.triggerCrossTabSync()

        console.log("✅ ProductSyncEngine: Product deleted successfully")
        return true
      }

      return false
    } catch (error) {
      console.error("❌ ProductSyncEngine: Error deleting product:", error)
      return false
    }
  }

  // Restore defaults
  restoreDefaults(): boolean {
    try {
      console.log("🔄 ProductSyncEngine: Restoring defaults...")

      const restoredProducts = [...defaultProducts]

      if (this.saveProductsToStorage(restoredProducts)) {
        this.notify({
          type: "PRODUCTS_INITIALIZED",
          products: restoredProducts,
          timestamp: Date.now(),
          source: "system",
        })

        // Trigger cross-tab sync
        this.triggerCrossTabSync()

        console.log("✅ ProductSyncEngine: Defaults restored successfully")
        return true
      }

      return false
    } catch (error) {
      console.error("❌ ProductSyncEngine: Error restoring defaults:", error)
      return false
    }
  }

  // Trigger cross-tab synchronization
  private triggerCrossTabSync() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin-products-sync-timestamp", String(Date.now()))
        console.log("🔄 ProductSyncEngine: Triggered cross-tab sync")
      } catch (error) {
        console.warn("⚠️ Failed to trigger cross-tab sync:", error)
      }
    }
  }

  // Get sync statistics
  getSyncStats() {
    const products = this.loadProducts()
    const now = Date.now()

    return {
      totalProducts: products.length,
      recentlyAdded: products.filter((p) => p.isRecentlyAdded).length,
      newProducts: products.filter((p) => p.isNew).length,
      popularProducts: products.filter((p) => p.isPopular).length,
      lastUpdateTimestamp: now,
      activeListeners: this.listeners.size,
      isInitialized: this.isInitialized,
      defaultProductsCount: defaultProducts.length,
    }
  }
}

// Global singleton instance
export const productSyncEngine = new ProductSyncEngine()

// Trigger product update function
export const triggerProductUpdate = (type: ProductUpdate["type"], data?: any) => {
  const update: ProductUpdate = {
    type,
    timestamp: Date.now(),
    source: "admin",
    ...data,
  }

  // Queue the update for in-app listeners
  productSyncEngine.subscribe(() => {})() // This will trigger the notification system

  if (typeof window !== "undefined") {
    // Dispatch custom events
    window.dispatchEvent(new CustomEvent("productsUpdated", { detail: update }))
    window.dispatchEvent(new CustomEvent("adminProductsUpdated", { detail: update }))

    // Trigger cross-tab sync
    try {
      localStorage.setItem("admin-products-sync-timestamp", String(Date.now()))
    } catch (e) {
      console.warn("Storage write failed while broadcasting sync:", e)
    }

    console.log("🚀 ProductSyncEngine: Triggered update:", type)
  }
}

// Initialize products on module load
if (typeof window !== "undefined") {
  setTimeout(() => {
    productSyncEngine.initializeProducts()
  }, 100)
}
