"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Package,
  Sparkles,
  Palette,
  Droplets,
  Search,
  RefreshCw,
} from "lucide-react"

import OptimizedImage from "@/components/optimized-image"
import { debounce, optimizeForDevice } from "@/lib/performance-utils"
import DataSyncTester from "@/components/data-sync-tester"
import ProductSyncManager from "@/components/product-sync-manager"
import { productSyncEngine } from "@/lib/product-sync-engine"
import NewProductIndicator from "@/components/new-product-indicator"

const productCategories = [
  {
    id: "all",
    name: "All Products",
    description: "View all available products",
    icon: <Package className="w-5 h-5" />,
    color: "from-purple-600 to-blue-600",
    subtitle: "All categories",
  },
  {
    id: "perfumes",
    name: "Perfumes",
    description: "Signature scents and niche brands for every occasion",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-pink-500 to-rose-500",
    subtitle: "Signature scents, niche brands",
  },
  {
    id: "skincare",
    name: "Skincare Products",
    description: "Premium skincare solutions for healthy, radiant skin",
    icon: <Droplets className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
    subtitle: "Face care, body care, treatments",
  },
  {
    id: "makeup",
    name: "Makeup",
    description: "Professional makeup products for every look and occasion",
    icon: <Palette className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
    subtitle: "Foundation, lipstick, eyeshadow, more",
  },
  {
    id: "kids-gifts",
    name: "Kids & Baby",
    description: "Adorable gifts and essentials for children and babies",
    icon: <Package className="w-5 h-5" />,
    color: "from-green-500 to-teal-500",
    subtitle: "Toys, clothing, baby care, gifts",
  },
  {
    id: "gifts",
    name: "Gifts & Party",
    description: "Perfect gifts and party supplies for special occasions",
    icon: <Package className="w-5 h-5" />,
    color: "from-orange-500 to-red-500",
    subtitle: "Party supplies, gift items, accessories",
  },
  {
    id: "home-decor",
    name: "Home Decor",
    description: "Beautiful decorative items to enhance your living space",
    icon: <Package className="w-5 h-5" />,
    color: "from-indigo-500 to-purple-500",
    subtitle: "Flowers, plants, decorative items",
  },
]

const handleWhatsAppRedirect = (productName: string, price: string) => {
  const phoneNumber = "+211985575533"
  const message = `Hi! I'm interested in purchasing the ${productName} (${price}). Could you please provide more details about availability, delivery options, and any current promotions?`
  const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")

  // Log the inquiry for admin tracking
  const inquiry = {
    id: Date.now(),
    productName,
    price,
    timestamp: new Date().toISOString(),
    message,
    userAgent: navigator.userAgent,
  }

  const existingInquiries = JSON.parse(localStorage.getItem("admin-inquiries") || "[]")
  const updatedInquiries = [inquiry, ...existingInquiries]
  localStorage.setItem("admin-inquiries", JSON.stringify(updatedInquiries))
}

