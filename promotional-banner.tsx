"use client"

import Image from "next/image"

export default function PromotionalBanner() {
  return (
    <section
      id="kids-gifts"
      className="py-12 md:py-16 lg:py-20 px-6 md:px-8 lg:px-[min(5vw,4rem)] bg-gradient-to-r from-purple-100 via-blue-50 to-purple-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Actual Kids Gifts Display Image */}
            <div className="relative h-80 lg:h-96">
              <Image
                src="/images/kids-gifts-display.jpg"
                alt="Beautiful gift box display with red teddy bear, flowers, chocolates, and various gift items at Paris Boutique Kids & Gifts branch"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
              />
              {/* New Badge */}
              <div
                className="absolute top-4 left-4 text-purple-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                style={{ backgroundColor: "#B38E4F" }}
              >
                NEW!
              </div>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12 space-y-6 md:space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Now Open – Kids & Gifts Branch
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Discover thoughtful gifts and charming surprises for children. Visit our new location in Juba, opened
                November 18, 2024.
              </p>

              {/* Opening Date Highlight */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-purple-800">Grand Opening: November 18, 2024</span>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <button
                  onClick={() => {
                    const phoneNumber = "+211985575533"
                    const message =
                      "Hi! I'm interested in visiting your Kids & Gifts branch. Could you please provide more details about your location and available products?"
                    const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`
                    window.open(whatsappUrl, "_blank")
                  }}
                  className="inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Order via WhatsApp
                </button>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold rounded-lg transition-all duration-300 cursor-pointer"
                >
                  Get Directions
                </a>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#B38E4F" }}>
                    🎁
                  </div>
                  <div className="text-sm text-gray-600">Gift Wrapping</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#B38E4F" }}>
                    🧸
                  </div>
                  <div className="text-sm text-gray-600">Quality Toys</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
