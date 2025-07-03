"use client"
import { Star, ShoppingCart, Gift, Heart, Sparkles } from "lucide-react"
import OptimizedImage from "@/components/optimized-image"

const kidsGiftsProducts = [
  {
    id: 1,
    title: "Kids Beauty Play Set",
    description: "Safe, non-toxic play makeup set perfect for little ones who love to play dress-up",
    price: "$15.99",
    originalPrice: "$19.99",
    image: "/images/kids-gifts-display.jpg",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    isPopular: true,
    features: ["Non-toxic", "Washable", "Age 3+", "Complete Set"],
  },
  {
    id: 2,
    title: "Gentle Kids Skincare Kit",
    description: "Mild and gentle skincare products specially formulated for children's delicate skin",
    price: "$12.50",
    originalPrice: "$16.00",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    isNew: true,
    features: ["Gentle Formula", "Dermatologist Tested", "Natural Ingredients", "Tear-Free"],
  },
  {
    id: 3,
    title: "Gift Sets Collection",
    description: "Beautiful gift sets perfect for birthdays, holidays, and special occasions",
    price: "$24.99",
    originalPrice: "$32.00",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 203,
    inStock: true,
    isPopular: true,
    features: ["Premium Packaging", "Multiple Options", "Gift Ready", "Value Pack"],
  },
]

const handleWhatsAppRedirect = (productName: string, price: string) => {
  const phoneNumber = "+211985575533"
  const message = `Hi! I'm interested in purchasing the ${productName} (${price}) from your Kids & Gifts collection. Could you please provide more details about availability and delivery?`
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
    category: "Kids & Gifts",
  }

  const existingInquiries = JSON.parse(localStorage.getItem("admin-inquiries") || "[]")
  const updatedInquiries = [inquiry, ...existingInquiries]
  localStorage.setItem("admin-inquiries", JSON.stringify(updatedInquiries))
}

export default function KidsGiftsSection() {
  return (
    <section id="kids-gifts" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-6">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Kids & Gifts</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover our special collection of safe, fun beauty products for kids and beautiful gift sets perfect for
            any occasion
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-600">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Safe • Fun • Perfect for Gifting</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {kidsGiftsProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-purple-100 relative"
            >
              {/* Product Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                {product.originalPrice && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Sale
                  </div>
                )}
                {product.isPopular && (
                  <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Popular
                  </div>
                )}
                {product.isNew && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    New
                  </div>
                )}
              </div>

              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                <OptimizedImage
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200 shadow-lg">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                    Kids & Gifts
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>

                {/* Features */}
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

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Price and Buy Button */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <p className="text-xs text-green-600">✓ In Stock</p>
                  </div>

                  <button
                    onClick={() => handleWhatsAppRedirect(product.title, product.price)}
                    className="inline-flex items-center justify-center space-x-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Looking for the Perfect Gift?</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our beauty experts can help you choose the perfect products for kids or create custom gift sets for any
              special occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const phoneNumber = "+211985575533"
                  const message =
                    "Hi! I need help choosing the perfect kids' beauty products or gift sets. Could you please assist me?"
                  const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
                  window.open(whatsappUrl, "_blank")
                }}
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Gift className="w-5 h-5 mr-2" />
                Get Gift Recommendations
              </button>
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold rounded-lg transition-all duration-200"
              >
                View All Products
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