const handleComingSoonInquiry = (categoryName: string) => {
  const phoneNumber = "+211985575533"
  const message = `Hi! I'm interested in your ${categoryName} collection. When will these products be available? Could you please notify me when they arrive?`
  const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

export default function ProductsPageClient() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all")
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleProducts, setVisibleProducts] = useState(12)
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Load products directly from sync engine
  const loadProducts = useCallback(() => {
    try {
      console.log("🔄 Products Page: Loading products...")
      setIsLoading(true)
      const loadedProducts = productSyncEngine.loadProducts()
      setAllProducts(loadedProducts)
      setLastUpdate(new Date())
      console.log("✅ Products Page: Loaded", loadedProducts.length, "products")
    } catch (error) {
      console.error("❌ Products Page: Error loading products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load and event listeners
  useEffect(() => {
    // Load products immediately
    loadProducts()

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "admin-products" || event.key === "admin-products-sync-timestamp") {
        console.log("💾 Products Page: Storage changed, reloading products")
        setTimeout(() => loadProducts(), 100)
      }
    }

    // Listen for custom events
    const handleCustomEvent = () => {
      console.log("🎯 Products Page: Custom event received, reloading products")
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
  }, [loadProducts])

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam, selectedCategory])

  const loadMoreProducts = useCallback(() => {
    setVisibleProducts((prev) => prev + 12)
  }, [])

  const handleRefresh = () => {
    setSelectedCategory("all")
    setSearchQuery("")
    loadProducts()
    console.log("Manual refresh triggered")
  }

  // Debounced search
  const debouncedSearch = useMemo(() => debounce((query: string) => setSearchQuery(query), 300), [])

  // Filter products based on selected category and search query
  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.categoryId === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.features &&
            product.features.some &&
            product.features.some((feature) => feature.toLowerCase().includes(query))) ||
          product.category.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [allProducts, selectedCategory, searchQuery])

  // Get category counts and determine if category should be enabled
  const getCategoryInfo = (categoryId: string) => {
    if (categoryId === "all") {
      return { count: allProducts.length, hasProducts: allProducts.length > 0, isComingSoon: false }
    }

    const categoryProducts = allProducts.filter((product) => product.categoryId === categoryId)
    const count = categoryProducts.length
    const hasProducts = count > 0

    return {
      count,
      hasProducts,
      isComingSoon: false, // All categories now have products
    }
  }

  const deviceOptimizations = useMemo(() => optimizeForDevice(), [])

  // Debug information
  const debugInfo = {
    totalProductsCount: allProducts.length,
    filteredProductsCount: filteredProducts.length,
    selectedCategory,
    searchQuery,
    visibleProducts,
    lastSyncTime: lastUpdate?.toLocaleString() || "Never",
    isLoading,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-[min(5vw,4rem)] py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Main Header */}
          <div className="text-center mb-8 md:mb-12 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Our Products</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover premium perfumes, cosmetics, baby products, and gifts at Paris Boutique. We offer a curated
              selection of quality products to elevate your everyday elegance.
            </p>
            <p className="text-sm text-gray-500">
              ({allProducts.length} product{allProducts.length !== 1 ? "s" : ""} available)
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 md:mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Debug Information Panel - Remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">✅ Product Sync Status</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>Total Products: {debugInfo.totalProductsCount}</p>
                <p>Filtered Products: {debugInfo.filteredProductsCount}</p>
                <p>Selected Category: {debugInfo.selectedCategory}</p>
                <p>Search Query: "{debugInfo.searchQuery}"</p>
                <p>Visible Products: {debugInfo.visibleProducts}</p>
                <p>Last Sync: {debugInfo.lastSyncTime}</p>
                <p>Is Loading: {debugInfo.isLoading ? "Yes" : "No"}</p>
                <p>Status: ✅ Real-time sync active</p>
              </div>
              <button
                onClick={() => {
                  loadProducts()
                }}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Force Refresh Data
              </button>
            </div>
          )}

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {productCategories.map((category) => {
              const { count, hasProducts } = getCategoryInfo(category.id)
              const isActive = selectedCategory === category.id

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-purple-300 hover:text-purple-600 shadow-sm hover:shadow-md"
                  }`}
                >
                  {category.icon}
                  <span>
                    {category.name} ({count})
                  </span>
                  {hasProducts && !isActive && category.id !== "all" && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">Available</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-[min(5vw,4rem)] py-12 md:py-16">
        {isLoading ? (
          /* Loading State */
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCategory === "all"
                  ? "All Products"
                  : productCategories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600">
                {searchQuery
                  ? `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found for "${searchQuery}"`
                  : `Showing ${Math.min(visibleProducts, filteredProducts.length)} of ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {filteredProducts.slice(0, visibleProducts).map((product, index) => (
                <div
                  key={`${product.id}-${product.title}`}
                  className={`
                    bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative
                    ${product.isRecentlyAdded ? "ring-2 ring-green-400 ring-opacity-50" : ""}
                    ${index === 0 && product.isRecentlyAdded ? "transform scale-105" : ""}
                  `}
                >
                  {/* New Product Indicator */}
                  <NewProductIndicator product={product} showAnimation={true} />

                  {/* Product Badges */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                    {product.originalPrice && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Sale
                      </div>
                    )}
                    {product.isPopular && (
                      <div
                        className="text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                        style={{ backgroundColor: "#B38E4F" }}
                      >
                        Popular
                      </div>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <OptimizedImage
                      src={product.image || "/placeholder.svg"}
                      alt={product.alt || product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      quality={75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{product.rating || 4.0}</span>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200 shadow-lg">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200 shadow-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4 md:p-6 space-y-3 md:space-y-4">
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {product.category || "General"}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-3 md:mb-4 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{product.features.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Rating and Reviews */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating || 4.0) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                    </div>

                    {/* Price and Buy Button */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                          )}
                        </div>
                        <p className={`text-xs ${product.inStock !== false ? "text-green-600" : "text-red-600"}`}>
                          {product.inStock !== false ? "✓ In Stock" : "✗ Out of Stock"}
                        </p>
                      </div>

                      <button
                        onClick={() => handleWhatsAppRedirect(product.title, product.price)}
                        disabled={product.inStock === false}
                        className="inline-flex items-center justify-center space-x-1 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none text-xs sm:text-sm"
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleProducts < filteredProducts.length && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreProducts}
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Load More Products ({filteredProducts.length - visibleProducts} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          /* No Products Found */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any products matching "{searchQuery}". Try searching with different keywords.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Looking for Something Specific?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find what you're looking for? Our beauty experts can help you find the perfect products or let you
            know when new items arrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const phoneNumber = "+211985575533"
                const message =
                  "Hi! I'm looking for specific beauty products. Could you please help me find what I need or let me know about upcoming arrivals?"
                const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
                window.open(whatsappUrl, "_blank")
              }}
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Chat with Expert
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold rounded-lg transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Data Sync Tester - Development Tool */}
      {process.env.NODE_ENV === "development" && <DataSyncTester />}

      {/* Product Sync Manager - Development Tool */}
      <ProductSyncManager />
    </div>
  )
}
