import Image from "next/image"
import { useScrollAnimation } from "./hooks/useScrollAnimation"

export default function AboutSection() {
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation({
    threshold: 0.3,
    delay: 100,
  })

  const { elementRef: imageRef, isVisible: imageVisible } = useScrollAnimation({
    threshold: 0.3,
    delay: 300,
  })

  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation({
    threshold: 0.5,
    delay: 200,
  })

  return (
    <section id="about" className="py-12 md:py-16 lg:py-20 px-6 md:px-8 lg:px-[min(5vw,4rem)] bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text Content */}
          <div
            ref={contentRef}
            className={`space-y-6 md:space-y-8 transition-all duration-1000 ease-out ${
              contentVisible ? "transform translate-x-0 opacity-100" : "transform -translate-x-8 opacity-0"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              About Paris Boutique
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Based in Juba, we specialize in premium perfumes and cosmetics. Our mission is to help you feel confident,
              elegant, and beautiful every day.
            </p>

            {/* Stats with staggered animation */}
            <div ref={statsRef} className="flex items-center space-x-8 pt-6">
              {[
                { number: "5+", label: "Years Experience" },
                { number: "500+", label: "Happy Customers" },
                { number: "100+", label: "Premium Products" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center transition-all duration-800 ease-out ${
                    statsVisible
                      ? "transform translate-y-0 opacity-100 scale-100"
                      : "transform translate-y-4 opacity-0 scale-95"
                  }`}
                  style={{
                    transitionDelay: `${index * 200 + 400}ms`,
                  }}
                >
                  <div className="text-2xl font-bold" style={{ color: "#B38E4F" }}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actual Storefront Image */}
          <div
            ref={imageRef}
            className={`relative transition-all duration-1200 ease-out ${
              imageVisible
                ? "transform translate-x-0 opacity-100 scale-100"
                : "transform translate-x-8 opacity-0 scale-95"
            }`}
          >
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg border-4 border-gradient-to-r from-purple-200 to-blue-200">
              <Image
                src="/images/paris-boutique-storefront.jpg"
                alt="Paris Boutique storefront in Juba with purple branding, yellow Eiffel Tower decorations, and glass display cases filled with premium cosmetics and beauty products"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
              />
            </div>

            {/* Decorative elements with delayed animation */}
            <div
              className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-60 transition-all duration-1000 ${
                imageVisible ? "transform scale-100 rotate-0" : "transform scale-0 rotate-45"
              }`}
              style={{
                backgroundColor: "#B38E4F",
                transitionDelay: "600ms",
              }}
            ></div>
            <div
              className={`absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-40 transition-all duration-1000 ${
                imageVisible ? "transform scale-100 rotate-0" : "transform scale-0 -rotate-45"
              }`}
              style={{ transitionDelay: "800ms" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}
