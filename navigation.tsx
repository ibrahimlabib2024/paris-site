"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingBag } from "lucide-react"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={scrollToTop} className="flex items-center space-x-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/images/eiffel-tower-icon.png"
                  alt="Paris Boutique Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent uppercase">
                  Paris Boutique
                </span>
                <span className="text-xs text-gray-500 hidden sm:block uppercase">Premium Beauty & Cosmetics</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={scrollToTop}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Home
            </button>
            <Link
              href="/products"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Products
            </Link>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("kids-gifts")}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Kids & Gifts
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Contact
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Shop Now Button */}
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Now</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-purple-600 focus:outline-none focus:text-purple-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  scrollToTop()
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md font-medium transition-colors duration-200"
              >
                Home
              </button>
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  scrollToSection("about")
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md font-medium transition-colors duration-200"
              >
                About
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  scrollToSection("kids-gifts")
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md font-medium transition-colors duration-200"
              >
                Kids & Gifts
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  scrollToSection("contact")
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md font-medium transition-colors duration-200"
              >
                Contact
              </button>

              {/* Mobile Shop Now Button */}
              <div className="px-3 py-2 border-t border-gray-200 mt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
