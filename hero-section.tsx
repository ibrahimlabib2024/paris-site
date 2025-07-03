"use client"

import Image from "next/image"
import { useScrollAnimation } from "./hooks/useScrollAnimation"

export default function HeroSection() {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation({
    threshold: 0.2,
    delay: 100,
  })

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Luxury Cosmetics Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/luxury-cosmetics-hero.jpg"
          alt="Premium luxury cosmetics and perfumes elegantly displayed at Paris Boutique Juba - featuring high-end beauty products, sophisticated packaging, and professional styling representing South Sudan's leading beauty destination"
          fill
          priority={true}
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/70 to-purple-800/80"></div>
      </div>

      {/* Content with Scroll Animation */}
      <div
        className={`relative z-10 text-center text-white px-4 max-w-6xl mx-auto space-y-8 transition-all duration-800 ease-out ${
          heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="space-y-6">
          <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white drop-shadow-2xl">
            Elevate Your Everyday Elegance
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl font-light text-purple-100 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Premium perfume & cosmetic collections in Juba
          </p>

          <div
            className={`w-24 h-1 mx-auto mt-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 transition-all duration-600 ${
              heroVisible ? "scale-x-100" : "scale-x-0"
            }`}
          ></div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
            className="btn-primary min-w-[200px] cursor-pointer backdrop-blur-sm border border-white/20"
            aria-label="Shop premium beauty products at Paris Boutique Juba"
          >
            Shop Now
          </a>

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
            className="btn-secondary min-w-[200px] cursor-pointer backdrop-blur-sm bg-white/95 hover:bg-purple-600 border-white/50 hover:border-purple-600"
            aria-label="Learn more about Paris Boutique Juba's story and services"
          >
            Explore More
          </a>
        </div>
      </div>
    </section>
  )
}
