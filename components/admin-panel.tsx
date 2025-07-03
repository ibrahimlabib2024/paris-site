"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  MessageSquare,
  Upload,
  X,
  Save,
  CheckCircle,
  LogOut,
  ExternalLink,
  Home,
  Sparkles,
  RefreshCw,
  Database,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import AdminAuthWrapper from "@/components/admin-auth-wrapper"
import Navigation from "@/navigation"
import { productSyncEngine } from "@/lib/product-sync-engine"

// Types
interface Product {
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
}

interface OrderInquiry {
  id: number
  productName: string
  price: string
  timestamp: string
  message: string
  userAgent?: string
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"products" | "inquiries">("products")
  const [products, setProducts] = useState<Product[]>([])
  const [orderInquiries, setOrderInquiries] = useState<OrderInquiry[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingInquiry, setViewingInquiry] = useState<OrderInquiry | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [updateMessage, setUpdateMessage] = useState<string>("")
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)
  const [showViewChangesModal, setShowViewChangesModal] = useState(false)
  const [lastEditedProduct, setLastEditedProduct] = useState<Product | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Form state for product editing
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [imagePreview, setImagePreview] = useState<string>("")
  const [adminUser, setAdminUser] = useState<string>("Administrator")
  const [loginTime, setLoginTime] = useState<string | null>(null)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load products directly from sync engine
  const loadProducts = () => {
    try {
      console.log("🔄 Admin Panel: Loading products...")
      setIsLoading(true)
      const loadedProducts = productSyncEngine.loadProducts()
      setProducts(loadedProducts)
      console.log("✅ Admin Panel: Loaded", loadedProducts.length, "products")
    } catch (error) {
      console.error("❌ Admin Panel: Error loading products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    if (typeof window === "undefined") return

    // Load products immediately
    loadProducts()

    // Load inquiries and admin data
    const savedInquiries = localStorage.getItem("admin-inquiries")
    const storedAdminUser = localStorage.getItem("admin-user")
    const storedLoginTime = localStorage.getItem("admin-login-time")

    if (storedAdminUser) {
      setAdminUser(storedAdminUser)
    }

    if (storedLoginTime) {
      setLoginTime(storedLoginTime)
    }

    if (savedInquiries) {
      try {
        const parsedInquiries = JSON.parse(savedInquiries)
        setOrderInquiries(parsedInquiries)
      } catch (error) {
        console.error("Error parsing saved inquiries:", error)
        setOrderInquiries([])
      }
    }

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "admin-products" || event.key === "admin-products-sync-timestamp") {
        console.log("💾 Admin Panel: Storage changed, reloading products")
        setTimeout(() => loadProducts(), 100)
      }
    }

    // Listen for custom events
    const handleCustomEvent = () => {
      console.log("🎯 Admin Panel: Custom event received, reloading products")
      setTimeout(() => loadProducts(), 100)
    }

    // Add event listeners
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("productsUpdated", handleCustomEvent)
    window.addEventListener("adminProductsUpdated", handleCustomEvent)

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("productsUpdated", handleCustomEvent)
      window.removeEventListener("adminProductsUpdated", handleCustomEvent)
    }
  }, [])

  // Save inquiries to localStorage
  useEffect(() => {
    if (typeof window === "undefined" || orderInquiries.length < 0) return
    localStorage.setItem("admin-inquiries", JSON.stringify(orderInquiries))
  }, [orderInquiries])

  // Show update notification
  const showNotification = (message: string, product?: Product) => {
    setUpdateMessage(message)
    setLastUpdate(new Date().toLocaleString())
    setShowUpdateNotification(true)
    if (product) {
      setLastEditedProduct(product)
      setShowViewChangesModal(true)
    }
    setTimeout(() => setShowUpdateNotification(false), 3000)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({ ...product })
    setImagePreview(product.image)
    setIsEditModalOpen(true)
  }

  const handleAddProduct = () => {
    const newProduct: Partial<Product> = {
      title: "",
      description: "",
      price: "",
      originalPrice: "",
      image: "",
      alt: "",
      rating: 4.0,
      reviews: 0,
      inStock: true,
      isPopular: false,
      isNew: true,
      categoryId: "skincare",
      features: [],
      benefits: [],
      category: "",
      dateAdded: new Date().toISOString().split("T")[0],
    }
    setEditingProduct(null)
    setFormData(newProduct)
    setImagePreview("")
    setIsEditModalOpen(true)
  }

  const handleDeleteProduct = (id: number) => {
    const product = products.find((p) => p.id === id)
    if (confirm(`Are you sure you want to delete "${product?.title}"?`)) {
      console.log("🗑️ Admin Panel: Deleting product:", id)
      const success = productSyncEngine.deleteProduct(id)
      if (success) {
        showNotification(`Product "${product?.title}" deleted successfully`)
        // Reload products immediately
        setTimeout(() => loadProducts(), 100)
      } else {
        alert("Failed to delete product. Cannot delete - would result in insufficient products.")
      }
    }
  }

  const validatePrice = (price: string): boolean => {
    const priceRegex = /^\$\d+(\.\d{2})?$/
    return priceRegex.test(price)
  }

  const formatPrice = (price: string): string => {
    const numericPrice = price.replace(/[^0-9.]/g, "")
    if (numericPrice && !isNaN(Number(numericPrice))) {
      return `$${Number(numericPrice).toFixed(2)}`
    }
    return price
  }

  const validateProductData = (productData: Product): boolean => {
    const requiredFields = ["id", "title", "price", "categoryId"]
    const missingFields = requiredFields.filter((field) => !productData[field])

    if (missingFields.length > 0) {
      console.error("❌ Product validation failed. Missing fields:", missingFields)
      alert(`Product validation failed. Missing required fields: ${missingFields.join(", ")}`)
      return false
    }

    if (!productData.price.startsWith("$")) {
      console.error("❌ Invalid price format:", productData.price)
      alert("Price must be in USD format (e.g., $19.99)")
      return false
    }

    const validCategories = ["skincare", "perfumes", "makeup", "bath-body", "kids-gifts", "gifts", "home-decor"]
    if (!validCategories.includes(productData.categoryId)) {
      console.error("❌ Invalid category:", productData.categoryId)
      alert("Invalid product category")
      return false
    }

    console.log("✅ Product validation passed:", productData.title)
    return true
  }

  const handleSaveProduct = () => {
    if (!formData.title?.trim() || !formData.price?.trim()) {
      alert("Please fill in required fields (Title and Price)")
      return
    }

    const formattedPrice = formatPrice(formData.price)
    const formattedOriginalPrice = formData.originalPrice ? formatPrice(formData.originalPrice) : ""

    if (!validatePrice(formattedPrice)) {
      alert("Please enter a valid USD price (e.g., $19.99)")
      return
    }

    if (formattedOriginalPrice && !validatePrice(formattedOriginalPrice)) {
      alert("Please enter a valid USD original price (e.g., $24.99)")
      return
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now(),
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
      price: formattedPrice,
      originalPrice: formattedOriginalPrice || undefined,
      image: formData.image || "/placeholder.svg",
      alt: formData.alt?.trim() || formData.title?.trim() || "",
      rating: formData.rating || 4.0,
      reviews: formData.reviews || 0,
      inStock: formData.inStock !== undefined ? formData.inStock : true,
      isPopular: formData.isPopular || false,
      isNew: editingProduct ? (formData.isNew !== undefined ? formData.isNew : true) : true,
      categoryId: formData.categoryId || "skincare",
      features:
        typeof formData.features === "string"
          ? formData.features
              .split(",")
              .map((f) => f.trim())
              .filter((f) => f.length > 0)
          : Array.isArray(formData.features)
            ? formData.features
            : [],
      benefits:
        typeof formData.benefits === "string"
          ? formData.benefits
              .split(",")
              .map((b) => b.trim())
              .filter((b) => b.length > 0)
          : Array.isArray(formData.benefits)
            ? formData.benefits
            : [],
      category: formData.category?.trim() || "General",
      dateAdded: formData.dateAdded || new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString(),
    }

    // Validate the product data
    if (!validateProductData(productData)) {
      return
    }

    let success = false
    if (editingProduct) {
      // Update existing product
      console.log("🔄 Admin Panel: Updating product:", productData.title)
      success = productSyncEngine.updateProduct(productData)
      if (success) {
        showNotification(`Product "${productData.title}" updated successfully`, productData)
      }
    } else {
      // Add new product
      console.log("🔄 Admin Panel: Adding new product:", productData.title)
      success = productSyncEngine.addProduct(productData)
      if (success) {
        const comingSoonCategories = ["perfumes", "makeup", "bath-body"]
        if (comingSoonCategories.includes(productData.categoryId)) {
          showNotification(
            `🎉 New ${productData.categoryId} product added! "${productData.title}" - This category is now available to customers!`,
            productData,
          )
        } else {
          showNotification(
            `🎉 Product "${productData.title}" added successfully and will appear at the top of the product list!`,
            productData,
          )
        }
      }
    }

    if (success) {
      setIsEditModalOpen(false)
      setFormData({})
      setImagePreview("")
      setEditingProduct(null)

      // Reload products immediately to show changes
      setTimeout(() => loadProducts(), 100)
      console.log("✅ Admin Panel: Product saved, reloading products...")
    } else {
      alert("Failed to save product. Please try again.")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData({ ...formData, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleViewInquiry = (inquiry: OrderInquiry) => {
    setViewingInquiry(inquiry)
    setIsViewModalOpen(true)
  }

  const handleLogout = () => {
    if (typeof window === "undefined") return

    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("admin-authenticated")
      localStorage.removeItem("admin-auth-expiry")
      localStorage.removeItem("admin-user")
      localStorage.removeItem("admin-login-time")
      window.location.href = "/admin/login"
    }
  }

  const handleRestoreDefaults = () => {
    if (
      confirm("Are you sure you want to restore all products to defaults? This will overwrite any custom products.")
    ) {
      console.log("🔄 Admin Panel: Restoring defaults...")
      const success = productSyncEngine.restoreDefaults()
      if (success) {
        showNotification("✅ Products restored to defaults successfully!")
        // Reload products immediately
        setTimeout(() => loadProducts(), 100)
      } else {
        alert("Failed to restore defaults. Please try again.")
      }
    }
  }

  const handleRefresh = () => {
    console.log("🔄 Admin Panel: Manual refresh triggered")
    loadProducts()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getInquiryStats = () => {
    const productCounts: { [key: string]: number } = {}
    orderInquiries.forEach((inquiry) => {
      productCounts[inquiry.productName] = (productCounts[inquiry.productName] || 0) + 1
    })
    return productCounts
  }

  // Get category statistics
  const getCategoryStats = () => {
    const stats = {
      skincare: 0,
      perfumes: 0,
      makeup: 0,
      "bath-body": 0,
      "kids-gifts": 0,
      gifts: 0,
      "home-decor": 0,
    }

    products.forEach((product) => {
      if (stats.hasOwnProperty(product.categoryId)) {
        stats[product.categoryId]++
      }
    })

    return stats
  }

  // Get sync stats
  const getSyncStats = () => {
    return productSyncEngine.getSyncStats()
  }

  // If not client-side yet, show a loading state
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const categoryStats = getCategoryStats()
  const syncStats = getSyncStats()

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navigation />

        {/* Real-time Update Notification */}
        {showUpdateNotification && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in-right">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">{updateMessage}</p>
              <p className="text-xs opacity-90">Updated at {lastUpdate}</p>
            </div>
          </div>
        )}

        {/* View Changes Modal */}
        {showViewChangesModal && lastEditedProduct && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-xl p-4 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Product Updated Successfully!</h4>
              <button onClick={() => setShowViewChangesModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              "{lastEditedProduct.title}" has been updated. Would you like to view it on the website?
            </p>
            <div className="flex space-x-2">
              <Link
                href="/products"
                className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Website</span>
              </Link>
              <button
                onClick={() => setShowViewChangesModal(false)}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                Continue Editing
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Paris Boutique Admin Panel</h1>
                <p className="text-gray-600 mt-2">Manage your products and track customer inquiries</p>
                {loginTime && <p className="text-xs text-gray-500 mt-1">Session started: {formatDate(loginTime)}</p>}
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome back,</p>
                  <p className="font-medium text-gray-900">{adminUser}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">🔧 Debug Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-yellow-800">Products Loaded:</span>
                <div className="text-yellow-700">{products.length}</div>
              </div>
              <div>
                <span className="font-medium text-yellow-800">Is Loading:</span>
                <div className="text-yellow-700">{isLoading ? "Yes" : "No"}</div>
              </div>
              <div>
                <span className="font-medium text-yellow-800">Sync Engine Active:</span>
                <div className="text-yellow-700">Yes</div>
              </div>
              <div>
                <span className="font-medium text-yellow-800">Last Update:</span>
                <div className="text-yellow-700">{lastUpdate || "Never"}</div>
              </div>
            </div>
            <button
              onClick={() => {
                console.log("🔍 Debug: Current products:", products)
                console.log("🔍 Debug: LocalStorage admin-products:", localStorage.getItem("admin-products"))
                console.log("🔍 Debug: Sync stats:", getSyncStats())
              }}
              className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
            >
              Log Debug Info
            </button>
          </div>
        </div>

        {/* Sync Status Panel */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Product Sync Status</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleRestoreDefaults}
                  className="flex items-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>Restore Defaults</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{products.length}</div>
                <div className="text-sm text-gray-600">Total Products</div>
                <div className="text-xs text-green-600 mt-1">✓ Synced</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{syncStats?.newProducts || 0}</div>
                <div className="text-sm text-gray-600">New Products</div>
                <div className="text-xs text-blue-600 mt-1">Recently Added</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{syncStats?.popularProducts || 0}</div>
                <div className="text-sm text-gray-600">Popular Products</div>
                <div className="text-xs text-purple-600 mt-1">Featured Items</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{syncStats?.activeListeners || 0}</div>
                <div className="text-sm text-gray-600">Active Listeners</div>
                <div className="text-xs text-gray-600 mt-1">Real-time Sync</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Last sync:{" "}
              {syncStats?.lastUpdateTimestamp ? new Date(syncStats.lastUpdateTimestamp).toLocaleString() : "Never"}
            </p>
          </div>
        </div>

        {/* Category Status Overview */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Category Status Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{categoryStats.skincare}</div>
                <div className="text-sm text-gray-600">Skincare</div>
                <div className="text-xs text-green-600 mt-1">✓ Available</div>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">{categoryStats.perfumes}</div>
                <div className="text-sm text-gray-600">Perfumes</div>
                <div className={`text-xs mt-1 ${categoryStats.perfumes > 0 ? "text-green-600" : "text-yellow-600"}`}>
                  {categoryStats.perfumes > 0 ? "✓ Available" : "⏳ Coming Soon"}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{categoryStats.makeup}</div>
                <div className="text-sm text-gray-600">Makeup</div>
                <div className={`text-xs mt-1 ${categoryStats.makeup > 0 ? "text-green-600" : "text-yellow-600"}`}>
                  {categoryStats.makeup > 0 ? "✓ Available" : "⏳ Coming Soon"}
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{categoryStats["bath-body"]}</div>
                <div className="text-sm text-gray-600">Bath & Body</div>
                <div
                  className={`text-xs mt-1 ${categoryStats["bath-body"] > 0 ? "text-green-600" : "text-yellow-600"}`}
                >
                  {categoryStats["bath-body"] > 0 ? "✓ Available" : "⏳ Coming Soon"}
                </div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{categoryStats["kids-gifts"]}</div>
                <div className="text-sm text-gray-600">Kids & Baby</div>
                <div
                  className={`text-xs mt-1 ${categoryStats["kids-gifts"] > 0 ? "text-green-600" : "text-yellow-600"}`}
                >
                  {categoryStats["kids-gifts"] > 0 ? "✓ Available" : "⏳ Coming Soon"}
                </div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{categoryStats.gifts}</div>
                <div className="text-sm text-gray-600">Gifts & Party</div>
                <div className={`text-xs mt-1 ${categoryStats.gifts > 0 ? "text-green-600" : "text-yellow-600"}`}>
                  {categoryStats.gifts > 0 ? "✓ Available" : "⏳ Coming Soon"}
                </div>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{categoryStats["home-decor"]}</div>
                <div className="text-sm text-gray-600">Home Decor</div>
                <div
                  className={`text-xs mt-1 ${categoryStats["home-decor"] > 0 ? "text-green-600" : "text-yellow-600"}`}
                >
                  {categoryStats["home-decor"] > 0 ? "✓ Available" : "⏳ Coming Soon"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "products" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "inquiries" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Order Inquiries ({orderInquiries.length})</span>
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              )}

              {/* Products Grid */}
              {!isLoading && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.alt}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {product.isNew && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs animate-pulse">New</span>
                          )}
                          {product.isPopular && (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Popular</span>
                          )}
                          {!product.inStock && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Out of Stock</span>
                          )}
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs capitalize">
                            {product.categoryId.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-lg font-bold text-purple-600">{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through ml-2">{product.originalPrice}</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">★ {product.rating}</span>
                        </div>
                        {product.lastModified && (
                          <p className="text-xs text-gray-400 mb-3">Last updated: {formatDate(product.lastModified)}</p>
                        )}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !isLoading && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Start building your product catalog by adding your first product. Add products to "coming soon"
                      categories to make them available to customers!
                    </p>
                    <button
                      onClick={handleAddProduct}
                      className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Product
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {/* Order Inquiries Tab */}
          {activeTab === "inquiries" && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Inquiries Log</h2>
                <div className="text-sm text-gray-600">Total inquiries: {orderInquiries.length}</div>
              </div>

              {/* Inquiry Stats */}
              {orderInquiries.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Products (by inquiries)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(getInquiryStats())
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([productName, count]) => (
                        <div key={productName} className="bg-purple-50 rounded-lg p-4">
                          <div className="text-sm font-medium text-purple-900 mb-1">{productName}</div>
                          <div className="text-2xl font-bold text-purple-600">{count} inquiries</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Inquiries Table */}
              {orderInquiries.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (USD)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orderInquiries
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .map((inquiry) => (
                            <tr key={inquiry.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{inquiry.productName}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-semibold">{inquiry.price}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatDate(inquiry.timestamp)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleViewInquiry(inquiry)}
                                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-900 text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View Message</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Inquiries Yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Customer inquiries will appear here when they contact you about products.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter product title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.categoryId || "skincare"}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="skincare">Skincare Products</option>
                        <option value="perfumes">Perfumes</option>
                        <option value="makeup">Makeup</option>
                        <option value="bath-body">Bath & Body</option>
                        <option value="kids-gifts">Kids & Baby</option>
                        <option value="gifts">Gifts & Party</option>
                        <option value="home-decor">Home Decor</option>
                      </select>
                      {["perfumes", "makeup", "bath-body"].includes(formData.categoryId || "") && (
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Adding to "Coming Soon" category - will make it available to customers!
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.price || ""}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        onBlur={(e) => setFormData({ ...formData, price: formatPrice(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="$19.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (USD)</label>
                      <input
                        type="text"
                        value={formData.originalPrice || ""}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        onBlur={(e) =>
                          setFormData({ ...formData, originalPrice: e.target.value ? formatPrice(e.target.value) : "" })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="$24.99 (optional)"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                      <input
                        type="text"
                        value={formData.category || ""}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Face Care, Body Care"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={formData.alt || ""}
                        onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Image description for accessibility"
                      />
                    </div>
                  </div>

                  {/* Features and Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                      <input
                        type="text"
                        value={
                          Array.isArray(formData.features) ? formData.features.join(", ") : formData.features || ""
                        }
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Feature 1, Feature 2, Feature 3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                      <input
                        type="text"
                        value={
                          Array.isArray(formData.benefits) ? formData.benefits.join(", ") : formData.benefits || ""
                        }
                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Benefit 1, Benefit 2, Benefit 3"
                      />
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating || 4.0}
                        onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.reviews || 0}
                        onChange={(e) => setFormData({ ...formData, reviews: Number.parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Status Checkboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.inStock !== false}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isPopular || false}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Popular</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isNew !== false}
                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Mark as New</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProduct}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProduct ? "Update Product" : "Add Product"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inquiry View Modal */}
        {isViewModalOpen && viewingInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Customer Inquiry</h3>
                  <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Product:</span>
                    <p className="text-gray-900">{viewingInquiry.productName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Price:</span>
                    <p className="text-gray-900 font-semibold">{viewingInquiry.price}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Date & Time:</span>
                    <p className="text-gray-900">{formatDate(viewingInquiry.timestamp)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Customer Message:</span>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md text-sm">{viewingInquiry.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuthWrapper>
  )
}
