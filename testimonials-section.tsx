"use client"

import { Star } from "lucide-react"

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      text: "The skincare products from Paris Boutique have completely transformed my routine. The CeraVe cleanser and Mint Julep mask work perfectly together. My skin has never looked better!",
      name: "Sarah Mitchell",
      rating: 5,
    },
    {
      id: 2,
      text: "I bought the baby clothing gift set for my newborn, and the quality is outstanding. The fabrics are so soft and the designs are adorable. My little one looks precious in every outfit!",
      name: "Maria Rodriguez",
      rating: 5,
    },
    {
      id: 3,
      text: "Paris Boutique has become my go-to for premium cosmetics. The FW Mix Glow Kit gives me that perfect radiant look for special occasions. The customer service is exceptional too!",
      name: "Aisha Patel",
      rating: 5,
    },
    {
      id: 4,
      text: "The collectible dolls and kids' toys are perfect for my daughter's collection. The quality and attention to detail in each piece is remarkable. She absolutely loves her new Eufan doll!",
      name: "Jennifer Chen",
      rating: 5,
    },
    {
      id: 5,
      text: "As someone with sensitive skin, finding the right products is challenging. Paris Boutique's Hero Cosmetics line has been a game-changer. No irritation, just beautiful, healthy skin.",
      name: "Dr. Amanda Foster",
      rating: 5,
    },
    {
      id: 6,
      text: "The diaper bags and baby accessories are both stylish and functional. The dreamcatcher design is beautiful, and it holds everything I need for outings with my twins!",
      name: "Lisa Thompson",
      rating: 5,
    },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover why thousands of customers trust Paris Boutique for their beauty and lifestyle needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100 text-center"
            >
              {/* Decorative Element */}
              <div className="text-center mb-4">
                <div className="text-pink-300 text-6xl opacity-30 font-serif leading-none">"</div>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center justify-center mb-4">{renderStars(testimonial.rating)}</div>

              {/* Testimonial Text */}
              <p className="text-gray-700 italic mb-6 leading-relaxed text-base">"{testimonial.text}"</p>

              {/* Customer Info - Name Only */}
              <div className="text-center mt-6">
                <div className="w-12 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mb-3 rounded-full"></div>
                <p className="font-semibold text-gray-800 text-lg">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">4.9★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Authentic Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
