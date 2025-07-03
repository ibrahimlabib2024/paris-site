"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"

const productCategories = [
  {
    id: "skincare",
    name: "Skincare",
    description: "Premium skincare solutions for healthy, glowing skin",
    products: [
      {
        id: 1,
        title: "F&W Mix Ready 2 Glow Kit",
        description:
          "Complete body brightening system featuring concentrated serum and body lotion for radiant, glowing skin. Made in France with premium ingredients.",
        price: "SSP 2,850",
        originalPrice: "SSP 3,200",
        image: "/images/fw-mix-glow-kit.jpg",
        alt: "F&W Paris Mix Ready 2 Glow body brightening kit",
        rating: 4.8,
        reviews: 124,
        inStock: true,
        features: ["Body Brightening", "Made in France", "2-in-1 Kit", "Premium Quality"],
      },
      {
        id: 2,
        title: "CeraVe Acne Foaming Cleanser",
        description:
          "Dermatologist-developed foaming cream cleanser with 4% Benzoyl Peroxide for effective acne treatment. Gentle yet powerful formula for daily use.",
        price: "SSP 1,650",
        originalPrice: "SSP 1,850",
        image: "/images/cerave-acne-cleanser.jpg",
        alt: "CeraVe Acne Foaming Cream Cleanser with Benzoyl Peroxide",
        rating: 4.6,
        reviews: 89,
        inStock: true,
        features: ["4% Benzoyl Peroxide", "Dermatologist Developed", "Daily Use", "Acne Treatment"],
      },
    ],
  },
  {
    id: "facial-care",
    name: "Facial Care",
    description: "Specialized facial treatments for deep cleansing and refreshing care",
    products: [
      {
        id: 3,
        title: "Queen Helene Mint Julep Set",
        description:
          "Refreshing mint julep scrub and masque duo for deep pore cleansing. Perfect for oily and acne-prone skin with natural mint extracts.",
        price: "SSP 950",
        originalPrice: "SSP 1,100",
        image: "/images/mint-julep-skincare.jpg",
        alt: "Queen Helene Mint Julep Scrub and Masque skincare set",
        rating: 4.4,
        reviews: 67,
        inStock: true,
        features: ["Deep Cleansing", "Natural Mint", "Scrub & Masque", "Oily Skin"],
      },
    ],
  },
]

const handleWhatsAppRedirect = (productName: string, price: string) => {
  const phoneNumber = "+211985575533"
  const message = `Hi! I'm interested in purchasing the ${productName} (${price}). Could you please provide more details about availability and delivery?`
  const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Our Products
            </h1>
            <p className="text-gray-600 mt-2">Discover our premium collection of skincare and beauty products</p>
          </div>
        </div>
      </div>

      {/* Products by Category */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {productCategories.map((category) => (
          <div key={category.id} className="mb-16">
            {/* Category Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{category.name}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{category.description}</p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-purple-100"
                >
                  {/* Product Image */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Sale
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>

                    {/* Price and Buy Button */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                          )}
                        </div>
                        <p className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </p>
                      </div>

                      <button
                        onClick={() => handleWhatsAppRedirect(product.title, product.price)}
                        disabled={!product.inStock}
                        className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Choosing?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our beauty experts are here to help you find the perfect products for your skin type and needs.
          </p>
          <button
            onClick={() => {
              const phoneNumber = "+211985575533"
              const message = "Hi! I need help choosing the right skincare products. Could you please assist me?"
              const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
              window.open(whatsappUrl, "_blank")
            }}
            className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Chat with Expert on WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
