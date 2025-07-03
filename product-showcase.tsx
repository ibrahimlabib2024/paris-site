"use client"

import { useScrollAnimation } from "./hooks/useScrollAnimation"
import OptimizedImage from "@/components/optimized-image"

const products = [
  {
    id: 1,
    title: "F&W Mix Ready 2 Glow Kit",
    caption: "Complete body brightening system for radiant, glowing skin",
    price: "$28.50",
    originalPrice: "$32.00",
    image: "/images/fw-mix-glow-kit.jpg",
    alt: "F&W Paris Mix Ready 2 Glow complete body brightening kit featuring concentrated serum and body lotion for radiant glowing skin - premium skincare product available at Paris Boutique Juba",
    isOnSale: true,
  },
  {
    id: 2,
    title: "CeraVe Acne Foaming Cleanser",
    caption: "4% Benzoyl Peroxide treatment for clear, healthy skin",
    price: "$16.50",
    originalPrice: "$18.50",
    image: "/images/cerave-acne-cleanser.jpg",
    alt: "CeraVe Acne Foaming Cream Cleanser with 4% Benzoyl Peroxide for effective acne treatment and clear healthy skin - dermatologist recommended skincare at Paris Boutique Juba",
    isOnSale: true,
  },
  {
    id: 3,
    title: "Queen Helene Mint Julep Set",
    caption: "Refreshing scrub and masque duo for deep pore cleansing",
    price: "$9.50",
    originalPrice: "$11.00",
    image: "/images/mint-julep-skincare.jpg",
    alt: "Queen Helene Mint Julep Scrub and Masque skincare set for deep pore cleansing - refreshing treatment for oily and acne-prone skin available at Paris Boutique Juba",
    isOnSale: true,
  },
]

const handleWhatsAppRedirect = (productName: string, price: string) => {
  const phoneNumber = "+211985575533"
  const message = `Hi! I'm interested in purchasing the ${productName} (${price}). Could you please provide more details?`
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

export default function ProductShowcase() {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.3,
    delay: 100,
  })

  const { elementRef: productsRef, isVisible: productsVisible } = useScrollAnimation({
    threshold: 0.2,
    delay: 200,
  })

  return (
    <section id="products" className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 md:mb-16 space-y-6 transition-all duration-800 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Featured Collections
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium skincare and beauty products
          </p>
        </div>

        {/* Product Grid */}
        <div
          ref={productsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-800 ease-out ${
            productsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-purple-100 relative"
            >
              {/* Sale Badge */}
              {product.isOnSale && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Sale
                </div>
              )}

              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <OptimizedImage
                  src={product.image || "/placeholder.svg"}
                  alt={product.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={85}
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 md:p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.caption}</p>

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
                    <p className="text-sm text-green-600">✓ In Stock</p>
                  </div>

                  <button
                    onClick={() => handleWhatsAppRedirect(product.title, product.price)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
                    aria-label={`Buy ${product.title} for ${product.price} via WhatsApp`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Link */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold rounded-lg transition-colors duration-300"
            aria-label="View all premium beauty products at Paris Boutique Juba"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}
